describe('INTEGRATION TESTS - POST ', () => {
  const defaultUser = {
    name: 'Usuário Padrão',
    email: 'usuario@padrao.com',
    password: '123456',
    type: 'PUBLISHER',
  };

  const defaultPost = {
    title: 'Criar uma Página no Facebook',
    category: 'Facebook',
    readingTime: '4 minutos',
    level: 'Iniciante',
    body: 'Ainda assim, existem dúvidas a respeito de como a',
    image: 'http://i.huffpost.com/gen/3971736/images/o-HAPPY-PEOPLE-facebook.jpg',
  };

  const facebookPost = { ...defaultPost, category: 'Facebook', ownerId: '595ad0f2d6b1670d78158cdd' };

  before((done) => {
    postModel.remove({})
      .then(() => {
        const Post = postModel;
        new Post(facebookPost)
          .save()
          .then(() => done());
      })
      .catch(err => console.log(`Error on before ${err}`));
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

  describe('POST /app/posts/', () => {
    it('should return the inserted post', (done) => {
      const json = defaultPost;
      request.post('/v1/app/posts/')
        .send(json)
        .set('Authorization', defaultUser.authorization)
        .end((err, res) => {
          const { payload } = res.body;
          expect(res.statusCode).to.be.equal(201);
          expect(payload).to.be.an('object').that.includes(defaultPost);
          expect(payload._id).to.be.an('string');
          defaultPost._id = payload._id;
          done(err);
        });
    });
  });

  describe('PUT /app/posts/:postId', () => {
    it('should return the updated post', (done) => {
      const postUpdate = {
        title: 'Titulo atualizado',
        category: 'Twitter',
        readingTime: '5 minutos',
        level: 'Avançado',
        body: 'Body atualizado',
        image: 'novaImage.jpg',
      };
      request.put(`/v1/app/posts/${defaultPost._id}`)
        .send(postUpdate)
        .set('Authorization', defaultUser.authorization)
        .end((err, res) => {
          const { payload } = res.body;
          expect(res.statusCode).to.be.equal(200);
          expect(payload).to.be.an('object').that.includes(postUpdate);
          expect(payload._id).to.be.eql(defaultPost._id);
          done(err);
        });
    });
  });

  describe('GET /app/posts/', () => {
    it('should return all post from one category', (done) => {
      const category = facebookPost.category;
      request.get(`/v1/app/posts/?category=${category}`)
        .end((err, res) => {
          const { payload } = res.body;

          expect(res.statusCode).to.be.equal(200);
          expect(payload).to.be.an('array');
          expect(payload).to.satisfy(posts => posts.every(post => post.category === category));

          done(err);
        });
    });
  });
});
