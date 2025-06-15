function passwordValidator(data) {
  const lowerCase = new RegExp('(?=.*[a-z])');
  const upperCase = new RegExp('(?=.*[A-Z])');
  const number = new RegExp('(?=.*[0-9])');
  const characters = new RegExp('(?=.*[!@#$%^&*|])');
  const length = new RegExp('(?=.{8,})');

  if (!lowerCase.test(data)) {
    return false;
  }
  if (!upperCase.test(data)) {
    return false;
  }
  if (!number.test(data)) {
    return false;
  }
  if (!characters.test(data)) {
    return false;
  }
  if (!length.test(data)) {
    return false;
  }
  return true;
}

function emailValidator(data) {
  const character = RegExp('(?=.*[@])');
  if (!character.test(data)) {
    return false;
  }
  return true;
}

module.exports = { passwordValidator, emailValidator };
