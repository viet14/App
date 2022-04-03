import PromiseRouter from "express-promise-router";
import userController from "../Controllers/User.js";
import middleware from "../middleware/index.js";

const userRouter = PromiseRouter()

userRouter.route('/avatar')
    .patch(middleware.checkUser,userController.changeAvatar)
    .get(middleware.checkUser,userController.getAvatar)
    .delete(middleware.checkUser,userController.deleteAvatar)
userRouter.route('/upload')
    .post(middleware.checkUser,userController.upload)
userRouter.route('/getUsersByName')
    .get(middleware.checkUser,userController.getListUserByName)
userRouter.route('/getUser')
    .get(middleware.checkUser,userController.getUser)
userRouter.route('/addFriend')
    .post(middleware.checkUser,userController.addFriend)
export default userRouter