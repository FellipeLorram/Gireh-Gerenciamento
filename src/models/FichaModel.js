const mongoose = require('mongoose');

const FichaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    endereço: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    idade: { type: String, required: false, default: '' },

    anaminese: { type: String, required: false, default: '' },

    oftOd: { type: String, required: false, default: '' },
    oftOe: { type: String, required: false, default: '' },

    tonoOd: { type: String, required: false, default: '' },
    tonoOe: { type: String, required: false, default: '' },

    motilidade: { type: String, required: false, default: '' },
    PPC: { type: String, required: false, default: '' },
    PPA: { type: String, required: false, default: '' },

    LsEsfOd: { type: String, required: false, default: '' },
    LsCilOd: { type: String, required: false, default: '' },
    LsEixoOd: { type: String, required: false, default: '' },
    LsAddOd: { type: String, required: false, default: '' },

    LsEsfOe: { type: String, required: false, default: '' },
    LsCilOe: { type: String, required: false, default: '' },
    LsEixoOe: { type: String, required: false, default: '' },
    LsAddOe: { type: String, required: false, default: '' },

    rxEsfOd: { type: String, required: false, default: '' },
    rxCilOd: { type: String, required: false, default: '' },
    rxEixoOd: { type: String, required: false, default: '' },
    rxAddOd: { type: String, required: false, default: '' },

    rxEsfOe: { type: String, required: false, default: '' },
    rxCilOe: { type: String, required: false, default: '' },
    rxEixoOe: { type: String, required: false, default: '' },
    rxAddOe: { type: String, required: false, default: '' },

    atendido: { type: String, required: false, default: '' },
    CriadoEm: { type: Date, default: Date.now }
});

const FichaModel = mongoose.model('Ficha', FichaSchema);

function Ficha(body) {
    this.body = body;
    this.errors = [];
    this.ficha = null;
}

Ficha.searchId = async function (id) {
    if (typeof id !== 'string') return;
    const ficha = await FichaModel.findById(id);
    return ficha;
}

Ficha.searchFichas = async function (DeData, AteData) {
    if (!DeData || !AteData) return await FichaModel.find().sort({ CriadoEm: -1 });
    if (DeData == AteData) return await FichaModel.find({ CriadoEm: new Date(DeData) });
    return await FichaModel.find({ CriadoEm: { "$gte": new Date(DeData), "$lte": new Date(AteData) } });
}

Ficha.searchNameFichas = async function (Nome) {
    const ficha = FichaModel.find({ nome: { $regex: '^' + Nome, $options: 'i' } }).sort({ CriadoEm: -1 })
    return ficha;
}

Ficha.delete = async function (id) {
    if (typeof id !== 'string') return;
    const ficha = await FichaModel.findOneAndDelete({ _id: id });
    return ficha;
}

Ficha.prototype.register = async function () {
    this.valida();

    if (this.errors.length > 0) return;

    this.ficha = await FichaModel.create(this.body);
}

Ficha.prototype.valida = function () {
    this.cleanUp()
    if (!this.body.nome) this.errors.push('O cliente não tem nome?');
}

Ficha.prototype.cleanUp = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string' && key !== 'atendido') {
            this.body[key] = '';
        }

    }

    this.body = {
        nome: this.body.nome,
        endereço: this.body.endereço,
        telefone: this.body.telefone,
        idade: this.body.idade,

        anaminese: this.body.anaminese,

        oftOd: this.body.oftOd,
        oftOde: this.body.oftOde,

        tonoOd: this.body.tonoOd,
        tonoOe: this.body.tonoOe,

        motilidade: this.body.motilidade,
        PPC: this.body.PPC,
        PPA: this.body.PPA,

        LsEsfOd: this.body.LsEsfOd,
        LsCilOd: this.body.LsCilOd,
        LsEixoOd: this.body.LsEixoOd,
        LsAddOd: this.body.LsAddOd,

        LsEsfOe: this.body.LsEsfOe,
        LsCilOe: this.body.LscilOe,
        LsEixoOe: this.body.LsEixoOe,
        LsAddOe: this.body.LsAddOe,

        rxEsfOd: this.body.rxEsfOd,
        rxCilOd: this.body.rxCilOd,
        rxEixoOd: this.body.rxEixoOd,
        rxAddOd: this.body.rxAddOd,

        rxEsfOe: this.body.rxEsfOe,
        rxCilOe: this.body.rxCilOe,
        rxEixoOe: this.body.rxEixoOe,
        rxAddOe: this.body.rxAddOe,

        atendido: this.body.atendido

    }

}

Ficha.prototype.edit = async function (id) {
    if (typeof id !== 'string') return;

    this.valida();

    if (this.errors.length > 0) return;

    this.ficha = await FichaModel.findByIdAndUpdate(id, this.body, { new: true });
}

module.exports = Ficha;
