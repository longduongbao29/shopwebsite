import OrderPage from "@/src/app/order/page";

export default async function OrderPageWrapper({ params }: { params: { id: string } }) {
  const {id} = await params
  return <OrderPage id={id} />;
}
