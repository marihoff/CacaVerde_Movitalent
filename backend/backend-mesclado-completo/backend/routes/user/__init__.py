# routes/user/__init__.py

from flask import Blueprint, request, jsonify, g
from repositories import (
    verificar_admin,
    get_usuario_atual,
    adicionar_pontos,
    remover_pontos,
    banir_usuario,
    desbanir_usuario,
)

user_bp = Blueprint('user', __name__, url_prefix='/user')

@user_bp.route('/pontos/adicionar/<int:usuario_id>', methods=['POST'])
def adicionar_pontos_route(usuario_id):
    data = request.get_json()
    quantidade = data.get('quantidade')
    motivo = data.get('motivo', '')

    try:
        admin = verificar_admin(g.db)
        if not admin:
            return jsonify({"error": "Acesso negado - apenas admins"}), 403

        adicionar_pontos(usuario_id, quantidade, motivo, admin.id, g.db)
        return jsonify({"message": "Pontos adicionados"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@user_bp.route('/pontos/remover/<int:usuario_id>', methods=['POST'])
def remover_pontos_route(usuario_id):
    data = request.get_json()
    quantidade = data.get('quantidade')
    motivo = data.get('motivo', '')

    try:
        admin = verificar_admin(g.db)
        if not admin:
            return jsonify({"error": "Acesso negado - apenas admins"}), 403

        remover_pontos(usuario_id, quantidade, motivo, admin.id, g.db)
        return jsonify({"message": "Pontos removidos"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@user_bp.route('/banir/<int:usuario_id>', methods=['POST'])
def banir_route(usuario_id):
    data = request.get_json()
    motivo = data.get('motivo', '')

    try:
        admin = verificar_admin(g.db)
        if not admin:
            return jsonify({"error": "Acesso negado - apenas admins"}), 403

        banir_usuario(usuario_id, motivo, admin.id, g.db)
        return jsonify({"message": "Usuário banido"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@user_bp.route('/desbanir/<int:usuario_id>', methods=['POST'])
def desbanir_route(usuario_id):
    try:
        admin = verificar_admin(g.db)
        if not admin:
            return jsonify({"error": "Acesso negado - apenas admins"}), 403

        desbanir_usuario(usuario_id, admin.id, g.db)
        return jsonify({"message": "Usuário desbanido"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
