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

//Сортировка объектов в алфавитном порядке
function sortirovka(){
    dishes.sort((a, b) => a.name.localeCompare(b.name)); // сортировка по имени
}

// Создание элементов меню
function createElement(dish){
    let item1 = document.createElement('div');
    item1.className = 'item1';
    item1.setAttribute('data-category', dish.category);
    item1.setAttribute('data-kind', dish.kind)
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
        dishes.forEach(dish => {
            createElement(dish)
        });

    })
    .catch(error => {
        console.error(error);
    });
}

loadDishes();


//Экспорт объектов из dishes.js
//import { dishes } from './dishes.js';
window.onClickSort = onClickSort;//Делает функцию глобальной
window.onClickSend = onClickSend;//Делает функцию глобальной

//Добавляем таблицы с блюдами
let tableSoup = document.getElementById('tableSoup');
let tableDish = document.getElementById('tableDish');
let tableJuice = document.getElementById('tableJuice');
let tableSalad = document.getElementById('tableSalad');
let tableDessert = document.getElementById('tableDessert');
let modules = document.getElementById('modules');

//Добавляем дополнительные блоки из leftChoice
let zagolovokKonec = document.getElementById('zagolovokKonec');
let leftChoice = document.getElementById('leftChoice');

//Очищаем leftChoice от всех блоков
zagolovokKonec.remove();
leftChoice.innerHTML = '';
tableSoup.innerHTML = '';
tableDish.innerHTML = '';
tableJuice.innerHTML = '';
tableSalad.innerHTML = '';
tableDessert.innerHTML = '';

// Текст, что ничего не выбрано
leftChoice.appendChild(zagolovokKonec);
let nothing = document.createElement('p');
nothing.innerHTML = "Ничего не выбрано";
zagolovokKonec.after(nothing);

// Создание блоков выбранной еды
let blockSoup = document.createElement('div');
let blockMainDish = document.createElement('div');
let blockSalad = document.createElement('div');
let blockJuice = document.createElement('div');
let blockDessert = document.createElement('div');

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

//Блок в leftChoice с отображением всей стоимости заказа
let totalBlock = document.createElement('div');
totalBlock.classList.add('totalBlock');
totalBlock.style.marginTop = "20px";
totalBlock.style.fontWeight = "bold";
totalBlock.style.fontSize = "18px";
totalBlock.innerHTML = `Стоимость заказа:<br>0 Р`;

//Распределение блоков в leftChoice
nothing.after(blockSoup);
blockSoup.after(blockMainDish);
blockMainDish.after(blockSalad);
blockSalad.after(blockJuice);
blockJuice.after(blockDessert);
blockDessert.after(totalBlock);
totalBlock.after(elementTextarea);


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

    updateTotal();
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


//Рассчёт всей стоимости заказа
function updateTotal() {
    let total = 0;

    [blockSoup, blockMainDish, blockSalad, blockJuice, blockDessert].forEach(block => {
        let foodDiv = block.querySelector('div:nth-child(2)'); // второй div — выбранная еда
        if (foodDiv && !foodDiv.textContent.includes('не выбран')) {
            let priceMatch = foodDiv.textContent.match(/(\d+)\s*руб/);
            if (priceMatch) total += parseInt(priceMatch[1]);
        }
    });

    totalBlock.innerHTML = `Стоимость заказа:<br>${total} Р`;
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
                creareElement(dish)
                return;
            } 
        })
        return;
    } else{
        el.classList.add("active")
        dishes.forEach(dish => {
            if (dish.category === categoring){
                if (dish.kind === kind){
                    creareElement(dish)
                    return;
                }
            } 
        })
    }
}

// Логика выбора
let blocksCreated = false;

//Добавление блюда в заказ
function onClickButton(el) {
    const category = el.dataset.category;

    if (nothing.parentNode) nothing.remove();

    // При первом клике создаем все пять блоков
    if (!blocksCreated) {
        createBlock(category === 'soup' ? el : null, blockSoup, 'Суп', 'leftChoiceSoup');
        createBlock(category === 'mainDish' ? el : null, blockMainDish, 'Главное блюдо', 'leftChoiceMainDish');
        createBlock(category === 'salad' ? el : null, blockSalad, 'Салат или стартеры', 'leftChoiceSalad');
        createBlock(category === 'juice' ? el : null, blockJuice, 'Напиток', 'leftChoiceJuice');
        createBlock(category === 'dessert' ? el : null, blockDessert, 'Десерты', 'leftChoiceDessert');
        blocksCreated = true;
        return;
    }

    // Обновляем только выбранный блок
    if (category === 'soup') createBlockSoup(el);
    else if (category === 'mainDish') createBlockMainDish(el);
    else if (category === 'salad') createBlockSalad(el);
    else if (category === 'juice') createBlockJuice(el);
    else if (category === 'dessert') createBlockDessert(el);
    updateTotal();
}

function onClickSend(el) {
    
    const soup = document.getElementById('leftChoiceSoup');
    const mainDish = document.getElementById('leftChoiceMainDish');
    const salad = document.getElementById('leftChoiceSalad');
    const juice = document.getElementById('leftChoiceJuice');
    const dessert = document.getElementById('leftChoiceDessert');

    let text = 'a';

    if ((!soup) && (!mainDish) && (!salad) && (!juice) && (!dessert)) {
        text = 'Ничего не выбрано. Выберите блюда<br>для заказа';
    } else if (!juice){
        text = 'Выберите напиток';
    } else if ((soup)&&((!mainDish) || (!salad))){
        text = 'Выберите главное блюдо/салат/стартер';
    } else if ((salad)&&((!soup) || (!mainDish))){
        text = 'Выберите суп или главное блюдо'
    } else if (((juice)||(dessert))&&(!mainDish)){
        text = 'Выберите главное блюдо'
    } else {
        text = 'Заказ отправлен. Спасибо, что выбрали наш сервис'
    }

    // Удаляем старую модалку, если была
    const oldModal = document.getElementById('exampleModal');
    if (oldModal) {
        oldModal.remove();
    }

    // Создаём новую
    let block = document.createElement('div')
    block.innerHTML = `
    <div class="modal fade" id="exampleModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="popUpBlock">
                    <p class="popUpText">${text}</p>
                    <button type="button" class="popUpButton" data-bs-dismiss="modal">
                        Окей
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.appendChild(block);

    // 🚀 ЯВНО открываем модалку
    const modal = new window.bootstrap.Modal(
        document.getElementById('exampleModal')
    );
    modal.show();
}

/*
function onClickSend(id) {

    el.classList.add("btn btn-primary")

    el.setAttribute('data-bs-toggle', 'modal');
    el.setAttribute('data-bs-target', '#exampleModal');



    const soup = document.getElementById('leftChoiceSoup');
    const mainDish = document.getElementById('leftChoiceMainDish');
    const salad = document.getElementById('leftChoiceSalad');
    const juice = document.getElementById('leftChoiceJuice');
    const dessert = document.getElementById('leftChoiceDessert');

    if ((!soup) && (!mainDish) && (!salad) && (!juice) && (!dessert)) {
        alert('Выберите суп');
        leftChoiceAlert("noDish1");
    } else if (!juice){
        alert('Заказ отправлен. Спасибо, что выбрали наш сервис.');
        leftChoiceAlert("noDish2");
    } else if ((soup)&&((!mainDish) || (!salad))){
        alert('Заказ отправлен. Спасибо, что выбрали наш сервис.');
        leftChoiceAlert("noDish3");
    } else if ((salad)&&((!soup) || (!mainDish))){
        alert('Заказ отправлен. Спасибо, что выбрали наш сервис.');
        leftChoiceAlert("noDish4");
    } else if (((juice)||(dessert))&&(!mainDish)){
        alert('Заказ отправлен. Спасибо, что выбрали наш сервис.');
        leftChoiceAlert("noDish5");
    } else {
        leftChoiceAlert("dishChosen");
        alert('Заказ отправлен. Спасибо, что выбрали наш сервис.');
    }
}
*/
/*
function leftChoiceAlert(id){
    block = document.add('div');
    if (id === "noDish1"){
        block.innerHTML = `
        <div class="modal" id="myModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <p>Ничего не выбрано. Выберите блюда для заказа<p>
                        <button>Окей</button>
                    </div>
                </div>
            </div>
        </div>
        `

    } else if(id === "noDish2"){
        block.innerHTML = `
        <div class="modal" id="myModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <p>Выберите напиток<p>
                        <button>Окей</button>
                    </div>
                </div>
            </div>
        </div>
        `
    } else if(id === "noDish3"){
        block.innerHTML = `
        <div class="modal" id="myModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <p>Выберите главное блюдо/салат/стартер<p>
                        <button>Окей</button>
                    </div>
                </div>
            </div>
        </div>
        `
    } else if(id === "noDish4"){
        block.innerHTML = `
        <div class="modal" id="myModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <p>Выберите суп или главное блюдо<p>
                        <button>Окей</button>
                    </div>
                </div>
            </div>
        </div>
        `
    } else if(id === "noDish5"){
        block.innerHTML = `
        <div class="modal" id="myModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <p>Выберите главное блюдо<p>
                        <button>Окей</button>
                    </div>
                </div>
            </div>
        </div>
        `
    } else {
        block.innerHTML = `
        <div class="modal" id="myModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <p>Заказ отправлен. Спасибо, что выбрали наш сервис<p>
                        <button>Окей</button>
                    </div>
                </div>
            </div>
        </div>
        `
    }
}
*/
/*
function leftChoiceAlert (id) {
    alert('Заказ отправлен. Спасибо, что выбрали наш сервис.');
    if (id === "noDish1"){
        alert('Ничего не выбрано. Выберите блюда для заказа');
    } else if(id === "noDish2"){
        alert('Выберите напиток');
    } else if(id === "noDish3"){
        alert('Выберите главное блюдо/салат/стартер');
    } else if(id === "noDish4"){
        alert('Выберите суп или главное блюдо');
    } else if(id === "noDish5"){
        alert('Выберите главное блюдо');
    } else {
        alert('Заказ отправлен. Спасибо, что выбрали наш сервис.');
    }
}
*/