import * as Api from '/api.js';
const getId = await Api.get(`/api/email/${sessionStorage.getItem('email')}`);
sessionStorage.setItem('userId', getId._id);
console.log(sessionStorage);
