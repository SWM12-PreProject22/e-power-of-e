const libKakaoWork = require('../../libs/kakaoWork');
const places = require('./places.json');
const options = require('./options.json');

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

const generateResultBlock = (placesArr) => {
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
	
	const sections = placesArr.map((place) => 
		({
			type: 'section',
			content: {
				type: 'text',
				text: `[${place.place_name}](${place.place_url})\n거리: ${place.distance}m\n평점: ${place.rating}`,
				markdown: true
			},
			accessory: {
				type: 'image_link',
				url: place.image_url
			}
		})
	);
	
	const toMainBtn = [{
						type: 'button',
						text: '메인으로 돌아가기',
						action_type: 'submit_action',
						action_name: 'to_main',
						value: '{"type": "main"}',
						style: 'default'
					}];
	
    return baseBlocks.concat(sections).concat(toMainBtn);
}

exports.handleRequest = async (req, res, next) => {
	//fill in here
  	res.json({});
};

exports.handleCallback = async (req, res, next) => {
	const {message, value} =req.body;
	const payload = JSON.parse(value).payload || 'entry';
	
	if (options[payload]) { // 세부선택지가 존재하는 경우
		await libKakaoWork.sendMessage({
			conversationId: message.conversation_id,
			text: '원하시는 종류의 장소를 골라주세요',
			blocks: generateOptionBlock(payload),
		});
	} else {	//최종선택지일 경우. 검색결과를 보여준다.
		await libKakaoWork.sendMessage({
			conversationId: message.conversation_id,
			text: '소마센터 주변의 검색 결과입니다.',
			blocks: generateResultBlock(places[payload]),
		});
	}
  	res.json({});
};