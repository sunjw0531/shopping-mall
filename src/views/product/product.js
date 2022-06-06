import * as Api from '/api.js';

// 요소(element), input 혹은 상수
const productContainer = document.querySelector('.product-container');
const producImageWrap = document.querySelector('.product-image-wrap');
const productDiv = document.querySelector('.product');
const productName = document.querySelector('.product-name');
const productPrice = document.querySelector('.product-price');
const productContent = document.querySelector('.product-content');
const btnBuy = document.querySelector('.btn-buy');

// HTML 요소 생성, 이벤트
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	insertProductContent();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
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
	const productDatas = await Api.get(`/api/product/detail/${productId}`);

	if (productDatas.length > 0) {
		const productData = productDatas[0];

		// 상품 이미지
		const productImage = document.createElement('img');
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

function handleBtnBuy() {
	// TODO 로컬 스토리지 등록
	window.location.href = '/buy';
}
