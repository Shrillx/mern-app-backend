const passport = require("passport");
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get(
    "/current-user",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { firstName, lastName } = req.user;
      res.status(200).json({ firstName, lastName } );
    }
  );


module.exports = router;