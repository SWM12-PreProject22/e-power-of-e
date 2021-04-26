require('dotenv').config();

const libKakaoWork = require('../../libs/kakaoWork');
const fetch = require('node-fetch');

const endPoint = 'https://pukuba.ga/api';
const userNum = 5;
const getAllTopic = async () => {
  const query = `
    query {
      getAllTopic {
        title,
        mentor,
        description,
        id,
        users{
          id
        }
      }
    }
  `;
  const response = await fetch(`${endPoint}?query=${query}`, {
    method: 'GET',
  });
  const result = await response.json();
  return result.data.getAllTopic;
};

const getTopicById = async (id) => {
  const query = `
    query {
      getTopicById(id: "${id}") {
        title,
        mentor,
        description,
        users{
          id
        }
        id,
      }
    }
  `;
  const response = await fetch(`${endPoint}?query=${query}`, {
    method: 'GET',
  });
  const result = await response.json();
  return result.data.getTopicById;
};

const getTopicByUserId = async (userId) => {
  const query = `
    query {
      getTopicByUserId(id: "${userId}") {
        title,
        mentor,
        description,
        users{
          id
        }
        id,
      }
    }
  `;
  const response = await fetch(`${endPoint}?query=${query}`, {
    method: 'GET',
  });
  const result = await response.json();
  return result.data.getTopicByUserId;
};

const addTopic = async (actions, userId) => {
  const query = `
        mutation {
            addTopic(
                title:"${actions.title}",
                mentor:"${actions.mentor}",
                description:"${actions.description}",
                creater:"${userId}"
            )
        }
    `;
  const response = await fetch(endPoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.DB_TOKEN,
    },
    body: JSON.stringify({ query }),
  });
};

const signTopic = async (topicId, userId) => {
  const query = `
        mutation {
            signTopic(
                topicId:"${topicId}",
                applicant:"${userId}"
            )
        }
    `;
  const response = await fetch(endPoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.DB_TOKEN,
    },
    body: JSON.stringify({ query }),
  });
};

const closeTopic = async (id) => {
  const query = `
        mutation {
            closeTopic(id: "${id}") {
              id
            }
        }
    `;
  const response = await fetch(endPoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.DB_TOKEN,
    },
    body: JSON.stringify({ query }),
  });
  const result = await response.json();
  return result.data.closeTopic;
};

const generateDetailBlock = async (actions) => {
  const headerBlock = [
    {
      type: 'header',
      text: '멘토링 동료 찾기',
      style: 'blue',
    },
  ];
  let topics = [await getTopicById(actions.select1)];
  if (actions.select2 && actions.select1 != actions.select2) {
    topics.push(await getTopicById(actions.select2));
  }
  var mainBlock = [];
  topics.forEach((topic) => {
    const block = [
      {
        type: 'description',
        term: '주제',
        content: {
          type: 'text',
          text: topic.title,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '희망 멘토',
        content: {
          type: 'text',
          text: topic.mentor,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '등록 인원',
        content: {
          type: 'text',
          text: `${topic.users.length}`,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'text',
        text: topic.description,
        markdown: true,
      },
      {
        type: 'button',
        text: '등록하기',
        style: 'primary',
        action_type: 'submit_action',
        action_name: 'register_topic',
        value: `{"type":"mentoring", "payload":"${topic.id}"}`,
      },
      {
        type: 'divider',
      },
    ];
    mainBlock = [...mainBlock, ...block];
  });

  const footerBlock = [
    {
      type: 'button',
      text: '다른 주제 보기',
      style: 'default',
      action_type: 'call_modal',
      value: `{"type":"mentoring", "payload":"get_topic_list"}`,
    },
    {
      type: 'button',
      text: '새로 등록하기',
      style: 'default',
      action_type: 'call_modal',
      value: `{"type":"mentoring", "payload":"make_new_topic"}`,
    },
    {
      type: 'button',
      text: '메인으로 돌아가기',
      action_type: 'submit_action',
      action_name: 'to_main',
      value: '{"type": "main"}',
      style: 'default',
    },
  ];
  return [...headerBlock, ...mainBlock, ...footerBlock];
};

const generateIntroBlock = (topicList) => {
  if (topicList.length == 0) {
    const block = [
      {
        type: 'header',
        text: '멘토링 동료 찾기',
        style: 'blue',
      },
      {
        type: 'text',
        text: `멘토 특강을 신청하기 위해 주제를 등록하고 동료를 모을 수 있어요. ${userNum}명이 모이면 단톡방이 생성됩니다.`,
        markdown: true,
      },
      {
        type: 'divider',
      },
      {
        type: 'text',
        text: '아직 등록된 주제가 없어요. 새로운 주제를 등록해보세요!',
        markdown: true,
      },
      {
        type: 'button',
        text: '새로 등록하기',
        style: 'primary',
        action_type: 'call_modal',
        value: `{"type":"mentoring", "payload":"make_new_topic"}`,
      },
      {
        type: 'button',
        text: '메인으로 돌아가기',
        action_type: 'submit_action',
        action_name: 'to_main',
        value: '{"type": "main"}',
        style: 'default',
      },
    ];
    return block;
  }

  const block = [
    {
      type: 'header',
      text: '멘토링 동료 찾기',
      style: 'blue',
    },
    {
      type: 'text',
      text: `멘토 특강을 신청하기 위해 동료를 모을 수 있어요. ${userNum}명이 되면 단톡방이 생성됩니다. \n\n현재 등록된 주제는 총 ${topicList.length}개 입니다. 주제를 선택하면 자세한 정보를 보여줄게요!`,
      markdown: true,
    },
    {
      type: 'button',
      text: '주제 선택하기',
      action_type: 'call_modal',
      value: `{"type":"mentoring", "payload":"get_topic_list"}`,
    },
    {
      type: 'button',
      text: '새로 등록하기',
      style: 'default',
      action_type: 'call_modal',
      value: `{"type":"mentoring", "payload":"make_new_topic"}`,
    },
  ];

  return block;
};

const generateOptionBlock = (topicList) => {
  const options = topicList.map((item) => ({
    text: `${item.title}(${item.users.length}명)`,
    value: `${item.id}`,
  }));

  const block = [
    {
      type: 'label',
      text: '관심 있는 주제를 선택해주세요. \n(2개 선택 가능)\n\n',
      markdown: true,
    },
    {
      type: 'select',
      name: 'select1',
      options: options,
      required: true,
      placeholder: '주제를 선택해주세요.(필수)',
    },
    {
      type: 'select',
      name: 'select2',
      options: options,
      required: false,
      placeholder: '주제를 선택해주세요.',
    },
  ];

  return block;
};

const generateSubmitBlock = (actions) => {
  const block = [
    {
      type: 'header',
      text: '멘토링 동료 찾기',
      style: 'blue',
    },
    {
      type: 'text',
      text: `새 주제를 등록했습니다. ${userNum}명이 등록하면 새로운 톡방을 만들어드릴게요!`,
      markdown: true,
    },
    {
      type: 'text',
      text: '*답변 내용*',
      markdown: true,
    },
    {
      type: 'description',
      term: '주제',
      content: {
        type: 'text',
        text: actions.title,
        markdown: false,
      },
      accent: true,
    },
    {
      type: 'description',
      term: '희망 멘토',
      content: {
        type: 'text',
        text: actions.mentor,
        markdown: false,
      },
      accent: true,
    },
    {
      type: 'text',
      text: actions.description,
      markdown: true,
    },
    {
      type: 'button',
      text: '다른 주제 보기',
      style: 'default',
      action_type: 'call_modal',
      value: `{"type":"mentoring", "payload":"get_topic_list"}`,
    },
    {
      type: 'button',
      text: '메인으로 돌아가기',
      action_type: 'submit_action',
      action_name: 'to_main',
      value: '{"type": "main"}',
      style: 'default',
    },
  ];
  return block;
};

const generateRegisterBlock = async (topic) => {
  const block = [
    {
      type: 'header',
      text: '멘토링 동료 찾기',
      style: 'blue',
    },
    {
      type: 'description',
      term: '주제',
      content: {
        type: 'text',
        text: topic.title,
        markdown: false,
      },
      accent: true,
    },
    {
      type: 'description',
      term: '희망 멘토',
      content: {
        type: 'text',
        text: topic.mentor,
        markdown: false,
      },
      accent: true,
    },
    {
      type: 'text',
      text:
        topic.users.length >= userNum
          ? `위 주제에 ${userNum}명이 모여 새로운 톡방이 생성되었어요. 새로운 톡방에서 확인해보세요!`
          : `위 주제의 대기열에 등록되었습니다. ${userNum}명이 등록하면 새로운 톡방을 만들어드릴게요!`,
      markdown: true,
    },
    {
      type: 'button',
      text: '다른 주제 보기',
      style: 'default',
      action_type: 'call_modal',
      value: `{"type":"mentoring", "payload":"get_topic_list"}`,
    },
    {
      type: 'button',
      text: '메인으로 돌아가기',
      action_type: 'submit_action',
      action_name: 'to_main',
      value: '{"type": "main"}',
      style: 'default',
    },
  ];
  if (topic.users.length >= userNum) await makeGroupConversation(topic);
  return block;
};

const makeGroupConversation = async (topic) => {
  const userIds = topic.users.map((user) => user.id);
  const conversation = await libKakaoWork.openGroupConversations({
    userIds: userIds,
  });
  await libKakaoWork.sendMessage({
    conversationId: conversation.id,
    text: topic.title + ' 멘토링 매칭',
    blocks: [
      {
        type: 'text',
        text: `아래 주제를 신청한 사람이 ${userNum}명이 되었어요! 톡방에서 일정을 잡아 멘토링을 진행하세요.`,
        markdown: true,
      },
      {
        type: 'description',
        term: '주제',
        content: {
          type: 'text',
          text: topic.title,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '희망 멘토',
        content: {
          type: 'text',
          text: topic.mentor,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'text',
        text: topic.description,
        markdown: true,
      },
    ],
  });
  await closeTopic(topic.id);
};

exports.handleRequest = async (req, res, next) => {
  const { value, action_name } = req.body;
  const payload = JSON.parse(value).payload;
  switch (payload) {
    case 'get_topic_list':
      return res.json({
        view: {
          title: '주제 선택하기',
          accept: '확인',
          decline: '취소',
          value: `{"type":"mentoring", "payload":"select_topic"}`,
          blocks: generateOptionBlock(await getAllTopic()),
        },
      });
    case 'make_new_topic':
      return res.json({
        view: {
          title: '새 주제 등록하기',
          accept: '확인',
          decline: '취소',
          value: `{"type":"mentoring", "payload":"submit_new_topic"}`,
          blocks: [
            {
              type: 'label',
              text: '주제',
              markdown: true,
            },
            {
              type: 'input',
              name: 'title',
              required: true,
              placeholder: '주제를 입력해주세요',
            },
            {
              type: 'label',
              text: '희망 멘토',
              markdown: true,
            },
            {
              type: 'input',
              name: 'mentor',
              required: true,
              placeholder: '희망 멘토를 입력해주세요',
            },
            {
              type: 'label',
              text: '설명',
              markdown: true,
            },
            {
              type: 'input',
              name: 'description',
              required: true,
              placeholder: '희망하는 멘토링 수업에 대해 알려주세요',
            },
          ],
        },
      });
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
        blocks: generateIntroBlock(await getAllTopic()),
      });
      break;
    case 'register_topic':
      await signTopic(payload, react_user_id);
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: '멘토링 동료 찾기 진행중',
        blocks: await generateRegisterBlock(await getTopicById(payload)),
      });
      break;
    default:
      switch (payload) {
        case 'submit_new_topic':
          await addTopic(actions, message.user_id);
          await libKakaoWork.sendMessage({
            conversationId: message.conversation_id,
            text: '멘토링 동료 찾기 진행중',
            blocks: generateSubmitBlock(actions),
          });
          break;
        case 'select_topic':
          await libKakaoWork.sendMessage({
            conversationId: message.conversation_id,
            text: '멘토링 동료 찾기 진행중',
            blocks: await generateDetailBlock(actions),
          });
          break;
        default:
      }
  }

  res.json({});
};
