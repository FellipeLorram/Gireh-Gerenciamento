const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    idade: {type: Number, required: true}
});

const HomeModel = mongoose.model('Home', HomeSchema);

class Home{

}

module.exports = Home;
