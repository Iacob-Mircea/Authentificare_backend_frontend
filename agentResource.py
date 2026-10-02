from flask_restx import Namespace,Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from agent.agent import run_agent
from models import Conversation, Messages
from datetime import datetime

agent_ns = Namespace("agent",description= "endpointurile agentului")
def current_user_id():
    return get_jwt_identity

@agent_ns.route("/agent")
class AgentResource(Resource):
    @jwt_required()
    def post(self):

        message = request.json["message"]
        conversation = request.json["convers"]
        user_id = get_jwt_identity()


        if conversation == None:
            conv = Conversation(user_id = user_id,created_at =datetime.now())
            conv.save()

            result = run_agent(message,None)
            conversation = conv.id
            
        else:

            query = Messages.query.filter_by(conversation_id = conversation).all()

            context: list[str] = []
            print(query)
            for con in query:
                
                context.append(con.message)
                print(context)

            result = run_agent(message,context)
        mess_user = Messages(message = message,conversation_id = conversation,created_at = datetime.now())
        mess_user.save()
        mess = Messages(message = result["response"],conversation_id = conversation,created_at = datetime.now())
        print(result["calendar_change"])
        mess.save()
        return {"result":result,"conversation":conversation},200
 
