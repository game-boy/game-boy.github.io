//문제 데이터
var questions = [
  new Question('기계학습, 즉 머신러닝의 알고리즘 중  하나로 사물이나 데이터를 군집화 하 거나 분류하는데 사용하는 기술을 일 컫는 말은?', ['로우 러닝', '딥 러닝', '빅 러닝', '백 러닝'], '딥 러닝'), //1번
  new Question('금융과 기술을 뜻하는 단어의 합성어 로 최근 화제가 되고 있는 기술을 뜻 하는 용어는?', ['파인테크', '머니테크', '핀테크', '재테크'], '핀테크'),
  new Question('방송사의 위탁을 받아 광고주에게 광 고시간을 판매해주고 판매대행 수수료 를 받는 회사를 일컫는 말은?', ['미디어 펌', '미디어 컴퍼니', '미디어 오피스', '미디어 랩'], '미디어 랩'),
  new Question('디스플레이의 종류에 따라 화면의 크 기가 자동으로 최적화 되게 조절되도 록 설계된 사이트를 말하는 용어는?', ['반응형 웹', '자동형 웹', '디스플레이 웹', '웹 앱'], '반응형 웹'),
  new Question('반경 50-70m 범위안에 있는 스마트폰  과 같은 기기와 통신할수 있는 블루투 스 4.0 LE 기반의 무선 통신 기술의  이름은?', ['와이파이', 'GPS', 'NFC', '비콘'], '비콘'),//5번
  new Question('사물 인터넷, 사이버 물리 시스템, 빅 데이터 솔루션 등 최신 정보 통신 기 술을 적용한 스마트 플랫폼을 구축하 여 도시의 자산을 효율적으로 운영하 고 시민들에게 안전하고 윤택한 삶을  제공하는 도시를 일컫는 말은?', ['사이버 시티', '세이프 시티', '스마트 시티', '인터넷 시티'], '스마트 시티'),
  new Question('사물인터넷을 구성하는 사물중에서 데 이터가 많지 않은 사물들로 구성된 네 트눠크를 일컫는 말은?', ['스몰 인터넷', '소물 인터넷', '로우 인터넷', '숏 인터넷'], '소물 인터넷'),
  new Question('기계학습, 즉 머신 러닝과 인지과학에 서 생물학의 신경망을 통해 영감을 얻 은 통계학적 알고리즘은?', ['Artificial Neural Network', 'Artificial Synaps Network', 'Artificial inteligence Network', 'Artificial Nerve Network'], 'Artificial Neural Network'),
  new Question('정보를 수집한 이후, 저장만 하고 분 석에 활용하지 않은 데이터를 뜻하는  용어는?', ['데프 데이터', '블라인드 데이터', '메타 데이터', '다크 데이터'], '다크 데이터'),
  new Question('개발과 운영을 뜻하는 영단어의 합성 어로 개발 담당자와 운영 담당자가 연 계하여 협력하는 개발 방법론을 뜻하 는 단어는?', ['데브옵스', '디벨롭스', '데브오퍼', '디벨로퍼레이션'], '데브옵스'),//10번
  new Question('웹사이트에 접속할 때 자동적으로 만 들어 지는 임시파일을 뜻하는 용어는?', ['초콜릿', '캔디', '쿠키', '캐쉬'], '쿠키'),
  new Question('일정한 주파수 대역을 이용해 무선 방식으로 각종 데이터를 주고 받을 수 있는 시스템을 일컫는 무선 식별시스템을 일컫는 용어는?', [' AFK', 'CMDF', 'RFID', 'AMD'], 'RFID'),
  new Question('이동하면서도 초고속 인터넷을 이용할 수 있는 무선 휴대 인터넷을 일컫는 용어는?', ['와이파이', '와이브로', '와이맥스', '와이웨어'], '와이브로'),
  new Question('컴퓨터 알고리즘을 활용해 사람이 아닌 로봇이 자동으로 기사를 작성하는 방식을 의미하는 용어는?', ['AI 저널리즘', '컴퓨터 저널리즘', '오토 저널리즘', '로봇 저널리즘'], '로봇 저널리즘'),
  new Question('pooq, Tving 과 같이 TV나 스마트폰, PC, 태블릿 PC 등의 여러 기기에서 원하는 콘텐츠를 끊임없이 이용할 수 있는 서비스를 일컫는 말은?', ['M - 스크린', ' N - 스크린', 'S - 스크린', 'L - 스크린'], 'N - 스크린'),//15번
  new Question('유튜브 등에서 많은 인기를 얻고 있는 1인 창작자들의 네트워크를 뜻하는 용어는?', ['MCN', 'MCC', 'MCU', 'MUN'], 'MCN'),
  new Question('공격자가 소프트웨어에서 취약점을 발견하더라도 앱과 다른 소프트웨어 프로세스를 고립시킴으로써 사용자의 컴퓨터에 악성 소프트웨어를 설치하는 것을 방지하는 컴퓨터 보안 방법을 뜻하는 용어는?', ['샌드 박싱', '블록 체인', '프로세스 클로즈', '오토 세이브'], '샌드 박싱'),
  new Question('보안이 필요한 사이트를 방문하면 브라우저의  주소창에 자물쇠 아이콘이 나타나고 웹 주소가 http  대신에 https 로 시작하는 것을 볼 수 있는데, 이러한 작용을 할 수 있게 하는 것은 OOO 때문입니다. OOO은 무엇일까요?', ['SSH', 'SSF', 'SSS', 'SSL'], 'SSL'),
  new Question('인공지능을 이용한 법률 서비스 산업을 뜻하는 말은?', ['리걸 AI', '리걸 테크', '리걸 서비스', '리걸 인더스트리'], '리걸 테크'),
  new Question('최근 주목받고 있는 지문인식이나 홍채인식 등 인체를 활용한 인증 시스템과 같이 비밀번호의 문제점을 해결하기 위한 사용자 인증 프레임워크를 뜻하는 말은?', ['IDF', 'JHIF', 'FIDO', 'PSIF'], 'FIDO')//20번
];
