const Discord = require('discord.js');
const mysql = require('mysql');
const auth = require('./auth.json');

const GuildController = require('./controllers/guildController');
const ChannelController = require('./controllers/channelController');

const guildController = new GuildController();
const channelController = new ChannelController();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'maids'
});

connection.connect(err => {
    if(err){
        throw err;
    }

    console.log('Connected to the database');
});
global.db = connection;

const client = new Discord.Client();

var prefixes = {};
var channels = {};

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.guilds.forEach(guild => {
		guildController.getPrefix(guild.id).then(data => {
			prefixes[guild.id] = data;
		}, err => {
			throw err;
		});

		channelController.getChannels(guild.id).then(data => {
			channels[guild.id] = data;
		}, err => {
			throw err;
		});
	});
});

client.on('guildMemberAdd', member => {
	if(channels[member.guild.id][3] !== undefined){
		client.channels.get(channels[member.guild.id][3]).send(new Discord.RichEmbed()
			.setColor('#00ff7b')
			.setTitle(`New ${member.bot? 'Bot' : 'Member'}`)
			.addField(member.id, member.user.tag)	
			.setImage(member.user.avatarURL)
			.setTimestamp()
		);
	}

	if(member.bot){
		guildController.getRole_type(member.guild.id, 1).then(data => {
			member.addRole(data)
		}, err => {
			throw err;
		});
	} else {
		if(channels[member.guild.id][1] !== undefined){
			client.channels.get(channels[member.guild.id][1])
				.send(`Welcome to the ORSTED Co. crew server, <@${member.id}>!\nPlease check the rules over at <#${channels[member.guild.id][4]}> and wait for an admin to give you the crew role.`)
				.then(console.log(`New member: ${member.tag} - ${member.id}`))
				.catch(console.error);
		}

		guildController.getRole_type(member.guild.id, 0).then(data => {
			member.addRole(data)
		}, err => {
			throw err;
		});
	}
});

client.on('guildMemberRemove', member => {
	if(channels[member.guild.id][3] !== undefined){
		client.channels.get(channels[member.guild.id][3]).send(new Discord.RichEmbed()
			.setColor('#00ff7b')
			.setTitle(`${member.bot? 'Bot' : 'Member'} left the server`)
			.addField(member.id, member.user.tag)
			.setImage(member.user.avatarURL)
			.setTimestamp()
		);
	}

	if(!member.bot && channels[member.guild.id][1] !== undefined){
		client.channels.get(channels[member.guild.id][1])
			.send(`<@${member.id}> has left the server...`)
			.then(console.log(`Member: ${member.user.tag} - ${member.id} has left the server`))
			.catch(console.error);
	}
});

client.on('message', message => {
	if(channels[message.guild.id][3] !== undefined && !message.author.bot && !message.content.startsWith('$') && !message.content.startsWith('!')){
		client.channels.get(channels[message.guild.id][3]).send(new Discord.RichEmbed()
			.setColor('#0099ff')
			.setTitle(`New Message - ${message.attachments.size == 0? 'No' : 'Has'} Attachment`)
			.setAuthor(`${message.author.tag} - ${message.author.id}`, message.author.avatarURL)
			.setDescription(message.channel)
			.addField(message.createdAt, message.content.length == 0? '\u200b' : message.content)	
			.setImage(message.attachments.size == 0? '' : message.attachments.values().next().value.url)
			.setTimestamp()
		);
	}

	if(!message.author.bot && message.content.startsWith(prefixes[message.guild.id])){
		elements = message.content.split(/\s+/).slice(1).map(element => (
			element.toLowerCase()
		));

		cmd = elements[0];
		args = elements.slice(1);

		switch(cmd){
			case 't':
				console.log();
		}
	}
})

client.login(auth.token);