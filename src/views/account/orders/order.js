import { get as Api } from '/api.js';
import { nav } from '/nav.js';

const ordersContainer = document.querySelector('.orders-container'),
	modal = document.querySelector('.modal'),
	modalBg = document.querySelector('.modal-background'),
	modalBtn = document.querySelector('.modal-close'),
	delCencelBtn = document.querySelector('#delCencelBtn');

modalBg.addEventListener('click', closeModal);
modalBtn.addEventListener('click', closeModal);
delCencelBtn.addEventListener('click', closeModal);

//네비게이션 바 생성
nav();
// const data = userInfo();
async function userInfo() {
	try {
		const data = await Api.get('/api/order/ownList');
		console.log(data);
		return data;
	} catch (err) {
		console.error(err.stack);
		alert(`문제가 발생하였습니다. ${err.message}`);
	}
}

showData();
// 전역 변수로 id를 쓰기 위해 선언
let id = '';
function showData() {
	// Json 데이터를 주문조회 테이블에 추가
	userData.forEach((data) => {
		ordersContainer.insertAdjacentHTML(
			'afterend',
			`<div class="colums order-item" id="order${data._id}"> 
  <div class="column is-2">${data.createAt}</div>
  <div class="column is-6" id="orderSummary">${data.summary} / ${data.amount}개</div>
  <div class="column is-2">${data.state}</div>
  <div class="column is-2">
	<button class="button" id="delBtn${data._id}">주문 취소</button>
	</div>
	</div>`,
		);
		// 주문취소 버튼 클릭시 이벤트
		const cancelBtn = document.querySelector('.button');
		cancelBtn.addEventListener('click', openModal);
		// 배송 완료시 주문 취소 버튼 비활성화
		if (data.state == '배송 완료') cancelBtn.style.display = 'none';

		// 모달이 열리면서 해당 주문 id를 전역 변수에 할당
		function openModal() {
			modal.classList.add('is-active');
			id = data._id;
		}
	});
}
// 결정 확인 버튼
const delCompleteBtn = document.querySelector('#delCompleteBtn');
delCompleteBtn.addEventListener('click', delOrder);
// 주문 취소 (del api요청)
function delOrder() {
	//여기 del api 비동기로 들어가야함
	//테이블 삭제
	document.querySelector(`#order${id}`).remove();
	closeModal();
}
//단순 모달 닫기 기능
function closeModal() {
	modal.classList.remove('is-active');
}
