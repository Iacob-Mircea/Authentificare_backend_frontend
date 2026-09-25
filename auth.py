from flask_restx import Api,Resource,Namespace,fields,marshal_with
from flask import jsonify
from werkzeug.security import generate_password_hash,check_password_hash
from flask_jwt_extended import create_access_token,create_refresh_token
from models import UserModel, RefreshToken
from flask import request
from flask_jwt_extended import jwt_required,get_jwt_identity


auth_ns = Namespace("auth",description="Authentification ,login method")

registerFields = auth_ns.model(
    "Register",
    {
        "name" : fields.String(),
        "password":fields.String()
    }
    )

loginFields = auth_ns.model(
    "Login",
    {
        "name" : fields.String(),
        "password" : fields.String()
    }
)
uFields = auth_ns.model(
    "Login",
    {
        "id": fields.Integer,
        "name" : fields.String(),
        "password" : fields.String()
    }
)


@auth_ns.route("/users")
class UsersResource(Resource):
    @marshal_with(uFields)
    def get(self):
        users = UserModel.query.all()
        return users

@auth_ns.route("/register")
class RegisterResource(Resource):
   
    @auth_ns.expect(registerFields)
    def post(self):
        """Register"""
        data = request.get_json()
        username = data["name"]
        password = generate_password_hash(data["password"])
        
        user = UserModel.query.filter_by(name=username).first()

        if user is not None:
            return {"message":"user already exists"},400

        new_user = UserModel(name=username,password=password)

        new_user.save()
        return {"message":"Register done"},201
    

@auth_ns.route("/login")
class LoginResource(Resource):
   
    @auth_ns.expect(loginFields)
    def post(self):
        """Login"""
        data = request.get_json()
        username = data["name"]
        password = data["password"]
        
        user = UserModel.query.filter_by(name=username).first()

        if user is None:
            return {"message":"nu exista acest cont"},404

        if user and check_password_hash(user.password,password):
            access_token = create_access_token(identity=str(user.id))
            refresh_token = create_refresh_token(identity=str(user.id))
            
            return {"access token":access_token,"refresh token":refresh_token},200
    
        return {"message":"Incorect password or user"},400  
    
@auth_ns.route("/refresh")
class RefreshResource(Resource):
    @jwt_required(refresh = True)
    def post(self):
        idetity = get_jwt_identity()

        new_acces_token = create_access_token(identity=idetity)

        return {"acces_token" : new_acces_token},200
    

