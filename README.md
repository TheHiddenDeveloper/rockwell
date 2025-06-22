# 🚧 Smart Offline Sync & Alert Tool  
*A lightweight solution to improve fatigue and fleet monitoring in mines with poor network connectivity.*  
🕒 Built in 5 hours for AngloGold Ashanti Hackathon 2025

---

## 🧠 Problem We're Solving

Mining companies use systems to monitor driver fatigue and vehicle movement in real time. But when the *network goes down, data from trucks may **never reach the control center. This is a **serious safety and operational risk*.

We’re solving that with a *smart offline sync system* that:

- Saves data locally when the network fails  
- Sends it automatically when the network is back  
- Alerts operators if data stays unsynced for too long  
- Shows everything on a live dashboard

---

## ✅ What We Built (in 5 hours)

| Feature                  | What It Does                                                        |
|--------------------------|---------------------------------------------------------------------|
| 🧪 Fake Data Generator   | Simulates fatigue/fleet events from trucks                          |
| 💾 Local Storage         | Saves events offline using SQLite if there's no network             |
| 🌐 Network Checker       | Detects if the server/network is online                             |
| 🔁 Auto Sync             | Sends unsynced data when network is restored                         |
| ⚠ Alert System          | Notifies if data hasn't synced after a set time                     |
| 📊 React Dashboard       | Displays unsynced trucks, event types, and alert status             |

---

## 💡 Why This Matters

Mining environments often suffer from *poor network coverage. If a fatigue alert happens in a dead zone and isn’t logged, **nobody knows*.  

Our tool:

- Ensures *no safety event goes unseen*  
- Works *offline and online*  
- Can be added to *existing systems* easily  

---

## 🧩 Tech Stack

| Layer       | Technology Used        |
|-------------|------------------------|
| Frontend    | React + Axios          |
| Backend     | Flask (Python)         |
| Database    | SQLite                 |
| API Bridge  | Flask REST API         |
| Local Logic | Python scripts         |
| Alerting    | Python time checks     |

---

## 👥 Team & Responsibilities

| Member Name | Role            | Responsibilities                                         |
|-------------|------------------|-----------------------------------------------------------|
| 👤 Manuel & Juda  | Frontend Lead   | Build React dashboard, connect to Flask API              |
| 👤 Rodney  | Backend Lead    | Create Flask server, expose API routes                   |
| 👤 Clivert  | Data Generator  | Write script to simulate fatigue/fleet events            |
| 👤 Rodney & Clivert 4 | Sync + Alerts   | Write scripts for local storage, network check, syncing  |

---

## 🛠 Folder Structure
```
smart-sync-tool/
├── backend/
│   ├── app.py               # Flask server with API routes
│   ├── sync_logic.py        # Local sync + alert logic
│   └── db.sqlite3           # Offline data storage
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Dashboard UI
│   │   ├── api.js           # Axios API calls
│   │   └── DataTable.jsx    # Displays unsynced data
│
├── data_generator.py        # Script to simulate events
├── requirements.txt         # Python dependencies
├── README.md                # Project guide (you’re reading it)
```
---

## 🧪 Sample Data Format

```json
{
  "truck": "104",
  "event": "fatigue",
  "timestamp": "2025-06-22T12:00:00"
}
```

⸻

## 🔌 How It Works (Simplified)
	1.	data_generator.py creates fake events (like “fatigue detected”).

	2.	If internet is down → save event to SQLite DB.

	3.	When internet is back → send all saved events to Flask server.

	4.	If any data stays unsynced for more than X mins → flag it as an alert.

	5.	React dashboard shows all unsynced trucks, and alerts if needed.

⸻

## 🚀 How to Run (Locally)

- 1. Start Flask Backend
```
cd backend
pip install -r ../requirements.txt
python app.py
```

- 2. Run Data Generator

```
python data_generator.py
```

- 3. Run Sync + Alert Script
```
python sync_logic.py
```
- 4. Start React Frontend
```
cd frontend
npm install
npm run dev
```


⸻

## 📈 How It Can Scale Later
	•	Add AI to prioritize sync data (e.g., fatigue > location)
	•	Connect to real telematics APIs from trucks
	•	Deploy as a Docker container on edge devices (e.g., in trucks)
	•	Add SMS/email alerts for critical delays

⸻

## 🧠 Final Pitch
```
This isn’t just about syncing data — it’s about preventing accidents in places where tech often fails.
In just 5 hours, we built a working system that makes safety data resilient, visible, and actionable — even with no network.
```
