from flask_jwt_extended import JWTManager
from datetime import datetime
import enum

from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    Numeric,
    Enum,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class StatusUsuario(str, enum.Enum):
    ativo = "ativo"
    banido = "banido"

class PapelUsuario(str, enum.Enum):
    admin = "admin"
    usuario = "usuario"

class StatusItem(str, enum.Enum):
    disponivel = "disponivel"
    coletado = "coletado"
    nao_encontrado = "nao_encontrado"
    removido = "removido"

class TipoRelato(str, enum.Enum):
    nao_encontrado = "nao_encontrado"
    inapropriado = "inapropriado"
    spam = "spam"
    outro = "outro"

class StatusRelato(str, enum.Enum):
    aberto = "aberto"
    resolvido = "resolvido"
    descartado = "descartado"

class MotivoTransacao(str, enum.Enum):
    coleta = "coleta"
    adicao_admin = "adicao_admin"
    remocao_admin = "remocao_admin"
    resgate = "resgate"
    penalidade = "penalidade"

class StatusResgate(str, enum.Enum):
    pendente = "pendente"
    aprovado = "aprovado"
    entregue = "entregue"

class Usuario(Base):
    __tablename__ = "usuario"
    __table_args__ = (
        CheckConstraint('pontos_atuais >= 0', name='check_pontos_atuais'),
        Index('ix_usuario_nome_usuario', 'nome_usuario'),
        Index('ix_usuario_email', 'email'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome_usuario = Column(String(50), unique=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    apelido = Column(String(50))
    email = Column(String(100), unique=True, nullable=False)
    status = Column(Enum(StatusUsuario), default=StatusUsuario.ativo)
    papel = Column(Enum(PapelUsuario), default=PapelUsuario.usuario)
    pontos_atuais = Column(Integer, default=0)
    url_imagem_perfil = Column(String(255))
    criado_em = Column(DateTime, server_default=func.now())

    # Relacionamentos
    itens_criados = relationship("Item", back_populates="dono")
    itens_coletados_direto = relationship("Item", back_populates="coletor", foreign_keys="Item.coletado_por_id")
    itens_reportados_nao_encontrados = relationship("Item", back_populates="nao_encontrado_relator", foreign_keys="Item.relatado_nao_encontrado_por_id")
    itens_coletados = relationship("Coleta", back_populates="coletor")
    resgates = relationship("ResgateRecompensa", back_populates="usuario")
    relatos_enviados = relationship("Relato", back_populates="relator")
    relatos_recebidos = relationship("Relato", back_populates="relatado", foreign_keys="Relato.relatado_id")
    relatos_resolvidos = relationship("Relato", back_populates="admin_resolvedor", foreign_keys="Relato.resolvido_por_admin_id")
    recompensas_criadas = relationship("Recompensa", back_populates="admin")
    transacoes = relationship("TransacaoPonto", back_populates="usuario")
    logs_admin = relationship("LogAdmin", back_populates="admin")

    def __repr__(self):
        return f"<Usuario(id={self.id}, nome_usuario='{self.nome_usuario}')>"

class Item(Base):
    __tablename__ = "item"
    __table_args__ = (
        Index('ix_item_dono_id', 'dono_id'),
        Index('ix_item_location', 'latitude', 'longitude'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    dono_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    titulo = Column(String(100), nullable=False)
    descricao = Column(Text)
    
    # ========== NOVOS CAMPOS (da mesclagem) ==========
    categoria = Column(String(100), nullable=True)
    subcategoria = Column(String(100), nullable=True)
    endereco = Column(String(255), nullable=True)
    cep = Column(String(10), nullable=True)
    referencia = Column(String(255), nullable=True)
    condicao = Column(String(50), nullable=True)
    instrucoes = Column(Text, nullable=True)
    retirada_json = Column(JSONB, nullable=True)
    # ==================================================
    
    url_imagem = Column(String(255), nullable=True)  # Mantido para compatibilidade
    latitude = Column(Numeric(9, 6), nullable=True)  # Mudado para nullable
    longitude = Column(Numeric(9, 6), nullable=True)  # Mudado para nullable
    status = Column(Enum(StatusItem), default=StatusItem.disponivel)
    criado_em = Column(DateTime, server_default=func.now())
    coletado_em = Column(DateTime, nullable=True)
    coletado_por_id = Column(Integer, ForeignKey("usuario.id"), nullable=True)
    relatado_nao_encontrado_por_id = Column(Integer, ForeignKey("usuario.id"), nullable=True)

    # Relacionamentos
    dono = relationship("Usuario", back_populates="itens_criados", foreign_keys=[dono_id])
    coletor = relationship("Usuario", back_populates="itens_coletados_direto", foreign_keys=[coletado_por_id])
    nao_encontrado_relator = relationship("Usuario", back_populates="itens_reportados_nao_encontrados", foreign_keys=[relatado_nao_encontrado_por_id])
    coletas = relationship("Coleta", back_populates="item")
    relatos = relationship("Relato", back_populates="item")
    fotos = relationship("ItemFoto", back_populates="item", cascade="all, delete-orphan")  # ← NOVO

    def __repr__(self):
        return f"<Item(id={self.id}, titulo='{self.titulo}')>"

# ========== NOVO MODELO: ItemFoto ==========
class ItemFoto(Base):
    __tablename__ = "item_foto"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    item_id = Column(Integer, ForeignKey("item.id"), nullable=False)
    url = Column(String(500), nullable=False)
    criado_em = Column(DateTime, server_default=func.now())
    
    # Relacionamento
    item = relationship("Item", back_populates="fotos")
    
    def __repr__(self):
        return f"<ItemFoto(id={self.id}, item_id={self.item_id})>"
# ==========================================

class Coleta(Base):
    __tablename__ = "coleta"
    __table_args__ = (
        Index('ix_coleta_item_id', 'item_id'),
        Index('ix_coleta_coletor_id', 'coletor_id'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    item_id = Column(Integer, ForeignKey("item.id"), nullable=False)
    coletor_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    coletado_em = Column(DateTime, server_default=func.now())
    pontos_concedidos = Column(Integer, nullable=False)

    # Relacionamentos
    item = relationship("Item", back_populates="coletas")
    coletor = relationship("Usuario", back_populates="itens_coletados")

    def __repr__(self):
        return f"<Coleta(id={self.id})>"

class Recompensa(Base):
    __tablename__ = "recompensa"
    __table_args__ = (
        Index('ix_recompensa_criado_por_admin_id', 'criado_por_admin_id'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    titulo = Column(String(100), nullable=False)
    descricao = Column(Text)
    custo_pontos = Column(Integer, nullable=False)
    quantidade_disponivel = Column(Integer, nullable=False)
    url_imagem = Column(String(255))
    criado_por_admin_id = Column(Integer, ForeignKey("usuario.id"))

    # Relacionamentos
    admin = relationship("Usuario", back_populates="recompensas_criadas")
    resgates = relationship("ResgateRecompensa", back_populates="recompensa")

    def __repr__(self):
        return f"<Recompensa(id={self.id}, titulo='{self.titulo}')>"

class ResgateRecompensa(Base):
    __tablename__ = "resgate_recompensa"
    __table_args__ = (
        Index('ix_resgate_recompensa_usuario_id', 'usuario_id'),
        Index('ix_resgate_recompensa_recompensa_id', 'recompensa_id'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    recompensa_id = Column(Integer, ForeignKey("recompensa.id"), nullable=False)
    resgatado_em = Column(DateTime, server_default=func.now())
    status = Column(Enum(StatusResgate), default=StatusResgate.pendente)

    # Relacionamentos
    usuario = relationship("Usuario", back_populates="resgates")
    recompensa = relationship("Recompensa", back_populates="resgates")

    def __repr__(self):
        return f"<ResgateRecompensa(id={self.id})>"

class Relato(Base):
    __tablename__ = "relato"
    __table_args__ = (
        Index('ix_relato_relator_id', 'relator_id'),
        Index('ix_relato_item_id', 'item_id'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    relator_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    relatado_id = Column(Integer, ForeignKey("usuario.id"), nullable=True)
    item_id = Column(Integer, ForeignKey("item.id"), nullable=True)
    tipo = Column(Enum(TipoRelato), nullable=False)
    descricao = Column(Text, nullable=False)
    status = Column(Enum(StatusRelato), default=StatusRelato.aberto)
    resolvido_por_admin_id = Column(Integer, ForeignKey("usuario.id"), nullable=True)
    notas_resolucao = Column(Text)
    criado_em = Column(DateTime, server_default=func.now())

    # Relacionamentos
    relator = relationship("Usuario", back_populates="relatos_enviados", foreign_keys=[relator_id])
    relatado = relationship("Usuario", back_populates="relatos_recebidos", foreign_keys=[relatado_id])
    admin_resolvedor = relationship("Usuario", back_populates="relatos_resolvidos", foreign_keys=[resolvido_por_admin_id])
    item = relationship("Item", back_populates="relatos")

    def __repr__(self):
        return f"<Relato(id={self.id})>"

class TransacaoPonto(Base):
    __tablename__ = "transacao_ponto"
    __table_args__ = (
        Index('ix_transacao_ponto_usuario_id', 'usuario_id'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    quantidade = Column(Integer, nullable=False)
    motivo = Column(Enum(MotivoTransacao), nullable=False)
    relacionado_id = Column(Integer, nullable=True)
    criado_em = Column(DateTime, server_default=func.now())

    # Relacionamentos
    usuario = relationship("Usuario", back_populates="transacoes")

    def __repr__(self):
        return f"<TransacaoPonto(id={self.id})>"

class LogAdmin(Base):
    __tablename__ = "log_admin"
    __table_args__ = (
        Index('ix_log_admin_admin_id', 'admin_id'),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    acao = Column(Text, nullable=False)
    detalhes = Column(JSONB)
    criado_em = Column(DateTime, server_default=func.now())

    # Relacionamentos
    admin = relationship("Usuario", back_populates="logs_admin")

    def __repr__(self):
        return f"<LogAdmin(id={self.id})>"
