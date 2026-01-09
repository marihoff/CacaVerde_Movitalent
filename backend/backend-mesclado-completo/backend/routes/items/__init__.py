# routes/items/__init__.py

import os
import uuid
import base64
from pathlib import Path
from flask import Blueprint, request, jsonify, g, send_from_directory, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Item, ItemFoto, Usuario

items_bp = Blueprint('items', __name__, url_prefix='/api/items')

# ========== HELPER FUNCTIONS ==========

def _save_dataurl_image(data_url: str, upload_dir: str) -> str:
    """
    Salva uma imagem em formato dataURL (base64) e retorna a URL pública.
    """
    if not data_url.startswith("data:") or ";base64," not in data_url:
        raise ValueError("Imagem inválida (formato dataURL esperado)")
    
    header, b64 = data_url.split(";base64,", 1)
    mime = header.split(":", 1)[1].strip().lower()
    
    # Determinar extensão
    ext = "jpg"
    if "png" in mime:
        ext = "png"
    elif "webp" in mime:
        ext = "webp"
    elif "jpeg" in mime or "jpg" in mime:
        ext = "jpg"
    
    # Decodificar e salvar
    raw = base64.b64decode(b64)
    fname = f"{uuid.uuid4().hex}.{ext}"
    fpath = Path(upload_dir) / fname
    fpath.write_bytes(raw)
    
    # Retornar URL pública
    return f"/api/uploads/{fname}"


def _item_to_json(item: Item):
    """
    Converte um Item para JSON incluindo fotos.
    """
    return {
        "id": item.id,
        "titulo": item.titulo,
        "descricao": item.descricao,
        "categoria": item.categoria,
        "subcategoria": item.subcategoria,
        "endereco": item.endereco,
        "latitude": str(item.latitude) if item.latitude else None,
        "longitude": str(item.longitude) if item.longitude else None,
        "cep": item.cep,
        "referencia": item.referencia,
        "condicao": item.condicao,
        "instrucoes": item.instrucoes,
        "retirada": item.retirada_json,
        "status": item.status.value if item.status else None,
        "criado_por": item.dono_id,
        "criado_em": item.criado_em.isoformat() if item.criado_em else None,
        "fotos": [{"id": f.id, "url": f.url} for f in item.fotos],
    }


# ========== ROUTES ==========

@items_bp.route('/', methods=['POST'])
@jwt_required()
def create_item():
    """
    Criar um novo item com múltiplas fotos (base64).
    
    Body:
    {
        "titulo": "...",
        "descricao": "...",
        "categoria": "...",
        "subcategoria": "...",
        "endereco": "...",
        "latitude": "...",
        "longitude": "...",
        "cep": "...",
        "referencia": "...",
        "condicao": "...",
        "instrucoes": "...",
        "retirada": {...},
        "fotosBase64": ["data:image/jpeg;base64,...", ...]
    }
    """
    usuario_id = get_jwt_identity()
    data = request.get_json(force=True) or {}
    
    titulo = (data.get("titulo") or "").strip()
    descricao = (data.get("descricao") or "").strip()
    categoria = (data.get("categoria") or "").strip()
    
    if not titulo or not descricao or not categoria:
        return jsonify({"error": "titulo, descricao e categoria são obrigatórios"}), 400
    
    fotos = data.get("fotosBase64") or []
    if not isinstance(fotos, list) or len(fotos) == 0:
        return jsonify({"error": "Adicione pelo menos uma foto"}), 400
    if len(fotos) > 6:
        return jsonify({"error": "Limite de 6 fotos"}), 400
    
    # Criar item
    item = Item(
        titulo=titulo,
        descricao=descricao,
        categoria=categoria,
        subcategoria=data.get("subcategoria"),
        endereco=data.get("endereco"),
        latitude=data.get("latitude"),
        longitude=data.get("longitude"),
        cep=data.get("cep"),
        referencia=data.get("referencia"),
        condicao=data.get("condicao"),
        instrucoes=data.get("instrucoes"),
        retirada_json=data.get("retirada"),
        dono_id=usuario_id,
    )
    g.db.add(item)
    g.db.flush()  # Para obter item.id
    
    # Salvar fotos
    upload_dir = current_app.config.get("UPLOAD_DIR", "uploads")
    Path(upload_dir).mkdir(parents=True, exist_ok=True)
    
    try:
        for foto_base64 in fotos:
            url = _save_dataurl_image(foto_base64, upload_dir)
            foto = ItemFoto(item_id=item.id, url=url)
            g.db.add(foto)
        
        g.db.commit()
        return jsonify({"item": _item_to_json(item)}), 201
    
    except Exception as e:
        g.db.rollback()
        return jsonify({"error": f"Erro ao salvar fotos: {str(e)}"}), 500


@items_bp.route('/', methods=['GET'])
def list_items():
    """
    Listar itens (pode filtrar por status).
    
    Query params:
    - status: disponivel, coletado, etc.
    """
    status = request.args.get("status")
    q = g.db.query(Item)
    
    if status:
        q = q.filter(Item.status == status)
    
    items = q.order_by(Item.criado_em.desc()).limit(200).all()
    return jsonify({"items": [_item_to_json(i) for i in items]})


@items_bp.route('/me', methods=['GET'])
@jwt_required()
def my_items():
    """
    Listar itens do usuário logado.
    """
    usuario_id = get_jwt_identity()
    items = g.db.query(Item).filter(Item.dono_id == usuario_id).order_by(Item.criado_em.desc()).all()
    return jsonify({"items": [_item_to_json(i) for i in items]})


@items_bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_item(item_id: int):
    """
    Deletar um item (apenas o dono pode deletar).
    """
    usuario_id = get_jwt_identity()
    item = g.db.query(Item).filter(Item.id == item_id).first()
    
    if not item:
        return jsonify({"error": "Item não encontrado"}), 404
    
    if item.dono_id != usuario_id:
        return jsonify({"error": "Sem permissão"}), 403
    
    g.db.delete(item)
    g.db.commit()
    return jsonify({"message": "Item deletado com sucesso"}), 200


# ========== SERVIR UPLOADS ==========

@items_bp.route('/uploads/<path:filename>', methods=['GET'])
def serve_upload(filename):
    """
    Servir arquivos da pasta uploads.
    """
    upload_dir = current_app.config.get("UPLOAD_DIR", "uploads")
    return send_from_directory(upload_dir, filename)
