import * as Api from '../../api.js';
import { nav } from '/component.js';
//네비게이션 바 생성
nav();

const productName = document.querySelector('#productName'), //제품 이름
  makerName = document.querySelector('#makerName'), // 제조사
  productInfo = document.querySelector('#productInfo'), // 설명
  productCntInfo = document.querySelector('#productCntInfo'), //재고 수
  productPrice = document.querySelector('#productPrice'), // 제품 가격
  categorySelectBox = document.querySelector('#categorySelectBox'), // select id
  getImg = document.querySelector('#getImg'); //image
const productImg = document.querySelector('#productImg'); // 제품 사진 업로드 버튼

const form = document.querySelector('#productSubmitForm');
getSelectOption();

form.addEventListener('submit', handleSubmit);

productImg.addEventListener('change', (e) => setImgSrc(e.target));
function setImgSrc(input) {
  if (input.files && input.files[0]) {
    //FileReader인스턴스 생성
    const reader = new FileReader();
    //이미지 로드된 경우
    reader.onload = (e) => {
      getImg.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

async function getSelectOption() {
  try {
    const allCategory = await Api.get('/api/category/list');
    setSelectOption(allCategory);
  } catch (err) {
    console.error(err);
  }
}

function setSelectOption(item) {
  item.forEach((data) => {
    const option = document.createElement('option');
    option.setAttribute('value', data._id);
    option.textContent = data.name;
    categorySelectBox.appendChild(option);
  });
}

async function handleSubmit(e) {
  e.preventDefault();

  const name = productName.value;
  const category = categorySelectBox.value;
  const image = productImg.files[0];
  const information = productInfo.value;
  const storage = productCntInfo.value;
  const price = productPrice.value;
  const date = new Date();
  const company = makerName.value;

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

  const formData = new FormData();

  formData.append('name', name);
  formData.append('category', category);
  formData.append('image', image);
  formData.append('information', information);
  formData.append('storage', storage);
  formData.append('price', price);
  formData.append('date', date);
  formData.append('company', company);

  fetch('/api/product/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));

  location.reload();
}
