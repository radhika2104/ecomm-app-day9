function validateName(name) {
  const pattern = new RegExp(/[a-zA-Z][a-zA-Z]+[a-zA-Z]$/);
  return pattern.test(name);
}

function validateEmail(email) {
  const pattern = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
  return pattern.test(email);
}

function validatePassword(password) {
  const pattern = new RegExp(
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
  );
  return pattern.test(password);
}

module.exports = { validateName, validateEmail, validatePassword };
