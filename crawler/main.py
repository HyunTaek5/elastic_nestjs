from flask import Flask
from flask_restx import Api, Resource

app = Flask(__name__)
api = Api(app)


if __name__ == "__main__":가
    app.run(debug=True, host='0.0.0.0', port=80)