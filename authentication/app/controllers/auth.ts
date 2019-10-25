import { RequestHandler } from 'express';
import { defaultUserInfo, User, UserInfo, UserModel } from '../model/user.model';
import { compare, hash } from 'bcryptjs';
import { transporter } from '../server';
import { randomBytes } from 'crypto';

export const getLogin: RequestHandler = async (req, res) => {
  const [errorMessage] = req.flash('error');
  res.render('auth/login', {
    errorMessage,
    pageTitle: 'Login',
    path: '/login'
  });
};

export const getSignUp: RequestHandler = async (req, res) => {
  const [errorMessage] = req.flash('error');

  res.render('auth/sign-up', {
    errorMessage,
    pageTitle: 'Sign Up',
    path: '/sign-up'
  });
};

export const getResetPassword: RequestHandler = async (req, res) => {
  const [errorMessage] = req.flash('error');

  res.render('auth/reset-password', {
    errorMessage,
    pageTitle: 'Reset Password',
    path: '/reset-password'
  });
};

export const getNewPassword: RequestHandler = async (req, res) => {
  const [errorMessage] = req.flash('error');
  const resetToken = req.params.token;
  const user = await UserModel.findOne({
    resetToken,
    resetTokenExpiration: {$gt: Date.now()}
  });

  res.render('auth/new-password', {
    errorMessage,
    resetToken,
    userId: user && user._id.toString(),
    pageTitle: 'New Password',
    path: '/new-password'
  });
};

export const postLogin: RequestHandler = async (req, res) => {
  const { session, body: { email, password } } = req;
  const user = await UserModel.findOne({ email });
  const loginIsValid = user ? await compare(password, user.password) : false;

  if (!loginIsValid) {
    req.flash('error', 'Invalid email or password');
    return res.redirect('/login');
  }

  if (session) {
    session.isLoggedIn = true;
    session.user = user as UserInfo;
    await session.save();
  }
  res.redirect('/');
};

export const postLogout: RequestHandler = async (req, res) => {
  const { session } = req;

  if (session) {
    return session.destroy(() => {
      req.user = undefined;
      res.redirect('/');
    });
  }
  res.redirect('/');
};

export const postSignUp: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const hashedPassword = await hash(password, 12);

  if (user) {
    req.flash('error', `User with email ${email} already exists.`);
    return res.redirect('/signup');
  }

  await new UserModel({
    email,
    name: defaultUserInfo.name,
    password: hashedPassword,
    cart: { products: [], totalPrice: 0 }
  }).save();

  await transporter.sendMail({
    from: 'nodejs-course@node-test.com',
    to: email,
    subject: 'Sign Up Succeeded',
    html: '<h1>You successfully signed up</h1>'
  });

  res.redirect('/login');
};

export const postResetPassword: RequestHandler = async (req, res) => {
  const { body: {email} } = req;

  randomBytes(32, async (err, buffer) => {
    const token = buffer.toString('hex');
    const user = await UserModel.findOne({ email }) as unknown as User;

    if (!user) {
      req.flash('error', `There is no user with email "${email}".`);
      return res.redirect('/reset-password');
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();

    res.redirect('/');
    await transporter.sendMail({
      from: 'nodejs-course@node-test.com',
      to: email,
      subject: 'Password Reset',
      html: `<p>Go to this <a href=http://localhost/3000/reset/${token}">link</a> to reset password.</p>`
    });
  });
};

export const postNewPassword: RequestHandler = async (req, res) => {
  const { body: {resetToken, userId, password} } = req;

  let user: User;

  try {
    user = await UserModel.findOne({
      resetToken,
      resetTokenExpiration: {$gt: Date.now()},
      _id: userId
    }) as unknown as User;
  } catch (e) {}

  if (!user) {
    return res.redirect('/');
  }

  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  user.password = await hash(password, 12);
  await user.save();
  res.redirect('/');
};
