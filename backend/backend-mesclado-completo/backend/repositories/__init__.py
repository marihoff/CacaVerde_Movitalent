# repositories/__init__.py

from flask_jwt_extended import decode_token, get_jwt_identity
from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound
from models import Usuario, TransacaoPonto, LogAdmin, StatusUsuario, MotivoTransacao, PapelUsuario
from datetime import datetime


def get_usuario_atual(db: Session) -> Usuario | None:
    """
    Retorna o objeto Usuario logado via JWT, ou None se inválido/inexistente.
    """
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return None
        return db.query(Usuario).filter(Usuario.id == user_id).one_or_none()
    except Exception:
        return None

def verificar_admin(db: Session) -> Usuario | None:
    """
    Retorna o objeto Usuario se for admin, senão None.
    """
    usuario = get_usuario_atual(db)
    if usuario and usuario.papel == PapelUsuario.admin:
        return usuario
    return None

def adicionar_pontos(usuario_id: int, quantidade: int, motivo: str, admin_id: int, db: Session) -> None:
    if quantidade <= 0:
        raise ValueError("Quantidade deve ser positiva")
    user = db.query(Usuario).filter(Usuario.id == usuario_id).one()
    user.pontos_atuais += quantidade
    transacao = TransacaoPonto(
        usuario_id=usuario_id,
        quantidade=quantidade,
        motivo=MotivoTransacao.adicao_admin,
        relacionado_id=None,
        criado_em=datetime.utcnow()
    )
    db.add(transacao)
    log = LogAdmin(
        admin_id=admin_id,
        acao="adicionar_pontos",
        detalhes={"usuario_id": usuario_id, "quantidade": quantidade, "motivo": motivo},
        criado_em=datetime.utcnow()
    )
    db.add(log)
    db.commit()

def remover_pontos(usuario_id: int, quantidade: int, motivo: str, admin_id: int, db: Session) -> None:
    if quantidade <= 0:
        raise ValueError("Quantidade deve ser positiva")
    user = db.query(Usuario).filter(Usuario.id == usuario_id).one()
    if user.pontos_atuais < quantidade:
        raise ValueError("Pontos insuficientes")
    user.pontos_atuais -= quantidade
    transacao = TransacaoPonto(
        usuario_id=usuario_id,
        quantidade=-quantidade,
        motivo=MotivoTransacao.remocao_admin,
        relacionado_id=None,
        criado_em=datetime.utcnow()
    )
    db.add(transacao)
    log = LogAdmin(
        admin_id=admin_id,
        acao="remover_pontos",
        detalhes={"usuario_id": usuario_id, "quantidade": quantidade, "motivo": motivo},
        criado_em=datetime.utcnow()
    )
    db.add(log)
    db.commit()

def banir_usuario(usuario_id: int, motivo: str, admin_id: int, db: Session) -> None:
    user = db.query(Usuario).filter(Usuario.id == usuario_id).one()
    user.status = StatusUsuario.banido
    log = LogAdmin(
        admin_id=admin_id,
        acao="banir_usuario",
        detalhes={"usuario_id": usuario_id, "motivo": motivo},
        criado_em=datetime.utcnow()
    )
    db.add(log)
    db.commit()

def desbanir_usuario(usuario_id: int, admin_id: int, db: Session) -> None:
    user = db.query(Usuario).filter(Usuario.id == usuario_id).one()
    user.status = StatusUsuario.ativo
    log = LogAdmin(
        admin_id=admin_id,
        acao="desbanir_usuario",
        detalhes={"usuario_id": usuario_id},
        criado_em=datetime.utcnow()
    )
    db.add(log)
    db.commit()
