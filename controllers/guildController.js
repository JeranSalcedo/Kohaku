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

		const checkRequest = alarmModel.getAlarm(guildId, time);
		checkRequest.then(data => {
			if(data.length == 0){
				const addRequest = alarmModel.addAlarm(guildId, time, message);
				addRequest.then(data => {
					def.resolve({guildId, time, message});
				}, err => {
					def.reject(err);
				});
			} else {
				const updateRequest = alarmModel.updateAlarm(guildId, time, message);
				addRequest.then(data => {
					def.resolve({guildId, time, message});
				}, err => {
					def.reject(err);
				});
			}
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}

	getAlarms(guildId){
		const def = Q.defer();

		const request = alarmModel.getAlarm_guild(guildId);
		request.then(data => {
			if(data.length == 0){
				def.resolve('');
			} else {
				def.resolve(data);
			}
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}
}

module.exports = guildController;