const Login = require('../models/LoginModel')

exports.index = (req, res) => {
  res.render('login')
}
exports.cadastro = (req, res) => {
  res.render('cadastro');
}

exports.register = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.register();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('/cadastro/index');
      });
      return;
    }

    req.flash('success', 'Seu usuário foi criado com sucesso.');
    req.session.save(function () {
      return res.redirect('/cadastro/index');
    });
  } catch (e) {
    console.log(e);
    return res.send('404');
  }
};

exports.login = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.login();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function () {
        return res.redirect('/login/index');
      });
      return;
    }

    req.flash('success', 'Você entrou no sistema.');
    req.session.user = login.user;
    req.session.save(function () {
      return res.redirect('/');
    });
  } catch (e) {
    console.log(e);
    return res.send('404');
  }
};

exports.logout = function(req, res){
  req.session.destroy();
  res.redirect('/login/index')
}
