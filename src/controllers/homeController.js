const Servico = require('../models/ServicoModel');

exports.index = async (req, res) => {
    const servicos = await Servico.searchServicos();
    res.render('index', { servicos });
    return
};

