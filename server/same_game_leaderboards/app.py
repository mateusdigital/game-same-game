from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import werkzeug.exceptions;

app = Flask(__name__)
CORS(app)

POSTGRES = {
    'user': 'stdmatt',
    'pw':   '',
    'db':   'same_game',
    'host': 'localhost',
    'port': '5432',
}
conn_str = 'postgresql://%(user)s%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES
print(conn_str);

app.config['DEBUG'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = conn_str

db = SQLAlchemy()
db.init_app(app);

class Leaderboard(db.Model):
    __tablename__ = "leaderboard";
    id    = db.Column(db.Integer,    primary_key=True)
    name  = db.Column(db.String(20), nullable=False)
    score = db.Column(db.Integer,    nullable=False)


def _get_leaderboards():
    ## @TODO(stdmatt): Add limits...
    entries = Leaderboard.query.order_by(Leaderboard.score.desc()).all()
    results = [{
        "name":  entry.name,
        "score": entry.score,
    } for entry in entries];

    return results;


def _insert_leaderboard_entry(data):
    name  = data.get("name",  None);
    score = data.get("score", None);

    if(name is None or len(name) == 0):
        return False;
    if(score is None or not isinstance(score, int)):
        return False;

    clean_data = {
        "name":  name,
        "score": score
    }

    entry = Leaderboard(**data)
    db.session.add(entry)
    db.session.commit()

    return True;


@app.route("/leaderboards", methods=["GET", "POST"])
def hello():
    db.create_all();
    if request.method == "GET":
        results = _get_leaderboards();
        return jsonify(results);

    elif request.method == "POST":
        result = { "success": False };

        try:
            data = request.get_json(force=True);
            result["success"] = _insert_leaderboard_entry(data);
        except werkzeug.exceptions.BadRequest as err:
            ## @TODO(stdmatt): Log...
            result["error_msg"] = "Missing request body.";
        except Exception as err:
            print(str(err));
            raise err;
        finally:
            return jsonify(result);

if __name__ == "__main__":
    app.run(host='0.0.0.0')
