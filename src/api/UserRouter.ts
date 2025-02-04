import { Router } from "express";
import { createUserAPI, deleteUserAPI, loginAPI } from "../controllers/UserController";
import { CreateUserSchema } from "../schemas/CreateUser";
import { bodyValidation, paramValidation } from "../middlewares/Validation";
import { z } from "zod";
import { LoginSchema } from "../schemas/LoginSchema";

const UserRouter = Router()

UserRouter.post('/', bodyValidation(CreateUserSchema), createUserAPI)

UserRouter.delete('/:id', deleteUserAPI)

UserRouter.post('/login', bodyValidation(LoginSchema), loginAPI)

export default UserRouter