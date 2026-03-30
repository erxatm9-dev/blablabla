// app.js — логика вкладок, карты, аудио, авторов
'use strict';

// ═══════════════════════════════════
// ПЕРЕКЛЮЧАТЕЛЬ ВКЛАДОК
// ═══════════════════════════════════
window.switchTab = function(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById(`tab-${tabId}`).classList.add('active');
};

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ═══════════════════════════════════
// КАРТА
// ═══════════════════════════════════
async function initMap() {
  const host = document.getElementById('mapHost');
  try {
    const res  = await fetch('kazakhstan.svg');
    const text = await res.text();
    host.innerHTML = text;

    const svg = host.querySelector('svg');
    if (!svg) throw new Error('SVG не найден');

    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.style.cssText = 'width:100%;height:100%;display:block;';

    if (!svg.hasAttribute('viewBox')) {
      const bb = svg.getBBox ? svg.getBBox() : null;
      svg.setAttribute('viewBox', bb
        ? `${bb.x} ${bb.y} ${bb.width} ${bb.height}`
        : '0 0 1000 600');
    }

    setupMapEvents(svg);
  } catch(e) {
    host.innerHTML = `<p style="color:#ff8;padding:20px">Ошибка загрузки карты: ${e.message}<br>
      Убедитесь, что файл <b>kazakhstan.svg</b> лежит рядом с index.html и запущен локальный сервер.</p>`;
  }
}

// ── Добавление названий регионов на карту ──
function addRegionLabels(svg) {
  let labelsGroup = svg.querySelector('#region-labels');
  if (!labelsGroup) {
    labelsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    labelsGroup.id = "region-labels";
    labelsGroup.setAttribute('style', 'pointer-events: none;');
    svg.appendChild(labelsGroup);
  } else {
    labelsGroup.innerHTML = '';
  }

  const shortNames = {
    'KZ27': 'BATYS QAZ.',
    'KZ23': 'ATYRAU',
    'KZ47': 'MAÑĞYSTAU',
    'KZ15': 'AQTÖBE',
    'KZ39': 'QOSTANAİ',
    'KZ59': 'SOLTÜSTİK|QAZ.',
    'KZ11': 'AQMOLA',
    'KZ55': 'PAVLODAR',
    'KZ35': 'QARAĞANDY',
    'KZ63': 'ŞYĞYS|QAZ.',
    'KZ43': 'QYZYLORDA',
    'KZ61': 'TÜRKİSTAN',
    'KZ31': 'JAMBYL',
    'KZ19': 'ALMATY',
    'KZ10': 'ABAI',
    'KZ33': 'JETISÝ',
    'KZ62': 'ULYTAU'
  };

  const offsets = {
    'KZ27': [0, 0],
    'KZ23': [0, -10],
    'KZ47': [15, 20],
    'KZ15': [0, 0],
    'KZ39': [0, 10],
    'KZ59': [-8, -15], // Чуть правее и ниже
    'KZ11': [0, -150],
    'KZ55': [0, 10],
    'KZ35': [50, 0],
    'KZ63': [0, 10],
    'KZ43': [0, 10],
    'KZ61': [5, 20],
    'KZ31': [0, 10],
    'KZ19': [15, 32],
    'KZ10': [0, 0],
    'KZ33': [0, 0],
    'KZ62': [0, 0]
  };

  const validIds = new Set(Object.keys(window.GEOMUSIC?.regions || {}));
  const regions = [...svg.querySelectorAll('[id]')].filter(el => validIds.has(el.id));
  regions.forEach(el => {
    const key = el.getAttribute('data-region') || el.getAttribute('id');
    if (!key || !shortNames[key]) return;

    const bbox = el.getBBox();
    let cx = bbox.x + bbox.width / 2;
    let cy = bbox.y + bbox.height / 2;

    if (offsets[key]) {
      cx += offsets[key][0];
      cy += offsets[key][1];
    }

    const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textEl.setAttribute('x', cx);
    textEl.setAttribute('y', cy);
    textEl.setAttribute('text-anchor', 'middle');
    textEl.setAttribute('dominant-baseline', 'middle');
    textEl.setAttribute('class', 'region-label');
    textEl.id = 'label-' + key;

    // Перенос строк
    const nameParts = shortNames[key].split('|');
    if (nameParts.length > 1) {
      nameParts.forEach((part, index) => {
        const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.setAttribute('x', cx);
        if (index === 0) {
            tspan.setAttribute('dy', '-0.5em');
        } else {
            tspan.setAttribute('dy', '1.1em');
        }
        tspan.textContent = part;
        textEl.appendChild(tspan);
      });
    } else {
      textEl.textContent = shortNames[key];
    }

    labelsGroup.appendChild(textEl);

    el.addEventListener('mouseenter', () => {
      textEl.classList.add('label-hover');
    });
    el.addEventListener('mouseleave', () => {
      textEl.classList.remove('label-hover');
    });
  });
} // <--- This was missing!!!

function openFloatingPopup(key, authors, event) {
  const popup = document.getElementById('floatingPopup');
  const body  = document.getElementById('popupBody');
  if (!popup || !body) return;

  renderInfoPanel(body, key, authors);
  popup.classList.add('is-open');
  popup.setAttribute('aria-hidden', 'false');

  // Позиционирование меню рядом с курсором (с учетом прокрутки страницы)
  let x = event.pageX + 15;
  let y = event.pageY + 15;

  // Чтобы меню не выходило за правый и нижний края экрана
  // Делаем popup видимым, чтобы получить его размеры
  const rect = popup.getBoundingClientRect();
  const screenW = window.innerWidth + window.scrollX;
  const screenH = window.innerHeight + window.scrollY;

  if (x + rect.width > screenW) {
    x = event.pageX - rect.width - 15;
  }
  if (y + rect.height > screenH) {
    y = event.pageY - rect.height - 15;
  }

  // Защита от ухода за левый и верхний край
  x = Math.max(10, x);
  y = Math.max(10, y);

  popup.style.left = x + 'px';
  popup.style.top  = y + 'px';
}

function closeFloatingPopup() {
  const popup = document.getElementById('floatingPopup');
  if (!popup) return;

  // Останавливаем аудио при закрытии меню
  const audios = popup.querySelectorAll('audio');
  audios.forEach(a => {
    a.pause();
    a.currentTime = 0;
  });

  popup.classList.remove('is-open');
  popup.setAttribute('aria-hidden', 'true');

  // Снимаем подсветку с регионов
  document.querySelectorAll('.region').forEach(r => r.classList.remove('active'));
}

function setupMapEvents(svg) {
  addRegionLabels(svg);

  // Скрываем/удаляем стандартный тултип, так как он больше не нужен
  const oldTooltip = document.getElementById('tooltip');
  if (oldTooltip) oldTooltip.style.display = 'none';

  // Настройка событий закрытия всплывающего меню
  const popupCloseBtn = document.getElementById('popupClose');
  if (popupCloseBtn) {
    popupCloseBtn.addEventListener('click', closeFloatingPopup);
  }

  // Закрытие по клику вне карты и меню
  document.addEventListener('click', (e) => {
    const popup = document.getElementById('floatingPopup');
    const isClickInsideMap = e.target.closest('#mapHost') || e.target.closest('.region');
    const isClickInsidePopup = e.target.closest('#floatingPopup');

    if (popup && popup.classList.contains('is-open') && !isClickInsideMap && !isClickInsidePopup) {
      closeFloatingPopup();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFloatingPopup();
  });

  // Берем ВООБЩЕ ВСЕ пути (кусочки карты) внутри SVG
  const validIds = new Set(Object.keys(window.GEOMUSIC?.regions || {}));
  const regions = [...svg.querySelectorAll('[id]')].filter(el => validIds.has(el.id));

  regions.forEach(el => {
    el.classList.add('region');

    if (el.hasAttribute('title')) {
      el.removeAttribute('title');
    }

    // ТОЛЬКО КЛИК - Открываем меню рядом с курсором
    el.addEventListener('click', e => {
      e.stopPropagation(); // Чтобы не срабатывал document click

      const key = el.getAttribute('data-region') || el.getAttribute('id');
      if (!key || !window.GEOMUSIC?.regions?.[key]) return;

      // Выделяем активный регион
      regions.forEach(r => r.classList.remove('active'));
      el.classList.add('active');

      const authors = (window.GEOMUSIC?.authors || []).filter(a => (a.regions||[]).includes(key));
      openFloatingPopup(key, authors, e);
    });
  });
}

// ═══════════════════════════════════
// ГЕНЕРАЦИЯ ПАНЕЛИ АВТОРОВ С ПЛЕЕРАМИ
// ═══════════════════════════════════
function renderInfoPanel(panel, key, authors) {
  const regionName = window.GEOMUSIC?.regions?.[key] || key;

  if (!authors.length) {
    panel.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🗺</div>
        <h2>${regionName}</h2>
        <p>Для этого региона пока нет данных в базе</p>
      </div>`;
    return;
  }

  const authorsHtml = authors.map(a => {
    const w = a.works?.[0];
    return `
      <div class="author-card" style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px dashed var(--border);">
        <img class="author-img" src="${a.photo}" alt="${a.name}"
             onerror="this.src='https://via.placeholder.com/160x160/3e2f26/d4a373?text=♬'">
        <h2 class="author-name">${a.name}</h2>
        <div class="author-years">${a.years || ''}</div>
        <p class="author-bio">${a.bio || ''}</p>
        ${w ? `
          <div class="track-block">
            <div class="track-label">🎵 ${w.title}</div>
            <audio controls preload="none" src="${w.audio}"></audio>
          </div>` : ''}
      </div>
    `;
  }).join('');

  panel.innerHTML = `
    <div style="text-align:center; margin-bottom: 20px;">
      <span class="author-region-badge" style="font-size: 0.9rem; padding: 6px 16px;">
        📍 ${regionName}
      </span>
    </div>
    ${authorsHtml}
  `;
}

// ═══════════════════════════════════
// АУДИО-ВКЛАДКА
// ═══════════════════════════════════
function renderAudioTab() {
  const grid = document.getElementById('audioGrid');
  const all  = window.GEOMUSIC?.authors || [];
  if (!all.length) { grid.innerHTML = '<p>Нет данных</p>'; return; }

  grid.innerHTML = all.map(a => (a.works||[]).map(w => `
    <div class="audio-card">
      <img class="audio-author-img" src="${a.photo}" alt="${a.name}"
           onerror="this.src='https://via.placeholder.com/56x56/3e2f26/d4a373?text=♬'">
      <div class="audio-info">
        <div class="audio-track-title">${w.title}</div>
        <div class="audio-author-name">${a.name}</div>
        <audio controls preload="none" src="${w.audio}"></audio>
      </div>
    </div>`).join('')).join('');
}

// ═══════════════════════════════════
// АВТОРЫ-ВКЛАДКА
// ═══════════════════════════════════
function populateRegionFilter() {
  const sel = document.getElementById('regionFilter');
  Object.entries(window.GEOMUSIC?.regions || {}).forEach(([k,v]) => {
    const o = document.createElement('option');
    o.value = k; o.textContent = v;
    sel.appendChild(o);
  });
}

function renderAuthorsTab(filter='', region='') {
  const grid = document.getElementById('authorsGrid');
  let list   = window.GEOMUSIC?.authors || [];
  if (region) list = list.filter(a => (a.regions||[]).includes(region));
  if (filter) list = list.filter(a => a.name.toLowerCase().includes(filter.toLowerCase()));

  if (!list.length) {
    grid.innerHTML = '<p class="no-results">Ничего не найдено</p>';
    return;
  }

  grid.innerHTML = list.map(a => {
    const w = a.works?.[0];
    const regionLabel = (a.regions||[])
      .map(k => window.GEOMUSIC?.regions?.[k]||k).slice(0,2).join(', ');
    return `
      <div class="author-card-big">
        <div class="acb-header">
          <img class="acb-photo" src="${a.photo}" alt="${a.name}"
               onerror="this.src='https://via.placeholder.com/80x80/3e2f26/d4a373?text=♬'">
          <div class="acb-info">
            <div class="acb-name">${a.name}</div>
            <div class="acb-years">${a.years||''}</div>
            <div class="acb-region">${regionLabel}</div>
          </div>
        </div>
        <p class="acb-bio">${a.bio||''}</p>
        ${w ? `
          <div class="acb-track">
            <div class="track-label">🎵 ${w.title}</div>
            <audio controls preload="none" src="${w.audio}"></audio>
          </div>` : ''}
      </div>`;
  }).join('');
}

// ═══════════════════════════════════
// СТАРТ
// ═══════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  renderAudioTab();
  populateRegionFilter();
  renderAuthorsTab();

  document.getElementById('searchInput').addEventListener('input', e => {
    renderAuthorsTab(e.target.value, document.getElementById('regionFilter').value);
  });
  document.getElementById('regionFilter').addEventListener('change', e => {
    renderAuthorsTab(document.getElementById('searchInput').value, e.target.value);
  });
}); // <---- THIS WAS MISSING OR MISPLACED!

// ═══════════════════════════════════
// МИНИ-ИГРЫ
// ═══════════════════════════════════
let currentGameType = ''; // 'photo' или 'region'
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Вспомогательная функция для перемешивания массива (Алгоритм Фишера-Йетса)
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Выход из игры в меню
window.exitGame = function() {
  document.getElementById('gamesMenuHero').style.display = 'block';
  document.getElementById('gamesMenu').style.display = 'grid';
  document.getElementById('activeGameContainer').style.display = 'none';
};

// Запуск игры 1: Угадай по фото
window.startPhotoGame = function() {
  const authors = window.GEOMUSIC?.authors || [];
  if (authors.length < 4) return alert("Недостаточно авторов в базе для игры!");

  currentGameType = 'photo';
  document.getElementById('gameTitle').textContent = 'Угадай по фото';

  // Создаем 5 случайных вопросов
  let shuffledAuthors = shuffle([...authors]).slice(0, 5);

  currentQuestions = shuffledAuthors.map(author => {
    // Выбираем 3 неправильных ответа
    let wrongOptions = authors.filter(a => a.id !== author.id);
    wrongOptions = shuffle(wrongOptions).slice(0, 3).map(a => a.name);

    let options = shuffle([author.name, ...wrongOptions]);

    return {
      photo: author.photo,
      correctAnswer: author.name,
      options: options
    };
  });

  startGame();
};

// Запуск игры 2: География музыки
window.startRegionGame = function() {
  const authors = window.GEOMUSIC?.authors || [];
  const regionsObj = window.GEOMUSIC?.regions || {};
  if (authors.length < 4) return alert("Недостаточно данных для игры!");

  currentGameType = 'region';
  document.getElementById('gameTitle').textContent = 'География музыки';

  // Создаем 5 случайных вопросов
  let shuffledAuthors = shuffle([...authors]).slice(0, 5);

  currentQuestions = shuffledAuthors.map(author => {
    // Правильный регион (берем первый из массива)
    let correctRegionKey = author.regions[0];
    let correctRegionName = regionsObj[correctRegionKey];

    // Берем все возможные названия регионов, исключая правильный
    let allRegionNames = Object.values(regionsObj);
    let wrongOptions = allRegionNames.filter(r => r !== correctRegionName);
    wrongOptions = shuffle(wrongOptions).slice(0, 3);

    let options = shuffle([correctRegionName, ...wrongOptions]);

    return {
      text: `Из какого региона родом (или где творил)<br><b style="color:var(--gold); font-size:1.5rem;">${author.name}</b>?`,
      correctAnswer: correctRegionName,
      options: options
    };
  });

  startGame();
};

// Общая логика запуска
function startGame() {
  score = 0;
  currentQuestionIndex = 0;

  document.getElementById('gamesMenuHero').style.display = 'none';
  document.getElementById('gamesMenu').style.display = 'none';
  document.getElementById('activeGameContainer').style.display = 'block';
  document.getElementById('gameResult').style.display = 'none';
  document.getElementById('gameBody').style.display = 'block';

  document.getElementById('gameTotal').textContent = currentQuestions.length;

  document.getElementById('restartGameBtn').onclick = () => {
    if(currentGameType === 'photo') startPhotoGame();
    else startRegionGame();
  };

  renderQuestion();
}

// Отрисовка текущего вопроса
function renderQuestion() {
  document.getElementById('gameScore').textContent = score;
  const q = currentQuestions[currentQuestionIndex];
  const body = document.getElementById('gameBody');

  let contentHtml = '';

  if (currentGameType === 'photo') {
    contentHtml = `
      <div class="game-question">
        <img class="game-question-img" src="${q.photo}" alt="Кто это?">
        <div class="game-question-text">Кто изображен на фото?</div>
      </div>
    `;
  } else {
    contentHtml = `
      <div class="game-question" style="margin-top: 30px;">
        <div class="game-question-text">${q.text}</div>
      </div>
    `;
  }

  // Рендерим кнопки вариантов
  const optionsHtml = `
    <div class="game-options">
      ${q.options.map(opt => `<button class="game-option-btn" onclick="checkAnswer(this, '${opt.replace(/'/g, "\'")}')">${opt}</button>`).join('')}
    </div>
  `;

  body.innerHTML = contentHtml + optionsHtml;
}

// Проверка ответа
window.checkAnswer = function(btn, selectedAnswer) {
  const q = currentQuestions[currentQuestionIndex];
  const allBtns = document.querySelectorAll('.game-option-btn');

  // Блокируем все кнопки от повторного нажатия
  allBtns.forEach(b => b.disabled = true);

  if (selectedAnswer === q.correctAnswer) {
    btn.classList.add('correct');
    score++;
    document.getElementById('gameScore').textContent = score;
  } else {
    btn.classList.add('wrong');
    // Подсвечиваем правильный
    allBtns.forEach(b => {
      if(b.textContent === q.correctAnswer) b.classList.add('correct');
    });
  }

  // Переход к следующему вопросу через 1.5 секунды
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
      renderQuestion();
    } else {
      endGame();
    }
  }, 1500);
};

function endGame() {
  document.getElementById('gameBody').style.display = 'none';
  document.getElementById('gameResult').style.display = 'block';
  document.getElementById('finalScore').textContent = `${score} из ${currentQuestions.length}`;
}

// ── Theme Switcher Logic ──
function initThemeSwitcher() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('geomusic-theme') || 'dark';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('geomusic-theme', theme);

    themeBtns.forEach(btn => {
      if (btn.dataset.themeValue === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Set initial theme
  setTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setTheme(btn.dataset.themeValue);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
});

// ── Перезаписываем exitGame — теперь скрывает и пазл-контейнер ──
window.exitGame = function () {
  clearInterval(window._pzTimer);
  window._pzTimer = null;
  // Останавливаем любое играющее аудио
  const aud = document.getElementById('melodyAudio');
  if (aud) { aud.pause(); aud.currentTime = 0; }
  document.getElementById('gamesMenuHero').style.display      = 'block';
  document.getElementById('gamesMenu').style.display          = 'grid';
  document.getElementById('activeGameContainer').style.display = 'none';
  document.getElementById('puzzleGameContainer').style.display = 'none';
};

// ════════════════════════════════════════════════════════════════
//  ИГРА 3 — УГАДАЙ МЕЛОДИЮ
// ════════════════════════════════════════════════════════════════
window.startMelodyGame = function () {
  const authors  = window.GEOMUSIC?.authors || [];
  const eligible = authors.filter(a => a.works?.length);
  if (eligible.length < 4) { alert('Недостаточно треков для игры!'); return; }

  let _score = 0, _idx = 0;
  const TOTAL = 5;

  const pool = shuffle([...eligible]).slice(0, TOTAL);
  const questions = pool.map(author => {
    const work  = shuffle([...author.works])[0];
    const wrong = shuffle(eligible.filter(a => a.id !== author.id)).slice(0, 3);
    return {
      audio:         work.audio,
      trackTitle:    work.title,
      correctAnswer: author.name,
      authorPhoto:   author.photo,
      authorBio:     author.bio || '',
      options:       shuffle([author.name, ...wrong.map(a => a.name)])
    };
  });

  document.getElementById('gamesMenuHero').style.display       = 'none';
  document.getElementById('gamesMenu').style.display           = 'none';
  document.getElementById('activeGameContainer').style.display  = 'block';
  document.getElementById('puzzleGameContainer').style.display  = 'none';

  function render(i) {
    const c = document.getElementById('activeGameContainer');
    if (i >= TOTAL) { showResult(c); return; }
    const q = questions[i];
    c.innerHTML = `
      <div class="game-header">
        <h2 class="melody-title">🎵 Угадай мелодию</h2>
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="game-score">⭐ ${_score}&thinsp;/&thinsp;${TOTAL}</span>
          <button class="mg-exit-btn" onclick="exitGame()">✕</button>
        </div>
      </div>

      <div class="melody-body">
        <div class="melody-step-bar">
          ${Array.from({length:TOTAL},(_,k)=>`<div class="melody-step ${k<i?'done':k===i?'current':''}"></div>`).join('')}
        </div>

        <div class="melody-player-box">
          <div class="melody-vinyl-wrap">
            <div class="melody-vinyl" id="melodyVinyl">
              <div class="melody-vinyl-label">🎵</div>
            </div>
            <div class="melody-eq" id="melodyEQ">
              ${Array.from({length:12},()=>`<span class="eq-bar"></span>`).join('')}
            </div>
          </div>
          <audio id="melodyAudio" controls preload="auto">
            <source src="${q.audio}" type="audio/mpeg">
          </audio>
          <div class="melody-track-badge hidden" id="melodyBadge">
            🎼 ${q.trackTitle}
          </div>
        </div>

        <p class="melody-question-label">Кому принадлежит эта мелодия?</p>

        <div class="game-options" id="melodyOpts">
          ${q.options.map(opt => `
            <button class="game-option-btn"
              onclick="_melodyCheck(this,'${opt.replace(/'/g,"\'")}')"
              data-answer="${opt.replace(/"/g,'&quot;')}">
              ${opt}
            </button>`).join('')}
        </div>

        <div class="melody-reveal hidden" id="melodyReveal"></div>
      </div>`;

    const audio = document.getElementById('melodyAudio');
    const vinyl = document.getElementById('melodyVinyl');
    const eq    = document.getElementById('melodyEQ');
    if (audio) {
      audio.addEventListener('play',  () => { vinyl?.classList.add('spinning'); eq?.classList.add('active'); });
      audio.addEventListener('pause', () => { vinyl?.classList.remove('spinning'); eq?.classList.remove('active'); });
      audio.addEventListener('ended', () => { vinyl?.classList.remove('spinning'); eq?.classList.remove('active'); });
    }

    window._melodyCheck = function (btn, answer) {
      const correct = answer === q.correctAnswer;
      if (correct) _score++;

      document.querySelectorAll('#melodyOpts .game-option-btn').forEach(b => {
        b.disabled = true;
        if (b.dataset.answer === q.correctAnswer) b.classList.add('correct');
      });
      if (!correct) btn.classList.add('wrong');

      // Пауза и раскрытие
      if (audio) audio.pause();
      document.getElementById('melodyBadge')?.classList.remove('hidden');
      document.getElementById('melodyVinyl')?.classList.remove('spinning');
      document.getElementById('melodyEQ')?.classList.remove('active');

      const rev = document.getElementById('melodyReveal');
      if (rev) {
        rev.classList.remove('hidden');
        rev.innerHTML = `
          <img src="${q.authorPhoto}" alt="" onerror="this.style.display='none'">
          <div>
            <strong>${q.correctAnswer}</strong>
            <p>${q.authorBio.slice(0,120)}…</p>
          </div>`;
      }
      document.querySelector('#activeGameContainer .game-score').textContent =
        `⭐ ${_score}\u2009/\u2009${TOTAL}`;
      setTimeout(() => render(i + 1), 2800);
    };
  }

  function showResult(c) {
    const pct    = Math.round(_score / TOTAL * 100);
    const medal  = pct >= 80 ? '🏆' : pct >= 60 ? '🥈' : pct >= 40 ? '🥉' : '🎵';
    const phrase = pct >= 80 ? 'Великолепный музыкальный слух!'
                 : pct >= 60 ? 'Хорошее знание казахской музыки!'
                 : pct >= 40 ? 'Слушайте больше кюев и песен!'
                 : 'Изучите историю казахской музыки глубже!';
    c.innerHTML = `
      <div class="game-result">
        <div class="result-big-icon">${medal}</div>
        <h2 style="font-family:var(--font-head);color:var(--gold);font-size:1.9rem;margin-bottom:8px;">Игра завершена!</h2>
        <p style="color:var(--text-muted);margin-bottom:24px;">${phrase}</p>
        <div class="result-score-display">${_score}<span>/${TOTAL}</span></div>
        <div class="result-pct">${pct}% правильных ответов</div>
        <div class="result-btns">
          <button class="play-btn" onclick="window.startMelodyGame()">🔄 Ещё раз</button>
          <button class="play-btn ghost-btn" onclick="exitGame()">← Все игры</button>
        </div>
      </div>`;
  }

  render(0);
};

// ════════════════════════════════════════════════════════════════
//  ИГРА 4 — ПАЗЛ: СОБЕРИ ПОРТРЕТ АВТОРА
// ════════════════════════════════════════════════════════════════
const _pz = {
  tiles: [], empty: -1, moves: 0, secs: 0,
  size: 3, author: null, done: false, hintUsed: false
};

window.startPuzzleGame = function () {
  const authors = window.GEOMUSIC?.authors || [];
  if (!authors.length) { alert('Нет данных об авторах!'); return; }

  clearInterval(window._pzTimer);
  _pz.size     = 3;
  _pz.selIdx   = 0;
  _pz.hintUsed = false;

  document.getElementById('gamesMenuHero').style.display       = 'none';
  document.getElementById('gamesMenu').style.display           = 'none';
  document.getElementById('activeGameContainer').style.display  = 'none';
  document.getElementById('puzzleGameContainer').style.display  = 'block';

  const el = document.getElementById('puzzleGameContainer');
  el.innerHTML = `
    <div class="pz-setup">
      <div class="game-header" style="margin-bottom:20px;">
        <h2 style="font-family:var(--font-head);color:var(--gold);">🧩 Пазл — Портрет автора</h2>
        <button class="mg-exit-btn" onclick="exitGame()">✕</button>
      </div>

      <p style="color:var(--text-muted);text-align:center;margin-bottom:16px;">Выберите портрет для сборки:</p>
      <div class="pz-author-grid" id="pzAuthorGrid">
        ${authors.map((a,i)=>`
          <div class="pz-author-chip ${i===0?'selected':''}" data-i="${i}"
               onclick="_pzPick(${i},this)">
            <img src="${a.photo}" alt="${a.name}" onerror="this.src='https://placehold.co/52'">
            <span>${a.name}</span>
          </div>`).join('')}
      </div>

      <div class="pz-diff-wrap">
        <p style="color:var(--text-muted);margin-bottom:12px;text-align:center;">Сложность:</p>
        <div class="pz-diff-row">
          <button class="pz-diff-btn active" data-s="3" onclick="_pzDiff(3,this)">3×3<br><small>Лёгкий</small></button>
          <button class="pz-diff-btn" data-s="4" onclick="_pzDiff(4,this)">4×4<br><small>Средний</small></button>
          <button class="pz-diff-btn" data-s="5" onclick="_pzDiff(5,this)">5×5<br><small>Эксперт</small></button>
        </div>
      </div>
      <div style="text-align:center;margin-top:24px;">
        <button class="play-btn pz-start-btn" onclick="_pzBegin()">🧩 Начать сборку!</button>
      </div>
    </div>`;
};

window._pzPick = function (i, el) {
  _pz.selIdx = i;
  document.querySelectorAll('.pz-author-chip').forEach((c,j)=>c.classList.toggle('selected',j===i));
};
window._pzDiff = function (s, btn) {
  _pz.size = s;
  document.querySelectorAll('.pz-diff-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
};

window._pzBegin = function () {
  const authors = window.GEOMUSIC?.authors || [];
  const author  = authors[_pz.selIdx || 0];
  const size    = _pz.size;
  const total   = size * size;

  Object.assign(_pz, { author, moves:0, secs:0, done:false, hintUsed:false, empty:total-1 });
  _pz.tiles = Array.from({length:total},(_,i)=>i);

  // Перемешать по допустимым ходам — гарантирует разрешимость
  for (let i = 0; i < 500; i++) {
    const nb = _pzNb(_pz.empty, size);
    const r  = nb[Math.floor(Math.random()*nb.length)];
    [_pz.tiles[_pz.empty], _pz.tiles[r]] = [_pz.tiles[r], _pz.tiles[_pz.empty]];
    _pz.empty = r;
  }

  clearInterval(window._pzTimer);
  window._pzTimer = setInterval(()=>{
    if(_pz.done) return;
    _pz.secs++;
    const el = document.getElementById('pzTimer');
    if(el) el.textContent = _fmtT(_pz.secs);
  }, 1000);

  _pzDraw();
};

function _pzNb(idx, sz) {
  const r=Math.floor(idx/sz), c=idx%sz, nb=[];
  if(r>0)    nb.push(idx-sz);
  if(r<sz-1) nb.push(idx+sz);
  if(c>0)    nb.push(idx-1);
  if(c<sz-1) nb.push(idx+1);
  return nb;
}
function _fmtT(s){return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function _pzProg(){
  const ok=_pz.tiles.filter((t,i)=>t===i).length;
  return Math.round(ok/_pz.tiles.length*100);
}

function _pzDraw() {
  const {author, tiles, size, moves, secs} = _pz;
  const total = size * size;
  const tilesHTML = tiles.map((tile,idx)=>{
    if (tile === total-1)
      return `<div class="pz-tile pz-empty" data-i="${idx}"></div>`;
    const tr=Math.floor(tile/size), tc=tile%size;
    const bx=size>1?tc*100/(size-1):0;
    const by=size>1?tr*100/(size-1):0;
    const ok=tile===idx?'pz-correct':'';
    return `<div class="pz-tile ${ok}" data-i="${idx}"
      style="background-image:url('${author.photo}');background-size:${size*100}%;background-position:${bx}% ${by}%;"
      onclick="window._pzTap(${idx})">
      <span class="pz-num">${tile+1}</span>
    </div>`;
  }).join('');

  const el = document.getElementById('puzzleGameContainer');
  el.innerHTML = `
    <div class="pz-board">
      <div class="game-header">
        <div>
          <h2 style="font-family:var(--font-head);color:var(--gold);font-size:1.15rem;">${author.name}</h2>
          <span style="color:var(--text-muted);font-size:.75rem;">${author.years||''}</span>
        </div>
        <button class="mg-exit-btn" onclick="exitGame()">✕</button>
      </div>

      <div class="pz-stats-row">
        <div class="pz-stat"><span id="pzMoves">${moves}</span><small>ходов</small></div>
        <div class="pz-stat"><span id="pzTimer">${_fmtT(secs)}</span><small>время</small></div>
        <div class="pz-stat"><span>${size}×${size}</span><small>сетка</small></div>
      </div>

      <div class="pz-progress-wrap">
        <div class="pz-progress-fill" id="pzFill" style="width:${_pzProg()}%"></div>
      </div>

      <div class="pz-layout">
        <div class="pz-grid-wrap">
          <div class="pz-grid" id="pzGrid" style="grid-template-columns:repeat(${size},1fr);">
            ${tilesHTML}
          </div>
        </div>
        <div class="pz-sidebar">
          <p style="color:var(--text-muted);font-size:.78rem;margin-bottom:8px;text-align:center;">Образец:</p>
          <img src="${author.photo}" class="pz-preview" alt="${author.name}"
               onerror="this.src='https://placehold.co/160x160'">
          <p style="color:var(--text-muted);font-size:.75rem;line-height:1.55;margin:10px 0;text-align:center;">
            ${author.bio?.slice(0,100)||''}…
          </p>
          <div class="pz-side-btns">
            <button class="pz-sbtn" onclick="window._pzBegin()">🔄 Перемешать</button>
            <button class="pz-sbtn ghost" onclick="window.startPuzzleGame()">👤 Другой автор</button>
            <button class="pz-sbtn ghost" id="pzHintBtn" onclick="window._pzHint()">💡 Подсказка (3с)</button>
          </div>
        </div>
      </div>
    </div>`;

  // Touch-события для мобильных
  const grid = document.getElementById('pzGrid');
  if (grid) {
    let tx, ty;
    grid.addEventListener('touchstart', e=>{const t=e.touches[0];tx=t.clientX;ty=t.clientY;},{passive:true});
    grid.addEventListener('touchend', e=>{
      const t=e.changedTouches[0];
      if(Math.abs(t.clientX-tx)<30&&Math.abs(t.clientY-ty)<30){
        const tile=e.target.closest('.pz-tile');
        if(tile) window._pzTap(parseInt(tile.dataset.i));
      }
    },{passive:true});
  }
}

window._pzTap = function (idx) {
  if (_pz.done) return;
  if (!_pzNb(_pz.empty, _pz.size).includes(idx)) {
    // Анимация «нельзя»
    const t = document.querySelector(`[data-i="${idx}"].pz-tile`);
    if(t){t.classList.add('pz-shake');setTimeout(()=>t.classList.remove('pz-shake'),320);}
    return;
  }
  [_pz.tiles[_pz.empty],_pz.tiles[idx]] = [_pz.tiles[idx],_pz.tiles[_pz.empty]];
  _pz.empty = idx;
  _pz.moves++;

  const movesEl = document.getElementById('pzMoves');
  if(movesEl) movesEl.textContent = _pz.moves;
  const fill = document.getElementById('pzFill');
  if(fill) fill.style.width = _pzProg() + '%';

  _pzRefresh();
  if (_pz.tiles.every((t,i)=>t===i)) {
    _pz.done = true;
    clearInterval(window._pzTimer);
    window._pzTimer = null;
    setTimeout(_pzWin, 700);
  }
};

function _pzRefresh() {
  const grid = document.getElementById('pzGrid');
  if(!grid) return;
  const {tiles,size,author,empty} = _pz;
  const total = size*size;
  grid.querySelectorAll('.pz-tile').forEach((el,idx)=>{
    el.className = 'pz-tile';
    el.onclick   = null;
    el.style.backgroundImage = '';
    el.innerHTML = '';
    const tile = tiles[idx];
    if(tile === total-1){
      el.classList.add('pz-empty');
    } else {
      const tr=Math.floor(tile/size),tc=tile%size;
      const bx=size>1?tc*100/(size-1):0;
      const by=size>1?tr*100/(size-1):0;
      if(tile===idx) el.classList.add('pz-correct');
      el.style.backgroundImage    = `url('${author.photo}')`;
      el.style.backgroundSize     = `${size*100}%`;
      el.style.backgroundPosition = `${bx}% ${by}%`;
      el.innerHTML = `<span class="pz-num">${tile+1}</span>`;
      el.onclick   = ()=>window._pzTap(idx);
    }
  });
}

window._pzHint = function () {
  const btn = document.getElementById('pzHintBtn');
  if(_pz.hintUsed){ return; }
  _pz.hintUsed = true;
  if(btn){ btn.disabled=true; btn.textContent='💡 (использована)'; }

  const grid = document.getElementById('pzGrid');
  if(!grid) return;

  const ov = document.createElement('div');
  ov.className = 'pz-hint-ov';
  ov.innerHTML = `<img src="${_pz.author.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">`;
  grid.style.position='relative';
  grid.appendChild(ov);
  setTimeout(()=>{ ov.style.opacity='0'; setTimeout(()=>ov.remove(),500); }, 3000);
};

function _pzWin() {
  const {author, moves, secs, size} = _pz;
  const rating = moves <= size*15 ? '⭐⭐⭐' : moves <= size*40 ? '⭐⭐' : '⭐';
  document.getElementById('puzzleGameContainer').innerHTML = `
    <div class="pz-win">
      <div class="pz-confetti">🎉🎊✨🏆✨🎊🎉</div>
      <h2 style="font-family:var(--font-head);color:var(--gold);font-size:2rem;margin-bottom:8px;">Пазл собран!</h2>
      <p style="color:var(--text-muted);margin-bottom:16px;">
        Портрет <strong style="color:var(--gold)">${author.name}</strong> восстановлен!
      </p>
      <div class="pz-win-portrait">
        <img src="${author.photo}" alt="${author.name}" onerror="this.src='https://placehold.co/200'">
      </div>
      <div class="pz-win-rating">${rating}</div>
      <div class="pz-win-stats">
        <div class="pz-win-stat"><b>${moves}</b><span>ходов</span></div>
        <div class="pz-win-stat"><b>${_fmtT(secs)}</b><span>время</span></div>
        <div class="pz-win-stat"><b>${size}×${size}</b><span>сетка</span></div>
      </div>
      <p style="color:var(--text-muted);font-size:.85rem;max-width:380px;margin:0 auto 24px;line-height:1.65;">
        ${author.bio?.slice(0,180)||''}…
      </p>
      <div class="result-btns">
        <button class="play-btn" onclick="window.startPuzzleGame()">🧩 Новый пазл</button>
        <button class="play-btn ghost-btn" onclick="exitGame()">← Все игры</button>
      </div>
    </div>`;
}