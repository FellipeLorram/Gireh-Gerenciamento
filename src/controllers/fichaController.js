const Ficha = require('../models/FichaModel');

exports.indexFichas = async (req, res) => {
    const fichasToFilter = await Ficha.searchFichas();
    const hoje = new Date()
    const qtd = { hoje: 0, rest: 0, nA: 0 }
    let posicao = 0;

    const fichasHoje = fichasToFilter.filter(ficha => {
        if (ficha.CriadoEm.getDate() == hoje.getDate()
            && ficha.CriadoEm.getMonth() == hoje.getMonth()
            && ficha.CriadoEm.getFullYear() == hoje.getFullYear()) {
            qtd.hoje++
            if (ficha.atendido !== 'Atendido') qtd.nA++
            posicao++
            return ficha
        }
    });

    for (const ficha of fichasHoje) {
        ficha.posicao = posicao;
        posicao--;
    }

    const fichasRest = fichasToFilter.filter(ficha => {
        qtd.rest++
        return ficha.CriadoEm.getDate() !== hoje.getDate()
    })


    const fichas = {
        qtd,
        fichasHoje,
        fichasRest
    }

    res.render('fichasOptometricas', { fichas });
    return
};

exports.pesquisaFichas = async (req, res) => {
    const fichas = await Ficha.searchNameFichas(req.query.nomePesquisa);
    fichas.pesquisa = req.query.nomePesquisa;
    res.render('fichasOptometricasPesquisa', { fichas });
    return
};

exports.index = (req, res) => {
    res.render('fichas', { ficha: {} });
}

exports.register = async (req, res) => {
    try {

        const ficha = new Ficha(req.body);
        await ficha.register();

        if (ficha.errors.length > 0) {
            req.flash('errors', ficha.errors);
            req.session.save(() => res.redirect('/fichas/index'));
            return;
        }

        req.flash('success', 'Ficha Enviada');
        req.session.save(() => res.redirect(`/fichas/fichas`));
        return;

    } catch (e) {
        console.log(e);
        return res.send('404');
    }

}

exports.editIndex = async function (req, res) {
    if (!req.params.id) return res.send('404');

    const ficha = await Ficha.searchId(req.params.id);

    if (!ficha) return res.send('404');

    res.render('fichas', { ficha });
};

exports.edit = async function (req, res) {
    try {
        if (!req.params.id) return res.send('404');

        const ficha = new Ficha(req.body);
        await ficha.edit(req.params.id);

        if (ficha.errors.length > 0) {
            req.flash('errors', ficha.errors);
            req.session.save(() => res.redirect('/fichas/index'));
            return;
        }

        req.flash('success', 'ficha editada com sucesso.');
        req.session.save(() => res.redirect(`/fichas/fichas`));
        return;

    } catch (e) {
        console.log(e);
        res.send('404');
    }

}

exports.delete = async function (req, res) {
    if (!req.params.id) return res.send('404');

    const ficha = await Ficha.delete(req.params.id);

    if (!ficha) return res.send('404');

    req.flash('success', 'ficha Excluida.');
    req.session.save(() => res.redirect(`/fichas/fichas`));
    return;
}
