import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

import Users from "../models/user";

const getUsers = (req, res, next) => {
  Users.find((err, users) => {
    if (err) return res.json(err);
    res.json(users);
  });
};

const getUser = (req, res, next) => {
  Users.findOne({ _id: req.params.userId }, (err, user) => {
    if (err) return res.json(err);
    res.json(user);
  });
};

const loginUser = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user)
      return res.status(400).json({ message: "Authentication failed!", user });
    jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: 120 },
      (err, token) => {
        if (err) return res.status(400).json(err);
        res.json({
          token: token,
          user: { _id: user._id, email: user.email },
        });
      }
    );
  })(req, res);
};

const signUpUser = (req, res, next) => {
  const { email, password } = req.body;
  Users.findOne({ email }, (err, user) => {
    if (user)
      return res.json({ message: "User with this email already exists" });

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.json(err);

      Users.create({ email, password: hashedPassword }, (err, user) => {
        if (err) return res.status(400).json(err);
        jwt.sign(
          { _id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: 120 },
          (err, token) => {
            if (err) return res.json(err);
            res.status(200).json({
              token,
              user: { _id: user._id, email: user.email },
              message: "User Created",
            });
          }
        );
      });
    });
  });
};

const userControllers = { getUsers, getUser, loginUser, signUpUser };

export default userControllers;
