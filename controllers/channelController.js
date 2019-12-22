const Q = require('q');
const Channel = require('../models/Channel');

const channelModel = new Channel();

class channelController {
	getChannels(guildId){
		const def = Q.defer();

			console.log("CHANNELCONTROLLER OK");
		const request = channelModel.getChannels(guildId);
		request.then(data => {
			def.resolve(data.reduce((obj, item) => (
				obj[item.num] = item.channel,
				obj
			), {}));
		}, err => {
			def.reject(err);
		});

		return def.promise;
	}
}

module.exports = channelController;