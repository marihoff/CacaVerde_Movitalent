from flask import Flask, g
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from models import Base
from flask_jwt_extended import JWTManager
import os

app = Flask(__name__)

# ========== CONFIGURAÇÕES ==========
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "sua-chave-secreta-muito-longa-e-segura")
app.config["UPLOAD_DIR"] = os.getenv("UPLOAD_DIR", "uploads")

# CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# JWT
jwt = JWTManager(app)

# Banco de dados
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/dbname")
engine = create_engine(DATABASE_URL)
SessionFactory = sessionmaker(bind=engine)
Session = scoped_session(SessionFactory)

# Criar tabelas (descomente se quiser criar automaticamente)
# Base.metadata.create_all(engine)

# ========== MIDDLEWARE ==========

@app.before_request
def before_request():
    g.db = Session()

@app.teardown_request
def teardown_request(exception=None):
    db = g.pop('db', None)
    if db is not None:
        if exception:
            db.rollback()
        else:
            db.commit()
        db.close()
        Session.remove()

# ========== REGISTRAR BLUEPRINTS ==========

from routes.user import user_bp
from routes.items import items_bp  # ← NOVO

app.register_blueprint(user_bp)
app.register_blueprint(items_bp)  # ← NOVO

# ========== HEALTH CHECK ==========

@app.route('/health', methods=['GET'])
def health():
    return {"status": "ok"}, 200

# ========== RUN ==========

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
