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
				server = ${guildId}
		`;

			console.log("CHANNEL MODEL OK");
		db.query(query).then(res => {
			console.log(res);
			def.resolve(JSON.parse(JSON.stringify(res)));
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}
}

module.exports = Channel;