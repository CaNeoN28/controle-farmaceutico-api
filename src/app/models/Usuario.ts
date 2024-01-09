import mongoose from "mongoose";
import validarCPF from "../utils/validarCPF";
import {
	validarEmail,
	validarID,
	validarNomeDeUsuario,
} from "../utils/validators";

const DatosAdministrativosSchema = new mongoose.Schema(
	{
		entidade_relacionada: {
			type: mongoose.Types.ObjectId,
			ref: "Entidade",
			validate: {
				validator: validarID<String>,
				message: "Entidade relacionada em dados administrativos inválida",
			},
			required: [true, "Entidade relacionada é obrigatório"],
		},
		funcao: {
			type: String,
			enum: {
				values: ["ADMINISTRADOR", "GERENTE", "USUARIO", "INATIVO"],
				message: "Função em dados administrativos inválida",
			},
			default: "INATIVO",
		},
	},
	{
		_id: false,
	}
);

const UsuarioSchema = new mongoose.Schema({
	cpf: {
		type: String,
		minlength: [11, "CPF inválido"],
		maxlength: [11, "CPF inválido"],
		required: [true, "CPF é obrigatório"],
		validate: {
			validator: (v: string) => {
				return validarCPF(v);
			},
			message: "CPF inválido",
		},
	},
	dados_administrativos: {
		type: DatosAdministrativosSchema,
		default: {},
	},
	email: {
		type: String,
		required: [true, "Email é obrigatório"],
		validate: {
			validator: validarEmail,
			message: "Email inválido",
		},
	},
	imagem_url: {
		type: String,
	},
	nome_completo: {
		type: String,
		required: [true, "Nome completo é obrigatório"],
		minlength: [3, "Nome completo inválido"],
	},
	nome_usuario: {
		type: String,
		required: [true, "Nome de usuário é obrigatório"],
		validate: {
			validator: validarNomeDeUsuario,
			message: "Nome de usuário inválido",
		},
	},
	numero_registro: {
		type: String,
		required: [true, "Número de registro é obrigatório"],
		validate: {
			validator: (v: string) => {
				return !isNaN(Number(v))
			},
			message: "Número de registro inválido"
		}
	},
	senha: {
		type: String,
		required: [true, "Senha é obrigatório"],
		minlength: [8, "Senha inválida"]
	}
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

export default Usuario;
