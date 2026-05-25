import OrderManagementDetails from "@/components/Admin/OrderManagementDetails";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { slug } = await params;

  return <OrderManagementDetails id={slug} />;
}