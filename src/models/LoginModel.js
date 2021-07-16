const mongoose = require('mongoose');
const validator = require('validator');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: Number, required: true },
    codigoAcesso: { type: Number, required: false }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.cleanUp()
        if (this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });

        if (!this.user) {
            this.errors.push('Usuário inexistente.');
            return;
        }
        if (this.body.password !== this.user.password.toString()) {
            this.errors.push('Senha inválida.');
            this.user = null;
            return;
        }
    }

    async register() {
        this.valida();

        if (this.errors.length > 0) return;

        await this.userExists();

        if (this.errors.length > 0) return;

        this.user = await LoginModel.create(this.body)


    }

    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (this.user) this.errors.push('Usuário já existe.');
    }

    valida() {
        this.cleanUp()

        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inváldo.');
        if (this.body.password.length < 5 || this.body.password.length > 50) {
            this.errors.push('A senha precisa ter entre 5 e 50 caracteres.');
        }
        if (this.body.codigoAcesso !== '3895') this.errors.push('Código de cadastro inválido.');
    }
    
    validaLogin() {
        this.cleanUp()

        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inváldo.');
        if (this.body.password.length < 5 || this.body.password.length > 50) {
            this.errors.push('A senha precisa ter entre 5 e 50 caracteres.');
        }
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password,
            codigoAcesso: this.body.codigoAcesso
        }

    }

   

}

module.exports = Login;
