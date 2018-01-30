var uid;
var photo;
var name;
var gameName = "capital";
var config = {
apiKey: "AIzaSyDabShKZzcS8U7DpDzaBCnzUwKE5iIU__o",
authDomain: "gameboy-1ccd7.firebaseapp.com",
databaseURL: "https://gameboy-1ccd7.firebaseio.com",
projectId: "gameboy-1ccd7",
storageBucket: "gameboy-1ccd7.appspot.com",
messagingSenderId: "772802581798"
};
firebase.initializeApp(config);
// Get a non-default Storage bucket
var database = firebase.database();
firebase.auth().onAuthStateChanged(function(user){
if(user){//인증되었을 때
  $('#AUTH_STATE').text(user.displayName+"님 로그인 하셨습니다."); //상태 변화 메소드에서 처리 하도오 이동
  $('#BTN_LOGOUT').show();//  로그아웃 버튼 보이기
  // user 정보 보여주기
  $('#USER_NAME').text(user.displayName);
  $('#USER_MAIL').text(user.email);
  $('#USER_UID').text(user.uid);
  $('#USER_PHOTO').attr('src', user.photoURL);
  $('#USER_INFO').show();
  uid=user.uid;
  photo=user.photoURL;
  name=user.displayName;
  console.log(uid+"  ");
}else{//인증되지 않았을 때
  $('#AUTH_STATE').text("(인증되지 않음)");
  $('#BTN_LOGOUT').hide();// 로그아웃 버튼 숨기기
  $('#USER_INFO').hide;
}
});

// 로그아웃 버튼 눌렀을 때 인증 해제
$('#BTN_LOGOUT').click(function(){
firebase.auth().signOut().then(function(){
  alert("인증이 해제되었습니다.");
}, function(error){
  alert(error.message);
});
});

//점수 파이어베이스에 올리는 함수
function writeUserData(gameName, point) {
  database.ref(gameName+'/' + uid).set({

    username: name,
    //profile_picture : photo,
    score : point
  });
}
