const Servico = require('../models/ServicoModel');
const Relatorio = require('../models/Relatorio');

exports.ferramentaIndex = async (req, res) => {
  res.render('ferramentas');
  return
}

exports.listaLentesIndex = async (req, res) => {
  res.render('listaLentes');
  return
}

exports.geraLista = async (req, res) => {
  const data1 = req.body.de.split('-')
  var lista = await Servico.listagemLentes(Number(data1[2]), Number(data1[1]), Number(data1[0]))

  const pdfDoc = pdfMake.createPdf(lista);
  pdfDoc.getBase64((data) => {
    res.writeHead(200,
      {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment;filename="${data1[2]}-${data1[1]}-ListaLentes.pdf"`
      });

    const download = Buffer.from(data.toString('utf-8'), 'base64');
    res.end(download);
  });
}

exports.relatorioIndex = async (req, res) => {
  
  res.render('relatorios')
}

exports.geraRelatorio = async (req, res) => {
  var relatorio = await Relatorio.relatorio(req.body.de, req.body.ate)

  const pdfDoc = pdfMake.createPdf(relatorio);
  pdfDoc.getBase64((data) => {
    res.writeHead(200,
      {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment;filename="${req.body.de}-${req.body.ate}-relatorio.pdf"`
      });

    const download = Buffer.from(data.toString('utf-8'), 'base64');
    res.end(download);
  });
}
