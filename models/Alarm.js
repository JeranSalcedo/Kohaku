const Q = require('q');

class Alarm {
	getAlarm(guildId, time){
		const def = Q.defer();
		const query = `
			SELECT
				message
			FROM alarm
			WHERE
				server = '${guildId}' AND
				time = '${time}'
		`;

		db.query(query, (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve(data.rows);
			}
		});

		return def.promise;
	}

	getAlarm_guild(guildId){
		const def = Q.defer();
		const query = `
			SELECT
				time,
				message
			FROM alarm
			WHERE
				server = '${guildId}'
		`;

		db.query(query, (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve(data.rows);
			}
		});

		return def.promise;
	}

	addAlarm(guildId, time, message){
		console.log('d');
		const def = Q.defer();
		const query = `
			INSERT INTO
				alarm
			VALUES (
				'${guildId}', '${time}', '${message}'
			)
		`;

		db.query(query, (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve();
			}
		});

		return def.promise;
	}

	updateAlarm(guildId, time, message){
		const def = Q.defer();
		const query = `
			UPDATE
				alarm
			SET 
				message = '${message}'
			WHERE
				server = '${guildId}' AND
				time = '${time}'
		`;

		db.query(query, (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve();
			}
		});

		return def.promise;
	}
}

module.exports = Alarm;