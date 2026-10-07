/* =========================================================
   MỘC MIÊN SLEEP — Interactions
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const fmt = (n) => n.toLocaleString('vi-VN') + 'đ';
  const IMG = 'assets/images/';

  /* ---------- Product data ---------- */
  const products = [
    { id: 1, cat: 'nem', label: 'Nệm', name: 'Nệm Hybrid Lò Xo Túi Mộc Miên Cloud', img: 'mattress.png', price: 12990000, old: 18990000, rating: 4.9, reviews: 3412, sizes: ['1m6', '1m8', '2m'], badge: '-32%' },
    { id: 2, cat: 'nem', label: 'Nệm', name: 'Nệm Foam Cool-Gel Làm Mát Premium', img: 'mattress.png', price: 8490000, old: 11290000, rating: 4.8, reviews: 2108, sizes: ['1m4', '1m6', '1m8'], badge: 'Bán chạy', type: 'hot' },
    { id: 3, cat: 'goi', label: 'Gối', name: 'Gối Công Thái Học Memory Foam Contour', img: 'pillow.png', price: 690000, old: 990000, rating: 4.9, reviews: 5621, sizes: ['Tiêu chuẩn'], badge: '-30%' },
    { id: 4, cat: 'goi', label: 'Gối', name: 'Gối Cao Su Non Gel Lạnh Bamboo', img: 'pillow.png', price: 850000, old: 0, rating: 4.7, reviews: 1290, sizes: ['Thấp', 'Cao'], badge: 'Mới', type: 'new' },
    { id: 5, cat: 'giuong', label: 'Giường', name: 'Giường Gỗ Sồi Bọc Nỉ Oslo', img: 'bed.png', price: 15900000, old: 19500000, rating: 4.9, reviews: 864, sizes: ['1m6', '1m8'], badge: '-18%' },
    { id: 6, cat: 'giuong', label: 'Giường', name: 'Giường Bọc Nỉ Ngăn Kéo Thông Minh', img: 'bed.png', price: 11490000, old: 0, rating: 4.8, reviews: 412, sizes: ['1m6', '1m8'], badge: 'Mới', type: 'new' },
    { id: 7, cat: 'chan', label: 'Chăn ga', name: 'Bộ Chăn Ga Cotton Sateen 400TC Sage', img: 'bedding.png', price: 1890000, old: 2690000, rating: 4.9, reviews: 2976, sizes: ['1m6', '1m8', '2m'], badge: '-30%' },
    { id: 8, cat: 'combo', label: 'Combo', name: 'Combo Phòng Ngủ Hoàn Hảo (Nệm + Giường + 2 Gối)', img: 'hero.png', price: 27900000, old: 36990000, rating: 5.0, reviews: 538, sizes: ['1m6', '1m8'], badge: 'Tiết kiệm 9tr', type: 'hot' },
  ];

  /* ---------- Render products ---------- */
  const grid = $('#product-grid');
  const wishSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>';
  grid.innerHTML = products.map(p => `
    <article class="product reveal" data-cat="${p.cat}">
      <div class="product-media">
        <img src="${IMG + p.img}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="badge ${p.type || ''}">${p.badge}</span>` : ''}
        <button class="wish" aria-label="Yêu thích" id="wish-${p.id}">${wishSvg}</button>
        <button class="quick-add" data-id="${p.id}" id="add-${p.id}">+ Thêm vào giỏ</button>
      </div>
      <div class="product-body">
        <span class="product-cat">${p.label}</span>
        <h3>${p.name}</h3>
        <div class="rating"><span class="stars">★★★★★</span>${p.rating} (${p.reviews.toLocaleString('vi-VN')})</div>
        <div class="sizes">${p.sizes.map(s => `<span>${s}</span>`).join('')}</div>
        <div class="price"><strong>${fmt(p.price)}</strong>${p.old ? `<del>${fmt(p.old)}</del>` : ''}</div>
      </div>
    </article>`).join('');

  /* ---------- Filter tabs ---------- */
  const setFilter = (f) => {
    $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.filter === f));
    $$('.product').forEach(el => el.classList.toggle('hide', f !== 'all' && el.dataset.cat !== f));
  };
  $$('.tab').forEach(t => t.addEventListener('click', () => setFilter(t.dataset.filter)));
  $$('.cat-card').forEach(c => c.addEventListener('click', () => setFilter(c.dataset.filter)));

  grid.addEventListener('click', (e) => {
    const w = e.target.closest('.wish');
    if (w) { w.classList.toggle('on'); toast(w.classList.contains('on') ? 'Đã thêm vào danh sách yêu thích' : 'Đã bỏ khỏi yêu thích'); }
    const a = e.target.closest('.quick-add');
    if (a) addToCart(+a.dataset.id);
  });

  /* ---------- Cart ---------- */
  const FREE_SHIP = 2000000;
  let cart = JSON.parse(localStorage.getItem('mm-cart') || '[]');
  const drawer = $('#drawer'), overlay = $('#overlay');
  const openCart = () => { drawer.classList.add('open'); overlay.classList.add('show'); };
  const closeCart = () => { drawer.classList.remove('open'); overlay.classList.remove('show'); $('#nav').classList.remove('open'); };

  function addToCart(id, openDrawer = false) {
    const item = cart.find(i => i.id === id);
    item ? item.qty++ : cart.push({ id, qty: 1 });
    saveCart();
    const c = $('#cart-count'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    toast(`Đã thêm "${products.find(p => p.id === id).name}"`);
    if (openDrawer) openCart();
  }
  function saveCart() { localStorage.setItem('mm-cart', JSON.stringify(cart)); renderCart(); }
  function renderCart() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.qty * products.find(p => p.id === i.id).price, 0);
    const cc = $('#cart-count'); cc.textContent = count; cc.classList.toggle('show', count > 0);
    $('#cart-total').textContent = fmt(total);
    const remain = FREE_SHIP - total;
    const ship = `<div class="free-ship">${remain > 0 ? `Mua thêm <b>${fmt(remain)}</b> để được <b>miễn phí giao hàng</b>` : '🎉 Bạn đã được <b>miễn phí giao hàng &amp; lắp đặt</b>'}<div class="bar"><div style="width:${Math.min(100, total / FREE_SHIP * 100)}%"></div></div></div>`;
    $('#drawer-body').innerHTML = cart.length ? ship + cart.map(i => {
      const p = products.find(x => x.id === i.id);
      return `<div class="cart-item"><img src="${IMG + p.img}" alt=""><div><h4>${p.name}</h4><div class="ci-price">${fmt(p.price)}</div>
        <div class="qty"><button data-act="dec" data-id="${p.id}" aria-label="Giảm">−</button><span>${i.qty}</span><button data-act="inc" data-id="${p.id}" aria-label="Tăng">+</button></div></div>
        <button class="remove" data-act="del" data-id="${p.id}">Xóa</button></div>`;
    }).join('') : '<div class="empty-cart"><div class="emo">🛏️</div><p>Giỏ hàng đang trống.<br>Khám phá sản phẩm để có giấc ngủ ngon hơn!</p></div>';
  }
  $('#drawer-body').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const id = +b.dataset.id, item = cart.find(i => i.id === id);
    if (b.dataset.act === 'inc') item.qty++;
    if (b.dataset.act === 'dec') item.qty--;
    if (b.dataset.act === 'del' || item.qty <= 0) cart = cart.filter(i => i.id !== id);
    saveCart();
  });
  $('#btn-cart').addEventListener('click', openCart);
  $('#drawer-close').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  $('#btn-checkout').addEventListener('click', () => toast(cart.length ? 'Đang chuyển đến trang thanh toán...' : 'Giỏ hàng đang trống'));
  document.addEventListener('keydown', e => e.key === 'Escape' && closeCart());
  renderCart();

  /* ---------- Toast ---------- */
  let tt;
  function toast(msg) {
    $('#toast-msg').textContent = msg;
    $('#toast').classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => $('#toast').classList.remove('show'), 2400);
  }

  /* ---------- Header ---------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  $('#btn-menu').addEventListener('click', () => $('#nav').classList.toggle('open'));
  $$('#nav a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('open')));
  $('#btn-search').addEventListener('click', () => toast('Tính năng tìm kiếm sẽ sớm ra mắt'));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Counters ---------- */
  const countIO = new IntersectionObserver((entries) => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count, dec = +(el.dataset.decimal || 0), suf = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 1800;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur), v = end * (1 - Math.pow(1 - k, 4));
      el.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('vi-VN')) + suf;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick); countIO.unobserve(el);
  }), { threshold: 0.5 });
  $$('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- Twinkling stars ---------- */
  const sb = $('#stars-bg');
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('i');
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${Math.random() * 3}s;opacity:${0.3 + Math.random() * 0.7}`;
    sb.appendChild(s);
  }

  /* ---------- Tech layers ---------- */
  const setLayer = (i) => {
    $$('.layer').forEach(l => l.classList.toggle('active', +l.dataset.i === i));
    $$('.layer-item').forEach(l => l.classList.toggle('active', +l.dataset.i === i));
  };
  $$('.layer, .layer-item').forEach(el => {
    el.addEventListener('mouseenter', () => setLayer(+el.dataset.i));
    el.addEventListener('click', () => setLayer(+el.dataset.i));
  });

  /* ---------- Sleep quiz ---------- */
  const answers = [];
  let step = 0;
  const steps = $$('.quiz-step');
  const showStep = (n) => {
    step = n;
    steps.forEach((s, i) => s.classList.toggle('active', i === n));
    $('#quiz-bar').style.width = `${(n / 3) * 100}%`;
    $('#quiz-count').textContent = n < 3 ? `Câu ${n + 1} / 3` : 'Kết quả của bạn';
    $('#quiz-back').hidden = n === 0;
  };
  $$('.quiz-step .option').forEach(o => o.addEventListener('click', () => {
    const s = +o.closest('.quiz-step').dataset.step;
    $$('.option', o.parentElement).forEach(x => x.classList.remove('selected'));
    o.classList.add('selected');
    answers[s] = o.dataset.v;
    setTimeout(() => { if (s === 2) buildResult(); showStep(s + 1); }, 320);
  }));
  $('#quiz-back').addEventListener('click', () => showStep(Math.max(0, step - 1)));

  function buildResult() {
    const pos = +answers[0], hot = answers[1] === 'hot', back = +answers[2];
    const firm = Math.min(10, Math.max(3, pos * 2 + back * 2 + 1)); // 3 – 10
    const p = hot ? products[0] : products[1];
    const reason = [
      pos === 1 ? 'êm ở vùng vai & hông cho người nằm nghiêng' : pos === 3 ? 'đủ chắc để giữ thẳng cột sống khi nằm sấp' : 'cân bằng giữa êm ái và nâng đỡ',
      hot ? 'lò xo túi thoáng khí giảm nóng' : 'lớp gel làm mát dịu nhẹ',
      back ? 'hỗ trợ vùng thắt lưng' : 'ôm sát đường cong cơ thể',
    ].join(', ');
    $('#quiz-result').innerHTML = `
      <h4>🎉 Chiếc nệm lý tưởng của bạn</h4>
      <div class="result-card"><img src="${IMG + p.img}" alt="${p.name}">
        <div><strong style="color:var(--c-ink)">${p.name}</strong>
          <p style="font-size:.86rem;color:var(--c-muted);margin:4px 0">Phù hợp vì: ${reason}.</p>
          <div style="font-size:.8rem;color:var(--c-muted)">Độ cứng đề xuất: <b style="color:var(--c-ink)">${firm}/10</b></div>
          <div class="firm-meter">${Array.from({ length: 10 }, (_, i) => `<i class="${i < firm ? 'on' : ''}"></i>`).join('')}</div>
        </div></div>
      <button class="btn btn-primary" id="quiz-add">Thêm vào giỏ — ${fmt(p.price)}</button>`;
    $('#quiz-add').addEventListener('click', () => addToCart(p.id, true));
  }

  /* ---------- Reviews ---------- */
  const reviews = [
    { n: 'Nguyễn Thu Hà', c: 'Hà Nội', t: 'Nằm nệm Hybrid được 2 tháng, chứng đau lưng buổi sáng gần như biến mất. Nhân viên lắp đặt rất chu đáo, còn mang nệm cũ đi giúp mình.', col: 'hsl(8,60%,62%)' },
    { n: 'Trần Minh Khoa', c: 'TP.HCM', t: 'Sài Gòn nóng mà nằm nệm này không bị hầm lưng chút nào. Vợ chồng trở mình cũng không làm phiền nhau. Đáng từng đồng!', col: 'hsl(210,45%,50%)' },
    { n: 'Lê Phương Anh', c: 'Đà Nẵng', t: 'Gối công thái học là chân ái cho dân văn phòng như mình. Hết mỏi cổ vai gáy sau 1 tuần. Đã mua thêm 2 chiếc tặng bố mẹ.', col: 'hsl(150,30%,45%)' },
    { n: 'Phạm Quốc Bảo', c: 'Cần Thơ', t: 'Combo phòng ngủ tiết kiệm được gần 9 triệu. Giường gỗ sồi chắc chắn, hoàn thiện đẹp hơn cả trong hình. Giao hàng về tỉnh chỉ 2 ngày.', col: 'hsl(36,60%,50%)' },
    { n: 'Đỗ Mai Linh', c: 'Hải Phòng', t: 'Ga Cotton Sateen mềm mượt, giặt nhiều lần vẫn không xù lông. Màu xanh sage rất sang, phòng ngủ trông như khách sạn 5 sao.', col: 'hsl(280,30%,55%)' },
  ];
  $('#review-slider').innerHTML = reviews.map((r, i) => `
    <article class="review reveal ${i < 3 ? 'reveal-d' + i : ''}">
      <div class="stars">★★★★★</div>
      <blockquote>${r.t}</blockquote>
      <div class="reviewer"><div class="avatar" style="background:${r.col}">${r.n.split(' ').pop()[0]}</div>
        <div><strong>${r.n}</strong><span>${r.c} · <span class="verified">✓ Đã mua hàng</span></span></div></div>
    </article>`).join('');
  $$('#review-slider .reveal').forEach(el => io.observe(el));
  const slider = $('#review-slider');
  const slide = (d) => slider.scrollBy({ left: d * (slider.firstElementChild.offsetWidth + 24), behavior: 'smooth' });
  $('#rev-prev').addEventListener('click', () => slide(-1));
  $('#rev-next').addEventListener('click', () => slide(1));

  /* ---------- FAQ ---------- */
  $$('.faq-q').forEach(q => q.addEventListener('click', () => {
    const item = q.parentElement, open = item.classList.contains('open');
    $$('.faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  }));

  /* ---------- Newsletter ---------- */
  $('#news-form').addEventListener('submit', (e) => {
    e.preventDefault();
    toast('Cảm ơn bạn! Mã voucher MOCMIEN500 đã được gửi đến email.');
    e.target.reset();
  });
})();
