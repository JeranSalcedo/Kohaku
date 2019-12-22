const Q = require('q');

class Role {
	getRole_type(guildId, type){
		const def = Q.defer();
		const query = `
			SELECT
				role
			FROM role
			WHERE
				server = '${guildId}' AND
				type = ${type}
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
}

module.exports = Role;