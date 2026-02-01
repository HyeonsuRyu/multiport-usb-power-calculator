import json
from flask import Blueprint, render_template, request

bp = Blueprint('main', __name__, url_prefix='/')

with open("src/data/data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

@bp.route('/')
def index():
    brands = [brand["name"] for brand in data["brands"]]
    models = []
    for b in data["brands"]:
        for m in b["models"]:
            models.append(m["model"])
    return render_template('search.html', brands=brands, models=models)

@bp.route("/search")
def search():
    brand = request.args.get("brand")
    model_query = request.args.get("model")
    min_watts = int(request.args.get("min_watts", 0))
    max_watts = int(request.args.get("max_watts", 9999))

    results = []
    for b in data["brands"]:
        if brand and b["name"].lower() != brand.lower():
            continue
        for m in b["models"]:
            if model_query and model_query.lower() not in m["model"].lower():
                continue
            if not (min_watts <= m["total_output_watts"] <= max_watts):
                continue
            results.append({"brand": b["name"], "model": m["model"], "watts": m["total_output_watts"]})

    return render_template("results.html", results=results)
