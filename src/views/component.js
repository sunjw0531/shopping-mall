//모달
function userModal() {
  //유저 정보 표시
  const userName = document.querySelector('#userName'),
    userImg = document.querySelector('#userImg'),
    userEmail = document.querySelector('#userEmail');

  userImg.src = sessionStorage.getItem('userImg');
  userName.textContent = sessionStorage.getItem('fullName');
  userEmail.textContent = sessionStorage.getItem('email');

  // 모달 버튼 핸들링
  const profileBtn = document.querySelector('#profile-btn'),
    modalProfile = document.querySelector('.modal-profile');
  profileBtn.addEventListener('click', openModal);
  function openModal(e) {
    e.preventDefault();
    modalProfile.classList.toggle('active');
  }
}
//어드민 모달
function adminModal() {
  //유저 정보 표시
  const userName = document.querySelector('#userName'),
    userImg = document.querySelector('#userImg'),
    userEmail = document.querySelector('#userEmail'),
    modalLink = document.querySelector('.modal-link'),
    admin = '<a href="/admin" ">페이지 관리</a>';
  modalLink.insertAdjacentHTML('afterbegin', admin);
  userImg.src = sessionStorage.getItem('profileImg');
  userName.textContent = sessionStorage.getItem('fullName');
  userEmail.textContent = sessionStorage.getItem('email');
  // 모달 버튼 핸들링
  const profileBtn = document.querySelector('#profile-btn'),
    modalProfile = document.querySelector('.modal-profile');
  profileBtn.addEventListener('click', openModal);
  function openModal(e) {
    e.preventDefault();
    modalProfile.classList.toggle('active');
  }
}
//네비게이션
function nav() {
  const navbar = document.querySelector('#navbar');
  const register = '<li><a href="/register">회원가입</a></li>',
    login = '<li><a href="/login">로그인</a></li>',
    account = `<li>
				<butten class="profile-btn" id="profile-btn" style="">
					<img id="userImg" src="/elice-rabbit.png" alt="proflie-img"></img>
				</butten>
			</li>`,
    cart =
      '<li><a href="/cart" aria-current="page"><span class="icon"><i class="fas fa-cart-shopping"></i></span><span>카트</span></a></li>';

  // 유저 로그인 유무
  if (sessionStorage.getItem('token')) {
    const userImg = document.querySelector('#userImg');
    userImg.src = sessionStorage.getItem('profileImg');
    const nav = `${cart} ${account}`;
    navbar.insertAdjacentHTML('afterend', nav);
    // 어드민인지 확인
    if (sessionStorage.getItem('isAdmin')) {
      adminModal();
    } else {
      userModal();
    }
  } else {
    navbar.insertAdjacentHTML('afterend', `${login} ${register} ${cart}`);
  }
  //카카오 로그아웃
  Kakao.init('e81149e34fc805f464419e5d213d69ee'); //발급받은 키 중 javascript키를 사용해준다. console.log(Kakao.isInitialized());
  async function kakaoLogout() {
    if (Kakao.Auth.getAccessToken()) {
      Kakao.API.request({
        url: '/v1/user/unlink',
        success: function (res) {
          alert(`정상적으로 로그아웃되었습니다.`);
        },
        fail: function (err) {
          console.log(err);
        },
      });
      Kakao.Auth.setAccessToken(undefined);
    }
  }
  // 로그아웃 구현
  const logoutElem = document.querySelector('#logout');
  if (logoutElem) {
    if (sessionStorage.getItem('loginTypeCode') == 1) {
      logoutElem.addEventListener('click', () => {
        logoutElem.href = 'javascript:void(0)';
        kakaoLogout();
        sessionStorage.clear();
        window.location.href = '/';
      });
    } else {
      logoutElem.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = '/';
      });
    }
  }
}

export { nav };
