const mongoose = require('mongoose')

async function client() {
    return await mongoose.connect('mongodb://localhost/notifregbot')
}

module.exports = client