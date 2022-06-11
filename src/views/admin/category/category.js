import * as Api from '../../api.js';
import { nav } from '/component.js';
import { dateFormat } from '../../useful-functions.js';
//네비게이션 바 생성
nav();

// import { dateFormat } from '../../useful-functions';
const modal = document.querySelectorAll('.modal'),
  delModalBg = document.querySelector('#deleteModalBack'),
  delModalBtn = document.querySelector('#deleteModalClose'),
  delCancelBtn = document.querySelector('#delCancelBtn'),
  delCompleteBtn = document.querySelector('#delCompleteBtn');

const upModalBg = document.querySelector('#upModalBg'),
  upModalBtn = document.querySelector('#uploadModalClose'),
  upCancelBtn = document.querySelector('#uploadCancelBtn'),
  upCompleteBtn = document.querySelector('#uploadCompleteBtn');

const categoryName = document.querySelector('#categoryName');

getOption();
categoryUploadBtn.addEventListener('click', setCategory);

//카테고리 추가
async function setCategory(e) {
  e.preventDefault();
  try {
    const name = categoryName.value;
    const data = { name };
    await Api.post('/api/category', data);
    location.reload();
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다 ${err.message}`);
  }
}

async function getOption() {
  try {
    const allCategory = await Api.get('/api/category/list');
    setCategoryList(allCategory);
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다 ${err.message}`);
  }
}

function setCategoryList(item) {
  const tbody = document.querySelector('#tbody');
  item.forEach((data) => {
    const tr = document.createElement('tr');
    tr.setAttribute('id', `category${data._id}`);

    const td1 = document.createElement('td');
    td1.textContent = dateFormat(data.createdAt);

    const td2 = document.createElement('td');
    td2.setAttribute('id', `text${data._id}`);
    td2.textContent = data.name;

    const td3 = document.createElement('td');
    td3.textContent = `${data.products.length}개`;

    const td4 = document.createElement('td');
    const updateBtn = document.createElement('input');
    updateBtn.setAttribute('id', `upBtn${data._id}`);
    updateBtn.setAttribute('type', 'button');
    updateBtn.setAttribute('class', 'btn btn-primary');
    updateBtn.setAttribute('value', '수정');
    td4.appendChild(updateBtn);

    const td5 = document.createElement('td');
    const deleteBtn = document.createElement('input');
    deleteBtn.setAttribute('id', `delBtn${data._id}`);
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.setAttribute('class', 'btn btn-primary');
    deleteBtn.setAttribute('value', '삭제');
    td5.appendChild(deleteBtn);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tbody.appendChild(tr);

    const delBtn = document.querySelector(`#delBtn${data._id}`);
    delBtn.addEventListener('click', () => openDelModal(data.name, data._id));

    const upBtn = document.querySelector(`#upBtn${data._id}`);
    upBtn.addEventListener('click', () => openUpModal(data.name, data._id));
  });
}

function openUpModal(name, id) {
  modal[1].classList.add('is-active');
  const nowCategory = document.querySelector('#nowCategory');
  nowCategory.textContent = `현재 카테고리 명 : ${name}`;
  upCompleteBtn.addEventListener('click', () => setUploadCategory(name, id));
}

async function setUploadCategory(name, id) {
  try {
    const newName = document.querySelector('#newDataInput').value;
    console.log(typeof newName);
    if (!newDataInput) {
      alert('변경하실 카테고리명을 입력해주세요!');
    } else {
      const newData = { newName };
      await Api.patch('/api/category', name, newData);
      const text = document.querySelector(`#text${id}`);
      text.textContent = newDataInput.value;
      location.reload();
      alert('상품 카테고리 명이 수정되었습니다.');
      modal[1].classList.remove('is-active');
    }
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다 ${err.message}`);
  }
}
function openDelModal(name, id) {
  modal[0].classList.add('is-active');
  delCompleteBtn.addEventListener('click', () => setDelete(name, id));
}

async function setDelete(name, id) {
  try {
    const sendName = { name };
    await Api.delete('/api', 'category', sendName);
    const parent = document.getElementById(`category${id}`);
    parent.remove();
    location.reload();
    modal[0].classList.remove('is-active');
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다 ${err.message}`);
  }
}

//modal delbtn event
delModalBg.addEventListener('click', closeDelModal);
delModalBtn.addEventListener('click', closeDelModal);
delCancelBtn.addEventListener('click', closeDelModal);

//modal upbtn event
upModalBg.addEventListener('click', closeUpModal);
upModalBtn.addEventListener('click', closeUpModal);
upCancelBtn.addEventListener('click', closeUpModal);

function closeDelModal() {
  modal[0].classList.remove('is-active');
}

function closeUpModal() {
  modal[1].classList.remove('is-active');
}
