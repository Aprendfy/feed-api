describe('INTEGRATION TESTS - USER ', () => {
  
  let defaultUser = {
      name: "Usuário Padrão",
      email: 'usuario@padrao.com',
      password: '123456',
  };

  beforeEach(function (done) {
      userModel
          .remove({})
          .then(function () {
              userModel
                  .create(defaultUser)
                  .then(function (result) {
                      defaultUser._id = result._id;
                      return done();
                  })
                  .catch(function (err) {
                      console.log("Error Create defaultUser", err);
                  });
          })
          .catch(function (err) {
              console.log("Error ao Limpar o banco", err);
          });
  });
  
  describe('GET /admin/user/{id}', () => {
    it('should return a user', done => {
      request
        .get(`/v1/admin/user/${defaultUser._id}`)
        .end((err, res) => {
          expect(defaultUser._id).to.be.eql(res.body.payload._id);
          expect(defaultUser.name).to.be.eql(res.body.payload.name);
          done(err);
        })
    });
  });

  describe('GET /admin/user/ping', () => {
    it('should get ping as answer', done => {
      request
      .get('/v1/admin/user/ping')
      .end((err, res) => {
        expect('ping').to.be.eql(res.body.payload);      
        done(err);
      });
    });
  });

});