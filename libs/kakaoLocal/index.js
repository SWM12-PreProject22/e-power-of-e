const Config = require('config');

const axios = require('axios');
const kakaoDevInstance = axios.create({
	baseURL: 'https://dapi.kakao.com',
	headers: {
		Authorization: `KakaoAK ${Config.keys.kakaoLocalAPI}`,
 	},
	host: 'dapi.kakao.com',
});

exports.getPlaceList = async (query) => {
	const NUM_MAX_ITEMS = 3;
	try {
		const res = await kakaoDevInstance.get('/v2/local/search/keyword.json', {
			params: {
				query: query,
				x: '127.044854487099',
				y: '37.5037441420961',
				radius: 350,
				sort: 'distance',
			}
		});
		return res.data.documents.slice(0,NUM_MAX_ITEMS);
	} catch(e) {
		console.log(e);
		return [];
	}
};