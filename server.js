require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { nanoid } = require('nanoid');

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define URL Schema
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortId: String,
});
const URL = mongoose.model('URL', urlSchema);

// Shorten URL Endpoint
app.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const shortId = nanoid(6);
    await URL.create({ originalUrl, shortId });
    res.json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
});

// Redirect to Original URL
app.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;
    const urlEntry = await URL.findOne({ shortId });
    if (urlEntry) {
        res.redirect(urlEntry.originalUrl);
    } else {
        res.status(404).json({ error: 'URL not found' });
    }
});

// Start Server
app.listen(5000, () => console.log('Server running on port 5000'));
