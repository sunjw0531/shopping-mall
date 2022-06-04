import * as Api from '/api.js';

// 테스트용 데이터
const product = {
  id: 1,
  name: '예쁜 남자 상의',
  image: 'https://bulma.io/images/placeholders/480x640.png',
  price: 39000,
  description: '세상에서 제일 예쁜 상의입니다.',
};

// 요소(element), input 혹은 상수
const btnBuy = document.querySelector('.btn-buy');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertProduct();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  btnBuy.addEventListener('click', handleBtnBuy);
}

// 상품 HTML 요소 생성
function insertProduct() {
  const producImageWrap = document.querySelector('.product-image-wrap');
  // TODO: 테스트 데이터 -> 실제 데이터
  const data = product;

  // 상품 이미지
  const productImage = document.createElement('img');
  productImage.src = data.image;
  producImageWrap.append(productImage);

  // 상품명
  const productName = document.querySelector('.product-name');
  productName.innerHTML = `${data.name}`;

  // 상품 금액
  const productPrice = document.querySelector('.product-price');
  productPrice.innerHTML = `${data.price.toLocaleString()}원`;

  // 상품 설명
  const productContent = document.querySelector('.product-content');
  productContent.innerHTML = `${data.description}`;
}

function handleBtnBuy() {
  // TODO 스토리지 등록
  window.location.href = '/buy';
}
