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
			console.log(data.rows);
			if(err){
				def.reject(err);
			} else {
				def.resolve(JSON.parse(JSON.stringify(data)));
			}
		});

		return def.promise;
	}
}

module.exports = Channel;