const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/iswater', async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'latitude and longitude are required' });
    }

    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
                lat: latitude,
                lon: longitude,
                format: 'json',
                zoom: 10
            },
            headers: {
                'User-Agent': 'iswater-checker/1.0 (your-email@example.com)'
            }
        });

        const data = response.data;
        const waterKeywords = ['sea', 'ocean', 'bay', 'water', 'harbor'];
        const address = JSON.stringify(data.address).toLowerCase();
        const isWater = waterKeywords.some(keyword => address.includes(keyword));

        res.json({ water: isWater, detail: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch location info' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
