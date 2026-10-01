import { redirect } from 'next/navigation'

// /admin has no dashboard yet — land on Products (same destination as after admin login).
export default function AdminIndexPage() {
    redirect('/admin/products')
}
