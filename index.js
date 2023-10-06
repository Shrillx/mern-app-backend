
const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");
const userRoutes = require("./routes/user")
require("dotenv").config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: 'https://mern-app-frontend-phi.vercel.app',
  credentials: true
}));
app.use(express.json());

// connect mongodb to our node app.
// mongoose.connect() takes 2 arguments : 1. Which db to connect to (db url), 2. 2. Connection options
mongoose
  .connect(
    "mongodb+srv://vanditdubeywork:" +
      process.env.MONGO_PASSWORD +
      "@cluster0.gibrwqu.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
    //this is some new standard which we follow during creating projects
  )
  .then((x) => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Error connecting to Mongo !!!");
  });

// setup passport-jwt
// let opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = process.env.PASSPORT_JWT_SECRETKEY;
// passport.use(
//     new JwtStrategy(opts, function (jwt_payload, done) {
//         User.findOne({_id: jwt_payload.identifier}, function (err, user) {
//             // done(error, doesTheUserExist)
//             if (err) {
//                 return done(err, false);
//             }
//             if (user) {
//                 return done(null, user);
//             } else {
//                 return done(null, false);
//                 // or you could create a new account
//             }
//         });
//     })
// );

// let opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = process.env.PASSPORT_JWT_SECRETKEY;

// passport.use(
//   new JwtStrategy(opts, async (jwt_payload, done) => {
//     try {
//       const user = await User.findOne({ _id: jwt_payload.identifier });
//       console.log("passport.use() activated");zz
//       if (user) {
//         return done(null, user);
//       } else {
//         console.log("inside passport.use() user not found");
//         return done(null, false);
//         // or you could create a new account
//       }
//     } catch (err) {
//       return done(err, false);
//     }
//   })
// );

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.PASSPORT_JWT_SECRETKEY;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

// API : GET type : / : return text "Hello world"
app.get("/", (req, res) => {
    // req contains all data for the request
    // res contains all data for the response
    res.send("Hello World");
});
app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);
app.use("/user",userRoutes)

// Now we want to tell express that our server will run on localhost:8000
app.listen(PORT, () => {
    console.log("App is running on port " + PORT);
});
