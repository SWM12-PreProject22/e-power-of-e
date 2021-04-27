const Config = require('../../configs/app/development');
const { KakaoWork } = require('kakaowork');


const api = new KakaoWork(Config.keys.kakaoWork.bot);
(async () => {
    let conv = 0;
    let user = 0;
    for await (const c of api.fetchConversationList())
        conv += 1;
    for await (const u of api.fetchUserList()) {
        console.log(`User: ${u.name}#${u.id}`)
        user += 1;
    }

    console.log(`Fetched ${user} Users and ${conv} Conversations`)
})();

module.exports = {
    api
};
