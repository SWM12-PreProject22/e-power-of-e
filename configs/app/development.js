require('dotenv').config()

module.exports = {
  keys: {
    kakaoWork: {
      bot: process.env.KAKAOWORK_BOT_API_TOKEN,
    },
    qna_gql: {
      token: process.env.DB_TOKEN
    }
  },
  hosts: {
    qna_gql: "https://vvhtzbmdvztw6581595.cdn.ntruss.com/api"
  }
};
