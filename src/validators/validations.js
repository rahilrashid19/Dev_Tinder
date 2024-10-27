const validator = require("validator");

const validateSignupApi = (req) => {
  const { firstName, email, password } = req.body;

  if (!firstName) throw new Error("First name is required");
  if (firstName.length < 3 || firstName.length > 15)
    throw new Error("First name must be between 3 and 15 characters");
  if (!validator.isEmail(email))
    throw new Error("Please enter a valid email address");
  if (!validator.isStrongPassword(password))
    throw new Error("Please enter a strong password");
};

module.exports = {
  validateSignupApi,
};
