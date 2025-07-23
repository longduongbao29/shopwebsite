import OrderPageClient from "@/components/order-page-client";

type Params = Promise<{ id: string }>;

export default async function OrderPageWrapper({ params }: { params: Params }) {
  const { id } = await params;

  // Pass the order ID to the client component
  return <OrderPageClient orderId={id} />;
}
