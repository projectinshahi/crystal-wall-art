import Container from "@/components/Container/Container";
import OrderDetails from "@/components/OrderDetails";
import React from "react";

const Page = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const {slug} = await params
  
  return (
    <Container>
      <div className="mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <OrderDetails id={slug} />
      </div>
    </Container>
  );
};

export default Page;