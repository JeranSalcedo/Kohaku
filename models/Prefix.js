const Q = require('q');

class Prefix {
	getPrefix(guildId){
		const def = Q.defer();
		const query = `
			SELECT
				prefix
			FROM prefix
			WHERE
				server = ? AND
				maid = ?
		`;

		db.query(query, [guildId, 0], (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve(JSON.parse(JSON.stringify(data)));
			}
		});

		return def.promise;
	}

	addPrefix(guildId){
		const def = Q.defer();
		const query = `
			INSERT INTO
				prefix
			VALUES (
				?, ?, ?
			)
		`;

		db.query(query, [guildId, 0, '!k '], (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve(data.insertId);
			}
		});

		return def.promise;
	}
}

module.exports = Prefix;