from flask import Flask
from .routes import main

def create_app():
    app = Flask(__name__)
    # Se usares config, descomenta a linha abaixo:
    # app.config.from_object('config.Config')
    
    app.register_blueprint(main)
    return app