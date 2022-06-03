import express from 'express';
import path from 'path';
// /admin 하위의 목록에 라우팅하는 파일입니다.
const adminRouter = express.Router();
// 아래의 serveStatic 함수를 사용하면 원하는 경로에 동일한 이름의 html을 사용할 수 있음.
adminRouter.use('/orders', serveStatic('orders'));
adminRouter.use('/users', serveStatic('security'));

function serveStatic(resource) {
    const resourcePath = path.join(__dirname, `../views/admin/${resource}`);
    const option = { index: `${resource}.html` };
  
    // express.static 은 express 가 기본으로 제공하는 함수임
    return express.static(resourcePath, option);
  }

export { adminRouter };
