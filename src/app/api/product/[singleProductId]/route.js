// Import required modules for handling requests and database connection
import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/backend/config/dbConnect';
import { Product } from '@/backend/models/product';

// Handler function for handling GET requests to fetch a single product
export async function GET(request, { params }) {
  try {
    // Destructure the product ID from the URL parameters
    const { singleProductId } = params;
    // Establish a connection to the database
    dbConnect();
    // Fetch the details of the single product using its ID
    const singleProductDetail = await Product.findById(singleProductId);
    // Return a JSON response with the success message and product details
    return NextResponse.json(
      {
        message: 'single todo fetch successfully',
        success: true,
        singleProductDetail,
      },
      { status: 200 }
    );
  } catch (error) {
    // Return a JSON response with an error message and a 502 status code if an error occurs
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
