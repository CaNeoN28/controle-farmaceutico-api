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
				const dados = this as any;
				let { municipio, estado }: { municipio?: string; estado?: string } = {};

				if (!dados.op) {
					(municipio = dados.municipio), (estado = dados.estado);
				} else {
					municipio = dados._update.$set.municipio;
					estado = dados._update.$set.estado;
				}

				const valido = validarCidade(municipio!, estado!);

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
