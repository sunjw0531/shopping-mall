import * as Api from '../../api.js';

const ordersContainer = document.querySelector('.orders-container'),
	modal = document.querySelector('.modal'),
	modalBg = document.querySelector('.modal-background'),
	modalbtn = document.querySelector('.modal-close'),
	delCencelBtn = document.querySelector('#delcencelBtn');

modalBg.addEventListener('click', closeModal);
modalbtn.addEventListener('click', closeModal);
delCencelBtn.addEventListener('click', closeModal);

//테스트 데이터
const userData = [
	{
		_id: 1,
		createAt: '2022-05-30',
		summary: '아이보리 니트',
		amount: 1,
		state: '상품 준비중',
	},
	{
		_id: 2,
		createAt: '2022-05-29',
		summary: '남성 정장',
		amount: 1,
		state: '출고중',
	},
	{
		_id: 3,
		createAt: '2022-05-28',
		summary: '봄, 가을 남자 느낌 물씬 코디',
		amount: 2,
		state: '상품 준비중',
	},
	{
		_id: 4,
		createAt: '2022-05-30',
		summary: '캐주얼 반팔 코디',
		amount: 3,
		state: '배송 완료',
	},
];
showData();
// 전역 변수로 id를 쓰기 위해 선언
let id = '';
function showData() {
	// Json 데이터를 주문조회 테이블에 추가
	userData.forEach((data) => {
		ordersContainer.insertAdjacentHTML(
			'afterend',
			`<div class="colums order-item" id="order_${data._id}"> 
  <div class="column is-2">${data.createAt}</div>
  <div class="column is-6" id="order-summary">${data.summary} / ${data.amount}개</div>
  <div class="column is-2">${data.state}</div>
  <div class="column is-2">
	<button class="button" id="delBtn_${data._id}">주문 취소</button>
	</div>
 	</div>`,
		);
		// 주문취소 버튼 클릭시 이벤트
		const cancelBtn = document.querySelector('.button');
		cancelBtn.addEventListener('click', openModal);
		// 배송 완료시 주문 취소 버튼 비활성화
		if (data.state == '배송 완료') {
			cancelBtn.style.display = 'none';
		}

		// 모달이 열리면서 해당 주문 id를 전역 변수에 할당
		function openModal() {
			modal.classList.add('is-active');
			id = data._id;
		}
	});
}
// 결정 확인 버튼
const delCompletBtn = document.querySelector('#delCompletBtn');
delCompletBtn.addEventListener('click', delOrder);
// 주문 취소 (del api요청)
function delOrder() {
	//여기 del api 비동기로 들어가야함
	//테이블 삭제
	document.querySelector(`#order_${id}`).remove();
	closeModal();
}
//단순 모달 닫기 기능
function closeModal() {
	modal.classList.remove('is-active');
}
