import * as Api from '../../api.js';
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
	searchAdressBtn = document.querySelector('#searchAdressBtn'),
	newIdInput = document.querySelector('#newIdInput'),
	newPwInput = document.querySelector('#newPwInput'),
	newAdressInput = document.querySelector('#newAdressInput'),
	newPhoneInput = document.querySelector('#newPhoneInput'),
	email = document.querySelector('#email'),
	nameDisplay = document.querySelector('#currentId'),
	addressDisplay = document.querySelector('#currentAddress'),
	phoneDisplay = document.querySelector('#currentPhone');

email.innerHTML = `(${sessionStorage.getItem('email')})`;

idChangeBtn.addEventListener('click', displaySwitch);
pwChangeBtn.addEventListener('click', displaySwitch);
addressChangeBtn.addEventListener('click', displaySwitch);
phoneChangeBtn.addEventListener('click', displaySwitch);

idCencelBtn.addEventListener('click', cencleSwitch);
pwCencelBtn.addEventListener('click', cencleSwitch);
addressCencelBtn.addEventListener('click', cencleSwitch);
phoneCencelBtn.addEventListener('click', cencleSwitch);

idCompleteBtn.addEventListener('click', setName);
pwCompleteBtn.addEventListener('click', setPassword);
addressCompleteBtn.addEventListener('click', setAddress);
phoneCompleteBtn.addEventListener('click', setPhone);

// 변경 입력 폼이 보이게
function displaySwitch(e) {
	e.preventDefault();
	e.path[2].lastElementChild.classList.remove('display-none');
	e.path[2].lastElementChild.classList.add('display-gird');
	e.path[1].classList.remove('display-grid');
	e.path[1].classList.add('display-none');
}
//취소시 원래대로 보이게
function cencleSwitch(e) {
	e.preventDefault();
	e.path[3].classList.remove('display-grid');
	e.path[3].classList.add('display-none');
	e.path[4].firstElementChild.classList.remove('display-none');
	e.path[4].firstElementChild.classList.add('display-grid');
}
//유저 정보 받아오기
getInfo();
let id;
async function getInfo() {
	try {
		const data = await Api.get(`/api/email/${sessionStorage.getItem('email')}`);
		const currentFullName = data.fullName,
			currentphoneNumber = data.phoneNumber,
			currentAddress = data.address;
		nameDisplay.innerHTML = currentFullName;
		addressDisplay.innerHTML = currentphoneNumber;
		phoneDisplay.innerHTML = currentAddress;
		id = data.id;
	} catch (err) {
		console.error(err.stack);
		alert(`오류가 발생했습니다: ${err.message}`);
	}
}

//이름 수정
async function setName() {
	const fullName = newIdInput.value;
	try {
		const send = { fullName };
		await Api.patch('/api/users', id, send);
		location.reload();
	} catch (err) {
		console.error(err.stack);
		alert(`${err.message}`);
	}
}
//비밀번호 수정
async function setPassword() {
	const newPassword = newPwInput.value,
		passwordConfirm = newPwConfirm.value,
		isPasswordValid = newPassword.length === 0 || newPassword.length >= 4,
		isPasswordConfirm = newPassword === passwordConfirm;
	if (!isPasswordValid) {
		return alert('새로 변경하시는 비밀번호가 4글자 이상인지 확인해 주세요.');
	}
	if (!isPasswordConfirm) {
		return alert('변경하시는 비밀번호와 비밀번호 확인이 일치 하지 않습니다.');
	}
	try {
		const send = { newPassword };
		await Api.patch('/api/users', id, send);
		location.reload();
	} catch (err) {
		console.error(err.stack);
		alert(`${err.message}`);
	}
}
//주소 수정
async function setAddress() {
	const adress = newAdressInput.value;
	try {
		const send = { adress };
		await Api.patch('/api/users', id, send);
		location.reload();
	} catch (err) {
		console.error(err.stack);
		alert(`${err.message}`);
	}
}
//번호 수정
async function setPhone() {
	const phone = newPhoneInput.value;
	try {
		const send = { phone };
		await Api.patch('/api/users', id, send);
		location.reload();
	} catch (err) {
		console.error(err.stack);
		alert(`${err.message}`);
	}
}
