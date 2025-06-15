const assert = require('assert');
const { passwordValidator, emailValidator } = require('./stringValidator');

function utilsTest() {
  describe('utils', () => {
    it('should return the true when string has@', () => {
      const expectedResult = true;
      const input = 'test@gmail.com';
      const result = emailValidator(input);
      assert.strictEqual(result, expectedResult);
    });
    it('should return the false when string does not have @', () => {
      const expectedResult = false;
      const input = 'testgmail.com';
      const result = emailValidator(input);
      assert.strictEqual(result, expectedResult);
    });
  });
  describe('utils', () => {
    it('should return false if the password format is incorrect', () => {
      const expectedResult = false;
      const input = 'password';
      const result = passwordValidator(input);
      assert.strictEqual(result, expectedResult);
    });
    it('should return true if the password format is correct', () => {
      const expectedResult = true;
      const input = '1234AAbb#';
      const result = passwordValidator(input);
      assert.strictEqual(result, expectedResult);
    });
  });
}
module.exports = utilsTest;
