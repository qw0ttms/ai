const { SlashCommandBuilder, Routes , PermissionFlagsBits,ContextMenuCommandBuilder, ApplicationCommandType} = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');

const commands = [     
new SlashCommandBuilder().setName("ping").setDescription("Проверить бота"),
new SlashCommandBuilder().setName("avatar").setDescription("Посмотреть аватар пользователя")
.addUserOption(option=>
    option.setName("user")
    .setDescription("Выбрать пользователя")
    .setRequired(false)),

new SlashCommandBuilder().setName("mute").setDescription("Выдать мут")
.addUserOption(option=>
    option.setName("user")
    .setDescription("Выбрать пользователя")
    .setDescription(false))
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Команды обновлены!'))
    .catch(console.error);