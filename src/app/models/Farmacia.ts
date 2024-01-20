import mongoose from "mongoose";
import validarCNPJ from "../utils/validarCNPJ";

const LocalizacaoSchema = new mongoose.Schema(
	{
		x: {
			type: String,
			required: [true, "Coordenada X em localização é obrigatório"],
		},
		y: {
			type: String,
			required: [true, "Coordenada Y em localização é obrigatório"],
		},
	},
	{ _id: false }
);

const EnderecoSchema = new mongoose.Schema(
	{
		cep: {
			type: String,
			required: [true, "CEP é obrigatório"],
		},
		estado: {
			type: String,
			required: [true, "Estado é obrigatório"],
		},
		municipio: {
			type: String,
			required: [true, "Município é obrigatório"],
		},
		bairro: {
			type: String,
			required: [true, "Bairro é obrigatório"],
		},
		logradouro: {
			type: String,
			required: [true, "Logradouro é obrigatório"],
		},
		numero: {
			type: String,
			required: [true, "Número é obrigatório"],
		},
		localizacao: {
			type: LocalizacaoSchema,
			required: [true, "Localização é obrigatório"],
		},
	},
	{ _id: false }
);

const HorarioServicoSchema = new mongoose.Schema(
	{
		dia_semana: {
			type: String,
		},
		horario_entrada: {
			type: String,
		},
		horario_saida: {
			type: String,
		},
	},
	{ _id: false }
);

const FarmaciaSchema = new mongoose.Schema({
	cnpj: {
		type: String,
		required: [true, "CNPJ é obrigatório"],
		validate: {
			validator: validarCNPJ,
			message: "CNPJ inválido",
		},
	},
	nome_fantasia: {
		type: String,
		required: [true, "Nome fantasia é obrigatório"],
		minlength: [3, "Nome fantasia inválido"],
	},
	endereco: {
		type: EnderecoSchema,
		default: {},
	},
	plantoes: {
		type: [String],
		default: [],
	},
	horarios_servico: {
		type: [HorarioServicoSchema],
		default: [],
	},
	imagem_url: {
		type: String,
	},
});

const FarmaciaModel = mongoose.model("Farmacia", FarmaciaSchema);

export default FarmaciaModel;
