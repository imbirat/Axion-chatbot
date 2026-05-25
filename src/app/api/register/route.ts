import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: { id: 'demo-' + Date.now(), email, name },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
