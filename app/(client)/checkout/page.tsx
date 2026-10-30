import CheckOut from '@/components/Checkout'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

const page = async () => {
    const session = await getServerSession(authOptions);

    // No session → guest checkout (no saved addresses, order isn't linked to an account)
    return <CheckOut isGuest={!session} />;
}

export default page;