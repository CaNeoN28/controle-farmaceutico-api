import { estados } from "./validarEstadoMunicipio";

export default function getEstadoEMunicipio() {
	const getEstado = () => {
		const estadosArray = Object.keys(estados);

		return estadosArray[Math.floor(Math.random() * estadosArray.length)];
	};

	const estado = getEstado();
	const estadoArray = estados[estado];
	const municipio = estadoArray[Math.floor(Math.random() * estadoArray.length)];

	return { estado, municipio };
}
