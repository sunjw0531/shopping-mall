import * as Api from '/api.js';
import { nav } from '/component.js';
nav();

// 요소(element), input 혹은 상수
const productContainer = document.querySelector('.product-container');
const producImageWrap = document.querySelector('.product-image-wrap');
const productDiv = document.querySelector('.product');
const productName = document.querySelector('.product-name');
const productPrice = document.querySelector('.product-price');
const productContent = document.querySelector('.product-content');
const inputProductCount = document.querySelector('.input-product-count');
const btnCountDecrease = document.querySelector('.btn-count-decrease');
const btnCountIncrease = document.querySelector('.btn-count-increase');
const btnCart = document.querySelector('.btn-cart');
const btnBuy = document.querySelector('.btn-buy');

const UPLOADS_DIR = 'uploads/';

// HTML 요소 생성, 이벤트
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertProductContent();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  btnCountDecrease.addEventListener('click', handleCountDecrease);
  btnCountIncrease.addEventListener('click', handleCountIncrease);
  btnCart.addEventListener('click', handleBtnCart);
  btnBuy.addEventListener('click', handleBtnBuy);
}

// 해당 상품 id
function getProductId() {
  const fullLocationArray = window.location.href.split('/');
  const locationArray = fullLocationArray.filter((value) => value !== '');
  const productId = locationArray.pop();
  return productId;
}

// 상품 HTML 요소 생성
async function insertProductContent() {
  const productId = getProductId();
  const productData = await Api.get(`/api/product/detail/${productId}`);

  if (productData) {
    // 상품 이미지
    const productImage = document.createElement('img');
    productImage.classList.add('product-image');
    productImage.src = productData.image;
    producImageWrap.append(productImage);

    // 상품명
    productName.textContent = `${productData.name}`;

    // 상품 금액
    productPrice.textContent = `${productData.price.toLocaleString()}원`;

    // 상품 설명
    productContent.textContent = `${productData.information}`;
  } else {
    producImageWrap.classList.add('nodata');
    productDiv.classList.add('nodata');

    const productNodata = document.createElement('div');
    productNodata.classList.add('product-nodata');
    productNodata.classList.add('box');
    productNodata.textContent = '해당 상품이 존재하지 않습니다.';
    productContainer.append(productNodata);
  }
}

function handleCountDecrease() {
  if (Number(inputProductCount.value) > 1) {
    inputProductCount.value = String(Number(inputProductCount.value) - 1);
  }
}

function handleCountIncrease() {
  if (inputProductCount.value < 10) {
    inputProductCount.value = String(Number(inputProductCount.value) + 1);
  }
}

// 장바구니 로컬 스토리지 추가
function addCartLocalStorage() {
  const userId = sessionStorage.getItem('userId') || 'null';
  const productId = getProductId();
  const count = inputProductCount.value;
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // userId를 전달하는 이유
  // 다른 user의 장바구니에 출력하지 않기 위해
  const productImage = document.querySelector('.product-image');
  const imagePath = productImage.src;
  const image = imagePath.substr(imagePath.indexOf(UPLOADS_DIR));
  const name = productName.textContent;
  const price = productPrice.textContent.replace('원', '').replace(',', '');

  // 장바구니 정보
  const cartInfoData = {
    userId,
    productId,
    image,
    name,
    price,
    count,
  };

  let isExists = false;

  cart.forEach((el) => {
    // 해당 유저의 장바구니에 상품이 존재할 경우
    if (el.userId === userId && el.productId === productId) {
      el.count = String(Number(el.count) + Number(count));
      isExists = true;
    }
  });

  // 해당 유저의 장바구니에 상품이 존재하지 않을 경우
  if (!isExists) {
    cart.push(cartInfoData);
  }

  // 로컬 스토리지 등록
  localStorage.setItem('cart', JSON.stringify(cart));
}

// 장바구니 추가하기 버튼 핸들러
function handleBtnCart() {
  addCartLocalStorage();

  if (confirm('장바구니에 추가했습니다. 장바구니 페이지로 이동하시겠습니까?')) {
    window.location.href = '/cart';
  }
}

// 바로 구매하기 버튼 핸들러
function handleBtnBuy() {
  const userId = sessionStorage.getItem('userId') || 'null';
  if (userId === 'null') {
    window.location.href = '/login';
    return;
  }
  const productId = getProductId();
  const productImage = document.querySelector('.product-image');
  const imagePath = productImage.src;
  const image = imagePath.substr(imagePath.indexOf(UPLOADS_DIR));
  const name = productName.textContent;
  const price = productPrice.textContent.replace('원', '').replace(',', '');
  const count = inputProductCount.value;

  // 구매 정보
  const buyInfoData = [
    {
      userId,
      productId,
      image,
      name,
      price,
      count,
    },
  ];

  localStorage.setItem('buy', JSON.stringify(buyInfoData));

  // 장바구니 로컬 스토리지에도 등록
  addCartLocalStorage();
  window.location.href = '/buy';
}
