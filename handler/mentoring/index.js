require('dotenv').config();

// TODO
// get API 에러 처리
// 인원수 변경 (지금은 userNum으로 되어 있음 이거 수정) - finish
// getOptionBlock - 자기꺼 안보이게 하는 거
// 이미 신청한 거 신청했을 때 다른 알림 - finish
// 자기가 기존에 신청한 거 조회, 취소 - finish

const libKakaoWork = require('../../libs/kakaoWork');
const fetch = require('node-fetch');

const endPoint = 'https://pukuba.ga/api';
const getAllTopic = async () => {
  const query = `
    query {
      getAllTopic {
        title,
        mentor,
        description,
        id,
        count,
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
        id,
        count,
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
  return result.data.getTopicById;
};

const getTopicByUserId = async (userId) => {
  const query = `
    query {
      getTopicByUserId(id: "${userId}") {
        title,
        mentor,
        description,
        id,
        count,
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
  return result.data.getTopicByUserId;
};

const addTopic = async (actions, userId) => {
  const query = `
        mutation {
            addTopic(
                title:"${actions.title}",
                mentor:"${actions.mentor}",
                description:"${actions.description}",
                count:${parseInt(actions.count)}
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

const cancelTopic = async (topicId, userId) => {
  const query = `
        mutation {
            cancleTopic(
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
        text: `멘토 특강을 신청하기 위해 주제를 등록하고 동료를 모을 수 있어요. 신청 인원이 모이면 단톡방이 생성됩니다.`,
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
      text: `멘토 특강을 신청하기 위해 동료를 모을 수 있어요. 신청 인원이 모이면 단톡방이 생성됩니다. \n\n현재 등록된 주제는 총 ${topicList.length}개 입니다. 주제를 선택하면 자세한 정보를 보여줄게요!`,
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
    {
      type: 'button',
      text: '등록한 주제 조회하기',
      style: 'default',
      action_type: 'submit_action',
      action_name: 'get_my_topics',
      value: '{"type": "mentoring"}',
    },
  ];

  return block;
};

const generateMyTopicBlock = async (userId) => {
  const headerBlock = [
    {
      type: 'header',
      text: '멘토링 동료 찾기',
      style: 'blue',
    },
  ];
  let topics = await getTopicByUserId(userId);
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
          text: `${topic.users.length} / ${topic.count}`,
          markdown: false,
        },
        accent: true,
      },
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

const generateDetailBlock = async (actions, userId) => {
  const headerBlock = [
    {
      type: 'header',
      text: '멘토링 동료 찾기',
      style: 'blue',
    },
  ];
  let topic = await getTopicById(actions.select);
  var mainBlock = [];
  if (topic.users.map((user) => user.id).includes(`${userId}`)) {
    mainBlock = [
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
          text: `${topic.users.length} / ${topic.count}`,
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
        type: 'text',
        text: '이미 등록한 주제입니다.',
        markdown: true,
      },
      {
        type: 'divider',
      },
    ];
  } else {
    mainBlock = [
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
          text: `${topic.users.length} / ${topic.count}`,
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
  }
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

const generateOptionBlock = async (userId) => {
  const topicList = await getAllTopic();
  // const userTopics = await getTopicByUserId(userId);
  // const userTopicIds = userTopics.map((topic) => topic.id);
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
  const block = [
    {
      type: 'header',
      text: '멘토링 동료 찾기',
      style: 'blue',
    },
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
      type: 'description',
      term: '인원',
      content: {
        type: 'text',
        text: `${actions.count}`,
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
        topic.users.length >= topic.count
          ? `위 주제에 ${topic.count}명이 모여 새로운 톡방이 생성되었어요. 새로운 톡방에서 확인해보세요!`
          : `위 주제의 대기열에 등록되었습니다. ${topic.count}명이 등록하면 새로운 톡방을 만들어드릴게요!`,
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
  if (topic.users.length >= topic.count) await makeGroupConversation(topic);
  return block;
};

const generateUnregisterBlock = async () => {
  const topicList = await getAllTopic();

  if (topicList.length == 0) {
    const block = [
      {
        type: 'header',
        text: '멘토링 동료 찾기',
        style: 'blue',
      },
      {
        type: 'text',
        text: '등록이 취소되었습니다.',
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
      text: '등록이 취소되었습니다.',
      markdown: true,
    },
    {
      type: 'divider',
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
    {
      type: 'button',
      text: '등록한 주제 조회하기',
      style: 'default',
      action_type: 'submit_action',
      action_name: 'get_my_topics',
      value: '{"type": "mentoring"}',
    },
  ];

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
        text: `아래 주제를 신청한 사람이 ${topic.count}명이 되었어요! 톡방에서 일정을 잡아 멘토링을 진행하세요.`,
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
  const { value, action_name, react_user_id } = req.body;
  const payload = JSON.parse(value).payload;
  switch (payload) {
    case 'get_topic_list':
      return res.json({
        view: {
          title: '주제 선택하기',
          accept: '확인',
          decline: '취소',
          value: `{"type":"mentoring", "payload":"select_topic"}`,
          blocks: await generateOptionBlock(react_user_id),
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
            {
              type: 'label',
              text: '희망 인원',
              markdown: true,
            },
            {
              type: 'select',
              name: 'count',
              options: [
                {
                  text: '2',
                  value: '2',
                },
                {
                  text: '3',
                  value: '3',
                },
                {
                  text: '4',
                  value: '4',
                },
                {
                  text: '5',
                  value: '5',
                },
                {
                  text: '6',
                  value: '6',
                },
                {
                  text: '7',
                  value: '7',
                },
                {
                  text: '8',
                  value: '8',
                },
                {
                  text: '9',
                  value: '9',
                },
                {
                  text: '10',
                  value: '10',
                },
              ],
              required: true,
              placeholder: '희망 인원을 선택해주세요',
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
    case 'get_my_topics':
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: '멘토링 동료 찾기 진행중',
        blocks: await generateMyTopicBlock(react_user_id),
      });
      break;
    case 'unregister_topic':
      await cancelTopic(payload, react_user_id);
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: '멘토링 동료 찾기 진행중',
        blocks: await generateUnregisterBlock(),
      });
      break;
    default:
      switch (payload) {
        case 'submit_new_topic':
          await addTopic(actions, react_user_id);
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
            blocks: await generateDetailBlock(actions, react_user_id),
          });
          break;
        default:
      }
  }

  res.json({});
};
