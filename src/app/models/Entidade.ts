import mongoose from "mongoose";

const EntidadeSchema = new mongoose.Schema({
	nome_entidade: {
		type: String,
		required: [true, "Nome da entidade é obrigatório"],
	},
	estado: {
		type: String,
		required: [true, "Estado é obrigatório"],
	},
	municipio: {
		type: String,
		required: [true, "Município é obrigatório"],
	},
});

const EntidadeModel = mongoose.model("Entidade", EntidadeSchema);

export default EntidadeModel;
