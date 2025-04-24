const express = require('express');
const turf = require('@turf/turf');
const landGeoJSON = require('./landData');

const app = express();

function isLand(lat, lon) {
    const point = turf.point([lon, lat]);
    return landGeoJSON.features.some(feature => turf.booleanPointInPolygon(point, feature));
}

app.get('/api/iswater', (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'latitude and longitude are required' });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    const result = isLand(lat, lon);
    res.json({ water: !result, land: result });
});

module.exports = app;
