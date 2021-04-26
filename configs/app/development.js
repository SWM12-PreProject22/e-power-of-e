require('dotenv').config()

module.exports = {
  keys: {
    kakaoWork: {
      bot: process.env.KAKAOWORK_BOT_API_TOKEN,
    },
  },
  hosts: {
    qna_gql: "https://pukuba.ga/api"
  }
};