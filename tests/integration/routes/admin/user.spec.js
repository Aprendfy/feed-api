/*  global describe  beforeEach userModel it expect request */

describe('INTEGRATION TESTS - USER ', () => {

  const defaultUser = {
    name: 'Usuário Padrão',
    email: 'usuario@padrao.com',
    password: '123456',
  };

  beforeEach((done) => {
    userModel
      .remove({})
      .then(() => {
        userModel
          .create(defaultUser)
          .then((result) => {
            defaultUser.id = result._id;
            return done();
          })
          .catch((err) => {
            console.log('Error Create defaultUser', err);
          });
      })
      .catch((err) => {
        console.log('Error ao Limpar o banco', err);
      });
  });

  describe('GET /admin/user/{id}', () => {
    it('should return a user', (done) => {
      request
        .get(`/v1/admin/user/${defaultUser.id}`)
        .end((err, res) => {
          expect(defaultUser.name).to.be.eql(res.body.payload.name);
          expect(defaultUser.email).to.be.eql(res.body.payload.email);
          done(err);
        });
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
