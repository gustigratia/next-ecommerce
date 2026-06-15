import dbConnect from '@/backend/config/dbConnect';
import { verifyIdToken } from '@/backend/config/firebaseAdmin';
import { Cart } from '@/backend/models/cart';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const jsonResponse = (body, status = 200) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getUserFromRequest = async (req) => {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await verifyIdToken(token);

  return decodedToken;
};

export async function GET(req) {
  try {
    await dbConnect();

    const user = await getUserFromRequest(req);
    const cart = await Cart.findOne({ userId: user.uid });

    return jsonResponse(
      {
        cart: {
          cartItems: cart?.items || [],
        },
      },
      200
    );
  } catch (error) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
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

      return jsonResponse(
        {
          cart: {
            cartItems: cart.items,
          },
        },
        201
      );
    }

    const itemIndex = cart.items.findIndex((cartItem) => cartItem.product === item.product);

    if (itemIndex > -1) {
      cart.items[itemIndex] = item;
    } else {
      cart.items.push(item);
    }

    await cart.save();

    return jsonResponse(
      {
        cart: {
          cartItems: cart.items,
        },
      },
      200
    );
  } catch (error) {
    return jsonResponse({ error: error.message || 'Internal Server Error' }, 500);
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
      return jsonResponse(
        {
          cart: {
            cartItems: [],
          },
        },
        200
      );
    }

    if (productId) {
      cart.items = cart.items.filter((item) => item.product !== productId);
    } else {
      cart.items = [];
    }

    await cart.save();

    return jsonResponse(
      {
        cart: {
          cartItems: cart.items,
        },
      },
      200
    );
  } catch (error) {
    return jsonResponse({ error: error.message || 'Internal Server Error' }, 500);
  }
}
