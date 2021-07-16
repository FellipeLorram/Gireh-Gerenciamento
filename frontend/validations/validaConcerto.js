export default class Concerto{
    constructor(formBody){
        this.form = document.querySelector(formBody)
    }

    init(){
        this.eventos()
    }

    eventos(){
        if(!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.valida(e);
        });
    }

    valida(e){
        const el = e.target;
        const nomeInput = el.querySelector('input[name="nome"]');


        let valido = false;

        if(!nomeInput.value){
            this.criaErro(nomeInput, 'Qual o nome do cliente?');
            valido = true;
        }

        

        if(!valido) el.submit();

    }

    criaErro(campo, msg) {
        const div = document.createElement('div');
        div.innerHTML = msg;
        div.classList.add('error-text');
        campo.insertAdjacentElement('afterend', div);
      }
}