import { AdminOrderDTO } from "@/lib/db/dto/order.dto";
import { ColumnDef } from "../Table/CustomTable";

export const ordersColumns: ColumnDef<AdminOrderDTO>[] = [
    {
        key: "order",
        header: "Order",
        cell: (row) => <span className="font-medium text-sm">{row.order_number}</span>
    },
    {
        key: "customer",
        header: "Customer",
        cell: (row) => <span className="font-medium text-sm">{row.customer_name}</span>
    },
    {
        key: "phone",
        header: "Phone",
        cell: (row) => <span className="font-medium text-sm">{row.customer_phone}</span>
    },
    {
        key: "total",
        header: "Total",
        cell: (row) => <span className="font-medium text-sm">{row.subtotal}</span>
    },
    {
        key: "status",
        header: "Status",
        cell: (row) => <span className="font-medium text-sm">{row.status}</span>
    },
    {
        key: "payment",
        header: "Payment",
        cell: (row) => <span className="font-medium text-sm">{row.payment_status}</span>
    },
    {
        key: "date",
        header: "Date",
        cell: (row) => <span className="font-medium text-sm">{new Date(row.created_at).toLocaleDateString()}</span>
    }
]