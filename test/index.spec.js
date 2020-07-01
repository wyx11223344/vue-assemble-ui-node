let chai = require('chai');
let chaiHttp = require('chai-http');
let www = require('../dist/bin/www.js');

let should = chai.should();
chai.use(chaiHttp);
let app = www.default.app;

describe('App', () => {
    it('should respond status 200', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('should respond status 404', (done) => {
        chai.request(app)
            .get('/wrongUrl')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
});
