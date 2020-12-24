var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
const htmlmock = require("../db/models/mock")
window = new JSDOM(htmlmock.mockTemplate).window;
global.document = window.document;
global.window = window;
global.localStorage = htmlmock.mocking();
global.fetch = require("node-fetch");
global.navigator = {
    userAgent: 'node.js'
};
const geolocate = require('mock-geolocation');
geolocate.use();
const fetchMock = require('fetch-mock');
const expect = require('chai').expect;
const sinon = require("sinon");
const script = require('../js/client');

const app = require('../js/app.js');
const conn = require('../db');
const PORT = process.env.PORT || 7000;

describe('Client part', function () {
    before((done) => {
        process.env.NODE_ENV = 'test';
        conn.connect()
            .then(() => {
                app.listen(PORT)
                done()
            })
            .catch((err) => done(err));
    })
    app

    after((done) => {
        conn.close()
            .then(() => {
                app.delete;
                done()
            })
            .catch((err) => done(err));
    })

    describe('Client testing: Load main city', () => {

        beforeEach(() => {
            localStorage.clear();
        })

        it('Load existed main city from local storage', (done) => {
            fetchMock.get(`${baseURL}/weather/coordinates?lat=25&lon=50`, htmlmock.mockCity);
            localStorage.setItem('lat', 25);
            localStorage.setItem('lon', 50);
            script.mockCities(() => {
                expect(document.querySelector('main > .main-info > .main-city')
                    .innerHTML.replace(/\s+/g, ' ')).to.equal(htmlmock.mockMainInfoSection);
                expect(document.querySelector('.info')
                    .innerHTML.replace(/\s+/g, ' ')).to.equal(htmlmock.mockInfoTemplate)
                fetchMock.done();
                fetchMock.restore();
                done();
            });
        })

        it('Load main city by position', (done) => {
            fetchMock.get(`${baseURL}/weather/coordinates?lat=1&lon=2`, htmlmock.mockCity);
            script.mockCities(() => {
                expect(document.querySelector('main > .main-info > .main-city')
                    .innerHTML.replace(/\s+/g, ' ')).to.equal(htmlmock.mockMainInfoSection);
                expect(document.querySelector('.info')
                    .innerHTML.replace(/\s+/g, ' ')).to.equal(htmlmock.mockInfoTemplate);
                fetchMock.done();
                fetchMock.restore();
                done();
            });
            geolocate.send({latitude: 1, longitude: 2});
        })

        it('Load default main city', (done) => {
            fetchMock.get(`${baseURL}/weather/coordinates?lat=59.894444&lon=30.264168`, htmlmock.mockCity);
            script.mockCities(() => {
                expect(document.querySelector('main > .main-info > .main-city').innerHTML.replace(/\s+/g, ' ')).to.equal(htmlmock.mockMainInfoSection);
                expect(document.querySelector('.info')
                    .innerHTML.replace(/\s+/g, ' ')).to.equal(htmlmock.mockInfoTemplate)
                fetchMock.done();
                fetchMock.restore();
                done();
            });
            geolocate.sendError({code: 1, message: "DENIED"});
        })

        it('Load main city with error', (done) => {
            fetchMock.get(`${baseURL}/weather/coordinates?lat=14&lon=48`, 500);
            localStorage.setItem('lat', 14);
            localStorage.setItem('lon', 48);
            script.mockCities(() => {
                expect(document.querySelector('main > .main-info > .main-city')
                    .innerHTML.replace(/\s+/g, ' ')).to.equal(htmlmock.mockErrorElem);
                fetchMock.done();
                fetchMock.restore();
                done();
            });
        })
    })

    describe('Client testing: Add favourite city', () => {

        beforeEach(() => {
            window = new JSDOM(htmlmock.mockTemplate).window;
            global.document = window.document;
            global.window = window;
        })

        it('Add city with ok response from server', (done) => {
            fetchMock.post(`${baseURL}/favourites`, {});
            fetchMock.get(`${baseURL}/weather/city?q=${'Tolyatti'}`, htmlmock.mockCity);
            script.mockNewCity('Tolyatti', () => {
                expect(document.querySelector('main > .favourite > .cities').lastChild.innerHTML.replace(/\s+/g, ' ')).to.equal(htmlmock.mockCityElem);
                fetchMock.done();
                fetchMock.restore();
                done();
            });
        })

        it('Add city with error response from server', (done) => {
            fetchMock.get(`${baseURL}/weather/city?q=${'Tolyatti'}`, htmlmock.mockCity);
            fetchMock.post(`${baseURL}/favourites`, 500);
            script.mockNewCity('Tolyatti', () => {
                expect(document.querySelector('main > .favourite > .cities').lastChild.lastElementChild.innerHTML.replace(/\s+/g, ' ')).to.equal(htmlmock.mockErrorCity);
                fetchMock.restore();
                done();
            });
        })
    })

    describe('Client testing: Get favourites cities', () => {

        beforeEach(() => {
            window = new JSDOM(htmlmock.mockTemplate).window;
            global.document = window.document;
            global.window = window;
        })

        it('Get cities ok response from server', (done) => {
            fetchMock.get(`${baseURL}/favourites`, ['Tolyatti']);
            fetchMock.get(`${baseURL}/weather/city?q=${'Tolyatti'}`, htmlmock.mockCity);
            script.mockFavCities(() => {
                expect(document.querySelector('main > .favourite > .cities').lastChild.innerHTML.replace(/\s+/g, ' ')).to.equal(htmlmock.mockCityElem);
                fetchMock.done();
                fetchMock.restore();
                done();
            });
        })

        it('Get cities with error response from server', (done) => {
            fetchMock.get(`${baseURL}/favourites`, 500);
            script.mockFavCities(() => {
                expect(document.documentElement.innerHTML.replace(/\s+/g, ' ')).to.equal(htmlmock.mockTemplate.replace(/\s+/g, ' '));
                fetchMock.done();
                fetchMock.restore();
                done();
            });
        })

        it('Get cities with bad network', (done) => {
            fetchMock.get(`${baseURL}/weather/city?q=${'Tolyatti'}`, 500);
            fetchMock.get(`${baseURL}/favourites`, ['Tolyatti']);
            script.mockFavCities(() => {
                expect(document.querySelector('main > .favourite > .cities').lastChild.lastElementChild.innerHTML.replace(/\s+/g, ' ')).to.equal(htmlmock.mockErrorCity);
                fetchMock.done();
                fetchMock.restore();
                done();
            });
        })
    })
});