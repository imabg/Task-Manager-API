const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const { welcomeMail, cancelationMail } = require('../emails/accounts');
const User = require('../models/user');
const auth = require('../middleware/auth');

const upload = multer({
  limits: {
    fieldSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      cb(new Error('Please upload an image'));
    cb(undefined, true);
  }
});

const router = new express.Router();

router.post('/users', async (req, res, next) => {
  const user = new User(req.body);
  try {
    const token = await user.jsonwebtoken();
    await user.save();
    welcomeMail(user.email, user.name);
    res.send({ user, token });
  } catch (e) {
    res.status(404).send(e);
  }
});

router.get('/user/me', auth, async (req, res, next) => {
  res.send(req.user);
});

router.post('/user/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/user/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/user/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const updateOperations = ['name', 'age', 'email', 'password'];
  const isValid = updates.every(update => {
    return updateOperations.includes(update);
  });

  if (!isValid) {
    res.status(404).send('Invalid Operations!');
  }

  try {
    updates.forEach(update => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.jsonwebtoken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.delete('/user/me', auth, async (req, res) => {
  try {
    cancelationMail(req.user.email);
    await req.user.remove();
    res.send('Delete Succesfully');
  } catch (e) {
    res.status(404).send(e);
  }
});

router.post(
  '/user/me/avatar',
  auth,
  upload.single('upload'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, heigth: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(404).send({ error: error.message });
  }
);

router.delete(
  '/user/me/avatar',
  auth,
  upload.single('upload'),
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  }
);

router.get('/user/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) throw new Error();
    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
