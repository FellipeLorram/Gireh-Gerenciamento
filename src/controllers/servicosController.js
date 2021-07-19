const Servico = require('../models/ServicoModel');
const pdfMake = require('../pdfmake/pdfmake');
const vfsFonts = require('../pdfmake/vfs_fonts');
pdfMake.vfs = vfsFonts.pdfMake.vfs;

exports.index = (req, res) => {
    res.render('servicos', { servico: {} });
}

exports.ServicoPesquisa = async (req, res) => {
    const servicos = await Servico.searchNameServicos(req.query.nomePesquisa);
    servicos.pesquisa = req.query.nomePesquisa;
    res.render('indexPesquisa', { servicos });
    Servico.listagemLentes()
    return
};


exports.register = async (req, res) => {
    try {
        const servico = new Servico(req.body);
        await servico.register();

        if (servico.errors.length > 0) {
            req.flash('errors', servico.errors);
            req.session.save(() => res.redirect('/servicos/index'));
            return;
        }

        if (req.body.pdf == 'true') {
            var dd = servico.criaPdf();

            const pdfDoc = pdfMake.createPdf(dd);
            pdfDoc.getBase64((data) => {
                res.writeHead(200,
                    {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment;filename="${servico.servico.nome}.pdf"`
                    });

                const download = Buffer.from(data.toString('utf-8'), 'base64');
                res.end(download);
            });
        }
        else {
            req.flash('success', 'Seviço Concluido.');
            req.session.save(() => res.redirect(`/`));
        }

        return;

    } catch (e) {
        console.log(e);
        return res.send('404');
    }

}

exports.editIndex = async function (req, res) {
    if (!req.params.id) return res.send('404');

    const servico = await Servico.searchId(req.params.id);

    if (!servico) return res.send('404');

    res.render('servicos', { servico });
};

exports.preEdit = async function (req, res) {
    if (!req.params.id) return res.send('404');

    const servico = await Servico.searchId(req.params.id);

    if (!servico) return res.send('404');

    res.render('servicoPreEdit', { servico });
};

exports.edit = async function (req, res) {
    try {
        if (!req.params.id) return res.send('404');

        const servico = new Servico(req.body);
        await servico.edit(req.params.id);

        if (servico.errors.length > 0) {
            req.flash('errors', servico.errors);
            req.session.save(() => res.redirect('/servicos/index'));
            return;
        }

        if (req.body.pdf == 'true') {
            var dd = servico.criaPdf();

            const pdfDoc = pdfMake.createPdf(dd);
            pdfDoc.getBase64((data) => {
                res.writeHead(200,
                    {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment;filename="${servico.servico.nome}.pdf"`
                    });

                const download = Buffer.from(data.toString('utf-8'), 'base64');
                res.end(download);
            });
        }
        else {
            req.flash('success', 'Seviço Editado.');
            req.session.save(() => res.redirect(`/`));
        }
        return;

    } catch (e) {
        console.log(e);
        res.send('404');
    }

}

exports.delete = async function (req, res) {
    if (!req.params.id) return res.send('404');

    const servico = await Servico.delete(req.params.id);

    if (!servico) return res.send('404');

    req.flash('success', 'Seviço Excluido.');
    req.session.save(() => res.redirect(`/`));
    return;
}

