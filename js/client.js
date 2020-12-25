baseURL = 'http://localhost:7000';
var callback = null;

listeners();
cities();
favCities();
//Listeners
function listeners() {
    document.querySelector('.add-city').addEventListener('submit', (event) => {
        event.preventDefault();
        addNewCity(document.querySelector('.input-city').value);
    });

    document.querySelector('.update-btn').addEventListener('click', (event) => {
        getPosition();
    });

    document.querySelector('.update-btn-image').addEventListener('click', (event) => {
        getPosition();
    });
}

function cities() {
    if (localStorage.getItem('lat') == null || localStorage.getItem('lon') == null) {
        getPosition();
    } else {
        addMainCity(localStorage.getItem('lat'), localStorage.getItem('lon'));
    }
}

// Handlers
function getPosition() {
    navigator.geolocation.getCurrentPosition(posHandler, errHandler);
}

function posHandler(position) {
    addMainCity(position.coords.latitude, position.coords.longitude);
}

function errHandler(err) {
    addMainCity(59.894444, 30.264168);
}

//Methods
function addNewCity(cityInput){
    let cityElem = addCity(cityInput);
    fetch(`${baseURL}/weather/city?q=${cityInput}`).then(resp => resp.json()).then(data => {
        if (data.name !== undefined) {
            putCity(data, cityElem);
        } else {
            alert('Город не найден');
            cityElem.remove();
        }
    }).catch(function () {
        cityElem.lastElementChild.innerHTML = `<p class="wait-city">Что-то пошло не так</p>`
        exec();
    });
    document.querySelector('.input-city').value = "";
}

function putCity(data, cityElem) {
    fetch(`${baseURL}/favourites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        body: `name=${data.name}`
    }).then(rsp => rsp.json()).then(() => {
        console.log(data);
        addInfo(data);
        exec();
    }).catch(function () {
        cityElem.lastElementChild.innerHTML = `<p class="wait-city">Что-то пошло не так</p>`;
        exec();
    });
}

function addMainCity(lat, lon) {
    fetch(`${baseURL}/weather/coordinates?lat=${lat}&lon=${lon}`).then(resp => resp.json()).then(data => {
        let temp = Math.round(data.main.temp - 273) + '°';
        document.querySelector('main > .main-info > .main-city').innerHTML = '';
        document.querySelector('main > .main-info > .main-city').appendChild(mainCityTemplate(data.name, data.weather[0]['icon'], temp));
        document.querySelector('.info').innerHTML = '';
        document.querySelector('.info').appendChild(info(data));
        exec();
    }).catch(function () {
        document.querySelector('main > .main-info > .main-city').innerHTML = `<p class="wait">Что-то пошло не так</p>`
        exec();
    });
}

function mainCityTemplate(name, icon, temp) {
    let template = document.querySelector('#main-city');
    template.content.querySelector('h3').textContent = name;
    template.content.querySelector('.main-weather > .main-weather-img').setAttribute('src', `https://openweathermap.org/img/wn/${icon}@2x.png`);
    template.content.querySelector('.main-weather > .main-temp').textContent = temp;
    return template.content.cloneNode(true);
}

function favCities() {
    fetch(`${baseURL}/favourites`).then(resp => resp.json()).then(data => {
        console.log(data);
        let favoritesCities = data ? data : [];
        for (let i = 0; i < favoritesCities.length; i++) {
            addCity(favoritesCities[i]);
        }
        let citySet = new Set(favoritesCities);
        for (let favoriteCity of citySet) {
            fetchCity(favoriteCity)
        }
    }).catch(function () {exec();});
}

function fetchCity(city) {
    fetch(`${baseURL}/weather/city?q=${city}`).then(resp => resp.json()).then(data => {
        addInfo(data);
        exec()
    }).catch(err => {
        document.querySelectorAll(`.${city} > .info`).forEach( item => {
            item.innerHTML = `<p class="wait-city">Что-то пошло не так</p>`;
        });
        exec();
    });
}

function addCity(cityName) {
    cityName = format(cityName);
    let elem = cityTemplate(cityName);
    let city = document.querySelector('main > .favourite > .cities').appendChild(elem);
    let btn = city.firstElementChild.lastElementChild;
    btn.addEventListener( 'click' , (event) => {
        city = event.currentTarget.parentNode.parentNode;
        console.log(city);
        cityName = city.getAttribute('class');
        i = 0;
        let prevSibling = city;
        while (prevSibling.previousElementSibling) {
            prevSibling = prevSibling.previousElementSibling;
            i++;
        }

        fetch(`${baseURL}/favourites`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            body: `num1=${i}`
        }).then(resp => resp.json()).then((resp) => {
            city.remove();
        }).catch(err => {
            alert("City wasn't deleted");
        });
    });
    return elem;
}

function cityTemplate(city) {
    let template = document.querySelector('#city');
    template.content.firstElementChild.setAttribute('class', city);
    template.content.querySelector('.city-weather > h3').textContent = city;
    return template.content.cloneNode(true).firstElementChild;
}

function addInfo(data) {
    let temp = Math.round(data.main.temp - 273) + '&deg;';
    let cityNameClass = format(data.name)
    document.querySelectorAll(`.${cityNameClass} > .city-weather > h3`).forEach( item => {
        if (item.parentNode.children.length == 2) {
            item.insertAdjacentHTML('afterend', `
   				<p class="temp">${temp}</p>
   				<img class="picture" src="https://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png">
   			`);
        }
    });
    document.querySelectorAll(`.${cityNameClass} > .info`).forEach(item => {
        item.innerHTML = '';
        item.appendChild(info(data));
    });
}

function info(data) {
    let template = document.querySelector('#info-template');
    let p = template.content.querySelectorAll('.weather-property > p');
    p[0].textContent = `${data.wind.speed} m/s, ${wind(data.wind.deg)}`;
    p[1].textContent = `${data.clouds.all} %`;
    p[2].textContent = `${data.main.pressure} hpa`;
    p[3].textContent = `${data.main.humidity} %`;
    p[4].textContent = `[${data.coord.lon} ${data.coord.lat}]`;
    return template.content.cloneNode(true);
}

function wind(deg) {
    if (deg < 22.5 || deg >= 337.5) {
        return 'North';
    } else if (deg < 67.5) {
        return 'North-East';
    } else if (deg < 112.5) {
        return 'East';
    } else if (deg < 157.5) {
        return 'South-East';
    } else if (deg < 202.5) {
        return 'South';
    } else if (deg < 247.5) {
        return 'South-West';
    } else if (deg < 292.5) {
        return 'West';
    } else {
        return 'North-West'
    }
}

function format(str) {
    return (!str) ? str : str.replace(/\s/g, '')[0].toUpperCase() + str.replace(/\s/g, '').slice(1);
}

//Exec callback
function exec() {
    if (callback == null) {
        return;
    } else {
        try {
            callback();
            callback = null;
        } catch(err) {
            console.log(err);
            callback = null;
        }
    }
};

//Exporting methods
mockCities = function(mockCallback) {
    callback = mockCallback;
    cities();
};

mockNewCity = function(city, mockCallback) {
    callback = mockCallback;
    addNewCity(city);
};

mockFavCities = function(mockCallback) {
    callback = mockCallback;
    favCities();
};

module.exports = {
    mockCities: mockCities,
    mockNewCity: mockNewCity,
    mockFavCities: mockFavCities
};


