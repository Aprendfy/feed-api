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

  describe('UPDATE /admin/user/update', () => {
    it('should udpate a user', (done) => {
      const userUpdate = {
        name: 'Nome Trocado',
        userId: defaultUser.id,
      };
      request.put('/v1/admin/user/update')
        .send(userUpdate)
        .end((err, res) => {
          expect(userUpdate.name).to.be.eql(res.body.payload.name);
          done(err);
        });
    });
  });
});

