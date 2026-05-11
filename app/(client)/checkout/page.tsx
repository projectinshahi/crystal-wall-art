import CheckOut from '@/components/Checkout'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const page = async () => {
    const session = await getServerSession();

    if (!session) {
        redirect('/auth/login');
    }

    return <CheckOut />;
}

export default page;