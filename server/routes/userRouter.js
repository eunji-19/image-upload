const express = require("express");
const router = express.Router();
const UserSchema = require("../models/user");
const { hash, compare } = require("bcryptjs");
const mongoose = require("mongoose");

router.patch("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserSchema.findOne({ username });
    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) throw new Error("유효한 비밀번호가 아닙니다.");

    user.sessions.push({ createdAt: new Date() });
    const session = user.sessions[user.sessions.length - 1];
    await user.save();

    return res.json({
      message: "Login Success",
      sessionId: session._id,
      name: user.name,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (password.length < 6)
      throw new Error("비밀번호는 최소 6자 이상 입력해주세요");

    if (username.length < 3)
      throw new Error("username 최소 3자 이상 입력해주세요");

    const hashedPassword = await hash(password, 10);
    const user = await new UserSchema({
      name,
      username,
      password: hashedPassword,
      sessions: [{ createdAt: new Date() }],
    }).save();

    const session = user.sessions[0];
    res.json({ user, sessionId: session._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/logout", async (req, res) => {
  try {
    console.log(req.user);
    if (!req.user) throw new Error("invalid sessionId");
    await UserSchema.updateOne(
      { _id: req.user.id },
      { $pull: { sessions: { _id: req.headers.sessionid } } }
    );
    res.json({ message: "logout success" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
