import * as Api from '/api.js';

// 요소(element), input 혹은 상수
const landingDiv = document.querySelector('#landingDiv');
const greetingDiv = document.querySelector('#greetingDiv');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertTextToLanding();
  insertTextToGreeting();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {}

// 카테고리 HTML 요소 생성
function insertCategoryContents() {
  const contentContainer = document.querySelector('.content-container');
  // TODO: 테스트 데이터 -> 실제 데이터
  const datas = categoryWithProducts;

  // Category 추가
  datas.map((data) => {
    // category-container
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');
    contentContainer.append(categoryContainer);

    // category-container 요소
    // 요소 생성
    const categoryLabelContainer = document.createElement('div');
    const categoryDiv = document.createElement('div');
    const viewMoreButton = document.createElement('button');
    // 요소 클래스명
    categoryLabelContainer.classList.add('category-label-container');
    categoryDiv.classList.add('category');
    viewMoreButton.classList.add('btn-go-category');
    viewMoreButton.classList.add('button');
    viewMoreButton.classList.add('is-rounded');
    // 요소 내용
    viewMoreButton.innerHTML = 'view more';
    // 요소 이벤트
    viewMoreButton.onclick = function () {
      window.location.href = `/category/${data.id}`;
    };

    // 요소 등록
    categoryContainer.append(
      categoryLabelContainer,
      categoryDiv,
      viewMoreButton
    );

    // category-label-container 요소
    // 요소 생성
    const categoryLabel = document.createElement('h2');
    // 요소 클래스명
    categoryLabel.classList.add('category-label');
    // 요소 내용
    categoryLabel.innerHTML = `${data.name}`;
    // 요소 등록
    categoryLabelContainer.append(categoryLabel);

    // Product 카운트
    // Category의 Product는 4개까지만 출력하기 위한 카운트 변수
    let productCount = 0;

    // Product 추가
    data.products.map((product) => {
      // Category의 Product가 4개 출력되었다면 리턴
      if (productCount >= 4) {
        return;
      }

      // product
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      productDiv.onclick = function () {
        window.location.href = `/product/${product.id}`;
      };
      categoryDiv.append(productDiv);

      // product 요소
      // 요소 생성
      const productImage = document.createElement('img');
      const productName = document.createElement('div');
      const productPrice = document.createElement('div');
      // 요소 클래스명
      productName.classList.add('category-product-name');
      productPrice.classList.add('category-product-price');
      // 요소 이미지 경로
      productImage.src = `${product.image}`;
      // 요소 내용
      productName.innerHTML = `${product.name}`;
      productPrice.innerHTML = `${product.price.toLocaleString()}원`;

      // 요소 등록
      productDiv.append(productImage, productName, productPrice);

      // Product 카운트 증가
      productCount++;
    });
  });
}
