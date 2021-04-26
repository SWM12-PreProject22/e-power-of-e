const libKakaoWork = require('../../libs/kakaoWork');
const messages = require("./messages");

exports.handleRequest = async (req, res, next) => {
	const { message, value } = req.body;
	const parsedValue = JSON.parse(value);
	console.dir(parsedValue);

	switch (parsedValue.action) {
		case "modal_all_posts":
			res.json({
				view: {
					title: 'QnA 전체 게시글',
					accept: '확인',
					decline: '취소',
					value: `{"type": "qna", "action": "modal_all_posts"}`,
					blocks: [
						{
							type: 'label',
							text: '전체 게시글',
							markdown: true
						},
						{
							type: 'select',
							name: 'open_post',
							required: true,
							placeholder: '게시글 선택',
							options: [
								{
									text: 'TypeScript 에서 오류가 나요',
									value: '1'
								},
								{
									text: 'eslint를 꼭 써야할까요',
									value: '2'
								}
							]
						}
					]
				}
			});
			return;
		case "modal_my_posts":
			res.json({
				view: {
					title: 'QnA 내 게시글',
					accept: '확인',
					decline: '취소',
					value: `{"type": "qna", "action": "modal_all_posts"}`,
					blocks: [
						{
							type: 'label',
							text: '내 게시글',
							markdown: true
						},
						{
							type: 'select',
							name: 'open_post',
							required: true,
							placeholder: '게시글 선택',
							options: [
								{
									text: 'TypeScript 에서 오류가 나요',
									value: '1'
								},
								{
									text: 'eslint를 꼭 써야할까요',
									value: '2'
								}
							]
						}
					]
				}
			});
			return;
		default:
  			res.json({});
	}
};

exports.handleCallback = async (req, res, next) => {
	const { message, value } = req.body;
	const cid = Number(message.conversation_id);

	const parsedValue = JSON.parse(value);
	console.dir(parsedValue);

	switch (parsedValue.action) {
		case undefined:
		default:
			await libKakaoWork.sendMessage({
				conversationId: cid,
				text: "Hello",
				blocks: messages.blockPresets.welcome(2).serialize()
			});
	}
	res.json({});
};
