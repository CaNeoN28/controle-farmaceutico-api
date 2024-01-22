import mongoose from "mongoose";
import validarCNPJ from "../utils/validarCNPJ";
import validarCEP from "../utils/validarCEP";
import { validarCidade, validarEstado } from "../utils/validarEstadoMunicipio";
import validarHorarioServico from "../utils/validarHorarioServico";

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

const HorarioServicoSchema = new mongoose.Schema(
	{
		dia_semana: {
			type: String,
			enum: {
				values: [
					"Segunda-feira",
					"Terça-feira",
					"Quarta-feira",
					"Quinta-feira",
					"Sexta-feira",
					"Sábado",
					"Domingo",
				],
				message: "Dia da semana inválido",
			},
		},
		horario_entrada: {
			type: String,
			required: [true, "Horário de entrada é obrigatório"],
			validate: {
				validator: (horario_entrada: string) => {
					const valido = validarHorarioServico(horario_entrada);

					if (!valido) return valido;

					const dados = this as any;
					let { horario_saida }: { horario_saida?: string } = {};

					if (!dados.op) {
						horario_saida = dados.horario_saida;
					} else {
						horario_saida = dados._update.$set.horario_saida;
					}

					const [horaEntrada, minutoEntrada] = horario_saida!
						.split(":")
						.map((v) => Number(v));
					const [horaSaida, minutoSaida] = horario_entrada
						.split(":")
						.map((v) => Number(v));

					if (horaSaida < horaEntrada) {
						return false;
					} else if (horaSaida == horaEntrada && minutoEntrada > minutoSaida) {
						return false;
					}

					return true;
				},
				message: "Horário de entrada inválido",
			},
		},
		horario_saida: {
			type: String,
			required: [true, "Horário de entrada é obrigatório"],
			validate: {
				validator: (horario_saida: string) => {
					const valido = validarHorarioServico(horario_saida);
					if (!valido) return valido;

					const dados = this as any;
					let { horario_entrada }: { horario_entrada?: string } = {};
					
					if (!dados.op) {
						horario_entrada = dados.horario_entrada;
					} else {
						horario_entrada = dados._update.$set.horario_entrada;
					}

					const [horaEntrada, minutoEntrada] = horario_entrada!
						.split(":")
						.map((v) => Number(v));
					const [horaSaida, minutoSaida] = horario_saida
						.split(":")
						.map((v) => Number(v));

					if (horaSaida < horaEntrada) {
						return false;
					} else if (horaSaida == horaEntrada && minutoEntrada > minutoSaida) {
						return false;
					}

					return true;
				},
				message: "Horário de saída inválido",
			},
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
		validate: {
			validator: (v: Array<string>) => {
				const valido = !v.find((v) => {
					const dataValida = isNaN(Number(new Date(v)))

					return dataValida
				});

				return valido
			},
			message: "Dia de plantão inválido"
		},
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
