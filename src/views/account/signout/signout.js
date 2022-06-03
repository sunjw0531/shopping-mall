import * as Api from '../../api.js';

const modal = document.querySelector('.modal'),
	modalBg = document.querySelector('.modal-background'),
	modalbtn = document.querySelector('.modal-close'),
	delCencelBtn = document.querySelector('#delcencelBtn'),
	submitBtn = document.querySelector('#submitBtn'),
	delCompletBtn = document.querySelector('#delCompletBtn'),
	passwordInput = document.querySelector('#passwordInput');

modalBg.addEventListener('click', closeModal);
modalbtn.addEventListener('click', closeModal);
delCencelBtn.addEventListener('click', closeModal);
submitBtn.addEventListener('click', openModal);
delCompletBtn.addEventListener('click', delUser);

// 유저 정보 삭제
function delUser(e) {
	//del api
	closeModal();
}

// 모달 닫기 기능
function closeModal(e) {
	e.preventDefault();
	modal.classList.remove('is-active');
}

//모달 열기 기능
function openModal(e) {
	e.preventDefault();
	modal.classList.add('is-active');
}


