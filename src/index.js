const express = require('express');

require('./db/mongoose');

const app = express();
const User = require('./models/user');

const port = process.env.PORT || 3000;

app.use(express.json());

// ! User
app.use(require('../src/routes/user'));

// ! Task
app.use(require('../src/routes/task'));

app.listen(port);

// const main = async () => {
//   const user = await User.findById('5d036f7e536ac5257090d0a9');
//   await user.populate('tasks').execPopulate();
//   // console.log(user.tasks);
// };

// main();
