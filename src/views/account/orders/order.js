// import { get as Api } from '/api.js';
import * as Api from '../../api.js';
import { userTier } from '../account.js';
userTier();
const ordersContainer = document.querySelector('.orders-container'),
  modal = document.querySelector('.modal'),
  modalBg = document.querySelector('.modal-background'),
  modalBtn = document.querySelector('.modal-close'),
  delCencelBtn = document.querySelector('#delCencelBtn');

modalBg.addEventListener('click', closeModal);
modalBtn.addEventListener('click', closeModal);
delCencelBtn.addEventListener('click', closeModal);

async function userInfo() {
  try {
    const data = await Api.get('/api/order/ownList');
    return data;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. ${err.message}`);
  }
}
const UserData = await Promise.resolve(userInfo());
// 전역 변수로 id를 쓰기 위해 선언
let id = '';
function showData() {
  // Json 데이터를 주문조회 테이블에 추가
  // 0 : 상품 준비중, 1 : 상품 배송중, 2: 배송 완료
  UserData.forEach((data) => {
    let dateSplit = data.updatedAt;
    let date = dateSplit.substr(0, 10);
    let state = (data.status = 0)
      ? '상품 준비중'
      : (data.status = 1)
      ? '상품 배송중'
      : '배송 완료';
    for (let i in data.orderList) {
      id = data._id;
      let price = data.orderList[i].productId.price;
      let amount = data.orderList[i].volume;
      ordersContainer.insertAdjacentHTML(
        'afterend',
        `<div class="colums order-item" id="order${id}"> 
	<div class="column is-4" id="orderSummary">
	<img class="order-img" src='${data.orderList[i].productId.image}'>
  <div>	${data.orderList[i].productId.name}</div>
	</div>
  <div class="column is-2">${date}</div>
  <div class="column is-2">${price}원 (${amount}개)</div>
  <div class="column is-2">${state}</div>
  <div class="column is-2">
	<button class="button" id="${id}">주문 취소</button>
  <span>${id}</span>
	</div>
 	</div>`,
      );
      // 주문취소 버튼 클릭시 이벤트
      const cancelBtn = document.querySelector('.button');
      cancelBtn.addEventListener('click', openModal);
      // 배송 완료시 주문 취소 버튼 비활성화
      if (state == 2) cancelBtn.style.display = 'none';

      // 모달이 열리면서 해당 주문 id를 전역 변수에 할당
      function openModal() {
        id = cancelBtn.id;
        modal.classList.add('is-active');
      }
    }
  });
}
showData();
// 결정 확인 버튼
const delCompleteBtn = document.querySelector('#delCompleteBtn');
delCompleteBtn.addEventListener('click', delOrder);
// 주문 취소 (del api요청)
async function delOrder() {
  //데이터 삭제 요청
  Api.patch('/api/order/deleteFlag', id);
  //테이블 삭제
  const table = document.querySelectorAll(`#order${id}`);
  table.forEach(function (e) {
    e.remove();
  });
  closeModal();
  // location.reload();
}
//단순 모달 닫기 기능
function closeModal() {
  modal.classList.remove('is-active');
}
