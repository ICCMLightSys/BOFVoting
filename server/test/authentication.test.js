let authentication = require('../src/modules/authentication.js');

describe('the authentication module', function () {
  describe('#signIn', function () {
    const fakeUserStore = {
      async checkPassword(email, password) {
        return password === 'password';
      },
    };

    it('should generate a token given valid credentials', async function () {
      let generatedToken = await authentication.signIn('someone@somewhere.com', 'password', fakeUserStore);

      expect(typeof generatedToken).toBe('string');
    });

    it('should return false given invalid credentials', async function () {
      let result = await authentication.signIn('someone@somewhere.com', 'notthepassword', fakeUserStore);

      expect(result).toBe(false);
    });
  });

  describe('#validateToken', () => {
    let validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvbWVvbmVAc29tZXdoZXJlLmNvbSIsInNpZ25lZEluIjp0cnVlLCJpYXQiOjE0ODUwMjI3NDl9.7QOvRsy2AFsUuOBa_icotbS9U9hCA8fHAHWuN-BEL0w';
    let invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
    let malformedToken = 'lasekjfdfjskljshjkhkjhgklhdjgsdjkgjdakrg';

    it('should return the authentication data given a valid token', function () {
      expect(authentication.validate(validToken)).toMatchObject({
        email: 'someone@somewhere.com',
        signedIn: true,
      });
    });

    it('should return false given an invalid token', function () {
      expect(authentication.validate(invalidToken)).toBe(false);
      expect(authentication.validate(malformedToken)).toBe(false);
    });
  });
});
