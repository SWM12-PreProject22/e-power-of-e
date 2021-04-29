const express = require('express');
const router = express.Router();

const libKakaoWork = require('../libs/kakaoWork');
const noticeHandler = require('../handler/notice');
const placeHandler = require('../handler/place');
const qnaHandler = require('../handler/qna');
const mentoringHandler = require('../handler/mentoring');

const mainBlocks = [
  {
    type: 'header',
    text: 'SWM12',
    style: 'blue',
  },
  {
    type: 'text',
    text: '안녕하세요. SW마에스트로 활동을 도와주는 챗봇 *e의e승*이에요.',
    markdown: true,
  },
  {
    type: 'text',
    text: '아래 버튼을 눌러서 제가 무엇을 도와드릴 수 있는지 확인해볼까요?',
    markdown: true,
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    text: '공지사항 확인하기',
    action_type: 'submit_action',
    action_name: 'entry',
    value: '{"type": "notice"}',
    style: 'default',
  },
  {
    type: 'button',
    text: '센터주변 맛집/카페 알아보기',
    action_type: 'submit_action',
    action_name: 'entry',
    value: '{"type": "place"}',
    style: 'default',
  },
  {
    type: 'button',
    text: '다른 연수생에게 질문하기',
    action_type: 'submit_action',
    action_name: 'entry',
    value: '{"type": "qna"}',
    style: 'default',
  },
  {
    type: 'button',
    text: '멘토링 동료찾기',
    action_type: 'submit_action',
    action_name: 'entry',
    value: '{"type": "mentoring"}',
    style: 'default',
  },
];

router.get('/', async (req, res, next) => {
  const users = await libKakaoWork.getUserList();

  const conversations = await Promise.all(
    users.map((user) => libKakaoWork.openConversations({ userId: user.id }))
  );

  const messages = await Promise.all([
    conversations.map((conversation) =>
      libKakaoWork.sendMessage({
        conversationId: conversation.id,
        text: 'e의e승봇',
        blocks: mainBlocks,
      })
    ),
  ]);

  res.json({});
});

router.post('/request', async (req, res, next) => {
  const { value } = req.body;
  const valueParsed = JSON.parse(value);

  switch (valueParsed.type) {
    case 'notice':
      await noticeHandler.handleRequest(req, res, next);
      break;
    case 'place':
      await placeHandler.handleRequest(req, res, next);
      break;
    case 'qna':
      await qnaHandler.handleRequest(req, res, next);
      break;
    case 'mentoring':
      await mentoringHandler.handleRequest(req, res, next);
      break;
    default:
  }
});

router.post('/callback', async (req, res, next) => {
  const { message, value } = req.body;
  const valueParsed = JSON.parse(value);

  switch (valueParsed.type) {
    case 'main':
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: 'e의e승봇',
        blocks: mainBlocks,
      });
      res.json({});
      break;

    case 'notice':
      await noticeHandler.handleCallback(req, res, next);
      break;
    case 'place':
      await placeHandler.handleCallback(req, res, next);
      break;
    case 'qna':
      await qnaHandler.handleCallback(req, res, next);
      break;
    case 'mentoring':
      await mentoringHandler.handleCallback(req, res, next);
      break;
    default:
  }
});

module.exports = router;
