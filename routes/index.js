const express = require('express');
const router = express.Router();
const ToDoModel = require('../models/todoModel');
const moment = require('moment');

/* ToDoリスト表示 */
router.get('/', function(req, res) {
  ToDoModel
    .find()
    .then(function(todoList) {
      /* res.json(todoList); */
      res.render('index', {
        title: 'ToDoリスト',
        todoList: todoList,
        moment: moment,
      });
    });
});

/* ToDo追加 */
router.post('/', function(req, res) {
  const ToDo = new ToDoModel();
  ToDo.text = req.body.text;
  ToDo.todoDate = req.body.todoDate;
  if (req.body.priority) {
    ToDo.priority = req.body.priority;
  }

  ToDo.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.redirect('/');
    }
  });
});

/* ToDo変更 */
router.post('/:id', function(req, res) {
  const todoId = req.params.id;

  ToDoModel
    .findById(todoId, function(err, todo) {
      if (err) {
        res.send(err);
      } else {
        todo.text = req.body.text;
        todo.todoDate = req.body.todoDate;
        todo.priority = req.body.priority;
        todo.updatedDate = Date.now();

        todo.save(function(err) {
          if (err) {
            req.send(err);
          } else {
            res.redirect('/');
          }
        });
      }
    });
});

/* DONE */
router.post('/:id/done', function(req, res) {
  const todoId = req.params.id;

  ToDoModel
    .findById(todoId, function(err, todo) {
      if (err) {
        res.send(err);
      } else {
        todo.status = false;
        todo.updatedDate = Date.now();
        todo.save(function(err) {
          if (err) {
            req.send(err);
          } else {
            res.redirect('/');
          }
        });
      }
    });
});

/* UNDO */
router.post('/:id/undo', function(req, res) {
  const todoId = req.params.id;

  ToDoModel
    .findById(todoId, function(err, todo) {
      if (err) {
        res.send(err);
      } else {
        todo.status = true;
        todo.updatedDate = Date.now();
        todo.save(function(err) {
          if (err) {
            req.send(err);
          } else {
            res.redirect('/');
          }
        });
      }
    });
});

module.exports = router;
