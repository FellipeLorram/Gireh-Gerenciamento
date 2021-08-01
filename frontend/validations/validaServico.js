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
        const armacaoInput = el.querySelector('select[name="armacao"]');
        const valorArmacaoInput = el.querySelector('input[name="valorArm"]');
        const lenteInput = el.querySelector('select[name="lente"]');
        const valorLenteInput = el.querySelector('input[name="valorLen"]');

        let valido = false;

        if (!nomeInput.value) {
            this.criaErro(nomeInput, 'Qual o nome do cliente?');
            valido = true;
        }
        
        if (armacaoInput.value && !valorArmacaoInput.value) {
            this.criaErro(valorArmacaoInput, 'Qual o preço?');
            valido = true;
            valorArmacaoInput.focus()
        }

        if (lenteInput.value && !valorLenteInput.value) {
            this.criaErro(valorLenteInput, 'Qual o preço?');
            valido = true;
            valorLenteInput.focus();
        }

        if (esfOdInput.value) if (esfOdInput.value[0] !== '+' && esfOdInput.value[0] !== '-') {
            this.criaErro(esfOdInput, 'positivo ou negativo?');
            valido = true;
            esfOdInput.focus()
        }

        if (esfOeInput.value) if (esfOeInput.value[0] !== '+' && esfOeInput.value[0] !== '-') {
            this.criaErro(esfOeInput, 'positivo ou negativo?');
            valido = true;
            esfOeInput.focus();
        }

        if (!cilOdInput.value && eixoOdInput.value) {
            this.criaErro(cilOdInput, 'Qual grau?');
            valido = true;
            cilOdInput.focus()
        }

        if (!cilOeInput.value && eixoOeInput.value) {
            this.criaErro(cilOeInput, 'Qual grau?');
            valido = true;
            cilOeInput.focus()
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
            eixoOdInput.focus();
        }

        if (eixoOeInput.value && Number(eixoOeInput.value) > 180) {
            this.criaErro(eixoOeInput, 'Eixo invalido');
            valido = true;
            eixoOeInput.focus();
        }

        if (esfOdInput.value) {
            if (esfOdInput.value[esfOdInput.value.length - 1] !== '5' && esfOdInput.value[esfOdInput.value.length - 1] !== '0') {
                this.criaErro(esfOdInput, 'Grau invalido');
                valido = true;
                esfOdInput.focus()
            }

            if (esfOdInput.value.length > 6) {
                this.criaErro(esfOdInput, 'Grau invalido');
                valido = true;
                esfOdInput.focus()
            }
        }

        if (esfOeInput.value) {
            if (esfOeInput.value[esfOeInput.value.length - 1] !== '5' && esfOeInput.value[esfOeInput.value.length - 1] !== '0') {
                this.criaErro(esfOeInput, 'Grau invalido');
                valido = true;
                esfOeInput.focus()
            }
            if (esfOeInput.value.length > 6) {
                this.criaErro(esfOeInput, 'Grau invalido');
                valido = true;
                esfOeInput.focus()
            }
        }
        if (cilOdInput.value) {
            if (cilOdInput.value[cilOdInput.value.length - 1] !== '5' && cilOdInput.value[cilOdInput.value.length - 1] !== '0') {
                this.criaErro(cilOdInput, 'Grau invalido');
                valido = true;
                cilOdInput.focus()
            }
            if (cilOdInput.value.length > 6) {
                this.criaErro(cilOdInput, 'Grau invalido');
                valido = true;
                cilOdInput.focus()
            }
        }

        if (cilOeInput.value) {
            if (cilOeInput.value[cilOeInput.value.length - 1] !== '5' && cilOeInput.value[cilOeInput.value.length - 1] !== '0') {
                this.criaErro(cilOeInput, 'Grau invalido');
                valido = true;
                cilOeInput.focus()

            }
            if (cilOeInput.value.length > 6) {
                this.criaErro(cilOeInput, 'Grau invalido');
                valido = true;
                cilOeInput.focus();
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