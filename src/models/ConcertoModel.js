const mongoose = require('mongoose');

const ConcertoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    telefone: { type: String, required: false, default: '' },

    tipo: { type: String, required: false, default: '' },
    valor: { type: String, required: false, default: '' },
    
    pago: { type: String, required: false, default: '' },
    entregue: { type: String, required: false, default: '' },
    CriadoEm: { type: Date, default: Date.now }
});

const ConcertoModel = mongoose.model('Concerto', ConcertoSchema);

function Concerto(body) {
    this.body = body;
    this.errors = [];
    this.concerto = null;

}

Concerto.searchId = async function (id) {
    if (typeof id !== 'string') return;
    const concerto = await ConcertoModel.findById(id);
    return concerto;
}

Concerto.searchConcertos = async function () {
    const concerto = await ConcertoModel.find().sort({ CriadoEm: -1 });
    return concerto;
}

Concerto.searchNameConcertos = async function (Nome) {
    const concerto = await ConcertoModel.find({nome: {$regex: '^' + Nome, $options: 'i'}}).sort({ CriadoEm: -1 });
    return concerto;
}

Concerto.delete = async function (id) {
    if (typeof id !== 'string') return;
    const concerto = await ConcertoModel.findOneAndDelete({ _id: id });
    return concerto;
}

Concerto.prototype.register = async function () {
    this.valida();

    if (this.errors.length > 0) return;

    this.concerto = await ConcertoModel.create(this.body);
}

Concerto.prototype.valida = function () {
    this.cleanUp()
    if (!this.body.nome) this.errors.push('O cliente não tem nome?');

}

Concerto.prototype.cleanUp = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
        nome: this.body.nome,
        telefone: this.body.telefone,

        valor: this.body.valor,
        tipo: this.body.tipo,

        pago: this.body.pago,
        entregue: this.body.entregue,

    }

}

Concerto.prototype.edit = async function (id) {
    if (typeof id !== 'string') return;

    this.valida();

    if (this.errors.length > 0) return;

    this.concerto = await ConcertoModel.findByIdAndUpdate(id, this.body, { new: true });
}

Concerto.relatorio = async function(DeData, AteData) {
    if(DeData == AteData)  return await ConcertoModel.find({CriadoEm: new Date(DeData)});
    return await ConcertoModel.find({CriadoEm: {"$gte": new Date(DeData) , "$lte": new Date(AteData)}});
}


module.exports = Concerto;
