let dishes = [];//Содержит в себе все блюда сайта

//Все блюда загружены в переменную dishes
async function loadDishes() {
    const res = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');
    dishes = await res.json();
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


//Модальное окно просмотра заказа
let viewModal = document.getElementById('viewModal')

//Модальное окно редактирвоания заказа
let editModal = document.getElementById('editModal')

//Модальное окно удаление заказа
let deleteModal = document.getElementById('deleteModal')

//Таблица, отображающая все заказы
let tableWithOrders = document.getElementById('tableWithOrders')


//Id обрабатываемого заказа в модальном окне редактирования заказа
let currentEditOrderId = null;

//Глобальная функция открытия модального окна (просмотра, редактирования и удаления заказа)
window.openModal = function (id, el) {
    // закрываем ВСЕ модалки
    document.querySelectorAll('.modal').forEach(m => {
        m.style.display = 'none';
    });

    // открываем нужную
    const modal = document.getElementById(id);
    if (modal) {
        if (id === 'viewModal'){
            const orderData = JSON.parse(localStorage.getItem(`OrderID${el.id}`));
            if (!orderData) return;
            else{
                renderViewModal(orderData);
            }
        } else if (id === 'editModal'){
            currentEditOrderId = el.id;//задаем переменной id редактируемого заказа
            const orderData = JSON.parse(localStorage.getItem(`OrderID${el.id}`));
            if (!orderData) return;
            else{
                renderEditModal(orderData);
            }
        } else if (id === 'deleteModal'){
            currentEditOrderId = el.id;
            modal.style.display = 'flex';
        }
        //Открытие модального окна
        modal.style.display = 'flex';

    }
};


//Определение состава заказа для его отображение в окне просмотра заказа и в окне редактирования заказа
function getOrderItemsHtml(orderData) {
    const items = [];

    if (orderData.soup_id) {
        items.push({
            title: 'Суп',
            id: orderData.soup_id
        });
    }

    if (orderData.main_course_id) {
        items.push({
            title: 'Основное блюдо',
            id: orderData.main_course_id
        });
    }

    if (orderData.salad_id) {
        items.push({
            title: 'Салат',
            id: orderData.salad_id
        });
    }

    if (orderData.drink_id) {
        items.push({
            title: 'Напиток',
            id: orderData.drink_id
        });
    }

    if (orderData.dessert_id) {
        items.push({
            title: 'Десерт',
            id: orderData.dessert_id
        });
    }

    return items.map(item => {
        const dish = dishes.find(d => d.id == item.id);
        if (!dish) return '';

        return `
            <div class="modalRow">
                <p class="modalRowLeft">${item.title}:</p>
                <p class="modalRowRight">${dish.name} (${dish.price}₽)</p>
            </div>
        `;
    }).join('');
}

//Изменение модального окна просмотра заказа
function renderViewModal(orderData) {
    viewModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Просмотр заказа</h3>
                <span class="close" onclick="closeModal('viewModal')">&times;</span>
            </div>

            <div class="modal-body">

                <div class="modalRow">
                    <p class="modalRowLeft"><b>Дата оформления:</b></p>
                    <p class="modalRowRight">${orderData.created_at}</p>
                </div>

                <h4>Доставка</h4>

                <div class="modalRow">
                    <p class="modalRowLeft">Имя получателя:</p>
                    <p class="modalRowRight">${orderData.full_name}</p>
                </div>

                <div class="modalRow">
                    <p class="modalRowLeft">Адрес:</p>
                    <p class="modalRowRight">${orderData.delivery_address}</p>
                </div>

                <div class="modalRow">
                    <p class="modalRowLeft">Время:</p>
                    <p class="modalRowRight">
                        ${orderData.delivery_type === "now"
                            ? 'В течение дня (07:00–23:00)'
                            : orderData.delivery_time}
                    </p>
                </div>

                <div class="modalRow">
                    <p class="modalRowLeft">Телефон:</p>
                    <p class="modalRowRight">${orderData.phone}</p>
                </div>
                
                <div class="modalRow">
                    <p class="modalRowLeft">Email:</p>
                    <p class="modalRowRight">${orderData.email}</p>
                </div>

                <h4>Комментарий</h4>
                <div class="modalRow">
                    <p>${orderData.comment || '—'}</p>
                </div>

                <h4>Состав заказа</h4>

                ${getOrderItemsHtml(orderData)}

                <div class="modalRow">
                    <p class="total">Стоимость: ${orderData.full_price}₽</p>
                </div>

            </div>

            <div class="modal-footer">
                <button class="commonButton" onclick="closeModal('viewModal')">OK</button>
            </div>
        </div>
    `;
}

//Изменение модального окна редактирования заказа
function renderEditModal(orderData) {
    editModal.innerHTML = 
    `
    <div class="modal-content">
        <div class="modal-header">
            <h3>Редактирование заказа</h3>
            <span class="close" onclick="closeModal('editModal')">&times;</span>
        </div>
        <div class="modal-body">
			<div class="modalRow">
				<p class="modalRowLeft"><b>Дата оформления:</b></p>
				<p class="modalRowRight">${orderData.created_at}</p>
			</div>
			<h4>Доставка</h4>
			<div class="modalRow">
            	<label class="modalRowLeftChange">Имя получателя</label>
            	<input id="editFullName" class="modalRowRight" type="text" value="${orderData.full_name}">
			</div>
			<div class="modalRow">
            	<label class="modalRowLeftChange">Адрес доставки</label>
            	<input id="editAddress" class="modalRowRight" type="text" value="${orderData.delivery_address}">
			</div>
			<div class="modalRow">
            	<label class="modalRowLeftChange">Время доставки</label>
            	<input id="editTime" class="modalRowRight" type="time" 
                value="
                ${orderData.delivery_type === "now"
                ? 'В течение дня (07:00–23:00)'
                : orderData.delivery_time}
                ">
			</div>
			<div class="modalRow">
            	<label class="modalRowLeftChange">Телефон</label>
            	<input id="editPhone" class="modalRowRight" type="tel" value="${orderData.phone}">
			</div>
			<div class="modalRow">
            	<label class="modalRowLeftChange">Email</label>
            	<input id="editEmail" class="modalRowRight" type="email" value="${orderData.email}">
			</div>
			<h4>Комментарий</h4>
			<div class="modalRowComment">
				<input id="editComment" class="modalRowLeftChange" type="email" value="${orderData.comment || '—'}">
			</div>
			<h4>Состав заказа</h4>
			
            ${getOrderItemsHtml(orderData)}

			<div class="modalRow">
        		<p class="total">Стоимость: ${orderData.full_price}₽</p>
			</div>
        </div>
        <div class="modal-footer">
        	<button class="commonButton" onclick="closeModal('editModal')">Отмена</button>
        	<button class="success" onclick="changeModal(this)">Сохранить</button>
        </div>
    </div>
    `
}

//Глобальная функция сохранения резаультатов редактирования заказа и их записывания в locsl Storage
window.changeModal = function (el) {
    if (!currentEditOrderId) return;

    const key = `OrderID${currentEditOrderId}`;
    const orderData = JSON.parse(localStorage.getItem(key));
    if (!orderData) return;

    // 1. Читаем значения из формы
    orderData.full_name = document.getElementById('editFullName').value;
    orderData.delivery_address = document.getElementById('editAddress').value;
    //orderData.delivery_time = document.getElementById('editTime').value;
    orderData.phone = document.getElementById('editPhone').value;
    orderData.email = document.getElementById('editEmail').value;
    orderData.comment = document.getElementById('editComment').value;

    // если время введено вручную — считаем доставку "ко времени"
    const timeValue = document.getElementById('editTime').value;

    if (timeValue) {
        orderData.delivery_type = "time";
        orderData.delivery_time = timeValue;
    } else {
        orderData.delivery_type = "now";
        orderData.delivery_time = null;
    }

    // 2. Сохраняем обратно в localStorage
    localStorage.setItem(key, JSON.stringify(orderData));

    // 3. Закрываем модалку
    closeModal('editModal');

    // 4. Перерисовываем таблицу
    loadOrders();
};

//Глобальная функция закрытия модального окна
window.closeModal = function (id){
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'none';
    }
}

//Глобальная функция удаления заказа
window.deleteModal = function(id){
    window.deleteModal = function () {
    if (!currentEditOrderId) return;

    localStorage.removeItem(`OrderID${currentEditOrderId}`);
    currentEditOrderId = null;

    closeModal('deleteModal');
    loadOrders();
};
}



// закрытие по клику вне окна
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

//Разбирает дату, имеющуюся в orderData
function parseDate(dateStr) {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('.');
    const [hour, minute] = timePart.split(':');

    return new Date(year, month - 1, day, hour, minute);
}

//Функция, в которой каждому заказу определяется своё место в зависимости от того, какая у него более поздняя дата.
function getOrderRanksByDate() {
    const orders = [];

    // 1. Собираем все заказы
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key.startsWith('OrderID')) {
            const order = JSON.parse(localStorage.getItem(key));

            orders.push({
                key,
                createdAt: parseDate(order.created_at)
            });
        }
    }

    // 2. Сортируем по дате (новые → первыми)
    orders.sort((a, b) => b.createdAt - a.createdAt);

    // 3. Присваиваем номера
    const orderRanks = {};
    orders.forEach((order, index) => {
        orderRanks[order.key] = index + 1;
    });

    return orderRanks;
}

//Поиск блюд по id в dishes
function getDishNameById(id) {
    if (!id) return null;

    const dish = dishes.find(d => String(d.id) === String(id));
    return dish ? dish.name : null;
}

//Создание заказа в таблице заказов
function createTr(orderData, rank) {
    let tr = document.createElement('tr');

    const dishes = [
        getDishNameById(orderData.soup_id),
        getDishNameById(orderData.main_course_id),
        getDishNameById(orderData.salad_id),
        getDishNameById(orderData.drink_id),
        getDishNameById(orderData.dessert_id)
    ].filter(Boolean);

    const dishesText = dishes.join(', ');

    tr.innerHTML = `
        <td>${rank}</td>
        <td>${orderData.created_at}</td>
        <td>${dishesText}</td>
        <td>${orderData.full_price} Р</td>
        <td>
            ${orderData.delivery_type === "now"
                ? 'В течение дня<br>(с 07:00 до 23:00)'
                : orderData.delivery_time}
        </td>

        <td class="actions">
            <button class="actionButton" id="${orderData.id}" onclick="openModal('viewModal', this)"><img src="Images/tableicons/eye.svg"></button>
            <button class="actionButton" id="${orderData.id}" onclick="openModal('editModal', this)"><img src="Images/tableicons/pencil.svg"></button>
            <button class="actionButton" id="${orderData.id}" onclick="openModal('deleteModal', this)"><img src="Images/tableicons/trash.svg"></button>
        </td>
    `;
    tr.id = `OrderID${orderData.id}`
    tableWithOrders.appendChild(tr);
}

function loadOrders() {
    const orders = [];

    // 1. Собираем все заказы
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        if (key.startsWith('OrderID')) {
            const orderData = JSON.parse(localStorage.getItem(key));

            orders.push({
                ...orderData,
                createdAtDate: parseDate(orderData.created_at)
            });
        }
    }

    // 2. Сортируем: САМЫЕ НОВЫЕ → СВЕРХУ
    orders.sort((a, b) => b.createdAtDate - a.createdAtDate);

    // 3. Очищаем таблицу
    tableWithOrders.innerHTML = '';

    // 4. Рисуем таблицу ПО ПОРЯДКУ
    orders.forEach((order, index) => {
        createTr(order, index + 1);
    });
}

//Асинхронная функция, в которой сначала загружаются блюда, а потом заказы начинают отображаться в таблице заказов
async function init() {
    await loadDishes();   // ⏳ ждём блюда
    loadOrders();         // ✅ теперь можно
}

init();















