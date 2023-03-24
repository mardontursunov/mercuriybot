const mongoose = require('mongoose')

async function client() {
    return await mongoose.connect('mongodb://localhost/mercuriyone')
}

module.exports = client