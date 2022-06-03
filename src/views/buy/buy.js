import * as Api from '/api.js';

// 테스트용 데이터
const userInfo = {
  id: 1,
  email: 'user1@elice.io',
  fullName: '김체셔',
  phoneNumber: '010-1234-5678',
  address: {
    postalCode: 12345,
    address1: '부산시 엘리스로1',
    address2: '엘리스 B1-1',
  },
};

const buyingProduct = {
  id: 1,
  name: '예쁜 상의1',
  price: 39000,
};

// 요소(element), input 혹은 상수
const selectList = document.querySelector('.buy-form-select');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  selectList.addEventListener('change', handleSelect);
}

// 테스트용 로직
function getUserInfo() {
  return userInfo;
}
function getProductInfo() {
  return buyingProduct;
}

function handleSelect(e) {
  console.log(e.target);
}
