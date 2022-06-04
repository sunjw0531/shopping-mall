const testList = [
  {
    "id":1,
    "date":"2022-05-10",
    "order_info":"아이보리 니트",
    "order_cnt": 1,
    "order_price":22000,
    "order_status":0,
  },
  {
    "id":2,
    "date":"2022-05-12",
    "order_info":"남성 정장",
    "order_cnt": 1,
    "order_price":180000,
    "order_status":2,
  },
  {
    "id":3,
    "date":"2022-05-12",
    "order_info":"캐주얼 반팔 코디 남성",
    "order_cnt": 1,
    "order_price":13000,
    "order_status":1,
  },
  {
    "id":4,
    "date":"2022-05-13",
    "order_info":"봄, 가을 남자 느낌 물씬 코디",
    "order_cnt": 1,
    "order_price":28900,
    "order_status":1,
  },
  {
    "id":5,
    "date":"2022-05-13",
    "order_info":"아이보리 니트",
    "order_cnt": 1,
    "order_price":19000,
    "order_status":0,
  },
]

//products list
const inputData = document.querySelector('#inputData');
const orderCancerBtn = document.getElementsByClassName('order-cancer');
// top_cotainer 
const element = document.getElementsByTagName('p');

// 총주문 수 
element[0].innerText = testList.length
inputItem(); 
// 상풍 준비중 / 상품 배송중 / 배송 완료
productCnt();

// json 데이터 주문 리스트에 추가
function inputItem() {
  const tbody = document.createElement('tbody');
  inputData.appendChild(tbody);
  for(let i =0; i < testList.length; i++){
    tbody.insertAdjacentHTML('beforeend', `
    <tr id="item${testList[i].id}">
      <td> ${testList[i].date}</td>
      <td> ${testList[i].order_info}</td>
      <td> ${testList[i].order_price.toLocaleString('ko-KR')} 원</td>
      <td>
        <select class="select-product-state" id ="sel${testList[i].id}" onchange="productCntChange(this)">
          <option value="0" ${testList[i].order_status == 0 ? `selected` :``}> 상품 준비중 </option>
          <option value="1" ${testList[i].order_status == 1 ? `selected` :``}> 상품 배송중 </option>
          <option value="2" ${testList[i].order_status == 2 ? `selected` :``}> 배송 완료 </option>
        </select>
      </td>
      <td> <button class="order-cancer" id="btn${testList[i].id}" onclick ="deleteItem(this.id)">주문 취소</button>
    </tr>
    `);
  }//json 데이터 기반으로 selected 설정
  console.log("Data Input Ok!");
}

function deleteItem(btnId){
  const parent = document.querySelector(`#${btnId}`).parentElement.parentElement;
  parent.remove();
  const sel = Number(parent.childNodes[7].childNodes[1].value);
  if(sel == 0) {
    element[1].innerText--;
  }else if(sel == 1) {
    element[2].innerText--;
  }else if(sel == 2) {
    element[3].innerText--;
  }
  element[0].innerText--;
}

// 처음 화면 시 value 값 표시
function productCnt() {
  let ready_cnt = 0
  let going_cnt = 0
  let success_cnt = 0
  let status = document.getElementsByClassName('select-product-state')
  for(let i =0; i<testList.length; i++){
    if(status[i].selectedIndex == 0) {
      ready_cnt++;
    }else if(status[i].selectedIndex == 1) {
      going_cnt++;
    }else if(status[i].selectedIndex == 2) {
      success_cnt++;
    }
  }
  element[1].innerText = ready_cnt;
  element[2].innerText = going_cnt;
  element[3].innerText = success_cnt;
}

//select - option 변경 시 카운트 값이 바뀌도록 함수 설정
function productCntChange (sel) {
  const selectOption = Number(sel.value);
  if(selectOption == 0) {
    element[1].innerText++;
  }else if(selectOption == 1) {
    element[2].innerText++;
  }else if(selectOption == 2) {
    element[3].innerText++;
  }
}
