describe('INTEGRATION TESTS - POST ', () => {

  const text = 'Ainda assim, existem dúvidas a respeito de como a ' +
    'complexidade dos estudos efetuados exige a precisão e a definição dos índices pretendidos. ' +
    'Caros amigos, a execução dos pontos do programa apresenta tendências no sentido de aprovar a ' +
    'manutenção de alternativas às soluções ortodoxas.Nunca é demais lembrar o peso e o significado destes problemas, ' +
    'uma vez que a contínua expansão de nossa atividade não pode mais se dissociar do investimento em reciclagem técnica. ' +
    'No entanto, não podemos esquecer que a revolução dos costumes auxilia a preparação e a composição das posturas dos órgãos ' +
    'dirigentes com relação às suasatribuições. Do mesmo modo, o entendimento das metas propostas causa impacto indireto na reavaliação das ' +
    'novas proposições. A prática cotidiana prova que a estrutura atual da organização desafia a capacidade de equalização das direções ' +
    'preferenciais no sentido do progresso.Todavia, a necessidade de renovação processual garante a contribuição de um grupo importante na ' +
    'determinação dos métodos utilizados na avaliação de resultados.';

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
    body: text,
    image: 'http://i.huffpost.com/gen/3971736/images/o-HAPPY-PEOPLE-facebook.jpg',
  };

  before(() => {
    postModel.remove({});
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
          done(err);
        });
    });
  });
});
