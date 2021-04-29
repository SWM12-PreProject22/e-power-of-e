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
	const qnaId = parsedValue.qna_id;

	console.dir(parsedValue);

	switch (parsedValue.action) {
		case "modal_all_posts": {
			const data = (await gql.getAllQNA()).map((q) => {
				const {title, content, comment, qnaId, id} = q;
				cachedQNA.set(q.qnaId, {title, content, comment, id});
				return new SelectOption(q.title, q.qnaId);
			});

			res.json({
				view: mapper(messages.blockPresets.modal_all_posts(data))
			});
		}
			return;
		case "modal_my_posts": {
			const data = (await gql.getQNAByUserId(react_user_id))
				.filter((q) => q.status)
				.map((q) => {
						const {title, content, comment} = q;
						cachedQNA.set(q.qnaId, {title, content, comment, id: react_user_id});
						return new SelectOption(q.title, q.qnaId);
					}
				);

			res.json({
				view: mapper(messages.blockPresets.modal_my_posts(data))
			});
		}
			return;
		case 'new_question':
			res.json({
				view: mapper(messages.blockPresets.new_question())
			});
			return;
		case 'modal_all_comments': {
			const post = await gql.getQNAByPostId(qnaId);
			let anonymousMap = {};
			let anonymousCnt = 1;
			post.comment.forEach(comment => {
				if (!anonymousMap[comment.id]) {
					if (comment.id === post.id) {
						anonymousMap[comment.id] = '작성자';
					} else {
						anonymousMap[comment.id] = `익명${anonymousCnt++}`;
					}
				}
				comment.anonymousId = anonymousMap[comment.id];
			});
			res.json({
				view: mapper(messages.blockPresets.modal_all_comments(post.comment))
			});
		}
			return;
		case 'modal_select_best_comment': {
			const post = await gql.getQNAByPostId(qnaId);
			let anonymousMap = {};
			let anonymousCnt = 1;
			post.comment.forEach(comment => {
				if (!anonymousMap[comment.id]) {
					if (comment.id === post.id) {
						anonymousMap[comment.id] = '작성자';
					} else {
						anonymousMap[comment.id] = `익명${anonymousCnt++}`;
					}
				}
				comment.anonymousId = anonymousMap[comment.id];
			});
			res.json({
				view: mapper(messages.blockPresets.modal_select_best_comments(react_user_id, post.qnaId, post.comment))
			});
		}
			return;
		case 'modal_write_comment':
			res.json({
				view: mapper(messages.blockPresets.modal_write_comment(qnaId))
			});
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
			const post = await gql.getQNAByPostId(actions.open_post);
			if (post === undefined) {
				await conv.sendMessage('', messages.blockPresets.no_post_found(actions.open))
				break;
			} else {
				const {title, content, comment} = post;
				const numComments = comment ? comment.length : 0;
				conv.sendMessage('',
					(parsedValue.action === "modal_my_posts")
						? messages.blockPresets.view_my_post(title, content, numComments, actions.open_post)
						: messages.blockPresets.view_post(title, content, numComments, actions.open_post)
				).catch((e) => {
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
			else
				await conv.sendMessage(
					`게시글이 성공적으로 등록되었습니다!`,
					messages.blockPresets.post_registered((await gql.getAllQNA()).length)
				);
		}
			break;
		case 'new_comment': {
			const {text} = actions;
			const qnaId = parsedValue.qna_id;
			const {errors, data} = await gql.writeComment(react_user_id, qnaId, text);

			if (errors !== undefined) {
				console.dir(errors)
				await conv.sendMessage(`답변을 등록하는데 오류가 발생했습니다 ㅠㅠ`)
					.catch((e) => {
						console.dir(e.response.config.data);
						console.dir(e.response.data.error);
					})
			} else
				await conv.sendMessage(
					`답변이 성공적으로 등록되었습니다!`,
					messages.blockPresets.comment_registered()
				);
		}
			break;
		case 'select_best_comment':
			const {info} = actions;
			const {userId, postId, answererId, commentHead} = JSON.parse(info);
			const post = await gql.getQNAByPostId(postId);
			if (post === undefined) {
				await conv.sendMessage(`해당 게시글을 찾을 수 없습니다. (#${postId})`)
				break;
			}

			const result = await gql.closeQNA(userId, postId, answererId);
			const {errors, data} = result;

			if (errors !== undefined) {
				console.dir(errors)
				await conv.sendMessage(`채택하는데 오류가 발생했습니다 ㅠㅠ`)
					.catch((e) => {
						console.dir(e.response.config.data);
						console.dir(e.response.data.error);
					})
			} else {
				await conv.sendMessage('',
					messages.blockPresets.select_comment_success(post.title, commentHead));

				const commentWriter = await api.getUser(Number(answererId));
				if (commentWriter !== undefined)
					await api.openConversation(commentWriter.id).then(async (u) => {
						await u.sendMessage('',
							messages.blockPresets.selected_my_comment(post.title, commentHead))
							.catch((e) => {
								console.dir(e.response.config.data);
								console.dir(e.response.data.error);
							});
					}).catch((e) => {
						console.dir(e.response.config.data);
						console.dir(e.response.data.error);
					});
				;
			}
			break;
		case 'do_nothing':
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
