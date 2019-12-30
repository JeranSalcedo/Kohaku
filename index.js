const Discord = require('discord.js');
const { Client } = require('pg');
const CronJob = require('cron').CronJob;

const GuildController = require('./controllers/guildController');
const ChannelController = require('./controllers/channelController');

const guildController = new GuildController();
const channelController = new ChannelController();

const connection = new Client({
	connectionString: process.env.DATABASE_URL,
	ssl: true
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
				.then(console.log(`New member: ${member.user.tag} - ${member.id}`))
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
			.setColor('#272727')
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
	if(message.content.length < 1000){
		if(message.channel.type === 'dm'){
			if(message.content.startsWith('!k ')){
				elements = message.content.split(/ +/).slice(1);

				cmd = elements[0];
				args = elements.slice(1);

				switch(cmd.toLowerCase()){
					case 'sm':
					case 'sendmessage':
						if(args.length < 3 || args[0].replace(/\D/g,'').length < 18 || args[1].replace(/\D/g,'').length < 18){
							message.channel
								.send(`Command format is:\n\t!k ${cmd} *<server> <channel> <message>*`)
								.then(console.log(`Sent message: ${message.content}`))
								.catch(console.error);
						} else {
							client.guilds.get(args[0]).channels.get(args[1])
								.send(args.slice(2).join(' '))
								.then(console.log(`Sent message: ${message.content}`))
								.catch(console.error);

							message.channel
								.send(`Message sent to ${client.guilds.get(args[0]).name}: ${client.guilds.get(args[0]).channels.get(args[1]).name}`)
								.then(console.log(`Sent message: ${message.content}`))
								.catch(console.error);
						}
				}
			}
		} else {
			if(message.author.id === '655865403876311101'){
				switch(message.content){
					case 'Channel preferences updated!':
						message.channel
							.send(`Got it, <@655865403876311101>-chan!`)
							.then(console.log(`Sent message: ${message.content}`))
							.catch(console.error);

						channelController.getChannels(message.guild.id).then(data => {
							channels[guild.id] = data;
							console.log(data);
						}, err => {
							throw err;
						});
				}
			}

			if(channels[message.guild.id] !== undefined && channels[message.guild.id][3] !== undefined && !message.author.bot && !message.content.startsWith('$') && !message.content.startsWith('!')){
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

			if(!message.author.bot && message.member.hasPermission('ADMINISTRATOR') && message.content.startsWith(prefixes[message.guild.id])){
				elements = message.content.split(/ +/).slice(1);

				cmd = elements[0].toLowerCase();
				args = elements.slice(1);

				switch(cmd){
					case 'gi':
					case 'getid':
						if(args.length < 1 || args[0].replace(/\D/g,'').length < 18){
							message.channel
								.send(`Command format is:\n\t${prefixes[message.guild.id]}${cmd} *<channel/role/user>*`)
								.then(console.log(`Sent message: ${message.content}`))
								.catch(console.error);
						} else {
							message.channel
								.send(`Id:\n\t${args[0].replace(/\D/g,'')}`)
								.then(console.log(`Sent message: ${message.content}`))
								.catch(console.error);
						}

						break;

					case 'sm':
					case 'sendmessage':
						if(args.length < 2 || args[0].replace(/\D/g,'').length < 18){
							message.channel
								.send(`Command format is:\n\t${prefixes[message.guild.id]}${cmd} *<channel> <message>*`)
								.then(console.log(`Sent message: ${message.content}`))
								.catch(console.error);
						} else {
							message.guild.channels.find(channel => (
								channel.id == args[0].replace(/\D/g,'')
							))
							.send(args.slice(1).join(' '))
							.then(console.log(`Sent message: ${message.content}`))
							.catch(console.error);

							if(channels[message.guild.id] !== undefined && channels[message.guild.id][0] !== undefined){
								message.guild.channels.get(channels[message.guild.id][0])
									.send(`Message sent to ${message.guild.channels.find(channel => (
										channel.id == args[0].replace(/\D/g,'')
									)).name}`)
									.then(console.log(`Sent message: ${message.content}`))
									.catch(console.error);
							}
						}

						break;

					case 'aa':
					case 'addalarm':
						if(
							args.length < 4 ||
							args[0].replace(/\D/g,'').length < 2||
							args[1].replace(/\D/g,'').length < 2 ||
							args[2].replace(/\D/g,'').length < 2 ||
							parseInt(args[0].replace(/\D/g,''), 10) > 23 ||
							parseInt(args[1].replace(/\D/g,''), 10) > 59 ||
							parseInt(args[2].replace(/\D/g,''), 10) > 59
						){
							message.channel
								.send(`Command format is:\n\t${prefixes[message.guild.id]}${cmd} *<hours> <minutes> <seconds> <message>*`)
								.then(console.log(`Sent message: ${message.content}`))
								.catch(console.error);
						} else {
							console.log("created");
							var temp = new CronJob('* * * * * *', () => {
								console.log(args.slice(3).join(' '));
							}, null, true, 'Asia/Tokyo');
							// console.log()
							// message.guild.channels.find(channel => (
							// 	channel.id == args[0].replace(/\D/g,'')
							// ))
							// .send(args.slice(1).join(' '))
							// .then(console.log(`Sent message: ${message.content}`))
							// .catch(console.error);

							if(channels[message.guild.id] !== undefined && channels[message.guild.id][0] !== undefined){
								message.guild.channels.get(channels[message.guild.id][0])
									.send(`Alarm has been set:\n\t${args[0]}:${args[1]}:${args[2]} - ${args.slice(3).join(' ')}`)
									.then(console.log(`Sent message: ${message.content}`))
									.catch(console.error);
							}
						}
				}
			}
		}
	}	
});

client.on('messageDelete', message => {
	if(message.content.length < 1000){
		if(channels[message.guild.id] !== undefined){
			if(channels[message.guild.id][3] !== undefined){
				if(message.channel.id === channels[message.guild.id][3] && message.author.id === client.user.id){
					client.channels.get(channels[message.guild.id][3]).send(new Discord.RichEmbed()
						.setColor('#ff3636')
						.setTitle(`${message.embeds[0].title}`)
						.setAuthor(`${message.embeds[0].author.name}`, message.embeds[0].author.iconURL)
						.setDescription(message.embeds[0].description)
						.addField(message.embeds[0].fields[0].name, message.embeds[0].fields[0].value)	
						.setImage(message.embeds[0].image === null? '' : message.embeds[0].image.url)
						.setTimestamp()
					);
				} else {
					client.channels.get(channels[message.guild.id][3]).send(new Discord.RichEmbed()
						.setColor('#ff710c')
						.setTitle(`Message Deleted - ${message.attachments.size == 0? 'No' : 'Has'} Attachment`)
						.setAuthor(`${message.author.tag} - ${message.author.id}`, message.author.avatarURL)
						.setDescription(message.channel)
						.addField(message.createdAt, message.content.length == 0? '\u200b' : message.content)	
						.setImage(message.attachments.size == 0? '' : message.attachments.values().next().value.url)
						.setTimestamp()
					);
				}
			}
		}
	}
});

client.on('messageUpdate', (oldMessage, newMessage) => {
	if(oldMessage.content.length < 1000 && newMessage.content.length < 1000){
		if(channels[oldMessage.guild.id][3] !== undefined && !oldMessage.author.bot){
			client.channels.get(channels[oldMessage.guild.id][3]).send(new Discord.RichEmbed()
				.setColor('#ffc35e')
				.setTitle(`Message Edited - ${oldMessage.attachments.size == 0? 'No' : 'Has'} Attachment`)
				.setAuthor(`${oldMessage.author.tag} - ${oldMessage.author.id}`, oldMessage.author.avatarURL)
				.setDescription(oldMessage.channel)
				.addField(oldMessage.content.length == 0? '\u200b' : oldMessage.content, newMessage.content.length == 0? '\u200b' : newMessage.content)	
				.setImage(oldMessage.attachments.size == 0? '' : oldMessage.attachments.values().next().value.url)
				.setTimestamp()
			);
		}
	}
});

client.login(process.env.BOT_TOKEN);