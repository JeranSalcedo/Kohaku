const Discord = require('discord.js');
const mysql = require('mysql');
const auth = require('./auth.json');

const GuildController = require('./controllers/guildController');

const guildController = new GuildController();

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

client.on('ready', evt => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.guilds.forEach(guild => {
		guildController.checkPrefix(guild.id);
	});
});

client.on('guildMemberAdd', member => {

});

client.on('message', message => {
	console.log(message);
})

client.login(auth.token);