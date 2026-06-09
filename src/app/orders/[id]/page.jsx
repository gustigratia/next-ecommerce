import OrderDetails from "./OrderDetails";

const OrderDetailsPage = async ({ params }) => {
  const { id } = await params;

  return <OrderDetails orderId={id} />;
};

export default OrderDetailsPage;
