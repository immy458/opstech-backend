class InvalidPasswordFormatError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidPasswordFormatError";
  }
}

module.exports = InvalidPasswordFormatError;
