import { NextResponse } from 'next/server';

import dbConnect from '../../../backend/config/dbConnect';
import User from '../../../backend/models/user';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found in db' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, firstName, lastName, phoneNumber } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required to update profile' }, { status: 400 });
    }

    // Find and update, or create if it doesn't exist
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { firstName, lastName, phoneNumber },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
