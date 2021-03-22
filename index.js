require("dotenv").config();

import express from "express";

import mongoose from "mongoose";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import cors from "cors";
import bodyparser from "body-parser";

// Routes
import userRouter from "./routes/user";
import postRouter from "./routes/post";

// Models
import Users from "./models/user";

const app = express();

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      //   passwordField: "password",
    },
    (email, password, done) => {
      Users.findOne({ email }, (err, user) => {
        console.log(err, user);
        if (err) return done(err);
        if (!user)
          return done(null, false, { message: "Email does not exist!" });

        bcrypt.compare(password, user.password, (err, match) => {
          if (err) return done(err);

          return match
            ? done(null, user, { message: "Successful Login!" })
            : done(null, false, { message: "Incorrect password" });
        });
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
      return done(null, jwtPayload);
    }
  )
);

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("open", () => console.log("Connected to mongoDB"));

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.listen(process.env.PORT || 5000, () => console.log("Server running"));

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
