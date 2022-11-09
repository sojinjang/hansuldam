import GoogleOauth20 from "passport-google-oauth20";
import { userModel } from "../../../db";

const GoogleStrategy = GoogleOauth20.Strategy;

const config = {
  clientID: process.env.clientID, // clientId 설정하기
  clientSecret: process.env.clientSecret, // clientSecret 설정하기
  callbackURL: "/api/user/google/callback",
};

async function findOrCreateUser({ fullName, email }) {
  const user = await userModel.findByEmail(email);

  if (user) {
    return user;
  }

  const created = await userModel.create({
    fullName,
    email,
    password: "GOOGLE_OAUTH",
  });

  return created;
}

module.exports = new GoogleStrategy(
  config,
  async (accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json;

    try {
      const user = await findOrCreateUser({ fullName: name, email });
      done(null, {
        email: user.email,
        fullName: user.fullName,
      });
    } catch (e) {
      done(e, null);
    }
  }
);
