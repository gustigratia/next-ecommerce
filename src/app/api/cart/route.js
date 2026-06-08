import { NextResponse } from 'next/server';

import dbConnect from '@/backend/config/dbConnect';
<<<<<<< HEAD
import admin from "@/backend/config/firebaseAdmin";
=======
import { verifyIdToken } from '@/backend/config/firebaseAdmin';
>>>>>>> 09fecdc66ae8333a4f4abada9a6b38e0d886b9b1
import { Cart } from '@/backend/models/cart';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const getUserFromRequest = async (req) => {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const token = authHeader.split('Bearer ')[1];
<<<<<<< HEAD
  const decodedToken = await admin.auth().verifyIdToken(token);
=======
  const decodedToken = await verifyIdToken(token);
>>>>>>> 09fecdc66ae8333a4f4abada9a6b38e0d886b9b1

  return decodedToken;
};

export async function GET(req) {
  try {
    await dbConnect();

    const user = await getUserFromRequest(req);

    const cart = await Cart.findOne({ userId: user.uid });

    return NextResponse.json(
      {
        cart: {
          cartItems: cart?.items || [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const user = await getUserFromRequest(req);
    const item = await req.json();

    let cart = await Cart.findOne({ userId: user.uid });

    if (!cart) {
      cart = await Cart.create({
        userId: user.uid,
        items: [item],
      });

      return NextResponse.json(
        {
          cart: {
            cartItems: cart.items,
          },
        },
        { status: 201 }
      );
    }

    const itemIndex = cart.items.findIndex((cartItem) => cartItem.product === item.product);

    if (itemIndex > -1) {
      cart.items[itemIndex] = item;
    } else {
      cart.items.push(item);
    }

    await cart.save();

    return NextResponse.json(
      {
        cart: {
          cartItems: cart.items,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();

    const user = await getUserFromRequest(req);

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('product');

    const cart = await Cart.findOne({ userId: user.uid });

    if (!cart) {
      return NextResponse.json(
        {
          cart: {
            cartItems: [],
          },
        },
        { status: 200 }
      );
    }

    if (productId) {
      cart.items = cart.items.filter((item) => item.product !== productId);
    } else {
      cart.items = [];
    }

    await cart.save();

    return NextResponse.json(
      {
        cart: {
          cartItems: cart.items,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}