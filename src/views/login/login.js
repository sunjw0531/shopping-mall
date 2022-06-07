import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';

// 요소(element), input 혹은 상수
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const submitButton = document.querySelector('#submitButton');
const kakaoLoginButton = document.querySelector('#kakaoLogin');
const kakaoLogoutButton = document.querySelector('#kakaoLogout');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
	submitButton.addEventListener('click', handleSubmit);
	kakaoLoginButton.addEventListener('click', kakaoLogin);
	kakaoLogoutButton.addEventListener('click', kakaoLogout);
}

// 로그인 진행
async function handleSubmit(e) {
	e.preventDefault();

	const email = emailInput.value;
	const password = passwordInput.value;

	// 잘 입력했는지 확인
	const isEmailValid = validateEmail(email);
	const isPasswordValid = password.length >= 4;

	if (!isEmailValid || !isPasswordValid) {
		return alert(
			'비밀번호가 4글자 이상인지, 이메일 형태가 맞는지 확인해 주세요.',
		);
	}

	// 로그인 api 요청
	try {	
		const data = { email, password };
		const result = await Api.post('/api/login', data);
		const token = result.token;	
		// 로그인 성공, 토큰을 세션 스토리지에 저장
		// 물론 다른 스토리지여도 됨
		sessionStorage.setItem('token', token);
		sessionStorage.setItem('email', email);

		alert(`정상적으로 로그인되었습니다.`);
		// 로그인 성공
		// 기본 페이지로 이동
		window.location.href = '/';
		
		
	} catch (err) {
		console.error(err.stack);
		alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
	}

}

//카카오 로그인 API 작동 확인
Kakao.init('e81149e34fc805f464419e5d213d69ee'); //발급받은 키 중 javascript키를 사용해준다.
console.log(Kakao.isInitialized()); // sdk초기화여부판단
//카카오로그인
async function kakaoLogin() {
	try {
		Kakao.Auth.login({
      		success: function (res) {
				// console.log(res);
        		Kakao.API.request({
         			url: '/v2/user/me',
          			success: async function (res) {
						const fullName = res.properties.nickname;
						const email = res.kakao_account.email;
						const data = { fullName, email };

						const result = await Api.post('/api/kakao', data);
						const token = result.token;

						sessionStorage.setItem('token', token);
						sessionStorage.setItem('email', email);
						console.log(sessionStorage);
						alert(`정상적으로 로그인되었습니다.`);
						// 로그인 성공
						// 기본 페이지로 이동
						window.location.href = '/';
					}
				});
			}
		});	
		} catch (err) {
				console.error(err.stack);
				alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
		}
}

//카카오로그아웃  
async function kakaoLogout() {
    if (Kakao.Auth.getAccessToken()) {
      Kakao.API.request({
        url: '/v1/user/unlink',
        success: function (res) {
        //   console.log(res)
		  alert(`정상적으로 로그아웃되었습니다.`);
        },
        fail: function (err) {
          console.log(err)
        },
      })
      Kakao.Auth.setAccessToken(undefined)
    }
  }  
