let chai = require('chai');
let chaiHttp = require('chai-http');
let www = require('../dist/bin/www.js');
let TemplateHTML = require('../dist/template/defaultIframe').default;

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
    it('should GET the html template', (done) => {
        chai.request(app)
            .get('/index.html')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.equal(TemplateHTML.startHTML + '测试\n' + TemplateHTML.endHTML);
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
