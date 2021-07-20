const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const servicosController = require('./src/controllers/servicosController');
const fichaController = require('./src/controllers/fichaController');
const concertoController = require('./src/controllers/concertoController');
const ferramentasController = require('./src/controllers/ferramentasController');
const { loginRequired, adminRequired } = require('./src/middlewares/middleware');

route.get('/',loginRequired, homeController.index);

//Rotas de login
route.get('/login/index', loginController.index);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);
route.get('/cadastro/index', loginController.cadastro);
route.post('/cadastro/register', loginController.register);

route.get('/servicos/pesquisa', loginRequired, servicosController.ServicoPesquisa);

route.get('/servicos/index', loginRequired, servicosController.index);
route.post('/servicos/register', loginRequired, servicosController.register);
route.get('/servicos/pre-edit/:id', loginRequired, servicosController.preEdit);
route.get('/servicos/index/:id', loginRequired, servicosController.editIndex);
route.post('/servicos/edit/:id', loginRequired, servicosController.edit);
route.get('/servicos/delete/:id', loginRequired, servicosController.delete);

route.get('/concerto/novo-concerto', loginRequired, concertoController.novoConcerto);
route.post('/concerto/register', loginRequired, concertoController.register);
route.get('/concerto/novo-concerto/:id', loginRequired, concertoController.editIndex);
route.post('/concerto/edit/:id', loginRequired, concertoController.edit);

route.get('/concertos/delete/:id', loginRequired, concertoController.delete);
route.get('/concertos/concertos', loginRequired, concertoController.index);

route.get('/concertos/pesquisa', loginRequired, concertoController.indexPesquisa);

route.post('/fichas/register', loginRequired, fichaController.register);
route.get('/fichas/index', loginRequired, fichaController.index);
route.get('/fichas/index/:id', loginRequired, fichaController.editIndex);
route.post('/fichas/edit/:id', loginRequired, fichaController.edit);
route.get('/fichas/delete/:id', loginRequired, fichaController.delete);
route.get('/fichas/fichas', loginRequired, fichaController.indexFichas);

route.get('/fichas/fichas/pesquisa', loginRequired, fichaController.pesquisaFichas);

route.get('/relatorios/index', loginRequired, adminRequired, ferramentasController.relatorioIndex);
route.get('/ferramentas/index', loginRequired, ferramentasController.ferramentaIndex);
route.get('/ferramentas/lista-lentes', loginRequired, ferramentasController.listaLentesIndex);
route.post('/ferramentas/lista-lentes/gera-lista', loginRequired, ferramentasController.geraLista)
route.post('/relatorios/index/gera-relatorio', loginRequired, ferramentasController.geraRelatorio)




module.exports = route;
