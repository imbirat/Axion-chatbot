import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ customInstructions: '', customInstructionsEnabled: true });
    }

    return NextResponse.json({
      customInstructions: user.customInstructions || '',
      customInstructionsEnabled: user.customInstructionsEnabled !== false,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { customInstructions, customInstructionsEnabled } = await request.json();

    if (typeof customInstructions === 'string' && customInstructions.length > 1500) {
      return NextResponse.json({ error: 'Instructions must be 1500 characters or less' }, { status: 400 });
    }

    await connectDB();

    const update: any = {};
    if (typeof customInstructions === 'string') {
      update.customInstructions = customInstructions;
    }
    if (typeof customInstructionsEnabled === 'boolean') {
      update.customInstructionsEnabled = customInstructionsEnabled;
    }

    await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: update },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, ...update });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
