# 슬기로운 소마 생활을 위한 챗봇

## 🔑기획 의도

- 편리한 소마 연수 생활을 위한 기능 구현
- 여러 군데 흩어져 있는 공지를 한 번에 모아 보기 위함
- 센터 방문 시 식사, 개발 공간, 휴식 공간을 효율적으로 찾기 위함
- 개발 도중 생기는 문제를 다른 연수생의 도움을 통한 빠른 해결
- 각자의 개설 희망 멘토링 인원 모아 개설 요청

## 🎫기능

1. 공지사항 확인
    - 키워드로 쉽게 찾는 공지
2. 센터 주변 편의/휴게시설 알아보기
    - 음식 종류에 따른 맛집 리스트
    - 주변 카페 리스트
    - 주변 숙박 시설 리스트
3. 다른 연수생에게 질문하기
    - 익명 Q&A 시스템
    - 질문이 해결될 때까지 답변 연수생과 커뮤니케이션
4. 멘토링 동료찾기
    - 멘토링에서 원하는 주제, 멘토님을 지정하여 희망 주제 등록
    - 멘토링 개설 최소 인원이 모이면, 멘토링 참여 희망 연수생끼리 톡방 개설   
    
## 🖋사용법
### 메인 메뉴    
<img src="/image/main.png" width = "200" >   
   
### 공지사항 확인하기 
<img src="/image/notice.png" width = "200" >   

* 확인하고 싶은 공지를 누르면 노션 페이지로 연결됩니다.  

### 센터 주변 시설 알아보기      

|장소 선택|원하는 종류 선택|메뉴 선택|결과
|---|---|---|---|
|<img src="/image/findPlace.png" width = "200" >|<img src="/image/findPlace_Food.png" width = "200" >|<img src="/image/findPlace_Food_Menu.png" width = "200" >|<img src="/image/findPlace_Food_Menu_Result.png" width = "200" >   
  

### 다른 연수생에게 질문하기   

|메인|조회 - 전체 게시글|게시글 선택|답변 작성하기|답변 확인하기|
|---|---|---|---|---|
|<img src="/image/qnaMain.png" width = "200" >|<img src="/image/qnaList.png" width = "200" >|<img src="/image/qnaQuestionView.PNG" width = "200" >|<img src="/image/qnaAnswer.png" width = "200" >|<img src="/image/mentoringAnswerView.jpg" width = "200" > |  
* 답변 작성을 계속 하여 원하는 답변을 얻을 때까지 여러 연수생들의 도움을 받을 수 있습니다.
   
|메인|조회 - 내 게시글|
|---|---|
|<img src="/image/qnaMain.png" width = "200" >|<img src="/image/qnaMyList.png" width = "200" >|

|메인|새 질문 작성|
|---|---|
|<img src="/image/qnaMain.png" width = "200" >|<img src="/image/qnaQuestion.png" width = "200" >|   

### 멘토링 동료찾기     
|메인|등록된 주제 보기로 선택|등록하기|내가 등록한 멘토링 취소하기|
|---|---|---|---|
|<img src="/image/mentoringMain.png" width = "200" >|<img src="/image/mentoringList.PNG" width = "200" >|<img src="/image/mentoringFind.png" width = "200" >|<img src="/image/mentoringNewCancel.png" width = "200" >|
* 원하는 멘토링이 등록되어 있으면 등록하여 멘토링 구성에 참여할 수 있습니다.   

|메인|새로 등록하기|등록결과|
|---|---|---|
|<img src="/image/mentoringMain.png" width = "200" >|<img src="/image/mentoringNEw.png" width = "200" >|<img src="/image/mentoringNewResult.png" width = "200" >|
* 희망하는 멘토링을 등록하여 다른 연수생들을 모을 수 있습니다.
* 등록할 때 설정한 인원이 모이면 등록한 연수생끼리 채팅방을 만들어 줍니다.   


* * *
## 개발 환경

- Node.js v16.0.0
- Kakao Work Web API
