"use client"

import Container from '@/components/Container/Container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Typography } from '@/components/ui/Typography'
import { OrderResult } from '@/types/order.type'
import { CheckCircle, Clock, Package, RotateCcw, Search, Truck, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const statusSteps = [
    { key: "pending", label: "Order Placed", icon: Clock },
    { key: "processing", label: "Processing", icon: Package },
    { key: "shipping", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const getStepIndex = (status: string) => statusSteps.findIndex(s => s.key === status);

const statusColor = (status: string) => {
    switch (status) {
        case "pending": return "bg-warning/10 text-warning border-warning/30";
        case "processing": return "bg-primary/10 text-primary border-primary/30";
        case "shipping": return "bg-accent text-accent-foreground";
        case "delivered": return "bg-success/10 text-success border-success/30";
        case "cancelled": return "bg-destructive/10 text-destructive border-destructive/30";
        default: return "bg-muted text-muted-foreground";
    }
};

const page = () => {

    const router = useRouter();

    const [orderNumber, setOrderNumber] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [order, setOrder] = useState<OrderResult | null>(null);
    const [searched, setSearched] = useState(false);

    const trackOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber.trim()) { toast.error("Please enter an order number"); return; }
        setLoading(true);
        setSearched(true);
        try {

            const orderRes = await fetch(`/api/track-orders?orderNumber=${orderNumber}`)

            const data = await orderRes.json();

            if (!data.success) return setOrder(null);;

            setOrder(data.data || [])
        } catch (err) {
            console.error("Failed to track order:", err);
            toast.error("Failed to track order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className='mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='text-center mb-8'>
                <Typography variant='h3' className='font-bold'>Track Your <span className='text-primary'>Order</span></Typography>
                <Typography variant='body-sm' className='text-muted-foreground'>Enter your order number to check the status</Typography>
            </div>

            {/* Order Tracking field */}
            <form className="flex gap-2 mb-8" onSubmit={trackOrder}>
                <Input
                    placeholder="Enter order number (e.g., ORD-...)"
                    value={orderNumber}
                    onChange={e => setOrderNumber(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" className='text-white' disabled={loading}><Search className="h-4 w-4 mr-1" />{loading ? "Searching..." : "Track"}</Button>
            </form>

            {searched && !order && !loading && (
                <div className="text-center py-12 border rounded-2xl bg-card">
                    <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-semibold mb-1">Order not found</h3>
                    <p className="text-sm text-muted-foreground">Please check your order number and try again.</p>
                </div>
            )}

            {order && (
                <div className="space-y-6 animate-fade-in">
                    <div className="p-4 sm:p-6 rounded-2xl border bg-card">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                            <div>
                                <Typography variant='body-lg' className='font-bold'>{order.order_number}</Typography>
                                <Typography variant='body-sm' className='text-muted-foreground'>{order.customer_name} · {new Date(order.created_at).toLocaleDateString()}</Typography>
                            </div>
                            <div className="flex gap-2">
                                <Badge className={statusColor(order.status)} variant="outline">{order.status}</Badge>
                                <Badge variant="outline">{order.payment_status}</Badge>
                            </div>
                        </div>

                        {!["cancelled", "returned"].includes(order.status) && (
                            <div className="flex items-center justify-between mt-6">
                                {statusSteps.map((step, i) => {
                                    const currentIdx = getStepIndex(order.status);
                                    const isComplete = i <= currentIdx;
                                    const isCurrent = i === currentIdx;
                                    return (
                                        <div key={step.key} className="flex-1 flex flex-col items-center relative">
                                            {i > 0 && <div className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 ${i <= currentIdx ? "bg-primary" : "bg-border"}`} />}
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isComplete ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} ${isCurrent ? "ring-2 ring-primary/30" : ""}`}>
                                                <step.icon className="h-4 w-4" />
                                            </div>
                                            <span className={`text-[10px] sm:text-xs mt-1.5 text-center ${isComplete ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {order.status === "cancelled" && (
                            <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-destructive/5 text-destructive text-sm">
                                <XCircle className="h-4 w-4" /> This order has been cancelled.
                            </div>
                        )}
                        {order.status === "returned" && (
                            <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-muted text-muted-foreground text-sm">
                                <RotateCcw className="h-4 w-4" /> This order has been returned.
                            </div>
                        )}
                    </div>

                    <div className="p-4 sm:p-6 rounded-2xl border bg-card">
                        <h3 className="font-display font-semibold mb-3">Order Items</h3>
                        <div className="space-y-3">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                                    <div><p className="text-sm font-medium">{item.product_title}</p><p className="text-xs text-muted-foreground">Qty: {item.quantity}</p></div>
                                    <p className="text-sm font-semibold">₹{(item.unit_price * item.quantity).toLocaleString("en-IN")}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 pt-3 border-t">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold text-lg">₹{Number(order.total).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="mt-4">
                            <Button className="w-full" onClick={() => router.push(`/order/${order.id}`)}>
                                View Full Details, Cancel or Return
                            </Button>
                        </div>
                    </div>
                </div>

            )}

        </Container>
    )
}

export default page