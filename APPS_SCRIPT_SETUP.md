# Easier RSVP Setup With Google Apps Script

This keeps the RSVP form styled exactly like the website. The form submits to a Google Apps Script web app, and the script saves the response to Google Sheets and emails `karunboban@gmail.com`.

## 1. Open Apps Script From Your Sheet

Open your RSVP spreadsheet:

```text
https://docs.google.com/spreadsheets/d/1FFfeaEEWEZ3eIPGq1fnM2Z6AYzv1t1SQaL9b7Htzro0/edit
```

Then go to:

```text
Extensions > Apps Script
```

## 2. Paste This Script

Replace the starter code with:

```javascript
const SHEET_NAME = "RSVP";
const NOTIFICATION_EMAIL = "karunboban@gmail.com";

function doPost(e) {
  const sheet = getRsvpSheet();
  const data = e.parameter;

  const response = {
    timestamp: new Date(),
    name: clean(data.name),
    email: clean(data.email),
    phone: clean(data.phone),
    attendance: clean(data.attendance),
    guests: clean(data.guests),
    dietary: clean(data.dietary),
    message: clean(data.message),
  };

  sheet.appendRow([
    response.timestamp,
    response.name,
    response.email,
    response.phone,
    response.attendance,
    response.guests,
    response.dietary,
    response.message,
  ]);

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    replyTo: response.email,
    subject: `New wedding RSVP from ${response.name}`,
    body: [
      "A new RSVP was submitted.",
      "",
      `Name: ${response.name}`,
      `Email: ${response.email}`,
      `Phone: ${response.phone || "Not provided"}`,
      `Attendance: ${response.attendance}`,
      `Guests: ${response.guests}`,
      `Dietary restrictions: ${response.dietary || "None provided"}`,
      "",
      "Message:",
      response.message || "No message provided",
    ].join("\n"),
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getRsvpSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Email",
      "Phone",
      "Attendance",
      "Guests",
      "Dietary Restrictions",
      "Message",
    ]);
  }

  return sheet;
}

function clean(value) {
  return String(value || "").trim();
}
```

## 3. Deploy It

In Apps Script:

1. Click `Deploy`.
2. Click `New deployment`.
3. Choose type `Web app`.
4. Set `Execute as` to `Me`.
5. Set `Who has access` to `Anyone`.
6. Click `Deploy`.
7. Approve the permissions.
8. Copy the Web app URL.

## 4. Add The URL To The Website

Open `rsvp.js` and replace this line:

```javascript
const RSVP_ENDPOINT = "";
```

with:

```javascript
const RSVP_ENDPOINT = "PASTE_YOUR_WEB_APP_URL_HERE";
```

## 5. Test

Open `index.html` or `rsvp.html` in your browser and submit the form.

The response should appear in the `RSVP` tab, and `karunboban@gmail.com` should receive an email notification.
