const libKakaoWork = require('../../libs/kakaoWork');

const emptyList = [];
const topicList = [
  {
    id: 0,
    title: 'Spring?!',
    mentor: '최길동 멘토님',
    description:
      '로렘 입숨(lorem ipsum; 줄여서 립숨, lipsum)은 출판이나 그래픽 디자인 분야에서 폰트, 타이포그래피, 레이아웃 같은 그래픽 요소나 시각적 연출을 보여줄 때 사용하는 표준 채우기 텍스트로, ',
    userIdList: ['2604988', '2633331', '2633336'],
  },
  {
    id: 1,
    title: 'docker 기초',
    mentor: '홍길동 멘토님',
    description:
      '로렘 입숨(lorem ipsum; 줄여서 립숨, lipsum)은 출판이나 그래픽 디자인 분야에서 폰트, 타이포그래피, 레이아웃 같은 그래픽 요소나 시각적 연출을 보여줄 때 사용하는 표준 채우기 텍스트로, ',
    userIdList: [1, 2, 3, 4],
  },
  {
    id: 2,
    title: 'aws 설정',
    mentor: '박길동 멘토님',
    description:
      '로렘 입숨(lorem ipsum; 줄여서 립숨, lipsum)은 출판이나 그래픽 디자인 분야에서 폰트, 타이포그래피, 레이아웃 같은 그래픽 요소나 시각적 연출을 보여줄 때 사용하는 표준 채우기 텍스트로, ',
    userIdList: [1, 2, 3],
  },
  {
    id: 3,
    title: '멋진 개발자 되는 법',
    mentor: '이길동 멘토님',
    description:
      '로렘 입숨(lorem ipsum; 줄여서 립숨, lipsum)은 출판이나 그래픽 디자인 분야에서 폰트, 타이포그래피, 레이아웃 같은 그래픽 요소나 시각적 연출을 보여줄 때 사용하는 표준 채우기 텍스트로, ',
    userIdList: [1, 2],
  },
  {
    id: 4,
    title: 'pm은 무엇인가',
    mentor: '김길동 멘토님',
    description:
      '로렘 입숨(lorem ipsum; 줄여서 립숨, lipsum)은 출판이나 그래픽 디자인 분야에서 폰트, 타이포그래피, 레이아웃 같은 그래픽 요소나 시각적 연출을 보여줄 때 사용하는 표준 채우기 텍스트로, ',
    userIdList: [7],
  },
];

const generateDetailBlock = (actions) => {
  const headerBlock = [
    {
      type: 'header',
      text: '멘토링 동료 찾기',
      style: 'blue',
    },
  ];
  let topics = [topicList[actions.select1]];
  if (actions.select2 && actions.select1 != actions.select2)
    topics.push(topicList[actions.select2]);

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
        text:
          '멘토 특강을 신청하기 위해 주제를 등록하고 동료를 모을 수 있어요. 5명이 모이면 단톡방이 생성됩니다.',
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
      text: `멘토 특강을 신청하기 위해 동료를 모을 수 있어요. 5명이 되면 단톡방이 생성됩니다. \n\n현재 등록된 주제는 총 ${topicList.length}개 입니다. 주제를 선택하면 자세한 정보를 보여줄게요!`,
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
    text: item.title,
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
      text:
        '새 주제를 등록했습니다. 5명이 등록하면 새로운 톡방을 만들어드릴게요!',
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
      text: '메인으로 돌아가기',
      action_type: 'submit_action',
      action_name: 'to_main',
      value: '{"type": "main"}',
      style: 'default',
    },
  ];
  return block;
};

const generateRegisterBlock = (topic) => {
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
        '위 주제의 대기열에 등록되었습니다. 5명이 등록하면 새로운 톡방을 만들어드릴게요!',
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

const testGroupConversation = async (topic) => {
  const conversation = await libKakaoWork.openGroupConversations({
    userIds: topic.userIdList,
  });
  await libKakaoWork.sendMessage({
    conversationId: conversation.id,
    text: topic.title + ' 멘토링 매칭',
    blocks: [
      {
        type: 'text',
        text:
          '아래 주제를 신청한 사람이 5명이 되었어요! 톡방에서 일정을 잡아 멘토링을 진행하세요.',
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
          blocks: generateOptionBlock(topicList),
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
  const { message, actions, action_name, value } = req.body;
  const payload = JSON.parse(value).payload;

  switch (action_name) {
    case 'entry':
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: '멘토링 동료 찾기 진행중',
        blocks: generateIntroBlock(topicList),
      });
      break;
    case 'register_topic':
      // update db
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: '멘토링 동료 찾기 진행중',
        blocks: generateRegisterBlock(topicList[payload]),
      });
      break;
    default:
      switch (payload) {
        case 'submit_new_topic':
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
            blocks: generateDetailBlock(actions),
          });
          break;
        default:
      }
  }

  res.json({});
};
