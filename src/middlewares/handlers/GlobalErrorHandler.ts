import { NextFunction, Request, Response } from "express";
import BadRequest from "../../errors/BadRequest";
import { Result } from "../../dto/Result";
import NotFound from "../../errors/NotFound";

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof BadRequest) {

        return res.status(400).send(new Result(
            {
                status: false,
                message: err.message,
                handler: 'GLOBAL_ERROR_HANDLER',
                validation: err.validation.length > 0 ? err.validation : undefined
            }
        ))
    }

    if (err instanceof NotFound) {
        return res.status(404).send(new Result(
            {
                status: false,
                message: err.message,
                handler: 'GLOBAL_ERROR_HANDLER'
            }
        ))
    }

    console.log(err.stack);
    res.status(500).send(new Result({
        status: false,
        message: err.message,
        handler: 'GLOBAL_ERROR_HANDLER'
    }
    ))
}