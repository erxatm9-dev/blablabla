// data.js — база данных авторов и регионов
window.GEOMUSIC = {
  
  // Ключи регионов 100% совпадают с id в твоем kazakhstan.svg
  regions: {
    'KZ27': 'Западно-Казахстанская область',
    'KZ23': 'Атырауская область',
    'KZ47': 'Мангистауская область',
    'KZ15': 'Актюбинская область',
    'KZ39': 'Костанайская область',
    'KZ59': 'Северо-Казахстанская область',
    'KZ11': 'Акмолинская область',
    'KZ55': 'Павлодарская область',
    'KZ35': 'Карагандинская область',
    'KZ63': 'Восточно-Казахстанская область',
    'KZ43': 'Кызылординская область',
    'KZ61': 'Туркестанская область',
    'KZ31': 'Жамбылская область',
    'KZ19': 'Алматинская область',
    'KZ10': 'Область Абай',
    'KZ33': 'Область Жетісу',
    'KZ62': 'Область Ұлытау'
  },

  regionAliases: {
    'KZ-ZAP': 'KZ27',
    'KZ-ATY': 'KZ23',
    'KZ-MAN': 'KZ47',
    'KZ-AKT': 'KZ15',
    'KZ-KUS': 'KZ39',
    'KZ-SEV': 'KZ59',
    'KZ-AKM': 'KZ11',
    'KZ-PAV': 'KZ55',
    'KZ-KAR': 'KZ35',
    'KZ-VOS': 'KZ63',
    'KZ-KZY': 'KZ43',
    'KZ-YUZ': 'KZ61',
    'KZ-ZHA': 'KZ31',
    'KZ-ALM': 'KZ19',
    'KZ-ABA': 'KZ10',
    'KZ-ZHE': 'KZ33',
    'KZ-ULY': 'KZ62'
  },

  authors: [
    // ═══ АЛМАТИНСКАЯ ОБЛАСТЬ ═══
    {
      id: 'tlendiev',
      name: 'Нургиса Тлендиев',
      years: '1925–1998',
      regions: ['KZ-ALM'],
      photo: 'https://upload.wikimedia.org/wikipedia/ru/8/87/Nurgisa_Tlendiev.jpg',
      bio: 'Выдающийся композитор, дирижёр и домбрист. Основатель оркестра «Отырар сазы». Автор знаменитых кюев «Аққу», «Жерұйық», а также музыки к фильмам. Народный артист СССР.',
      works: [
        { title: 'Кюй «Аққу»',   audio: 'audio/tlendiev-akku.mp3' },
        { title: 'Кюй «Отырар»', audio: 'audio/tlendiev-otyrar.mp3' }
      ]
    },
    {
      id: 'brusilovsky',
      name: 'Евгений Брусиловский',
      years: '1905–1981',
      regions: ['KZ-ALM'],
      photo: 'https://upload.wikimedia.org/wikipedia/ru/b/b0/BrusilowskiyEG.jpg',
      bio: 'Основоположник казахской профессиональной оперы. Создал первые казахские оперы «Қыз Жібек», «Жалбыр», «Ер Тарғын». Народный артист Казахской ССР.',
      works: [
        { title: 'Опера «Қыз Жібек» (фрагмент)', audio: 'audio/brusilovsky-kyzhibek.mp3' }
      ]
    },

    // ═══ АКТЮБИНСКАЯ ОБЛАСТЬ ═══
    {
      id: 'zhubanova',
      name: 'Газиза Жубанова',
      years: '1927–1993',
      regions: ['KZ-AKT', 'KZ-ALM'],
      photo: 'https://upload.wikimedia.org/wikipedia/ru/f/f6/Zhubanova_Gaziza.jpg',
      bio: 'Первая женщина-композитор Казахстана. Автор опер, балетов и симфоний. Ректор Алма-Атинской консерватории. Народная артистка СССР.',
      works: [
        { title: 'Симфоническая поэма «Жыр-Дастан»', audio: 'audio/zhubanova-zhyrdastan.mp3' }
      ]
    },

    // ═══ ТУРКЕСТАНСКАЯ ОБЛАСТЬ ═══
    {
      id: 'kaldyakov',
      name: 'Шамши Калдаяков',
      years: '1930–1992',
      regions: ['KZ-YUZ'],
      photo: 'https://upload.wikimedia.org/wikipedia/ru/3/36/Shamshi_Kaldayakov.jpg',
      bio: '«Король казахского вальса». Автор текста и музыки государственного гимна Казахстана «Менің Қазақстаным». Написал более 300 песен.',
      works: [
        { title: 'Менің Қазақстаным', audio: 'audio/kaldyakov-anthem.mp3' },
        { title: 'Дудар-ай',          audio: 'audio/kaldyakov-dudar.mp3' }
      ]
    },

    // ═══ ВОСТОЧНО-КАЗАХСТАНСКАЯ ОБЛАСТЬ ═══
    {
      id: 'rakhmadiyev',
      name: 'Еркегали Рахмадиев',
      years: '1932–2013',
      regions: ['KZ-VOS', 'KZ-ALM'],
      photo: 'https://upload.wikimedia.org/wikipedia/ru/7/74/Rakhmadiev_Yerkegali.jpg',
      bio: 'Народный артист СССР. Автор опер «Камар-сулу», «Алпамыс», «Абылай хан». Министр культуры Республики Казахстан в 1990–1993 гг.',
      works: [
        { title: 'Кюй «Кудаша думан»', audio: 'audio/rakhmadiyev-kudasha.mp3' }
      ]
    },
    {
      id: 'abay',
      name: 'Абай Кунанбаев',
      years: '1845–1904',
      regions: ['KZ-VOS'],
      photo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Abai_Kunanbaev.jpg',
      bio: 'Великий казахский мыслитель, поэт и композитор. Абай создал множество лирических песен, ставших поистине народными.',
      works: [
        { title: 'Көзімнің қарасы', audio: 'audio/abay-kozimnin.mp3' },
        { title: 'Айттым сәлем, Қаламқас', audio: 'audio/abay-aittym.mp3' }
      ]
    },

    // ═══ КАРАГАНДИНСКАЯ ОБЛАСТЬ ═══
    {
      id: 'mukhamedzhanov',
      name: 'Сыдык Мухамеджанов',
      years: '1924–1984',
      regions: ['KZ-KAR', 'KZ-ALM'],
      photo: 'https://upload.wikimedia.org/wikipedia/ru/2/2a/Mukhamedzhanov_Sydyk.jpg',
      bio: 'Композитор, родом из Шетского района. Автор опер «Айсулу», «Назугум» и симфонических произведений. Народный артист Казахской ССР.',
      works: [
        { title: 'Песня «Шаттық отаны»', audio: 'audio/mukhamedzhanov-shattyq.mp3' }
      ]
    },
    {
      id: 'tattimbet',
      name: 'Таттимбет Казангапулы',
      years: '1815–1862',
      regions: ['KZ-KAR'],
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Dina_Nurpeisova_Kz.jpg/400px-Dina_Nurpeisova_Kz.jpg', 
      bio: 'Великий казахский композитор-кюйши, один из основателей школы кюев в стиле «шертпе». Его лирические произведения стали классикой.',
      works: [
        { title: 'Кюй «Саржайлау»', audio: 'audio/tattimbet-sarzhailau.mp3' }
      ]
    },

    // ═══ ЗАПАДНО-КАЗАХСТАНСКАЯ И АТЫРАУСКАЯ ОБЛАСТИ ═══
    {
      id: 'kurmangazy',
      name: 'Курмангазы Сагырбайулы',
      years: '1823–1896',
      regions: ['KZ-ZAP', 'KZ-ATY'],
      photo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Kurmangazy_Sagyrbaev_Kz.jpg',
      bio: 'Великий композитор-кюйши, классик казахской инструментальной музыки. Вершина его творчества — кюй «Сары-Арка», отражающий дух свободы.',
      works: [
        { title: 'Кюй «Сары-Арка»', audio: 'audio/kurmangazy-saryarka.mp3' },
        { title: 'Кюй «Адай»', audio: 'audio/kurmangazy-aday.mp3' }
      ]
    },
    {
      id: 'nurpeisova',
      name: 'Дина Нурпеисова',
      years: '1861–1955',
      regions: ['KZ-ZAP', 'KZ-ATY'],
      photo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Dina_Nurpeisova_Kz.jpg',
      bio: 'Легендарная домбристка, ученица и последовательница великого Курмангазы. Сохранила и передала традиции западно-казахстанской домбровой школы.',
      works: [
        { title: 'Кюй «1916-шы жыл»', audio: 'audio/nurpeisova-1916.mp3' }
      ]
    },

    // ═══ ЖАМБЫЛСКАЯ ОБЛАСТЬ ═══
    {
      id: 'azerbayev',
      name: 'Кенен Азербаев',
      years: '1884–1976',
      regions: ['KZ-ZHA', 'KZ-ALM'],
      photo: 'https://upload.wikimedia.org/wikipedia/ru/a/a3/Kenen_Azerbaev.jpg',
      bio: 'Великий акын и жыршы. Более полувека хранил и передавал традиции казахского устного народного творчества. Народный артист Казахской ССР.',
      works: [
        { title: 'Ән «Бозторғай»', audio: 'audio/azerbayev-boztorgay.mp3' }
      ]
    },

    // ═══ АКМОЛИНСКАЯ И СЕВЕРО-КАЗАХСТАНСКАЯ ОБЛАСТИ ═══
    {
      id: 'akan_sere',
      name: 'Акан Серэ Корамсаулы',
      years: '1843–1913',
      regions: ['KZ-SEV'],
      photo: 'https://avatars.mds.yandex.net/i?id=bdf611cdaa6ce24be3d62836de6ada92_l-9181286-images-thumbs&n=13',
      bio: 'Выдающийся казахский акын, певец и композитор. В его творчестве глубоко отражены любовь к родине, свобода и переживания о трагичной судьбе.',
      works: [
        { title: 'Песня «Маңмаңгер»', audio: 'audio/akan-manmanger.mp3' }
      ]
    },
    {
      id: 'baluan_sholak',
      name: 'Балуан Шолак',
      years: '1864–1919',
      regions: ['KZ-AKM'],
      photo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Baluan_Sholak.jpg',
      bio: 'Прославленный казахский борец, композитор и акын. Настоящее имя — Нурмагамбет Баймырзаулы. Его песни отличались невероятной силой и лиризмом.',
      works: [
        { title: 'Песня «Ғалия»', audio: 'audio/baluan-galiya.mp3' }
      ]
    },

    // ═══ ПАВЛОДАРСКАЯ ОБЛАСТЬ ═══
    {
      id: 'estay',
      name: 'Естай Беркимбаев',
      years: '1868–1946',
      regions: ['KZ-PAV'],
      photo: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Estay_Berkimbayev.jpg',
      bio: 'Выдающийся казахский певец и композитор. Автор шедевра казахской лирики — песни «Қорлан», которая обессмертила его имя.',
      works: [
        { title: 'Песня «Қорлан»', audio: 'audio/estai-korlan.mp3' }
      ]
    },

    // ═══ КОСТАНАЙСКАЯ ОБЛАСТЬ ═══
    {
      id: 'baikadamov',
      name: 'Бахытжан Байкадамов',
      years: '1917–1977',
      regions: ['KZ-KUS', 'KZ-ALM'],
      photo: 'https://upload.wikimedia.org/wikipedia/ru/c/c5/Bakhytzhan_Baikadamov.jpg',
      bio: 'Родился в Торгае. Выдающийся композитор, основатель профессиональной хоровой музыки в Казахстане. Заслуженный деятель искусств Казахской ССР.',
      works: [
        { title: 'Хор «Су тасушы»', audio: 'audio/baikadamov-su.mp3' }
      ]
    },

    // ═══ КЫЗЫЛОРДИНСКАЯ ОБЛАСТЬ ═══
    {
      id: 'korkyt',
      name: 'Коркыт Ата',
      years: 'IX век',
      regions: ['KZ-KZY'],
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Qorqyt_Ata.jpg/400px-Qorqyt_Ata.jpg',
      bio: 'Легендарный тюркский акын, сказитель, создатель кобыза. Жил в степях вдоль реки Сырдарья. Основатель традиции исполнения кюев на кобызе.',
      works: [
        { title: 'Кюй «Қоңыр»', audio: 'audio/korkyt-konyr.mp3' }
      ]
    },

    // ═══ МАНГИСТАУСКАЯ ОБЛАСТЬ ═══
    {
      id: 'abyl',
      name: 'Абыл Таракулы',
      years: '1777–1864',
      regions: ['KZ-MAN'],
      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Dombra_player.jpg/400px-Dombra_player.jpg',
      bio: 'Выдающийся кюйши, один из виднейших представителей самобытной мангистауской домбровой школы. Автор знаменитых кюев «Нарату» и «Абыл».',
      works: [
        { title: 'Кюй «Нарату»', audio: 'audio/abyl-naratu.mp3' }
      ]
    }
  ]
};


// Автоматическая конвертация старых ID регионов авторов в новые ID SVG карты
window.GEOMUSIC.authors = window.GEOMUSIC.authors.map(author => ({
  ...author,
  regions: (author.regions || []).map(id => window.GEOMUSIC.regionAliases[id] || id)
}));
