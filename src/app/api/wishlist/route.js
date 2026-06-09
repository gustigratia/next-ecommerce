import { NextResponse } from 'next/server';

import dbConnect from '@/backend/config/dbConnect';
import { verifyIdToken } from '@/backend/config/firebaseAdmin';
import { Wishlist } from '@/backend/models/wishlist';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

    const wishlist = await Wishlist.findOne({ userId: user.uid });

    return NextResponse.json(
      {
        wishlist: {
          wishlistItems: wishlist?.items || [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to retrieve wishlist:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to retrieve wishlist' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const user = await getUserFromRequest(req);
    const item = await req.json();

    if (!item?.product) {
      return NextResponse.json({ error: 'Product information is required' }, { status: 400 });
    }

    let wishlist = await Wishlist.findOne({ userId: user.uid });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: user.uid,
        items: [
          {
            product: item.product,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl || '',
            ratings: item.ratings || 0,
            seller: item.seller,
            stock: item.stock,
          },
        ],
      });

      return NextResponse.json(
        {
          wishlist: {
            wishlistItems: wishlist.items,
          },
        },
        { status: 201 }
      );
    }

    const itemExists = wishlist.items.some(
      (wishlistItem) => String(wishlistItem.product) === String(item.product)
    );

    if (itemExists) {
      return NextResponse.json(
        {
          wishlist: {
            wishlistItems: wishlist.items,
          },
        },
        { status: 200 }
      );
    }

    wishlist.items.push({
      product: item.product,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl || '',
      ratings: item.ratings || 0,
      seller: item.seller,
      stock: item.stock,
    });

    await wishlist.save();

    return NextResponse.json(
      {
        wishlist: {
          wishlistItems: wishlist.items,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to update wishlist:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to update wishlist' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();

    const user = await getUserFromRequest(req);

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('product');

    const wishlist = await Wishlist.findOne({ userId: user.uid });

    if (!wishlist) {
      return NextResponse.json(
        {
          wishlist: {
            wishlistItems: [],
          },
        },
        { status: 200 }
      );
    }

    if (productId) {
      wishlist.items = wishlist.items.filter((item) => String(item.product) !== String(productId));
    } else {
      wishlist.items = [];
    }

    await wishlist.save();

    return NextResponse.json(
      {
        wishlist: {
          wishlistItems: wishlist.items,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to remove wishlist item:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to remove wishlist item' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}
