# generator.py
import sqlite3
import random
import time
from datetime import datetime, timezone



DB_PATH = "../backend/db.sqlite3"  # adjust if needed

import os
print("[DEBUG] Using DB path:", os.path.abspath(DB_PATH))


TRUCK_IDS = ['T201', 'T202', 'T203', 'T204']
EVENT_TYPES = ['loading', 'unloading', 'idle', 'moving']

def insert_fake_event():
    truck = random.choice(TRUCK_IDS)
    event = random.choice(EVENT_TYPES)
    timestamp = datetime.now(timezone.utc).isoformat()

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Insert into main events table
    c.execute("""
        INSERT INTO events (truck, event, timestamp)
        VALUES (?, ?, ?)
    """, (truck, event, timestamp))

    # Insert into audit log table
    c.execute("""
        INSERT INTO event_logs (truck, event, timestamp)
        VALUES (?, ?, ?)
    """, (truck, event, timestamp))

    conn.commit()
    conn.close()
    print(f"[GENERATOR] Inserted → {truck} | {event} | {timestamp}")

def main():
    while True:
        insert_fake_event()
        time.sleep(5)

if __name__ == "__main__":
    main()
