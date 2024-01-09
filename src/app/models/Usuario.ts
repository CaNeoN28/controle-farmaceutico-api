import mongoose from "mongoose";
import validarCPF from "../utils/validarCPF";

const DatosAdministrativosSchema = new mongoose.Schema({});

const UsuarioSchema = new mongoose.Schema({
	cpf: {
		type: [String, "CPF inválido"],
		minlength: [11, "CPF inválido"],
		maxlength: [11, "CPF inválido"],
		required: [true, "CPF é obrigatório"],
		validate: {
			validator: (v: string) => {
				return validarCPF(v)
			},
			message: "CPF inválido"
		}
	},
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

export default Usuario;
