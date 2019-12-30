const Q = require('q');

class Alarm {
	getAlarm(guildId, time){
		const def = Q.defer();
		const query = `
			SELECT
				alarm
			FROM role
			WHERE
				server = '${guildId}' AND
				time = ${time}
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