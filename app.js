(() => {
  const table = document.getElementById("faqTable");
  const queryInput = document.getElementById("queryInput");
  const groupTitleCell = document.getElementById("groupTitleCell");

  const config = window.PAGE_CONFIG || { groupTitle: "", items: [] };
  const items = Array.isArray(config.items) ? config.items : [];

  groupTitleCell.textContent = config.groupTitle || "";

  // id -> { qRow, dRow }
  const rowMap = new Map();

  function setNumColumnWidth() {
    const maxDigits =
      items.length === 0
        ? 1
        : Math.max(...items.map(x => String(x.id).length));

    document.documentElement.style.setProperty("--num-ch", String(maxDigits + 1));
  }

  function escapeHtml(s){
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function makeQuestionRow(item){
    const tr = document.createElement("tr");
    tr.className = "q-row";
    tr.dataset.id = item.id;

    tr.innerHTML = `
      <td class="num">${escapeHtml(item.id)}</td>
      <td class="q">${escapeHtml(item.title)}</td>
      <td class="arr"><span class="arrow down"></span></td>
    `;
    tr.addEventListener("click", () => toggle(item.id));
    return tr;
  }

  function makeDetailRow(item){
    const tr = document.createElement("tr");
    tr.className = "detail";
    tr.dataset.detailFor = item.id;
    tr.hidden = true;

    tr.innerHTML = `
      <td colspan="3">
        <div class="detail-q">${escapeHtml(item.qText)}</div>
        <hr class="dash">
        <div class="detail-a">${escapeHtml(item.aText)}</div>
      </td>
    `;
    return tr;
  }

  function render(){
    items.forEach(item => {
      const qRow = makeQuestionRow(item);
      const dRow = makeDetailRow(item);

      table.appendChild(qRow);
      table.appendChild(dRow);

      rowMap.set(item.id, { qRow, dRow });
    });
  }

  function closeAll(){
    for (const { dRow, qRow } of rowMap.values()){
      dRow.hidden = true;
      const arrow = qRow.querySelector(".arrow");
      arrow.classList.remove("up");
      arrow.classList.add("down");
    }
  }

  function toggle(id){
    const pair = rowMap.get(id);
    if (!pair) return;

    const { dRow, qRow } = pair;
    const arrow = qRow.querySelector(".arrow");
    const isOpen = !dRow.hidden;

    closeAll();
    if(!isOpen){
      dRow.hidden = false;
      arrow.classList.remove("down");
      arrow.classList.add("up");
      qRow.scrollIntoView({behavior:"smooth", block:"center"});
    }
  }

  // Поиск по полному тексту (qText) + фильтрация (оставить только совпадения)
  function applyFilter(query){
    const q = query.trim().toLowerCase();

    if(!q){
      for (const { qRow, dRow } of rowMap.values()){
        qRow.style.display = "";
        dRow.style.display = "";
      }
      closeAll();
      return;
    }

    closeAll();

    let matches = 0;
    let lastMatchId = null;

    for (const item of items){
      const full = String(item.qText ?? "").toLowerCase();
      const ok = full.includes(q);
      const pair = rowMap.get(item.id);

      if (ok){
        matches++;
        lastMatchId = item.id;
        pair.qRow.style.display = "table-row";
        pair.dRow.style.display = "table-row"; // строка деталей существует, но она hidden
      } else {
        pair.qRow.style.display = "none";
        pair.dRow.style.display = "none";
      }
    }

    // удобно: если совпадение одно — раскрыть
    if (matches === 1 && lastMatchId != null){
      toggle(lastMatchId);
    }
  }

  // Поиск сразу при вводе (debounce)
  let t = null;
  queryInput.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => applyFilter(queryInput.value), 200);
  });

  // init
  setNumColumnWidth();
  render();
})();