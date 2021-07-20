exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
}

exports.loginRequired = (req, res, next) =>{
    if(!req.session.user){
        req.flash('errors', 'Faça login para inserir serviços no sistema.');
        req.session.save(() => {res.redirect('/login/index')});
        return;
    }

    next();
}

exports.adminRequired = (req, res, next) =>{
    if(req.session.user.email !== 'fellipelorram@gmail.com'){
        req.flash('errors', 'Você não possui essa permissão.');
        req.session.save(() => {res.redirect('/')});
        return;
    }

    next();
}

