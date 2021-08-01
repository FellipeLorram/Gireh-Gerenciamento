export default class Ficha {
    constructor(formBody) {
        this.form = document.querySelector(formBody)
    }

    init() {
        this.eventos()
    }

    eventos() {
        if (!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.valida(e);
        });
    }

    valida(e) {
        const el = e.target;
        const nomeInput = el.querySelector('input[name="nome"]');
        const esfOdInput = el.querySelector('input[name="rxEsfOd"]');
        const esfOeInput = el.querySelector('input[name="rxEsfOe"]');
        const cilOdInput = el.querySelector('input[name="rxCilOd"]');
        const cilOeInput = el.querySelector('input[name="rxCilOe"]');
        const eixoOdInput = el.querySelector('input[name="rxEixoOd"]');
        const eixoOeInput = el.querySelector('input[name="rxEixoOe"]');

        let valido = false;

        if (!nomeInput.value) {
            this.criaErro(nomeInput, 'Qual o nome do cliente?');
            valido = true;
        }
        if (esfOdInput) {

            if (esfOdInput.value) if (esfOdInput.value[0] !== '+' && esfOdInput.value[0] !== '-') {
                this.criaErro(esfOdInput, 'positivo ou negativo?');
                valido = true;
                esfOdInput.focus()
            }

            if (esfOeInput.value) if (esfOeInput.value[0] !== '+' && esfOeInput.value[0] !== '-') {
                this.criaErro(esfOeInput, 'positivo ou negativo?');
                valido = true;
                esfOeInput.focus()
            }

            if (cilOdInput.value && !eixoOdInput.value) {
                this.criaErro(eixoOdInput, 'Qual o eixo?');
                valido = true;
                eixoOdInput.focus()
            }

            if (cilOeInput.value && !eixoOeInput.value) {
                this.criaErro(eixoOeInput, 'Qual o eixo?');
                valido = true;
                eixoOeInput.focus()
            }

            if (eixoOdInput.value && Number(eixoOdInput.value) > 180) {
                this.criaErro(eixoOdInput, 'Eixo invalido');
                valido = true;
                eixoOdInput.focus()
            }

            if (eixoOeInput.value && Number(eixoOeInput.value) > 180) {
                this.criaErro(eixoOeInput, 'Eixo invalido');
                valido = true;
                eixoOeInput.focus()
            }
        }

        if (!valido) el.submit();

    }

    criaErro(campo, msg) {
        const errorTxt = document.querySelectorAll('.error-text');

        if (errorTxt) errorTxt.forEach(e => {
            e.remove()
        })

        const div = document.createElement('div');
        div.innerHTML = msg;
        div.classList.add('error-text');
        campo.insertAdjacentElement('afterend', div);
    }
}