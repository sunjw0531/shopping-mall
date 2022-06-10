import * as Api from '/api.js';
import { nav } from '/component.js';
//네비게이션 바 생성
nav();

// 요소(element), input 혹은 상수
const productsWrap = document.querySelector('.products-wrap');
const btnClear = document.querySelector('.btn-clear');
const orderProductCount = document.querySelector('.order-product-count');
const orderProductPrice = document.querySelector('.order-product-price');
const deliveryPrice = document.querySelector('.delivery-price');
const totalPrice = document.querySelector('.total-price');
const btnBuy = document.querySelector('.btn-buy');

const DELIVERY_STANDARD = 50_000;
const DELIVERY_PRICE = 3_000;

// HTML 요소 생성, 이벤트
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  moveLoginCart();
  insertCartLocalStorage();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  btnClear.addEventListener('click', handleBtnClear);
  btnBuy.addEventListener('click', handleBtnBuy);
}

// 배송비 계산
function getDeliveryPrice(totalPrice) {
  return totalPrice >= DELIVERY_STANDARD || totalPrice === 0
    ? 0
    : DELIVERY_PRICE;
}

// 비로그인 -> 로그인 장바구니 이동
function moveLoginCart() {
  const userId = sessionStorage.getItem('userId') || 'null';

  // 비로그인 작업 중단
  if (userId === 'null') {
    return;
  }

  // 중복 상품 개수 더하고 null 데이터 삭제
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let workIndex = [];
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].userId === 'null') {
      let isExists = false;
      for (let j = 0; j < cart.length; j++) {
        if (
          cart[j].userId === userId &&
          cart[i].productId === cart[j].productId
        ) {
          cart[j].count = String(Number(cart[i].count) + Number(cart[j].count));
          isExists = true;
          if (cart[j].count > 10) {
            cart[j].count = 10;
          }
        }
      }
      if (isExists) {
        workIndex.push(i);
      } else {
        cart[i].userId = userId;
      }
    }
  }
  for (let i = workIndex.length - 1; i >= 0; i--) {
    const index = workIndex[i];
    cart.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
}

// 장바구니 로컬 스토리지 출력
function insertCartLocalStorage() {
  const userId = sessionStorage.getItem('userId') || 'null';
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let count = 0;
  cart.forEach((el) => {
    if (el.userId === userId) count++;
  });

  // 장바구니 상품 출력
  // 초기화
  productsWrap.innerHTML = '';

  if (count > 0) {
    const userCart = JSON.parse(localStorage.getItem('cart')) || [];

    let allProductCount = 0;
    let allProductAmount = 0;

    userCart.forEach((cartInfo, index) => {
      const { userId: id, productId, image, name, price, count } = cartInfo;
      if (id === userId) {
        const product = document.createElement('div');
        product.classList.add('product');
        productsWrap.appendChild(product);

        const productImage = document.createElement('img');
        const productName = document.createElement('span');
        const calculation = document.createElement('div');
        const trash = document.createElement('div');
        productImage.classList.add('product-img');
        productName.classList.add('product-name');
        calculation.classList.add('calculation');
        trash.classList.add('trash');
        productImage.src = image;
        productName.textContent = name;
        trash.setAttribute('data-product', productId);
        trash.onclick = handleBtnTrash;
        trash.innerHTML = `<i class="fa-solid fa-trash" data-product=${productId}></i>`;
        product.append(productImage, productName, calculation, trash);

        const productPrice = document.createElement('span');
        const iconMultiple = document.createElement('i');
        const productCount = document.createElement('div');
        const iconEquals = document.createElement('i');
        const productAmount = document.createElement('span');
        productPrice.classList.add('product-price');
        iconMultiple.classList.add('icon');
        iconMultiple.classList.add('fa-solid');
        iconMultiple.classList.add('fa-xmark');
        productCount.classList.add('products-count');
        iconEquals.classList.add('icon');
        iconEquals.classList.add('fa-solid');
        iconEquals.classList.add('fa-equals');
        productAmount.classList.add('product-amount');
        productPrice.textContent = `${Number(price).toLocaleString()}원`;
        productAmount.textContent = `${(
          Number(price) * Number(count)
        ).toLocaleString()}원`;
        calculation.append(
          productPrice,
          iconMultiple,
          productCount,
          iconEquals,
          productAmount,
        );

        const btnCountDecrease = document.createElement('button');
        const inputCount = document.createElement('input');
        const btnCountIncrease = document.createElement('button');
        btnCountDecrease.classList.add('btn-count-decrease');
        btnCountDecrease.classList.add('button');
        btnCountDecrease.classList.add('is-small');
        inputCount.classList.add('input-count');
        inputCount.classList.add('input');
        inputCount.classList.add('is-small');
        btnCountIncrease.classList.add('btn-count-increase');
        btnCountIncrease.classList.add('button');
        btnCountIncrease.classList.add('is-small');
        btnCountDecrease.setAttribute('data-product', productId);
        btnCountDecrease.setAttribute('data-input', 'input-count');
        btnCountDecrease.setAttribute('data-index', index);
        btnCountIncrease.setAttribute('data-product', productId);
        btnCountIncrease.setAttribute('data-input', 'input-count');
        btnCountIncrease.setAttribute('data-index', index);
        inputCount.setAttribute('type', 'number');
        inputCount.setAttribute('min', '1');
        inputCount.setAttribute('max', '10');
        inputCount.setAttribute('value', count);
        inputCount.setAttribute('readonly', '');
        btnCountDecrease.textContent = '-';
        btnCountIncrease.textContent = '+';
        btnCountDecrease.onclick = handleCountDecrease;
        btnCountIncrease.onclick = handleCountIncrease;
        productCount.append(btnCountDecrease, inputCount, btnCountIncrease);

        allProductCount++;
        allProductAmount += Number(price) * Number(count);
      }
    });

    // 결제 정보
    const delivery = allProductAmount > DELIVERY_STANDARD ? 0 : DELIVERY_PRICE;
    orderProductCount.textContent = `${allProductCount}개`;
    orderProductPrice.textContent = `${allProductAmount.toLocaleString()}원`;
    deliveryPrice.textContent = `${delivery.toLocaleString()}원`;
    totalPrice.textContent = `${(
      allProductAmount + delivery
    ).toLocaleString()}원`;
  } else {
    btnClear.disabled = true;
    btnBuy.disabled = true;
    const emptyProduct = document.createElement('div');
    emptyProduct.classList.add('empty-product');
    emptyProduct.textContent = '장바구니가 텅 비었습니다.';
    productsWrap.appendChild(emptyProduct);
  }
}

// 카운트 변화로 인한 로컬 스토리지 변경
function changeCartLocalStorage(e, targetInputCount, index) {
  const userId = sessionStorage.getItem('userId') || 'null';
  const productId = e.target.dataset.product;

  // 로컬 스토리지 변경
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let price = 0;
  let amount = 0;
  cart.forEach((el) => {
    if (el.userId === userId) {
      if (el.productId === productId) {
        el.count = targetInputCount.value;
        price = el.price;
      }
      amount = amount + Number(el.count) * Number(el.price);
    }
  });
  localStorage.setItem('cart', JSON.stringify(cart));

  // 합계 변경
  const productPrice = document.querySelectorAll('.product-amount')[index];
  productPrice.textContent = `${String(
    (Number(targetInputCount.value) * Number(price)).toLocaleString(),
  )}원`;

  // 배송비
  const delivery = getDeliveryPrice(amount);
  deliveryPrice.textContent = `${delivery.toLocaleString()}원`;

  // 총 결제 금액
  totalPrice.textContent = `${(amount + delivery).toLocaleString()}원`;
}

// 카운트 감소
function handleCountDecrease(e) {
  const index = e.target.dataset.index;
  const inputClass = e.target.dataset.input;
  const targetInputCount = document.querySelectorAll(`.${inputClass}`)[index];

  if (Number(targetInputCount.value) > 1) {
    targetInputCount.value = String(Number(targetInputCount.value) - 1);
  }

  console.log(targetInputCount);
  // 로컬 스토리지 수정
  changeCartLocalStorage(e, targetInputCount, index);
}

// 카운트 증가
function handleCountIncrease(e) {
  const index = e.target.dataset.index;
  const inputClass = e.target.dataset.input;
  const targetInputCount = document.querySelectorAll(`.${inputClass}`)[index];

  if (Number(targetInputCount.value) < 10) {
    targetInputCount.value = String(Number(targetInputCount.value) + 1);
  }

  // 로컬 스토리지 수정
  changeCartLocalStorage(e, targetInputCount, index);
}

// 장바구니 상품 전체 삭제
function handleBtnClear() {
  const userId = sessionStorage.getItem('userId') || 'null';
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const filterCart = cart.filter((el) => {
    return el.userId !== userId;
  });
  localStorage.setItem('cart', JSON.stringify(filterCart));

  // 장바구니 상품 화면 그리기
  insertCartLocalStorage();

  // 상품 수
  orderProductCount.textContent = '0개';
  // 총 가격
  orderProductPrice.textContent = '0원';
  // 배송비
  deliveryPrice.textContent = '0원';
  // 총 결제 금액
  totalPrice.textContent = '0원';
}

// 장바구니 상품 하나 삭제
function handleBtnTrash(e) {
  const productId = e.target.dataset.product;
  const userId = sessionStorage.getItem('userId') || 'null';
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const filterCart = cart.filter((el) => {
    return !(el.userId === userId && el.productId === productId);
  });
  localStorage.setItem('cart', JSON.stringify(filterCart));

  // 화면 그리기
  insertCartLocalStorage();

  // 상품 수, 총 가격
  let count = 0;
  let amount = 0;
  filterCart.forEach((el) => {
    if (el.userId === userId) {
      count++;
      amount += Number(el.price) * Number(el.count);
    }
  });
  orderProductCount.textContent = `${count}개`;
  orderProductPrice.textContent = `${amount.toLocaleString()}원`;

  // 배송비, 결제 금액
  const delivery = getDeliveryPrice(amount);
  deliveryPrice.textContent = `${delivery}원`;
  totalPrice.textContent = `${(amount + delivery).toLocaleString()}원`;
}

// 바로 구매하기 버튼 핸들러
function handleBtnBuy() {
  const userId = sessionStorage.getItem('userId') || 'null';
  if (userId === 'null') {
    window.location.href = '/login';
    return;
  }

  // 로컬 스토리지 buy 작성
  let newBuy = [];
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.forEach((el) => {
    if (el.userId === userId) {
      newBuy.push(el);
    }
  });
  localStorage.removeItem('buy');
  localStorage.setItem('buy', JSON.stringify(newBuy));

  window.location.href = '/buy';
}
