const Q = require('q');

class Alarm {
	getAlarm(guildId, time){
		console.log('b');
		const def = Q.defer();
		const query = `
			SELECT
				message
			FROM alarm
			WHERE
				server = '${guildId}' AND
				time = ${time}
		`;

		db.query(query, (err, data) => {
			if(err){
		console.log('e');
				def.reject(err);
			} else {
		console.log('f');
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
}

module.exports = Alarm;