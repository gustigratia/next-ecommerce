import { NextResponse } from "next/server";

import dbConnect from "@/backend/config/dbConnect";
import Order from "@/backend/models/order";
import { verifyIdToken } from "@/backend/config/firebaseAdmin";

const getUserFromRequest = async (request) => {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];

  return await verifyIdToken(token);
};

export async function POST(request) {
  try {
    await dbConnect();

    const decodedToken = await getUserFromRequest(request);

    if (!decodedToken) {
      return NextResponse.json(
        { message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      shippingInfo,
      paymentInfo,
      orderItems,
      amountWithoutTax,
      taxAmount,
      totalAmount,
    } = body;

    if (!shippingInfo) {
      return NextResponse.json(
        { message: "Shipping information is required" },
        { status: 400 }
      );
    }

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json(
        { message: "Order items are required" },
        { status: 400 }
      );
    }

    if (!paymentInfo?.method) {
      return NextResponse.json(
        { message: "Payment method is required" },
        { status: 400 }
      );
    }

    const order = await Order.create({
      user: decodedToken.uid,
      userEmail: decodedToken.email || "",
      shippingInfo,
      paymentInfo,
      orderItems,
      amountWithoutTax,
      taxAmount,
      totalAmount,
      orderStatus: "Processing",
    });

    return NextResponse.json(
      {
        message: "Order created successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}
