import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Typography } from '@/components/ui/Typography';
import { OrderedItemsTypes, OrderedShipmentItemsTypes, OrderedShipmentsTypes } from '@/types/Admin/orders.types';
import { Loader2, Package, Plus, Printer, Trash2, Truck } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import { LabelData, LabelItem, printLabels } from '../../ShippingLabel';
import { UserOrders } from '@/types/order.type';
import { toast } from 'sonner';
import AppDialog from '../../Common/AppDialog';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogClose } from '@/components/ui/dialog';
import orders from 'razorpay/dist/types/orders';

function variantOf(item: OrderedItemsTypes): string {
    return [item.size, item.thickness, item.orientation, item.mounting_method].filter(Boolean).join(" / ");
}

function formatAddress(addr: any): string {
    if (!addr) return "N/A";
    if (typeof addr === "string") return addr;
    const parts = [
        addr.name,
        addr.address,
        addr.line1,
        addr.line2,
        [addr.city, addr.state, addr.pincode || addr.zip].filter(Boolean).join(", "),
        addr.country,
    ].filter(Boolean);
    return parts.join("\n");
}

const shipmentStatusColors: Record<string, string> = {
    pending: "bg-warning/10 text-white border-warning/30",
    packed: "bg-primary/10 text-primary border-primary/30",
    shipped: "bg-accent text-accent-foreground",
    out_for_delivery: "bg-accent text-accent-foreground",
    delivered: "bg-success/10 text-success border-success/30",
    cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

const Shipments = ({
    items,
    shipments,
    shipmentItems,
    orderData,
    reftech
}: {
    items: OrderedItemsTypes[];
    shipments: OrderedShipmentsTypes[];
    shipmentItems: OrderedShipmentItemsTypes[];
    orderData: UserOrders;
    reftech: ()=> void;
}) => {

    const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
    const [courier, setCourier] = useState("");
    const [trackingId, setTrackingId] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);

    const shippedQtyMap = useMemo(() => {
        const m: Record<string, number> = {};
        // @ts-ignore
        shipmentItems.forEach(si => { m[si.order_item_id] = (m[si.order_item_id] || 0) + si.quantity; });
        return m;
    }, [shipmentItems]);

    const remainingQty = (item: OrderedItemsTypes) => Math.max(0, Number(item.quantity) - (shippedQtyMap[item.id] || 0));

    const allShipped = items.length > 0 && items.every(it => remainingQty(it) === 0);

    const itemsByShipment = useMemo(() => {
        const m: Record<string, OrderedShipmentItemsTypes[]> = {};
        shipmentItems.forEach(si => { (m[si.shipment_id] ||= []).push(si); });
        return m;
    }, [shipmentItems]);

    const buildLabel = (
        shipment: OrderedShipmentsTypes
    ): LabelData => {
        const sItems: LabelItem[] = (
            itemsByShipment[shipment.id] || []
        ).map((si) => {
            const it = items.find(
                (x) => x.id === si.order_item_id
            );

            return {
                title: it?.product_title || "Item",
                quantity: Number(si.quantity),

                size: it?.size || "",
                thickness: it?.thickness || "",
                orientation: it?.orientation || "",
                mounting_method:
                    it?.mounting_method || "",
            };
        });

        return {
            orderNumber: orderData!.order_number,
            shipmentNumber: shipment.shipment_number,
            // @ts-ignore
            customerName: orderData!.customer_name,
            phone: orderData!.customer_phone,
            address: formatAddress(
                orderData!.shipping_address
            ),

            trackingId: shipment.tracking_id,
            courier: shipment.courier,

            items: sItems,
        };
    };

    const printOne = (s: OrderedShipmentsTypes, size: "A4" | "A6") => printLabels([buildLabel(s)], size);

    const openCreate = () => {
        const initial: Record<string, number> = {};
        items.forEach(it => { const r = remainingQty(it); if (r > 0) initial[it.id] = 0; });
        setSelectedItems(initial);
        setCourier(""); setTrackingId("");
        setCreateOpen(true);
    }
    const deleteShipment = async (id: string) => {

        try {

            const deleteRes = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/orders/${orderData.id}/shipments?shipment_id=${id}`, {
                method: "DELETE"
            })

            const result = await deleteRes.json();

            if (!result.success) {
                throw new Error(result.message || "Failed to delete shipment");
            }
            reftech()
            toast.success(`Shipment deleted successfully`);
        } catch (err: any) {
            toast.error(err.message || "Failed to delete shipment");
        }
    }
    const updateShipment = async (id: string, patch: Partial<OrderedShipmentsTypes>) => {
        try {
            const updates: Partial<OrderedShipmentsTypes> = { ...patch };

            const existingShipment = shipments.find((s) => s.id === id);

            if (
                patch.status === "shipped" &&
                !existingShipment?.shipped_at
            ) {
                updates.shipped_at = new Date().toISOString();
            }

            if (patch.status === "delivered") {
                updates.delivered_at = new Date().toISOString();
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/orders/${orderData.id}/shipments?shipment_id=${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updates),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message || "Failed to update shipment"
                );
            }

            toast.success("Shipment updated");

            reftech();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        }
    };

    const createShipment = async () => {
        const picks = Object.entries(selectedItems).filter(([, q]) => q > 0);
        if (picks.length === 0) { toast.error("Select at least one item with quantity"); return; }
        setCreating(true);
        try {
            const shipmentNumber = `SH-${Date.now().toString(36).toUpperCase()}`;

            const fd = new FormData();

            fd.append("shipmentNumber", shipmentNumber);
            fd.append("courier", courier ?? null);
            fd.append("trackingId", trackingId ?? null);
            fd.append(
                "items",
                JSON.stringify(
                    picks.map(([order_item_id, quantity]) => ({
                        order_item_id,
                        quantity,
                    }))
                )
            );

            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/orders/${orderData.id}/shipments`, {
                method: "POST",
                body: fd,
            });

            const result = await res.json();

            if (!result.success) {
                throw new Error(result.message || "Failed to create shipment");
            }

            toast.success(`Shipment ${shipmentNumber} created`);
            reftech()

            setCreateOpen(false);
            // loadAll();
        } catch (err: any) {
            toast.error(err.message || "Failed to create shipment");
        } finally {
            setCreating(false);
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2"><Truck className="h-4 w-4" />Shipments ({shipments.length})</CardTitle>
                    <Button size="sm" onClick={openCreate} disabled={allShipped}><Plus className="h-4 w-4 mr-1" />Create Shipment</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {shipments.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No shipments yet. Create one to start fulfilling.</p>
                        </div>
                    ) : shipments.map((s: OrderedShipmentsTypes) => {
                        const sItems = itemsByShipment[s.id] || [];
                        return (
                            <div key={s.id} className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-start justify-between flex-wrap gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{s.shipment_number}</span>
                                            <Badge variant="outline" className={`capitalize ${shipmentStatusColors[s.status] || ""}`}>{s.status.replace(/_/g, " ")}</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Created {new Date(s.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button size="sm" variant="outline" onClick={() => printOne(s, "A6")}><Printer className="h-3 w-3 mr-1" />A6</Button>
                                        <Button size="sm" variant="outline" onClick={() => printOne(s, "A4")}><Printer className="h-3 w-3 mr-1" />A4</Button>

                                        {/* Delete Shipment */}
                                        <AppDialog
                                            trigger={
                                                <Button size="sm" variant="ghost"><Trash2 className="h-3 w-3 text-destructive" /></Button>
                                            }
                                            showClose={false}
                                            title='Delete Shipment'
                                            content={
                                                <Typography>Do you want to delete this shipment permanently?</Typography>
                                            }
                                            footer={
                                                <>
                                                    <DialogClose asChild>
                                                        <Button>No</Button>
                                                    </DialogClose>
                                                    <Button
                                                        variant={'destructive'}
                                                        onClick={() => deleteShipment(s.id)}
                                                    >Yes</Button>
                                                </>
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-3 gap-2">
                                    <div>
                                        <Typography variant='body-lg'>Courier</Typography>
                                        <Input
                                            defaultValue={s.courier || ""}
                                            onBlur={(e) =>
                                                e.target.value !== (s.courier || "") &&
                                                updateShipment(s.id, {
                                                    courier: e.target.value || undefined,
                                                })
                                            }
                                            placeholder="e.g. Delhivery"
                                        />
                                    </div>
                                    <div>
                                        <Typography variant='body-lg'>Tracking ID</Typography>
                                        <Input
                                            defaultValue={s.tracking_id || ""}
                                            onBlur={(e) =>
                                                e.target.value !== (s.tracking_id || "") &&
                                                updateShipment(s.id, {
                                                    tracking_id: e.target.value || undefined,
                                                })
                                            }
                                            placeholder="Tracking number"
                                        />
                                    </div>
                                    <div>
                                        <Typography variant='body-lg'>Status</Typography>
                                        <Select value={s.status} onValueChange={v => updateShipment(s.id, { status: v as any })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="packed">Packed</SelectItem>
                                                <SelectItem value="shipped">Shipped</SelectItem>
                                                <SelectItem value="out_for_delivery">Out for delivery</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="border rounded">
                                    <table className="w-full text-xs">
                                        <thead className="bg-muted/30">
                                            <tr><th className="p-2 text-left">Item</th><th className="p-2 text-left">Variant</th><th className="p-2 text-right">Qty</th></tr>
                                        </thead>
                                        <tbody>
                                            {sItems.map(si => {
                                                const it = items.find(x => x.id === si.order_item_id);
                                                return (
                                                    <tr key={si.id} className="border-t">
                                                        <td className="p-2">{it?.product_title}</td>
                                                        <td className="p-2 text-muted-foreground">{it ? variantOf(it) : "-"}</td>
                                                        <td className="p-2 text-right">{si.quantity}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Shipment Dialog */}
            <AppDialog
                open={createOpen}
                title='Create Shipment'
                content={<ShipmentForm items={items} shipmentItems={shipmentItems} selectedItems={selectedItems} setSelectedItems={setSelectedItems}
                    setCourier={setCourier} setTrackingId={setTrackingId} courier={courier} trackingId={trackingId} />}
                disableOutsideClose
                onOpenChange={() => setCreateOpen(false)}
                footer={
                    <>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                        <Button onClick={createShipment} disabled={creating}>
                            {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}Create
                        </Button>
                    </>
                }
            />
        </>
    )
}

export default Shipments

const ShipmentForm = ({ items, shipmentItems, selectedItems, setSelectedItems, courier, setCourier, trackingId, setTrackingId }: { items: OrderedItemsTypes[]; shipmentItems: OrderedShipmentItemsTypes[]; selectedItems: Record<string, number>; setSelectedItems: any; courier: any; setCourier: any; trackingId: any; setTrackingId: any }) => {

    const shippedQtyMap = useMemo(() => {
        const m: Record<string, number> = {};
        // @ts-ignore
        shipmentItems.forEach(si => { m[si.order_item_id] = (m[si.order_item_id] || 0) + si.quantity; });
        return m;
    }, [shipmentItems]);

    const remainingQty = (item: OrderedItemsTypes) => Math.max(0, Number(item.quantity) - (shippedQtyMap[item.id] || 0));

    return (
        <div className="space-y-4">
            <div>
                <Typography variant="body">Items to include</Typography>
                <div className="border rounded divide-y max-h-64 overflow-y-auto">
                    {items.map(it => {
                        const remaining = remainingQty(it);
                        if (remaining === 0) return null;
                        const qty = selectedItems[it.id] || 0;
                        return (
                            <div key={it.id} className="p-2 flex items-center gap-2">
                                <Checkbox
                                    checked={qty > 0}
                                    onCheckedChange={c => setSelectedItems((p: any) => ({ ...p, [it.id]: c ? remaining : 0 }))}
                                />
                                <div className="flex-1 text-sm">
                                    <p className="font-medium">{it.product_title}</p>
                                    <p className="text-xs text-muted-foreground">{variantOf(it)} · {remaining} remaining</p>
                                </div>
                                <Input
                                    type="number"
                                    min={0}
                                    max={remaining}
                                    value={qty}
                                    onChange={e => setSelectedItems((p: any) => ({ ...p, [it.id]: Math.min(remaining, Math.max(0, Number(e.target.value) || 0)) }))}
                                    className={`rounded-lg bg-transparent w-20`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Typography variant="body">Courier</Typography>
                    <Input value={courier} onChange={e => setCourier(e.target.value)} placeholder="e.g. Delhivery" className={`rounded-lg bg-transparent`} />
                </div>
                <div>
                    <Typography variant="body">Tracking ID</Typography>
                    <Input value={trackingId} onChange={e => setTrackingId(e.target.value)} placeholder="Optional" className={`rounded-lg bg-transparent`} />
                </div>
            </div>
        </div>
    )
}