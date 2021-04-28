const Config = require('../../configs/app/development');

const fetch = require('node-fetch');
const queries = require('./queries');

const endPoint = Config.hosts.qna_gql;

// TODO: Enhance gql response speed (~=1000ms)
const fetcher = {
    // query
    get: async (q) => await fetch(`${endPoint}?query=${q}`, {
        method: 'GET',
        headers: {
            Authorization: Config.keys.qna_gql.token
        }
    }),
    // mutation
    post: async (query) => await fetch(endPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: Config.keys.qna_gql.token
        },
        body: JSON.stringify({ query })
    })
};

exports.getAllQNA = async () => {
    const response = await fetcher.get(queries.getAllQNA);
    const result = await response.json();
    return result.data.getAllQNA;
}

exports.getQNAByUserId = async (id) => {
    const response = await fetcher.get(queries.getQNAByUserId(id));
    const result = await response.json();
    return result.data.getMyQNA;
}

exports.writeQNA = async (userId, title, text) => {
    const response = await fetcher.post(queries.writeQNA(userId, title, text));
    const result = await response.json();

    const { errors, data } = result;
    return { errors, data };
}