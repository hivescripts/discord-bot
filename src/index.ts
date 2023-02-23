import { Client, Collection, SlashCommandBuilder } from 'discord.js'
require('dotenv').config()

import { activities } from './activities'

const client = new Client({
    intents: [
        'Guilds', 'GuildMembers'
    ],
})

client.commands = new Collection()

client.commands.set('ping', {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    async execute(interaction: any) {
        await interaction.reply('Pong!')
    }
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) return

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`)

    // deploy global commands
    client.application?.commands.set(client.commands.map(command => command.data))

    setInterval(() => {
        const activity = activities[Math.floor(Math.random() * activities.length)]
        client.user?.setPresence({
            status: 'idle',
            activities: [{ name: activity.text, type: activity.type }]
        })
    }, 1000 * 6)
})

process.on('SIGINT', () => {
    client.user?.setPresence({
        status: 'invisible',
        activities: []
    })
    process.exit(0)
})

client.login(process.env.TOKEN)