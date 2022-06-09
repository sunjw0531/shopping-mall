// 요소(element), input 혹은 상수
const btnOrderList = document.querySelector('.btn-order-list');
const btnShoppingContinue = document.querySelector('.btn-shopping-continue');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  btnOrderList.addEventListener('click', handleOrderList);
  btnShoppingContinue.addEventListener('click', handleShoppingContinue);
}

// 주문내역 보기 버튼 핸들러
function handleOrderList() {
  window.location.href = '/account/orders';
}

// 쇼핑 계속하기 버튼 핸들러
function handleShoppingContinue() {
  window.location.href = '/';
}
