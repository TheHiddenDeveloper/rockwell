# app.py
from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
DB_PATH = "db.sqlite3"


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status": "online"}), 200


@app.route("/events", methods=["POST"])
def receive_event():
    data = request.get_json()
    truck = data.get("truck")
    event = data.get("event")
    timestamp = data.get("timestamp")

    if not all([truck, event, timestamp]):
        return jsonify({"error": "Missing fields"}), 400

    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute("""
            INSERT INTO events (truck, event, timestamp, synced, alert)
            VALUES (?, ?, ?, 1, 0)
        """, (truck, event, timestamp))
        conn.commit()
        event_id = c.lastrowid
        conn.close()
        return jsonify({"status": "success", "id": event_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/all", methods=["GET"])
def get_all():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM events")
    rows = c.fetchall()
    conn.close()
    events = [dict(row) for row in rows]
    return jsonify(events), 200


@app.route("/unsynced", methods=["GET"])
def get_unsynced():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM events WHERE synced = 0")
    rows = c.fetchall()
    conn.close()
    events = [dict(row) for row in rows]
    return jsonify(events), 200


@app.route("/alerts", methods=["GET"])
def get_alerts():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM events WHERE alert = 1")
    rows = c.fetchall()
    conn.close()
    events = [dict(row) for row in rows]
    return jsonify(events), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
