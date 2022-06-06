import * as Api from '/api.js';

// 테스트용 데이터
const userInfoData = {
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

const buyingProductsData = [
	{
		id: 1,
		name: '예쁜 상의1',
		price: 39000,
		count: 5,
	},
	{
		id: 2,
		name: '예쁜 하의1',
		price: 52000,
		count: 2,
	},
	{
		id: 3,
		name: '예쁜 아우터1',
		price: 119000,
		count: 1,
	},
];

// 요소(element), input 혹은 상수
const selectList = document.querySelector('.buy-form-select');
const btnDaumApi = document.querySelector('.btn-daum-api');
const orderInfoWrap = document.querySelector('.order-info-wrap');
const deliveryPriceSpan = document.querySelector('.delivery-price');
const totalPriceSpan = document.querySelector('.total-price');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	insertUserInfo();
	insertPaymentInfo();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
	btnDaumApi.addEventListener('click', handleDaumApi);
	selectList.addEventListener('change', handleSelect);
}

// 테스트용 로직
function getUserInfo() {
	return userInfoData;
}
function getProductsInfo() {
	return buyingProductsData;
}

// 유저 정보 출력
function insertUserInfo() {
	// TODO: 실제 데이터 출력
	const userInfo = getUserInfo();

	if (userInfo) {
		document.querySelector('.input-name').value = userInfo.fullName;
		document.querySelector('.input-phone').value = userInfo.phoneNumber;
		document.querySelector('.input-post-code').value =
			userInfo.address.postalCode;
		document.querySelector('.input-road-address').value =
			userInfo.address.address1;
		document.querySelector('.input-jibun-address').value =
			userInfo.address.address2;
	}
}

// 결제 정보 출력
function insertPaymentInfo() {
	// TODO: 실제 데이터 출력
	const productsInfo = getProductsInfo();
	let totalPrice = 0;
	let deliveryPrice = 0;

	if (productsInfo) {
		productsInfo.map((productInfo) => {
			console.log(productInfo);
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
			buyingName.textContent = productInfo.name;
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
			buyingCount.textContent = productInfo.count;
			buyingCountWrap.append(buyingCountLabel, buyingCount);

			// 상품 가격
			const price = productInfo.price * productInfo.count;
			const buyingPriceWrap = document.createElement('div');
			buyingPriceWrap.classList.add('buying-info-wrap');
			orderProductInfo.append(buyingPriceWrap);

			const buyingPriceLabel = document.createElement('h3');
			const buyingPrice = document.createElement('div');
			buyingPriceLabel.classList.add('buying-label');
			buyingPrice.classList.add('buying-price');
			buyingPriceLabel.textContent = '상품 가격';
			buyingPrice.textContent = `${price.toLocaleString()}원`;
			buyingPriceWrap.append(buyingPriceLabel, buyingPrice);

			totalPrice += price;
		});
	}

	// 배송비
	deliveryPrice = totalPrice >= 50000 ? 0 : 3000;
	deliveryPriceSpan.textContent = `${deliveryPrice.toLocaleString()}원`;

	// 총 결제 금액
	totalPriceSpan.textContent = `${totalPrice.toLocaleString()}원`;
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
	const requestField = document.querySelector('.request-field');
	const inputRequest = document.querySelector('.input-request');

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
