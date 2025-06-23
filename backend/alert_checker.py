# alert_checker.py
import sqlite3
import time
from datetime import datetime, timedelta, timezone

DB_PATH = "db.sqlite3"
ALERT_THRESHOLD_MINUTES = 1
ALERT_CHECK_INTERVAL = 30  # seconds

def get_unalerted_unsynced_events():
    with sqlite3.connect(DB_PATH) as conn:
        return conn.execute("SELECT * FROM events WHERE synced = 0 AND alert = 0").fetchall()

def mark_event_alert(event_id):
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("UPDATE events SET alert = 1 WHERE id = ?", (event_id,))
        conn.commit()

def check_alerts():
    now = datetime.now(timezone.utc)
    events = get_unalerted_unsynced_events()
    for e in events:
        event_id, _, _, ts_str, _, _ = e
        if not ts_str:
            continue
        try:
            event_time = datetime.fromisoformat(ts_str)
            if event_time.tzinfo is None:
                event_time = event_time.replace(tzinfo=timezone.utc)
        except:
            continue
        if now - event_time > timedelta(minutes=ALERT_THRESHOLD_MINUTES):
            mark_event_alert(event_id)
            print(f"[ALERT] Event {event_id} marked as alert (too old)")

def main():
    print("[ALERT] Running alert checker...")
    while True:
        check_alerts()
        time.sleep(ALERT_CHECK_INTERVAL)

if __name__ == "__main__":
    main()
