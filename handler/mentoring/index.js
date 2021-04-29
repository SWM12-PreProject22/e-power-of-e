require('dotenv').config();

const libKakaoWork = require('../../libs/kakaoWork');
const gql = require('./gql');
const blocks = require('./blocks');

const generateIntroBlock = async () => {
  const topicNum = await gql.getTopicNum();
  return [
    blocks.headerBlock,
    {
      type: 'text',
      text:
        `멘토 특강을 신청하기 위해 동료를 모을 수 있어요. 신청 인원이 모이면 단톡방이 생성됩니다. \n` +
        (topicNum
          ? `\n현재 등록된 주제는 총 ${topicNum}개 입니다. 주제를 선택하면 자세한 정보를 보여줄게요!`
          : ''),
      markdown: true,
    },
    ...blocks.introFooterBlock(topicNum),
  ];
};

const generateMyTopicBlock = async (userId) => {
  let topics = await gql.getTopicByUserId(userId);
  let mainBlock = [];
  topics.forEach((topic) => {
    const block = [
      ...blocks.topicBlockLight(topic),
      {
        type: 'button',
        text: '등록 취소',
        style: 'primary',
        action_type: 'submit_action',
        action_name: 'unregister_topic',
        value: `{"type":"mentoring", "payload":"${topic.id}"}`,
      },
      {
        type: 'divider',
      },
    ];
    mainBlock = [...mainBlock, ...block];
  });
  if (mainBlock.length === 0) {
    mainBlock.push({
      type: 'text',
      text: '\n현재 등록한 주제가 없습니다.\n',
      markdown: true,
    });
  }

  return [blocks.headerBlock, ...mainBlock, ...blocks.footerBlock];
};

const generateDetailBlock = async (actions, userId) => {
  const { error, topic } = await gql.getTopicById(actions.select);
  let mainBlock = [];
  if (error) {
    return blocks.errorBlock(
      '이미 주제가 마감되어 요청한 동작을 수행할 수 없습니다.'
    );
  } else if (
    topic.getTopicById.users.map((user) => user.id).includes(`${userId}`)
  ) {
    mainBlock = [
      ...blocks.topicBlock(topic.getTopicById),
      {
        type: 'text',
        text: '이미 등록한 주제입니다.',
        markdown: true,
      },
      {
        type: 'button',
        text: '등록 취소',
        style: 'primary',
        action_type: 'submit_action',
        action_name: 'unregister_topic',
        value: `{"type":"mentoring", "payload":"${topic.getTopicById.id}"}`,
      },
      {
        type: 'divider',
      },
    ];
  } else {
    mainBlock = [
      ...blocks.topicBlock(topic.getTopicById),
      {
        type: 'button',
        text: '등록하기',
        style: 'primary',
        action_type: 'submit_action',
        action_name: 'register_topic',
        value: `{"type":"mentoring", "payload":"${topic.getTopicById.id}"}`,
      },
      {
        type: 'divider',
      },
    ];
  }

  return [blocks.headerBlock, ...mainBlock, ...blocks.footerBlock];
};

const generateOptionBlock = async () => {
  const topicList = await gql.getAllTopic();
  const options = topicList.map((item) => ({
    text: `${item.title}(${item.users.length} / ${item.count})`,
    value: `${item.id}`,
  }));

  const block = [
    {
      type: 'label',
      text: '관심 있는 주제를 선택해주세요.\n\n',
      markdown: true,
    },
    {
      type: 'select',
      name: 'select',
      options: options,
      required: true,
      placeholder: '주제를 선택해주세요.',
    },
  ];

  return block;
};

const generateSubmitBlock = (actions) => {
  return [
    blocks.headerBlock,
    {
      type: 'text',
      text: `새 주제를 등록했습니다. ${actions.count}명이 등록하면 새로운 톡방을 만들어드릴게요!`,
      markdown: true,
    },
    {
      type: 'text',
      text: '*답변 내용*',
      markdown: true,
    },
    ...blocks.topicBlock(actions),
    ...blocks.footerBlock,
  ];
};

const generateRegisterBlock = async (topic) => {
  const block = [
    blocks.headerBlock,
    ...blocks.topicBlock(topic),
    {
      type: 'text',
      text:
        topic.users.length >= topic.count
          ? `위 주제에 ${topic.count}명이 모여 새로운 톡방이 생성되었어요. 새로운 톡방에서 확인해보세요!`
          : `위 주제의 대기열에 등록되었습니다. ${topic.count}명이 등록하면 새로운 톡방을 만들어드릴게요!`,
      markdown: true,
    },
    ...blocks.footerBlock,
  ];
  if (topic.users.length >= topic.count) await makeGroupConversation(topic);
  return block;
};

const generateUnregisterBlock = async () => {
  const topicNum = await gql.getTopicNum();

  const block = [
    blocks.headerBlock,
    {
      type: 'text',
      text: '등록이 취소되었습니다.',
      markdown: true,
    },
    {
      type: 'divider',
    },
    ...blocks.introFooterBlock(topicNum),
  ];
  return block;
};

const makeGroupConversation = async (topic) => {
  const userIds = topic.users.map((user) => user.id);
  const conversation = await libKakaoWork.openGroupConversations({
    userIds: userIds,
  });
  await Promise.all([
    libKakaoWork.sendMessage({
      conversationId: conversation.id,
      text: topic.title + ' 멘토링 매칭',
      blocks: [
        {
          type: 'text',
          text: `아래 주제를 신청한 사람이 ${topic.count}명이 되었어요! 톡방에서 일정을 잡아 멘토링을 진행하세요.`,
          markdown: true,
        },
        ...blocks.topicBlock(topic),
      ],
    }),
    gql.closeTopic(topic.id),
  ]);
};

exports.handleRequest = async (req, res, next) => {
  const { value } = req.body;
  const payload = JSON.parse(value).payload;
  switch (payload) {
    case 'get_topic_list':
      return res.json({
        view: {
          title: '주제 선택하기',
          accept: '확인',
          decline: '취소',
          value: `{"type":"mentoring", "payload":"select_topic"}`,
          blocks: await generateOptionBlock(),
        },
      });
    case 'make_new_topic':
      return res.json(blocks.newTopicModal);
    default:
  }
  res.json({});
};

exports.handleCallback = async (req, res, next) => {
  const { message, actions, action_name, value, react_user_id } = req.body;
  const payload = JSON.parse(value).payload;
  switch (action_name) {
    case 'entry':
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: '멘토링 동료 찾기 진행중',
        blocks: await generateIntroBlock(),
      });
      break;
    case 'register_topic': {
      let { errors, data } = await gql.signTopic(payload, react_user_id);
      if (errors) {
        await libKakaoWork.sendMessage({
          conversationId: message.conversation_id,
          text: '멘토링 동료 찾기 진행중',
          blocks: blocks.errorBlock(
            '이미 주제가 마감되어 요청한 동작을 수행할 수 없습니다.'
          ),
        });
      } else {
        await libKakaoWork.sendMessage({
          conversationId: message.conversation_id,
          text: '멘토링 동료 찾기 진행중',
          blocks: await generateRegisterBlock(data.signTopic),
        });
      }
      break;
    }
    case 'get_my_topics':
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: '멘토링 동료 찾기 진행중',
        blocks: await generateMyTopicBlock(react_user_id),
      });
      break;
    case 'unregister_topic': {
      let { errors, data } = await gql.cancelTopic(payload, react_user_id);
      if (!data.cancelTopic) {
        await libKakaoWork.sendMessage({
          conversationId: message.conversation_id,
          text: '멘토링 동료 찾기 진행중',
          blocks: blocks.errorBlock(
            '이미 채팅방이 생성되어 요청한 동작을 수행할 수 없습니다.'
          ),
        });
      } else {
        await libKakaoWork.sendMessage({
          conversationId: message.conversation_id,
          text: '멘토링 동료 찾기 진행중',
          blocks: await generateUnregisterBlock(),
        });
      }
      break;
    }
    default:
      switch (payload) {
        case 'submit_new_topic':
          await Promise.all([
            gql.addTopic(actions, react_user_id),
            libKakaoWork.sendMessage({
              conversationId: message.conversation_id,
              text: '멘토링 동료 찾기 진행중',
              blocks: generateSubmitBlock(actions),
            }),
          ]);
          break;
        case 'select_topic':
          await libKakaoWork.sendMessage({
            conversationId: message.conversation_id,
            text: '멘토링 동료 찾기 진행중',
            blocks: await generateDetailBlock(actions, react_user_id),
          });
          break;
        default:
      }
  }

  res.json({});
};
