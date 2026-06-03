// Import required modules for handling requests and database connection
import { NextRequest, NextResponse } from 'next/server';

import { URL } from 'url';

import dbConnect from '@/backend/config/dbConnect';
import { Product } from '@/backend/models/product';
import APIFilters from '@/backend/utils/APIFilters';

// Handler function for handling POST requests to create a new product
export async function POST(request) {
  try {
    // Connect to the database
    dbConnect();
    // Destructure product details from the request body
    const {
      name,
      description,
      price,
      seller,
      stock,
      ratings,
      reviews,
      category,
      images,
      createdAt,
    } = await request.json();
    // Create a new product instance with the provided details
    const newProduct = new Product({
      name,
      description,
      price,
      seller,
      stock,
      ratings,
      reviews,
      category,
      images,
      createdAt,
    });
    // Save the new product to the database
    const savedProduct = await newProduct.save();
    // Return a JSON response indicating successful creation
    return NextResponse.json(
      {
        message: 'Product created successfully',
        success: true,
        savedProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    // Return a JSON response with an error message and a 500 status code if an error occurs
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// export async function GET(req, res) {
//     const { searchParams } = new URL(req.url);
//     const resPerPage = 4;
//     const category = searchParams.get('category');
//     try {
//         dbConnect();
//         let products = await Product.find();
//         return NextResponse.json({
//             message: "Products",
//             success: true,
//             products
//         }, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

// Handler function for handling GET requests to fetch products with filters and pagination
export async function GET(req, res) {
  // Extract search parameters from the request URL
  const { searchParams } = new URL(req.url);
  // Set the number of products to be displayed per page
  const resPerPage = 4;

  try {
    // Connect to the database
    dbConnect();
    // Create an instance of APIFilters with provided search parameters
    const filters = new APIFilters(Product.find(), {
      category: searchParams.get('category'),
      keyword: searchParams.get('keyword'),
      sort: searchParams.get('sort'),
      page: searchParams.get('page'),
      rating: searchParams.get('rating'),
    });
    // Execute the filtering, searching, and pagination operations
    const products = await filters.search().filter().pagination(resPerPage).execute();
    // Return a JSON response with the filtered products and a success message
    return NextResponse.json(
      {
        message: 'Products',
        success: true,
        products,
      },
      { status: 200 }
    );
    // Log and return a JSON response with an error message and a 500 status code if an error occurs
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
