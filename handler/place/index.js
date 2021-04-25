const libKakaoWork = require('../../libs/kakaoWork');
const libKakaoLocal = require('../../libs/kakaoLocal');

const options = {
	'entry': ['음식점', '카페'],
	'음식점': ['한식', '중식', '일식', '양식', '야식'],
	'일식': ['초밥', '회', '돈까스'],
	'야식': ['피자', '치킨']
}

const generateOptionBlock = (category) => {
	const baseBlocks = [
		{
			type: 'header',
			text: 'SWM12 장소찾기',
			style: 'blue'
		},
		{
			type: 'text',
			text: '원하는 종류의 장소를 선택해주세요',
			markdown: true
		},
		{
			type: 'divider'
		},
	];
	if (!options[category]) {
		return baseBlocks;
	}
	
	const buttons = options[category].map((item) => 
		({
			type: 'button',
			text: item,
			action_type: 'submit_action',
			action_name: 'select_option',
			value: `{"type":"place", "payload":"${item}"}`
		})
	);
    return baseBlocks.concat(buttons);
}

const generateResultBlock = (places) => {
	const baseBlocks = [
		{
			type: 'header',
			text: 'SWM12 장소찾기',
			style: 'blue'
		},
		{
			type: 'text',
			text: '소마센터 주변의 검색 결과입니다.',
			markdown: true
		},
		{
			type: 'divider'
		},
	];
	const sections = places.map((place) => 
		({
			type: 'section',
			content: {
				type: 'text',
				text: `[${place.place_name}](${place.place_url})\n거리: ${place.distance}m`,
				markdown: true
			},
			accessory: {
				type: 'image_link',
				url: ''
			}
		})
	);
    return baseBlocks.concat(sections);
}

exports.handleRequest = async (req, res, next) => {
	//fill in here
  	res.json({});
};

exports.handleCallback = async (req, res, next) => {
	const {message, value} =req.body;
	const payload = JSON.parse(value).payload;
	
	if (options[payload]) { // 세부선택지가 존재하는 경우
		await libKakaoWork.sendMessage({
			conversationId: message.conversation_id,
			text: '원하시는 종류의 장소를 골라주세요',
			blocks: generateOptionBlock(payload),
		});
	} else {	//최종선택지일 경우. 검색결과를 보여준다.
		const places = await libKakaoLocal.getPlaceList(payload);
		await libKakaoWork.sendMessage({
			conversationId: message.conversation_id,
			text: '소마센터 주변의 검색 결과입니다.',
			blocks: generateResultBlock(places),
		});
	}
  	res.json({});
};