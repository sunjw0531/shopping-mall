// import jwt from 'jsonwebtoken';
// const jwt = require('jsonwebtoken');
function nav() {
	//네비게이션
	const navbar = document.querySelector('#navbar');
	const register = '<li><a href="/register">회원가입</a></li>',
		login = '<li><a href="/login">로그인</a></li>',
		logout = '<li><a href="#" id="logout">로그아웃</a></li>',
		account = '<li><a href="/account">계정관리</a></li>',
		admin = '<li><a href="/admin" ">페이지 관리</a></li>',
		cart =
			'<li><a href="#cart" aria-current="page"><span class="icon"><i class="fas fa-cart-shopping"></i></span><span>카트</span></a></li>';

	// 어드민 인지 확인
	// try {
	// 	const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
	// 	const userToken = sessionStorage.getItem('token');
	// 	const jwtDecoded = jwt.verify(userToken, secretKey);
	// 	const isAdmin = jwtDecoded.isAdmin;

	// 	if (isAdmin) {
	// 		console.log('hi');
	// 	}
	// } catch (error) {
	// 	// jwt.verify 함수가 에러를 발생시키는 경우는 토큰이 정상적으로 decode 안되었을 경우임.
	// 	res.status(403).json({
	// 		result: 'forbidden-approach',
	// 		reason: '정상적인 토큰이 아닙니다.',
	// 	});
	// 	return;
	// }

	// 유저 로그인 유무
	if (sessionStorage.getItem('token')) {
		navbar.insertAdjacentHTML('afterend', `${account} ${logout} ${cart}`);
	} else {
		navbar.insertAdjacentHTML('afterend', `${login} ${register} ${cart}`);
	}
	// 로그아웃 구현
	const logoutElem = document.querySelector('#logout');
	if (logoutElem) {
		logoutElem.addEventListener('click', () => {
			sessionStorage.clear();
			window.location.href = '/';
		});
	}
}

export { nav };
