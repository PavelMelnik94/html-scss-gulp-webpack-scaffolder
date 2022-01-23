//Получение/установка стилей элемента
export const getStyle = (el, prop) => getComputedStyle(el)[prop];
export const setStyle = (el, prop, val) => (el.style[prop] = val);

// Добавление стилей в виде объекта
export const setStyles = (el, styleObj) => {
  Object.assign(el.style, styleObj);
};

//Получение элементов по селектору
export const getOne = (selector, parent = document) =>
  parent.querySelector(selector);

export const getAll = (selector, parent = document) => [
  ...el.querySelectorAll(selector)
];

//  Скрытие/отображение элементов
export const hide = (val) => {
  const arr = typeof val === 'string' ? getAll(val) : [...val];
  arr.forEach((i) => {
    i.style.display = 'none';
  });
};

export const show = (val) => {
  const arr = typeof val === 'string' ? getAll(val) : [...val];
  arr.forEach((i) => {
    i.style.display = '';
  });
};

// Определение наличия, добавление/удаление класса
export const hasClass = (el, str, part = false) =>
  !part ? el.classList.contains(str) : el.className.includes(str);

export const addClass = (el, str, part = false) =>
  !part ? (el.className = str) : el.classList.add(str);

export const removeClass = (el, str, part = false) =>
  !part ? (el.className = '') : el.classList.remove(str);

// Запуск функции при клике за пределами/внутри элемента
export const onClickOutside = (el, cb) => {
  document.addEventListener('click', ({ target }) => {
    if (!el.contains(target)) cb();
  });
};

export const onClickInside = (el, cb) => {
  document.addEventListener('click', ({ target }) => {
    if (el.contains(target)) cb();
  });
};

//==================

//Находится ли элемент в области просмотра?
export const isVisible = (el, part = false) => {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;

  return part
    ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

//Определение величины прокрутки
export const getScrollPosition = (el = window) => ({
  x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
  y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
});

//обрезать первый символ и сделать с большой буквы
export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

//Создание элемента с помощью шаблонных литералов
export const createElFromStr = (str) => {
  const el = document.createElement('div');
  el.innerHTML = str;
  const child = el.fisrtElementChild;
  el.remove();
  return child;
};

// FORM
//"Сериализация" формы - преобразование данных формы в строку
export const serializeForm = (form) =>
  Array.from(new FormData(form), (field) =>
    field.map(encodeURIComponent).join('=')
  ).join('&');

// Преобразование данных формы в объект
export const convertFormToObj = (form) =>
  Array.from(new FormData(form)).reduce(
    (acc, [key, val]) => ({
      ...acc,
      [key]: val
    }),
    {}
  );
{
  /* <form id="form">
  <div>
    <label for="name">Name</label>
    <input type="text" id="name" name="name" value="John" />
  </div>
  <div>
    <label for="age">Age</label>
    <input type="number" id="age" name="age" value="24" />
  </div>
  <button>Send</button>
</form>
form.onsubmit = (e) => {
  e.preventDefault()

  const strData = serializeForm(form)
  const objData = convertFormToObj(form)

  console.log(strData) // name=John&age=24
  console.log(objData) // {name: 'John', age: '24'}
} */
}

//OBSERVER
//Наблюдение за изменениями, происходящими в элементе
export const observeMutations = (el, cb, opt) => {
  const O = new MutationObserver((ms) => ms.forEach((m) => cb(m)));

  O.observe(
    el,
    Object.assign(
      {
        childList: true,
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true,
        subtree: true
      },
      opt
    )
  );

  return O;
};

// observeMutations(document, console.log)

//==================
//OTHER

//Получение базового URL
export const getBaseURL = (url) => url.replace(/[?#].+/, '');

// getBaseURL('http://example.com?name=John#anchor')
// http://example.com

//Перенаправление с HTTP на HTTPS
export const redirect = () => {
  if (window.location.protocol !== 'https:')
    window.location.replace('https://' + window.location.href.split('//')[1]);
};

//Получение параметров строки запроса
export const searchParams = Object.fromEntries(
  new URLSearchParams(window.location.search).entries()
);

// ?name=John&age=24
// console.log(searchParams)
// {name: 'John', age: '24'}

//Получение случайного HEX и RGBA цветов
export const getRandomHexColor = () =>
  `#${((Math.random() * 0xffffff) << 0).toString(16)}`;

// 2
export const getRandomRGBAColor = (opacity) => {
  const random = () => ~~(Math.random() * 255);
  return `rgba(${random()}, ${random()}, ${random()}, ${opacity})`;
};
//Преобразование RGB в HEX
export const RGBToHex = (r, g, b) =>
  `#${((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')}`;

// RGBToHex(255, 165, 1) // '#ffa501'

//==================
// ID

//Генерация уникального ID
const getRandomStr = (length) =>
  Math.random().toString(36).slice(2).slice(0, length);
// 10 | 11 characters

// ensuring uniqueness
const memo = (fn) => {
  const cache = new Set();

  return function inner() {
    let res = fn();

    if (!isNaN(res[0])) {
      res = 'x' + res.slice(1);
    }

    if (cache.has(res)) {
      return inner();
    } else {
      cache.add(res);
      return res;
    }
  };
};

export const getUniqueID = memo(getRandomStr);
// const id = getUniqueID()
// console.log(id) // j34omfv6jk

//Генерация UUID
export const genUUID = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );

// genUUID() // 7982fcfe-5721-4632-bede-6000885be57d

//==================

export const debounce = (fn, ms) =>
  function (...args) {
    let prevCall = this.lastCall;
    this.lastCall = Date.now();

    if (prevCall && this.lastCall - prevCall <= ms) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => fn(...args), ms);
  };

export const throttle = (fn, ms) => {
  let id = null;
  return (...args) => {
    if (id) return;
    fn(...args);
    id = setTimeout(() => {
      clearTimeout(id);
      id = null;
    }, ms);
  };
};
