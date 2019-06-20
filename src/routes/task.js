const express = require('express');

const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    author: req.user._id
  });
  try {
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.get('/tasks', auth, async (req, res) => {
  const match = {};
  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }
  try {
    await req.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort: {
            createdAt: 1
          }
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/task/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, author: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(404).send(e);
  }
});

router.patch('/task/:id', auth, async (req, res) => {
  let updates = Object.keys(req.body);
  let updateOperations = ['description', 'completed'];
  const isValid = updates.every(update => {
    return updateOperations.includes(update);
  });

  if (!isValid) {
    res.status(404).send('Invalid Operation');
  }
  try {
    const task = await Task.findOneAndUpdate({
      _id: req.params.id,
      author: req.user._id
    });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach(update => {
      task[update] = req.body[update];
    });
    await task.save();
    if (!task) {
      res.status(404).send('task NOT found!');
    }
    res.send(task);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.delete('/task/:id', auth, async (req, res) => {
  try {
    const deleteTask = await Task.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id
    });
    if (!deleteTask) {
      res.status(404).send('task Not Found');
    }
    res.send('Task Delete Succesfully');
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
