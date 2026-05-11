# Escape Room Alarm API

A fun, puzzle-based alarm clock built with Node.js and Express. When the alarm rings, you can't just press a button to turn it off—you have to interact with the API to find a clue, decode a base64 string, and submit the correct key to disarm it!

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

## Installation

1. Navigate to the project directory:
   ```bash
   cd 
   ```
2. Initialize a `package.json` if you haven't already:
   ```bash
   npm init -y
   ```
3. Install the required dependencies:
   ```bash
   npm install express cors
   ```
4. Ensure you have an `index.html` file in the same directory (as required by the `/` endpoint).

## How to Run

Start the server by running:
```bash
node server.js
```
The API will be available at `http://localhost:3000`.

## API Endpoints & "The Game"

Here is the sequence of endpoints you'll interact with to play the escape room alarm game.

### 1. Set the Alarm
- **URL:** `/set`
- **Method:** `POST`
- **Body (JSON):** `{ "time": "HH:MM" }` (e.g., `{ "time": "14:30" }`)
- **Description:** Sets the alarm time. The server checks the time every minute.

### 2. Check Status
- **URL:** `/status`
- **Method:** `GET`
- **Description:** Returns whether the alarm is currently ringing (`{ "ringing": true/false }`).

### 3. Try to Disarm
- **URL:** `/disarm`
- **Method:** `GET`
- **Description:** If the alarm is ringing, this will fail with a `423 LOCKED` status and instruct you to go to `/clue`.

### 4. Get the Clue
- **URL:** `/clue`
- **Method:** `GET`
- **Description:** Returns a JSON object containing a base64-encoded payload and instructions on what to do next.
- **Example Response:**
  ```json
  {
    "hint": "Decode this base64 string.",
    "payload": "NEQyQQ==",
    "next_step": "POST the decoded string to /unlock inside a 'key' JSON property."
  }
  ```

### 5. Unlock (Disarm the Alarm)
- **URL:** `/unlock`
- **Method:** `POST`
- **Body (JSON):** `{ "key": "<decoded_string>" }`
- **Description:** Submit the decoded passcode to turn off the alarm. If successful, the alarm stops ringing!
