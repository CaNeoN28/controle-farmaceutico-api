import { Paths } from "swagger-jsdoc";
import AutenticacaoPaths from "./autenticacao";
import EntidadesPaths from "./entidades";
import FarmaciasPaths from "./farmacias";
import UsuariosPaths from "./usuarios";

const paths: Paths = {
	...AutenticacaoPaths,
	...EntidadesPaths,
	...FarmaciasPaths,
	...UsuariosPaths,
};

export default paths;
