exports.getAllQNA = `query {
  getOpenQNA {
    qnaId
    id
    title
    content
    status
    date
	comment {
      id
      content
	  commentId
	}
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

exports.getQNAByPostId = (postId) => `query {
  getIdByQNA(qnaId: "${postId}") {
    title
    id
    content
    qnaId
    status
    comment {
      id
      content
      commentId
    }
    date
  }
}`;

exports.writeQNA = (userId, title, text) => `mutation {
  addQNA(
    id: ${JSON.stringify(String(userId))},
    title: ${JSON.stringify(title)},
    content: ${JSON.stringify(text)}
  )
}`;

exports.writeComment = (userId, qnaId, text) => `mutation {
  addComment (
    id: ${JSON.stringify(String(userId))},
    qnaId: ${JSON.stringify(qnaId)},
    content: ${JSON.stringify(text)}
  )
}`;

exports.selectComment = (userId, qnaId, answererId) => `mutation {
  closeQNA(qnaId:"${qnaId}", id:"${userId}", answererId:"${answererId}")
}`;
