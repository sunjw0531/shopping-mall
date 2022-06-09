import * as Api from '/api.js';
import { nav } from '/component.js';
//네비게이션 바 생성
nav();

// 요소(element), input 혹은 상수
const contentContainer = document.querySelector('.content-container');

// HTML 요소 생성, 이벤트
addAllElements();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertCategoryContents();
}

// 카테고리 HTML 요소 생성
async function insertCategoryContents() {
  // category-container
  const categoryContainer = document.createElement('div');
  categoryContainer.classList.add('category-container');
  contentContainer.append(categoryContainer);

  // category GET API
  const categoryDatas = await Api.get('/api/category/list');

  // Category 출력
  if (categoryDatas.length > 0) {
    categoryDatas.forEach((data) => {
      // category-container 요소
      const categoryLabelContainer = document.createElement('div');
      const categoryDiv = document.createElement('div');
      categoryLabelContainer.classList.add('category-label-container');
      categoryDiv.classList.add('category');
      categoryContainer.append(categoryLabelContainer, categoryDiv);

      // category-label-container 요소
      const categoryLabel = document.createElement('h2');
      categoryLabel.classList.add('category-label');
      categoryLabel.innerHTML = `${data.name}`;
      categoryLabelContainer.append(categoryLabel);

      // Product 카운트
      // Category의 Product는 4개까지만 출력하기 위한 카운트 변수
      let productCount = 0;

      // Product 출력
      if (data.products.length > 0) {
        const viewMoreButton = document.createElement('button');
        viewMoreButton.classList.add('btn-go-category');
        viewMoreButton.classList.add('button');
        viewMoreButton.classList.add('is-rounded');
        viewMoreButton.textContent = 'view more';
        viewMoreButton.onclick = function () {
          window.location.href = `/category/${data._id}`;
        };
        categoryContainer.append(viewMoreButton);

        data.products.forEach((product) => {
          // Category의 Product가 4개 출력되었다면 리턴
          if (productCount >= 4) {
            return;
          }
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
          // TODO: 루트폴더 상위의 uploads/ 이동
          productImage.src = `${product.image}`;
          productName.textContent = `${product.name}`;
          productPrice.textContent = `${product.price.toLocaleString()}원`;
          productDiv.append(productImage, productName, productPrice);

          // Product 카운트 증가
          productCount++;
        });
      } else {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-nodata');
        productDiv.classList.add('box');
        productDiv.textContent = '상품이 존재하지 않습니다.';
        categoryDiv.append(productDiv);
      }
    });
  } else {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category-nodata');
    categoryDiv.classList.add('box');
    categoryDiv.textContent = '카테고리가 존재하지 않습니다.';

    categoryContainer.append(categoryDiv);
  }
}
