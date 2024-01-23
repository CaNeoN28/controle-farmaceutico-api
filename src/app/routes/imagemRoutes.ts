import { Router } from "express";
import fileUpload from "express-fileupload";
import ImagensControllers from "../controllers/ImagensController";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";

const imagemRouter = Router();

imagemRouter.post(
	"/imagem",
	AuthenticationMiddleware,
	fileUpload({ createParentPath: true }),
	ImagensControllers.EnviarImagem
);

imagemRouter
	.route("/imagem/:id")
	.get(ImagensControllers.EncontrarImagemPorId)
	.delete(ImagensControllers.RemoverImagem);

export default imagemRouter;
