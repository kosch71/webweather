const app = require('./app.js');
const db = require('../db');

const PORT = process.env.PORT || 7000;

db.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log('Listening on port: ' + PORT);
        });
    });
