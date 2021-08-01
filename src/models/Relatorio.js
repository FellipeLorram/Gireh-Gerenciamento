const Servico = require('../models/ServicoModel');
const Concerto = require('../models/ConcertoModel');
const Ficha = require('../models/FichaModel');

exports.relatorio = async function (DeData, AteData) {
    try {
        const Ddata = DeData.split('-')
        const Adata = AteData.split('-')
        AteData = `${Adata[0]}-${Adata[1]}-${Number(Adata[2]) + 1}`
        let data = ''

        const servicos = await Servico.searchServicos(DeData, AteData);
        const lentes = await Servico.searchLentes(DeData, AteData);
        const concertos = await Concerto.searchConcertos(DeData, AteData)
        const exames = await Ficha.searchFichas(DeData, AteData);

        if (Ddata[2] != Adata[2]) data = `Relatório referente ao intervalo entre\n ${Ddata[2]}/${Ddata[1]}/${Ddata[0]} e ${Adata[2]}/${Adata[1]}/${Adata[0]}`
        else data = `Relatório referente a ${Ddata[2]}/${Ddata[1]}/${Ddata[0]}`

        var relatorio = setRelatorio(servicos, lentes, concertos, exames, data)

        return relatorio;
    } catch (e) {
        console.log(e)
    }

}

exports.geraRelatorio = async (DeData, AteData) => {
    const servicos = await Servico.searchServicos(DeData, AteData);
    const concertos = await Concerto.searchConcertos(DeData, AteData)
    const exames = await Ficha.searchFichas(DeData, AteData);


    const relatorio = {
        qtdVenda: 0,
        vendasPagas: 0,
        vendasNaoPagas: 0,

        vendasPagasDinheiro: 0,
        vendasPagasTransferencia: 0,
        vendasPagasDinheiroEcartao: 0,
        vendasPagasPix: 0,
        vendasPagasCartao: 0,
        naoEpecificado: 0,

        lenteMVendida: 0,

        valorAreceber: 0,
        valorRecebido: 0,

        lucroVendas: 0,

        qtdConcertos: 0,
        Solda: { qtd: 0, lcBruto: 0 },
        Mola: { qtd: 0, lcBruto: 0 },
        Parafuso: { qtd: 0, lcBruto: 0 },
        Plaqueta: { qtd: 0, lcBruto: 0 },
        Passagem: { qtd: 0, lcBruto: 0 },
        concertosNaoPagos: 0,
        concertosPagos: 0,
        lucroConcertos: 0,
        concertosAReceber: 0,
        concertosRecebido: 0,


        qtdExames: 0,
        qtdClientesAtendidos: 0,
        qtdClientesNaoAtendidos: 0,

        lucroBruto: 0,
    }

    for (servico of servicos) {
        relatorio.qtdVenda++;

        if (servico.pago == 'Pago') relatorio.vendasPagas++;
        else if (servico.pago == 'Não pago') relatorio.vendasNaoPagas++;

        if (servico.pago == 'Pago' && servico.formaPagamento == 'Dinheiro') relatorio.vendasPagasDinheiro++;
        else if (servico.pago == 'Pago' && servico.formaPagamento == 'Cartão') relatorio.vendasPagasCartao++;
        else if (servico.pago == 'Pago' && servico.formaPagamento == 'Dinheiro e Cartão') relatorio.vendasPagasDinheiroEcartao++;
        else if (servico.pago == 'Pago' && servico.formaPagamento == 'Pix') relatorio.vendasPagasPix++;
        else if (servico.pago == 'Pago' && servico.formaPagamento == 'Transferência') relatorio.vendasPagasTransferencia++;
        else if (servico.pago == 'Pago') relatorio.naoEpecificado++;

        relatorio.valorAreceber += Number(servico.resta.replace(',', '.'));
        relatorio.lucroVendas += Number(servico.total.replace(',', '.'));
    }

    for (concerto of concertos) {
        relatorio.qtdConcertos++;
        relatorio.lucroConcertos += Number(concerto.valor.replace(',', '.'))
        if (concerto.pago == 'Não Pago') relatorio.concertosNaoPagos++;
        if (concerto.pago == 'Pago') relatorio.concertosPagos++;

        if (concerto.pago == 'Pago') relatorio.concertosRecebido += Number(concerto.valor.replace(',', '.'));
        else if (concerto.pago == 'Não Pago') relatorio.concertosAReceber += Number(concerto.valor.replace(',', '.'));

        if (concerto.tipo == 'Solda') {
            if (concerto.pago == 'Pago') relatorio.Solda.lcBruto += Number(concerto.valor.replace(',', '.'));
            relatorio.Solda.qtd++;
        }


        if (concerto.tipo == 'Mola') {
            if (concerto.pago == 'Pago') relatorio.Mola.lcBruto += Number(concerto.valor.replace(',', '.'));
            relatorio.Mola.qtd++;
        }

        if (concerto.tipo == 'Parafuso') {
            if (concerto.pago == 'Pago') relatorio.Parafuso.lcBruto += Number(concerto.valor.replace(',', '.'));
            relatorio.Parafuso.qtd++
        };

        if (concerto.tipo == 'Plaqueta') {
            if (concerto.pago == 'Pago') relatorio.Plaqueta.lcBruto += Number(concerto.valor.replace(',', '.'));
            relatorio.Plaqueta.qtd++;
        }

        if (concerto.tipo == 'Passagem') {
            if (concerto.pago == 'Pago') relatorio.Passagem.lcBruto += Number(concerto.valor.replace(',', '.'));
            relatorio.Passagem.qtd++;
        }


    }

    for (exame of exames) {
        relatorio.qtdExames++;
        if (exame.atendido == 'Atendido') relatorio.qtdClientesAtendidos++;
        if (exame.atendido == 'Não Atendido') relatorio.qtdClientesNaoAtendidos++;
    }

    relatorio.lucroBruto += Number(relatorio.lucroConcertos) + Number(relatorio.lucroVendas)
    relatorio.valorRecebido = Number(relatorio.lucroVendas) - Number(relatorio.valorAreceber)

    relatorio.lentesMaisVendidas = await setLentesMaisVendidas(DeData, AteData)
    relatorio.armacaoMaisVendidas = await setArmacaoMaisVendidas(DeData, AteData)


    return relatorio;

}

setRelatorio = (servicos, lentes, concertos, exames, data) => {
    let mVendida = 0
    let strMVendida = ''
    for (let l in lentes) {
        if (lentes[l].length > mVendida) {
            mVendida = lentes[l].length
            strMVendida = l
        }
    }


    var relatorio = {
        qtdVenda: 0,
        vendasPagas: 0,
        vendasNaoPagas: 0,

        vendasPagasDinheiro: 0,
        vendasPagasTransferencia: 0,
        vendasPagasDinheiroEcartao: 0,
        vendasPagasPix: 0,
        vendasPagasCartao: 0,

        valorAreceber: 0,
        valorRecebido: 0,

        lucroVendas: 0,

        qtdConcertos: 0,
        qtdSolda: 0,
        qtdMola: 0,
        qtdParafuso: 0,
        qtdPlaqueta: 0,
        qtdPassagem: 0,
        concertosNaoPagos: 0,
        concertosPagos: 0,
        lucroConcertos: 0,

        qtdExames: 0,
        qtdClientesAtendidos: 0,
        qtdClientesNaoAtendidos: 0,

        lucroBruto: 0,
    }

    for (servico of servicos) {
        relatorio.qtdVenda++;

        if (servico.pago == 'Pago') relatorio.vendasPagas++;
        else relatorio.vendasNaoPagas++;

        if (servico.formaPagamento == 'Dinheiro') relatorio.vendasPagasDinheiro++;
        else if (servico.formaPagamento == 'Cartão') relatorio.vendasPagasCartao++;
        else if (servico.formaPagamento == 'Dinheiro e Cartão') relatorio.vendasPagasDinheiroEcartao++;
        else if (servico.formaPagamento == 'Pix') relatorio.vendasPagasPix++;
        else if (servico.formaPagamento == 'Transferência') relatorio.vendasPagasTransferencia++;

        relatorio.valorAreceber += Number(servico.resta);
        relatorio.lucroVendas += Number(servico.total);
    }

    for (concerto of concertos) {
        relatorio.qtdConcertos++;
        relatorio.lucroConcertos += Number(concerto.valor)
        if (concerto.pago == 'Não Pago') relatorio.concertosNaoPagos++;
        if (concerto.pago == 'Pago') relatorio.concertosPagos++;

        if (concerto.tipo == 'Solda') relatorio.qtdSolda++;
        if (concerto.tipo == 'Mola') relatorio.qtdMola++;
        if (concerto.tipo == 'Parafuso') relatorio.qtdParafuso++;
        if (concerto.tipo == 'Plaqueta') relatorio.qtdPlaqueta++;
        if (concerto.tipo == 'Passagem') relatorio.qtdPassagem++;

    }

    for (exame of exames) {
        relatorio.qtdExames++;
        if (exame.atendido == 'Atendido') relatorio.qtdClientesAtendidos++;
        if (exame.atendido == 'Não Atendido') relatorio.qtdClientesNaoAtendidos++;
    }

    relatorio.lucroBruto += Number(relatorio.lucroConcertos) + Number(relatorio.lucroVendas)
    relatorio.valorRecebido = Number(relatorio.lucroVendas) - Number(relatorio.valorAreceber)

    return {
        content: [
            {
                text: `${data}`,
                style: 'header',
                alignment: 'center'
            },
            { text: 'Vendas', style: 'subheader', alignment: 'center' },

            {
                style: 'tableExample',
                table: {
                    widths: [400, 100],
                    heights: [20, 20, 20, 20, 20, 20, 20, 20],
                    body: [
                        ['Quantidade de Vendas', { text: `${relatorio.qtdVenda}`, noWrap: true, alignment: 'center' }],
                        ['Lente Mais Vendida', { text: `${strMVendida}`, noWrap: false, alignment: 'center' }],
                        ['Vendas Pagas', { text: `${relatorio.vendasPagas}`, noWrap: true, alignment: 'center' }],
                        ['Vendas Pagas no Cartão', { text: `${relatorio.vendasPagasCartao}`, noWrap: true, alignment: 'center' }],
                        ['Vendas Pagas no Dinheiro', { text: `${relatorio.vendasPagasDinheiro}`, noWrap: true, alignment: 'center' }],
                        ['Vendas Pagas no Dinheiro e Cartão', { text: `${relatorio.vendasPagasDinheiroEcartao}`, noWrap: true, alignment: 'center' }],
                        ['Vendas Pagas via Pix', { text: `${relatorio.vendasPagasPix}`, noWrap: true, alignment: 'center' }],
                        ['Vendas Pagas via Transferência', { text: `${relatorio.vendasPagasTransferencia}`, noWrap: true, alignment: 'center' }],
                        ['Vendas Não Pagas', { text: `${relatorio.vendasNaoPagas}`, noWrap: true, alignment: 'center', italics: true }],
                    ]
                }
            },
            { text: 'Financeiro - Vendas', style: 'subheader2', alignment: 'left' },
            {
                style: 'tableExample2',
                table: {
                    widths: [400, 100],
                    heights: [20, 20, 20, 20, 20, 20, 20, 20],
                    body: [
                        ['Total Recebido', { text: `R$${relatorio.valorRecebido}`, noWrap: true, alignment: 'center' }],
                        ['Total a Receber', { text: `R$${relatorio.valorAreceber}`, noWrap: true, alignment: 'center' }],
                        ['Lucro Bruto', { text: `R$${relatorio.lucroVendas}`, noWrap: true, alignment: 'center' }],
                    ]
                }
            },
            { text: 'Concertos', style: 'subheader', alignment: 'center' },

            {
                style: 'tableExample',
                table: {
                    widths: [400, 100],
                    heights: [20, 20, 20, 20, 20, 20, 20, 20],
                    body: [
                        ['Quantidade de Concertos', { text: `${relatorio.qtdConcertos}`, noWrap: true, alignment: 'center' }],
                        ['Concertos Pagos', { text: `${relatorio.concertosPagos}`, noWrap: true, alignment: 'center' }],
                        ['Concertos Não Pagos', { text: `${relatorio.concertosNaoPagos}`, noWrap: true, alignment: 'center' }],
                        ['Soldas', { text: `${relatorio.qtdSolda}`, noWrap: true, alignment: 'center' }],
                        ['Mola', { text: `${relatorio.qtdMola}`, noWrap: true, alignment: 'center' }],
                        ['Parafuso', { text: `${relatorio.qtdParafuso}`, noWrap: true, alignment: 'center' }],
                        ['Plaquetas', { text: `${relatorio.qtdPlaqueta}`, noWrap: true, alignment: 'center' }],
                        ['Passagens', { text: `${relatorio.qtdPassagem}`, noWrap: true, alignment: 'center', italics: true }],
                    ]
                }
            },
            { text: 'Financeiro - Concertos', style: 'subheader2', alignment: 'left' },
            {
                style: 'tableExample2',
                table: {
                    widths: [400, 100],
                    heights: [20, 20, 20, 20, 20, 20, 20, 20],
                    body: [
                        ['Lucro Bruto', { text: `R$${relatorio.lucroConcertos}`, noWrap: true, alignment: 'center' }],
                    ]
                }
            }, '\n', '\n',
            { text: 'Exames', style: 'subheader', alignment: 'center' },

            {
                style: 'tableExample',
                table: {
                    widths: [400, 100],
                    heights: [20, 20, 20, 20, 20, 20, 20, 20],
                    body: [
                        ['Quantidade de Exames', { text: `${relatorio.qtdExames}`, noWrap: true, alignment: 'center' }],
                        ['Quantidade de Pacientes Atendidos', { text: `${relatorio.qtdClientesAtendidos}`, noWrap: true, alignment: 'center' }],
                        ['Quantidade de Pacientes não Atendidos', { text: `${relatorio.qtdClientesNaoAtendidos}`, noWrap: true, alignment: 'center' }],
                    ]
                }
            },
            { text: 'Financeiro', style: 'subheader', alignment: 'center' },

            {
                style: 'tableExample',
                table: {
                    widths: [400, 100],
                    heights: [20, 20, 20, 20],
                    body: [
                        ['Lucro Bruto Vendas', { text: `R$${relatorio.lucroVendas}`, noWrap: true, alignment: 'center' }],
                        ['Lucro Bruto Concertos', { text: `R$${relatorio.lucroConcertos}`, noWrap: true, alignment: 'center' }],
                        ['Lucro Bruto Total', { text: `R$${relatorio.lucroBruto}`, noWrap: true, alignment: 'center' }],
                        ['Entrou', { text: `R$${(relatorio.lucroBruto - relatorio.valorAreceber) + relatorio.lucroConcertos}`, noWrap: true, alignment: 'center' }],
                    ]
                }
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, -20, 0, 5]
            },
            subheader: {
                fontSize: 16,
                italics: true,
                bold: true,
                margin: [0, 20, 0, 5]
            },
            subheader2: {
                fontSize: 12,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            tableExample: {
                margin: [0, 10, 0, 0]
            },
            tableExample2: {
                margin: [0, 3, 0, 0]
            },

        },
        defaultStyle: {
            // alignment: 'justify'
        }

    }


}

const setLentesMaisVendidas = async (DeData, AteData) => {
    const lentes = await Servico.searchLentes(DeData, AteData);
    const lentesMaisVendidasToSort = {}
    lentes.forEach(Keylente => {
        if (Keylente.lente in lentesMaisVendidasToSort) {
            if (Keylente.lente !== '') lentesMaisVendidasToSort[Keylente.lente]++;
        } else {
            if (Keylente.lente !== '') lentesMaisVendidasToSort[Keylente.lente] = 1
        }
    });


    let lentesMaisVendidas_lista = [];
    for (let lente in lentesMaisVendidasToSort) {
        lentesMaisVendidas_lista.push([lente, lentesMaisVendidasToSort[lente]]);
    }

    lentesMaisVendidas_lista.sort(function (a, b) {
        return b[1] - a[1];
    });

    const lentesMaisVendidas = {
        'primeiro': { lente: lentesMaisVendidas_lista[0][0], qtd: lentesMaisVendidas_lista[0][1], lucroBruto: 0 },
        'segundo': { lente: lentesMaisVendidas_lista[1][0], qtd: lentesMaisVendidas_lista[1][1], lucroBruto: 0 },
        'terceiro': { lente: lentesMaisVendidas_lista[2][0], qtd: lentesMaisVendidas_lista[2][1], lucroBruto: 0 },
        'lcBruto': 0
    }

    lentes.forEach(keylente => {
        if (keylente.lente == lentesMaisVendidas_lista[0][0]) lentesMaisVendidas.primeiro.lucroBruto += Number(keylente.valorLen.replace(',', '.'));
        if (keylente.lente == lentesMaisVendidas_lista[1][0]) lentesMaisVendidas.segundo.lucroBruto += Number(keylente.valorLen.replace(',', '.'));
        if (keylente.lente == lentesMaisVendidas_lista[2][0]) lentesMaisVendidas.terceiro.lucroBruto += Number(keylente.valorLen.replace(',', '.'));
        //lentesMaisVendidas.lcBruto += Number(keylente.valorLen.replace(',', '.'));
    });

    return lentesMaisVendidas
}

const setArmacaoMaisVendidas = async (DeData, AteData) => {
    const armacoes = await Servico.searchArmacoes(DeData, AteData);
    const armacoesMaisVendidasToSort = {}
    armacoes.forEach(KeyArmacao => {
        if (KeyArmacao.armacao in armacoesMaisVendidasToSort) {
            if (KeyArmacao.armacao !== '' && KeyArmacao.armacao !== 'Própia') armacoesMaisVendidasToSort[KeyArmacao.armacao]++;
        } else {
            if (KeyArmacao.armacao !== '' && KeyArmacao.armacao !== 'Própia') armacoesMaisVendidasToSort[KeyArmacao.armacao] = 1
        }
    });

    let armacoesMaisVendidas_lista = [];
    for (let armacao in armacoesMaisVendidasToSort) {
        armacoesMaisVendidas_lista.push([armacao, armacoesMaisVendidasToSort[armacao]]);
    }

    armacoesMaisVendidas_lista.sort(function (a, b) {
        return b[1] - a[1];
    });

    const armacaoMaisVendidas = {
        'primeiro': { armacao: armacoesMaisVendidas_lista[0][0], qtd: armacoesMaisVendidas_lista[0][1], lucroBruto: 0 },
        'segundo': { armacao: armacoesMaisVendidas_lista[1][0], qtd: armacoesMaisVendidas_lista[1][1], lucroBruto: 0 },
        'terceiro': { armacao: armacoesMaisVendidas_lista[2][0], qtd: armacoesMaisVendidas_lista[2][1], lucroBruto: 0 },
        'lcBruto': 0
    }

    armacoes.forEach(keyArmacao => {
        if (keyArmacao.armacao == armacoesMaisVendidas_lista[0][0]) armacaoMaisVendidas.primeiro.lucroBruto += Number(keyArmacao.valorArm.replace(',', '.'));
        if (keyArmacao.armacao == armacoesMaisVendidas_lista[1][0]) armacaoMaisVendidas.segundo.lucroBruto += Number(keyArmacao.valorArm.replace(',', '.'));
        if (keyArmacao.armacao == armacoesMaisVendidas_lista[2][0]) armacaoMaisVendidas.terceiro.lucroBruto += Number(keyArmacao.valorArm.replace(',', '.'));
        armacaoMaisVendidas.lcBruto += Number(keyArmacao.valorArm.replace(',', '.'));
    });

    return armacaoMaisVendidas
}