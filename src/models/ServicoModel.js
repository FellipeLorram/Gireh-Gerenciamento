const mongoose = require('mongoose');

const ServicoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    endereço: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },

    esfOd: { type: String, required: false, default: '' },
    cilOd: { type: String, required: false, default: '' },
    eixoOd: { type: String, required: false, default: '' },

    esfOe: { type: String, required: false, default: '' },
    cilOe: { type: String, required: false, default: '' },
    eixoOe: { type: String, required: false, default: '' },

    adicao: { type: String, required: false, default: '' },

    dnpOd: { type: String, required: false, default: '' },
    alturaOd: { type: String, required: false, default: '' },

    dnpOe: { type: String, required: false, default: '' },
    alturaOe: { type: String, required: false, default: '' },

    armacao: { type: String, required: false, default: '' },
    valorArm: { type: String, required: false, default: '' },

    lente: { type: String, required: false, default: '' },
    valorLen: { type: String, required: false, default: '' },

    lenteContato: { type: String, required: false, default: '' },
    valorLenContato: { type: String, required: false, default: '' },

    total: { type: String, required: false, default: '' },

    formaPagamento: { type: String, required: false, default: '' },
    valorDin: { type: String, required: false, default: '' },
    valorCar: { type: String, required: false, default: '' },

    pago: { type: String, required: false, default: '' },
    entregue: { type: String, required: false, default: '' },

    resta: { type: String, required: false, default: '' },
    CriadoEm: { type: Date, default: Date.now }
});

const ServicoModel = mongoose.model('Servico', ServicoSchema);

function Servico(body) {
    this.body = body;
    this.errors = [];
    this.servico = null;

}

Servico.searchId = async function (id) {
    if (typeof id !== 'string') return;
    const servico = await ServicoModel.findById(id);
    return servico;
}

Servico.searchServicos = async function (DeData, AteData) {
    if (!DeData || !AteData) return await ServicoModel.find().sort({ CriadoEm: -1 });
    if (DeData == AteData) return await ServicoModel.find({ CriadoEm: new Date(DeData) });
    return await ServicoModel.find({ CriadoEm: { "$gte": new Date(DeData), "$lte": new Date(AteData) } });
}

Servico.searchLentes = async function (DeData, AteData) {
    if (!DeData || !AteData) return await ServicoModel.find({}, { lente: 1, valorLen: 1, _id: 0 }).sort({ CriadoEm: -1 });
    if (DeData == AteData) return await ServicoModel.find({ CriadoEm: new Date(DeData) }, { lente: 1, valorLen: 1, _id: 0 });
    return await ServicoModel.find({ CriadoEm: { "$gte": new Date(DeData), "$lte": new Date(AteData) } }, { lente: 1, valorLen: 1, _id: 0 });
}

Servico.searchArmacoes = async function (DeData, AteData) {
    if (!DeData || !AteData) return await ServicoModel.find({}, { armacao: 1, valorArm: 1, _id: 0 }).sort({ CriadoEm: -1 });
    if (DeData == AteData) return await ServicoModel.find({ CriadoEm: new Date(DeData) }, { armacao: 1, valorArm: 1, _id: 0 });
    return await ServicoModel.find({ CriadoEm: { "$gte": new Date(DeData), "$lte": new Date(AteData) } }, { armacao: 1, valorArm: 1, _id: 0 });
}

Servico.searchNameServicos = async function (Nome) {
    const servico = await ServicoModel.find({ nome: { $regex: '^' + Nome, $options: 'i' } }).sort({ CriadoEm: -1 });
    return servico;
}

Servico.listagemLentes = async function (dia, mes, ano) {
    const FilterServicos = await ServicoModel.find({}, { lente: 1, esfOd: 1, esfOe: 1, cilOd: 1, cilOe: 1, adicao: 1, CriadoEm: 1 }).sort({ CriadoEm: -1 });
    var lista = {
        content: [
            {
                text: `Lista dia ${formataData(dia, mes)}`,
                style: 'header'
            }, '\n'


        ],
        styles: {
            header: {
                fontSize: 14,
                bold: true
            },

        }

    }
    const pedido = {}


    const servicos = FilterServicos.filter(servico => {
        if (servico.CriadoEm.getDate() == dia && servico.CriadoEm.getMonth() + 1 == mes && servico.CriadoEm.getFullYear() == ano) return servico;
    })

    for (servico of servicos) {
        if (servico.lente in pedido) {
            if (servico.lente == '') {
                pedido['outra'].push(`${servico.esfOd} ${servico.cilOd} ${servico.adicao}`)
                pedido['outra'].push(`${servico.esfOe} ${servico.cilOe}`)
            } else {
                if (servico.esfOd == '') pedido[servico.lente].push(`cil ${servico.cilOd} ${servico.adicao}`)
                else pedido[servico.lente].push(`${servico.esfOd} ${servico.cilOd} ${servico.adicao}`)

                if (servico.esfOe = '') pedido[servico.lente].push(`cil ${servico.cilOd} ${servico.adicao}`)
                else pedido[servico.lente].push(`${servico.esfOe} ${servico.cilOe} ${servico.adicao}`)
            }
        } else {
            if (servico.lente == '') {
                if (servico.esfOd == '') pedido['outra'] = [`cil ${servico.cilOd} ${servico.adicao}`]
                else pedido['outra'] = [`${servico.esfOd} ${servico.cilOd} ${servico.adicao}`]

                if (servico.esfOe == '') pedido['outra'].push(`cil ${servico.cilOe} ${servico.adicao}`)
                else pedido['outra'].push(`${servico.esfOe} ${servico.cilOe} ${servico.adicao}`)

            } else {
                pedido[servico.lente] = [`${servico.esfOd} ${servico.cilOd} ${servico.adicao}`, `${servico.esfOe} ${servico.cilOe} ${servico.adicao}`]
            }
        }
    }

    for (let lente in pedido) {
        lista.content.push({ text: `${lente}`, style: 'header' });
        for (let i = 0; i < pedido[lente].length; i++) {
            lista.content.push(`${pedido[lente][i]}`);
        }
        lista.content.push('\n');
    }

    return lista
}

Servico.delete = async function (id) {
    if (typeof id !== 'string') return;
    const servico = await ServicoModel.findOneAndDelete({ _id: id });
    return servico;
}

Servico.prototype.register = async function () {
    this.valida();

    if (this.errors.length > 0) return;

    this.servico = await ServicoModel.create(this.body);
}

Servico.prototype.valida = function () {
    this.cleanUp()
    if (!this.body.nome) this.errors.push('O cliente não tem nome?');

    if (this.body.esfOd && this.body.esfOd != '') {
        if (this.body.esfOd[0] != '+' && this.body.esfOd[0] != '-') {
            this.errors.push('Grau esférico do olho direito, positivo ou negativo?');
        }
    }

    if (this.body.esfOe && this.body.esfOe != '') {
        if (this.body.esfOe[0] != '+' && this.body.esfOe[0] != '-') {
            this.errors.push('Grau esférico do olho esquerdo, positivo ou negativo?');
        }
    }

    if (this.body.cilOd && !this.body.eixoOd) this.errors.push('Qual o eixo do olho direito?');

    if (this.body.cilOe && !this.body.eixoOe) this.errors.push('Qual o eixo do olho Esquerdo?');

    if (this.body.eixoOe && Number(this.body.eixoOe) > 180) this.errors.push('Eixo do olho Esquerdo invalido');

    if (this.body.eixoOd && Number(this.body.eixoOd) > 180) this.errors.push('Eixo do olho Direito invalido');

}

Servico.prototype.cleanUp = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
        nome: this.body.nome,
        endereço: this.body.endereço,
        telefone: this.body.telefone,

        esfOd: this.body.esfOd,
        cilOd: this.body.cilOd,
        eixoOd: this.body.eixoOd,

        esfOe: this.body.esfOe,
        cilOe: this.body.cilOe,
        eixoOe: this.body.eixoOe,

        adicao: this.body.adicao,

        dnpOd: this.body.dnpOd,
        alturaOd: this.body.alturaOd,

        dnpOe: this.body.dnpOe,
        alturaOe: this.body.alturaOe,

        armacao: this.body.armacao,
        valorArm: this.body.valorArm,

        lente: this.body.lente,
        valorLen: this.body.valorLen,

        lenteContato: this.body.lenteContato,
        valorLenContato: this.body.valorLenContato,

        total: this.body.total,
        formaPagamento: this.body.formaPagamento,
        valorDin: this.body.valorDin,
        valorCar: this.body.valorCar,
        formaPagamento: this.body.formaPagamento,

        pago: this.body.pago,
        entregue: this.body.entregue,

        pdf: this.body.pdf,

        resta: this.body.resta
    }

}

Servico.prototype.edit = async function (id) {
    if (typeof id !== 'string') return;

    this.valida();

    if (this.errors.length > 0) return;

    this.servico = await ServicoModel.findByIdAndUpdate(id, this.body, { new: true });
}

Servico.prototype.criaPdf = function () {
    const codigoServico = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
    const data = new Date();
    const hoje = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`
    let dataEntrada = hoje;
    let valorEntrada = Number(this.body.valorCar) + Number(this.body.valorDin);

    if (this.body.valorCar == '' && this.body.valorDin == '') {
        dataEntrada = '__ /__ /__ ';
        valorEntrada = '';
    }

    // playground requires you to assign document definition to a variable called dd
    var dd = {
        content: [
            {
                columns: [
                    [
                        {
                            text: 'Ótica Girêh',
                            color: '#333333',
                            width: '*',
                            fontSize: 32,
                            bold: true,
                            alignment: 'Left',
                            margin: [0, 0, 0, 0],
                        },
                        {
                            text: 'Qualidade em visão',
                            color: '#333333',
                            width: '*',
                            fontSize: 16,
                            bold: true,
                            alignment: 'Left',
                            margin: [0, 0, 0, 0],
                        }],
                    {
                        stack: [
                            {
                                columns: [
                                    {
                                        text: 'Código do serviço: ',
                                        color: '#aaaaab',
                                        bold: true,
                                        width: '*',
                                        fontSize: 12,
                                        alignment: 'right',
                                    },
                                    {
                                        text: `${codigoServico}`,
                                        bold: true,
                                        color: '#333333',
                                        fontSize: 12,
                                        alignment: 'right',
                                        width: 100,
                                    },
                                ],
                            },
                            {
                                columns: [
                                    {
                                        text: 'Data',
                                        color: '#aaaaab',
                                        bold: true,
                                        width: '*',
                                        fontSize: 12,
                                        alignment: 'right',
                                    },
                                    {
                                        text: `${hoje}`,
                                        bold: true,
                                        color: '#333333',
                                        fontSize: 12,
                                        alignment: 'right',
                                        width: 100,
                                    },
                                ],
                            },
                            {
                                columns: [
                                    {
                                        text: 'Status',
                                        color: '#aaaaab',
                                        bold: true,
                                        fontSize: 12,
                                        alignment: 'right',
                                        width: '*',
                                    },
                                    {
                                        text: `${this.body.pago}`,
                                        bold: true,
                                        fontSize: 14,
                                        alignment: 'right',
                                        width: 100,
                                    },
                                ],
                            },
                        ],
                    },

                ],
            },
            '\n\n',
            {
                layout: {
                    defaultBorder: false,
                    hLineWidth: function (i, node) {
                        return 1;
                    },
                    vLineWidth: function (i, node) {
                        return 1;
                    },
                    hLineColor: function (i, node) {
                        if (i === 1 || i === 0) {
                            return '#bfdde8';
                        }
                        return '#eaeaea';
                    },
                    vLineColor: function (i, node) {
                        return '#eaeaea';
                    },
                    hLineStyle: function (i, node) {
                        // if (i === 0 || i === node.table.body.length) {
                        return null;
                        //}
                    },
                    // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                    paddingLeft: function (i, node) {
                        return 10;
                    },
                    paddingRight: function (i, node) {
                        return 10;
                    },
                    paddingTop: function (i, node) {
                        return 2;
                    },
                    paddingBottom: function (i, node) {
                        return 2;
                    },
                    fillColor: function (rowIndex, node, columnIndex) {
                        return '#fff';
                    },
                },
                table: {
                    headerRows: 1,
                    widths: ['*', 80],
                    body: [
                        [
                            {
                                text: 'DESCRIÇÃO',
                                fillColor: '#eaf2f5',
                                border: [false, true, false, true],
                                margin: [0, 5, 0, 5],
                                textTransform: 'uppercase',
                            },
                            {
                                text: 'TOTAL',
                                border: [false, true, false, true],
                                alignment: 'right',
                                fillColor: '#eaf2f5',
                                margin: [0, 5, 0, 5],
                                textTransform: 'uppercase',
                            },
                        ],
                        [
                            {
                                text: `${this.body.lente}`,
                                border: [false, false, false, true],
                                margin: [0, 5, 0, 5],
                                alignment: 'left',
                            },
                            {
                                border: [false, false, false, true],
                                text: `${this.body.valorLen}`,
                                fillColor: '#f5f5f5',
                                alignment: 'right',
                                margin: [0, 5, 0, 5],
                            },
                        ],
                        [
                            {
                                text: `${this.body.armacao}`,
                                border: [false, false, false, true],
                                margin: [0, 5, 0, 5],
                                alignment: 'left',
                            },
                            {
                                text: `${this.body.valorArm}`,
                                border: [false, false, false, true],
                                fillColor: '#f5f5f5',
                                alignment: 'right',
                                margin: [0, 5, 0, 5],
                            },
                        ],
                        [
                            {
                                text: `${this.body.lenteContato}`,
                                border: [false, false, false, true],
                                margin: [0, 5, 0, 5],
                                alignment: 'left',
                            },
                            {
                                text: `${this.body.valorLenContato}`,
                                border: [false, false, false, true],
                                fillColor: '#f5f5f5',
                                alignment: 'right',
                                margin: [0, 5, 0, 5],
                            },
                        ],
                        [
                            {
                                text: 'TOTAL',
                                border: [false, false, false, true],
                                margin: [0, 5, 0, 5],
                                alignment: 'left',
                            },
                            {
                                text: `${this.body.total}`,
                                border: [false, false, false, true],
                                fillColor: '#f5f5f5',
                                alignment: 'right',
                                margin: [0, 5, 0, 5],
                            },
                        ],
                    ],
                },
            },
            '\n',
            {
                columns: [
                    [
                        {
                            layout: {
                                defaultBorder: false,
                                hLineWidth: function (i, node) {
                                    return 1;
                                },
                                vLineWidth: function (i, node) {
                                    return 1;
                                },
                                hLineColor: function (i, node) {
                                    return '#eaeaea';
                                },
                                vLineColor: function (i, node) {
                                    return '#eaeaea';
                                },
                                hLineStyle: function (i, node) {
                                    // if (i === 0 || i === node.table.body.length) {
                                    return null;
                                    //}
                                },
                                // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                                paddingLeft: function (i, node) {
                                    return 10;
                                },
                                paddingRight: function (i, node) {
                                    return 10;
                                },
                                paddingTop: function (i, node) {
                                    return 3;
                                },
                                paddingBottom: function (i, node) {
                                    return 3;
                                },
                                fillColor: function (rowIndex, node, columnIndex) {
                                    return '#fff';
                                },
                            },
                            table: {
                                headerRows: 1,
                                widths: [100, 100],
                                body: [
                                    [
                                        {
                                            text: 'ENTRADA',
                                            border: [false, true, false, true],
                                            alignment: 'left',
                                            margin: [0, 5, 0, 5],
                                        },
                                        {
                                            border: [true, true, true, true],
                                            text: `${dataEntrada}`,
                                            alignment: 'center',
                                            margin: [0, 5, 0, 5],
                                        },
                                    ],
                                    [
                                        {
                                            text: 'VALOR',
                                            border: [false, true, false, true],
                                            alignment: 'left',
                                            margin: [0, 5, 0, 5],
                                        },
                                        {
                                            border: [false, true, false, true],
                                            text: `${valorEntrada}`,
                                            alignment: 'center',
                                            fillColor: '#f5f5f5',
                                            margin: [0, 5, 0, 5],
                                        },
                                    ],
                                    [
                                        {
                                            text: 'RESTA',
                                            border: [false, false, false, true],
                                            alignment: 'left',
                                            margin: [0, 5, 0, 5],
                                        },
                                        {
                                            text: `${this.body.resta}`,
                                            border: [false, false, false, true],
                                            fillColor: '#f5f5f5',
                                            alignment: 'center',
                                            margin: [0, 5, 0, 5],
                                        },
                                    ],
                                ],
                            },
                        },
                    ],
                    {
                        stack: [
                            {

                                layout: {
                                    defaultBorder: false,
                                    hLineWidth: function (i, node) {
                                        return 1;
                                    },
                                    vLineWidth: function (i, node) {
                                        return 1;
                                    },
                                    hLineColor: function (i, node) {
                                        return '#eaeaea';
                                    },
                                    vLineColor: function (i, node) {
                                        return '#eaeaea';
                                    },
                                    hLineStyle: function (i, node) {
                                        // if (i === 0 || i === node.table.body.length) {
                                        return null;
                                        //}
                                    },
                                    // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                                    paddingLeft: function (i, node) {
                                        return 10;
                                    },
                                    paddingRight: function (i, node) {
                                        return 10;
                                    },
                                    paddingTop: function (i, node) {
                                        return 3;
                                    },
                                    paddingBottom: function (i, node) {
                                        return 3;
                                    },
                                    fillColor: function (rowIndex, node, columnIndex) {
                                        return '#fff';
                                    },
                                },
                                table: {
                                    headerRows: 1,
                                    widths: [100, 100],
                                    body: [
                                        [
                                            {
                                                text: 'SAIDA',
                                                border: [false, true, false, true],
                                                alignment: 'left',
                                                margin: [0, 5, 0, 5],
                                            },
                                            {
                                                border: [true, true, true, true],
                                                text: '__ /__ /__ ',
                                                alignment: 'center',
                                                margin: [0, 5, 0, 5],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'VALOR',
                                                border: [false, true, false, true],
                                                alignment: 'left',
                                                margin: [0, 5, 0, 5],
                                            },
                                            {
                                                border: [false, true, false, true],
                                                text: '',
                                                alignment: 'center',
                                                fillColor: '#f5f5f5',
                                                margin: [0, 5, 0, 5],
                                            },
                                        ],
                                        [
                                            {
                                                text: 'ASS.:',
                                                border: [false, false, false, true],
                                                alignment: 'left',
                                                margin: [0, 5, 0, 5],
                                            },
                                            {
                                                text: '',
                                                border: [false, false, false, true],
                                                alignment: 'center',
                                                margin: [0, 5, 0, 5],
                                            },
                                        ],
                                    ],
                                },


                            },],
                    },

                ],
            },

            '\n',
            ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
            '\n',
            {
                columns: [
                    [
                        {
                            text: 'Ótica Girêh',
                            color: '#333333',
                            width: '*',
                            fontSize: 32,
                            bold: true,
                            alignment: 'Left',
                            margin: [0, 0, 0, 0],
                        },
                        {
                            text: 'CAJU',
                            color: '#333333',
                            width: '*',
                            fontSize: 16,
                            bold: true,
                            alignment: 'Left',
                            margin: [0, 0, 0, 0],
                        }],
                    {
                        stack: [
                            {
                                columns: [
                                    {
                                        text: 'Código do serviço: ',
                                        color: '#aaaaab',
                                        bold: true,
                                        width: '*',
                                        fontSize: 12,
                                        alignment: 'right',
                                    },
                                    {
                                        text: `${codigoServico}`,
                                        bold: true,
                                        color: '#333333',
                                        fontSize: 12,
                                        alignment: 'right',
                                        width: 100,
                                    },
                                ],
                            },
                            {
                                columns: [
                                    {
                                        text: 'Cliente: ',
                                        color: '#aaaaab',
                                        bold: true,
                                        width: '*',
                                        fontSize: 12,
                                        alignment: 'right',
                                    },
                                    {
                                        text: `${this.body.nome}`,
                                        bold: true,
                                        color: '#333333',
                                        fontSize: 12,
                                        alignment: 'right',
                                        width: 100,
                                    },
                                ],
                            },
                            {
                                columns: [
                                    {
                                        text: 'Data',
                                        color: '#aaaaab',
                                        bold: true,
                                        width: '*',
                                        fontSize: 12,
                                        alignment: 'right',
                                    },
                                    {
                                        text: `${hoje}`,
                                        bold: true,
                                        color: '#333333',
                                        fontSize: 12,
                                        alignment: 'right',
                                        width: 100,
                                    },
                                ],
                            },
                        ],
                    },

                ],
            },
            '\n\n',
            {
                style: 'tableExample',
                table: {
                    widths: [45, 70, 70, 70, 70, 70],
                    heights: [20, 20, 20, 20, 20, 20,],
                    body: [
                        ['', 'Esferico', 'Cilindrcio', 'Eixo', 'DNP', 'Altura'],
                        ['OD', `${this.body.esfOd}`, `${this.body.cilOd}`, `${this.body.eixoOd}`, `${this.body.dnpOd}`, `${this.body.alturaOd}`],
                        ['OE', `${this.body.esfOe}`, `${this.body.cilOe}`, `${this.body.eixoOe}`, `${this.body.dnpOe}`, `${this.body.alturaOe}`],
                    ]
                }
            },
            {
                style: 'tableExample',
                table: {
                    widths: [45, 386.5],
                    heights: [20],
                    body: [
                        ['Adição', `${this.body.adicao}`],
                    ]
                }
            },
            '\n',
            {
                style: 'tableExample',
                table: {
                    widths: [100, 333],
                    heights: [20],
                    body: [
                        ['Armação', `${this.body.armacao}`],
                    ]
                }
            },
            {
                style: 'tableExample',
                table: {
                    widths: [100, 333],
                    heights: [20],
                    body: [
                        ['Lente', `${this.body.lente}`],
                    ]
                }
            },
            '\n\n',
            {
                style: 'tableExample',
                table: {
                    widths: [100, 333],
                    heights: [20],
                    body: [
                        ['Nome', `${this.body.nome}`],
                    ]
                }
            },
            {
                style: 'tableExample',
                table: {
                    widths: [100, 333],
                    heights: [20],
                    body: [
                        ['Telefone', `${this.body.telefone}`],
                    ]
                }
            },
        ],
        styles: {
            notesTitle: {
                fontSize: 10,
                bold: true,
                margin: [50, 0, 0, 3],
            },
            notesText: {
                fontSize: 10,
            },
        },
        defaultStyle: {
            columnGap: 20,
            //font: 'Quicksand',
        },
    };

    return dd
}


const formataData = (dia, mes) => {
    let fdia = ''
    let fmes = ''
    if (dia < 10) fdia = `0${dia}`
    else fdia = `${dia}`

    if (mes < 10) fmes = `0${mes}`
    else fmes = `${mes}`

    return `${fdia}/${fmes}`
}

module.exports = Servico;
