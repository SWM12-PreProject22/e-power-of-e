const ButtonCallModal = require("kakaowork/dist/models/actions/ButtonCallModal").default;
const ButtonSubmitAction = require('kakaowork/dist/models/actions/ButtonSubmitAction').default;
const { BlockContainer, HeaderBlock, TextBlock, ButtonBlock, DividerBlock, ActionBlock } = require("kakaowork");

const defaultEntry = (obj) => {
    obj.type = "qna";
    return obj;
};

exports.blockPresets = {
    welcome: (postCount) => new BlockContainer(
        new HeaderBlock("SWM12 QnA 게시판"),
        new TextBlock("프로젝트를 하다가 궁금한 점이 생기셨나요? 아래 게시판에서 다른 연수생 분들과 고민을 나누어보아요."),
        new TextBlock(`현재 게시판에 ${postCount}개의 글이 있어요.`),
        new DividerBlock(),
        new TextBlock("조회하기"),
        new ActionBlock(
            new ButtonBlock("전체 게시글", "default",
                new ButtonCallModal(`{"type": "qna", "action": "modal_all_posts"}`)
            ),
            new ButtonBlock("내 게시글", "default",
                new ButtonCallModal(`{"type": "qna", "action": "modal_my_posts"}`)
            )
        ),
        new TextBlock("작성하기"),
        new ActionBlock(
            new ButtonBlock("새 질문", "default",
                new ButtonSubmitAction("qna_welcome", JSON.stringify(defaultEntry({
                    action: "new_question"
                })))
            ),
            new ButtonBlock("새 답변", "default",
                new ButtonSubmitAction("qna_welcome", JSON.stringify(defaultEntry({
                    action: "new_reply"
                })))
            )
        )
    )
}
