import OrderPage from "@/src/app/order/page";
type Params = Promise<{ id: string }>;
export default async function OrderPageWrapper({ params }: { params:  Params  }) {
  const {id} = await params
  return <OrderPage id={id} />;
}
