import { eq } from "drizzle-orm";
import { db } from "../db";
import { Users } from "../db/schema";
import BadRequest from "../errors/BadRequest";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function createUser(user: {
    name: string,
    email: string,
    phoneNumber: string,
    telegramId: string,
    password: string
}) {

    const result = await db.select({
        email: Users.email
    }).from(Users)

    if (result.length > 0) {
        throw new BadRequest("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10)


    const newUser = await db.insert(Users).values({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        telegramId: user.telegramId,
        passwordHash: hashedPassword,
    }).returning()

    return {
        id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email,
        phoneNumber: newUser[0].phoneNumber,
        telegramId: newUser[0].telegramId,
    }
}

export async function deleteUser(id: number) {


    const user = await db.select().from(Users).where(eq(Users.id, id))

    if (user.length === 0) {
        throw new BadRequest("User not found");
    }

    const result = await db.delete(Users).where(eq(Users.id, id))

    console.log(result);

    if (result.rowCount === 0) {
        throw new BadRequest("User not found");
    }

    return
}

export async function login(email: string, password: string) {

    const result = await db.select().from(Users).where(eq(Users.email, email))


    if (result.length === 0) {
        throw new BadRequest("User not found");
    }

    const user = result[0]

    const comparePassword = await bcrypt.compare(password, user.passwordHash)

    if (!comparePassword) {
        throw new BadRequest("Invalid password");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET as string)

    return {
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        telegramId: user.telegramId,
    }

}

