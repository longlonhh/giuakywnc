const API = ''; // cùng nguồn với server NestJS

const el = (s) => document.querySelector(s);
const h = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};

const fmtDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString('vi-VN').replace(',', '') : '—';
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('vi-VN') : '—';

const badge = (txt, cls) => h('span', 'badge ' + cls, txt);

/* ---------- Thêm sách (POST /books) ---------- */
el('#bookForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const body = {
    title: el('#b-title').value.trim(),
    author: el('#b-author').value.trim(),
    isbn: el('#b-isbn').value.trim() || undefined,
    totalCopies: Number(el('#b-copies').value || 1),
  };
  const res = await fetch(API + '/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.ok) {
    closeDialog('#dialog-book');
    refreshAll();
  } else {
    const err = await res.json().catch(() => ({}));
    alert(err.message?.join?.('\n') || err.message || 'Lỗi tạo sách');
  }
});

/* ---------- Thêm độc giả (POST /readers) ---------- */
el('#readerForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const body = {
    fullName: el('#r-name').value.trim(),
    email: el('#r-email').value.trim(),
    phone: el('#r-phone').value.trim() || undefined,
  };
  const res = await fetch(API + '/readers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.ok) {
    closeDialog('#dialog-reader');
    refreshAll();
  } else {
    const err = await res.json().catch(() => ({}));
    alert(err.message?.join?.('\n') || err.message || 'Lỗi tạo độc giả');
  }
});

/* ---------- Độc giả mượn sách (POST /borrows — Câu 3.3) ---------- */
el('#borrowForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const body = {
    readerId: Number(el('#borrow-reader').value),
    bookId: Number(el('#borrow-book').value),
    days: Number(el('#borrow-days').value || 14),
  };
  const res = await fetch(API + '/borrows', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  showLog(res.status, data);
  if (res.status === 201) {
    closeDialog('#dialog-borrow');
    refreshAll();
  }
});

/* ---------- Bảng SÁCH ---------- */
function renderBooks(books) {
  el('#bookEmpty').hidden = books.length > 0;
  const box = el('#bookList');
  box.innerHTML = '';
  for (const b of books) {
    const tr = h('tr');
    tr.append(h('td', '', '#' + b.id));
    const tdT = h('td');
    tdT.append(h('strong', '', b.title));
    if (b.isbn) tdT.append(h('div', 'sub', 'ISBN: ' + b.isbn));
    tr.append(tdT);
    tr.append(h('td', '', b.author));
    tr.append(h('td', '', String(b.totalCopies)));
    const tdAv = h('td');
    tdAv.append(
      b.availableCopies > 0
        ? badge(b.availableCopies + ' / ' + b.totalCopies, 'b-ok')
        : badge('Hết bản', 'b-danger'),
    );
    tr.append(tdAv);
    const tdA = h('td', 'actions');
    const btn = h('button', 'btn sm out', 'Xóa');
    btn.onclick = async () => {
      if (!confirm('Xóa sách "' + b.title + '"?')) return;
      const res = await fetch(API + '/books/' + b.id, { method: 'DELETE' });
      showLog(res.status, await res.json().catch(() => ({})));
      refreshAll();
    };
    tdA.append(btn);
    tr.append(tdA);
    box.append(tr);
  }
}

/* ---------- Bảng ĐỘC GIẢ ---------- */
function renderReaders(readers) {
  el('#readerEmpty').hidden = readers.length > 0;
  const box = el('#readerList');
  box.innerHTML = '';
  for (const r of readers) {
    const tr = h('tr');
    tr.append(h('td', '', '#' + r.id));
    const tdN = h('td');
    tdN.append(h('strong', '', r.fullName));
    tdN.append(h('div', 'sub', r.email));
    tr.append(tdN);
    tr.append(h('td', '', r.phone || '—'));
    const tdA = h('td', 'actions');
    const btn = h('button', 'btn sm out', 'Xóa');
    btn.onclick = async () => {
      if (!confirm('Xóa độc giả "' + r.fullName + '"?')) return;
      const res = await fetch(API + '/readers/' + r.id, { method: 'DELETE' });
      showLog(res.status, await res.json().catch(() => ({})));
      refreshAll();
    };
    tdA.append(btn);
    tr.append(tdA);
    box.append(tr);
  }
}

/* ---------- Bảng SÁCH ĐANG ĐƯỢC MƯỢN (Câu 3.4) ---------- */
function renderBorrows(active) {
  el('#borrowEmpty').hidden = active.length > 0;
  const box = el('#borrowList');
  box.innerHTML = '';
  for (const br of active) {
    const tr = h('tr');
    tr.append(h('td', '', '#' + br.id));

    const tdB = h('td');
    tdB.append(h('strong', '', br.book?.title || ''));
    tdB.append(h('div', 'sub', br.book?.author || ''));
    tr.append(tdB);

    const tdR = h('td');
    tdR.append(h('strong', '', br.reader?.fullName || ''));
    tdR.append(h('div', 'sub', br.reader?.email || ''));
    tr.append(tdR);

    tr.append(h('td', '', fmtDateTime(br.borrowedDate)));
    tr.append(h('td', '', fmtDateTime(br.dueDate)));

    const ms = new Date(br.dueDate) - new Date();
    const days = Math.ceil(ms / 86400000);
    const tdSt = h('td');
    tdSt.append(
      ms < 0
        ? badge('Quá hạn ' + Math.abs(days) + ' ngày', 'b-danger')
        : days <= 3
          ? badge('Còn ' + days + ' ngày', 'b-warn')
          : badge('Còn ' + days + ' ngày', 'b-ok'),
    );
    tr.append(tdSt);

    const tdA = h('td', 'actions');
    const btn = h('button', 'btn sm', 'Trả sách');
    btn.onclick = async () => {
      const res = await fetch(API + '/borrows/' + br.id + '/return', {
        method: 'PATCH',
      });
      showLog(res.status, await res.json().catch(() => ({})));
      refreshAll();
    };
    tdA.append(btn);
    tr.append(tdA);
    box.append(tr);
  }
}

/* ---------- Bảng SÁCH ĐÃ TRẢ ---------- */
function renderReturned(returned) {
  el('#returnedEmpty').hidden = returned.length > 0;
  const box = el('#returnedBody');
  box.innerHTML = '';
  for (const br of returned) {
    const tr = h('tr');
    tr.append(h('td', '', '#' + br.id));
    tr.append(h('td', '', br.book?.title || ''));
    tr.append(h('td', '', br.reader?.fullName || ''));
    tr.append(h('td', '', fmtDate(br.borrowedDate)));
    tr.append(h('td', '', fmtDate(br.returnedDate)));
    box.append(tr);
  }
}

/* ---------- Thống kê ---------- */
function renderStats(books, readers, active) {
  el('#stBorrowed').textContent = String(active.length);
  el('#stAvailable').textContent = String(
    books.reduce((s, b) => s + (b.availableCopies || 0), 0),
  );
  el('#stReaders').textContent = String(readers.length);
  el('#stTitles').textContent = String(books.length);
}

/* ---------- Nạp dữ liệu ---------- */
const getJSON = (u) => fetch(API + u).then((r) => r.json());

function fillSelect(sel, items, label) {
  sel.innerHTML = '';
  for (const it of items) sel.append(new Option(label(it), it.id));
}

async function refreshAll() {
  const [books, readers, all] = await Promise.all([
    getJSON('/books'),
    getJSON('/readers'),
    getJSON('/borrows?active=false'),
  ]);
  const active = all.filter((x) => !x.returnedDate);
  const returned = all.filter((x) => !!x.returnedDate);

  renderBooks(books);
  renderReaders(readers);
  renderBorrows(active);
  renderReturned(returned);
  renderStats(books, readers, active);

  fillSelect(
    el('#borrow-reader'),
    readers,
    (r) => r.fullName + ' (#' + r.id + ')',
  );
  fillSelect(
    el('#borrow-book'),
    books.filter((b) => b.availableCopies > 0),
    (b) => b.title + ' — còn ' + b.availableCopies + ' bản (#' + b.id + ')',
  );
}

/* ---------- Log phản hồi API ---------- */
function showLog(status, data) {
  el('#log').textContent = '[' + status + '] ' + JSON.stringify(data, null, 2);
}

/* ---------- Dialog ---------- */
function openDialog(sel) {
  el(sel).showModal();
}
function closeDialog(sel) {
  el(sel).close();
}
window.openDialog = openDialog;
window.closeDialog = closeDialog;

refreshAll();
setInterval(refreshAll, 5000); // tự làm mới mỗi 5 giây
