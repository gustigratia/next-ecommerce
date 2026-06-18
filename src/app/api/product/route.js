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

const FALLBACK_PRODUCTS = [
  {
    _id: 'prod_1',
    name: 'Samsung Smart TV 55 Inch',
    description: 'Large screen smart television for home entertainment.',
    price: 8500000,
    seller: 'Samsung Official',
    stock: 12,
    ratings: 4.5,
    category: 'Electronics',
    images: [
      {
        public_id: 'tv_1',
        url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6',
      },
    ],
    reviews: [],
  },
];

// Handler function for handling GET requests to fetch products with filters and pagination
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const resPerPage = 4;
  const currentPage = Number(searchParams.get('page')) || 1;

  const queryParams = {
    category: searchParams.get('category'),
    keyword: searchParams.get('keyword'),
    sort: searchParams.get('sort'),
    page: searchParams.get('page'),
    rating: searchParams.get('rating'),
  };

  try {
    await dbConnect();

    // Untuk menghitung jumlah product setelah search dan filter
    const filteredProducts = await new APIFilters(Product.find(), queryParams)
      .search()
      .filter()
      .execute();

    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / resPerPage);

    // Untuk mengambil product sesuai halaman sekarang
    const products = await new APIFilters(Product.find(), queryParams)
      .search()
      .filter()
      .pagination(resPerPage)
      .execute();

    return NextResponse.json(
      {
        message: 'Products',
        success: true,
        products,
        currentPage,
        totalProducts,
        totalPages,
        resPerPage,
      },
      { status: 200 }
    );
  } catch (error) {
    if (!process.env.DB_URI && process.env.NODE_ENV !== 'test') {
      return NextResponse.json(
        {
          message: 'Products',
          success: true,
          products: FALLBACK_PRODUCTS,
          currentPage: 1,
          totalProducts: FALLBACK_PRODUCTS.length,
          totalPages: 1,
          resPerPage,
        },
        { status: 200 }
      );
    }

    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
