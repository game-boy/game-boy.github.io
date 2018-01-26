//문제 객체
function Question(text, choice, answer){
  this.text = text;
  this.choice = choice;
  this.answer = answer;
}

//퀴즈 정보 객체
function Quiz(questions){
  this.score = 0; //점수
  this.questions = questions; //질문
  this.questionIndex = 0; //질문순서
}
