require("dotenv").config();

const cors = require("cors");
const express = require("express");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const app = express();
const port = process.env.PORT || 3000;
const spreadsheetId = process.env.GOOGLE_SHEET_ID || "1FFfeaEEWEZ3eIPGq1fnM2Z6AYzv1t1SQaL9b7Htzro0";
const sheetTab = process.env.GOOGLE_SHEET_TAB || "RSVP";
const notificationEmail = process.env.NOTIFICATION_EMAIL || "karunboban@gmail.com";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getGoogleCredentials() {
  const rawJson = getRequiredEnv("GOOGLE_SERVICE_ACCOUNT_JSON");
  const credentials = JSON.parse(rawJson);

  if (credentials.private_key) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
  }

  return credentials;
}

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: getGoogleCredentials(),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

function getMailTransporter() {
  return nodemailer.createTransport({
    host: getRequiredEnv("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: {
      user: getRequiredEnv("SMTP_USER"),
      pass: getRequiredEnv("SMTP_PASS"),
    },
  });
}

function cleanText(value) {
  return String(value || "").trim();
}

function normalizeRsvp(body) {
  return {
    name: cleanText(body.name),
    email: cleanText(body.email),
    phone: cleanText(body.phone),
    attendance: cleanText(body.attendance),
    guests: cleanText(body.guests),
    dietary: cleanText(body.dietary),
    message: cleanText(body.message),
  };
}

function validateRsvp(rsvp) {
  const missing = [];

  if (!rsvp.name) missing.push("name");
  if (!rsvp.email) missing.push("email");
  if (!rsvp.attendance) missing.push("attendance");
  if (!rsvp.guests) missing.push("guests");

  return missing;
}

async function appendToSheet(rsvp) {
  const sheets = await getSheetsClient();
  const timestamp = new Date().toISOString();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetTab}!A:H`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          timestamp,
          rsvp.name,
          rsvp.email,
          rsvp.phone,
          rsvp.attendance,
          rsvp.guests,
          rsvp.dietary,
          rsvp.message,
        ],
      ],
    },
  });
}

async function sendNotification(rsvp) {
  const transporter = getMailTransporter();
  const subject = `New wedding RSVP from ${rsvp.name}`;
  const text = [
    "A new RSVP was submitted.",
    "",
    `Name: ${rsvp.name}`,
    `Email: ${rsvp.email}`,
    `Phone: ${rsvp.phone || "Not provided"}`,
    `Attendance: ${rsvp.attendance}`,
    `Guests: ${rsvp.guests}`,
    `Dietary restrictions: ${rsvp.dietary || "None provided"}`,
    "",
    "Message:",
    rsvp.message || "No message provided",
  ].join("\n");

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: notificationEmail,
    replyTo: rsvp.email,
    subject,
    text,
  });
}

app.post("/api/rsvp", async (req, res) => {
  const rsvp = normalizeRsvp(req.body);
  const missing = validateRsvp(rsvp);

  if (missing.length > 0) {
    return res.status(400).json({
      message: `Please complete the required fields: ${missing.join(", ")}.`,
    });
  }

  try {
    await appendToSheet(rsvp);
    await sendNotification(rsvp);

    return res.json({
      message: "Thank you. Your RSVP has been received.",
    });
  } catch (error) {
    console.error("RSVP submission failed:", error);

    return res.status(500).json({
      message: "Sorry, your RSVP could not be submitted. Please try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Wedding site listening at http://localhost:${port}`);
});
