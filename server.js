const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Available Alarm Tracks
const TRACKS = [
    { id: 'digital-beep', name: 'Digital Beep', file: 'tracks/digital-beep.wav', desc: 'Classic digital alarm clock 4-beep sequence' },
    { id: 'emergency-siren', name: 'Emergency Siren', file: 'tracks/emergency-siren.wav', desc: 'Sweeping high-urgency siren' },
    { id: 'nuclear-klaxon', name: 'Nuclear Klaxon', file: 'tracks/nuclear-klaxon.wav', desc: 'Harsh industrial hazard buzzer' },
    { id: 'cyber-alert', name: 'Cyber Alert', file: 'tracks/cyber-alert.wav', desc: 'Futuristic sci-fi red alert pulse' },
    { id: 'gentle-chime', name: 'Gentle Chime', file: 'tracks/gentle-chime.wav', desc: 'Melodic morning bell sequence' },
    { id: 'original-track', name: 'Original Track', file: 'alarm-track.mp3', desc: 'Original wake-up audio file' }
];

let alarmTime = null;
let isRinging = false;
let dailyPasscode = null;
let selectedTrackId = 'digital-beep';
let lastTriggerMinute = null;

// Helper to trigger the alarm
function triggerAlarm() {
    isRinging = true;
    dailyPasscode = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
    console.log(`[!] ALARM TRIGGERED! Passcode Generated: ${dailyPasscode}`);
}

// Accurate per-second alarm check
setInterval(() => {
    if (!alarmTime || isRinging) return;

    const now = new Date();
    const currentMinute = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    if (currentMinute === alarmTime && lastTriggerMinute !== currentMinute) {
        lastTriggerMinute = currentMinute;
        triggerAlarm();
    }
}, 1000);

// API ROUTES (defined before static to prevent folder redirection)
// Get tracks list
app.get('/tracks', (req, res) => {
    res.json({
        tracks: TRACKS,
        selectedTrackId: selectedTrackId,
        selectedTrack: TRACKS.find(t => t.id === selectedTrackId) || TRACKS[0]
    });
});

// Select alarm track
app.post('/tracks/select', (req, res) => {
    const { trackId } = req.body;
    const found = TRACKS.find(t => t.id === trackId);
    if (!found) {
        return res.status(404).json({ error: `Track '${trackId}' not found.` });
    }
    selectedTrackId = trackId;
    console.log(`[+] Track selected: ${found.name} (${found.file})`);
    res.json({ message: `Track switched to ${found.name}`, selectedTrack: found });
});

// Set alarm time
app.post('/set', (req, res) => {
    alarmTime = req.body.time;
    lastTriggerMinute = null;
    console.log(`[+] Alarm set for ${alarmTime}`);
    res.json({ message: `Alarm set for ${alarmTime}. Sleep well.`, alarmTime: alarmTime });
});

// Cancel alarm
app.post('/cancel', (req, res) => {
    alarmTime = null;
    lastTriggerMinute = null;
    console.log(`[-] Alarm cancelled`);
    res.json({ message: "Alarm schedule cancelled." });
});

// Test trigger immediately
app.post('/trigger', (req, res) => {
    triggerAlarm();
    res.json({ 
        message: "ALARM TRIGGERED! Emergency lockdown active.",
        ringing: true
    });
});

// Status endpoint
app.get('/status', (req, res) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    res.json({
        ringing: isRinging,
        alarmTime: alarmTime,
        selectedTrack: TRACKS.find(t => t.id === selectedTrackId) || TRACKS[0],
        systemTime: currentTime
    });
});

// Disarm endpoint (requires key via unlock)
app.get('/disarm', (req, res) => {
    if (!isRinging) return res.json({ message: "Alarm is dormant. System safe." });
    res.status(423).json({ 
        error: "LOCKED", 
        instruction: "To disarm, GET /clue to find the payload, decode it, and POST to /unlock with {'key': 'DECODED_VALUE'}." 
    });
});

// Clue endpoint
app.get('/clue', (req, res) => {
    if (!isRinging) return res.json({ message: "System is dormant. Go back to sleep." });
    const encodedPasscode = Buffer.from(dailyPasscode).toString('base64');
    res.json({ 
        hint: "Decode this Base64 string to obtain the daily unlock key.",
        payload: encodedPasscode,
        next_step: "POST the decoded string to /unlock inside a 'key' JSON property (or use: unlock <key> in terminal simulator)."
    });
});

// Unlock endpoint
app.post('/unlock', (req, res) => {
    const userKey = (req.body.key || '').trim().toUpperCase();
    if (isRinging && userKey === dailyPasscode) {
        isRinging = false;
        const previousPasscode = dailyPasscode;
        dailyPasscode = null;
        alarmTime = null;
        lastTriggerMinute = null;
        console.log(`[+] Alarm successfully hacked and disarmed! Key: ${previousPasscode}`);
        res.json({ 
            success: true, 
            message: "SUCCESS! Passcode verified. Alarm disarmed. System security restored." 
        });
    } else if (!isRinging) {
        res.json({ success: false, message: "Alarm is not ringing. Nothing to disarm." });
    } else {
        console.log(`[-] Failed unlock attempt with key: '${userKey}' (expected: '${dailyPasscode}')`);
        res.status(401).json({ 
            success: false, 
            error: "INCORRECT KEY! The siren continues. Check /clue and decode carefully." 
        });
    }
});

// Static assets (served after explicit API routes)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` Hacker Alarm Room API & Simulator`);
    console.log(` Running on http://localhost:${PORT}`);
    console.log(` Tracks available: ${TRACKS.length}`);
    console.log(`=========================================`);
});