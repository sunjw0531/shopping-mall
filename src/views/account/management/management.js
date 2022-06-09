import * as Api from '../../api.js';
import { userTier } from '../account.js';
//네비게이션 바 생성
userTier();
// elements, input 변수 선언
const idChangeBtn = document.querySelector('#idChangeBtn'),
	pwChangeBtn = document.querySelector('#pwChangeBtn'),
	addressChangeBtn = document.querySelector('#addressChangeBtn'),
	phoneChangeBtn = document.querySelector('#phoneChangeBtn'),
	idCompleteBtn = document.querySelector('#idCompleteBtn'),
	pwCompleteBtn = document.querySelector('#pwCompleteBtn'),
	addressCompleteBtn = document.querySelector('#addressCompleteBtn'),
	phoneCompleteBtn = document.querySelector('#phoneCompleteBtn'),
	idCencelBtn = document.querySelector('#idCencelBtn'),
	pwCencelBtn = document.querySelector('#pwCencelBtn'),
	addressCencelBtn = document.querySelector('#addressCencelBtn'),
	phoneCencelBtn = document.querySelector('#phoneCencelBtn'),
	newPwConfirm = document.querySelector('#newPwConfirm'),
	daumApiBtn = document.querySelector('#searchAdressBtn'),
	newIdInput = document.querySelector('#newIdInput'),
	newPwInput = document.querySelector('#newPwInput'),
	address1Input = document.querySelector('#address1'),
	address2Input = document.querySelector('#address2'),
	postalInput = document.querySelector('#postal'),
	newPhoneInput = document.querySelector('#newPhoneInput'),
	email = document.querySelector('#email'),
	nameDisplay = document.querySelector('#currentId'),
	addressDisplay = document.querySelector('#currentAddress'),
	phoneDisplay = document.querySelector('#currentPhone');

let id;
//유저 정보 받아오기
async function getInfo() {
	try {
		const data = await Api.get(
			`/api/users/${sessionStorage.getItem('userId')}`,
		);
		id = data._id;
		const currentFullName = data.fullName,
			currentPhoneNumber = data.phoneNumber,
			currentAddress = data.address
				? `(${data.address.postalCode}) ${data.address.address1} (${data.address.address2})`
				: '-';
		nameDisplay.textContent = currentFullName;
		addressDisplay.textContent = currentAddress;
		phoneDisplay.textContent = currentPhoneNumber ? currentPhoneNumber : '-';
	} catch (err) {
		console.error(err.stack);
		alert(`오류가 발생했습니다: ${err.message}`);
	}
}
getInfo();

// 변경 입력 폼이 보이게
function displaySwitch(e) {
	e.preventDefault();
	e.path[2].lastElementChild.classList.remove('display-none');
	e.path[2].lastElementChild.classList.add('display-gird');
	e.path[1].classList.remove('display-grid');
	e.path[1].classList.add('display-none');
}

idChangeBtn.addEventListener('click', displaySwitch);
pwChangeBtn.addEventListener('click', displaySwitch);
addressChangeBtn.addEventListener('click', displaySwitch);
phoneChangeBtn.addEventListener('click', displaySwitch);

//취소시 원래대로 보이게
function cencleSwitch(e) {
	e.preventDefault();
	e.path[3].classList.remove('display-grid');
	e.path[3].classList.add('display-none');
	e.path[4].firstElementChild.classList.remove('display-none');
	e.path[4].firstElementChild.classList.add('display-grid');
}

idCencelBtn.addEventListener('click', cencleSwitch);
pwCencelBtn.addEventListener('click', cencleSwitch);
addressCencelBtn.addEventListener('click', cencleSwitch);
phoneCencelBtn.addEventListener('click', cencleSwitch);

idCompleteBtn.addEventListener('click', setName);
pwCompleteBtn.addEventListener('click', setPassword);
addressCompleteBtn.addEventListener('click', setAddress);
daumApiBtn.addEventListener('click', handleDaumApi);
phoneCompleteBtn.addEventListener('click', setPhone);

//이름 수정
async function setName(e) {
	e.preventDefault();
	const fullName = newIdInput.value;
	try {
		const data = { fullName };
		await Api.patch('/api/users', id, data);
		cencleSwitch(e);
		nameDisplay.textContent = fullName;
		location.reload();
	} catch (err) {
		console.error(err.stack);
		alert(`${err.message}`);
	}
}
//비밀번호 수정
async function setPassword(e) {
	const password = newPwInput.value,
		passwordConfirm = newPwConfirm.value,
		isPasswordValid = password.length === 0 || password.length >= 4,
		isPasswordConfirm = password === passwordConfirm;
	if (!isPasswordValid) {
		return alert('새로 변경하시는 비밀번호가 4글자 이상인지 확인해 주세요.');
	}
	if (!isPasswordConfirm) {
		return alert('변경하시는 비밀번호와 비밀번호 확인이 일치 하지 않습니다.');
	}
	try {
		const data = { password };
		await Api.patch('/api/users', id, data);
		alert('성공');
		cencleSwitch(e);
	} catch (err) {
		console.error(err.stack);
		alert(`${err.message}`);
	}
}
//주소 수정
async function setAddress(e) {
	const postalCode = postalInput.value;
	const address1 = address1Input.value;
	const address2 = address2Input.value;
	try {
		const address = { postalCode, address1, address2 };
		const data = { address };
		await Api.patch('/api/users', id, data);
		cencleSwitch(e);
		addressDisplay.textContent = `(${postalCode}) ${address1} ${address2}`;
	} catch (err) {
		console.error(err.stack);
		alert(`${err.message}`);
	}
}
// 다음 주소 api
function handleDaumApi() {
	new daum.Postcode({
		oncomplete: function (data) {
			let addr = '';

			if (data.userSelectedType === 'R') {
				// 사용자가 도로명 주소를 선택했을 경우
				addr = data.roadAddress;
			} else {
				// 사용자가 지번 주소를 선택했을 경우(J)
				addr = data.jibunAddress;
			}

			postalInput.value = data.zonecode;
			address1Input.value = addr;

			address2Input.value = '';
			address2Input.focus();
		},
	}).open();
}
//번호 수정
async function setPhone(e) {
	const phoneNumber = newPhoneInput.value;
	try {
		const data = { phoneNumber };
		await Api.patch('/api/users', id, data);
		cencleSwitch(e);
		phoneDisplay.textContent = phoneNumber;
	} catch (err) {
		console.error(err.stack);
		alert(`${err.message}`);
	}
}
