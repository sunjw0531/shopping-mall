(() => {
	'use strict';
	const e = 'kwang-shopping';
	AWS.config.update({
		region: 'ap-northeast-2',
		credentials: new AWS.CognitoIdentityCredentials({
			IdentityPoolId: 'ap-northeast-2:b6a1fa02-993d-437d-9ed5-7134db218241',
		}),
	});
	const t = new AWS.S3({ apiVersion: '2006-03-01', params: { Bucket: e } });
	function a(a) {
		return new Promise((o) => {
			const n = { Bucket: e, Key: a, Expires: 60 };
			t.getSignedUrl('getObject', n, (e, t) => {
				o(t);
			});
		});
	}
	const o = (e) =>
			function () {
				window.location.href = e;
			},
		n = (e) => {
			const t = e.split(' '),
				a = document.querySelector('#navbar'),
				o = !!localStorage.getItem('token'),
				n = !!localStorage.getItem('admin'),
				c = {
					register: '<li><a href="/register">회원가입</a></li>',
					login: '<li><a href="/login">로그인</a></li>',
				},
				i = {
					account: '<li><a href="/account">계정관리</a></li>',
					logout: '<li><a href="#" id="logout">로그아웃</a></li>',
					productAdd: '<li><a href="/product/add">제품 추가</a></li>',
					categoryAdd: '<li><a href="/category/add">카테고리 추가</a></li>',
				},
				r = { admin: '<li><a href="/admin">페이지관리</a></li>' },
				s = document.createElement('script');
			s.innerText =
				"\n      const logoutElem = document.querySelector('#logout'); \n      \n      if (logoutElem) {\n        logoutElem.addEventListener('click', () => {\n          localStorage.removeItem('token');\n          localStorage.removeItem('admin');\n\n          window.location.href = '/';\n        });\n      }\n  ";
			let d = '';
			for (const e of t)
				n && (d += r[e] ?? ''), (d += o ? i[e] ?? '' : c[e] ?? '');
			a.insertAdjacentHTML('afterbegin', d), a.after(s);
		},
		c = document.querySelector('#slider'),
		i = document.querySelector('#sliderArrowLeft'),
		r = document.querySelector('#sliderArrowRight');
	!(async function () {
		(() => {
			switch (window.location.pathname) {
				case '/':
				case '/cart/':
				case '/product/detail/':
				case '/product/list/':
					n('admin register login account logout');
					break;
				case '/account/orders/':
				case '/account/security/':
				case '/account/signout/':
				case '/admin/orders/':
				case '/admin/users/':
				case '/order/complete/':
				case '/order/':
				case '/product/add/':
					n('admin account logout');
					break;
				case '/account/':
					n('admin logout');
					break;
				case '/admin/':
					n('account logout');
					break;
				case '/category/add/':
					n('admin account productAdd logout');
					break;
				case '/login/':
					n('register');
					break;
				case '/register/':
					n('login');
			}
		})(),
			await (async function () {
				const e = await (async function (e, t = '') {
					const a = `${e}/${t}`;
					console.log(`%cGET 요청: ${a} `, 'color: #a25cd1;');
					const o = await fetch(a, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					});
					if (!o.ok) {
						const e = await o.json(),
							{ reason: t } = e;
						throw new Error(t);
					}
					return await o.json();
				})('/api/categorylist');
				for (const t of e) {
					const {
							_id: e,
							title: n,
							description: i,
							themeClass: r,
							imageKey: s,
						} = t,
						d = await a(s);
					c.insertAdjacentHTML(
						'beforeend',
						`\n      <div class="card" id="category-${e}">\n        <div class="notification ${r}">\n          <p class="title is-3 is-spaced">${n}</p>\n          <p class="subtitle is-6">${i}</p>\n        </div>\n        <div class="card-image">\n          <figure class="image is-3by2">\n            <img\n              src="${d}"\n              alt="카테고리 이미지"\n            />\n          </figure>\n        </div>\n      </div>\n    `,
					);
					document
						.querySelector(`#category-${e}`)
						.addEventListener('click', o(`/product/list?category=${n}`));
				}
			})(),
			(function () {
				const e = bulmaCarousel.attach('#slider', {
					autoplay: !0,
					autoplaySpeed: 6e3,
					infinite: !0,
					duration: 500,
					pauseOnHover: !1,
					navigation: !1,
				});
				i.addEventListener('click', () => {
					e[0].previous();
				}),
					r.addEventListener('click', () => {
						e[0].next();
					});
			})();
	})();
})();
