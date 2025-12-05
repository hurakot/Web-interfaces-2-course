import { dishes } from './dishes.js';

dishes.sort((a, b) => a.name.localeCompare(b.name)); // сортировка по имени

let tableSoup = document.getElementById('tableSoup');
let tableDish = document.getElementById('tableDish');
let tableJuice = document.getElementById('tableJuice');

let zagolovokKonec = document.getElementById('zagolovokKonec');
let leftChoice = document.getElementById('leftChoice');

leftChoice.innerHTML = '';
tableSoup.innerHTML = '';
tableDish.innerHTML = '';
tableJuice.innerHTML = '';

// Текст, что ничего не выбрано
leftChoice.appendChild(zagolovokKonec);
let nothing = document.createElement('p');
nothing.innerHTML = "Ничего не выбрано";
zagolovokKonec.after(nothing);

// Создание блоков выбранной еды
let blockSoup = document.createElement('div');
let blockMainDish = document.createElement('div');
let blockJuice = document.createElement('div');

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
blockMainDish.after(blockJuice);
blockJuice.after(totalBlock);
totalBlock.after(elementTextarea);

// Функции создания блоков
function createBlock(el, block, title) {
    block.innerHTML = '';
    let miniTitle = document.createElement('div');
    miniTitle.classList.add('CHOICE1');
    miniTitle.innerHTML = `<p><b>${title}</b></p>`;

    let food = document.createElement('div');
    if (el) {
        let item = el.closest('.item1');
        let name = item.querySelector('.foodname').textContent;
        let price = item.querySelector('.price').textContent;
        food.innerHTML = `${name} ${price}`;
    } else {
        food.innerHTML = `${title} не выбрано`;
    }
    food.style.marginTop = "-10px";

    block.appendChild(miniTitle);
    block.appendChild(food);

    updateTotal();
}

function createBlockSoup(el) {
    createBlock(el, blockSoup, 'Суп');
}

function createBlockMainDish(el) {
    createBlock(el, blockMainDish, 'Главное блюдо');
}

function createBlockJuice(el) {
    createBlock(el, blockJuice, 'Напиток');
}

//Рассчёт всей стоимости заказа
function updateTotal() {
    let total = 0;

    [blockSoup, blockMainDish, blockJuice].forEach(block => {
        let foodDiv = block.querySelector('div:nth-child(2)'); // второй div — выбранная еда
        if (foodDiv && !foodDiv.textContent.includes('не выбран')) {
            let priceMatch = foodDiv.textContent.match(/(\d+)\s*руб/);
            if (priceMatch) total += parseInt(priceMatch[1]);
        }
    });

    totalBlock.innerHTML = `Стоимость заказа:<br>${total} Р`;
}

// Создание элементов меню
dishes.forEach(dish => {
    let item1 = document.createElement('div');
    item1.className = 'item1';
    item1.setAttribute('data-category', dish.category);
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
    else if (dish.category === 'juice') tableJuice.appendChild(item1);
});

// Логика выбора
let blocksCreated = false;

function onClickButton(el) {
    const category = el.dataset.category;

    if (nothing.parentNode) nothing.remove();

    // При первом клике создаем все три блока
    if (!blocksCreated) {
        createBlock(category === 'soup' ? el : null, blockSoup, 'Суп');
        createBlock(category === 'mainDish' ? el : null, blockMainDish, 'Главное блюдо');
        createBlock(category === 'juice' ? el : null, blockJuice, 'Напиток');
        blocksCreated = true;
        return;
    }

    // Обновляем только выбранный блок
    if (category === 'soup') createBlockSoup(el);
    else if (category === 'mainDish') createBlockMainDish(el);
    else if (category === 'juice') createBlockJuice(el);

    updateTotal();
}