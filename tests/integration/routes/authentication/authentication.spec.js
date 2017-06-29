describe('INTEGRATION TESTS - AUTH ', () => {
  const defaultUser = {
    name: 'Usuário Padrão',
    email: 'usuario@padrao.com',
    password: '123456',
  };

  before(() => userModel.remove({}));

  describe('POST /admin/user/register', () => {
    it('should register and return the user');
  });

  describe('POST /admin/user/login', () => {
    it.skip('should return the login user', (done) => {
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

  it.skip('should failed the login', (done) => {
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
