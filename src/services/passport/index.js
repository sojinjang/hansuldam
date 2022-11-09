import passport from "passport";

// const local = require('./strategies/local');
// const jwt = require('./strategies/jwt');
const google = require("./strategies/google");

module.exports = () => {
  //   passport.use(local);
  //   passport.use(jwt);
  passport.use(google);
};
