export default class Servico {
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
        const esfOdInput = el.querySelector('input[name="esfOd"]');
        const esfOeInput = el.querySelector('input[name="esfOe"]');
        const cilOdInput = el.querySelector('input[name="cilOd"]');
        const cilOeInput = el.querySelector('input[name="cilOe"]');
        const eixoOdInput = el.querySelector('input[name="eixoOd"]');
        const eixoOeInput = el.querySelector('input[name="eixoOe"]');

        let valido = false;

        if (!nomeInput.value) {
            this.criaErro(nomeInput, 'Qual o nome do cliente?');
            valido = true;
        }

        if (esfOdInput.value) if (esfOdInput.value[0] !== '+' && esfOdInput.value[0] !== '-') {
            this.criaErro(esfOdInput, 'positivo ou negativo?');
            valido = true;
        }

        if (esfOeInput.value) if (esfOeInput.value[0] !== '+' && esfOeInput.value[0] !== '-') {
            this.criaErro(esfOeInput, 'positivo ou negativo?');
            valido = true;
        }

        if (cilOdInput.value && !eixoOdInput.value) {
            this.criaErro(eixoOdInput, 'Qual o eixo?');
            valido = true;
        }

        if (cilOeInput.value && !eixoOeInput.value) {
            this.criaErro(eixoOeInput, 'Qual o eixo?');
            valido = true;
        }

        if (eixoOdInput.value && Number(eixoOdInput.value) > 180) {
            this.criaErro(eixoOdInput, 'Eixo invalido');
            valido = true;
        }

        if (eixoOeInput.value && Number(eixoOeInput.value) > 180) {
            this.criaErro(eixoOeInput, 'Eixo invalido');
            valido = true;
        }

        let grauEsfDireito = esfOdInput.value.split(esfOdInput.value[0])
        grauEsfDireito = grauEsfDireito[1]

        let grauEsfEsquerdo = esfOeInput.value.split(esfOeInput.value[0])
        grauEsfEsquerdo = grauEsfEsquerdo[1]

        let graucilDireito = cilOdInput.value.split(cilOdInput.value[0])
        graucilDireito = graucilDireito[1]

        let graucilEsquerdo = cilOeInput.value.split(cilOeInput.value[0])
        graucilEsquerdo = graucilEsquerdo[1]


        if (esfOdInput.value && Number(grauEsfDireito) % 5 != 0) {
            this.criaErro(esfOdInput, 'Grau invalido');
            valido = true;
        }

        if (esfOeInput.value && Number(grauEsfEsquerdo) % 5 != 0) {
            this.criaErro(esfOeInput, 'Grau invalido');
            valido = true;
        }
        if (cilOdInput.value && Number(graucilDireito) % 5 != 0) {
            this.criaErro(cilOdInput, 'Grau invalido');
            valido = true;
        }

        if (cilOeInput.value && Number(graucilEsquerdo) % 5 != 0) {
            this.criaErro(cilOeInput, 'Grau invalido');
            valido = true;
        }


        if (!valido) el.submit();
    }

    criaErro(campo, msg) {
        const div = document.createElement('div');
        div.innerHTML = msg;
        div.classList.add('error-text');
        campo.insertAdjacentElement('afterend', div);
    }
}