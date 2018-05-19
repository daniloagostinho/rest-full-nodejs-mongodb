/**
 * Arquivo: server.js
 * Descriçao: 
 * Autor: Danilo Agostinho
 *  
 */

// Configurar steup da app

// chamada pacotes
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var Produto = require('./app/models/produto');

// conexao mongoose peguei a URI connection do mlab
mongoose.connect('mongodb://danilodev:091011@ds016298.mlab.com:16298/api-restfull', {
	useMongoClient: true
});

//MongoDB local
// mongoose.connect('mongodb://localhost:27017/api-restfull', {
//   useMongoClient: true
// })
 


//configuraao variavel app para usar o body-parser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// definindo a porta a ser usada
var port = process.env.port || 8000;

// definindo as rotas da aplicacao via express
var router = express.Router();


router.use((req, res, next) => {
	console.log('Alguma coisa esta acontecendo verifique o postman');
	next();
});

// criando uma rota de exemplo
router.get('/', (req, res) => {
	res.json({ message: 'Bem vindo a loja XYZ!' })
});


// Rotas da API
// =============================================================
// Rotas que terminam com /produtos (servir: getAll)

/*1) Metodo Criar produto METODO POST (acessar em no navegador: http://localhost:800/api/produtos)*/

router.route('/produtos')
	.post((req, res) => {
		var produto = new Produto();

		// setar campos to produto via request
		produto.nome = req.body.nome;
		produto.preco = req.body.preco;
		produto.descricao = req.body.descricao;

		produto.save(function (error) {
			if (error)
				res.send('Erro ao tentar salvar produto' + error);
			res.json({ message: 'Produto cadastrado com sucesso!' });
		});
	})

	/*2 Exibe todos os produtos METODO GET (acessar em no navegador: http://localhost:800/api/produtos)*/
	.get((req, res) => {
		Produto.find((error, produtos) => {
			if (error)
				('Erro ao exibir todos os produtos..' + error);

			res.json(produtos);

		})
	})

// rotas que terminam em /produtos/:produto_id serviram para GET, PUT, DELETE
/*3 Exibe produtos por id METODO GET (acessar em no navegador: http://localhost:8000/api/produtos/:produto_id)*/
router.route('/produtos/:produto_id')
	.get((req, res) => {
		// funcao pra exibir determinado produto por id, depois verifica se caso ano encontrar um determinado produto id retorna mensagem de error
		Produto.findById(req.params.produto_id, (error, produto) => {
			if (error)
				res.send('Id do produto nao encontrado.. ' + error);
			res.json(produto);
		});
	})

	/*4 Atualizar produtos por id METODO PUT (acessar em no navegador: http://localhost:8000/api/produtos/:produto_id)*/
	.put((req, res) => {
		// primeiro
		Produto.findById(req.params.produto_id, (error, produto) => {
			if (error)
				res.send('erro ao buscar produto por Id' + error);

			produto.nome = req.body.nome;
			produto.preco = req.body.preco;
			produto.descricao = req.body.descricao;

			// ja achamos o produto por Id agora vamos persistir os dados
			produto.save((erorr) => {
				if (error)
					res.send('Erro ao atualizado produto')
				res.json({ message: 'Produto atualizao com sucesso!' });
			})
		})
	})

	/*5 Excluir produtos por id METODO DELETE (acessar em no navegador: http://localhost:8000/api/produtos/:produto_id)*/
	.delete((req, res) => {
		Produto.remove({
			_id: req.params.produto_id
		}, (error) => {
			if (error)
				res.send('Erro.. Id do produto nao encontrado' + error);
			  res.json({ message: 'produto excluido com sucesso!' })
		}

		);
	})


// definindo o prefixo api para toda a api
app.use('/api', router);

// ouvindo a api na porta 8000
app.listen(port);
console.log("iniciando app na porta" + port);