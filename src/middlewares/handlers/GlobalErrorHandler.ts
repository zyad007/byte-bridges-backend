import { NextFunction, Request, Response } from "express";
import BadRequest from "../../errors/BadRequest";
import { Result } from "../../dto/Result";

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

    console.log(err.stack);
    res.status(500).send(new Result({
        status: false,
        message: err.message,
        handler: 'GLOBAL_ERROR_HANDLER'
    }
    ))
}