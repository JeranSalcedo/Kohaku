const Q = require('q');

class Prefix {
	getPrefix(guildId){
		const def = Q.defer();
		const query = `
			SELECT
				prefix
			FROM prefix
			WHERE
				server = '${guildId}' AND
				maid = '0'
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

	addPrefix(guildId){
		const def = Q.defer();
		const query = `
			INSERT INTO
				prefix
			VALUES (
				'${guildId}', '0', '!k '
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

module.exports = Prefix;