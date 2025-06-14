import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/User';
import { MembershipTier, UserRole } from '@astronacci/shared';

export const configurePassport = (): void => {
  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth Profile:', {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName
      });

      // Check if user already exists
      let user = await User.findOne({ 
        $or: [
          { socialId: profile.id, socialProvider: 'google' },
          { email: profile.emails?.[0]?.value }
        ]
      });

      if (user) {
        console.log('Existing user found:', user.email);
        // Update user with Google info if not already set
        if (!user.socialId) {
          user.socialId = profile.id;
          user.socialProvider = 'google';
          await user.save();
        }
        return done(null, user);
      }

      console.log('Creating new user for:', profile.emails?.[0]?.value);
      // Create new user
      user = new User({
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value,
        socialProvider: 'google',
        socialId: profile.id,
        membershipTier: MembershipTier.TYPE_A, // Default tier
        role: UserRole.USER, // Default role
        isActive: true
      });

      await user.save();
      console.log('New user created:', user.email);
      return done(null, user);
    } catch (error) {
      console.error('Passport Google Strategy Error:', error);
      return done(error, false);
    }
  }));

  // Facebook OAuth Strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ 
        $or: [
          { socialId: profile.id, socialProvider: 'facebook' },
          { email: profile.emails?.[0]?.value }
        ]
      });

      if (user) {
        // Update user with Facebook info if not already set
        if (!user.socialId) {
          user.socialId = profile.id;
          user.socialProvider = 'facebook';
          await user.save();
        }
        return done(null, user);
      }

      // Create new user
      user = new User({
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value,
        socialProvider: 'facebook',
        socialId: profile.id,
        membershipTier: MembershipTier.TYPE_A, // Default tier
        role: UserRole.USER, // Default role
        isActive: true
      });

      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  // Serialize/Deserialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });
};
