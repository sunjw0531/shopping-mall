import * as Api from '/api.js';

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
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertCategoryContents();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {}

// 테스트용 로직
function getProducts() {
  const fullLocationArray = window.location.href.split('/');
  const locationArray = fullLocationArray.filter((value) => value !== '');
  const categoryId = locationArray.pop();
  const products = categoryWithProducts.filter(
    (category) => String(category.id) === String(categoryId)
  );
  return products;
}

// 카테고리 HTML 요소 생성
function insertCategoryContents() {
  const contentContainer = document.querySelector('.content-container');
  // TODO: 테스트 데이터 -> 실제 데이터
  const datas = getProducts();

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
    // 요소 클래스명
    categoryLabelContainer.classList.add('category-label-container');
    categoryDiv.classList.add('category');

    // 요소 등록
    categoryContainer.append(categoryLabelContainer, categoryDiv);

    // category-label-container 요소
    // 요소 생성
    const categoryLabel = document.createElement('h2');
    // 요소 클래스명
    categoryLabel.classList.add('category-label');
    // 요소 내용
    categoryLabel.innerHTML = `${data.name}`;
    // 요소 등록
    categoryLabelContainer.append(categoryLabel);

    // Product 추가
    data.products.map((product) => {
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
    });
  });
}
