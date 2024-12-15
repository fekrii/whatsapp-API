const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Meta Verification Endpoint
app.get("/webhook", (req, res) => {
  const verifyToken = "FEKRI-VERIFY-TOKEN";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === verifyToken) {
    console.log("Webhook verified successfully!");
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Verification failed!");
  }
});

// Receive Messages Endpoint
app.post("/webhook", (req, res) => {
  const data = req.body;

  // Check if this is a message event
  if (data.object && data.entry) {
    data.entry.forEach((entry) => {
      const changes = entry.changes;
      if (changes && changes[0].value.messages) {
        const message = changes[0].value.messages[0];
        console.log("Received message: ", message);

        // Do something with the received message
        const from = message.from; // WhatsApp sender's phone number
        const text = message.text?.body || "No text message"; // Message content
        console.log(`Message from ${from}: ${text}`);
      }
    });
  }
  res.status(200).send("EVENT_RECEIVED");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));
