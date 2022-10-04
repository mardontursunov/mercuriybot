const Schema = require('mongoose').Schema
const client = require('./mongo')

const UserSchema = new Schema({
    chat_id: {
        type: Number,
        required: true,
        index: true,
        unique: true
    },
    step: {
        type: String,
        default: 1

    },
    course_name: {
        type: String,
    },
    name: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    district: {
        type: String,
    },
    title: {
        type: String
    }
})

async function UserModel () {
    let db = await client()
    return await db.model('users', UserSchema)
}

async function findUser (chat_id) {
    let db = await UserModel() 
    return await db.findOne({ chat_id: chat_id })
}

async function createUser(chat_id) {
    let db = await UserModel()
    return await db.create({ chat_id })
}

async function setName(chat_id, name) {
    let db = await UserModel() 
    return await db.updateOne({ chat_id }, { name })
}

async function setDistrict(chat_id, district) {
    let db = await UserModel()
    return await db.updateOne({ chat_id }, { district })
}

async function changeStep(chat_id, step) {
    let db = await UserModel()
    return await db.updateOne({ chat_id }, { step })
}

async function setCourse (chat_id, course) {
    let db = await UserModel()
    return await db.updateOne({ chat_id }, { course })
}

async function findAll () {
    let db = await UserModel() 
    let result = await db.find();
    return result
}

async function setNumber(chat_id, phone_number) {
    let db = await UserModel()
    return await db.updateOne({ chat_id }, { phone_number })
}

async function setTitle (chat_id, title) {
    let db = await UserModel()
    return await db.updateOne({ chat_id }, { title })
}

module.exports = {
    findUser,
    createUser,
    setName,
    findAll,
    setDistrict,
    changeStep,
    setCourse,
    setNumber,
    setTitle
}