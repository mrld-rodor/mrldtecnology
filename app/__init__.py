from flask import Flask
from .routes import main
from .form import orcamento_bp

def create_app():
    app = Flask(__name__, template_folder='../templates', static_folder='../static')
    app.secret_key = "uma-chave-secreta-muito-segura"
    
    app.register_blueprint(main)
    app.register_blueprint(orcamento_bp)  # <-- ESSENCIAL
    
    return app