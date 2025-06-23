# data_generator.py
import sqlite3
import random
import time
from datetime import datetime
from datetime import timezone
import os

DB_PATH = os.path.abspath("../backend/db.sqlite3")  # adjust path if needed

TRUCK_IDS = ["T101", "T203", "T305", "T407"]
EVENT_TYPES = ["fatigue", "location", "engine", "idle"]

def insert_fake_event():
    truck = random.choice(TRUCK_IDS)
    event = random.choice(EVENT_TYPES)
    timestamp = datetime.now(timezone.utc).isoformat()

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        INSERT INTO events (truck, event, timestamp, synced, alert)
        VALUES (?, ?, ?, 0, 0)
    """, (truck, event, timestamp))
    conn.commit()
    conn.close()

    print(f"[GENERATOR] Inserted → {truck} | {event} | {timestamp}")

def main():
    while True:
        insert_fake_event()
        time.sleep(15)  # Every 15 seconds

if __name__ == "__main__":
    main()
