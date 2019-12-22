const Q = require('q');

class Channel {
	getChannels(guildId){
		const def = Q.defer();
		const query = `
			SELECT
				channel,
				num
			FROM channel_preference
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
}

module.exports = Channel;