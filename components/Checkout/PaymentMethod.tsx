import React from 'react'
import { Typography } from '../ui/Typography'
import { Button } from '../ui/button'
import { Banknote, CreditCard } from 'lucide-react';

interface Props {
    method: 'razorpay' | 'cod';
    handlePayment: (method: 'razorpay' | 'cod') => void;
}

const PaymentMethod = ({ method, handlePayment }: Props) => {
    return (
        <div className='bg-lightGray border border-grayBorder rounded-xl p-4 space-y-3 h-fit'>
            <Typography className='font-semibold flex items-center gap-2' variant='label'>Payment Methods</Typography>

            {/* Razorpay */}
            <Button className={`bg-transparent w-full h-auto rounded-lg flex items-center gap-3 p-3 transition-all text-left hover:bg-transparent
                ${method === 'razorpay' ? 'border-primary bg-primary/5' : 'border-grayBorder hover:border-primary/40'}`}
                onClick={() => handlePayment('razorpay')}>
                <div className='h-5 w-5 rounded-full border-2 border-grayBorder flex items-center justify-center shrink-0 '>
                    {method === "razorpay" && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <CreditCard className='w-5 h-5 text-primary shrink-0' />
                <div className="flex-1">
                    <Typography variant='label'>Razorpay</Typography>
                    <Typography variant='caption'>UPI, Cards, Net Banking, Wallets</Typography>
                </div>
            </Button>

            {/* COD */}
            <Button className={`bg-transparent w-full h-auto rounded-lg flex items-center gap-3 p-3 transition-all text-left hover:bg-transparent
                ${method === 'cod' ? 'border-primary bg-primary/5' : 'border-grayBorder hover:border-primary/40'}`}
                onClick={() => handlePayment('cod')}>
                <div className='h-5 w-5 rounded-full border-2 border-grayBorder flex items-center justify-center shrink-0 '>
                    {method === "cod" && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <Banknote className='w-5 h-5 text-primary shrink-0' />
                <div className="flex-1">
                    <Typography variant='label'>Cash on Delivery</Typography>
                    <Typography variant='caption'>Enter pincode to check</Typography>
                </div>
            </Button>
        </div>
    )
}

export default PaymentMethod