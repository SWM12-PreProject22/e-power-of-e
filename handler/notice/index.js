const libKakaoWork = require('../../libs/kakaoWork');

exports.handleRequest = async (req, res, next) => {
	
  	res.json({});
};

exports.handleCallback = async (req, res, next) => {
	const {conversation_id} = req.body.message;
	libKakaoWork.sendMessage({
				conversationId: conversation_id,
				text: '공지사항',
				blocks: blockList
	});
	
	//fill in here
  	res.json({});
};


function createButtonBlock(text,style,value){
	
	const black={
		type:'button',
		text:text,
		style:style,
		action_type:'open_inapp_browser',
		value:value
	}
	
	return black;
}
const blockList=[];
blockList.push({		
	type: 'header',
	text: 'SWM12 공지사항',
	style: 'blue'
});
const divider={
	"type": "divider"
  }
const mainButton = {
	type:'button',
	value:'main',
	style:'default',
	text:'메인으로 돌아가기'
}

blockList.push(createButtonBlock("전체 공지사항","primary","https://www.notion.so/21-SW-d3ef903a507343c9be87831ac7515b15"));
blockList.push(createButtonBlock("디자인씽킹","default","https://www.notion.so/12-fac15a35e893428ea1953a72f3fb7ec2"));
blockList.push(createButtonBlock("기술별 소모임","default","https://www.notion.so/3db5042f571449b7b7df823933d45815"));
blockList.push(createButtonBlock("미니 프로젝트","default","https://www.notion.so/4b15a841489b4bc8b70b851ebdc746ec"));
blockList.push(createButtonBlock("사물함 신청","default","https://www.notion.so/4-27-16-e463c75c1379446999b2f706d056fc06"));
blockList.push(createButtonBlock("지정프로젝트","default","https://www.notion.so/2ea3b7ef61024eedb6688de69cbc516b"));
blockList.push(divider);
blockList.push(mainButton);