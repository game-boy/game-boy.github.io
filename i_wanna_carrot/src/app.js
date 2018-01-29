//변수 선언
////////////////////////////////////////////////////////////////////////
//시스템적
var gameName="i_wanna_carrot"
var canvas=document.querySelector("#canvas");
var context=canvas.getContext("2d");
var threadSpeed = 16;     //Gap of Thread
var gameLoopThread;  //animation Thread ID
var keyPressOn = {};//pressed - true
var LoopStatred = false;
var startTime;
var select=[211,261,311];
var selector=0;
var gameOn=false;
//배경관련변수
var backgroundImg=new Image();
var backgroundY1=0;
var backgroundY2=800;
//토끼
var rabbit={};
var rabbitImg=new Image();
var rabbitIndex=0;            //출력할 이미지 인덱스
var rabbitposx=[14,63,14,63];  //토끼 스프라이트 시트용
var rabbitposy=[5,5,52,52];
//농부
var fammers;
var fammerImg=new Image();
var fammerIndex=0;
var fammerposx=[11,59];  //
var fammerposy=[4,4];
//탄
var fooImg= new Image();
var fooList=[];   //탄 배열
//점수
var score;
//카운트변수 적당히 프레임처럼씀
var count;
//오브젝트
var objectImg=new Image();
var objects=[];
//난이도관련
var level;
var satiety;
//상태
var rabbitStatus;
var statusCount=0;
var fastUp;
var powerUp;
////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////
window.addEventListener("load", init, false);
function init()
{

  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  canvasBuffer= document.createElement("canvas");
  canvasBuffer.width = canvas.width;
  canvasBuffer.height = canvas.height;
  bufferCtx = canvasBuffer.getContext("2d");
  document.addEventListener("keydown", getKeyDown, false);
  document.addEventListener("keyup", getKeyUp, false);
  setImage();
  // Start Message
  context.fillStyle = "#ffffff";  //글자안
  context.strokeStyle = "#ff0000"; //글자 겉
  context.font = "bold 30px _sans";
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.font = "bold 14px _sans";
  context.fillText("게임시작",
  188, 213);
  context.fillText("하는방법",
  188, 263);
  context.fillText("순 위",
  188, 313);

  canvas.addEventListener("click", function(e) {

            var gameStart=e.layerX>300&&e.layerY>380&&
                          e.layerX<440&&e.layerY<440;
            var howToPlay=e.layerX>300&&e.layerY>480&&
                          e.layerX<440&&e.layerY<540;
            var rank=e.layerX>300&&e.layerY>580&&
                          e.layerX<440&&e.layerY<640;
            if(gameStart&&!gameOn){
              startGameLoop();
              gameOn=true;
            }else if(howToPlay){


            }else if(rank){
              location.href="ranking.html?" + gameName;
            }

          });


}

function startGameLoop()
{


  context.font = "bold 15pt sans-serif";
  context.fillStyle = "#ffffff";
  context.strokeStyle = "#005555";
  rabbit = {x:canvas.width/2-25,y:150,
            width: 50, height:50, speed:4}; //토끼 변수들
  fammers=new Array();
  objects=new Array();
  fooList=new Array();
  level=50;
  count=0;
  score=0;
  rabbitStatus=1;
  satiety=50;
  startTime = new Date();
  gameLoopThread = setInterval(gameLoop, threadSpeed);
  LoopStatred = true;
  fastUp=0;
  powerUp=0;
}

function stopGameLoop()
{

  clearInterval(gameLoopThread);

  LoopStatred = false;
}


  function setImage(){
    //배경
    backgroundImg.src="img/background_grassland.png";
    //토끼
    rabbitImg.src="img/rabbit.png";
    //농부
    fammerImg.src="img/fammer.png";
    //탄
    fooImg.src="img/foo.png";
    //오브젝트
    objectImg.src="img/object.png";
  }


  function getKeyDown(event)
  {
    var keyValue;
    var skipEvent = false;
    if(event == null)
      keyValue=window.event.keyCode;
     else
      keyValue=event.keyCode;

    if(keyValue == "87") {keyValue = "38"; skipEvent = true;}       //up
    else if(keyValue == "83") {keyValue = "40";skipEvent = true;}  //down
    else if(keyValue == "65") {keyValue = "37";skipEvent = true;}  //left
    else if(keyValue == "68") {keyValue = "39";skipEvent = true;}  //right

    if(skipEvent)
    {
  	  if(event == null)
  	  {
  	    window.event.preventDefault();
  	  }else
      {
  	    event.preventDefault();
  	  }
    }
    keyPressOn[keyValue] = true;
  }



  function getKeyUp(event)
  {
    var keyValue;
    if(event == null)
    {
      keyValue=window.event.keyCode;
      window.event.preventDefault();
    }else
    {
      keyValue=event.keyCode;
      event.preventDefault();
    }
    if(keyValue == "87") keyValue = "38";       //up
    else if(keyValue == "83") keyValue = "40";  //down
    else if(keyValue == "65") keyValue = "37";  //left
    else if(keyValue == "68") keyValue = "39";  //right
    keyPressOn[keyValue] = false;
    if(keyValue == "13" && !LoopStatred) //enter
    {
    }
  }

  function gameLoop()
  {
    if(gameOn){

    //점수추가 및 레벨증가 카운트증가
   score++;
   if(count%100==99){
     satiety-=2;
     if(satiety>80){
       satiety--;
     }
   }
    if(count%300==299&&level<99){
      level++;

    }
    count++;
    calcKeyInnput();
    backScroll();//배경화면 스크롤 처리
    rabbitAnimation();
    fammerAnimation();
    makeFoo();
    moveFoo();
    checkFoo();
    if(count%(180-level)==0)
    createObject();
    moveObject();
    if(count%(150-level)==0)
    createFammer(1);
    moveFammer();
    checkFammer();
    checkFooHit();
    checkObject();
    displayAll();
    checkStatus();
    }
  }


  function calcKeyInnput()
  {
    if(keyPressOn["38"] && rabbit.y >= -rabbit.height*1/4){
      rabbit.y -= rabbit.speed;  //up
      if(selector<3){
        selector++;
      }
    }
    if(keyPressOn["40"] && rabbit.y <= canvas.height -rabbit.height*3/4){
      rabbit.y += rabbit.speed;  //down
      if(selector>-1){
        selector--;
      }
    }
    if(keyPressOn["37"] && rabbit.x >= -rabbit.width*1/4)
      rabbit.x -= rabbit.speed;  //left
    if(keyPressOn["39"] && rabbit.x <= canvas.width -rabbit.width*3/4)
      rabbit.x += rabbit.speed;  //right
  }


  function displayAll(){


    displayBackGround();
    displayStatus();
    displayFoo();
    displayObject();
    displayFammer();
    displayRabbit();
    displayScore();
    if(!LoopStatred)
      showRecord();
  }

  function showRecord()
  {
    context.fillStyle = "rgba(0, 0, 0, 0.2)";
    context.fillRect(canvas.width/2 - 109, canvas.height/2 - 17, 218, 34);
    context.fillStyle = "#ffffff";
    context.strokeStyle = "#ff0000";
    context.font = "bold 30px _sans";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.fillText("Enter to Restart", canvas.width/2, canvas.height/2);
    context.strokeText("Enter to Restart", canvas.width/2, canvas.height/2);
    context.fillStyle = "rgba(255, 255, 255, 0.4)";
    context.fillRect(canvas.width/2 - 109, canvas.height/2 +20, 218, 14);

    var stopTime = new Date();
    var elapseSeconds = (stopTime.getTime() - startTime.getTime())/1000;

    context.fillStyle = "#000000";
    context.font = "bold 12px _sans";
    context.textBaseline = "top";
    context.textAlign = "center";
    context.fillText("내 점수 : " + score ,
                      canvas.width/2, canvas.height/2 +20);
                      writeUserData(gameName,score);
  }

  function displayBackGround(){
    //배경이미지 출력
    context.drawImage(backgroundImg, 0,backgroundY1, 500, 800);
    context.drawImage(backgroundImg, 0,backgroundY2, 500, 800);
  }
  function displayScore(){
    //점수텍스트 표시
    context.fillText("점수 :"+score,canvas.width/2,canvas.height-30);
    context.strokeText("점수 :"+score,canvas.width/2,canvas.height-30);
  }
  function displayFoo(){
    //탄 이미지 출력
    for(var i=0; i<fooList.length; i++){
      //i 번째 탄 객체 참조
      var tmp = fooList[i];
      context.drawImage(fooImg,5,5,8,8, tmp.x+11, tmp.y,20,20);
    }
  }
  function displayFammer(){  //함수
    //농부 이미지 출력
    var j;
    for(var i = 0; i<fammers.length; i++){
      //i번째 적기 객체 불러오기
      context.drawImage(fammerImg,
        fammerposx[fammerIndex],fammerposy[fammerIndex],
        26,28,
        fammers[i].x, fammers[i].y,
        50,50);
    }

  }
  function displayRabbit(){   //토끼 이미지 그리기 함수화
    context.drawImage(rabbitImg,
      rabbitposx[rabbitIndex],rabbitposy[rabbitIndex],
      19,34,
      rabbit.x,rabbit.y,
      50,50
     );

     if(checkHitPlayer()||checkHitObject())
       stopGameLoop();
  }

//충돌검사
function checkHitPlayer()
{
  var rtnVal = false;
  for(var i=0;i<fammers.length;i++)
  {
    var distanceX = (rabbit.x +  rabbit.width/2) - (fammers[i].x + fammers[i].width/2+10);
    var distanceY = (rabbit.y +  rabbit.height/2) - (fammers[i].y + fammers[i].height/2+10);
    var distance = distanceX*distanceX + distanceY*distanceY;
    if(distance <= (fammers[i].radius + (rabbit.width/2))
                    * (fammers[i].radius + (rabbit.height/2)))
    {
      rtnVal = true;

      break;
    }
  }
  return rtnVal;
}





function checkFooHit(){

  for(var i=0; i<fooList.length; i++ ){
    //i 번째 탄을 불러옴
    foo=fooList[i];
    for(var j=0; j<fammers.length; j++){

    // i번째 농부
    // 농부가 탄에 맞았는지
    var fammerTmp=fammers[j];
    var isShooted =   foo.x> fammerTmp.x-15 &&
                      foo.x<fammerTmp.x+23 &&
                      foo.y> fammerTmp.y-34 &&
                      foo.y< fammerTmp.y+34;

    if(isShooted){
      //여기에 똥 터지는 애니메이션 재생 하는 코드
      //foo.x foo.y위치
      foo.isDead=true; //탄제거

      fammerTmp.energy -=50;

      if(fammerTmp.energy <=0){
        //에너지 없음 없애자
              fammerTmp.isDead=true;
              //점수 올리기
              if(fammerTmp.type==0){
                score+=10;
              }else if(fammerTmp.type==1){
                score+=20;
              }
      }
    }
  }
}
}

//농부 만드는 함수
function createFammer(iCount)
{
  for(var i=0; i<iCount; i++)
  {
    var startX = Math.floor(Math.random() * (canvas.width - 40)) + 1;

    var startY = -20;
    var fammertype = Math.floor(Math.random() * 4);


    var startSpeed = Math.random() * 1;
    var startColor;


    var enemyobj = {x:startX, y:startY, color:startColor,isDead:false,type:fammertype,
                radius:15, speed:startSpeed,width:26,height:28,energy:50*fammertype+level*5
                };

    fammers.push(enemyobj);
  }
}

//농부 움직이는 함수
function moveFammer(){
  for(var i=0; i<fammers.length;i++){
    var tmp=fammers[i];
    var speed=tmp.speed-fastUp;
    if(tmp.y<rabbit.y-40){
    tmp.y+=speed;
  }else if(tmp.y<rabbit.y){
    if(rabbit.x>tmp.x){
      tmp.x+=speed*0.5;
      tmp.y+=speed*0.5;
    }
    else{
      tmp.x-=speed*0.5;
      tmp.y+=speed*0.5;
      }
  }else if(tmp.y==rabbit.y){
    if(rabbit.x>tmp.x){
      tmp.x+=speed;
    }
    else{
      tmp.x-=speed;
    }
  }else{
    if(rabbit.x>tmp.x){
      tmp.x+=speed*0.5;
      tmp.y-=speed*0.5;
    }
    else{
      tmp.x-=speed*0.5;
      tmp.y-=speed*0.5;
      }
  }



    if(tmp.y>=840){
      tmp.isDead=true;
    }
  }
}
//배열에서 제거할 농부 객체를 제거하는 함수
function checkFammer(){

  for(var i=fammers.length-1; i>=0;i--){
    var tmp = fammers[i];
    if(tmp.isDead){
      fammers.splice(i,1);
    }
  }
}


// $("canvas").on("mousemove",function(e){
//   //마우스의 x좌표를 드래곤의 x좌표에 반영한다.
//   rabbit.x=e.offsetX;
// });


//미사일 객체를 만드는 함수
function makeFoo(){
  if(count%5 != 0){
    return;
  }
  var obj={};
  obj.x=rabbit.x;
  obj.y=rabbit.y;
  obj.isDead = false;
  fooList.push(obj);
}
function moveFoo(){
  for(var i = 0; i<fooList.length; i++){
    //i 번째 Foo객체를 불러와서
    var tmp = fooList[i];
    //y 좌표를 감소 시킨다.
    tmp.y= tmp.y-5;
    if(tmp.y <= -150){//위쪽으로 벗어난 좌표이면 배열에서 제거될 수 있도록 표시
      tmp.isDead=true;
    }
  }
}
function checkFoo(){
  for(var i = fooList.length-1; i>=0; i--){
    var tmp = fooList[i];
    if(tmp.isDead){//배열에서 제거해야 하면 i번째
        fooList.splice(i,1);
    }
  }
}
//토끼 애니메이션
function rabbitAnimation(){
  if(count%9 != 0 ){
    return;
  }


  rabbitIndex++;
  if(rabbitIndex==3){
    rabbitIndex=0;
  }
}

//농부 애니메이션
function fammerAnimation(){
  if(count%9 != 0 ){
    return;
  }


  fammerIndex++;
  if(fammerIndex==2){
    fammerIndex=0;
  }
}

function backScroll(){
  backgroundY1-=2;
  backgroundY2-=2;

  if(backgroundY1 <= 0){
    backgroundY1 = 0;
    backgroundY2 = 800;
  }

  if(backgroundY2 >= 0){
    backgroundY2 = 0;
    backgroundY1 = 800;
  }
}

function createObject(){
  //실수를 내림 연산해서 정수로 만든다.
  // var result = Math.floor(Math.random()*100);
  var result = 40;
  if(result >50){//10이 아니면
    return; // 함수 끝내기 (농부 안만들기)
  }

  var objectX= [0,50,100,150,200];
  var stoneCount=0;
  //당근생성
  result = Math.floor(Math.random()*5);
  var obj={x:objectX[result], y:400, type:0,isDead:false, radius:10,width:50,height:50};
  objectX[result]=-1;
  objects.push(obj);

  for(var i = 0 ;i <5;i++){

    result = Math.floor(Math.random()*(52-Math.floor(level/2)));
    var obj= {};
    if(objectX[i]!=-1&&result<2){
    obj.x= objectX[i];
    obj.y=400;
    obj.radius=10;
    obj.width=50;
    obj.height=50;
    if(result==0){
      //stone
      obj.type=1;
      stoneCount++;
    }else if(result==1){
      //stone2
      obj.type=2;
      stoneCount++;
    }
    obj.isDead=false;
    objects.push(obj);

    }
  }

}
function displayObject(){
  for(var i = 0; i<objects.length; i++){
      //i번째 적기 객체 불러오기
      var tmp = objects[i];
      var objSpriteX=[0,16,32];
      var objSpriteY=[0,0,0];
      context.drawImage(objectImg,objSpriteX[tmp.type],objSpriteY[tmp.type],16,16,tmp.x, tmp.y,50,50);
    }
}
function moveObject(){
  for(var i = 0; i<objects.length; i++){
    //i 번째 Foo객체를 불러와서
    var tmp = objects[i];
    //y 좌표를 감소 시킨다.
    tmp.y-=2;
    if(tmp.y <= -150){//위쪽으로 벗어난 좌표이면 배열에서 제거될 수 있도록 표시
      tmp.isDead=true;
    }
  }
}


function checkHitObject(){
  var rtnVal = false;
  for(var i=0; i<objects.length; i++ ){
    //i 번째 오브젝트를 불러옴
    var obj=objects[i];


    var isShooted =   rabbit.x> obj.x-22 &&
                      rabbit.x<obj.x+22 &&
                      rabbit.y> obj.y-22 &&
                      rabbit.y< obj.y+22;

    if(isShooted){

      if(obj.type==0){

          obj.isDead=true;
                score+=10;
                satiety+=5;
      }else{

            rtnVal = true;
      }
  }

}
  return rtnVal;
}

function checkObject(){

  for(var i=objects.length-1; i>=0;i--){
    if(objects[i].isDead){
      objects.splice(i,1);
    }
  }
}

function checkStatus(){

  if(satiety>100){
    satiety=100;
  }
  if(satiety>70&&statusCount<50){
    rabbitStatus=3;
    statusCount++;
    fastUp=0.1;
  }else if(satiety>70){
    rabbitStatus=2;
    statusCount++;
    fastUp=0.1;
    if(statusCount>100){
      statusCount=0;

    }
  }else if(satiety>30){
    rabbitStatus=1;
    fastUp=0;
  }else{
    rabbitStatus=0;
    fastUp=-0.1;
  }
}

function displayStatus(){
  var statusSpriteX=[0,32,64,64];
  var statusSpriteY=[32,32,32,64];
  context.drawImage(objectImg,
    statusSpriteX[rabbitStatus],statusSpriteY[rabbitStatus],
    32,32,
    canvas.width-80,canvas.height-80,
    80,80);

}
