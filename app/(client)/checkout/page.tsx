import CheckOut from '@/components/Checkout'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const page = async () => {
    const session = await getServerSession();

    console.log("session", session);

    if (!session) {
        redirect('/auth/login');
    }

    return <CheckOut />;
}

export default page;