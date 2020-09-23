const Discord = require('discord.js')
const config = require('./config.json')
const client = new Discord.Client()

client.on('ready', () => {
    console.log(`O bot foi iniciado em '${client.guilds.cache.size}' servidor(es)!`)
    client.user.setActivity(`Estou em ${client.guilds.cache.size} servidores`)
})

client.on('guildCreate', guild =>{ 
    console.log(`O bot entrou no servidor ${guild.name} (id: ${guild.id}). População: ${guild.memberCount}`)
    client.user.setActivity(`Estou em ${client.guilds.cache.size} servidores`)
})

client.on('guildDelete', guild => { 
    console.log(`O bot foi removido do servidor: ${guild.name}`)
    client.user.setActivity(`Estou em ${client.guilds.cache.size} servidores`)
})


client.on('message', async msg => { 
    
    if(msg.author.bot) return //Verificar se o autor é um bot
    if(msg.channel.type === 'dm') return //Verificar se não é mensagem privadaa
    
    const msgContent = msg.content.split(" ")
    const comandObj = ValidateAndSplitComand(msgContent)
    if (comandObj != false){
        if (comandObj.comand === 'debug'){
            msg.reply(`DEBUGANDO PRA TU!`)
        }else if(comandObj.comand === 'mute'){
            if(comandObj.param === 'all'){
                let voiceChannel = msg.member.voice.channel
                if (voiceChannel != null){
                    msg.channel.send(`Ok, ${msg.author}, mutando geral 🤫`)
                    for (let member of voiceChannel.members) {
                        let memberVoiceIndividual = member[1].voice
                        if (!memberVoiceIndividual.serverMute) await memberVoiceIndividual.setMute(true) 
                    }
                }else {
                    msg.channel.send(`${msg.author}, mano, tu tem que entrar em voiceChannel pra eu poder mutar 🤔`)
                }
            }else if(comandObj.param === 'me'){
                let voiceIndividual = msg.member.voice
                await voiceIndividual.setMute(true)
                msg.channel.send(`Ta mutado, ${msg.author} 🤐`)
            }else {
                msg.channel.send(`Foi mal ${msg.author}, quem que tu quer mutar mesmo ? 🤔`)
            }
        }else if(comandObj.comand === 'unmute'){
            if(comandObj.param === 'all'){
                let voiceChannel = msg.member.voice.channel
                if (voiceChannel != null){
                    msg.channel.send(`Ok, ${msg.author}, DESmutando geral 🙆‍♂️`)
                    for (let member of voiceChannel.members) {
                        let memberVoiceIndividual = member[1].voice
                        if (memberVoiceIndividual.serverMute) await memberVoiceIndividual.setMute(false)
                    }
                }else {
                    msg.channel.send(`${msg.author}, mano, tu tem que entrar em voiceChannel pra eu poder mutar 🤔`)
                }
            }else if(comandObj.param === 'me'){
                let voiceIndividual = msg.member.voice
                await voiceIndividual.setMute(false)
                msg.channel.send(`Ta DESmutado, ${msg.author} 🙋‍♂️`)
            }else {
                msg.channel.send(`Foi mal ${msg.author}, quem que tu quer DESmutar mesmo ? 🤔  EX: ${config.prefix} mute/all`)
            }
        }else {
            msg.channel.send(`Putz ${msg.author},não conheço esse comando! 😓`)
        }
    }

})

function ValidateAndSplitComand(msgContent) {
    if (msgContent[0] === config.prefix){
        const preComand = msgContent.slice(1)
        var comand = ''
        for (let keys in preComand){
            comand += preComand[keys].toLowerCase()
        } 
        let param = comand.split('/')[1] 
        comand = comand.split('/')[0]
        return {
            comand: comand,
            param: param
        }
    }else {
        return false
    }
}    
client.login(config.token)