import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export class AuthService {
  static async createUser(data: {
    email: string;
    password: string;
    name?: string;
  }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const [user] = await db
      .insert(users)
      .values({
        email: data.email,
        password: hashedPassword,
        name: data.name
      })
      .returning();

    return user;
  }

  static async verifyCredentials(email: string, password: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user?.password) return null;

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return null;

    return user;
  }

  static async getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    return user;
  }
}
