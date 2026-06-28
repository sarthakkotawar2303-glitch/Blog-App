const jwt = require('jsonwebtoken');
const Token = require('../model/token');

/**
 * @name generateTokens
 * @description Generates access and refresh tokens for a user.
 * @param {object} user - The user object.
 * @returns {object} An object containing access and refresh tokens.
 */
const generateTokens = async (user) => {
  const payload = { _id: user._id, username: user.username, email: user.email };
  
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY,
    { expiresIn: "59m" }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "7d" }
  );

  await new Token({ token: refreshToken, user: user._id }).save();

  return { accessToken, refreshToken };
};

module.exports = { generateTokens };
