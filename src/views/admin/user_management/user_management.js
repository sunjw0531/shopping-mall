import * as Api from '../../api.js';

//top cotainer
const showCnt = document.getElementsByTagName('p');

//modal 변수 선언
const modal = document.querySelector('.modal'),
	modalBg = document.querySelector('.modal-background'),
	modalbtn = document.querySelector('.modal-close'),
	delCancelBtn = document.querySelector('#delCancelBtn'),
	delCompleteBtn = document.querySelector('#delCompleteBtn');

getUserInfo();

// users 정보 목록 받아오기 api요청
async function getUserInfo() {
	try {
		const userInfo = await Api.get('/api/userlist');
		inputUser(userInfo); //유저 목록 데이터 생성
		userCnt(userInfo); //총회원수, 관리자수, ouath가입자수 카운트
	} catch (err) {
		console.error(err);
	}
}

//날짜 포맷 설정 함수 (YYYY-MM-DD)
function dateFormat(dateValue) {
	const date = new Date(dateValue);
	const year = date.getFullYear();
	const month = ('0' + (1 + date.getMonth())).slice(-2);
	const day = ('0' + date.getDate()).slice(-2);
	return `${year}-${month}-${day}`;
}

//getUserInfo 유저 정보를 불러와 목록으로 출력
function inputUser(item) {
	const tbody = document.querySelector('#tbody');
	// 해보기
	// const tr = document.createElement('tr');
	// tr.setAttribute('id', `user${data._id}`);
	// const td = document.createElement('td');
	// td.textContent = ${dateFormat(data.createdAt)}; appendChild로 붙여 넣기

	//insertAdjacentHTML < createDOM PARSHING 속도가 빠름 
	item.forEach((data) => {
		tbody.insertAdjacentHTML(
			'afterend',
			`
    <tr id="user${data._id}">
      <td>${dateFormat(data.createdAt)}</td>
      <td>${data.email}</td>
      <td>${data.loginTypeCode == 0 ? `일반` : `소셜`}</td>
      <td>${data.fullName}</td>
      <td>
        <select class="select-user-type">
          <option value="0" ${data.admin ? `selected` : ``}> 일반사용자</option>
          <option value="1" ${data.admin ? `selected` : ``}> 관리자 </option>
        </select>
      </td>
      <td><button class="deleteUserBtn" id="btn${data._id}">회원정보 삭제 </td>
    </tr>
    `,
		);
		const deleteUserBtn = document.querySelector('.deleteUserBtn');
		deleteUserBtn.addEventListener('click', () => openModal(data._id));
		const changeOption = document.querySelector('.select-user-type');
		changeOption.addEventListener('change', () =>
			optionChange(
				changeOption.options[changeOption.selectedIndex].value,
				data._id,
			),
		);
	});
}

//select - option 변경시 카운트 값이 바뀌도록 함수 설정
async function optionChange(admin, id) {
	try {
		const adminStatus = { admin };
		await Api.patch(`/api/users`, id, adminStatus);
		//화면내에 관리자수 카운트
		const selectOption = Number(admin);
		if (selectOption === 1) {
			showCnt[1].innerText++;
		} else if (selectOption === 0) {
			showCnt[1].innerText--;
		}
	} catch (err) {
		console.error(err);
	}
}

// 회원 삭제 버튼 클릭 시
async function openModal(id) {
	modal.classList.add('is-active');
	delCompleteBtn.addEventListener('click', () => setDelete(id));
}

//modal창에서 확인 시 회원 삭제
async function setDelete(id) {
	try {
		await Api.delete(`/api/users/${id}`);
		// 화면상에서 삭제 부분을 구현
		const parent = document.querySelector(`#user${id}`);
		const selectOption = Number(parent.childNodes[9].childNodes[1].value);
		const oauther = parent.childNodes[5].childNodes[0].nodeValue;
		if (selectOption === 1) {
			showCnt[1].innerText--;
		}
		if (oauther === '소셜') {
			showCnt[2].innerText--;
		}
		showCnt[0].innerText--;
		parent.remove();
		closeModal();
	} catch (err) {
		console.error(err);
	}
}

//총회원수, ouath, admin 수
async function userCnt(item) {
	let oauthCnt = 0;
	let adminCnt = 0;
	for (let i = 0; i < item.length; i++) {
		if (item[i].loginTypeCode == 1) {
			oauthCnt++;
		}
		if (item[i].admin) {
			adminCnt++;
		}
	}
	showCnt[0].innerText = item.length;
	showCnt[1].innerText = adminCnt;
	showCnt[2].innerText = oauthCnt;
}

//modal btn event
modalBg.addEventListener('click', closeModal);
modalbtn.addEventListener('click', closeModal);
delCancelBtn.addEventListener('click', closeModal);

function closeModal() {
	modal.classList.remove('is-active');
}
