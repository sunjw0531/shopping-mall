import * as Api from '/api.js';
import { nav } from '/component.js';
//네비게이션 바 생성
// nav();
// 요소(element), input 혹은 상수
const contentContainer = document.querySelector('.content-container');
const paginationLinks = document.querySelectorAll('.pagination-link');
const GROUP_PAGE_COUNT = 10;

// HTML 요소 생성, 이벤트
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertCategoryContents();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  paginationLinks.forEach((button) => {
    button.addEventListener('click', handleBtnPagination);
  });
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
  const categoryNameData = await Api.get(`/api/category/${categoryId}`);
  const productsData = await Api.get(
    '/api/product/pageList',
    `?category=${categoryId}`,
  );
  const totalPage = productsData[0];
  const productsInfo = productsData[1];

  // 카테고리 이름
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
  categoryLabel.textContent = categoryNameData.name;
  categoryLabelContainer.append(categoryLabel);

  // product 출력
  if (productsInfo.length > 0) {
    productsInfo.forEach((data) => {
      const { image, name, price, storage, _id } = data;

      // product
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      productDiv.onclick = function () {
        window.location.href = `/product/${_id}`;
      };
      categoryDiv.append(productDiv);

      // product 요소
      const productImage = document.createElement('img');
      const productName = document.createElement('div');
      const productPrice = document.createElement('div');
      productName.classList.add('category-product-name');
      productPrice.classList.add('category-product-price');

      productImage.src = image;
      productName.textContent = name;
      productPrice.textContent = `${price.toLocaleString()}원`;
      productDiv.append(productImage, productName, productPrice);
    });

    insertPagination(1, totalPage);
  } else {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category-nodata');
    categoryDiv.classList.add('box');
    categoryDiv.textContent = '해당 카테고리가 존재하지 않습니다.';

    categoryContainer.append(categoryDiv);
  }
}

// pagination 생성
function insertPagination(currentPage, totalPage) {
  const currentPageGroup = Math.ceil(currentPage / GROUP_PAGE_COUNT);

  let groupLastPage = currentPageGroup * GROUP_PAGE_COUNT;
  if (groupLastPage > totalPage) {
    groupLastPage = totalPage;
  }
  let groupFirstPage = groupLastPage - (GROUP_PAGE_COUNT - 1);
  if (groupFirstPage < 1) {
    groupFirstPage = 1;
  }

  // pagination 생성
  const paginationNav = document.createElement('nav');
  paginationNav.classList.add('pagination');
  paginationNav.classList.add('is-centered');
  paginationNav.setAttribute('role', 'navigation');
  paginationNav.setAttribute('aria-label', 'pagination');
  contentContainer.appendChild(paginationNav);

  const paginationList = document.createElement('ul');
  paginationList.classList.add('pagination-list');
  paginationNav.appendChild(paginationList);

  const firstPageLi = document.createElement('li');
  paginationList.appendChild(firstPageLi);
  const firstPageA = document.createElement('a');
  firstPageA.classList.add('pagination-link');
  firstPageA.setAttribute('id', 'btn-first-page');
  firstPageLi.appendChild(firstPageA);
  const firstPageIcon = document.createElement('i');
  firstPageIcon.classList.add('fa-solid');
  firstPageIcon.classList.add('fa-angles-left');
  firstPageA.appendChild(firstPageIcon);

  const previousPageGroupLi = document.createElement('li');
  paginationList.appendChild(previousPageGroupLi);
  const previousPageGroupA = document.createElement('a');
  previousPageGroupA.classList.add('pagination-link');
  previousPageGroupA.setAttribute('id', 'btn-previous-page-group');
  previousPageGroupLi.appendChild(previousPageGroupA);
  const previousPageGroupIcon = document.createElement('i');
  previousPageGroupIcon.classList.add('fa-solid');
  previousPageGroupIcon.classList.add('fa-angle-left');
  previousPageGroupA.appendChild(previousPageGroupIcon);

  for (let i = groupFirstPage; i <= groupLastPage; i++) {
    const li = document.createElement('li');
    paginationList.appendChild(li);

    const pageA = document.createElement('a');
    pageA.classList.add('pagination-link');
    pageA.classList.add('page-number');
    if (i === currentPage) {
      pageA.classList.add('is-current');
    }
    pageA.setAttribute('data-num', i);
    pageA.textContent = i;
    li.appendChild(pageA);
  }

  const nextPageGroupLi = document.createElement('li');
  paginationList.appendChild(nextPageGroupLi);
  const nextPageGroupA = document.createElement('a');
  nextPageGroupA.classList.add('pagination-link');
  nextPageGroupA.setAttribute('id', 'btn-next-page-group');
  nextPageGroupLi.appendChild(nextPageGroupA);
  const nextPageGroupIcon = document.createElement('i');
  nextPageGroupIcon.classList.add('fa-solid');
  nextPageGroupIcon.classList.add('fa-angle-right');
  nextPageGroupA.appendChild(nextPageGroupIcon);

  const lastPageLi = document.createElement('li');
  paginationList.appendChild(lastPageLi);
  const lastPageA = document.createElement('a');
  lastPageA.classList.add('pagination-link');
  lastPageA.setAttribute('id', 'btn-last-page');
  lastPageLi.appendChild(lastPageA);
  const lastPageIcon = document.createElement('i');
  lastPageIcon.classList.add('fa-solid');
  lastPageIcon.classList.add('fa-angles-right');
  lastPageA.appendChild(lastPageIcon);
}

// pagination 버튼 핸들러
function handleBtnPagination(e) {
  console.log(e);
}
