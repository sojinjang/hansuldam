import GoogleOauth20 from "passport-google-oauth20";
import { userModel } from "../../../db";

const GoogleStrategy = GoogleOauth20.Strategy;

const config = {
  clientID:
    "123614632461-gen2gcau1k5bsi5cjsg7rievs2nm5dah.apps.googleusercontent.com", // clientId 설정하기
  clientSecret: "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", // clientSecret 설정하기
  callbackURL: "/auth/google/callback",
};

async function findOrCreateUser({ name, email }) {
  const user = await userModel.findOne({
    email,
  });

  if (user) {
    return user;
  }

  const created = await userModel.create({
    name,
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
      const user = await findOrCreateUser({ email, name });
      done(null, {
        shortId: user.shortId,
        email: user.email,
        name: user.name,
      });
    } catch (e) {
      done(e, null);
    }
  }
);
