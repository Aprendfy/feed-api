describe('INTEGRATION TESTS - CATEGORIES', () => {
  const defaultUser = {
    name: 'Usuário Padrão',
    email: 'usuario@padrao.com',
    password: '123456',
    type: 'PUBLISHER',
  };
  const defaultCategory = {
    name: 'Facebook',
    color: 'AAAAAA'
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
          defaultUser.authorization = res.body.payload.authorization;
          done(err);
        });
    });
  });

  describe('POST /app/categories/', () => {
    it('should return a new category', (done) => {
      const json = defaultCategory;
      request.post('/v1/app/categories/')
        .send(json)
        .set('Authorization', defaultUser.authorization)
        .end((err, res) => {
          const { payload } = res.body;
          expect(res.statusCode).to.be.equal(201);
          expect(payload).to.be.an('object').that.includes(defaultCategory);
          expect(payload._id).to.be.an('string');
          defaultCategory._id = payload._id;
          done(err);
        });
    });
  });

  describe('GET /app/categories/', () => {
    it('should return all categories', (done) => {
      request.get('/v1/app/categories/')
        .end((err, res) => {
          const { payload } = res.body;
          expect(res.statusCode).to.be.equal(200);
          expect(payload[0].name).to.be.equal(defaultCategory.name);
          done(err);
        });
    });
    it('should return one category', (done) => {
      request.get(`/v1/app/categories/${defaultCategory._id}`)
        .end((err, res) => {
          const { payload } = res.body;
          expect(res.statusCode).to.be.equal(200);
          expect(payload.name).to.be.equal(defaultCategory.name);
          done(err);
        });
    });
  });

  describe('PUT /app/categories/', () => {
    it('should update a category', (done) => {
      const json = {
        name: 'Mega Novo Facebook',
        color: 'FFFFFF'
      };
      request.put(`/v1/app/categories/${defaultCategory._id}`)
        .send(json)
        .set('Authorization', defaultUser.authorization)
        .end((err, res) => {
          const { payload } = res.body;
          expect(res.statusCode).to.be.equal(200);
          expect(payload.name).to.be.equal(json.name);
          done(err);
        });
    });
  });

  describe('DELETE /app/categories/', () => {
    it('should remove a category', (done) => {
      request.delete(`/v1/app/categories/${defaultCategory._id}`)
        .set('Authorization', defaultUser.authorization)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(200);
          done(err);
        });
    });
  });
});
