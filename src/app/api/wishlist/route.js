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

    console.log('📊 Wishlist ditemukan di DB:', JSON.stringify(wishlist?.items || [], null, 2));

    return NextResponse.json(
      {
        wishlist: {
          wishlistItems: wishlist?.items || [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error di GET wishlist:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const user = await getUserFromRequest(req);
    const item = await req.json();

    console.log('📨 API menerima item:', JSON.stringify(item, null, 2));

    let wishlist = await Wishlist.findOne({ userId: user.uid });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: user.uid,
        items: [item],
      });

      console.log('✅ Wishlist baru dibuat, items:', JSON.stringify(wishlist.items, null, 2));

      return NextResponse.json(
        {
          wishlist: {
            wishlistItems: wishlist.items,
          },
        },
        { status: 201 }
      );
    }

    const itemIndex = wishlist.items.findIndex(
      (wishlistItem) => wishlistItem.product === item.product
    );

    if (itemIndex > -1) {
      console.log('ℹ️ Item sudah ada di wishlist');
      return NextResponse.json(
        {
          wishlist: {
            wishlistItems: wishlist.items,
          },
        },
        { status: 200 }
      );
    }

    // Explicitly set all fields
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

    console.log('✅ Item ditambahkan, sekarang items memiliki:', JSON.stringify(wishlist.items[wishlist.items.length - 1], null, 2));

    return NextResponse.json(
      {
        wishlist: {
          wishlistItems: wishlist.items,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error di wishlist API POST:', error.message, error.stack);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
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
      wishlist.items = wishlist.items.filter((item) => item.product !== productId);
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
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
