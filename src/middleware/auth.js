const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'Node.jsIsSexy');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    });

    if (!user) {
      throw new Error('No User Found');
    }
    req.token = token;
    req.user = user;
  } catch (e) {
    res.status(401).send({ error: 'Please Authenticate!' });
  }

  next();
};

module.exports = auth;
