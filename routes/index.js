const express = require('express');
const router = express.Router();
const ToDoModel = require('../models/todoModel');
const moment = require('moment');
moment.locale("ja");

/* ToDoリスト表示 */
router.get('/', function(req, res) {
  ToDoModel
    .find()
    .sort({status: 1, todoDate: 1, priority: 1, todoTime: 1}) // status: falseが先にくるようにソート
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
  /* 日付・時刻について、どちらか一方のみの登録にも対応するための処理 */
  if (req.body.todoDate) {
    ToDo.todoDate = req.body.todoDate;
    if (req.body.todoTime) {
      ToDo.todoTime = req.body.todoDate + 'T' + req.body.todoTime;
    }
  } else if (req.body.todoTime) {
    ToDo.todoTime = moment(new Date()).format("YYYY-MM-DD") + 'T' + req.body.todoTime;
  }

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
        /* 日付・時刻について、どちらか一方のみ、あるいはnullへの変更にも対応するための処理 */
        if (req.body.todoDate) {
          todo.todoDate = req.body.todoDate;
          if (req.body.todoTime) {
            todo.todoTime = req.body.todoDate + 'T' + req.body.todoTime;
          } else {
            todo.todoTime = null;
          }
        } else if (req.body.todoTime) {
          todo.todoDate = null;
          todo.todoTime = moment(new Date()).format("YYYY-MM-DD") + 'T' + req.body.todoTime;
        } else {
          todo.todoDate = null;
          todo.todoTime = null;
        }

        todo.priority = req.body.priority;
        todo.updatedDate = Date.now();

        todo.save(function(err) {
          if (err) {
            res.send(err);
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
