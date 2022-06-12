import * as Api from '../../api.js';
import { nav } from '/component.js';
import { dateFormat } from '../../useful-functions.js';
//네비게이션 바 생성
nav();

//top cotainer
const totalCnt = document.querySelector('#totalCnt'),
  adminCnt = document.querySelector('#adminCnt'),
  oauthCnt = document.querySelector('#oauthCnt');
  
//modal 변수 선언
const modal = document.querySelector('.modal'),
  modalBg = document.querySelector('.modal-background'),
  delCancelBtn = document.querySelector('#delCancelBtn'),
  delCompleteBtn = document.querySelector('#delCompleteBtn');

getUserInfo();

// users 정보 목록 받아오기 api요청
async function getUserInfo() {
  try {
    const userInfo = await Api.get('/api/userlist');
    inputUser(userInfo); //유저 목록 데이터 생성
    userCnt(userInfo); //총회원수, 관리자수, ouath가입자수 카운트
  } catch (err) {
    console.error(err);
  }
}

//getUserInfo 유저 정보를 불러와 목록으로 출력
function inputUser(item) {
  const tbody = document.querySelector('#tbody');
  // 해보기
  // const tr = document.createElement('tr');
  // tr.setAttribute('id', `user${data._id}`);
  // const td = document.createElement('td');
  // td.textContent = ${dateFormat(data.createdAt)}; appendChild로 붙여 넣기

  //insertAdjacentHTML < createDOM PARSHING 속도가 빠름
  item.forEach((data) => {
    tbody.insertAdjacentHTML(
      'afterend',
      `
    <tr id="user${data._id}">
      <td>${dateFormat(data.createdAt)}</td>
      <td>${data.email}</td>
      <td>${data.loginTypeCode == 0 ? `일반` : `소셜`}</td>
      <td>${data.fullName}</td>
      <td>
        <select class="select-user-type">
          <option value="0" ${
            data.isAdmin ? `selected` : ``
          }> 일반사용자</option>
          <option value="1" ${data.isAdmin ? `selected` : ``}> 관리자 </option>
        </select>
      </td>
      <td><button class="deleteUserBtn" id="btn${data._id}">회원정보 삭제 </td>
    </tr>
    `,
    );
    const deleteUserBtn = document.querySelector('.deleteUserBtn');
    deleteUserBtn.addEventListener('click', () => openModal(data._id));
    const changeOption = document.querySelector('.select-user-type');
    changeOption.addEventListener('change', () =>
      optionChange(
        changeOption.options[changeOption.selectedIndex].value,
        data._id,
      ),
    );
  });
}

//select - option 변경시 카운트 값이 바뀌도록 함수 설정
async function optionChange(admin, userId) {
  try {
    const isAdmin = (admin == 1 ? true : false);
    console.log(typeof isAdmin);
    const adminStatus = { isAdmin };
    await Api.patch(`/api/users`, userId, adminStatus);

    const selectOption = isAdmin;
    if (selectOption === true) {
      adminCnt.innerText++;
    } else if (selectOption === false) {
      adminCnt.innerText--;
    }
  } catch (err) {
    console.error(err);
  }
}

// 회원 삭제 버튼 클릭 시
async function openModal(id) {
  modal.classList.add('is-active');
  delCompleteBtn.addEventListener('click', () => setDelete(id));
}

//modal창에서 확인 시 회원 삭제
async function setDelete(id) {
  console.log(id);
  try {
    await Api.delete('/api/admin', id);
    // 화면상에서 삭제 부분을 구현
    const parent = document.querySelector(`#user${id}`);
    const selectOption = Number(parent.childNodes[9].childNodes[1].value);
    const oauther = parent.childNodes[5].childNodes[0].nodeValue;
    if (selectOption === 1) {
      adminCnt.innerText--;
    }
    if (oauther === '소셜') {
      oauthCnt.innerText--;
    }
    totalCnt.innerText--;
    parent.remove();
    closeModal();
  } catch (err) {
    console.error(err);
  }
}

//총회원수, ouath, admin 수
function userCnt(item) {
  let oauthCntp = 0;
  let adminCntp = 0;
  for (let i = 0; i < item.length; i++) {
    if (item[i].loginTypeCode == 1) {
      oauthCntp++;
    }
    if (item[i].isAdmin) {
      adminCntp++;
    }
  }

  totalCnt.innerText = item.length;
  adminCnt.innerText = adminCntp;
  oauthCnt.innerText = oauthCntp;
}

//modal btn event
modalBg.addEventListener('click', closeModal);
delCancelBtn.addEventListener('click', closeModal);

function closeModal() {
  modal.classList.remove('is-active');
}
