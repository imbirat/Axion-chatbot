import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Chat from '@/models/Chat';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { messageIndex, reaction } = await request.json();

    if (typeof messageIndex !== 'number') {
      return NextResponse.json({ error: 'messageIndex is required' }, { status: 400 });
    }

    await connectDB();

    const chat = await Chat.findOne({ _id: id, userId: session.user.email });
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    if (reaction === null) {
      await Chat.updateOne(
        { _id: id },
        { $pull: { reactions: { messageIndex } } }
      );
    } else if (reaction === 'up' || reaction === 'down') {
      await Chat.updateOne(
        { _id: id, 'reactions.messageIndex': messageIndex },
        { $set: { 'reactions.$.reaction': reaction, 'reactions.$.createdAt': new Date() } },
        { upsert: false }
      );

      const result = await Chat.updateOne(
        { _id: id, 'reactions.messageIndex': { $ne: messageIndex } },
        { $push: { reactions: { messageIndex, reaction, createdAt: new Date() } } }
      );

      if (result.modifiedCount === 0) {
        // Reaction already existed and was updated above
      }
    }

    return NextResponse.json({ success: true, messageIndex, reaction });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
