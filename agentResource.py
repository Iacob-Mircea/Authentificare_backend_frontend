from flask_restx import Namespace,Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from agent.agent import run_agent

agent_ns = Namespace("agent",description= "endpointurile agentului")
def current_user_id():
    return get_jwt_identity

@agent_ns.route("/agent")
class AgentResource(Resource):
    jwt_required()
    def post(self):
        data = request.get_json()
        accessToken = request.headers.get("Authorization")
        user_id = current_user_id()
        message = request.json["message"]
    
        result = run_agent(message)
        return result,200

