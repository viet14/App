import PromiseRouter from "express-promise-router";
import userController from "../Controllers/user.js";
import schemas from "../Validation/schema.js";
import validations from "../Validation/index.js";

const authenticationRouter = PromiseRouter()

authenticationRouter.route('/signIn')
    .post(validations.validateBody(schemas.signIn ),userController.signIn)

authenticationRouter.route('/signUp')
    .post(validations.validateBody(schemas.signUp),userController.signUp)

authenticationRouter.route('/refreshToken')
    .get(userController.refreshToken)

authenticationRouter.route('/verify')
    .post(validations.validateBody(schemas.verify) , userController.verifyEmail)
export default authenticationRouter