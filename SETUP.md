# RSVP Backend Setup

The easiest setup is Google Apps Script, because it keeps this site static while still saving RSVPs to Google Sheets and emailing `karunboban@gmail.com`.

Use `APPS_SCRIPT_SETUP.md` for the recommended setup.

The Node/Express setup below is still available if you later want a separate backend server.

## Easier Recommended Option

Follow:

```text
APPS_SCRIPT_SETUP.md
```

You only need to paste a script into your Google Sheet, deploy it as a web app, and paste the web app URL into `rsvp.js`.

---

# Optional Node/Express Setup

This project also includes a Node/Express backend at `/api/rsvp`. It saves each RSVP to Google Sheets and emails a notification to `karunboban@gmail.com`.

## 1. Install dependencies

```bash
npm install
```

## 2. Prepare the Google Sheet

Open the sheet:

```text
https://docs.google.com/spreadsheets/d/1FFfeaEEWEZ3eIPGq1fnM2Z6AYzv1t1SQaL9b7Htzro0/edit
```

Create a tab named `RSVP` with this header row:

```text
Timestamp | Name | Email | Phone | Attendance | Guests | Dietary Restrictions | Message
```

## 3. Create Google credentials

1. Create a Google Cloud project.
2. Enable the Google Sheets API.
3. Create a service account.
4. Create a JSON key for that service account.
5. Share the spreadsheet with the service account `client_email` from the JSON file and give it Editor access.

## 4. Configure environment variables

Copy `.env.example` to `.env` and fill in:

```bash
GOOGLE_SERVICE_ACCOUNT_JSON=...
SMTP_USER=...
SMTP_PASS=...
```

For Gmail, `SMTP_PASS` should be a Gmail app password, not your regular Google password.

## 5. Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The RSVP form exists on the home page and on the dedicated RSVP page:

```text
http://localhost:3000/rsvp.html
```
