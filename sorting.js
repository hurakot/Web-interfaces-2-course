let dishes = [];//Содержит в себе все блюда сайта

//Переименовываем некоторые значения в объектах, получаемых с сервера, на те, которые будет обрабатывать программа.
function renameCategory(){
    dishes.forEach(dish => {
        if (dish.category === "main-course"){
            dish.category = "mainDish";
        }
        if (dish.category === "drink"){
            dish.category = "juice";
        }
    })
}

//Функция, которая суммирует все цены блюд, записанных в local storage
function sumPricesFromLocalStorage() {
    const costs = JSON.parse(localStorage.getItem('costs') || '[]');

    return costs.reduce((sum, item) => {
        return sum + (Number(item.price) || 0);
    }, 0);
}

//Сортировка объектов в алфавитном порядке
function sortirovka(){
    dishes.sort((a, b) => a.name.localeCompare(b.name)); // сортировка по имени
}

// Создание элементов меню
function createElement(dish){
    let item1 = document.createElement('div');
    item1.className = 'item1';
    item1.setAttribute('data-category', dish.category);
    item1.setAttribute('data-kind', dish.kind);
    item1.setAttribute('id', dish.id);
    item1.innerHTML = `
        <div class="image" data-dish="${dish.keyword}"><img src="${dish.image}"></div>
        <p class="price">${dish.price} руб.</p>
        <p class="foodname">${dish.name}</p>
        <p class="grey">${dish.count}</p>
        <button class="button" data-category="${dish.category}">Добавить</button>
    `;
    item1.querySelector('button').addEventListener('click', () => onClickButton(item1));

    if (dish.category === 'soup') tableSoup.appendChild(item1);
    else if (dish.category === 'mainDish') tableDish.appendChild(item1);
    else if (dish.category === 'salad') tableSalad.appendChild(item1);
    else if (dish.category === 'juice') tableJuice.appendChild(item1);
    else if (dish.category === 'dessert') tableDessert.appendChild(item1);
}

function loadDishes() {
  fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes') // URL вашего API
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        return response.json(); // преобразуем JSON
    })
    .then(data => {
        dishes = data;
        renameCategory()
        sortirovka()
        if (window.localStorage.costs){
            Sticky();

            const costs = JSON.parse(localStorage.getItem('costs')) || [];
            const total = sumPricesFromLocalStorage()
            totalBlock.innerHTML = `Стоимость заказа: ${total} Р`;


            const hasSoup = costs.some(item => item.category === 'soup');
            const hasMainDish = costs.some(item => item.category === 'mainDish');
            const hasSalad = costs.some(item => item.category === 'salad');
            const hasJuice = costs.some(item => item.category === 'juice');
            const hasDessert = costs.some(item => item.category === 'dessert');

            if ((hasSoup) && (hasMainDish) && (hasSalad) && (hasJuice)) {
                OformButton.innerHTML = '<a href="Oform.html"><button class="Oform">Оформить</button></a>';
            } else if ((hasSoup) && (hasMainDish) && (hasJuice)){
                OformButton.innerHTML = '<a href="Oform.html"><button class="Oform">Оформить</button></a>'
            } else if ((hasSoup) && (hasSalad) && (hasJuice)){
                OformButton.innerHTML = '<a href="Oform.html"><button class="Oform">Оформить</button></a>'
            } else if ((hasMainDish) && (hasSalad) && (hasJuice)){
                OformButton.innerHTML = '<a href="Oform.html"><button class="Oform">Оформить</button></a>'
            } else if ((hasMainDish) && (hasJuice)){
                OformButton.innerHTML = '<a href="Oform.html"><button class="Oform">Оформить</button></a>'
            } else {
                OformButton.innerHTML = '<button class="OformWhite">Оформить</button>'
            }

        }
        dishes.forEach(dish => {
            createElement(dish)
        });

    })
    .catch(error => {
        console.error(error);
    });
}




//Добавляем таблицы с блюдами
let tableSoup = document.getElementById('tableSoup');
let tableDish = document.getElementById('tableDish');
let tableJuice = document.getElementById('tableJuice');
let tableSalad = document.getElementById('tableSalad');
let tableDessert = document.getElementById('tableDessert');
let modules = document.getElementById('modules');

loadDishes();

//Экспорт объектов из dishes.js
//import { dishes } from './dishes.js';
window.onClickSort = onClickSort;//Делает функцию глобальной
window.sendZero = sendZero; //Делает функцию глобальной



//Добавляем дополнительные блоки из leftChoice
let zagolovokKonec = document.getElementById('zagolovokKonec');
let leftChoice = document.getElementById('leftChoice');



// Создание блока комментариев
let elementTextarea = document.createElement('div');
elementTextarea.classList.add('elementTextarea');
elementTextarea.innerHTML = `
    <div class="CHOICE1">
        <label for="textarea1">Комментарии к заказу:</label>
    </div>
    <div class="CHOICE4">
        <textarea id="textarea1" name="textarea1" rows="9" cols="35"></textarea>
    </div>
`;






let sticky = document.getElementById('Sticky')//Блок, отображающий заказ
let footer = document.getElementById('contacts')

let totalBlock;
let OformButton;


function Sticky(){
    sticky.innerHTML = `
        <div class="totalBlock" id="totalBlock">Стоимость заказа: 0 Р</div>
		<button class="Oform" id="buttonSendZero" onclick="sendZero()">Очистить</button>
		<div class="OformButton">
			<button class="OformWhite">Оформить</button>
		</div>
    `;
    //Блок, отображающий стоимость всего заказа
    totalBlock = document.getElementById('totalBlock');
    OformButton = document.querySelector('.OformButton');
    document
      .getElementById('buttonSendZero')
      .addEventListener('click', sendZero);

    footer.style.paddingBottom = '90px';
}

//Рассчёт всей стоимости заказа и сохранение id блюда в localStorage
function updateTotal(dish) {
    
    const categoryCost = dish.dataset.category;
    const idCost = dish.id;

    const priceText = dish.querySelector('.price').textContent;
    const priceCost = parseInt(priceText); // "250 руб." → 250

    dish = {
        category: categoryCost, 
        price: priceCost,
        id: idCost
    }
    

    let costs = JSON.parse(localStorage.getItem('costs')) || [];
    costs = costs.filter(item => item.category !== categoryCost);
    costs.push(dish)

    localStorage.setItem('costs', JSON.stringify(costs))
    let totaly = costs.reduce((sum, item) => sum + item.price, 0)

    totalBlock.innerHTML = `Стоимость заказа: ${totaly} Р`;


    return 
}

//Весь заказ обнуляется
function sendZero(){
    let costs = JSON.parse(localStorage.getItem('costs')) || [];
    costs = [];
    localStorage.setItem('costs', JSON.stringify(costs))
    totalBlock.innerHTML = `Стоимость заказа: 0 Р`;
    OformButton.innerHTML = '<button class="OformWhite">Оформить</button>'
    window.localStorage.clear();
}

// Функции создания блоков в leftChoice
function createBlock(el, block, title, id) {

    block.innerHTML = '';
    let miniTitle = document.createElement('div');
    miniTitle.classList.add('CHOICE1');
    miniTitle.innerHTML = `<p><b>${title}</b></p>`;

    let food = document.createElement('div');
    if (el) {
        let item = el.closest('.item1');//Нахождеание 
        let name = item.querySelector('.foodname').textContent;
        let price = item.querySelector('.price').textContent;
        food.innerHTML = `${name} ${price}`;
        block.id = id;
    } else {
        food.innerHTML = `${title} не выбрано`;
    }
    food.style.marginTop = "-10px";

    block.appendChild(miniTitle);
    block.appendChild(food);

    //updateTotal(el);
}

function createBlockSoup(el) {
    createBlock(el, blockSoup, 'Суп', 'leftChoiceSoup');
}

function createBlockMainDish(el) {
    createBlock(el, blockMainDish, 'Главное блюдо', 'leftChoiceMainDish');
}

function createBlockSalad(el) {
    createBlock(el, blockSalad, 'Салат или стартеры', 'leftChoiceSalad');
}

function createBlockJuice(el) {
    createBlock(el, blockJuice, 'Напиток', 'leftChoiceJuice');
}

function createBlockDessert(el) {
    createBlock(el, blockDessert, 'Дессерты', 'leftChoiceDessert');
}

//Функция по фильтрованию блюд по их составу, из какой еды они состоят
function onClickSort(el){
    let kind = el.dataset.kind; //Сортировка еды по пищевому содержимому (мяясо, рыба, овощи)
    let categoring = el.dataset.category; //Категория типов еды (главное блюдо, напитки, десерты)

    const section = el.closest('section');//Берётся на обработку ближайший <section>, в данном случае берётся тот, в котором находятся кнопки

    let container = section.querySelector('.container');
    let directDivs = container.querySelectorAll(':scope > div');//Берутся только div одного уровня
    directDivs.forEach(div => div.remove());

    if (el.classList.contains("active")) {
        el.classList.remove("active");
        dishes.forEach(dish => {
            if (dish.category === categoring){
                createElement(dish)
                return;
            } 
        })
        return;
    } else{
        el.classList.add("active")
        dishes.forEach(dish => {
            if (dish.category === categoring){
                if (dish.kind === kind){
                    createElement(dish)
                    return;
                }
            } 
        })
    }
}

// Логика выбора
let blocksCreated = false;

let costing = false;//Было ли выбрано хотя бы одно блюдо хотя бы один раз

//Добавление блюда в заказ
function onClickButton(el) {

    //Сохранение блюда в Local Storage
    window.localStorage.setItem(el.dataset.category, String(el.id))

    const category = el.dataset.category;
    if (!costing) {
        Sticky();
        costing = true;
    }
    updateTotal(el);
    
    const costs = JSON.parse(localStorage.getItem('costs')) || [];

    const hasSoup = costs.some(item => item.category === 'soup');
    const hasMainDish = costs.some(item => item.category === 'mainDish');
    const hasSalad = costs.some(item => item.category === 'salad');
    const hasJuice = costs.some(item => item.category === 'juice');
    const hasDessert = costs.some(item => item.category === 'dessert');

    if ((hasSoup) && (hasMainDish) && (hasSalad) && (hasJuice)) {
        OformButton.innerHTML = '<a href="Oform.html"><button class="Oform">Оформить</button></a>';
    } else if ((hasSoup) && (hasMainDish) && (hasJuice)){
        OformButton.innerHTML = '<a href="Oform.html"><button class="Oform">Оформить</button></a>'
    } else if ((hasSoup) && (hasSalad) && (hasJuice)){
        OformButton.innerHTML = '<a href="Oform.html"><button class="Oform">Оформить</button></a>'
    } else if ((hasMainDish) && (hasSalad) && (hasJuice)){
        OformButton.innerHTML = '<a href="Oform.html"><button class="Oform">Оформить</button></a>'
    } else if ((hasMainDish) && (hasJuice)){
        OformButton.innerHTML = '<a href="Oform.html"><button class="Oform">Оформить</button></a>'
    } else {
        OformButton.innerHTML = '<button class="OformWhite">Оформить</button>'
    }
}
