const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, 'chat_history.json');

class HistoryManager {
    constructor(io) {
        this.io = io;
        this.histories = {}; // sessionId -> { messages, lastUserActivity }
        this.loadHistory();
    }

    loadHistory() {
        if (fs.existsSync(HISTORY_FILE)) {
            try {
                this.histories = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
            } catch (err) {
                console.error("Error loading chat history:", err.message);
                this.histories = {};
            }
        }
    }

    saveHistory() {
        try {
            fs.writeFileSync(HISTORY_FILE, JSON.stringify(this.histories, null, 2));
        } catch (err) {
            console.error("Error saving chat history:", err.message);
        }
    }

    getHistory(sessionId) {
        if (!this.histories[sessionId]) {
            this.histories[sessionId] = { messages: [], lastUserActivity: Date.now() };
        }
        return this.histories[sessionId].messages;
    }

    addMessage(sessionId, message) {
        if (!this.histories[sessionId]) {
            this.histories[sessionId] = { messages: [], lastUserActivity: Date.now() };
        }

        const msgData = {
            ...message,
            timestamp: Date.now()
        };

        this.histories[sessionId].messages.push(msgData);
        
        // Update user activity if message is from user
        if (message.sender === 'user') {
            this.histories[sessionId].lastUserActivity = Date.now();
        }

        // Keep last 50 messages to avoid huge file
        if (this.histories[sessionId].messages.length > 50) {
            this.histories[sessionId].messages.shift();
        }

        this.saveHistory();
        return msgData;
    }

    // New check: if the user hasn't sent a message for 3 mins, we can flag or send automated message
    checkInactivity(callback) {
        const now = Date.now();
        const INACTIVITY_LIMIT = 3 * 60 * 1000; // 3 minutes

        Object.keys(this.histories).forEach(sessionId => {
            const h = this.histories[sessionId];
            
            // If they haven't sent a message in 3 mins, and we haven't sent THE automated "are you online" message recently
            // Actually, the user wants it "every 3 mins" if they are inactive.
            
            // To prevent spam, let's track the last automated pings
            if (!h.lastAutomatedPing) h.lastAutomatedPing = 0;

            if (now - h.lastUserActivity > INACTIVITY_LIMIT && now - h.lastAutomatedPing > INACTIVITY_LIMIT) {
                h.lastAutomatedPing = now;
                callback(sessionId, "bcghit ghirr nchouff wwach nta mazal online ola la");
            }
        });
    }

    clearHistory(sessionId) {
        if (this.histories[sessionId]) {
            delete this.histories[sessionId];
            this.saveHistory();
        }
    }
}

module.exports = HistoryManager;
