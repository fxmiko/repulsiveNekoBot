const { create, decryptMedia } = require('@open-wa/wa-automate');
const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment');
const ffmpeg = require('fluent-ffmpeg');
const request = require('request-promise');
const { TraceMoe } = require("trace.moe.ts");
const randomstring = require("randomstring");
const imgbbUploader = require("imgbb-uploader");
const sagiri = require("sagiri", { results: 3 });
const { RemoveBgResult, RemoveBgError, removeBackgroundFromImageBase64 } = require('remove.bg');

const sagiriKey = sagiri("") //trace.moe
const removeBgAPI = '' //remove.bg
const imgBbAPI = '' //imgbb.co

//set your api.xteam.xyz api on api.txt

const wait = new TraceMoe();
const xteamApi = fs.readFileSync('api.txt','utf8')


// const { Doujin } = require('nhentai-pdf/dist')
// import { InstagramApi } from "simple-instagram-api";



//CHALK Simple Color Calling Variables
const chGreen = chalk.green
const chBlue = chalk.blue
const chRed = chalk.red
const chCyan = chalk.cyan
const chYellow = chalk.yellow
const chMagenta = chalk.magenta
const chWhite = chalk.white
const chBoldGreen = chalk.green.bold
const chBoldBlue = chalk.blue.bold
const chBoldRed = chalk.red.bold
const chBoldCyan = chalk.cyan.bold
const chBoldYellow = chalk.yellow.bold
const chBoldMagenta = chalk.magenta.bold
const chBoldWhite = chalk.white.bold

const reqs = request.defaults({
    headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; rv:20.0) Gecko/20121202 Firefox/20.0'}
})


function createIs() {
    fs.mkdirSync('./imageStorage')
}
function createWait(){
    fs.mkdirSync('./imageStorage/wutanime')
}
function createRev() {
    fs.mkdirSync('./imageStorage/reverse')
}


async function createFolders() {
    await createIs();
    await createWait();
    await createRev();
}

if (!fs.existsSync('./imageStorage')) {
    try {
        createFolders()
    } catch(err) {
        console.log(err)
    }
}

create({
    sessionId: "NekoB0T",
    customUserAgent : `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36`,
    authTimeout: 60, 
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    hostNotificationLang: 'PT_BR',
    useChrome: true,
    logConsole: false,
    popup: true,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function between(min, max) {  
    return Math.floor(
        Math.random() * (max - min) + min
        )
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function start(client) {

    client.onIncomingCall((call) => {
        console.log(call.peerJid)
        client.sendText(call.peerJid, 'y tho')
        client.contactBlock(call.peerJid)
    })

    client.onMessage(async message => {

        try {
            const { type, body, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, isGroupAdmins } = message
            const { id, pushname } = sender
            const { name } = chat
            const time = moment(t * 1000).format('DD/MM HH:mm:ss')
            const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi);
            const argsX = caption || body || ''
            const cmds = argsX.toLowerCase().split(' ')[0] || ''
            const args = argsX.split(' ')
            const prefix = '/'
            const fcount = "7"




            await client.sendSeen(from)

            if (cmds  && cmds.startsWith(prefix) && !cmds.startsWith('/9j/')) {

                if (!isGroupMsg) {
                    console.log(chBlue('[EXEC]'), chBoldWhite(time), chBoldYellow(cmds),'from', chCyan(pushname)) 
                }
                if (isGroupMsg){
                    console.log(chBlue('[EXEC]'), chBoldWhite(time), chBoldYellow(cmds),'from', chCyan(pushname), 'in', chGreen(chat.formattedTitle))
                }


                switch(cmds){
                    case `${prefix}sticker`:
                    case `${prefix}stiker`:

                    try {
                        if (isMedia) {
                            const mediaData = await decryptMedia(message)
                            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                            await client.sendImageAsSticker(from, imageBase64, { author: "Fumiko - @extgfx", pack: "猫BOT Adept", keepScale: 1 })
                        } 
                        else if (quotedMsg && quotedMsg.type == 'image') {

                            const mediaData = await decryptMedia(quotedMsg)
                            const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                            await client.sendImageAsSticker(from, imageBase64, { author: "Fumiko - @extgfx", pack: "猫BOT Adept", keepScale: 1 })
                        } 
                        else if (isMedia && type == 'video') {
                            await client.reply(from, `Whoa! Looks like you're trying to make an animated sticker, try to use either one of these:\n\n/stickergif\n/stikergif\n/gifsticker\n/gifstiker`, message.id)
                        } 
                        else if (quotedMsg && quotedMsg.type == 'video') {
                            await client.reply(from, `Whoa! Looks like you're trying to make an animated sticker, try to use either one of these:\n\n/stickergif\n/stikergif\n/gifsticker\n/gifstiker`, message.id)
                        }
                        else if (args.length == 2) {
                            const stickUrl = args[1]
                            if (stickUrl.match(isUrl)) {
                                await client.sendStickerfromUrl(from, stickUrl, { method: 'get' })
                                .catch(err => console.log('Caught exception: ', err))
                            } else {
                                client.reply(from, 'Not a url.', message.id)
                            } 
                        }
                        else {
                            await client.reply(from, "An image is required to execute this command.", message.id)
                        } 
                    } catch(err) {
                        // await client.reply(from, "An error occured.", message.id)
                    }

                    break


                    case `${prefix}gifsticker`:
                    case `${prefix}gifstiker`:
                    case `${prefix}stickergif`:
                    case `${prefix}stikergif`:

                    try{
                        if(args.length == 2) {
                            const xFps = args[1]
                            if (isMedia && type == "video") {
                                const mediaData = await decryptMedia(message)
                                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                                await client.sendMp4AsSticker(from, imageBase64, { fps: xFps, startTime: `00:00:00.0`, endTime: `00:00:10.0`, loop: 0 , crop: false}, { author: "Fumiko - @extgfx", pack: "猫BOT Adept", keepScale: true });
                            } else if (quotedMsg && quotedMsg.type == 'video'){
                                const mediaData = await decryptMedia(quotedMsg)
                                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                                await client.sendMp4AsSticker(from, imageBase64, { fps: xFps, startTime: `00:00:00.0`, endTime: `00:00:10.0`, loop: 0 , crop: false}, { author: "Fumiko - @extgfx", pack: "猫BOT Adept", keepScale: true });
                            } else {
                                await client.reply(from, "Either a video/gif is required to execute this command.", message.id)
                            }
                        } else if (isMedia && type == "video") {
                            const mediaData = await decryptMedia(message)
                            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                            await client.sendMp4AsSticker(from, imageBase64, { fps: 20, startTime: `00:00:00.0`, endTime: `00:00:10.0`, loop: 0 , crop: false}, { author: "Fumiko - @extgfx", pack: "猫BOT Adept", keepScale: true });
                        } else if (quotedMsg && quotedMsg.type == 'video'){
                            const mediaData = await decryptMedia(quotedMsg)
                            const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                            await client.sendMp4AsSticker(from, imageBase64, { fps: 20, startTime: `00:00:00.0`, endTime: `00:00:10.0`, loop: 0 , crop: false}, { author: "Fumiko - @extgfx", pack: "猫BOT Adept", keepScale: true });
                        }
                        else {
                            await client.reply(from, "Either a video/gif is required to execute this command.", message.id)
                        } 
                    } catch(err) {
                        // await client.reply(from, "An error occured.", message.id)
                    }
                    break


                    case `${prefix}fb`:
                    case `${prefix}facebook`:

                    client.reply(from, `currently disabled due to unknown error`, message.id)

                    // const fbRegex = '(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)'
                    // if (args.length == 2) {
                    //     const fbVidURL = args[1]
                    //     try{
                    //         if (fbVidURL.match(fbRegex)) {

                    //             facebookGetLink(fbVidURL).then(response => {
                    //                 console.log(response)
                    //                 client.sendFileFromUrl(from, response.link, "video.mp4", `⏬Facebook Video Downloader⏬\n\n ℹ️Information\n❕Title: ${response.title}\n💬Caption: ${reponse.caption}`, message.id)
                    //             })
                    //         }
                    //     }
                    //     catch(err){
                    //         await client.reply(from, "An error occured.", message.id)
                    //     }
                    // } else {
                    //     client.reply(from, `Facebook Video URL parameter is required to use this command; i.e. /fb [url] or /facebook [url]`, message.id)
                    // }

                    break

                    case `${prefix}ig`:
                    case `${prefix}instagram`:

                    if (args.length == 2) {

                        const igMedURL = args[1]

                        reqs(`https://api.xteam.xyz/cekey?APIKEY=${xteamApi}`, { json: true }, (err, res, body) => {
                            sleep(6000)
                            console.log(body)
                            if (igMedURL.match(isUrl)) {
                                if (body.response.totalhit < 100) {
                                    reqs(`https://api.xteam.xyz/dl/ig?url=${igMedURL}&APIKEY=${xteamApi}`, {json: true}, (err, res, body)=>{

                                        if (body.code != 400) {
                                            console.log(body)
                                            for (let i = 0; i < body.result.media_count; i++) {
                                            // console.log(body.result)
                                            // const igMediaURL = JSON.stringify(body.result.data[i].data)
                                            client.sendFileFromUrl(from, body.result.data[i].data, "video.mp4", `🤪\n???/100`, message.id)
                                        }
                                    } else {
                                        client.reply(from, `Looks like i couldn't access the video, is the video private?`, message.id)
                                    }
                                })
                                } else {
                                    client.reply(from, `API Error Occured. Mention my owner pls.`, message.id)
                                }
                            } else {
                                client.reply(from, `I don't think that's a URL, mind re-checking it?`, message.id)
                            }
                        })
                    } else if (args.length == 1) {
                        client.reply(from, `Instagram Media URL parameter is required to use this command; i.e. /ig [url] or /instagram [url]`, message.id)
                    } else {
                        client.reply(from, `This feature doesn't support more than 2 arguments!`, message.id)
                    }
                    break

                    case `${prefix}reverse`:
                    if (isMedia) {
                        const mediaData = await decryptMedia(message)
                        const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`

                        const randomName = randomstring.generate({length: 12,charset: 'alphanumeric'});
                        const fullName = `imageStorage/reverse/${randomName}.jpg`

                        const jBinary = fs.writeFile(fullName, mediaData, 'binary', function(err) {
                            console.log(chBlue('[CREATE]'), chBoldWhite(fullName), 'for', chBoldYellow('Reverse Search'), 'created.')
                        })
                        // console.log(imageBase64)
                        await new Promise(r => setTimeout(r, 2000));

                        const resReverse = await sagiriKey(fullName);
                        // console.log(resReverse)

                        const maxArray = Object.keys(resReverse).length
                        // console.log(maxArray)
                        // const getObject = resReverse[between(0,maxArray)]
                        // console.log(getObject)

                        if(maxArray == 1) {
                            const objOne = resReverse[0]
                            client.reply(from, `1. ${objOne.url}\nSite: ${objOne.site}\nSimilarity: ${objOne.similarity}%`, message.id)

                        } else if(maxArray == 2) {
                            const objOne = resReverse[0]
                            const objTwo = resReverse[1]
                            client.reply(from, `1. ${objOne.url}\nSite: ${objOne.site}\nSimilarity: ${objOne.similarity}%\n\n2. ${objTwo.url}\nSite: ${objTwo.site}\nSimilarity: ${objTwo.similarity}%`, message.id)

                        } else if(maxArray >= 3) {
                            const objOne = resReverse[0]
                            const objTwo = resReverse[1]
                            const objThree = resReverse[2]
                            client.reply(from, `1. ${objOne.url}\nSite: ${objOne.site}\nSimilarity: ${objOne.similarity}%\n\n2. ${objTwo.url}\nSite: ${objTwo.site}\nSimilarity: ${objTwo.similarity}%\n\n3. ${objThree.url}\nSite: ${objThree.site}\nSimilarity: ${objThree.similarity}%`, message.id)

                        } else {
                            client.reply(from,`No data found.`,message)
                        }
                    } 
                    else if (quotedMsg && quotedMsg.type == 'image') {

                        const mediaData = await decryptMedia(quotedMsg)
                        const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`

                        const randomName = randomstring.generate({length: 12,charset: 'alphanumeric'});
                        const fullName = `imageStorage/reverse/${randomName}.jpg`

                        const jBinary = fs.writeFile(fullName, mediaData, 'binary', function(err) {
                            console.log(chBlue('[CREATE]'), chBoldWhite(fullName), 'for', chBoldYellow('Reverse Search'), 'created.')
                        })
                        // console.log(imageBase64)
                        await new Promise(r => setTimeout(r, 2000));

                        const resReverse = await sagiriKey(fullName);

                        const maxArray = Object.keys(resReverse).length
                        const getObject = resReverse[between(0,maxArray)]

                        if(maxArray == 1) {
                            const objOne = resReverse[0]
                            client.reply(from, `1. ${objOne.url}\nSite: ${objOne.site}\nSimilarity: ${objOne.similarity}%`, message.id)

                        } else if(maxArray == 2) {
                            const objOne = resReverse[0]
                            const objTwo = resReverse[1]
                            client.reply(from, `1. ${objOne.url}\nSite: ${objOne.site}\nSimilarity: ${objOne.similarity}%\n\n2. ${objTwo.url}\nSite: ${objTwo.site}\nSimilarity: ${objTwo.similarity}%`, message.id)

                        } else if(maxArray >= 3) {
                            const objOne = resReverse[0]
                            const objTwo = resReverse[1]
                            const objThree = resReverse[2]
                            client.reply(from, `1. ${objOne.url}\nSite: ${objOne.site}\nSimilarity: ${objOne.similarity}%\n\n2. ${objTwo.url}\nSite: ${objTwo.site}\nSimilarity: ${objTwo.similarity}%\n\n3. ${objThree.url}\nSite: ${objThree.site}\nSimilarity: ${objThree.similarity}%`, message.id)

                        } else {
                            client.reply(from,`No data found.`,message)
                        }
                    }
                    else {
                        await client.reply(from,'Wrong usage.')
                    }    
                    break

                    

                    case`${prefix}wutanime`:
                    case`${prefix}wait`:

                    if (isMedia) {
                        const mediaData = await decryptMedia(message)
                        const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`

                        const randomName = randomstring.generate({length: 12,charset: 'alphanumeric'});
                        const fullName = `imageStorage/wutanime/${randomName}.jpg`

                        const jBinary = fs.writeFile(fullName, mediaData, 'binary', function(err) {
                            console.log(chBlue('[CREATE]'), chBoldWhite(fullName), 'for', chBoldYellow('Anime Search'), 'created.')
                        })

                        sleep(10000)

                        const imgBB = await imgbbUploader(imgBbAPI, `${fullName}`)
                        const BbUrl = imgBB.url

                        const excWait = await wait.fetchAnime(`${BbUrl}`, { anilistInfo: true });

                        const bodyDocs = excWait.result[0]
                        const intSim = bodyDocs.similarity

                        const strSim = intSim.toString()
                        const shortStrSim = strSim.substring(0,6);

                        const similar = shortStrSim*100

                        if (similar<=95) {
                            client.sendFileFromUrl(from, `${bodyDocs.image}`, "v.jpg", `I have low confidence in this, wild guess:\n${bodyDocs.anilist.title.native}\n${bodyDocs.anilist.title.english}\nEpisode: ${bodyDocs.episode}\nIs Adult: ${bodyDocs.anilist.isAdult}\nSimilarity: ${similar}%`)
                        } else if (similar>95) {
                            client.sendFileFromUrl(from, `${bodyDocs.image}`, "v.jpg",`${bodyDocs.anilist.title.native}\n${bodyDocs.anilist.title.english}\nEpisode: ${bodyDocs.episode}\nIs Adult: ${bodyDocs.anilist.isAdult}\nSimilarity: ${similar}%`)
                        }
                    } else if (quotedMsg && quotedMsg.type == 'image') {
                        const mediaData = await decryptMedia(quotedMsg)
                        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`

                        const randomName = randomstring.generate({length: 12,charset: 'alphanumeric'});
                        const fullName = `imageStorage/wutanime/${randomName}.jpg`

                        const jBinary = fs.writeFile(fullName, mediaData, 'binary', function(err) {
                            console.log(chBlue('[CREATE]'), chBoldWhite(fullName), 'for', chBoldYellow('Anime Search'), 'created.')
                        })

                        sleep(10000)

                        const imgBB = await imgbbUploader("d9bb57dd379ab9915f2020ad9a3e551e", `${fullName}`)
                        const BbUrl = imgBB.url

                        const excWait = await wait.fetchAnime(`${BbUrl}`, { anilistInfo: true });

                        const bodyDocs = excWait.result[0]
                        const intSim = bodyDocs.similarity

                        const strSim = intSim.toString()
                        const shortStrSim = strSim.substring(0,6);

                        const similar = shortStrSim*100

                        if (similar<=95) {
                            client.sendFileFromUrl(from, `${bodyDocs.image}`, "v.jpg", `I have low confidence in this, wild guess:\n${bodyDocs.anilist.title.native}\n${bodyDocs.anilist.title.english}\nEpisode: ${bodyDocs.episode}\nIs Adult: ${bodyDocs.anilist.isAdult}\nSimilarity: ${similar}%`, message.id)
                        } else if (similar>95) {
                            client.sendFileFromUrl(from, `${bodyDocs.image}`, "v.jpg",`${bodyDocs.anilist.title.native}\n${bodyDocs.anilist.title.english}\nEpisode: ${bodyDocs.episode}\nIs Adult: ${bodyDocs.anilist.isAdult}\nSimilarity: ${similar}%`, message.id)
                        }
                    } else {
                        await client.reply(from, `An image for anime reverse search is required to use this feature.`, message.id)
                    }
                    break


                    case '/nobg':
                    if (args.length == 2) {
                        if (args[1] == 'png' || args[1] == 'file') {
                            if (isMedia) {

                                const mediaData = await decryptMedia(message)
                                const base64img = `${mediaData.toString('base64')}`

                                removeBackgroundFromImageBase64({
                                    base64img,
                                    apiKey: removeBgAPI,
                                    size: "regular",
                                    type: "product"
                                }).then((result) => {
                                    client.sendFile(from, `data:image/png;base64,${result.base64img}`, `removeBg.png`, null, message.id, null, null, true )
                                })
                            } else if (quotedMsg && quotedMsg.type == 'image') {

                                const mediaData = await decryptMedia(quotedMsg)
                                const base64img = `${mediaData.toString('base64')}`

                                removeBackgroundFromImageBase64({
                                    base64img,
                                    apiKey: removeBgAPI,
                                    size: "regular",
                                    type: "product"
                                }).then((result) => {
                                    client.sendFile(from, `data:image/png;base64,${result.base64img}`, `removeBg.png`, null, message.id, null, null, true )
                                })
                            } else {
                                await client.reply(from, `An image is required to use this feature.`, message.id)
                            }
                        }
                    } else if (isMedia) {

                        const mediaData = await decryptMedia(message)
                        const base64img = `${mediaData.toString('base64')}`

                        removeBackgroundFromImageBase64({
                            base64img,
                            apiKey: removeBgAPI,
                            size: "regular",
                            type: "product"
                        }).then((result) => {
                            client.sendImageAsSticker(from,`data:image/png;base64,${result.base64img}`)
                        })
                    } else if (quotedMsg && quotedMsg.type == 'image') {

                        const mediaData = await decryptMedia(quotedMsg)
                        const base64img = `${mediaData.toString('base64')}`

                        removeBackgroundFromImageBase64({
                            base64img,
                            apiKey: removeBgAPI,
                            size: "regular",
                            type: "product"
                        }).then((result) => {
                            client.sendImageAsSticker(from,`data:image/png;base64,${result.base64img}`)
                        })
                    } else {
                        await client.reply(from, `An image is required to use this feature.`, message.id)
                    }
                    break


                    case `${prefix}admin`:
                    if (sender.id == "999999999") {
                        if (args.length > 1) {
                            if (args[1] == 'api') {

                                const newApi = args[1]

                                reqs(`https://api.xteam.xyz/cekey?APIKEY=${xteamApi}`, {json: true}, (err, res, body)=>{
                                    client.reply(from, `Current API: ${xteamApi}\nCurrent API Hit: ${body.response.totalhit}/100`, message.id)
                                })

                                const newzApi = JSON.stringify(args[1])
                                const split = newzApi.indexOf()
                                console.log(split)


                            } else if (args[1] == 'retry') {
                                if (quotedMsg && quotedMsg.type == 'image') {
                                    const mediaData = await decryptMedia(quotedMsg)
                                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                                    await client.sendImage(from, imageBase64, 'haha.jpg', 'haha')
                                }

                            }else if (args[1] == 'steal') {
                                if (quotedMsg && quotedMsg.type == 'sticker') {
                                    const mediaData = await decryptMedia(quotedMsg)
                                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                                    // await client.sendRawWebpAsSticker(from, imageBase64)

                                    await client.reply(from, 'Check your private message!', message.id)
                                    await client.sendImage('628992041165@c.us', imageBase64,'te.jpg' ,'Image stolen at your request!')

                                    // const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                                    // await client.sendImage(from, imageBase64, 'haha.jpg', 'haha')
                                } 
                            } else if (args[1] == 'pdf') {
                                const num = args[2]
                                const doujin = new Doujin(num)
                                
                                doujin.validate().then(console.log)
                                doujin.fetch().then(console.log)
                                doujin.save().then(console.log)

                            } else if(args[1] == 'block' || args[1] == 'ban') {
                                // console.log(message)
                                await client.contactBlock(quotedMsg.from)

                            } else if (args[1] == 'unblock' || args[1] == 'unban'){

                                await client.contactUnblock(quotedMsg.from)

                            } else if(args[1] == 'fb') {

                                if (args.length == 3) {
                                    const fbVidURL = args[2]

                                    const isfbUrl = fbVidURL.match(new RegExp(/(facebook|fb).(me|com)/,'ig'))
                                    if (isfbUrl) {

                                        console.log(fbVidURL)
                                        facebookGetLink(fbVidURL).then(response => {
                                            console.log(response)
                                            // client.sendFileFromUrl(from, response.link, "video.mp4", `⏬Facebook Video Downloader⏬\n\n ℹ️Information\n❕Title: ${response.title}\n💬Caption: ${reponse.caption}`, message.id)
                                        })
                                    } else {
                                        console.log('not a fb url')
                                    }
                                } else {
                                    client.reply(from, `Facebook Video URL parameter is required to use this command; i.e. /fb [url] or /facebook [url]`, message.id)
                                }
                            }

                        } else {
                            client.reply(from, `Arguments Needed!`, message.id)
                        }
                    } else {
                        client.reply(from, `tf u tryna do`, message.id)
                    }
                    break

                    case `${prefix}bot`:
                    case `${prefix}help`:
                    case `${prefix}menu`:

                    await client.reply(from, `Hello there.\n\nCurrent prefix: ${prefix}\n\nThere's ${fcount} features for now.\n\nImage based sticker:\n${prefix}sticker\n${prefix}stiker\n\nBackgroundless sticker:\n${prefix}nobg\n\nAnimated sticker:\n${prefix}gifsticker\n${prefix}gifstiker\n${prefix}stickergif\n${prefix}stikergif\n\nFacebook video downloader:\n${prefix}fb\n${prefix}facebook\n\nInstagram media downloader:\n${prefix}ig\n${prefix}instagram\n\nSauce reverse image search:\n${prefix}reverse\n\nAnime search:\n/wait\n/wutanime\n\n猫BOT - Made with 💖 by @extgxfx [fb.me/extgfx]`, message.id)
                    break


                }

            }
        } catch(err) {
            console.log(chBoldRed('[ERROR]'), chBoldWhite('dead'), '\nError Log:\n',err)
        }
        
    });
}