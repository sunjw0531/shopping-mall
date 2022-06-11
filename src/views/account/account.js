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
        let amount = data.orderList[i].volume;
        total += price * amount;
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
  let userTier = '-';
  let nextTier = '-';
  let left = 0;
  if (userTotal < 500000) {
    userTier = 'BRONZE';
    nextTier = 'SILVER';
    left = 500000 - userTotal;
    document.querySelector('.bronze').classList.add('current');
  } else if (userTotal < 1000000) {
    userTier = 'SILVER';
    nextTier = 'GOLD';
    left = 1000000 - userTotal;
    document.querySelector('.silver').classList.add('current');
  } else if (userTotal < 1500000) {
    userTier = 'GOLD';
    nextTier = 'PLATINUM';
    left = 1500000 - userTotal;
    document.querySelector('.gold').classList.add('current');
  } else if (userTotal < 2000000) {
    userTier = 'PLATINUM';
    nextTier = 'DIAMOND';
    left = 2000000 - userTotal;
    document.querySelector('.platomim').classList.add('current');
  } else if (userTotal < 2500000) {
    userTier = 'DIAMOND';
    nextTier = 'CHALLENGER';
    left = 2500000 - userTotal;
    document.querySelector('.diamond').classList.add('current');
  } else {
    userTier = 'CHALLENGER';
    nextTier = '초월';
    left = '999999999999';
    document.querySelector('.challenger').classList.add('current');
  }
  const currentTierText = document.querySelector('#current-tier-text'),
    tierInfo = document.querySelector('.tier-info'),
    name = document.querySelector('#name'),
    email = document.querySelector('#email'),
    profileImg = document.querySelector('#profileImg');
  profileImg.src = sessionStorage.getItem('profileImg');
  name.textContent = sessionStorage.getItem('fullName');
  email.textContent = sessionStorage.getItem('email');
  currentTierText.textContent = userTier;
  tierInfo.textContent = `다음 티어인 ${nextTier}까지 ${addCommas(
    left,
  )}원 남았습니다.`;
}
userTier();
