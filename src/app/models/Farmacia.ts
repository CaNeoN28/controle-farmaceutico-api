import mongoose from "mongoose";

const LocalizacaoSchema = new mongoose.Schema({
	x: {
		type: String,
		required: [true, "Coordenada X em localização é obrigatório"]
	},
	y: {
		type: String,
		required: [true, "Coordenada Y em localização é obrigatório"]
	},
});

const EnderecoSchema = new mongoose.Schema({
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
});

const HorarioServicoSchema = new mongoose.Schema({
	dia_semana: {
		type: String,
	},
	horario_entrada: {
		type: String,
	},
	horario_saida: {
		type: String,
	},
});

const FarmaciaSchema = new mongoose.Schema({
	cnpj: {
		type: String,
		required: [true, "CNPJ é obrigatório"],
	},
	nome_fantasia: {
		type: String,
		required: [true, "Nome fantasia é obrigatório"],
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
