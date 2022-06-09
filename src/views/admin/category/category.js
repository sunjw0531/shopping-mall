import * as Api from '../../api.js';
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

function dateFormat(dateValue) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = ('0' + (1 + date.getMonth())).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

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
    console.error(err);
  }
}

async function getOption() {
  try {
    const allCategory = await Api.get('/api/category/list');
    setCategoryList(allCategory);
  } catch (err) {
    console.error(err);
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
    const deleteBtn = document.createElement('input');
    deleteBtn.setAttribute('id', `delBtn${data._id}`);
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.setAttribute('class', 'btn btn-primary');
    deleteBtn.setAttribute('value', '삭제');
    td3.appendChild(deleteBtn);

    const td4 = document.createElement('td');
    const updateBtn = document.createElement('input');
    updateBtn.setAttribute('id', `upBtn${data._id}`);
    updateBtn.setAttribute('type', 'button');
    updateBtn.setAttribute('class', 'btn btn-primary');
    updateBtn.setAttribute('value', '수정');
    td4.appendChild(updateBtn);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
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
      modal[1].classList.remove('is-active');
    }
  } catch (err) {
    console.error(err);
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
    modal[0].classList.remove('is-active');
  } catch (err) {
    console.error(err);
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
