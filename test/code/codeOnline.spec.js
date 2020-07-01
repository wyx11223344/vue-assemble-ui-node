let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../../dist/bin/www.js').default.wwwFunction.app;
let TemplateHTML = require('../../dist/template/defaultIframe').default;

let should = chai.should();
chai.use(chaiHttp);

describe('codeOnline', () => {

    it('should GET the html template', (done) => {
        chai.request(app)
            .post('/code/codeOnline/setHtml', {
                findId: 'ceshiCode',
                sendHtml: '测试\n'
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.equal('true');
                done();
            });
    });
});
