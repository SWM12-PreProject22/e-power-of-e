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
        new TextBlock(`현재 게시판에 ${postCount}개의 질문이 답변을 기다리고 있어요.`),
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
		new ButtonBlock("새 질문", "default",
			new actions.ButtonCallModal(`{"type": "qna", "action": "new_question"}`)
		),
		new DividerBlock(),
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
    modal_all_comments: (comments) => new ModalContainer(
        '답변 보기', '확인', '취소', `{"type": "qna", "action": "do_nothing"}`,
        ...comments.map((comment) => new LabelBlock(`*${comment.anonymousId}*\n${comment.content.substring(0, 180)}`))
    ),
    modal_select_best_comments: (userId, postId, comments) => new ModalContainer(
        '채택하기', '확인', '취소', `{"type": "qna", "action": "select_best_comment"}`,
        new LabelBlock('채택할 답변을 선택해주세요. 채택한 후에는 취소하실 수 없으며, 공개된 질문 목록에서 더 이상 보이지 않게 됩니다.'),
        new SelectBlock(
            'info',
            comments.map((c) => new SelectOption(`(${c.anonymousId}) ${c.content.substring(0, 60)}`,
                JSON.stringify({userId, postId, answererId: c.id, commentHead: c.content.substring(0, 180)}))),
            true, '답변을 선택해주세요'
        )
    ),
    select_comment_success: (postTitle, commentHead) => new BlockContainer(
        '답변을 채택하였습니다',
        new HeaderBlock("SWM12 채택했습니다"),
        new TextBlock(`게시글 "${postTitle}"에 대한 답변 ${commentHead}...(을)를 채택하였습니다. 채택한 게시글은 더 이상 공개 게시판에 노출되지 않습니다.`)
    ),
    selected_my_comment: (postTitle, commentHead) => new BlockContainer(
        '답변이 채택되었습니다',
        new HeaderBlock("SWM12 답변 채택됨"),
        new TextBlock(`게시글 "${postTitle}"에 작성하셨던 답변 ${commentHead}...(이)가 질문자에 의해 채택되었습니다. 커뮤니티에 기여해주셔서 감사합니다.`)
    ),
    modal_write_comment: (qnaId) => new ModalContainer(
        '답변 작성하기', '확인', '취소', `{"type": "qna", "action": "new_comment", "qna_id": "${qnaId}"}`,
        new LabelBlock('*답변 작성하기*'),
        new LabelBlock(
            '모든 게시글은 모니터링되며, 부적절한 게시글은 예고 없이 삭제될 수 있습니다. ' +
            '게시글에는 작성자의 정보가 드러나지 않으니 필요하다면 게시글에 개인정보를 담지 않게 조심해주세요.'
        ),
        new InputBlock('text', true, '답변을 입력해주세요 (최대 180자)\n크기가 자동으로 조절됩니다.')
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
    view_post: (title, content, numComments, qnaId) => new BlockContainer(
        'SWM12 게시글',
        new HeaderBlock(`${title.substring(0, 20)}`),
        new TextBlock(content),
        // new DividerBlock(),
        // new TextBlock('등록일: {시간}'),
        new DividerBlock(),
        numComments == 0
            ? new TextBlock("아직 등록된 답변이 없습니다.")
            : new ButtonBlock(`${numComments}개의 답변`, "default",
            new actions.ButtonCallModal(`{"type": "qna", "action": "modal_all_comments", "qna_id": "${qnaId}"}`)
            ),
        new ActionBlock(
            new ButtonBlock("답변 작성", "default",
                new actions.ButtonCallModal(`{"type": "qna", "action": "modal_write_comment", "qna_id": "${qnaId}"}`)
            ),
            new ButtonBlock("다른 게시글", "default",
                new actions.ButtonCallModal(`{"type": "qna", "action": "modal_all_posts"}`)
            )
        ),
        toMain
    ),
    view_my_post: (title, content, numComments, qnaId) => new BlockContainer(
        'SWM12 게시글',
        new HeaderBlock(`${title.substring(0, 20)}`),
        new TextBlock(content),
        new DividerBlock(),
        numComments == 0
            ? new TextBlock("아직 등록된 답변이 없습니다.")
            : new ActionBlock(
            new ButtonBlock(`${numComments}개의 답변`, "default",
                new actions.ButtonCallModal(`{"type": "qna", "action": "modal_all_comments", "qna_id": "${qnaId}"}`)
            ),
            new ButtonBlock('채택하기', 'default',
                new actions.ButtonCallModal(`{"type": "qna", "action": "modal_select_best_comment", "qna_id": "${qnaId}"}`)
            )
            ),
        new ActionBlock(
            new ButtonBlock("답변 작성", "default",
                new actions.ButtonCallModal(`{"type": "qna", "action": "modal_write_comment", "qna_id": "${qnaId}"}`)
            ),
            new ButtonBlock("다른 게시글", "default",
                new actions.ButtonCallModal(`{"type": "qna", "action": "modal_all_posts"}`)
            )
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
		new ButtonBlock("새 질문", "default",
			new actions.ButtonCallModal(`{"type": "qna", "action": "new_question"}`)
		),
		new DividerBlock(),
        toMain
    ),
	comment_registered: () => new BlockContainer(
        'SWM12 QnA 게시판',
        new HeaderBlock("SWM12 QnA 게시판"),
        new TextBlock("답변이 성공적으로 등록되었습니다!"),
        new DividerBlock(),
        new ButtonBlock("다른 게시글 보기", "default",
	        new actions.ButtonCallModal(`{"type": "qna", "action": "modal_all_posts"}`)
	    ),
        toMain
    )
}
