process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const request = require('request');
const sinon = require('sinon');
require('sinon-mongoose');
require('sinon-mongo');
const mock = require("../db/models/mock")
// require('sinon-as-promised');
const app = require('../js/app.js');
const conn = require('../db');
const City = require('../db/models/city.js').City;
chai.use(chaiHttp);

const apiKey = '315bdb45e49dcae9a4a9512b11a04583';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';
describe('Server part', () =>{
describe('Server testing: DELETE /favourites', () => {
    before((done) => {
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    })

    after((done) => {
        conn.close()
            .then(() => done())
            .catch((err) => done(err));
    })

    it('ok response from weather database', (done) => {

        const city = new City({
            city: "Paris"
        });

        city.save(city)

        chai.request(app)
            .delete('/favourites')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(`num1=${0}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    })


})

describe('Server testing: GET /favourites', () => {
    before((done) => {
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    })

    after((done) => {
        conn.close()
            .then(() => done())
            .catch((err) => done(err));
    })

    it('200 (ok) response', (done) => {

        const city = new City({
            city: "Paris"
        });

        city.save(city)
        chai.request(app)
            .get('/favourites')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.eql(['Paris'])
                done();
            });
    })

    it('500 (error) response', (done) => {
        mockCity = sinon.mock(City);
        sinon.mock(City)
            .expects('find')
            .chain('exec')
            .rejects(new Error(), null);
        chai.request(app)
            .get('/favourites')
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    })
})

describe('Server testing: POST /favourites', () => {
    before((done) => {
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    })

    after((done) => {
        conn.close()
            .then(() => done())
            .catch((err) => done(err));
    })

    it('200 (ok) response', (done) => {

        chai.request(app)
            .post('/favourites')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send(`name=Paris`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    })

    it('500 (error) response', (done) => {

        Object.defineProperty(City.prototype, 'save', {
            value: City.prototype.save,
            configurable: true,
        });

        const mock = sinon.mock(City.prototype);
        mock.expects('save').rejects(new Error());
        chai.request(app)
            .post('/favourites')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send("name=Paris")
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    })
})

describe('Server testing: GET /weather/city', () => {
    before((done) => {
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    })

    after((done) => {
        conn.close()
            .then(() => done())
            .catch((err) => done(err));
    })
    it('200(ok) response', (done) => {
        requestMock = sinon.mock(request);
        requestMock.expects("get")
            .once()
            .withArgs(`${baseURL}?q=Paris&appid=${apiKey}`)
            .yields(null, mock.rspObj, JSON.stringify(mock.rspBody));

        chai.request(app)
            .get('/weather/city?q=Paris')
            .end((err, res) => {
                console.log(res.body)
                res.should.have.status(200);
                res.body.should.eql(mock.rspBody);
                requestMock.verify();
                requestMock.restore();
                done();
            });
    })

    it('500(error) response', (done) => {
        const city = 'Paris'

        const mock = sinon.mock(request);
        mock.expects("get")
            .once()
            .withArgs(`${baseURL}?q=${city}&appid=${apiKey}`)
            .yields(new Error(), null, null);
        chai.request(app)
            .get('/weather/city?q=' + city)
            .end((err, res) => {
                res.should.have.status(500);
                mock.restore();
                done();
            });
    })
})

describe('Server testing: GET /weather/coordinates', () => {
    before((done) => {
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    })

    after((done) => {
        conn.close()
            .then(() => done())
            .catch((err) => done(err));
    })
    it('200 (ok) response', (done) => {
        requestMock = sinon.mock(request);
        requestMock.expects("get")
            .once()
            .withArgs(`${baseURL}?lat=${'23.75'}&lon=${'45.78'}&appid=${apiKey}`)
            .yields(null, mock.rspObj, JSON.stringify(mock.rspBody));

        chai.request(app)
            .get(`/weather/coordinates?lat=${'23.75'}&lon=${'45.78'}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.eql(mock.rspBody);
                requestMock.verify();
                requestMock.restore();
                done();
            });
    })

    it('500 (error) response', (done) => {
        requestMock = sinon.mock(request);
        requestMock.expects("get")
            .once()
            .withArgs(`${baseURL}?lat=${'23.75'}&lon=${'45.78'}&appid=${apiKey}`)
            .yields(new Error(), null, null);

        chai.request(app)
            .get(`/weather/coordinates?lat=${'23.75'}&lon=${'45.78'}`)
            .end((err, res) => {
                res.should.have.status(500);
                requestMock.verify();
                requestMock.restore();
                done();
            });
    })
})
})


