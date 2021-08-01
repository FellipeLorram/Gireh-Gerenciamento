import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './assets/css/style.css';
import Servico from './validations/validaServico';
import Ficha from './validations/validaFicha'
import cancelwindow from './validations/cancelwindow'


// search-box open close js code
let navbar = document.querySelector(".navbar");
let searchBox = document.querySelector(".search-box .bx-search");

searchBox.addEventListener("click", () => {
    navbar.classList.toggle("showInput");
    if (navbar.classList.contains("showInput")) {
        searchBox.classList.replace("bx-search", "bx-x");
    } else {
        searchBox.classList.replace("bx-x", "bx-search");
    }
});

// sidebar open close js code
let navLinks = document.querySelector(".nav-links");
let menuOpenBtn = document.querySelector(".navbar .bx-menu");
let menuCloseBtn = document.querySelector(".nav-links .bx-x");
menuOpenBtn.onclick = function () {
    navLinks.style.left = "0";
}
menuCloseBtn.onclick = function () {
    navLinks.style.left = "-100%";
}


// sidebar submenu open close js code
let htmlcssArrow = document.querySelector(".htmlcss-arrow");
htmlcssArrow.onclick = function () {
    navLinks.classList.toggle("show1");
}

let servicoMostra = document.querySelector(".servicoMostra");
servicoMostra.onclick = function () {
    navLinks.classList.toggle("show1");
}

let moreArrow = document.querySelector(".more-arrow");
moreArrow.onclick = function () {
    navLinks.classList.toggle("show2");
}

let mostraMais = document.querySelector(".mostraMais");
mostraMais.onclick = function () {
    navLinks.classList.toggle("show2");
}

let jsArrow = document.querySelector(".js-arrow");
jsArrow.onclick = function () {
    navLinks.classList.toggle("show3");
}
let exameMOstra = document.querySelector(".exameMOstra");
exameMOstra.onclick = function () {
    navLinks.classList.toggle("show3");
}

let jsArrow1 = document.querySelector(".js-arrow1");
jsArrow1.onclick = function () {
    navLinks.classList.toggle("show4");
}

/// Change eventos ///
const descontoInput = document.querySelector('input[name="desconto"]');
const totalInput = document.querySelector('input[name="total"]');
const valorArmInput = document.querySelector('input[name="valorArm"]');
const valorLenInput = document.querySelector('input[name="valorLen"]');
const valorLenContatoInput = document.querySelector('input[name="valorLenContato"]');
const restaInput = document.querySelector('input[name="resta"]');
const valorDinInput = document.querySelector('input[name="valorDin"]')
const valorCarInput = document.querySelector('input[name="valorCar"]')


if (totalInput) {

    totalInput.addEventListener('click', () => {
        if (valorArmInput.value || valorLenInput.value || valorLenContatoInput.value) {
            const desconto = (Number(valorArmInput.value) + Number(valorLenInput.value) + Number(valorLenContatoInput.value)) / 100 * Number(descontoInput.value)
            totalInput.value = (Number(valorArmInput.value) + Number(valorLenInput.value) + Number(valorLenContatoInput.value)) - desconto
        }
    });


    document.addEventListener('change', () => {
        if (totalInput.value) {
            if (valorDinInput.value || valorCarInput.value) {
                restaInput.value = Number(totalInput.value) - (Number(valorDinInput.value) + Number(valorCarInput.value))
            }
        }
    })

    document.addEventListener('change', () => {
        document.querySelector("#totalBruto").innerHTML = `Total Bruto: R$ ${Number(valorArmInput.value) + Number(valorLenInput.value) + Number(valorLenContatoInput.value)}`
    })

}



const tipo = document.getElementById('tipoConcerto');
const valorInput = document.querySelector('input[name="valor"]');
if (tipo) {
    valorInput.addEventListener('click', () => {
        if (tipo.value == 'Solda') valorInput.value = '35'
        if (tipo.value == 'Mola') valorInput.value = '40'
        if (tipo.value == 'Parafuso') valorInput.value = '5'
        if (tipo.value == 'Plaqueta') valorInput.value = '10'
    });
}




///// Validação front-end ////

const ficha = new Ficha('.form-ficha');
const servico = new Servico('.form-servico');
servico.init()
ficha.init()

const dell_btn_vendas = document.querySelector(".dell_btn_vendas");
const dell_btn_fichas = document.querySelectorAll(".dell_btn_fichas");
const dell_btn_concertos = document.querySelectorAll(".dell_btn_concertos");

if (dell_btn_vendas) {
    dell_btn_vendas.addEventListener("click", e => {
        e.preventDefault()

        const hreftext = `${e.target.href}`

        cancelwindow.open({
            title: 'DELETAR SERVIÇO',
            message: 'Após a exclusão, voce perderá todos os dados dessa venda. Você realmente deseja excluí-la?',
            href: hreftext
        })
    });
}

if (dell_btn_fichas) {
    dell_btn_fichas.forEach(dell_btn => {
        dell_btn.addEventListener("click", e => {
            e.preventDefault()

            const hreftext = `${e.target.href}`
            cancelwindow.open({
                title: 'DELETAR FICHA',
                message: 'Após a exclusão, voce perderá todos os dados dessa ficha. Você realmente deseja excluí-la?',
                href: hreftext
            })

        });
    });
}

if (dell_btn_concertos) {
    dell_btn_concertos.forEach(dell_btn => {
        dell_btn.addEventListener("click", e => {
            e.preventDefault()

            const hreftext = `${e.target.href}`
            cancelwindow.open({
                title: 'DELETAR CONCERTO',
                message: 'Após a exclusão, voce perderá todos os dados desse concerto. Você realmente deseja excluí-la?',
                href: hreftext
            })

        });

    });

}

const tr__servico = document.querySelectorAll('.tr__servico')
if (tr__servico) {
    tr__servico.forEach(servico => {
        servico.addEventListener('click', e => {
            if (!e.target.classList.contains('dell_btn_fichas') && !e.target.classList.contains('dell_btn_concertos')) {
                servico.querySelector('.link__servico').click()
                servico.classList.remove('tr__servico')
                servico.classList.add('clickSimulation')
            }
        })
    })
}

const accordions_buttons = document.querySelectorAll('.accordion__button')
const accordions_buttons_inside = document.querySelectorAll('.accordion__button_inside')

if (accordions_buttons) {
    accordions_buttons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('accordion__button--active');
            const accordionContent = button.nextElementSibling;
            if (button.classList.contains('accordion__button--active')) {
                accordionContent.classList.add('accordion_content_active')
            } else {
                accordionContent.classList.remove('accordion_content_active')
            }

        });
    });

    accordions_buttons_inside.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('accordion__button--active_inside');
            const accordionContent = button.nextElementSibling;
            if (button.classList.contains('accordion__button--active_inside')) {
                accordionContent.classList.add('accordion_content_active')
            } else {
                accordionContent.classList.remove('accordion_content_active')
            }

        });
    });
}

const dataInput = document.querySelectorAll('.data_container input')
if (dataInput) {


    document.addEventListener('click', e => {
        dataInput.forEach(input => {
            if (e.target == input) e.target.classList.toggle('input_scale')
            else input.classList.remove('input_scale')
        });
    });
}

const nRelatorio = document.querySelectorAll("#newRelatory")
if(nRelatorio) nRelatorio.forEach(r => {
    r.addEventListener('click', ()=>{
        document.querySelector("#focusTo").focus()
    });
})