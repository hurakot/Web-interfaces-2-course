
//Все заказы
//let allOrders = []
//Делаем массив со всеми заказами глобальной
//window.allOrders = allOrders;

//Экспорт объектов из dishes.js
//import { dishes } from './dishes.js';
window.onClickSend = onClickSend; //Делает функцию глобальной
window.onClickReset = onClickReset; //Делает функцию глобальной

//Количество заказов

//if let amountOrders

//Добавляем таблицу с выбранными блюдами
let ChosenZakaz = document.getElementById('ChosenZakaz');
//Модальные окна
let modules = document.getElementById('modules');

//Добавляем дополнительные блоки из leftChoice
let zagolovokKonec = document.getElementById('zagolovokKonec');
let leftChoice = document.getElementById('leftChoice');

//leftChoice - блок выбранной еды в форме заказа


let dishes = [];//Содержит в себе все блюда сайта


//leftChoice - блок выбранной еды в форме заказа

//Очищаем leftChoice от всех блоков
zagolovokKonec.remove();
leftChoice.innerHTML = '';
ChosenZakaz.innerHTML = '';

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

    totalBlock.innerHTML = `Стоимость заказа:<br>${total} Руб.`;
}

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
        <button class="button" data-category="${dish.category}">Удалить</button>
    `;
    item1.querySelector('button').addEventListener('click', () => onClickDelete(item1));
    ChosenZakaz.appendChild(item1);
}

// Логика выбора
let blocksCreated = false;

//Блок, появляющийся, если ничего не выбрано в заказе, на том месте, где должны находиться карточки с блюдами.
let goToZakaz = document.createElement('div');

// Галочка, определяющая, что добавлен такоой блок = (Блок, появляющийся, если ничего не выбрано в заказе, на том месте, где должны находиться карточки с блюдами.)
let goToZakazMaked = false;

//Весь блок, имеющий табличку, в которой находятся карточки с блюдами
let tableWithDishes = document.getElementById('tableWithDishes');

// Текст, что ничего не выбрано
leftChoice.appendChild(zagolovokKonec);
let nothing = document.createElement('p');
nothing.innerHTML = "Ничего не выбрано";
nothing.id = 'nothingChosen';
zagolovokKonec.after(nothing);

// Галочка, определяющая, что добавлен блок = (Блок в leftChoice, обозначающий, что ни одно блюдо не выбрано.)
let NothingChosenDeleted = false;

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
            if (String(dish.id) === window.localStorage.getItem(dish.category)) {

                createElement(dish)
                const category = dish.category;
                //Изначальное создание блоков в leftChoice
                if (!NothingChosenDeleted){
                    document.getElementById('nothingChosen').remove();
                    NothingChosenDeleted = true;
                }

                if (!blocksCreated) {
                    createBlock(category === 'soup' ? dish : null, blockSoup, 'Суп', 'leftChoiceSoup');
                    createBlock(category === 'mainDish' ? dish : null, blockMainDish, 'Главное блюдо', 'leftChoiceMainDish');
                    createBlock(category === 'salad' ? dish : null, blockSalad, 'Салат или стартеры', 'leftChoiceSalad');
                    createBlock(category === 'juice' ? dish : null, blockJuice, 'Напиток', 'leftChoiceJuice');
                    createBlock(category === 'dessert' ? dish : null, blockDessert, 'Десерты', 'leftChoiceDessert');
                    blocksCreated = true;
                    //return;
                }
                //Обновление типа выбранного блюда в leftChoice
                if (category === 'soup') createBlockSoup(dish);
                else if (category === 'mainDish') createBlockMainDish(dish);
                else if (category === 'salad') createBlockSalad(dish);
                else if (category === 'juice') createBlockJuice(dish);
                else if (category === 'dessert') createBlockDessert(dish);
                updateTotal();
                goToZakazMaked = true;
                goToZakaz.innerHTML = '';
            }
            else if ((!window.localStorage.costs) && (!goToZakazMaked)){
                let goToZakaz = document.createElement('div');
                goToZakaz.classList.add('goToZakazMaked')
                goToZakaz.innerHTML = `Ничего не выбрано. Чтобы добавить блюда в заказ, перейдите на страницу <a href="Zakaz.html">Собрать ланч</a>.`
                tableWithDishes.appendChild(goToZakaz);
                goToZakazMaked = true;
            }
        });
    })
    .catch(error => {
        console.error(error);
    });
}


loadDishes();

// Создание блоков выбранной еды
let blockSoup = document.createElement('div');
let blockMainDish = document.createElement('div');
let blockSalad = document.createElement('div');
let blockJuice = document.createElement('div');
let blockDessert = document.createElement('div');

// Создание блока комментариев
let elementTextarea = document.createElement('div');
elementTextarea.classList.add('elementTextarea');
elementTextarea.id = "textarea1";
elementTextarea.innerHTML = `
    <div class="CHOICE1">
        <label for="textareaText">Комментарии к заказу:</label>
    </div>
    <div class="CHOICE4">
        <textarea id="textareaText" name="textarea1" rows="9" cols="35"></textarea>
    </div>
`;

//Блок в leftChoice с отображением всей стоимости заказа
let totalBlock = document.createElement('div');
totalBlock.classList.add('totalBlock');
totalBlock.style.marginTop = "20px";
totalBlock.style.fontWeight = "bold";
totalBlock.style.fontSize = "18px";
totalBlock.innerHTML = `Стоимость заказа:<br>0 руб`;

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
        dishes.forEach(dish => {
            if(el.id === dish.id){
                let name = dish.name;
                let price = dish.price;
                food.innerHTML = `${name} ${price} руб`;
                block.id = id;
            }
        });
        //let item = el.closest('.item1');//Нахождение 
        //let name = item.querySelector('.foodname').textContent;
        //let price = item.querySelector('.price').textContent;


        //food.innerHTML = `${name} ${price}`;
        //block.id = id;
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




//Кнопка в блоке с блюдов, при нажатии на которую блюдо удаляется из заказа
function onClickDelete(el){
    if (el.dataset.category === 'soup') {
        createBlock(null, blockSoup, 'Суп', 'leftChoiceSoup');
    } 
    else if (el.dataset.category === 'mainDish') {
        //document.getElementById('leftChoiceMainDish').remove();
        createBlock(null, blockMainDish, 'Главное блюдо', 'leftChoiceMainDish');
    } 
    else if (el.dataset.category === 'salad') {
        //document.getElementById('leftChoiceSalad').remove();
        createBlock(null, blockSalad, 'Салат или стартеры', 'leftChoiceSalad');
    } 
    else if (el.dataset.category === 'juice') {
        //document.getElementById('leftChoiceJuice').remove();
        createBlock(null, blockJuice, 'Напиток', 'leftChoiceJuice');
    } 
    else if (el.dataset.category === 'dessert') {
        //document.getElementById('leftChoiceDessert').remove();
        createBlock(null, blockDessert, 'Десерты', 'leftChoiceDessert');
    }
    window.localStorage.removeItem(el.dataset.category);//Удаление блюда из Local Storage
    el.remove();//Удаление блюда из таблицы с выбранными блюдами
    updateTotal();
}



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



function buildOrderData(deliveryTime) {
    //Подготовка к отправке данных

    // Получаем текущую дату
    let counter = localStorage.getItem('objectCounter');

    const now = new Date();

    const date = now.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const time = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const createdAt = `${date} ${time}`;

    // Если это первая запись
    if (counter === null) {
        counter = 1;
    } else {
        counter = Number(counter) + 1;
    }

    let deliveryType = null;
    if (document.getElementById('faster').checked){
        deliveryType = 'now';
    }
    if (document.getElementById('toTheTime').checked) {
        deliveryType = 'by_time';
    }

    return {
        id: Number(counter),
        created_at: createdAt,
        full_name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('number').value,
        delivery_address: document.getElementById('Address').value,
        comment: document.getElementById('textareaText').value,
        full_price: totalBlock.textContent.match(/\d+/)?.[0], //Итоговая стоимость всего заказа

        subscribe: document.querySelector('input[name="checkEmail"]')?.checked ? 1 : 0,
        /*
        delivery_type: document.getElementById('faster').checked
            ? 'now'
            : 'by_time',
        */

        delivery_type: deliveryType,

        delivery_time:
            deliveryType === 'by_time'
                ? document.getElementById('time2').value
                : null,

        /*
        delivery_time: document.getElementById('toTheTime').checked
            ? document.getElementById('time2').value
            : null,
        */

        soup_id: localStorage.getItem('soup'),
        main_course_id: localStorage.getItem('mainDish'),
        salad_id: localStorage.getItem('salad'),
        drink_id: localStorage.getItem('juice'), 
        dessert_id: localStorage.getItem('dessert')
    }
};


//Функция, добавляющая заказ с архив заказов
function saveObjectToLocalStorage(object) {
    // Получаем текущий счётчик
    let counter = localStorage.getItem('objectCounter');

    // Если это первая запись
    if (counter === null) {
        counter = 1;
    } else {
        counter = Number(counter) + 1;
    }

    // Формируем ключ
    const key = `OrderID${counter}`;

    // Сохраняем объект
    localStorage.setItem(key, JSON.stringify(object));

    // Обновляем счётчик
    localStorage.setItem('objectCounter', counter);

    return key; // на случай, если нужен ключ
}



//Функция отправки данных на сервер
async function dataSended() {
    const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/orders';
    const API_KEY = 'f97f0ebd-977c-4c9b-833e-8310102212a4';

    const orderData = buildOrderData();

    try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Ошибка оформления заказа');
        }

        const result = await response.json();
        console.log('Заказ создан:', result);

        // Удаление блюд при успешной отправке данных
        localStorage.removeItem('soup');
        localStorage.removeItem('mainDish');
        localStorage.removeItem('salad');
        localStorage.removeItem('juice');
        localStorage.removeItem('dessert');

        localStorage.removeItem('costs');

        //unshift - добавляет объект в начало массива
        
        saveObjectToLocalStorage(orderData)

    } catch (error) {
        alert('Ошибка при отправке заказа: ' + error.message);
        console.error(error);
        saveObjectToLocalStorage(orderData)

        // Удаление блюд при успешной отправке данных
        localStorage.removeItem('soup');
        localStorage.removeItem('mainDish');
        localStorage.removeItem('salad');
        localStorage.removeItem('juice');
        localStorage.removeItem('dessert');

        localStorage.removeItem('costs');

        saveObjectToLocalStorage(orderData)

    }
}


//ID заказа, который нужно удалть
let orderId = 1

//Функция для удаления заказа по id.
async function deleteOrder(orderId) {
    const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/orders';
    const API_KEY = 'ТВОЙ_API_KEY_ЗДЕСЬ';

    try {
        const response = await fetch(
            `${API_URL}/${orderId}?api_key=${API_KEY}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Ошибка удаления заказа');
        }

        const result = await response.json();
        console.log('Заказ удалён:', result);

        return result;

    } catch (error) {
        console.error('Ошибка:', error.message);
        alert('Не удалось удалить заказ: ' + error.message);
    }
}
//Кнопка "Сбросить" в форме заказа
function onClickReset(el) {
    // Удаление блюд при нажатии "Сбросить" в форме заказа
    localStorage.removeItem('soup');
    localStorage.removeItem('mainDish');
    localStorage.removeItem('salad');
    localStorage.removeItem('juice');
    localStorage.removeItem('dessert');

    localStorage.removeItem('costs');

    createBlock(null, blockSoup, 'Суп', 'leftChoiceSoup');
    createBlock(null, blockMainDish, 'Главное блюдо', 'leftChoiceMainDish');
    createBlock(null, blockSalad, 'Салат или стартеры', 'leftChoiceSalad');
    createBlock(null, blockJuice, 'Напиток', 'leftChoiceJuice');
    createBlock(null, blockDessert, 'Десерты', 'leftChoiceDessert');

    ChosenZakaz.innerHTML = '';

    updateTotal()
}

async function onClickSend(el) {

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

    } else if ((soup)&&((!mainDish) && (!salad))){
        text = 'Выберите главное блюдо/салат/стартер';

    } else if ((salad)&&((!soup) && (!mainDish))){
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
        <div class="bs-scope">
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
    </div>
    `;

    document.body.appendChild(block);

    // 🚀 ЯВНО открываем модалку
    const modal = new window.bootstrap.Modal(
        document.getElementById('exampleModal')
    );
    modal.show();

    //Отправляем заказ на сервер и на страницу "Заказы"
    //ТакжеЖдём отправку данных
    await dataSended();

    //Перезагружаем страницу после отправки данных
    location.reload();
}
