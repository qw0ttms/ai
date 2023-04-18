const { Client, Events, GatewayIntentBits, EmbedBuilder, codeBlock} = require('discord.js');
const { token } = require('./config.json');
const prefix = "!"
const fs=require("fs")
var tc = []
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { inspect } = require('util');
const {Configuration , OpenAIApi} = require('openai')
const conf = new Configuration({
  apiKey: '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'
})
const openai = new OpenAIApi(conf)
process.on("unhandledRejection", (reason, promise) => {
    console.log(reason, "\n", promise);

  });

  process.on("uncaughtException", (err, origin) => {
    console.log(err, "\n", origin);
  });

  process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(err, "\n", origin);
  });

  process.on("warning", (warn) => {
    console.log(warn);
  });
client.once(Events.ClientReady, c => {
	console.log(`${client.user.username} запущен`)
    const activities = [
        'OSM squad'

    ]
    setInterval(() =>{
        const status = activities[Math.floor(Math.random() * activities.length)];
        client.user.setPresence({activities: [{name: `${status}`}]})

    }, 15000);
});
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction; 
	if(commandName ==="ping"){
		interaction.reply({content:`пинга бота ${client.ws.ping} ms`,ephemeral:true})
	}
	else if (commandName === 'avatar'){
		const user = interaction.options.getUser('user') ?? interaction.user;
		const embeds = new EmbedBuilder()
		.setColor("#160422")
		.setTitle(`Аватар пользователя ${user.tag}`)
		.setDescription(`[Скачать аватарку](${user.avatarURL()})`)
		.setImage(user.avatarURL({size: 1024}))
		interaction.reply({content: null, embeds:[embeds]})
		}
})
client.on("messageCreate", async (message) =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();


    const messageArray = message.content.split("");
    const argumet = messageArray.slice(1);
    const cmd = messageArray[0]


if (command === "eval") {
    if (message.author.id != '751473943491379320'&'852982565593415780') return message.reply('У вас нет доступа к этой команде!');

    const code = args.join(" ")
    if (!code) return message.reply("Укажите код");
try {
    let result = eval(code);
    let out = result;
    if (typeof result !== 'string') {
        out = inspect(result);
    }
    message.delete()
    message.channel.send(out,{code:"js"})
} catch (error) {
    message.channel.send(codeBlock(error))
}

}
if(command === "avatar") {
	message.reply(`${message.author.avatarURL()}`)
}
if(command==='чат'){
    if(message.channel.id === '957730381442986055') return message.reply('<#1097563653840048188> вам сюда!')
    if(tc.includes(message.author.id)) return message.reply('Подождите 10 секунд!')
    tc.push(message.author.id);
    setTimeout(() =>{
        tc.shift()
    } , 10000)
    const q = args.join(' ')
    if(!q) return message.reply('Укажи запрос!')
    let cnl = [{role: 'user' , content: 'You are good man.'}]
    cnl.push({
      role: 'user',
      content: q
    })
  
    await message.channel.sendTyping()
    const result = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: cnl
    })
    message.reply(result.data.choices[0].message)
}
if(command==='img'){
  if(message.channel.id === '957730381442986055') return message.reply('<#1097563653840048188> вам сюда!')
  if(tc.includes(message.author.id)) return message.reply('Подождите 10 секунд!')
  tc.push(message.author.id);
  setTimeout(() =>{
      tc.shift()
  } , 10000)
    const q = args.join(' ')
    if(!q) return message.reply('Укажи запрос!')
    let cnl = [{role: 'user' , content: 'You are good man.'}]
    cnl.push({
      role: 'user',
      content: q
    })
    const result = await openai.createImage({
      prompt: q,
      n: 1,
      size: '1024x1024'
    });
    message.reply(result.data.data[0].url);
}
})

client.login(token);