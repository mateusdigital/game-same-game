from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


POSTGRES = {
    'user': 'postgres',
    'pw':   'docker',
    'db':   'same_game',
    'host': 'localhost',
    'port': '5432',
}
conn_str = 'postgresql://%(user)s:%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES

app.config['DEBUG'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = conn_str

db = SQLAlchemy()
db.init_app(app)
migrate = Migrate(app, db)


class Leaderboard(db.Model):
    __tablename__ = "leaderboard";
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    score = db.Column(db.Integer, nullable=False)



_leaderboard_data = [
    {"name": "mateus", "score": 10}

]
def get_leaderboards():
    return _leaderboard_data

def insert_leaderboard_entry(data):
    name = data.get("name", "");
    score = data.get("score", "");

    _leaderboard_data.append({
        "name": name,
        "score": int(score)
    })


@app.route("/leaderboards", methods=["GET", "POST"])
def hello():
    if request.method == "GET":
        entries = Leaderboard.query.order_by(Leaderboard.score.desc()).all()
        results = [{
            "name":  entry.name,
            "score": entry.score,
        } for entry in entries]
        return jsonify(results)
    elif request.method == "POST":
        data = request.get_json(force=True);
        try:
            entry = Leaderboard(**data)
            db.session.add(entry)
            db.session.commit()

            return jsonify({"success": True})
        except Exception as err:
            return jsonify({"success": False})




if __name__ == "__main__":
    app.run(host='0.0.0.0')
