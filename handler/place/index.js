const libKakaoWork = require('../../libs/kakaoWork');

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
	} else {
		//TODO: api 검색결과 보여주기
	}
  	res.json({});
};