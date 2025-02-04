import { RequestHandler } from "express";
import { CreateUserType } from "../schemas/CreateUser";
import { createUser, deleteUser, login } from "../services/UserServices";
import BadRequest from "../errors/BadRequest";
import { LoginType } from "../schemas/LoginSchema";
import { Result } from "../dto/Result";


export const createUserAPI: RequestHandler = async (req, res, next) => {
    try {
        const { name, email, phoneNumber, password } = req.body as CreateUserType;

        const user = await createUser({
            name,
            email,
            phoneNumber: phoneNumber || '',
            telegramId: '',
            password
        })

        res.status(201).json(new Result({
            status: true,
            message: 'User created successfully',
            data: user
        }))
    }
    catch (e) {
        next(e)
    }
}

export const deleteUserAPI: RequestHandler<{ id: number }> = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isNaN(id)) {
            throw new BadRequest("Invalid user id")
        }

        await deleteUser(id)

        res.status(204).send()
    }
    catch (e) {
        next(e)
    }
}

export const loginAPI: RequestHandler = async (req, res, next) => {
    try {
        const { email, password } = req.body as LoginType

        const result = await login(email, password)


        res.status(200).json(new Result({
            status: true,
            message: 'Login successful',
            data: result
        }))
    }

    catch (e) {
        next(e)
    }
}


