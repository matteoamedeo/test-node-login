const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
    const html = `Dashboard <a href='/logout'> Logout</a>`;
    res.send(html);
});

module.exports = router;