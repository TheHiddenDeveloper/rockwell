# reconcile_logs.py
import sqlite3
from datetime import datetime, timedelta

DB_PATH = "db.sqlite3"

def reconcile_logs():
    now = datetime.utcnow()
    since = now - timedelta(hours=24)

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Fetch logs from both tables in the last 24 hours
    c.execute("SELECT truck, event, timestamp FROM event_logs WHERE timestamp >= ?", (since.isoformat(),))
    logs = set(c.fetchall())

    c.execute("SELECT truck, event, timestamp FROM events WHERE timestamp >= ?", (since.isoformat(),))
    events = set(c.fetchall())

    c.execute("SELECT truck, event, timestamp FROM events WHERE timestamp >= ? AND synced = 0", (since.isoformat(),))
    unsynced = set(c.fetchall())

    conn.close()

    print(f"[CHECK] Last 24 hours — {len(logs)} logs, {len(events)} events, {len(unsynced)} unsynced")

    # Events in logs but missing in events
    missing = logs - events
    if missing:
        print("\n❌ Missing from events table:")
        for m in missing:
            print("  ", m)

    # Unsynced records
    if unsynced:
        print("\n⚠️  Not synced yet:")
        for u in unsynced:
            print("  ", u)

    if not missing and not unsynced:
        print("\n✅ All data matches and is synced.")

if __name__ == "__main__":
    reconcile_logs()
