const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* 
  Mongooseにおいて、それぞれのスキーマが、MongoDBのコレクションに
  対応しており、そのコレクション内のドキュメントの形状を定義する。
*/
const todoSchema = new Schema({
  text: { type: String, max: 100, required: true },
  todoDate: { type: Date, default: null },
  priority: Number,
  registDate: { type: Date, default: Date.now() },
  updatedDate: { type: Date, default: Date.now() },
  status: { type: Boolean, default: true },
  deleteFlag: { type: Boolean, default: false }
});

// スキーマをモデルとしてコンパイルし、それをモジュールとして扱えるようにする
module.exports = mongoose.model('ToDoModel', todoSchema);