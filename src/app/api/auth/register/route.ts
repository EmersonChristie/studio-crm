import { AuthService } from '@/lib/services/auth.service';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = registerSchema.parse(json);

    const existingUser = await AuthService.getUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const user = await AuthService.createUser(body);
    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
