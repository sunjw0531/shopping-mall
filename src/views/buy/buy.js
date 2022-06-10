import * as Api from '/api.js';

// 요소(element), input 혹은 상수
const selectList = document.querySelector('.buy-form-select');
const btnDaumApi = document.querySelector('.btn-daum-api');
const orderInfoWrap = document.querySelector('.order-info-wrap');
const deliveryPriceSpan = document.querySelector('.delivery-price');
const totalPriceSpan = document.querySelector('.total-price');
const btnPayment = document.querySelector('.btn-payment');

const inputName = document.querySelector('.input-name');
const inputPhone = document.querySelector('.input-phone');
const inputPostCode = document.querySelector('.input-post-code');
const inputRoadAddress = document.querySelector('.input-road-address');
const inputJibunAddress = document.querySelector('.input-jibun-address');
const requestField = document.querySelector('.request-field');
const inputRequest = document.querySelector('.input-request');
const DELIVERY_STANDARD = 50_000;
const DELIVERY_PRICE = 3_000;

addAllElements();
addAllEvents();

let totalPrice = 0;

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertUserInfo();
  insertPaymentInfo();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  btnDaumApi.addEventListener('click', handleDaumApi);
  selectList.addEventListener('change', handleSelect);
  btnPayment.addEventListener('click', handlePayment);
}

// 유저 정보 불러오기
function getUserInfo() {
  const userId = sessionStorage.getItem('userId');
  const userInfo = Api.get(`/api/users/${userId}`);
  return userInfo;
}

// 상품 정보 불러오기
function getProductsInfo(productId) {
  const productInfo = Api.get(`/api/product/detail/${productId}`);
  return productInfo;
}

// 유저 정보 출력
async function insertUserInfo() {
  const userInfo = await getUserInfo();
  const { fullName, phoneNumber, address } = userInfo;

  if (userInfo) {
    inputName.value = fullName || '';
    inputPhone.value = phoneNumber || '';
    inputPostCode.value = address?.postalCode || '';
    inputRoadAddress.value = address?.address1 || '';
    inputJibunAddress.value = address?.address2 || '';
  }
}

// 결제 정보 출력
async function insertPaymentInfo() {
  const buyLocalStorage = JSON.parse(localStorage.getItem('buy'));

  // TODO: userId가 같은 구매목록만 출력
  buyLocalStorage.forEach(async (buyInfo) => {
    const { userId, productId, count } = buyInfo;

    if (userId === sessionStorage.getItem('userId')) {
      const productData = await getProductsInfo(productId);
      const { name, price } = productData;

      const orderProductInfo = document.createElement('div');
      orderProductInfo.classList.add('order-product-info');
      orderInfoWrap.append(orderProductInfo);

      // 주문 상품
      const buyingNameWrap = document.createElement('div');
      buyingNameWrap.classList.add('buying-info-wrap');
      orderProductInfo.append(buyingNameWrap);

      const buyingNameLabel = document.createElement('h3');
      const buyingName = document.createElement('div');
      buyingNameLabel.classList.add('buying-label');
      buyingName.classList.add('buying-name');
      buyingNameLabel.textContent = '주문 상품';
      buyingName.textContent = name;
      buyingNameWrap.append(buyingNameLabel, buyingName);

      // 주문 개수
      const buyingCountWrap = document.createElement('div');
      buyingCountWrap.classList.add('buying-info-wrap');
      orderProductInfo.append(buyingCountWrap);

      const buyingCountLabel = document.createElement('h3');
      const buyingCount = document.createElement('div');
      buyingCountLabel.classList.add('buying-label');
      buyingCount.classList.add('buying-count');
      buyingCountLabel.textContent = '주문 개수';
      buyingCount.textContent = count;
      buyingCountWrap.append(buyingCountLabel, buyingCount);

      // 상품 가격
      const countPrice = price * count;
      const buyingPriceWrap = document.createElement('div');
      buyingPriceWrap.classList.add('buying-info-wrap');
      orderProductInfo.append(buyingPriceWrap);

      const buyingPriceLabel = document.createElement('h3');
      const buyingPrice = document.createElement('div');
      buyingPriceLabel.classList.add('buying-label');
      buyingPrice.classList.add('buying-price');
      buyingPriceLabel.textContent = '상품 가격';
      buyingPrice.textContent = `${countPrice.toLocaleString()}원`;
      buyingPriceWrap.append(buyingPriceLabel, buyingPrice);

      // 금액
      totalPrice += countPrice;

      // 배송비
      const deliveryPrice = getDeliveryPrice(totalPrice);
      deliveryPriceSpan.textContent = `${deliveryPrice.toLocaleString()}원`;

      // 총 결제 금액
      totalPriceSpan.textContent = `${totalPrice.toLocaleString()}원`;
    }
  });
}

// 다음 주소 api
function handleDaumApi() {
  const inputPostCode = document.querySelector('.input-post-code');
  const inputRoadAddress = document.querySelector('.input-road-address');
  const inputJibunAddress = document.querySelector('.input-jibun-address');

  new daum.Postcode({
    oncomplete: function (data) {
      let addr = '';

      if (data.userSelectedType === 'R') {
        // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      inputPostCode.value = data.zonecode;
      inputRoadAddress.value = addr;

      inputJibunAddress.value = '';
      inputJibunAddress.focus();
    },
  }).open();
}

// 요청사항 input 조작
function handleSelect(e) {
  if (e.target.value === '0') {
    requestField.classList.add('no-showing');
  } else {
    requestField.classList.remove('no-showing');

    if (e.target.value !== String(e.target.options.length - 1)) {
      inputRequest.value = e.target.options[e.target.selectedIndex].text;
      inputRequest.disabled = true;
    } else {
      inputRequest.value = '';
      inputRequest.disabled = false;
    }
  }
}

// 배송비 계산
function getDeliveryPrice(totalPrice) {
  return totalPrice >= DELIVERY_STANDARD ? 0 : DELIVERY_PRICE;
}

// 구매하기 버튼 핸들러
async function handlePayment() {
  const userId = sessionStorage.getItem('userId') || '629e4d9bcc90969c9a556da7';
  const buy = JSON.parse(localStorage.getItem('buy')) || [];
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const orderList = buy.map((el) => {
    return { productId: el.productId, volume: el.count };
  });

  // TODO: 결제 구현
  const orderInfo = {
    receiver: inputName.value,
    phone: inputPhone.value,
    address: {
      postalCode: inputPostCode.value,
      address1: inputRoadAddress.value,
      address2: inputJibunAddress.value,
    },
    orderRequest: inputRequest.value,
    totalPrice,
    orderList,
  };
  const res = await Api.post('/api/order/', orderInfo);

  cart.forEach((cartEl, index) => {
    // 해당 유저의 장바구니에 상품이 존재할 경우
    if (cartEl.userId === userId) {
      buy.forEach((buyEl) => {
        if (cartEl.productId === buyEl.productId) {
          if (Number(cartEl.count) > Number(buyEl.count)) {
            cartEl.count = Number(cartEl.count) - Number(buyEl.count);
          } else {
            cart.splice(index, 1);
          }
        }
      });
    }
  });
  localStorage.setItem('cart', JSON.stringify(cart));

  if (localStorage.getItem('cart').length === 0) {
    localStorage.removeItem('cart');
  }
  localStorage.removeItem('buy');
  window.location.href = '/buy/complete';
}
