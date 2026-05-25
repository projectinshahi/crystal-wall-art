"use client";

import React, { useEffect, useState } from "react";
import Spinner from "../Admin/Loader/Spinner";
import { UserOrders } from "@/types/order.type";
import { CheckCircle, Clock, Package, RotateCcw, Truck, XCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Typography } from "../ui/Typography";
import { Separator } from "../ui/separator";

interface OrderItem {
  id: string;
  product_title: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface TimelineEntry {
  id: string;
  status: string;
  note: string | null;
  created_at: string;
}

interface Props {
  id: string;
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipping", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const OrderDetails = ({ id }: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<UserOrders | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/orders/${id}`);

        if (!res.ok) {
          setOrder(null);
          return;
        }

        const orderDetails = await res.json();

        setOrder(orderDetails.data);

        const [itemsRes, timelineRes] = await Promise.all([
          fetch(`/api/orders/${id}/itemsData`),
          fetch(`/api/orders/${id}/timelineData`)
        ]);

        const [itemsData, timelineData] = await Promise.all([
          itemsRes.json(),
          timelineRes.json()
        ]);
        console.log("itemsData", itemsData);
        console.log("timelineData", timelineData);

        setItems((itemsData.data as OrderItem[]) || []);
        setTimeline((timelineData.data as TimelineEntry[]) || []);

      } catch (error) {
        console.error(error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const statusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning/10 bg-warning border-warning/30"
      case "processing": return "bg-primary/10 bg-primary border-primary/30"
      case "shipping": return "bg-accent text-accent-foreground"
      case "delivered": return "bg-green-100 bg-green-700 border-green-30"
      case "cancelled": return "bg-destructive/10 bg-destructive border-destructive/30"
      case "returned": return "bg-mouted text-muted-foreground"
      default: return "bg-mouted text-muted-foreground"
    }
  }

  const getStepIndex = (status: string) => statusSteps.findIndex(s => s.key === status);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : !order ? (
        <div className="text-center py-16">
          <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />

          <h2 className="font-semibold text-lg">
            Order not found
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            This order doesn't exist or you don't have access.
          </p>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <Typography variant="h4">{order.order_number}</Typography>
              <Typography variant="caption">
                Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </Typography>
            </div>
            <div className="flex gap-2">
              <Badge className={statusColor(order.status)} variant={"outline"}>{order.status}</Badge>
              <Badge variant={"outline"}>{order.payment_status}</Badge>
            </div>
          </div>

          {/* Progress tracker */}
          {!["cancelled", "returned"].includes(order.status) && (
            <div className="p-4 sm:p-6 rounded-xl border bg-card">
              <h3 className="font-display font-semibold mb-4">Order Progress</h3>
              <div className="flex items-center justify-between">
                {statusSteps.map((step, i) => {
                  const currentIdx = getStepIndex(order.status);
                  const isComplete = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={step.key} className="flex-1 flex flex-col items-center relative">
                      {i > 0 && (
                        <div className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 ${i <= currentIdx ? "bg-primary" : "bg-border"}`} />
                      )}
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${isComplete ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} ${isCurrent ? "ring-2 ring-primary/30 scale-110" : ""}`}>
                        <step.icon className="h-4 w-4" />
                      </div>
                      <span className={`text-[10px] sm:text-xs mt-2 text-center ${isComplete ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {order.status === "cancelled" && (
            <div className="flex items-center gap-2 p-4 rounded-xl border bg-destructive/5 text-destructive">
              <XCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium text-sm">Order Cancelled</p>
                <p className="text-xs opacity-80">This order has been cancelled and will not be processed.</p>
              </div>
            </div>
          )}
          {order.status === "returned" && (
            <div className="flex items-center gap-2 p-4 rounded-xl border bg-muted">
              <RotateCcw className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Return Initiated</p>
                <p className="text-xs text-muted-foreground">Your return request is being processed. Refund will be initiated once the item is received.</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="p-4 sm:p-6">
              <h3 className="font-display font-semibold mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    {item.product_image ? (
                      <img src={item.product_image} alt={item.product_title} className="h-16 w-16 rounded-lg object-cover border" />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product_title}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{Number(item.unit_price).toLocaleString("en-IN")}</p>
                    </div>
                    <p className="text-sm font-semibold">₹{Number(item.total_price).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div className="p-4 sm:p-6 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{Number(order.total).toLocaleString("en-IN")}</span></div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="rounded-xl border bg-card p-4 sm:p-6">
            <h3 className="font-display font-semibold mb-3">Payment Details</h3>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex justify-between sm:block">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className={`sm:mt-1 ${order.payment_status === "paid" ? "border-green-500 text-green-700 bg-green-50" : "border-warning text-warning"}`}>
                  {order.payment_status}
                </Badge>
              </div>
              <div className="flex justify-between sm:block">
                <span className="text-muted-foreground">Method</span>
                <span className="sm:block sm:mt-1 font-medium capitalize">
                  {order.payment_method
                    ? order.payment_method.replace("razorpay:", "Razorpay · ").replace("razorpay", "Razorpay (Magic Checkout)")
                    : order.notes?.toLowerCase().includes("cod") ? "Cash on Delivery" : "—"}
                </span>
              </div>
              {order.razorpay_payment_id && (
                <div className="flex justify-between sm:block sm:col-span-2">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="sm:block sm:mt-1 font-mono text-xs break-all">{order.razorpay_payment_id}</span>
                </div>
              )}
              {order.razorpay_order_id && (
                <div className="flex justify-between sm:block sm:col-span-2">
                  <span className="text-muted-foreground">Razorpay Order ID</span>
                  <span className="sm:block sm:mt-1 font-mono text-xs break-all">{order.razorpay_order_id}</span>
                </div>
              )}
            </div>
          </div>

          {order.shipping_address && (
            <div className="rounded-xl border bg-card p-4 sm:p-6">
              <h3 className="font-display font-semibold mb-3">
                Shipping Address
              </h3>

              <div className="text-sm text-muted-foreground space-y-0.5">
                <p className="font-medium text-foreground">
                  {order.customer_name}
                </p>

                {order.shipping_address.address && (
                  <p>{order.shipping_address.address}</p>
                )}

                {order.shipping_address.city && (
                  <p>
                    {order.shipping_address.city},
                    {" "}
                    {order.shipping_address.state}
                    {" "}
                    {order.shipping_address.pincode}
                  </p>
                )}

                {order.customer_phone && (
                  <p>Phone: {order.customer_phone}</p>
                )}

                {order.customer_email && (
                  <p>Email: {order.customer_email}</p>
                )}
              </div>
            </div>
          )}

          {/* Order Timeline */}
          {timeline.length > 0 && (
            <div className="rounded-xl border bg-card p-4 sm:p-6">
              <h3 className="font-display font-semibold mb-4">Order Timeline</h3>
              <div className="space-y-4 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
                {timeline.map((entry, i) => (
                  <div key={entry.id} className="flex gap-3 relative">
                    <div className={`h-4 w-4 rounded-full mt-0.5 shrink-0 z-10 ${i === timeline.length - 1 ? "bg-primary" : "bg-muted-foreground/40"}`} />
                    <div>
                      <p className="text-sm font-medium capitalize">{entry.status}</p>
                      {entry.note && <p className="text-xs text-muted-foreground">{entry.note}</p>}
                      <p className="text-xs text-muted-foreground/70">{new Date(entry.created_at).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
};

export default OrderDetails;