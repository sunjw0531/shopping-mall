import * as Api from '../../api.js';
import { dateFormat } from '../../useful-functions.js';

// top_cotainer
const totalProducts = document.querySelector('#totalProducts'),
  productsReady = document.querySelector('#productsReady'),
  productsGoing = document.querySelector('#productsGoing'),
  productsSuccess = document.querySelector('#productsSuccess');

//modal 변수 선언
const modal = document.querySelector('.modal'),
  modalBg = document.querySelector('.modal-background'),
  modalbtn = document.querySelector('.modal-close'),
  delCancelBtn = document.querySelector('#delCancelBtn'),
  delCompleteBtn = document.querySelector('#delCompleteBtn');

getOrderInfo();
// orders 목록 받아오기 api 요청
async function getOrderInfo() {
  try {
    const orderInfo = await Api.get('/api/order/list');
    inputOrders(orderInfo);
    orderCnt(orderInfo);
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다 ${err.message}`);
  }
}

// 데이터 주문 리스트에 추가
async function inputOrders(item) {
  const tbody = document.querySelector('#tbody');
  item.forEach((data) => {
    tbody.insertAdjacentHTML(
      'afterend',
      `
    <tr id="order${data._id}">
      <td> ${dateFormat(data.createdAt)}</td>
			<td> ${data.receiver}</td>
      <td id ="productList"></td>
      <td id ="productTotalPrice"></td>
      <td>
        <select class="select-product-state" id ="select${data._id}">
          <option value="0" ${
            data.status == 0 ? `selected` : ``
          }> 상품 준비중 </option>
          <option value="1" ${
            data.status == 1 ? `selected` : ``
          }> 상품 배송중 </option>
          <option value="2" ${
            data.status == 2 ? `selected` : ``
          }> 배송 완료 </option>
        </select>
      </td>
      <td> <button class="deleteOrderBtn" id="btn${
        data._id
      }">주문 취소 & 환불</button>
    </tr>
    `,
    );
    //삭제 버튼
    const deleteOrderBtn = document.querySelector('.deleteOrderBtn');
    deleteOrderBtn.addEventListener('click', () => openModal(data._id));
    // 주문 정보, 주문 총액
    const inputOrderData = document.querySelector('#productList');
    const productTotalPrice = document.querySelector('#productTotalPrice');
    let totalPrice = 0;
    for (let i = 0; i < data.orderList.length; i++) {
      inputOrderData.innerHTML += `${data.orderList[i].productId.name} / ${data.orderList[i].volume}개 <br>`;
      totalPrice += Number(
        data.orderList[i].productId.price * data.orderList[i].volume,
      );
    }

    productTotalPrice.innerText = `${totalPrice.toLocaleString()}원`;

    const selectChangeOption = document.querySelector('.select-product-state');
    selectChangeOption.addEventListener('change', () =>
      setOption(
        data._id,
        selectChangeOption.options[selectChangeOption.selectedIndex].value,
      ),
    );
  });
}

async function openModal(id) {
  modal.classList.add('is-active');
  delCompleteBtn.addEventListener('click', () => setDelete(id));
}

async function setDelete(_id) {
  await Api.patch('/api/order/deleteFlag', _id);
  const parent = document.querySelector(`#order${_id}`);
  parent.remove();
  const selectOption = parent.childNodes[9].childNodes[1].value;
  if (selectOption == 0) {
    productsReady.innerText--;
  } else if (selectOption == 1) {
    productsGoing.innerText--;
  } else if (selectOption == 2) {
    productsSuccess.innerText--;
  }
  totalProducts.innerText--;
  closeModal();
}

async function setOption(id, option) {
  try {
    await Api.patch(`/api/order/delivery`, `?orderId=${id}`, {
      status: option,
    });
    location.reload();
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다 ${err.message}`);
  }
}

async function orderCnt(item) {
  let readyCnt = 0;
  let goingCnt = 0;
  let successCnt = 0;
  item.forEach((data) => {
    if (data.status == 0) {
      readyCnt++;
    } else if (data.status == 1) {
      goingCnt++;
    } else if (data.status == 2) {
      successCnt++;
    }
  });
  totalProducts.innerText = item.length;
  productsReady.innerText = readyCnt;
  productsGoing.innerText = goingCnt;
  productsSuccess.innerText = successCnt;
}

//modal btn event
modalBg.addEventListener('click', closeModal);
modalbtn.addEventListener('click', closeModal);
delCancelBtn.addEventListener('click', closeModal);

function closeModal() {
  modal.classList.remove('is-active');
}
