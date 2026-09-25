from exts import db
from datetime import datetime

class UserModel(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer,primary_key = True)
    name = db.Column(db.String(80),unique = True,nullable=False)
    password = db.Column(db.String(300))

    announces = db.relationship("Management", backref="users", lazy=True)
    tasks = db.relationship("TaskModel", backref="users", lazy=True)

    def __repr__(self):
        return f"User id : {self.id} , name : {self.name}"
    
    def save(self):
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self,name,password):
        self.name = name
        self.password = password
        db.session.commit()


class Management(db.Model):
    __tablename__='management'
    id = db.Column(db.Integer,primary_key = True)
    title = db.Column(db.String(100), nullable = False)
    description = db.Column(db.String(100),nullable =False)
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)
    type = db.Column(db.Boolean,default=False)
    tasks = db.relationship("TaskModel", back_populates="management", lazy=True)
    lists = db.relationship("ListManagement", back_populates = 'management')
    

    def __repr__(self):
        return f"Announce {self.title} , from user {self.user_id}"
    
    def save(self):
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, title, description, type=None):
        self.title = title
        self.description = description
        if type is not None:
            self.type = type
        db.session.commit()


    
class TaskModel(db.Model):
    __tablename__='tasks'
    id = db.Column(db.Integer,primary_key=True)
    description = db.Column(db.String(200),nullable = False)
    data = db.Column(db.Date)
    startHour = db.Column(db.DateTime, default=datetime.utcnow,nullable=False)
    endHour = db.Column(db.DateTime,default=datetime.utcnow,nullable=False)
    assign = db.Column(db.Boolean,default = False)

    management_id = db.Column(db.Integer,db.ForeignKey("management.id"),name="id_M")
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False,name="id_U")
    
    management = db.relationship("Management",back_populates='tasks')

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, description, startHour, endHour, data=None, management_id=None, assign=None):
        self.description = description
        self.startHour = startHour
        self.endHour = endHour
        if data is not None:
            self.data = data
        if management_id is not None:
            self.management_id = management_id
        if assign is not None:
            self.assign = assign
        db.session.commit()




class ListManagement(db.Model):
    __tablename__ = "List"

    id = db.Column(db.Integer, primary_key=True)
    id_Management = db.Column(
        db.Integer, db.ForeignKey("management.id"), name="id_M"
    )

    management = db.relationship("Management", back_populates="lists")

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class EventModel(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500))
    start_at = db.Column(db.DateTime, nullable=False)
    end_at = db.Column(db.DateTime, nullable=False)
    category = db.Column(db.String(50), default="meeting")
    color = db.Column(db.String(20), default="#2563eb")
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False
    )

    user = db.relationship("UserModel", backref="events", lazy=True)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(
        self,
        title=None,
        description=None,
        start_at=None,
        end_at=None,
        category=None,
        color=None,
    ):
        if title is not None:
            self.title = title
        if description is not None:
            self.description = description
        if start_at is not None:
            self.start_at = start_at
        if end_at is not None:
            self.end_at = end_at
        if category is not None:
            self.category = category
        if color is not None:
            self.color = color
        db.session.commit()

class RefreshToken(db.Model):
    __tablename__ = "refresh"
    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False,name="id_U",primary_key = True)
    acces = db.Column(db.String(200),nullable = False)
    refresh = db.Column(db.String(200),nullable = False)
    valid = db.Column(db.Boolean)

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self,valid,acces = None,refresh = None,):
        if acces is not None:
            self.acces = acces
        if refresh is not None:
            self.refresh = refresh
        if valid != self.valid:
            self.valid = valid
        db.session.commit()

