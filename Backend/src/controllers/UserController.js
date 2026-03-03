const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Token = require('../model/token');

// User signup
const SignUpUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: "Signup successful"
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Signup error",
      error: error.message
    });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(500).json({ message: "User password not found in DB" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { _id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "59m" }
    );

    const refreshToken = jwt.sign(
      { _id: user._id, username: user.username, email: user.email },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    await new Token({ token: refreshToken, user: user._id }).save();

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login error",
      error: error.message
    });
  }
};

module.exports = { SignUpUser, loginUser };
