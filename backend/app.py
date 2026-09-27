"""
GrowthSphere Media — Contact Form Backend
------------------------------------------
A small Flask API that receives contact form submissions from the
portfolio website and stores them in a local SQLite database, so
nothing depends on the visitor's email client.

Run locally:
    pip install -r requirements.txt
    python app.py

Then it listens on http://localhost:5000
POST to /api/contact with JSON: { name, email, brand, service, budget, details }

Deploy for free on Render.com or Railway.app (both support Python +
persistent storage on their free tiers).
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # allows the frontend (on a different domain) to call this API

DB_PATH = os.path.join(os.path.dirname(__file__), "submissions.db")


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            brand TEXT,
            service TEXT,
            budget TEXT,
            details TEXT,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()

    if not name or not email:
        return jsonify({"ok": False, "error": "Name and email are required."}), 400

    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT INTO submissions (name, email, brand, service, budget, details, created_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?)",
        (
            name,
            email,
            (data.get("brand") or "").strip(),
            (data.get("service") or "").strip(),
            (data.get("budget") or "").strip(),
            (data.get("details") or "").strip(),
            datetime.utcnow().isoformat(),
        ),
    )
    conn.commit()
    conn.close()

    return jsonify({"ok": True, "message": "Submission received."})


@app.route("/api/submissions", methods=["GET"])
def list_submissions():
    """
    Simple endpoint to view saved submissions.
    In production, put this behind a login/password before deploying publicly —
    right now anyone with the URL could view it.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM submissions ORDER BY created_at DESC").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"ok": True})


if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
