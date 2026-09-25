from flask import Flask,request,jsonify
from flask_restx import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from exts import db,migrate
from taskmanagements import task_ns
from auth import auth_ns
from config import DevConfig
from listManagement import listM_ns
from flask_migrate import Migrate
from homepage import land
from calendar_api import calendar_ns
from models import UserModel,Management,EventModel

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevConfig)
    db.init_app(app)
    api = Api(app,doc='/docs')
    
    migrate.init_app(app,db)
    JWTManager(app)
    CORS(app,origins=["http://192.168.56.1:3000"])
    
    api.add_namespace(land)
    api.add_namespace(task_ns)
    api.add_namespace(auth_ns)
    api.add_namespace(listM_ns)
    api.add_namespace(calendar_ns)
    @app.shell_context_processor
    def make_shell_context():
        return {
            "db":db,
            "Announces":Management,
            "User":UserModel,
            "Event":EventModel
        }
    return app














