import mongoose from "mongoose";

const ImagemSchema = new mongoose.Schema({
	finalidade: {
		type: String,
		enum: ["farmacia", "usuario"],
		required: true,
	},
	id_finalidade: {
		type: String,
	},
	caminho_imagem: {
		type: String,
		required: true,
	},
	confirmacao_expira: {
		type: Date,
	},
});

const ImagemModel = mongoose.model("Imagem", ImagemSchema)

export default ImagemModel
