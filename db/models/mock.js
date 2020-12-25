mockTemplate = `<head>
    <meta charset="UTF-8">
    <title>Weather</title>
    <link rel="stylesheet" href="css/default.css">
</head>
<body>
<header class="weather-header">
    <h1 class="title">Погода здесь</h1>
    <button class="update-btn" type="button" name="renewLocation">Обновить геолокацию</button>
    <button class="update-btn-image"></button>
</header>
<main class="container">
    <section class="main-info">
        <div class="main-city">
            <p class="wait"></p>
        </div>
        <ul class="info">
        </ul>
    </section>
    <section class="favourite">
        <div class="fav-city">
            <h2>Избранное</h2>
            <form class="add-city">

                <input class="input-city" type="text" placeholder="Добавить новый город">

                <button class="btn-plus"></button>
            </form>
        </div>
        <ul class="cities">
        </ul>
    </section>

    <template id="main-city">
        <h3></h3>
        <div class="main-weather">
            <img src="" class="main-weather-img">
            <p class="main-temp"></p>
        </div>

    </template>

    <template id="info-template">
        <li class="weather-property">
            <h4>Ветер</h4>
            <p></p>
        </li>

        <li class="weather-property">
            <h4>Облачность</h4>
            <p></p>
        </li>

        <li class="weather-property">
            <h4>Давление</h4>
            <p></p>
        </li>

        <li class="weather-property">
            <h4>Влажность</h4>
            <p></p>
        </li>

        <li class="weather-property">
            <h4>Координаты</h4>
            <p></p>
        </li>
    </template>

    <template id="city">
        <li class="">
            <div class="city-weather">
                <h3></h3>
                <button class="btn"></button>
            </div>
            <ul class="info">
                <p class="wait-city">Подождите, данные загружаются</p>
            </ul>
        </li>
    </template>
</main>
</body>`

mockCity = {
    base: "stations",
    clouds: {all: 33},
    cod: 200,
    coord: {lon: 14, lat: 48},
    main: {temp: 257.15, feels_like: 252.98, temp_min: 257.15, temp_max: 257.15, pressure: 981, humidity: 75},
    name: "Tolyatti",
    weather: [{
        description: "rain",
        icon: "10n",
        id: 701,
        main: "Rain"}],
    wind: {speed: 1, deg: 350}
};

mockMainInfoSection = `
		<h3>Tolyatti</h3>
		<div class="main-weather">
		<img src="https://openweathermap.org/img/wn/10n@2x.png" class="main-weather-img">
		<p class="main-temp">-16°</p>
		</div>
	`.replace(/\s+/g,' ');

mockInfoTemplate = `
		<li class="weather-property"> <h4>Ветер</h4> <p>1 m/s, North</p> </li> 
		<li class="weather-property"> <h4>Облачность</h4> <p>33 %</p> </li> 
		<li class="weather-property"> <h4>Давление</h4> <p>981 hpa</p> </li>       	 
		<li class="weather-property"> <h4>Влажность</h4> <p>75 %</p> </li> 
		<li class="weather-property"> <h4>Координаты</h4> <p>[14 48]</p> </li>
	`.replace(/\s+/g,' ');

mockCityElem = `
        <div class="city-weather">
		<h3>Tolyatti</h3>
		<p class="temp">-16°</p>
		<img class="picture" src="https://openweathermap.org/img/wn/10n@2x.png">
		<button class="btn"></button>
		</div>
		<ul class="info">
		<li class="weather-property"> <h4>Ветер</h4> <p>1 m/s, North</p> </li> 
		<li class="weather-property"> <h4>Облачность</h4> <p>33 %</p> </li> 
		<li class="weather-property"> <h4>Давление</h4> <p>981 hpa</p> </li>       	 
		<li class="weather-property"> <h4>Влажность</h4> <p>75 %</p> </li> 
		<li class="weather-property"> <h4>Координаты</h4> <p>[14 48]</p> </li>
        </ul> `.replace(/\s+/g,' ')

mockErrorElem = `<p class="wait">Что-то пошло не так</p>`.replace(/\s+/g,' ');

mockErrorCity = `<p class="wait-city">Что-то пошло не так</p>`.replace(/\s+/g,' ');

mockBadNetwork = `<p class="wait-city">Подождите, данные загружаются</p>`.replace(/\s+/g,' ');

function mocking() {
    let storage = {};

    return {
        setItem: function(key, value) {
            storage[key] = value || '';
        },
        getItem: function(key) {
            return key in storage ? storage[key] : null;
        },
        removeItem: function(key) {
            delete storage[key];
        },
        get length() {
            return Object.keys(storage).length;
        },
        key: function(i) {
            const keys = Object.keys(storage);
            return keys[i] || null;
        },
        clear: function() {
            storage = {}
        }
    };
};

rspBody = {
    "coord": {
        "lon": 45.78,
        "lat": 23.75
    },
    "weather": [
        {
            "id": 700,
            "main": "Rain",
            "description": "rain",
            "icon": "10n"
        }
    ]
};

rspObj = {
    statusCode: 200
};

module.exports = {mockCity: mockCity,
    mockMainInfoSection: mockMainInfoSection,
    mockInfoTemplate: mockInfoTemplate,
    mockErrorElem: mockErrorElem,
    mockCityElem: mockCityElem,
    mockErrorCity: mockErrorCity,
    mockBadNetwork: mockBadNetwork,
    mockTemplate: mockTemplate,
    rspBody: rspBody,
    rspObj: rspObj,
    mocking: mocking}