const Q = require('q');
const Prefix = require('../models/Prefix');
const Role = require('../models/Role');
const Alarm = require('../models/Alarm');

const prefixModel = new Prefix();
const roleModel = new Role();
const alarmModel = new Alarm();

class guildController {
	getPrefix(guildId){
		const def = Q.defer();

		const checkRequest = prefixModel.getPrefix(guildId);
		checkRequest.then(data => {
			if(data.length == 0){
				const addRequest = prefixModel.addPrefix(guildId);
				addRequest.then(data => {
					def.resolve('!k ');
				}, err => {
					def.reject(err);
				});
			} else {
				def.resolve(data[0].prefix);
			}
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}

	getRole_type(guildId, type){
		const def = Q.defer();

		const request = roleModel.getRole_type(guildId, type);
		request.then(data => {
			if(data.length == 0){
					def.resolve('');
			} else {
				def.resolve(data[0].role);
			}
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}

	setAlarm(guildId, time, message){
		const def = Q.defer();

		console.log('a');
		const checkRequest = alarmModel.getAlarm(guildId, time);
		checkRequest.then(data => {
			if(data.length == 0){
		console.log('c');
				const addRequest = alarmModel.addAlarm(guildId, time, message);
				addRequest.then(data => {
					def.resolve({guildId, time, message});
				}, err => {
					def.reject(err);
				});
			} else {
				def.resolve({guildId, time, message});
			}
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}
}

module.exports = guildController;