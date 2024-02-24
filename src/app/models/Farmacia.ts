import mongoose from "mongoose";
import validarCNPJ from "../utils/validarCNPJ";
import validarCEP from "../utils/validarCEP";
import { validarCidade, validarEstado } from "../utils/validarEstadoMunicipio";

const LocalizacaoSchema = new mongoose.Schema(
	{
		x: {
			type: String,
			required: [true, "Latitude é obrigatório"],
			validate: {
				validator: (v: string) => {
					const latitude = Number(v);

					if (isNaN(latitude)) return false;

					return latitude < 90.0 && latitude > -90.0;
				},
				message: "Latitude inválida",
			},
		},
		y: {
			type: String,
			required: [true, "Longitude é obrigatório"],
			validate: {
				validator: (v: string) => {
					const longitude = Number(v);

					if (isNaN(longitude)) return false;

					return longitude < 180.0 && longitude > -180.0;
				},
				message: "Longitude inválida",
			},
		},
	},
	{ _id: false }
);

const EnderecoSchema = new mongoose.Schema(
	{
		cep: {
			type: String,
			required: [true, "CEP é obrigatório"],
			validate: {
				validator: validarCEP,
				message: "CEP inválido",
			},
		},
		estado: {
			type: String,
			required: [true, "Estado é obrigatório"],
			validate: {
				validator: (v: string) => {
					return validarEstado(v);
				},
				message: "Estado inválido",
			},
		},
		municipio: {
			type: String,
			required: [true, "Município é obrigatório"],
			validate: {
				validator: function () {
					const dados = this as any;
					let { municipio, estado }: { municipio?: string; estado?: string } =
						{};

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
		bairro: {
			type: String,
			required: [true, "Bairro é obrigatório"],
			minlength: [3, "Bairro inválido"],
		},
		logradouro: {
			type: String,
			required: [true, "Logradouro é obrigatório"],
			minlength: [3, "Logradouro inválido"],
		},
		numero: {
			type: String,
			required: [true, "Número é obrigatório"],
			validate: {
				validator: (v: string) => {
					return !isNaN(Number(v));
				},
				message: "Número inválido",
			},
		},
		localizacao: {
			type: LocalizacaoSchema,
			required: [true, "Localização é obrigatório"],
		},
	},
	{ _id: false }
);

const HorarioServico = new mongoose.Schema(
	{
		horario_entrada: {
			type: String,
			required: [true, "Horário de entrada é obrigatório"],
		},
		horario_saida: {
			type: String,
			required: [true, "Horário de saída é obrigatório"],
		},
	},
	{
		_id: false,
	}
);

const HorariosServicoSchema = new mongoose.Schema(
	{
		segunda_feira: {
			type: HorarioServico,
		},
		terca_feira: {
			type: HorarioServico,
		},
		quarta_feira: {
			type: HorarioServico,
		},
		quinta_feira: {
			type: HorarioServico,
		},
		sexta_feira: {
			type: HorarioServico,
		},
		sabado: {
			type: HorarioServico,
		},
		domingo: {
			type: HorarioServico,
		},
	},
	{ _id: false }
);

const Plantao = new mongoose.Schema(
	{
		entrada: {
			type: Date,
			required: [true, "Entrada é obrigatória"],
		},
		saida: {
			type: Date,
			required: [true, "Saída é obrigatória"],
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
		type: [Plantao],
		default: [],
	},
	horarios_servico: {
		type: HorariosServicoSchema,
		default: {},
	},
	imagem_url: {
		type: String,
	},
});

const FarmaciaModel = mongoose.model("Farmacia", FarmaciaSchema);

export default FarmaciaModel;
