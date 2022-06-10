import * as Api from '../../api.js';
import { nav } from '/component.js';
//네비게이션 바 생성
nav();

const categorySelectBox = document.querySelector('#categorySelectBox');
const classValue = document.getElementsByClassName('deleteCheck');
const delModal = document.querySelector('#delModal'),
  delCompleteBtn = document.querySelector('#delCompleteBtn');

//delmodal 창 닫기
const delCancelBtn = document.querySelector('#delCancelBtn'),
  delBg = document.querySelector('#deleteModalBack'),
  deleteModalClose = document.querySelector('#deleteModalClose');
//updateModal 창 닫기
const updateCancelBtn = document.querySelector('#modalCancelBtn'),
  topCancelBtn = document.querySelector('#topCancelBtn'),
  updateBack = document.querySelector('#updateBack');
//전체 선택
const allSelect = document.querySelector('#allSelect');

//updateModal 변수 선언
const setModalNameText = document.querySelector('#setModalNameText'),
  setModalCategory = document.querySelector('#setModalCategory'),
  setModalImg = document.querySelector('#setModalImg'),
  setProductInfo = document.querySelector('#setProductInfo'),
  setModalStorage = document.querySelector('#setModalStorage'),
  setModalPrice = document.querySelector('#setModalPrice'),
  setModalCompany = document.querySelector('#setModalCompany');

const updateModal = document.querySelector('#updateModal');
const getModalImg = document.querySelector('#getModalImg');
//카테고리 목록 불러오기
getSelectOption();
async function getSelectOption() {
  try {
    const allCategory = await Api.get('/api/category/list');
    setSelectOption(allCategory);
    setModalSelectBox(allCategory);
  } catch (err) {
    console.error(err);
  }
}

//updateModal 변경 카테고리 set
function setModalSelectBox(item) {
  item.forEach((data) => {
    const option = document.createElement('option');
    option.setAttribute('id', data._id);
    option.setAttribute('value', data._id);
    option.textContent = data.name;
    setModalCategory.appendChild(option);
  });
}

//updateModal Img 미리보기
setModalImg.addEventListener('change', (e) => setModalImgSrc(e.target));
function setModalImgSrc(input) {
  if (input.files && input.files[0]) {
    //FileReader인스턴스 생성
    const reader = new FileReader();
    //이미지 로드된 경우
    reader.onload = (e) => {
      getModalImg.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

//검색 카테고리 set
function setSelectOption(item) {
  item.forEach((data) => {
    const option = document.createElement('option');
    option.setAttribute('value', data._id);
    option.textContent = data.name;
    categorySelectBox.appendChild(option);
    categorySelectBox.addEventListener('change', setItemList);
  });
}

async function setItemList(e) {
  e.preventDefault();
  const categoryId = categorySelectBox.value;
  try {
    const tbody = document.querySelector('#tbody');
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.lastChild);
    }
    const item = await Api.get('/api/product/list', `?category=${categoryId}`);
    item.forEach((data) => {
      const tr = document.createElement('tr');
      tr.setAttribute('id', `product${data._id}`);

      const check = document.createElement('input');
      check.setAttribute('type', 'checkbox');
      check.setAttribute('id', `check${data._id}`);
      check.setAttribute('class', 'deleteCheck');
      check.setAttribute('value', `${data.product_id}`);
      check.setAttribute('name', 'check');

      const td1 = document.createElement('td');
      td1.textContent = data.name;

      const td2 = document.createElement('td');
      td2.textContent = data.price;

      const td3 = document.createElement('td');
      td3.textContent = data.storage;

      const updateBtn = document.createElement('input');
      updateBtn.setAttribute('type', 'button');
      updateBtn.setAttribute('id', `updateBtn${data._id}`);
      updateBtn.setAttribute('class', 'updateBtn');
      updateBtn.setAttribute('value', '수정');

      tr.appendChild(check);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(updateBtn);
      tbody.appendChild(tr);
      // 수정 버튼 클릭시
      const updateBtnEvent = document.querySelector(`#updateBtn${data._id}`);
      updateBtnEvent.addEventListener('click', () =>
        openUpdateModal(data.product_id),
      );
    });
  } catch (err) {
    console.error(err);
  }
}

const updateForm = document.querySelector('#updateForm');
//update modal 열기
function openUpdateModal(id) {
  updateModal.classList.add('is-active');
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setUpdate(id);
  });
}

// 수정 데이터 보내기
async function setUpdate(id) {
  try {
    const name = setModalNameText.value;
    const category = setModalCategory.value;
    const image = setModalImg.files[0];
    const information = setProductInfo.value;
    const storage = setModalStorage.value;
    const price = setModalPrice.value;
    const date = new Date();
    const company = setModalCompany.value;
    const formData = new FormData();
    //빈 값 에러 핸들링
    if (name.length <= 2) {
      alert('이름을 2자 이상으로 입력해주세요!');
      return;
    } else if (category == '') {
      alert('카테고리를 선택해주세요!');
      return;
    } else if (image == '') {
      alert('이미지를 선택해주세요!');
      return;
    } else if (information.length <= 5) {
      alert('상세정보를  5자 이상으로 입력해주세요!');
      return;
    } else if (Number(storage) || storage == 0) {
      alert('"0"이상으로 숫자만 입력해주세요!');
      return;
    } else if (Number(price) || price == 0) {
      alert('"0"이상으로 숫자만 입력해주세요!');
      return;
    } else if (company == '') {
      alert('회사명을 입력해주세요!');
      return;
    }

    formData.append('name', name);
    formData.append('category', category);
    formData.append('image', image);
    formData.append('information', information);
    formData.append('price', price);
    formData.append('storage', storage);
    formData.append('date', date);
    formData.append('company', company);

    // for (var pair of formData.entries()) {
    // 	console.log(pair[0] + ', ' + pair[1]);
    // }
    // /update_product/:product_id

    await fetch(`/api/product/update_product/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });

    location.reload();
    updateModal.classList.remove('is-active');
  } catch (err) {
    console.error(err);
  }
}

allSelect.addEventListener('click', selectAll);
const checkboxes = document.getElementsByName('check');

//전체 선택 event
function selectAll() {
  checkboxes.forEach((checkbox) => {
    checkbox.checked = allSelect.checked;
  });
}

//삭제하기 버튼
const deleteBtn = document.querySelector('#deleteBtn');
deleteBtn.addEventListener('click', openDelModal);

async function openDelModal() {
  delModal.classList.add('is-active');
  delCompleteBtn.addEventListener('click', setDelete);
}

async function setDelete() {
  try {
    let cnt = 0;
    for (let i = 0; i < classValue.length; i++) {
      if (classValue[i].checked) {
        await Api.delete('/api/product/detail', classValue[i].value);
        cnt++;
      }
      if (cnt === 0) {
        alert('체크박스를 확인해주세요!');
        return;
      }
    }

    location.reload();
    closeDelModal();
  } catch (err) {
    console.error(err);
  }
}

delCancelBtn.addEventListener('click', closeDelModal);
delBg.addEventListener('click', closeDelModal);
deleteModalClose.addEventListener('click', closeDelModal);

//delModal 닫기
function closeDelModal() {
  delModal.classList.remove('is-active');
}

updateCancelBtn.addEventListener('click', closeUpdateModal);
topCancelBtn.addEventListener('click', closeUpdateModal);
updateBack.addEventListener('click', closeUpdateModal);

//updateModal 닫기
function closeUpdateModal() {
  updateModal.classList.remove('is-active');
}
