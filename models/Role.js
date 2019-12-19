const Q = require('q');

class Role {
	getRole_type(guildId, type){
		const def = Q.defer();
		const query = `
			SELECT
				role
			FROM role
			WHERE
				server = ? AND
				type = ?
		`;

		db.query(query, [guildId, type], (err, data) => {
			if(err){
				def.reject(err);
			} else {
				def.resolve(JSON.parse(JSON.stringify(data)));
			}
		});

		return def.promise;
	}
}

module.exports = Role;