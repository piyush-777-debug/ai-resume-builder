const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

const isLoggedIn = async (req, res, next) => {
    try {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      }
      else if (req.cookies.token) {
        token = req.cookies.token;
      }
      if (!token) {
        return res.status(401).json({ message: "Unauthorized access, token missing" });
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = await userModel.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  };

  module.exports = isLoggedIn;