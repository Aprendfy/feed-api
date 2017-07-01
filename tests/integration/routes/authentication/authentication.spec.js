describe('INTEGRATION TESTS - AUTH ', () => {
  const defaultUser = {
    name: 'Usuário Padrão',
    email: 'usuario@padrao.com',
    password: '123456',
    type: 'PUBLISHER',
  };

  before((done) => {
    userModel.remove({}).then(() => {
      done();
    }).catch(err => console.log(`Error on before ${err}`));
  });


  describe('POST /admin/auth/register', () => {
    it('should register and return the user', (done) => {
      request.post('/v1/admin/auth/register')
        .send(defaultUser)
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

  describe('POST /admin/auth/login', () => {
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
          expect(res.body.payload.authorization).to.be.a('string');
          done(err);
        });
    });
  });

  it('should failed the login', (done) => {
    const json = {
      email: 'usuario@padrao.com',
      password: '1234567',
    };
    request.post('/v1/admin/auth/login')
      .send(json)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(422);
        done(err);
      });
  });
});
