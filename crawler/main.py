from flask import Flask
from flask_restx import Api, Resource
from crawler.crawl import find_jobs, get_jobs
import psycopg

app = Flask(__name__)
api = Api(app)
db = psycopg.connect(host='localhost', dbname='elastics', user='postgres', password='asdf', port='5432')


@api.route('/<string:name>')
class findJob(Resource):
    @staticmethod
    def get(name):
        jobs_final = find_jobs(name) + get_jobs(name)
        db.save(jobs_final)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=80)