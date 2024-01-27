import { Paths } from "swagger-jsdoc";
import AutenticacaoPaths from "./autenticacao";
import EntidadesPaths from "./entidades";
import FarmaciasPaths from "./farmacias";
import UsuariosPaths from "./usuarios";
import ImagensPaths from "./imagens";

const paths: Paths = {
	...AutenticacaoPaths,
	...EntidadesPaths,
	...FarmaciasPaths,
	...UsuariosPaths,
	...ImagensPaths,
};

export default paths;
