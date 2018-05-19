/**
 * Criando modelo do banco com mongdb
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/** 
 * Produto
 * -> Id: int
 * -> Nome: String
 * -> preco: Number
 * -> Descricao: String
 */

 var produtoSchema = new Schema({
    nome: String,
    preco: Number,
    Descricao: String
 });

 /**
  * Banco criado no mLAB
  * api-restfull
  * DATABASE USER NAME: danilodev
  * senha: 091011
  */

 module.exports = mongoose.model('Produto', produtoSchema);