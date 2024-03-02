import Erro from "../../types/Erro";
import FarmaciaRepository from "../repositories/Farmacia.repository";
import ImagemRepository from "../repositories/Imagem.repository";
import { validarID } from "../utils/validators";

async function deleteFarmaciaService(id: string) {
	let erros: Erro | undefined = undefined;
	if (validarID<string>(id)) {
		const { farmacia, erro } = await FarmaciaRepository.deleteFarmacia(id);

		if (erro) {
			erros = {
				codigo: erro.codigo,
				erro: erro.erro,
			};
		}

		if (farmacia && farmacia.imagem_url)
			await ImagemRepository.removerImagem(
				"farmacia",
				farmacia.id,
				farmacia.imagem_url
			);
	} else {
		erros = {
			codigo: 400,
			erro: "Id inválido",
		};
	}

	if (erros) {
		throw erros;
	}
}

export default deleteFarmaciaService;
