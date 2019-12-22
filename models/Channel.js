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

		db.query(query).then(res => {
			console.log("CHANNEL MODEL OK");
			console.log(res);
			def.resolve(JSON.parse(JSON.stringify(res)));
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}
}

module.exports = Channel;