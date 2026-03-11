from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import reqparse,Api,abort,marshal_with,fields,Resource

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///datebase.db'
db = SQLAlchemy(app)
api = Api(app)
with app.app_context():
    db.create_all()

class UserModel(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    name = db.Column(db.String(80))
    password = db.Column(db.String(80))
    def __repr__(self):
        return f"User id : {self.id} , name : {self.name}"
    
user_args = reqparse.RequestParser()
user_args.add_argument("name",type = str,required = True,help = "cannot be blank")
user_args.add_argument("password",type = str,required = True,help = "cannot be blank")

@app.route("/",method = "POST")
def log_in():
    data = request.json
    username = data["name"]
    password = data[password]
        

def main():
    print("Hello from login-flask!")


if __name__ == "__main__":
    app.run(debug=True)
