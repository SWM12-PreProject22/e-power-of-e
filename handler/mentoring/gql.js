require('dotenv').config();
const fetch = require('node-fetch');
const endPoint = 'https://vvhtzbmdvztw6581595.cdn.ntruss.com/api';

const fetcher = {
  get: async (q) =>
    await fetch(`${endPoint}?query=${q}`, {
      method: 'GET',
    }),
  post: async (query) =>
    await fetch(endPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.DB_TOKEN,
      },
      body: JSON.stringify({ query }),
    }),
};

exports.getAllTopic = async () => {
  const response = await fetcher.get(`query {
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
  `);
  const result = await response.json();
  return result.data.getAllTopic;
};

exports.getTopicNum = async () => {
  const response = await fetcher.get(`query {
      getAllTopic {
        title,
      }
    }
  `);
  const result = await response.json();
  return result.data.getAllTopic.length;
};

exports.getTopicById = async (topicId) => {
  const response = await fetcher.get(`query {
	getTopicById(id: "${topicId}") {
		title,
		mentor,
		description,
		id,
		count,
		users{
			id
		}
	}
}`);
  const result = await response.json();
  const { errors, data } = result;
  if (errors) return { error: true };
  return { error: false, topic: data };
};

exports.getTopicByUserId = async (userId) => {
  const response = await fetcher.get(`query {
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
}`);
  const result = await response.json();
  return result.data.getTopicByUserId;
};

exports.addTopic = async (actions, userId) => {
  const response = await fetcher.post(`mutation {
    addTopic(
        title:"${actions.title}",
        mentor:"${actions.mentor}",
        description:"${actions.description}",
        count:${parseInt(actions.count)}
        creator:"${userId}"
        )
}`);
  const result = await response.json();

  const { errors, data } = result;
  return { errors, data };
};

exports.signTopic = async (topicId, userId) => {
  const response = await fetcher.post(`mutation {
    signTopic(
      topicId:"${topicId}",
      applicant:"${userId}"
    ) {
      title,
      mentor,
      description,
      id,
      count,
      users{
        id
      }
    }
}`);
  const result = await response.json();

  const { errors, data } = result;
  return { errors, data };
};

exports.cancelTopic = async (topicId, userId) => {
  const response = await fetcher.post(`mutation {
    cancelTopic(
        topicId:"${topicId}",
        applicant:"${userId}"
    )
}`);
  const result = await response.json();

  const { errors, data } = result;
  return { errors, data };
};

exports.closeTopic = async (topicId) => {
  const response = await fetcher.post(`mutation {
	closeTopic(id: "${topicId}")
}`);
  const result = await response.json();

  const { errors, data } = result;
  return { errors, data };
};
