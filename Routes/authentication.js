import PromiseRouter from "express-promise-router";
import userController from "../Controllers/user.js";
import schemas from "../Validation/schema.js";
import validations from "../Validation/index.js";

const userRouter = PromiseRouter()

userRouter.route('/signIn')
    .post(userController.signIn)

userRouter.route('/signUp')
    .post(validations.validateBody(schemas.signUp),userController.signUp)

export default userRouter