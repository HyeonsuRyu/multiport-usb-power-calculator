import json
from flask import Blueprint, render_template, request

bp = Blueprint('main', __name__, url_prefix='/')

with open("src/data/data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

@bp.route('/')
def index():
    brands = [brand["name"] for brand in data["brands"]]
    models = []
    total_outputs = []
    c_counts = []
    a_counts = []

    for b in data["brands"]:
        for m in b["models"]:
            models.append(m["model"])
            total_outputs.append(m["total_output_watts"])
            c_counts.append(sum(1 for p, spec in m["ports"].items() if spec["type"] == "USB-C"))
            a_counts.append(sum(1 for p, spec in m["ports"].items() if spec["type"] == "USB-A"))

    return render_template(
        "search.html",
        brands=brands,
        min_watts=min(total_outputs),
        max_watts=max(total_outputs),
        min_c=min(c_counts),
        max_c=max(c_counts),
        min_a=min(a_counts),
        max_a=max(a_counts),
    )


@bp.route("/search")
def search():
    brand = request.args.get("brand")
    model_query = request.args.get("model")

    min_watts = int(request.args.get("min_watts", 0))
    max_watts = int(request.args.get("max_watts", 9999))
    min_c = int(request.args.get("min_c", 0))
    max_c = int(request.args.get("max_c", 99))
    min_a = int(request.args.get("min_a", 0))
    max_a = int(request.args.get("max_a", 99))

    results = []
    for b in data["brands"]:
        if brand and b["name"].lower() != brand.lower():
            continue
        for m in b["models"]:
            if model_query and model_query.lower() not in m["model"].lower():
                continue

            c_count = sum(1 for p, spec in m["ports"].items() if spec["type"] == "USB-C")
            a_count = sum(1 for p, spec in m["ports"].items() if spec["type"] == "USB-A")

            if not (min_watts <= m["total_output_watts"] <= max_watts):
                continue
            if not (min_c <= c_count <= max_c):
                continue
            if not (min_a <= a_count <= max_a):
                continue

            results.append({
                "brand": b["name"],
                "model": m["model"],
                "watts": m["total_output_watts"],
                "c_ports": c_count,
                "a_ports": a_count
            })

    return render_template("results.html", results=results)