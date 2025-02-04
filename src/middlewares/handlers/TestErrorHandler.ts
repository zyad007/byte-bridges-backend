import { NextFunction, Request, Response } from "express"
import CustomError from "../../errors/CustomError"
import BadRequest from "../../errors/BadRequest"
import { DatabaseError } from "pg";
import NotAuthorized from "../../errors/NotAuthorized";
import { Result } from "../../dto/Result";

export const testErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {

    const handler = 'TEST_HANDLER';

    if (err instanceof BadRequest) {
        return res.status(400).send(new Result({
            status: false,
            message: err.message,
            handler: handler,
            validation: err.validation
        }))

    }

    if (err instanceof DatabaseError) {
        return res.status(500).send(new Result({
            status: false,
            message: err.message,
            handler: handler,
        }))
    }

    if (err instanceof NotAuthorized) {
        return res.status(401).send(new Result({
            status: false,
            message: err.message,
            handler: handler,
        }))
    }

    return res.status(500).send(new Result({
        status: false,
        message: err.message,
        handler: handler,
    }))

}