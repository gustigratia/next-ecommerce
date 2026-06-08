// Import required modules for handling requests and database connection
import { NextResponse } from 'next/server';

import dbConnect from '@/backend/config/dbConnect';
import { Product } from '@/backend/models/product';

// Handler function for handling GET requests to fetch a single product
export async function GET(request, { params }) {
  try {
    const { singleProductId } = params;

    await dbConnect();

    const singleProductDetail = await Product.findById(singleProductId);

    if (!singleProductDetail) {
      return NextResponse.json(
        {
          message: 'Product not found',
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Single product fetched successfully',
        success: true,
        singleProductDetail,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}

// Handler function for adding review to a product
export async function POST(request, { params }) {
  try {
    const { singleProductId } = params;
    const { name, rating, comment } = await request.json();

    await dbConnect();

    const product = await Product.findById(singleProductId);

    if (!product) {
      return NextResponse.json(
        {
          message: 'Product not found',
          success: false,
        },
        { status: 404 }
      );
    }

    const numericRating = Number(rating);

    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        {
          message: 'Rating must be between 1 and 5',
          success: false,
        },
        { status: 400 }
      );
    }

    if (!comment || comment.trim() === '') {
      return NextResponse.json(
        {
          message: 'Comment is required',
          success: false,
        },
        { status: 400 }
      );
    }

    const reviewName = name && name.trim() !== '' ? name.trim() : 'Anonymous';

    const newReview = {
      name: reviewName,
      rating: numericRating,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    product.reviews.push(newReview);

    const totalRating = product.reviews.reduce((total, review) => {
      return total + Number(review.rating || 0);
    }, 0);

    product.ratings = Number((totalRating / product.reviews.length).toFixed(1));

    await product.save();

    const updatedProduct = await Product.findById(singleProductId);

    return NextResponse.json(
      {
        message: 'Review added successfully',
        success: true,
        singleProductDetail: updatedProduct,
        reviews: updatedProduct.reviews || [],
        ratings: updatedProduct.ratings || 0,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
