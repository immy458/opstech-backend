module.exports.createResponse = (ok = true, data = null, error = "") => {
  return {
    ok,
    data,
    error,
  };
};
