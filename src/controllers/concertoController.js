const Concerto = require('../models/ConcertoModel')

exports.index = async (req, res) => {
  const concertos = await Concerto.searchConcertos();
  res.render('concertos', { concertos });
  return
}

exports.indexPesquisa = async (req, res) => {
  const concertos = await Concerto.searchNameConcertos(req.query.nomePesquisa);
  concertos.nomePesquisa = req.query.nomePesquisa
  res.render('concertosPesquisa', { concertos });
  return
}

exports.novoConcerto = (req, res) => {
  res.render('novoConcerto', {concerto: {}});
}

exports.register = async (req, res) => {
  try {
     
      const concerto = new Concerto(req.body);
      await concerto.register();

      if (concerto.errors.length > 0) {
          req.flash('errors', concerto.errors);
          req.session.save(() => res.redirect('/concerto/novo-concerto'));
          return;
      }

      req.flash('success', 'Concerto inserido no sistema');
      req.session.save(() => res.redirect(`/concertos/concertos`));
      return;

  } catch (e) {
      console.log(e);
      return res.send('404');
  }

}

exports.editIndex = async function (req, res) {
  if (!req.params.id) return res.send('404');

  const concerto = await Concerto.searchId(req.params.id);

  if (!concerto) return res.send('404');

  res.render('novoConcerto', { concerto });
};

exports.edit = async function (req, res) {
  try {
      if (!req.params.id) return res.send('404');

      const concerto = new Concerto(req.body);
      await concerto.edit(req.params.id);

      if (concerto.errors.length > 0) {
          req.flash('errors', concerto.errors);
          req.session.save(() => res.redirect('/concerto/novo-concerto'));
          return;
      }

      req.flash('success', 'Concerto editado com sucesso.');
      req.session.save(() => res.redirect(`/concertos/concertos`));
      return;

  } catch (e) {
      console.log(e);
      res.send('404');
  }

}

exports.delete = async function(req, res){
  if (!req.params.id) return res.send('404');

  const concerto = await Concerto.delete(req.params.id);

  if (!concerto) return res.send('404');

  req.flash('success', 'Concerto Excluido.');
  req.session.save(() => res.redirect(`/Concertos/Concertos`));
  return;
}
