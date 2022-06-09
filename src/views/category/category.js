import * as Api from '/api.js';
import { nav } from '/component.js';
//네비게이션 바 생성
// nav();
// 테스트용 데이터
const categoryWithProducts = [
	{
		id: 1,
		name: 'Men',
		products: [
			{
				id: 1,
				name: '예쁜 남자 상의',
				image: 'https://bulma.io/images/placeholders/480x640.png',
				price: 39000,
			},
			{
				id: 2,
				name: '예쁜 남자 하의',
				image: 'https://bulma.io/images/placeholders/480x640.png',
				price: 72000,
			},
			{
				id: 3,
				name: '예쁜 남자 아우터',
				image: 'https://bulma.io/images/placeholders/480x640.png',
				price: 172000,
			},
			{
				id: 7,
				name: '멋진 남자 아우터',
				image: 'https://bulma.io/images/placeholders/480x640.png',
				price: 250000,
			},
			{
				id: 9,
				name: '귀여운 남자 아우터',
				image: 'https://bulma.io/images/placeholders/480x640.png',
				price: 57000,
			},
		],
	},
	{
		id: 2,
		name: 'Women',
		products: [
			{
				id: 4,
				name: '예쁜 여자 상의',
				image: 'https://bulma.io/images/placeholders/480x640.png',
				price: 43000,
			},
			{
				id: 5,
				name: '예쁜 여자 하의',
				image: 'https://bulma.io/images/placeholders/480x640.png',
				price: 65000,
			},
			{
				id: 6,
				name: '예쁜 여자 아우터',
				image: 'https://bulma.io/images/placeholders/480x640.png',
				price: 195000,
			},
		],
	},
];

// 요소(element), input 혹은 상수
const contentContainer = document.querySelector('.content-container');

// HTML 요소 생성, 이벤트
addAllElements();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	insertCategoryContents();
}

// 해당 카테고리 id
function getCategoryId() {
	const fullLocationArray = window.location.href.split('/');
	const locationArray = fullLocationArray.filter((value) => value !== '');
	const categoryId = locationArray.pop();
	return categoryId;
}

// 카테고리 HTML 요소 생성
async function insertCategoryContents() {
	const categoryId = getCategoryId();
	// TODO: categoryRouter -> productRouter
	// TODO: page, perPage
	const categoryDatas = await Api.get('/api/category/list');
	const productDatas = categoryDatas.filter(
		(category) => String(category._id) === String(categoryId),
	);

	// product 출력
	if (productDatas.length > 0) {
		productDatas.forEach((data) => {
			// category-container
			const categoryContainer = document.createElement('div');
			categoryContainer.classList.add('category-container');
			contentContainer.append(categoryContainer);

			// category-container 요소
			const categoryLabelContainer = document.createElement('div');
			const categoryDiv = document.createElement('div');
			categoryLabelContainer.classList.add('category-label-container');
			categoryDiv.classList.add('category');
			categoryContainer.append(categoryLabelContainer, categoryDiv);

			// category-label-container 요소
			const categoryLabel = document.createElement('h2');
			categoryLabel.classList.add('category-label');
			categoryLabel.textContent = `${data.name}`;
			categoryLabelContainer.append(categoryLabel);

			// Product 추가
			if (data.products.length > 0) {
				data.products.forEach((product) => {
					// product
					const productDiv = document.createElement('div');
					productDiv.classList.add('product');
					productDiv.onclick = function () {
						window.location.href = `/product/${product._id}`;
					};
					categoryDiv.append(productDiv);

					// product 요소
					const productImage = document.createElement('img');
					const productName = document.createElement('div');
					const productPrice = document.createElement('div');
					productName.classList.add('category-product-name');
					productPrice.classList.add('category-product-price');
					productImage.src = `${product.image}`;
					productName.textContent = `${product.name}`;
					productPrice.textContent = `${product.price.toLocaleString()}원`;
					productDiv.append(productImage, productName, productPrice);
				});
			} else {
				categoryDiv.classList.add('product-nodata');
				categoryDiv.classList.add('box');
				categoryDiv.classList.remove('category');
				categoryDiv.textContent = '상품이 존재하지 않습니다.';
			}
		});
	} else {
		const categoryDiv = document.createElement('div');
		categoryDiv.classList.add('category-nodata');
		categoryDiv.classList.add('box');
		categoryDiv.textContent = '해당 카테고리가 존재하지 않습니다.';

		categoryContainer.append(categoryDiv);
	}
}
