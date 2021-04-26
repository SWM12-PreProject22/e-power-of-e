const libKakaoWork = require('../../libs/kakaoWork');
const { api } = require('../../libs/kakaoWork/wrapper');
const { SelectOption } = require('kakaowork');
const messages = require("./messages");

const mapper = (obj) => {
	const map = new Map();
	return Object.fromEntries(obj.serialize(map));
}

exports.handleRequest = async (req, res, next) => {
	const { message, value } = req.body;
	const parsedValue = JSON.parse(value);
	console.dir(parsedValue);

	switch (parsedValue.action) {
		case "modal_all_posts":
			res.json({
				view: mapper(messages.blockPresets.modal_all_posts([
					new SelectOption('게시글 1', '1'),
					new SelectOption('게시글 2', '2'),
					new SelectOption('게시글 3', '3')
				]))
			});
			return;
		case "modal_my_posts":
			res.json({
				view: mapper(messages.blockPresets.modal_my_posts([
					new SelectOption('게시글 1', '1'),
					new SelectOption('게시글 3', '3')
				]))
			});
			return;
		default:
  			res.json({});
	}
};

exports.handleCallback = async (req, res, next) => {
	const { message, value, actions } = req.body;
	const cid = Number(message.conversation_id);

	const conv = await api.getConversation(cid);

	const parsedValue = JSON.parse(value);
	console.dir(parsedValue);

	switch (parsedValue.action) {
		case "modal_all_posts":
		case "modal_my_posts":
			await conv.sendMessage(`Post: ${actions.open_post}`);
			break;
		case undefined:
		default:
			await conv.sendMessage(
				'', messages.blockPresets.welcome(2)
			);
			break;
	}
	res.json({});
};
