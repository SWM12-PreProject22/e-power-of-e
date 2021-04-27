const {
    ModalContainer,
    BlockContainer,
    HeaderBlock,
    TextBlock,
    ButtonBlock,
    DividerBlock,
    ActionBlock,
    LabelBlock,
    SelectBlock,
    SelectOption,
    InputBlock,
    actions
} = require("kakaowork");

const defaultEntry = (obj) => {
    obj.type = "qna";
    return obj;
};

const escapeEmpty = (blocks, hint) => {
    if (!blocks.length) return [new SelectOption(hint, 'should_be_ignored')];
    else return blocks;
}

const toMain = new ButtonBlock(
    '메인으로 돌아가기', 'default',
    new actions.ButtonSubmitAction('to_main', '{"type": "main"}')
);

exports.blockPresets = {
    welcome: (postCount) => new BlockContainer(
        'SWM12 QnA 게시판',
        new HeaderBlock("SWM12 QnA 게시판"),
        new TextBlock("프로젝트를 하다가 궁금한 점이 생기셨나요? 아래 게시판에서 다른 연수생 분들과 고민을 나누어보아요."),
        new TextBlock(`현재 게시판에 ${postCount}개의 글이 있어요.`),
        new DividerBlock(),
        new TextBlock("조회하기"),
        new ActionBlock(
            new ButtonBlock("전체 게시글", "default",
                new actions.ButtonCallModal(`{"type": "qna", "action": "modal_all_posts"}`)
            ),
            new ButtonBlock("내 게시글", "default",
                new actions.ButtonCallModal(`{"type": "qna", "action": "modal_my_posts"}`)
            )
        ),
        new TextBlock("작성하기"),
        new ActionBlock(
            new ButtonBlock("새 질문", "default",
                new actions.ButtonCallModal(`{"type": "qna", "action": "new_question"}`)
            ),
            new ButtonBlock("새 답변", "default",
                new actions.ButtonSubmitAction("qna_welcome", JSON.stringify(defaultEntry({
                    action: "new_reply"
                })))
            )
        ),
        toMain
    ),
    modal_all_posts: (posts) => new ModalContainer(
        'QnA 전체 게시글', '확인', '취소', `{"type": "qna", "action": "modal_all_posts"}`,
        new LabelBlock('전체 게시글'),
        new SelectBlock('open_post', escapeEmpty(posts, '게시글이 없음'), true, '게시글 선택')
    ),
    modal_my_posts: (posts) => new ModalContainer(
        'QnA 내 게시글', '확인', '취소', `{"type": "qna", "action": "modal_my_posts"}`,
        new LabelBlock('내 게시글'),
        new SelectBlock('open_post', escapeEmpty(posts, '게시글이 없음'), true, '게시글 선택')
    ),
    new_question: () => new ModalContainer(
        '새 질문 작성하기', '확인', '취소', `{"type": "qna", "action": "new_question"}`,
        new LabelBlock('*새 게시글 작성하기*'),
        new LabelBlock(
            '모든 게시글은 모니터링되며, 부적절한 게시글은 예고 없이 삭제될 수 있습니다. ' +
            '게시글에는 작성자의 정보가 드러나지 않으니 필요하다면 게시글에 개인정보를 담지 않게 조심해주세요.'
        ),
        new InputBlock('title', true, '제목 (최대 20자)'),
        new InputBlock('text', true, '내용을 입력해주세요 (최대 500자)\n크기가 자동으로 조절됩니다.')
    ),
    no_post_found: (hint) => new BlockContainer(
        '게시글을 찾을 수 없음',
        new HeaderBlock('SWM12'),
        new TextBlock(`해당 게시글을 찾을 수 없습니다.\n검색 키워드: ${hint}`)
    ),
    view_post: (title, content, numComments) => new BlockContainer(
        'SWM12 게시글',
        new HeaderBlock(`게시글 - ${title}`),
        new TextBlock(content),
        // new DividerBlock(),
        // new TextBlock('등록일: {시간}'),
        new DividerBlock(),
		numComments == 0
			? new TextBlock("아직 등록된 답변이 없습니다.")
			: new ButtonBlock(`${numComments}개의 답변 확인하기`, "default",
					new actions.ButtonCallModal(`{"type": "qna", "action": "modal_all_comments"}`)
				),
		new ButtonBlock("다른 게시글 보기", "default",
			new actions.ButtonCallModal(`{"type": "qna", "action": "modal_all_posts"}`)
		),
        toMain
    ),
	 post_registered: (postCount) => new BlockContainer(
        'SWM12 QnA 게시판',
        new HeaderBlock("SWM12 QnA 게시판"),
        new TextBlock("게시글이 성공적으로 등록되었습니다!"),
        new TextBlock(`현재 게시판에 ${postCount}개의 글이 있어요.`),
        new DividerBlock(),
        new TextBlock("조회하기"),
        new ActionBlock(
            new ButtonBlock("전체 게시글", "default",
                new actions.ButtonCallModal(`{"type": "qna", "action": "modal_all_posts"}`)
            ),
            new ButtonBlock("내 게시글", "default",
                new actions.ButtonCallModal(`{"type": "qna", "action": "modal_my_posts"}`)
            )
        ),
        new TextBlock("작성하기"),
        new ActionBlock(
            new ButtonBlock("새 질문", "default",
                new actions.ButtonCallModal(`{"type": "qna", "action": "new_question"}`)
            ),
            new ButtonBlock("새 답변", "default",
                new actions.ButtonSubmitAction("qna_welcome", JSON.stringify(defaultEntry({
                    action: "new_reply"
                })))
            )
        ),
        toMain
    ),
}
