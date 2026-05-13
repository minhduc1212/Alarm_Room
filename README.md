# Hacker Alarm - The Only Way to Wake Up

## The Struggle is Real
Let's be honest: my morning routine usually involves setting an alarm, hearing it, and then instantly turning it off while still half-asleep just to get "five more minutes." Those five minutes inevitably turn into an hour, and the cycle continues.

This project is a direct response to that behavior. It's not just an alarm; it's a security challenge. To stop the noise, I have to wake up my brain enough to perform a series of API requests and "hack" the system. No more mindless tapping to snooze.

## How It Works
This is a simple Express-based alarm system that requires a multi-step disarm process via an API.

1.  **Set the Alarm:** Use the web interface (running on `index.html`) to set a wake-up time.
2.  **The Trigger:** When the time hits, the server generates a random hex passcode and starts playing `alarm-track.mp3`.
3.  **The Lockdown:** Attempting to hit the `/disarm` endpoint will return a `423 LOCKED` status.
4.  **The Clue:** You must request `/clue` to receive a Base64 encoded payload.
5.  **The Hack:** Decode the payload (your brain starts working here!) and `POST` the result to `/unlock` with the key.
6.  **Silence:** Only a correct key will stop the alarm.

## Technical Stack
- **Backend:** Node.js with Express
- **Frontend:** Vanilla JS & CSS (Glassmorphism design)
- **Features:** 
    - RESTful API for alarm control
    - Base64 puzzle generation
    - Real-time status polling

## Command Line Usage
If you prefer the terminal (or need to automate your wake-up hack), use these `curl` commands:

### 1. Set the Alarm
```bash
curl -X POST -H "Content-Type: application/json" -d '{"time":"07:30"}' http://localhost:3000/set
```

### 2. Check Alarm Status
```bash
curl http://localhost:3000/status
```

### 3. Get the Clue (When Ringing)
```bash
curl http://localhost:3000/clue
```

### 4. Unlock/Disarm
Replace `YOUR_DECODED_KEY` with the result of decoding the Base64 payload from the clue.
```bash
curl -X POST -H "Content-Type: application/json" -d '{"key":"YOUR_DECODED_KEY"}' http://localhost:3000/unlock
```

## Setup
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Place your loudest wake-up track as `alarm-track.mp3` in the root directory.
4.  Start the server:
    ```bash
    node server.js
    ```
5.  Open `http://localhost:3000` in your browser.

## TODO
- [x] Basic Express server and alarm logic
- [x] Frontend for setting time and monitoring status
- [x] Base64 "hacking" disarm flow
- [ ] Add more complex puzzles
- [ ] Implement "uncloseable" browser window features
