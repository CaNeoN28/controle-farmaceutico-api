import mongoose from "mongoose";
import { validarCidade, validarEstado } from "../utils/validarEstadoMunicipio";
import Entidade from "../../types/Entidade";

const EntidadeSchema = new mongoose.Schema({
	nome_entidade: {
		type: String,
		required: [true, "Nome da entidade é obrigatório"],
		minlength: [3, "Nome da entidade inválido"],
	},
	estado: {
		type: String,
		required: [true, "Estado é obrigatório"],
		validate: {
			validator: validarEstado,
			message: "Estado inválido",
		},
	},
	municipio: {
		type: String,
		required: [true, "Município é obrigatório"],
		validate: {
			validator: function () {
				const dados = this as Entidade;
				const valido = validarCidade(dados.municipio, dados.estado);

				return valido;
			},
			message: "Município inválido",
		},
	},
	ativo: {
		type: Boolean,
		default: true,
	},
});

const EntidadeModel = mongoose.model("Entidade", EntidadeSchema);

export default EntidadeModel;
