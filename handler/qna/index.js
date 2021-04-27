const libKakaoWork = require('../../libs/kakaoWork');
const {api} = require('../../libs/kakaoWork/wrapper');
const gql = require('./gql');

const {SelectOption} = require('kakaowork');
const messages = require("./messages");

const mapper = (obj) => {
	const map = new Map();
	return Object.fromEntries(obj.serialize(map));
}

const cachedQNA = new Map();

exports.handleRequest = async (req, res, next) => {
	const {message, value, react_user_id} = req.body;
	const parsedValue = JSON.parse(value);
	console.dir(parsedValue);

	switch (parsedValue.action) {
		case "modal_all_posts": {
			const data = (await gql.getAllQNA()).map((q) => {
				const {title, content} = q;
				cachedQNA.set(q.qnaId, {title, content});
				return new SelectOption(q.title, q.qnaId);
			});

			res.json({
				view: mapper(messages.blockPresets.modal_all_posts(data))
			});
		}
			return;
		case "modal_my_posts": {
			const data = (await gql.getQNAByUserId(react_user_id)).map((q) => {
				const {title, content} = q;
				cachedQNA.set(q.qnaId, {title, content});
				return new SelectOption(q.title, q.qnaId);
			});

			res.json({
				view: mapper(messages.blockPresets.modal_my_posts(data))
			});
		}
			return;
		case 'new_question':
			res.json({
				view: mapper(messages.blockPresets.new_question())
			})
			return;
		default:
			res.json({});
	}
};

exports.handleCallback = async (req, res, next) => {
	const {message, value, actions, react_user_id} = req.body;
	const cid = Number(message.conversation_id);

	const conv = await api.getConversation(cid);

	const parsedValue = JSON.parse(value);
	console.dir(parsedValue);

	switch (parsedValue.action) {
		case "modal_all_posts":
		case "modal_my_posts": {
			const post = cachedQNA.get(actions.open_post);
			if (post === undefined) {
				await conv.sendMessage('', messages.blockPresets.no_post_found(actions.open))
				break;
			} else {
				const {title, content} = post;
				// TODO: 게시글에 답변(comment)이 있으면 답변 보기 버튼 띄우게
				// TODO: 다른 게시글 보기 버튼
				// TODO: 내 게시글인 경우 질문 마감하기 버튼
				conv.sendMessage('', messages.blockPresets.view_post(title, content))
					.catch((e) => {
						console.dir(e.response.config.data);
						console.dir(e.response.data.error);
					});
			}
		}
			break;
		case 'new_question': {
			const {title, text} = actions;
			const {errors, data} = await gql.writeQNA(react_user_id, title, text);

			if (errors !== undefined) {
				console.dir(errors)
				await conv.sendMessage(`게시글을 등록하는데 오류가 발생했습니다 ㅠㅠ`)
					.catch((e) => {
						console.dir(e.response.config.data);
						console.dir(e.response.data.error);
					})
			}

			// TODO: block 으로 바꾸기
			else
				await conv.sendMessage(`게시글이 등록되었습니다!`)
		}
			break;
		case undefined:
		default:
			await conv.sendMessage(
				'', messages.blockPresets.welcome((await gql.getAllQNA()).length)
			);
			break;
	}
	res.json({});
};
