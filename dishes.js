export let dishes = [
    //Супы
    {
        keyword: 'gazpacho',
        name:'Гаспачо',
        price:'195',
        category: 'soup',
        count: '350 г',
        image: 'Images/soups/gazpacho.jpg',
        kind:'veg'
    },
    {
        keyword: 'mushroom',
        name:'Грибной суп-пюре',
        price:'185',
        category: 'soup',
        count: '330 г',
        image: 'Images/soups/mushroom_soup.jpg',
        kind:'veg'
    },
    {
        keyword: 'norwegian',
        name:'Норвежский суп',
        price:'270',
        category: 'soup',
        count: '330 г',
        image: 'Images/soups/norwegian_soup.jpg',
        kind:'fish'
    },
    {
        keyword: 'ramen',
        name:'Рамен',
        price:'375',
        category: 'soup',
        count: '425 г',
        image: 'Images/soups/ramen.jpg',
        kind:'meat'
    },
    {
        keyword: 'tomyum',
        name:'Том ям с креветками',
        price:'650',
        category: 'soup',
        count: '500 г',
        image: 'Images/soups/tomyum.jpg',
        kind:'fish'
    },
    {
        keyword: 'chickensoup',
        name:'Куриный суп',
        price:'330',
        category: 'soup',
        count: '350 г',
        image: 'Images/soups/chicken.jpg',
        kind:'meat'
    },
    //Главные блюда
    {
        keyword: 'potato',
        name:'Жареная картошка с грибами',
        price:'150',
        category: 'mainDish',
        count: '250 г',
        image: 'Images/main_dish/friedpotatoes.jpg',
        kind:'veg'
    },
    {
        keyword: 'lasagna',
        name:'Лазанья',
        price:'385',
        category: 'mainDish',
        count: '310 г',
        image: 'Images/main_dish/lasagna.jpg',
        kind:'meat'
    },
    {
        keyword: 'cutlets',
        name:'Котлеты из курицы с картофельным пюре',
        price:'225',
        category: 'mainDish',
        count: '280 г',
        image: 'Images/main_dish/chickencutle.jpg',
        kind:'meat'
    },
    {
        keyword: 'fishrice',
        name:'Рыбная котлета с рисом и спаржей',
        price:'320',
        category: 'mainDish',
        count: '270 г',
        image: 'Images/main_dish/fishrice.jpg',
        kind:'fish'
    },
    {
        keyword: 'pizza',
        name:'Пицца Маргарита',
        price:'450',
        category: 'mainDish',
        count: '470 г',
        image: 'Images/main_dish/pizza.jpg',
        kind:'veg'
    },
    {
        keyword: 'shrimppasta',
        name:'Паста с креветками',
        price:'340',
        category: 'mainDish',
        count: '280 г',
        image: 'Images/main_dish/shrimppasta.jpg',
        kind:'fish'
    },
    //Салаты или стартеры
    {
        keyword: 'saladwithegg',
        name:'Корейский салат с овощами и яйцом',
        price:'330',
        category: 'salad',
        count: '250 г',
        image: 'Images/salads_starters/saladwithegg.jpg',
        kind:'veg'
    },
    {
        keyword: 'caesar',
        name:'Цезарь с цыпленком',
        price:'370',
        category: 'salad',
        count: '220 г',
        image: 'Images/salads_starters/caesar.jpg',
        kind:'meat'
    },
    {
        keyword: 'caprese',
        name:'Капрезе с моцареллой',
        price:'350',
        category: 'salad',
        count: '235 г',
        image: 'Images/salads_starters/caprese.jpg',
        kind:'veg'
    },
    {
        keyword: 'tunasalad',
        name:'Салат с тунцом',
        price:'480',
        category: 'salad',
        count: '250 г',
        image: 'Images/salads_starters/tunasalad.jpg',
        kind:'fish'
    },
    {
        keyword: 'frenchfries1',
        name:'Картофель фри с соусом Цезарь',
        price:'280',
        category: 'salad',
        count: '235 г',
        image: 'Images/salads_starters/frenchfries1.jpg',
        kind:'veg'
    },
    {
        keyword: 'frenchfries2',
        name:'Картофель фри с кетчупом',
        price:'260',
        category: 'salad',
        count: '235 г',
        image: 'Images/salads_starters/frenchfries2.jpg',
        kind:'veg'
    },
    //Напитки
    {
        keyword: 'orange',
        name:'Апельсиновый сок',
        price:'120',
        category: 'juice',
        count: '300 мл',
        image: 'Images/beverages/orangejuice.jpg',
        kind:'cold'
    },
    {
        keyword: 'apple',
        name:'Яблочный сок',
        price:'90',
        category: 'juice',
        count: '300 мл',
        image: 'Images/beverages/applejuice.jpg',
        kind:'cold'
    },
    {
        keyword: 'carrot',
        name:'Морковный сок',
        price:'110',
        category: 'juice',
        count: '300 мл',
        image: 'Images/beverages/carrotjuice.jpg',
        kind:'cold'
    },
     {
        keyword: 'cappuccino',
        name:'Капучино',
        price:'180',
        category: 'juice',
        count: '300 мл',
        image: 'Images/beverages/cappuccino.jpg',
        kind:'hot'
    },
    {
        keyword: 'greentea',
        name:'Зелёный чай',
        price:'100',
        category: 'juice',
        count: '300 мл',
        image: 'Images/beverages/greentea.jpg',
        kind:'hot'
    },
    {
        keyword: 'tea',
        name:'Чёрный чай',
        price:'90',
        category: 'juice',
        count: '300 мл',
        image: 'Images/beverages/tea.jpg',
        kind:'hot'
    },
    //Десерты
    {
        keyword: 'baklava',
        name:'Паклава',
        price:'220',
        category: 'dessert',
        count: '300 г',
        image: 'Images/desserts/baklava.jpg',
        kind:'middle'
    },
    {
        keyword: 'cheesecake',
        name:'Чизкейк',
        price:'240',
        category: 'dessert',
        count: '125 г',
        image: 'Images/desserts/cheesecake.jpg',
        kind:'small'
    },
    {
        keyword: 'chocolatecheesecake',
        name:'Шоколадный чизкейк',
        price:'260',
        category: 'dessert',
        count: '125 г',
        image: 'Images/desserts/chocolatecheesecake.jpg',
        kind:'small'
    },
    {
        keyword: 'chocolatecake',
        name:'Шоколадный торт',
        price:'270',
        category: 'dessert',
        count: '140 г',
        image: 'Images/desserts/chocolatecake.jpg',
        kind:'small'
    },
    {
        keyword: 'donuts1',
        name:'Пончики (3 штуки)',
        price:'410',
        category: 'dessert',
        count: '350 г',
        image: 'Images/desserts/donuts1.jpg',
        kind:'middle'
    },
    {
        keyword: 'donuts2',
        name:'Пончики (6 штук)',
        price:'650',
        category: 'dessert',
        count: '700 г',
        image: 'Images/desserts/donuts2.jpg',
        kind:'big'
    }
];