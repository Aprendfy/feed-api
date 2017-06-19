describe('Test ', () => {
  const response = 'teste';
  describe('test de rota', () => {
    it('assert', done => {
      expect('teste').to.be.eql(response);
      done();
    });
  });

  describe('GET /admin/user/ping', () => {
    it('should get pong as awaser', done => {
      request
      .get('/v1/admin/user/ping')
      .end((err, res) => {
        expect('ping').to.be.eql(res.body.payload);      
        done(err);
      });
    });
  });

});