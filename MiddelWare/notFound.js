function notFoundError(req, res) {
  res.status(404).send('routes does not exsit');
}

module.exports = notFoundError;
