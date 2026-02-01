import os
from dotenv import load_dotenv
from flask import Flask

load_dotenv()

def create_app():
    app = Flask(__name__, static_url_path=os.getenv("APP_PATH", "/") + 'static')

    from .views import main_views
    app.register_blueprint(main_views.bp, url_prefix=os.getenv("APP_PATH", "/"))

    return app

app = create_app()