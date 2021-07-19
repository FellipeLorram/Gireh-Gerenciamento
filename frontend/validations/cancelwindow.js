export default {
    open(options) {
        options = Object.assign({}, {
            title: '',
            message: '',
            href: ''
        }, options)

        const html = `
        <div class="confirm">
          <div class="confirm-window">
             <div class="confirm__titlebar">
              <span class="confirm-titulo">${options.title}</span>
              <button class="confirm__close">&times;</button>
            </div>
            <div class="confirm__content">
                   ${options.message}
            </div>
            <div class="confirm__buttons">
                <a class="btn btn-danger" href="${options.href}">DELETAR</a>
                <button class="confirm-btn confirm-btn-cancel" href="">CANCELAR</button>
            </div>
          </div>
        </div>
        `;

        const template = document.createElement("template");

        template.innerHTML = html;

        const confirmEl = template.content.querySelector(".confirm");
        const btnClose = template.content.querySelector(".confirm__close");
        const cancel = template.content.querySelector(".confirm-btn-cancel");

        confirmEl.addEventListener('click', e => {
            if (e.target === confirmEl) {
                this._close(confirmEl)
            }
        });

        [btnClose, cancel].forEach(el => {
            el.addEventListener('click', () => {
                this._close(confirmEl)
            })
        });

        document.body.appendChild(template.content);
        document.body.classList.add('stop-scrolling')
    },

    _close(confirmEl) {
        confirmEl.classList.add('confirm-close')

        confirmEl.addEventListener('animationend', () => {
            document.body.removeChild(confirmEl)
            document.body.classList.remove('stop-scrolling')
        })
    }
}