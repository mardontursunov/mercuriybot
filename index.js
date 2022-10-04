const TelegramBot = require('node-telegram-bot-api')
const TOKEN = '5694161761:AAHfWkatfUqCo1xC1NNMTzEgH6i9NbqCwOA'
const { findUser, createUser, changeStep, setDistrict, setName, setCourse, setNumber, findAll, setTitle } = require('./model')

const bot = new TelegramBot(TOKEN, {
    polling: true
})

// -715493396

bot.on('message', async (message) => {
    if(message.chat.id != -715493396) {
        const chat_id = message.chat.id
        const name = message.from.name
        const text = message.text
        
        let user = await findUser(chat_id)
        
        if(!user) {
            await createUser(chat_id)
            await bot.sendMessage(chat_id, "<b>To'liq ismingizni kiriting</b>", {
                parse_mode: "HTML"
            })
        } else if(user.step == 1) {
            try {
                await setName(chat_id, text)
                await bot.sendMessage(chat_id, `<b>Telefon raqamingizni yuboring</b>`, {
                    parse_mode: "HTML",
                    reply_markup: {
                        keyboard: [
                            [
                                {
                                    text: "Telefon raqam yuborish",
                                    request_contact: true,
                                    one_time_keyboard: true
                                }
                            ]
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                    
                    
                })
                
                await changeStep(chat_id, 2)
            } catch (error) {
                console.log(error);
            }
        } else if(user.step == 3) {

            if(text == '/obunachilar' && (message.from.id == 999934996)) {
                let users = await findAll()
                await bot.sendMessage(chat_id, `Botga obuna bo'lganlar: <b>${users.length} ta</b>`, {
                    parse_mode: "HTML"
                })
            } else if(message.text != '/xabar') {
                    await bot.sendMessage(chat_id, "Siz ro'yxatdan o'tgansiz!")
            } else if(text == '/xabar' && (message.from.id == 999934996)) {
                await bot.sendMessage(message.chat.id, `1. Reklama sarlavhasi oddiy shaklda yozing.
                
2. Reklama xabarini forward qilib yuboring!`, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Ortga",
                                    callback_data: "back"
                                }
                            ]
                        ]
                    }
                })
                await changeStep(chat_id, 99)
            }
        } else if(user.step == 99) {
            await setTitle(chat_id, text)
            await bot.sendMessage(chat_id, "Endi xabarni forward qilib yuboring") 
            await changeStep(chat_id, 100)
        } else if (user.step == 100 && message.forward_from_message_id) {
            let interval = (1 / 10) * 1000
            
            let users = await findAll()
            setTimeout(async () => {
                let count = 0
                let errorCount = 0

                for(let i = 0; i < users.length; i++) {
                    try {
                        count += 1
                        if(message.reply_markup) {
                            await bot.copyMessage(users[i].chat_id, -1001801747698, message.forward_from_message_id, {
                                reply_markup: message.reply_markup,
                                caption: `${user.title} ${users[i].name}
${message.caption}`,
                            })
                        } else {
                            await bot.copyMessage(users[i].chat_id, -1001801747698, message.forward_from_message_id, {
                                caption: `${user.title} <b>${users[i].name}</b>
                                
${message.caption}`,
                                parse_mode: "HTML"
                            })
                        }

                    } catch (error) {
                        errorCount += 1
                    }
                }

                await bot.sendMessage(message.chat.id, `<b>Barchaga yuborildi</b>\n\nYuborilgan odamlar soni: ${users.length}`, {
                    parse_mode: "HTML"
                })
                
                await bot.sendMessage(message.chat.id, `<b>Bloklaganlar:</b> ${errorCount}`, {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Ortga",
                                    callback_data: "back"
                                }
                            ]
                        ]
                    }
                })

            }, interval)
        }

    }
})

bot.on('contact', async (data) => {
    let user = await findUser(data.contact.user_id)
        setNumber(user.chat_id, data.contact.phone_number)
    if(user.step == 2) {
        await bot.sendMessage(-715493396, `👤 Ismi: <b>${user.name}</b>
☎️ Telefon raqam: <b>${String(data.contact.phone_number)}</b>`, {
            parse_mode: "HTML"
        })
        await bot.sendPhoto(user.chat_id, "./notif-img.jpeg", {
            caption: `Hurmatli <b>${user.name}</b>
            
<b>Notif.uz</b> kompaniyasining rasmiy ro'yxatdan o'tkazuvchi botiga muvaffaqiyatli obuna bo’ldingiz✅`,
            parse_mode: "HTML"
        })
        await changeStep(user.chat_id, 3)
    }
})
bot.on('callback_query', async (query) => {
    if(query.data == 'back') {
        await changeStep(query.message.chat.id, 3)
        await bot.deleteMessage( query.message.chat.id, query.message.message_id)
    }
} )

// let db = findAll()
// db.then(async (users) => {
//     console.log("Xabar yuborildi!");
//     for(let user of users){
//         let chat_id = user.chat_id
//         await bot.sendMess
//     }
// })

// db.catch(async (error) => {
//     console.log("Xabar yuborilmadi");
// })