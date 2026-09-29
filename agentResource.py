from flask_restx import Namespace,Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request

agent = Namespace("Agent",description= "endpointurile agentului")
def current_user_id():
    return int(get_jwt_identity)

agent.route("/agent/")
class AgentResource(Resource):
    jwt_required()
    def post(self):
        
        accessToken = request.headers.get("Authorization")
        message = request.json["message"]

        forAgent = {
            "message" : message,
            "accessToken" : accessToken,
        }