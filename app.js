const express = require('express');
const bodyParser = require('body-parser');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('key');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Google Sheets setup
const doc = new GoogleSpreadsheet('id');

async function accessSpreadsheet() {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
}

app.post('/webhook', async (req, res) => {
  try {
    await accessSpreadsheet();
    const sheet = doc.sheetsByIndex[0]; // Assuming the first sheet
    const { field1, field2, field3 } = req.body; // Adjust based on your data structure
    await sheet.addRow({ Field1: field1, Field2: field2, Field3: field3 });
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Error accessing spreadsheet:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
