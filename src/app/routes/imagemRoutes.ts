import { Router } from "express";
import fileUpload from "express-fileupload";
import ImagensControllers from "../controllers/ImagensController";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";
import VerificarArquivosMiddleware from "../middlewares/files/VerificarArquivosMiddleware";
import VerificarTamanhoMiddleware from "../middlewares/files/VerificarTamanhoMiddleware";
import PermitirExtensoesMiddleware from "../middlewares/files/PermitirExtensoesMiddleware";

const imagemRouter = Router();

imagemRouter.post(
	"/imagem",
	AuthenticationMiddleware,
	fileUpload({ createParentPath: true }),
	VerificarArquivosMiddleware("imagem"),
	VerificarTamanhoMiddleware,
	PermitirExtensoesMiddleware([".jpg", ".png", ".jpeg"]),
	ImagensControllers.EnviarImagem
);

imagemRouter
	.route("/imagem/:id")
	.get(ImagensControllers.EncontrarImagemPorId)
	.delete(ImagensControllers.RemoverImagem);

export default imagemRouter;
