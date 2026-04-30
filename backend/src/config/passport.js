import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.js';
import { User } from '../models/index.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google profile:', profile.id, profile.displayName);

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const email =
            profile.emails?.[0]?.value || `${profile.id}@google.user`;
          const avatar = profile.photos?.[0]?.value || '';

          user = await User.create({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            role: 'customer',
            avatar: avatar,
          });
          console.log('Created new user:', user.email);
        } else {
          console.log('Found existing user:', user.email);
        }

        return done(null, user);
      } catch (error) {
        console.error('Passport Google error:', error.message);
        return done(error, null);
      }
    }
  )
);

export default passport;
