const express = require('express');
const cors = require('cors');
const path = require('path'); // Thêm dòng này để xử lý đường dẫn file
const app = express();

app.use(express.json());
app.use(cors()); 
app.use(express.static(__dirname));

let alarmTime = null;
let isRinging = false;
let dailyPasscode = null;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

setInterval(() => {
    if (!alarmTime || isRinging) return;
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (currentTime === alarmTime) {
        isRinging = true;
        dailyPasscode = Math.floor(Math.random() * 65535).toString(16).toUpperCase(); 
        console.log(`[!] ALARM TRIGGERED! Daily Passcode Generated. Waiting for disarm...`);
    }
}, 1000 * 60);

app.post('/set', (req, res) => {
    alarmTime = req.body.time;
    console.log(`[+] Alarm set for ${alarmTime}`);
    res.json({ message: `Alarm set for ${alarmTime}. Sleep well.` });
});

app.get('/status', (req, res) => {
    res.json({ ringing: isRinging });
});

app.get('/disarm', (req, res) => {
    if (!isRinging) return res.json({ message: "Alarm is dormant." });
    res.status(423).json({ 
        error: "LOCKED", 
        instruction: "To disarm, GET /clue to find the payload." 
    });
});

app.get('/clue', (req, res) => {
    if (!isRinging) return res.json({ message: "Go back to sleep." });
    const encodedPasscode = Buffer.from(dailyPasscode).toString('base64');
    res.json({ 
        hint: "Decode this base64 string.",
        payload: encodedPasscode,
        next_step: "POST the decoded string to /unlock inside a 'key' JSON property."
    });
});

app.post('/unlock', (req, res) => {
    const userKey = req.body.key;
    if (userKey === dailyPasscode) {
        isRinging = false;
        dailyPasscode = null;
        alarmTime = null; 
        console.log(`[+] Alarm successfully hacked and disarmed.`);
        res.json({ message: "SUCCESS. Alarm disarmed." });
    } else {
        console.log(`[-] Failed unlock attempt with key: ${userKey}`);
        res.status(401).json({ error: "INCORRECT. The noise continues." });
    }
});

app.listen(3000, () => console.log('Escape Room API running on http://localhost:3000'));