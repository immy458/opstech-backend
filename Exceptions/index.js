class InvalidPasswordFormatError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidPasswordFormatError";
  }
}

class DishValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "DishValidationError";
  }
}

module.exports = { InvalidPasswordFormatError, DishValidationError };
