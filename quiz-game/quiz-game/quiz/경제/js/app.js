var delay=10;
var timer;
var clock=delay;

//퀴즈 객체 생성
var quiz = new Quiz(questions);

//문제 출력 함수
function update_quiz(){
  var question = document.getElementById('question');
  var idx = quiz.questionIndex + 1;
  var choice = document.querySelectorAll('.btn');
  document.all.timeLeft.innerHTML=clock;
if(quiz.questionIndex > quiz.questions.length-1){
  document.all.timeLeft.innerHTML=0;
  clock=0;
  clearTimeout(timer);
  result();
}
else{
  //문제 출력
  question.innerHTML = '문제'+ idx + ') ' + quiz.questions[quiz.questionIndex].text;

  // 선택 항목 출력
  for(var i = 0; i < 4; i++){
    choice[i].innerHTML = quiz.questions[quiz.questionIndex].choice[i];
  }
  timer_question();
  progress();
}

}

//문제 진행 정보 표시(현재 문제/총 문항수)
function progress(){
  var progress = document.getElementById('progress');
  progress.innerHTML = '문제' + (quiz.questionIndex+1) + ' / ' + quiz.questions.length;
}

//결과 표시
function result(){
  var quiz_div = document.getElementById('quiz');
  var txt = '<h1>결과</h1>' + '<h2 id = "score"> 당신의 점수: '+ quiz.score + '개를 맞췄습니다.</h2>' + '<a href="../../../../i_wanna_carrot/ranking.html?IT"><button class="btn2"> IT 퀴즈 랭킹보기 </button></a>';
  quiz_div.innerHTML = txt;


    writeUserData(IT,quiz.score);

}

var btn = document.querySelectorAll('.btn');

function checkAnswer(i){
  btn[i].addEventListener('click', function(){

    var answer = btn[i].innerText;

    if(quiz.correctAnswer(answer)){
       quiz.score++;
    }

    if(quiz.questionIndex < quiz.questions.length-1){
      clock=0;
      clearTimeout(timer);
      timer=setTimeout("timer_question()",700);
      update_quiz();
    }
    else {
      document.all.timeLeft.innerHTML=0;
      clock=0;
      clearTimeout(timer);
      result();
    }

  });
}

for(var i = 0; i < btn.length; i++){
  checkAnswer(i);
}

// 정답 확인 메서드
Quiz.prototype.correctAnswer = function(answer){
  return answer == this.questions[this.questionIndex].answer;
};

function timer_question(){
	if (clock>0) {
		document.all.timeLeft.innerHTML=clock;
		clock--;
		timer=setTimeout("timer_question()",1000);
	} else {
		clearTimeout(timer);
		clock=delay;
		quiz.questionIndex++;
		update_quiz();
	}
}

window.onload=update_quiz();
