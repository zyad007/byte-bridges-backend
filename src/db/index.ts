import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { usersTable } from "./schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
    const user: typeof usersTable.$inferInsert = {
        name: 'Zyad',
        age: 12,
        email: 'zyad@mail.com'
    }

    await db.insert(usersTable).values(user);
    
}

main()