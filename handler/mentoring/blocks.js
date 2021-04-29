exports.topicBlock = (topic) => [
  {
    type: 'description',
    term: '주제',
    content: {
      type: 'text',
      text: `${topic.title}`,
      markdown: false,
    },
    accent: true,
  },
  {
    type: 'description',
    term: '희망 멘토',
    content: {
      type: 'text',
      text: `${topic.mentor}`,
      markdown: false,
    },
    accent: true,
  },
  {
    type: 'description',
    term: '인원',
    content: {
      type: 'text',
      text: `${'users' in topic ? topic.users.length : 1} / ${topic.count}`,
      markdown: false,
    },
    accent: true,
  },
  {
    type: 'text',
    text: `${topic.description}`,
    markdown: true,
  },
];

exports.topicBlockLight = (topic) => [
  {
    type: 'description',
    term: '주제',
    content: {
      type: 'text',
      text: `${topic.title}`,
      markdown: false,
    },
    accent: true,
  },
  {
    type: 'description',
    term: '인원',
    content: {
      type: 'text',
      text: `${'users' in topic ? topic.users.length : 1} / ${topic.count}`,
      markdown: false,
    },
    accent: true,
  },
];

exports.errorBlock = [
  {
    type: 'text',
    text: '에러가 발생했습니다. 다시 시도해주세요.',
    markdown: true,
  },
  {
    type: 'divider',
  },
];
exports.headerBlock = {
  type: 'header',
  text: '멘토링 동료 찾기',
  style: 'blue',
};

exports.footerBlock = [
  {
    type: 'button',
    text: '등록된 주제 보기',
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

exports.introFooterBlock = (topicNum) => {
  if (topicNum)
    return [
      {
        type: 'button',
        text: '등록된 주제 보기',
        style: 'default',
        action_type: 'call_modal',
        value: `{"type":"mentoring", "payload":"get_topic_list"}`,
      },
      {
        type: 'button',
        text: '내가 등록한 주제 조회하기',
        style: 'default',
        action_type: 'submit_action',
        action_name: 'get_my_topics',
        value: '{"type": "mentoring"}',
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
  else
    return [
      {
        type: 'text',
        text: '아직 등록된 주제가 없어요. 새로운 주제를 등록해보세요!',
        markdown: true,
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
};

exports.newTopicModal = {
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
};
