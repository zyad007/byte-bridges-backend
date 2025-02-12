interface IResult {
    data?: any,
    message?: string,
    status: boolean,
    responseDate: Date,
    handler?: string,
    validation?: string[]
}

export class Result implements IResult {

    data?: any;
    message?: string;
    status: boolean;
    responseDate: Date;
    handler?: string;
    validation?: string[];


    constructor({
        status, message, data, handler, validation
    }: {
        status: boolean,
        data?: any,
        message?: string,
        handler?: string,
        validation?: string[]

    }) {
        this.data = data;
        this.message = message;
        this.status = status;
        this.handler = handler;
        this.responseDate = new Date(new Date().getTime());
        this.validation = validation;
    }

}