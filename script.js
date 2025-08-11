// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
// Apply top padding equal to header height to prevent content jump
const header = document.querySelector('.site-header');
function applyHeaderOffset() {
  const h = header?.offsetHeight || 0;
  document.body.style.paddingTop = h ? `${h}px` : '';
  // expose header height for CSS (mobile nav positioning)
  document.documentElement.style.setProperty('--header-h', `${h}px`);
}
// Ensure offset after fonts load and DOM ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  requestAnimationFrame(applyHeaderOffset);
} else {
  window.addEventListener('DOMContentLoaded', () => requestAnimationFrame(applyHeaderOffset));
}
window.addEventListener('load', applyHeaderOffset);
window.addEventListener('resize', applyHeaderOffset);
if (toggle) {
  toggle.addEventListener('click', () => {
    navLinks?.classList.toggle('is-open');
  });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.length > 1) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navLinks?.classList.remove('is-open');
    }
  });
});

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Parallax tilt for logo
const orbit = document.querySelector('.logo-orbit');
if (orbit) {
  orbit.addEventListener('mousemove', (e) => {
    const rect = orbit.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    orbit.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
  });
  orbit.addEventListener('mouseleave', () => {
    orbit.style.transform = 'rotateX(0) rotateY(0)';
  });
}

// Contact form (simulated by default)
const form = document.querySelector('.contact-form');
const statusEl = document.querySelector('.form-status');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = t('form.sending');

    // If form has real action, try POST; otherwise simulate success
    const hasAction = form.getAttribute('action');
    try {
      if (hasAction && !form.hasAttribute('data-simulate')) {
        const resp = await fetch(hasAction, { method: 'POST', body: new FormData(form) });
        if (!resp.ok) throw new Error('Network');
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }
      statusEl.textContent = t('form.success');
      form.reset();
    } catch (err) {
      statusEl.textContent = t('form.error');
    }
  });
}

// --- i18n ---
const dictionaries = {
  ru: {
    meta: {
      title: 'VaraTek — Строительная компания',
      description: 'Современное строительство под ключ: проектирование, строительство, инженерия и реконструкция. VaraTek — качество, сроки, прозрачность.'
    },
    nav: { services: 'Услуги', projects: 'Проекты', process: 'Процесс', about: 'О нас', contact: 'Связаться', estimate: 'Рассчитать смету' },
    hero: {
      title: 'Строим современные дома под ключ',
      subtitle: 'Проектирование, строительство и инженерные системы. Прозрачные сметы, фиксированные сроки, гарантия до 5 лет.',
      cta: { estimate: 'Получить расчет', portfolio: 'Портфолио' },
      stats: { years: 'лет на рынке', objects: 'реализованных объектов', rating: 'рейтинг клиентов' },
      badge: 'Современная архитектура'
    },
    section: { services: { title: 'Услуги' }, projects: { title: 'Проекты' }, process: { title: 'Как мы работаем' } },
    services: {
      one: { title: 'Дома под ключ', desc: 'Архитектура, конструктив, отделка. Фиксированная смета и календарный план.', li1: 'Каркасные, каменные, монолит', li2: 'Энергоэффективные решения', li3: 'Авторский надзор' },
      two: { title: 'Проектирование', desc: 'АР, КР, ИОС, BIM-моделирование. Точные спецификации и визуализация.', li1: '3D/VR презентации', li2: 'Согласования и экспертиза', li3: 'Сметы с детализацией' },
      three: { title: 'Инженерные сети', desc: 'Отопление, водоснабжение, электрика и вентиляция. Умный дом по желанию.', li1: 'Под ключ с пусконаладкой', li2: 'Сервис и гарантия', li3: 'Энергоаудит объекта' }
    },
    projects: { 1: 'Хайтек коттедж', 2: 'Минималистичный дом', 3: 'Таунхаус', 4: 'Реконструкция виллы', 5: 'Офисное пространство', 6: 'Загородный дом' },
    process: { 1: 'Бриф и выезд на участок. Понимаем задачи, снимаем ограничения.', 2: 'Концепция и смета. Прозрачная стоимость и сроки с календарным планом.', 3: 'Проектирование и экспертиза. Готовим документацию и визуализацию.', 4: 'Строительство и авторский надзор. Еженедельные отчеты, фотоконтроль.', 5: 'Сдача и гарантия. Пакет исполнительной документации и сервис.' },
    about: { title: 'VaraTek — аккуратная инженерия и архитектура', text: 'Мы соединяем минималистичную архитектуру с надежной инженерией. Работаем по договору, используем цифровой контроль качества и BIM.' },
    badges: { 1: 'Гарантия до 5 лет', 2: 'BIM-моделирование', 3: 'Фиксированные сроки', 4: 'Авторский надзор' },
    estimate: { title: 'Нужна смета? Пришлем расчет в течение 24 часов', cta: 'Оставить заявку' },
    contact: {
      title: 'Контакты',
      subtitle: 'Пишите на <a href="mailto:info@varatek.pro">info@varatek.pro</a> или заполните форму — ответим в рабочее время.',
      phoneLabel: 'Телефон:',
      addressLabel: 'Адрес:',
      hoursLabel: 'График:',
      phone: '+7 (999) 000‑00‑00',
      address: 'Москва, БЦ Пример, ул. Архитекторов, 1',
      hours: 'Пн‑Сб, 10:00–19:00'
    },
    form: {
      nameLabel: 'Имя', namePlaceholder: 'Ваше имя',
      phoneLabel: 'Телефон', phonePlaceholder: '+7 ___ ___‑__‑__',
      messageLabel: 'Сообщение', messagePlaceholder: 'Кратко опишите задачу',
      submit: 'Отправить',
      note: 'Хотите сразу обсудить? Звоните: <a href="tel:+79990000000">+7 (999) 000‑00‑00</a>',
      sending: 'Отправляем…', success: 'Готово! Мы свяжемся с вами в ближайшее время.', error: 'Ошибка отправки. Попробуйте позже или напишите на info@varatek.pro.'
    },
    footer: { rights: 'Все права защищены.' }
  },
  en: {
    meta: {
      title: 'VaraTek — Construction Company',
      description: 'Modern turnkey construction: design, build, engineering and refurbishment. VaraTek — quality, deadlines, transparency.'
    },
    nav: { services: 'Services', projects: 'Projects', process: 'Process', about: 'About', contact: 'Contact', estimate: 'Get a quote' },
    hero: {
      title: 'We build modern turnkey homes',
      subtitle: 'Design, construction, and MEP. Transparent budgets, fixed schedules, warranty up to 5 years.',
      cta: { estimate: 'Get estimate', portfolio: 'Portfolio' },
      stats: { years: 'years in business', objects: 'completed projects', rating: 'client rating' },
      badge: 'Contemporary architecture'
    },
    section: { services: { title: 'Services' }, projects: { title: 'Projects' }, process: { title: 'How we work' } },
    services: {
      one: { title: 'Turnkey houses', desc: 'Architecture, structure, finishing. Fixed budget and schedule.', li1: 'Timber, masonry, monolithic', li2: 'Energy‑efficient solutions', li3: 'Author supervision' },
      two: { title: 'Design', desc: 'AR, KR, MEP, BIM. Accurate specs and visualization.', li1: '3D/VR presentations', li2: 'Permits and expert review', li3: 'Itemized budgets' },
      three: { title: 'Engineering systems', desc: 'Heating, water, electricity, ventilation. Smart home on request.', li1: 'Turnkey with commissioning', li2: 'Service and warranty', li3: 'Energy audit' }
    },
    projects: { 1: 'High‑tech cottage', 2: 'Minimalist house', 3: 'Townhouse', 4: 'Villa renovation', 5: 'Office space', 6: 'Country house' },
    process: { 1: 'Brief and site visit. We identify goals and constraints.', 2: 'Concept and budget. Transparent pricing and timeline with schedule.', 3: 'Design and approvals. Documentation and visualization.', 4: 'Construction and author supervision. Weekly reports and photo control.', 5: 'Handover and warranty. As‑built docs and service.' },
    about: { title: 'VaraTek — precise engineering and architecture', text: 'We merge minimalist architecture with reliable engineering. Contract‑based, digital QA, and BIM.' },
    badges: { 1: 'Up to 5‑year warranty', 2: 'BIM modeling', 3: 'Fixed deadlines', 4: 'Author supervision' },
    estimate: { title: 'Need a quote? We’ll send an estimate within 24 hours', cta: 'Send request' },
    contact: { title: 'Contacts', subtitle: 'Email <a href="mailto:info.varatek@gmail.com">info.varatek@gmail.com</a> or fill the form — we reply during business hours.', phoneLabel: 'Phone:', addressLabel: 'Address:', hoursLabel: 'Hours:', phone: '+358451964604', address: 'Malagankatu 4 A 8, 00220 Helsinki', hours: 'Mon–Sat, 10:00–19:00' },
    form: { nameLabel: 'Name', namePlaceholder: 'Your name', phoneLabel: 'Phone', phonePlaceholder: '+358 ___ ___ ___', messageLabel: 'Message', messagePlaceholder: 'Briefly describe your task', submit: 'Send', note: 'Prefer a call? Phone: <a href="tel:+358451964604">+358451964604</a>', sending: 'Sending…', success: 'Done! We will contact you shortly.', error: 'Send failed. Try later or email info.varatek@gmail.com.' },
    footer: { rights: 'All rights reserved.' }
  },
  fi: {
    meta: {
      title: 'VaraTek — Rakennusyritys',
      description: 'Modernia avaimet käteen -rakentamista: suunnittelu, rakentaminen, talotekniikka ja saneeraus. VaraTek — laatu, aikataulu, läpinäkyvyys.'
    },
    nav: { services: 'Palvelut', projects: 'Projektit', process: 'Prosessi', about: 'Meistä', contact: 'Yhteys', estimate: 'Pyydä tarjous' },
    hero: {
      title: 'Rakennamme modernit avaimet käteen -kodit',
      subtitle: 'Suunnittelu, rakentaminen ja talotekniikka. Läpinäkyvät budjetit, kiinteät aikataulut, takuu jopa 5 vuotta.',
      cta: { estimate: 'Laske hinta', portfolio: 'Portfolio' },
      stats: { years: 'vuotta markkinoilla', objects: 'valmista kohdetta', rating: 'asiakasarvio' },
      badge: 'Nykyaikainen arkkitehtuuri'
    },
    section: { services: { title: 'Palvelut' }, projects: { title: 'Projektit' }, process: { title: 'Miten toimimme' } },
    services: {
      one: { title: 'Avaimet käteen -talot', desc: 'Arkkitehtuuri, runko, viimeistely. Kiinteä budjetti ja aikataulu.', li1: 'Puutalo, kivitalo, monoliitti', li2: 'Energia­tehokkaat ratkaisut', li3: 'Pääsuunnittelijan valvonta' },
      two: { title: 'Suunnittelu', desc: 'ARK, RAK, LVI/S, BIM. Tarkat spesifikaatiot ja visualisointi.', li1: '3D/VR-esitykset', li2: 'Luvat ja tarkastukset', li3: 'Eritelty kustannusarvio' },
      three: { title: 'Talotekniikka', desc: 'Lämmitys, vesi, sähkö ja ilmanvaihto. Älykoti pyynnöstä.', li1: 'Avaimet käteen käyttöönotolla', li2: 'Huolto ja takuu', li3: 'Energia-auditointi' }
    },
    projects: { 1: 'High‑tech‑mökki', 2: 'Minimalistinen talo', 3: 'Rivitalo', 4: 'Huvilan saneeraus', 5: 'Toimistotila', 6: 'Mökkitalo' },
    process: { 1: 'Aloitushaastattelu ja tonttikäynti. Määritämme tavoitteet ja rajoitteet.', 2: 'Konsepti ja kustannusarvio. Läpinäkyvä hinta ja aikataulu.', 3: 'Suunnittelu ja hyväksynnät. Dokumentaatio ja visualisointi.', 4: 'Rakentaminen ja valvonta. Viikkoraportit ja valokuvadokumentointi.', 5: 'Luovutus ja takuu. Loppudokumentit ja huolto.' },
    about: { title: 'VaraTek — täsmällinen tekniikka ja arkkitehtuuri', text: 'Yhdistämme minimalistisen arkkitehtuurin luotettavaan tekniikkaan. Sopimusperusteinen työ, digitaalinen laadunvarmistus ja BIM.' },
    badges: { 1: 'Takuu jopa 5 vuotta', 2: 'BIM-mallinnus', 3: 'Sovitut aikataulut', 4: 'Pääsuunnittelijan valvonta' },
    estimate: { title: 'Tarvitsetko tarjouksen? Saat arvion 24 tunnissa', cta: 'Jätä pyyntö' },
    contact: { title: 'Yhteystiedot', subtitle: 'Sähköposti <a href="mailto:info.varatek@gmail.com">info.varatek@gmail.com</a> tai täytä lomake — vastaamme aukioloaikoina.', phoneLabel: 'Puhelin:', addressLabel: 'Osoite:', hoursLabel: 'Aukiolo:', phone: '+358451964604', address: 'Malagankatu 4 A 8, 00220 Helsinki', hours: 'Ma–La, 10:00–19:00' },
    form: { nameLabel: 'Nimi', namePlaceholder: 'Nimesi', phoneLabel: 'Puhelin', phonePlaceholder: '+358 ___ ___ ___', messageLabel: 'Viesti', messagePlaceholder: 'Kuvaile lyhyesti', submit: 'Lähetä', note: 'Soitetaanko? Puh: <a href="tel:+358451964604">+358451964604</a>', sending: 'Lähetetään…', success: 'Valmis! Otamme sinuun pian yhteyttä.', error: 'Lähetys epäonnistui. Yritä myöhemmin tai kirjoita info.varatek@gmail.com.' },
    footer: { rights: 'Kaikki oikeudet pidätetään.' }
  }
};

// No admin/CMS merge in this build

// Default to EN; RU removed from options
const defaultLang = (localStorage.getItem('lang') || 'en').toLowerCase();
let currentLang = ['en', 'fi'].includes(defaultLang) ? defaultLang : 'en';

function t(key) {
  const parts = key.split('.');
  let node = dictionaries[currentLang];
  for (const p of parts) node = node?.[p];
  return node ?? key;
}

function applyTranslations() {
  // Update lang attr
  document.documentElement.setAttribute('lang', currentLang);
  // Meta
  document.title = t('meta.title');
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', t('meta.description'));
  // Text nodes
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  // Elements with HTML content
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const value = t(el.getAttribute('data-i18n-placeholder'));
    el.setAttribute('placeholder', value);
  });
  // data-title in projects grid
  document.querySelectorAll('[data-i18n-dataset-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-dataset-title');
    el.setAttribute('data-title', t(key));
  });
  // Language switch UI state
  document.querySelectorAll('.lang-switch button').forEach((b) => {
    b.classList.toggle('is-active', b.getAttribute('data-lang') === currentLang);
  });
}

// Init and events
applyTranslations();
document.querySelectorAll('.lang-switch button').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentLang = btn.getAttribute('data-lang');
    localStorage.setItem('lang', currentLang);
    applyTranslations();
  });
});

// Animated counters when visible
const counters = document.querySelectorAll('[data-count]');
const cntObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.getAttribute('data-count')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const start = performance.now();
    const duration = 1100;
    function step(now) {
      const p = Math.min(1, (now - start) / duration);
      const val = target % 1 ? (target * p).toFixed(1) : Math.floor(target * p);
      el.textContent = `${val}${suffix}`;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    cntObs.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach((c) => cntObs.observe(c));


