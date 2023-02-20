import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/user';
import { Request } from 'express';

// const FacebookStrategy = passportFacebook.Strategy;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env['JWT_SECRET'],
};

// lets create our strategy for web token
const jwtStrategy = new JWTStrategy(jwtOptions, function (user, next) {
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

// use the strategy
passport.use(jwtStrategy);

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */
// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_ID,
//     clientSecret: process.env.FACEBOOK_SECRET,
//     callbackURL: "/auth/facebook/callback",
//     profileFields: ["name", "email", "link", "locale", "timezone"],
//     passReqToCallback: true
// }, (req: any, accessToken, refreshToken, profile, done) => {
//     if (req.user) {
//         UserModel.findOne({ facebook: profile.id }, (err, existingUser) => {
//             if (err) { return done(err); }
//             if (existingUser) {
//                 req.flash("errors", { msg: "There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account." });
//                 done(err);
//             } else {
//                 User.findById(req.user.id, (err, user: any) => {
//                     if (err) { return done(err); }
//                     user.facebook = profile.id;
//                     user.tokens.push({ kind: "facebook", accessToken });
//                     user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
//                     user.profile.gender = user.profile.gender || profile._json.gender;
//                     user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
//                     user.save((err: Error) => {
//                         req.flash("info", { msg: "Facebook account has been linked." });
//                         done(err, user);
//                     });
//                 });
//             }
//         });
//     } else {
//         UserModel.findOne({ facebook: profile.id }, (err, existingUser) => {
//             if (err) { return done(err); }
//             if (existingUser) {
//                 return done(undefined, existingUser);
//             }
//             UserModel.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
//                 if (err) { return done(err); }
//                 if (existingEmailUser) {
//                     req.flash("errors", { msg: "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings." });
//                     done(err);
//                 } else {
//                     const user: any = new User();
//                     user.email = profile._json.email;
//                     user.facebook = profile.id;
//                     user.tokens.push({ kind: "facebook", accessToken });
//                     user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
//                     user.profile.gender = profile._json.gender;
//                     user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
//                     user.profile.location = (profile._json.location) ? profile._json.location.name : "";
//                     user.save((err: Error) => {
//                         done(err, user);
//                     });
//                 }
//             });
//         });
//     }
// }));

/**
 * Authorization Required middleware.
 */
// export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
//   const provider = req.path.split("/").slice(-1)[0];

//   if (_.find(req.user.tokens, { kind: provider })) {
//     next();
//   } else {
//     res.redirect(`/auth/${provider}`);
//   }
// };

/** User aware request.
 *
 * An express HTTP request that contain user information.
 */
export interface UserAwareRequest extends Request {
  user?: User;
}
