const libKakaoWork = require('../../libs/kakaoWork');

const emptyList = [];
const topicList = [
  {
    key: 0,
    title: 'Spring?!',
    mentor: '최길동 멘토님',
    description:
      '로렘 입숨(lorem ipsum; 줄여서 립숨, lipsum)은 출판이나 그래픽 디자인 분야에서 폰트, 타이포그래피, 레이아웃 같은 그래픽 요소나 시각적 연출을 보여줄 때 사용하는 표준 채우기 텍스트로, ',
    userIdList: ['2604988', '2633331', '2633336'],
  },
  {
    key: 1,
    title: 'docker 기초',
    mentor: '홍길동 멘토님',
    description:
      '로렘 입숨(lorem ipsum; 줄여서 립숨, lipsum)은 출판이나 그래픽 디자인 분야에서 폰트, 타이포그래피, 레이아웃 같은 그래픽 요소나 시각적 연출을 보여줄 때 사용하는 표준 채우기 텍스트로, ',
    userIdList: [1, 2, 3, 4],
  },
  {
    key: 2,
    title: 'aws 설정',
    mentor: '박길동 멘토님',
    description:
      '로렘 입숨(lorem ipsum; 줄여서 립숨, lipsum)은 출판이나 그래픽 디자인 분야에서 폰트, 타이포그래피, 레이아웃 같은 그래픽 요소나 시각적 연출을 보여줄 때 사용하는 표준 채우기 텍스트로, ',
    userIdList: [1, 2, 3],
  },
  {
    key: 3,
    title: '멋진 개발자 되는 법',
    mentor: '이길동 멘토님',
    description:
      '로렘 입숨(lorem ipsum; 줄여서 립숨, lipsum)은 출판이나 그래픽 디자인 분야에서 폰트, 타이포그래피, 레이아웃 같은 그래픽 요소나 시각적 연출을 보여줄 때 사용하는 표준 채우기 텍스트로, ',
    userIdList: [1, 2],
  },
  {
    key: 4,
    title: 'pm은 무엇인가',
    mentor: '김길동 멘토님',
    description:
      '로렘 입숨(lorem ipsum; 줄여서 립숨, lipsum)은 출판이나 그래픽 디자인 분야에서 폰트, 타이포그래피, 레이아웃 같은 그래픽 요소나 시각적 연출을 보여줄 때 사용하는 표준 채우기 텍스트로, ',
    userIdList: [7],
  },
];

const generateDetailBlock = (topic) => {
  const baseBlock = [
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
      text: topic.description,
      markdown: true,
    },
    {
      type: 'button',
      text: '등록하기',
      style: 'primary',
      action_type: 'submit_action',
      action_name: 'register_topic',
      value: `{"type":"mentoring", "payload":"${topic.key}"}`,
    },
    {
      type: 'button',
      text: '다른 주제 보기',
      style: 'default',
      action_type: 'submit_action',
      action_name: 'entry',
      value: `{"type":"mentoring"}`,
    },
  ];
  return baseBlock;
};
const generateOptionBlock = (topicList) => {
  if (topicList.length == 0) {
    const baseBlock = [
      {
        type: 'header',
        text: '멘토링 동료 찾기',
        style: 'blue',
      },
      {
        type: 'text',
        text:
          '멘토 특강을 신청하기 위해 동료를 모을 수 있어요. 5명이 되면 단톡방이 생성됩니다!',
        markdown: true,
      },
      {
        type: 'divider',
      },
      {
        type: 'text',
        text: '아직 등록된 주제가 없네요. 새로운 주제를 등록해보세요!',
        markdown: true,
      },
      {
        type: 'button',
        text: '새로 등록하기',
        style: 'default',
        action_type: 'call_modal',
        action_name: 'make_new_topic',
        value: `{"type":"mentoring"}`,
      },
    ];
    return baseBlock;
  }

  const headerBlock = [
    {
      type: 'header',
      text: '멘토링 동료 찾기',
      style: 'blue',
    },
    {
      type: 'text',
      text:
        '멘토 특강을 신청하기 위해 동료를 모을 수 있어요. 5명이 되면 단톡방이 생성됩니다!',
      markdown: true,
    },
    {
      type: 'divider',
    },
    {
      type: 'text',
      text:
        '등록된 주제는 총 ' +
        topicList.length +
        '개 입니다. 주제를 클릭하면 자세한 정보를 보여줄게요!',
      markdown: true,
    },
  ];

  const footerBlock = [
    // {
    //   type: 'action',
    //   elements: [
    //     {
    //       type: 'button',
    //       text: '주제 더 보기',
    //       action_type: 'submit_action',
    //       action_name: 'load_more_topics',
    //       value: `{"type":"mentoring"}`,
    //     },
    {
      type: 'button',
      text: '새로 등록하기',
      style: 'default',
      action_type: 'call_modal',
      value: `{"type":"mentoring", "payload":"make_new_topic"}`,
    },
    //   ],
    // },
  ];

  const topics = topicList.map((item) => ({
    type: 'button',
    text: item.title + ' (' + item.userIdList.length + '명)',
    action_type: 'submit_action',
    action_name: 'select_topic',
    value: `{"type":"mentoring", "payload":"${item.key}"}`,
  }));

  return headerBlock.concat(topics).concat(footerBlock);
};

const generateSubmitBlock = (actions) => {
  const baseBlock = [
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
  ];
  return baseBlock;
};

const generateRegisterBlock = (topic) => {
  const baseBlock = [
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
      action_type: 'submit_action',
      action_name: 'entry',
      value: `{"type":"mentoring"}`,
    },
  ];
  return baseBlock;
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
  const { value } = req.body;
  const payload = JSON.parse(value).payload;
  switch (payload) {
    case 'make_new_topic':
      return res.json({
        view: {
          title: 'modal title',
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
      break;
    default:
  }
  res.json({});
};

exports.handleCallback = async (req, res, next) => {
  const { message, actions, action_name, value } = req.body;
  const payload = JSON.parse(value).payload;
  await testGroupConversation(topicList[0]);
  switch (action_name) {
    case 'entry':
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: '멘토링 동료 찾기 진행중',
        blocks: generateOptionBlock(topicList),
      });
      break;
    case 'select_topic':
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: '멘토링 동료 찾기 진행중',
        blocks: generateDetailBlock(topicList[payload]),
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
        default:
      }
  }

  res.json({});
};
