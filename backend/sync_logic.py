# sync_logic.py
import sqlite3
import time
import requests
from datetime import datetime, timedelta, timezone

DB_PATH = "db.sqlite3"
API_URL = "http://localhost:5000/events"
SYNC_INTERVAL = 10  # seconds
ALERT_THRESHOLD_MINUTES = 10

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        truck TEXT NOT NULL,
        event TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        alert INTEGER DEFAULT 0
    )
    """)
    conn.commit()
    conn.close()

def is_server_online():
    try:
        r = requests.get("http://localhost:5000/ping", timeout=2)
        return r.status_code == 200
    except:
        return False

def get_unsynced_events():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM events WHERE synced = 0")
    rows = c.fetchall()
    conn.close()
    return rows

def mark_event_synced(event_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE events SET synced = 1 WHERE id = ?", (event_id,))
    conn.commit()
    conn.close()

def mark_event_alert(event_id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE events SET alert = 1 WHERE id = ?", (event_id,))
    conn.commit()
    conn.close()

def sync_events():
    events = get_unsynced_events()
    for e in events:
        event_id, truck, event_type, ts_str, synced, alert = e

        print(f"[SYNCING] → id:{event_id} truck:{truck} event:{event_type} timestamp:{ts_str}")

        try:
            r = requests.post(API_URL, json={
                "truck": truck,
                "event": event_type,
                "timestamp": ts_str
            }, timeout=3)
            if r.status_code == 200:
                print(f"[OK] Event {event_id} synced")
                mark_event_synced(event_id)
            else:
                print(f"[FAIL] Event {event_id} failed sync with status {r.status_code}")
        except Exception as ex:
            print(f"[ERROR] Event {event_id} exception: {ex}")
            continue




def main():
    init_db()
    print("[SYNC] Running sync loop...")
    while True:
        if is_server_online():
            sync_events()
        time.sleep(SYNC_INTERVAL)

if __name__ == "__main__":
    main()
