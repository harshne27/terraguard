const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

/* ===========================
   SERVE FRONTEND
=========================== */

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

/* ===========================
   CONTACT FORM API
===========================*/

app.post("/api/contact", (req, res) => {
    const data = req.body;

    let contacts = [];
    if (fs.existsSync("contacts.json")) {
        contacts = JSON.parse(fs.readFileSync("contacts.json"));
    }

    contacts.push({
        ...data,
        id: Date.now()
    });

    fs.writeFileSync("contacts.json", JSON.stringify(contacts, null, 2));

    res.json({ success: true, message: "Message saved successfully!" });
});

app.get("/api/contact", (req, res) => {
    if (!fs.existsSync("contacts.json")) {
        return res.json([]);
    }
    const contacts = JSON.parse(fs.readFileSync("contacts.json"));
    res.json(contacts);
});

/* ===========================
   RISK ZONE API
===========================*/

app.get("/api/riskzones", (req, res) => {
  res.json({
    status: "ok",
    updated: new Date(),
    zones: [
      { state: "Kerala", risk: "High", lat: 11.4, lng: 76.1 },
      { state: "Uttarakhand", risk: "Very High", lat: 30.1, lng: 79.2 },
      { state: "Meghalaya", risk: "High", lat: 25.5, lng: 91.2 }
    ]
  });
});

/* ===========================
   SERVER
===========================*/

app.listen(5000, () => {
    console.log("Server running → http://localhost:5000");
});
