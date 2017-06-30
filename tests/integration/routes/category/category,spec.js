describe('INTEGRATION TEST - CATEGORIES', () => {
  const defaultCategory = {
    name: 'Facebook',
  };
  before((done) => {
    categoryModel
      .remove({})
      .then(() => done())
      .catch((err) => {
        console.log(`Limpar Collection de Categoria error ${err}`);
      });
  });

  describe('POST /admin/user/login', () => {
    it('should return the login user', (done) => {
      const json = {
        email: 'usuario@padrao.com',
        password: '123456',
      };
      request.post('/v1/admin/auth/login')
        .send(json)
        .end((err, res) => {
          expect(defaultUser.name).to.be.eql(res.body.payload.name);
          expect(defaultUser.email).to.be.eql(res.body.payload.email);
          expect(res.statusCode).to.be.equal(200);
          done(err);
        });
    });
  });

  describe('POST /admin/user/register', () => {
    it('should register and return the user', (done) => {
      const body = {
        name: 'Facebook',
      };

      request.post('/v1/admin/auth/register')
        .send(body)
        .set('Authorization', `JWT ${token}`)
        .end((err, res) => {
          const { payload } = res.body;
          expect(res.statusCode).to.be.equal(201);
          expect(payload.name).to.be.eql(defaultUser.name);
          expect(payload.email).to.be.eql(defaultUser.email);
          expect(payload.type).to.be.eql(defaultUser.type);
          expect(payload.authorization).to.be.a('string');
          done(err);
        });
    });
  });

});

