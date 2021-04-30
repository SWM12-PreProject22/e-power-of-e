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
    return result.data.getOpenQNA;
}

exports.getQNAByUserId = async (id) => {
    const response = await fetcher.get(queries.getQNAByUserId(id));
    const result = await response.json();
    return result.data.getMyQNA;
}

exports.getQNAByPostId = async (id) => {
    const response = await fetcher.get(queries.getQNAByPostId(id));
    const result = await response.json();
    if (result.data === undefined || result.data === null) return undefined;
    return result.data.getIdByQNA;
}

exports.writeQNA = async (userId, title, text) => {
    const response = await fetcher.post(queries.writeQNA(userId, title, text));
    const result = await response.json();

    const {errors, data} = result;
    return {errors, data};
}

exports.writeComment = async (userId, qnaId, text) => {
    const response = await fetcher.post(queries.writeComment(userId, qnaId, text));
    const result = await response.json();

    const {errors, data} = result;
    return {errors, data};
}

exports.closeQNA = async (userId, qnaId, answererId) => {
    const response = await fetcher.post(queries.selectComment(userId, qnaId, answererId));
    const result = await response.json();

    const {errors, data} = result;
    return {errors, data};
}
