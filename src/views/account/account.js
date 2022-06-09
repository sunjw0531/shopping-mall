import * as Api from '/api.js';
import { nav } from '/component.js';
import { addCommas } from '/useful-functions.js';

//네비게이션 바 생성
nav();
async function userInfo() {
  let total = 0;
  try {
    const data = await Api.get('/api/order/ownList');
    data.forEach((data) => {
      for (let i in data.orderList) {
        let price = data.orderList[i].productId.price;
        total += price;
      }
    });
    return total;
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. ${err.message}`);
  }
}
export const userTotal = await Promise.resolve(userInfo());
export function userTier() {
  let userTier = '';
  let nextTier = '';
  let left = 0;
  if (userTotal < 100000) {
    userTier = 'BRONZE';
    nextTier = 'SILVER';
    left = 100000 - userTotal;
    document.querySelector('.bronze').classList.add('current');
  } else if (userTotal < 100000) {
    userTier = 'SILVER';
    nextTier = 'GOLD';
    document.querySelector('.silver').classList.add('current');
  } else if (userTotal < 300000) {
    userTier = 'GOLD';
    nextTier = 'PLATINUM';
    left = 300000 - userTotal;
    document.querySelector('.gold').classList.add('current');
  } else if (userTotal < 500000) {
    userTier = 'PLATINUM';
    nextTier = 'DIAMOND';
    left = 500000 - userTotal;
    document.querySelector('.platomim').classList.add('current');
  } else if (userTotal < 700000) {
    userTier = 'DIAMOND';
    nextTier = 'CHALLENGER';
    left = 700000 - userTotal;
    document.querySelector('.diamond').classList.add('current');
  } else {
    userTier = 'CHALLENGER';
    nextTier = '없음';
    left = '없음';
    document.querySelector('.challenger').classList.add('current');
  }
  const userName = document.querySelector('#userName'),
    userEmail = document.querySelector('#userEmail'),
    currentTierText = document.querySelector('.current-tier-text'),
    tierInfo = document.querySelector('.tier-info');
  userName.textContent = sessionStorage.getItem('fullName');
  userEmail.textContent = sessionStorage.getItem('email');
  currentTierText.textContent = userTier;
  tierInfo.textContent = `다음 티어인 ${nextTier}까지 ${addCommas(
    left,
  )}원 남았습니다.`;
}
userTier();
