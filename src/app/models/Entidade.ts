import mongoose from "mongoose";

const EntidadeSchema = new mongoose.Schema({
	nome_entidade: {
		type: String,
	},
	estado: {
		type: String,
	},
	municipio: {
		type: String,
	},
});

const EntidadeModel = mongoose.model("Entidade", EntidadeSchema);

export default EntidadeModel;
