import { Router } from "express";
import fileUpload from "express-fileupload";
import ImagensControllers from "../controllers/ImagensController";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";
import VerificarArquivosMiddleware from "../middlewares/files/VerificarArquivosMiddleware";

const imagemRouter = Router();

imagemRouter.post(
	"/imagem",
	AuthenticationMiddleware,
	VerificarArquivosMiddleware,
	fileUpload({ createParentPath: true }),
	ImagensControllers.EnviarImagem
);

imagemRouter
	.route("/imagem/:id")
	.get(ImagensControllers.EncontrarImagemPorId)
	.delete(ImagensControllers.RemoverImagem);

export default imagemRouter;
