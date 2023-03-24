const TelegramBot = require('node-telegram-bot-api')
const TOKEN = '6215728518:AAHq4u4nVUV10y1aNKt1TAvkoCMr4-Ym_GY'
const { findUser, createUser, changeStep, setDistrict, setName, setCourse, setNumber, findAll, setTitle } = require('./model')

const bot = new TelegramBot(TOKEN, {
    polling: true
})

// -993869924

bot.on('message', async (message) => {
    if(message.chat.id != -993869924) {
        const chat_id = message.chat.id
        const name = message.from.name
        const text = message.text
        console.log(message)
        
        let user = await findUser(chat_id)

        if(!user) {
            await createUser(chat_id)
            await bot.sendMessage(chat_id, `👋 Professional video montajor kursiga xush kelibsiz!
            
Kurs asoschisi Asadbek Sodiqov siz uchun 4 ta bepul video dars tayyorladi. Unda, video bozorida qanday qilib muvaffaqiyatli biznesni yaratish mumkinligini bilib olasiz!
                        
Boshlashga tayyor bo’lsangiz quyidagi tugamani bosing 👇
            `, {
                parse_mode: "HTML",
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: "Tayyorman 🚀",
                                one_time_keyboard: true
                            }
                        ]
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            })
        } else if(user.step == 1) {
            // let video1 = fs.path('./notifregbot/1.mp4');
            await bot.sendVideo(chat_id, 'BAACAgIAAxkBAAMGZB2E7vjYKndl338BpaQSTVmCzPgAAvUoAAIXS8BITmlCPEUFAUYvBA', {
                caption: "Video hamda video montajorning ahamiyatliligi!" 
            })
            await bot.sendVideo(chat_id, 'BAACAgIAAxkBAAMKZB2FIestWqTE2wPwc_gsSBi7frEAAk4tAAJlHNFIqqTxKvCaWCcvBA', {
                caption: "Video montajorning O’zbekiston va frilans bozorida rivojlanish yo’llari"
            })
            await bot.sendVideo(chat_id, 'BAACAgIAAxkBAAMMZB2FOyiK_YbLuA6SY5Z7RAcIMkMAAt4uAAJtCchIZ5O8JhAWVJIvBA', {
                caption: "Kursdagi imkoniyatlar!"
            })
            await bot.sendVideo(chat_id, 'BAACAgIAAxkBAAMNZB2FUOyWHkVLjVAdMAJusguzlcUAAggpAAIXS8BIJ9tqfWcj3nwvBA', {
                caption: "Nima uchun aynan hozir?"
            })

            await bot.sendMessage(chat_id, "<b>Ro'yxatdan o'tish uchun, to'liq ismingizni kiriting</b>", {
                parse_mode: "HTML"
            })
            await changeStep(chat_id, 2)
        } else if(user.step == 2) {
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
                
                await changeStep(chat_id, 3)
            } catch (error) {
                console.log(error);
            }
        } else if(user.step == 3) {

            if(text == '/obunachilar' && (message.from.id == 999934996)) {
                let users = await findAll()
                await bot.sendMessage(chat_id, `Botga obuna bo'lganlar: <b>${users.length} ta</b>`, {
                    parse_mode: "HTML"
                })
            } else if(message.text != '/xabar' && typeof(message.text) == 'number') {
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
                            await bot.copyMessage(users[i].chat_id, -1001932673403, message.forward_from_message_id, {
                                reply_markup: message.reply_markup,
                                caption: `${user.title} ${users[i].name}
${message.caption}`,
                            })
                        } else {
                            await bot.copyMessage(users[i].chat_id, -1001932673403, message.forward_from_message_id, {
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
    if(user.step == 3) {
        await bot.sendMessage(-993869924, `👤 Ismi: <b>${user.name}</b>
☎️ Telefon raqam: <b>${String(data.contact.phone_number)}</b>`, {
            parse_mode: "HTML"
        })
        await bot.sendPhoto(user.chat_id, "./photo_2023-03-17 19.55.11.jpeg", {
            caption: `Hurmatli <b>${user.name}</b>
            
<b>Mercuriy One</b> kursining rasmiy ro'yxatdan o'tkazuvchi botiga muvaffaqiyatli obuna bo’ldingiz✅`,
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