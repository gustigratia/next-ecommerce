import { NextResponse } from "next/server";

import dbConnect from "@/backend/config/dbConnect";
import Order from "@/backend/models/order";
<<<<<<< HEAD
import admin from "@/backend/config/firebaseAdmin";
=======
import { adminAuth } from "@/backend/config/firebaseAdmin";
>>>>>>> 09fecdc66ae8333a4f4abada9a6b38e0d886b9b1

const getUserFromRequest = async (request) => {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];

<<<<<<< HEAD
  return await admin.auth().verifyIdToken(token);
=======
  return await adminAuth.verifyIdToken(token);
>>>>>>> 09fecdc66ae8333a4f4abada9a6b38e0d886b9b1
};

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const decodedToken = await getUserFromRequest(request);

    if (!decodedToken) {
      return NextResponse.json(
        { message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const order = await Order.findOne({
      _id: id,
      user: decodedToken.uid,
    }).lean();

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Get order error:", error);

    return NextResponse.json(
      { message: "Failed to get order" },
      { status: 500 }
    );
  }
}