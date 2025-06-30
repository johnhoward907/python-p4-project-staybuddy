from app import app
from app import create_app
from app.routes.auth_routes import auth_bp
from app.routes.stay_routes import stay_bp
from app.routes.booking_routes import booking_bp
from app.routes.review_routes import review_bp
from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = create_app()

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'


app.register_blueprint(auth_bp)
app.register_blueprint(stay_bp)
app.register_blueprint(booking_bp)
app.register_blueprint(review_bp)

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/')
def home():
    return "Hello, Flask!"