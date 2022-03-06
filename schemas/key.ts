const mongoose = require('mongoose');

const key = new mongoose.Schema({
    key: String,
    hwid: String,
});

export default mongoose.model('key', key, 'keys');