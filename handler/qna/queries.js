exports.getAllQNA = `query {
  getAllQNA {
    qnaId
    id
    title
    content
    status
    date
  }
}`;

exports.getQNAByUserId = (userId) => `query {
  getMyQNA(id: "${userId}") {
    qnaId
    title
    content
    status
    date
  }
}`;

// TODO: 각 entry 에 escape 처리
exports.writeQNA = (userId, title, text) => `mutation {
  addQNA(
    id: "${userId}",
    title: "${title}",
    content: "${text}"
  )
}`;
