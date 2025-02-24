import { NextFunction, Request, Response } from "express";
import NotAuthorized from "../errors/NotAuthorized";
import { verify } from "jsonwebtoken";
import { Users } from "../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { Token } from "../types/Token";

export const auth = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return next(new NotAuthorized('Unauthorized'));
        }

        try {
            const decoded: Token = verify(token, process.env.SECRET as string, {
                ignoreExpiration: true
            }) as any;
            const user = await db.select().from(Users).where(eq(Users.id, decoded.id));
            if (!user) {
                return next(new NotAuthorized('Invalid token'));
            }
            req.body.user = user;
            req.body.token = decoded;
            return next();
        }
        catch (e) {
            return next(new NotAuthorized('Unauthorized'));
        }


    } catch (e) {
        return next(e);
    }

}