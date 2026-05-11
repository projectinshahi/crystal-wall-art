import React, { useState } from 'react'
import { Typography } from '../ui/Typography'
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { useCartStore } from '@/store/cartStore';

const PaymentSummaryCard = () => {

    const { items, getTotal, clearCart, getItemKey } = useCartStore();

    const [summaryOpen, setSummaryOpen] = useState<boolean>(false);

    const subtotal = getTotal()
    const shipping = subtotal > 999 ? 0 : 99;

    return (
        <div className='bg-lightGray border border-grayBorder rounded-xl p-4 space-y-3 h-fit'>
            <div className="flex items-center justify-between">
                <Typography className='font-semibold flex items-center gap-2' variant='label'>Payment Summary</Typography>
                <Button className='flex flex-row gap-1 items-center cursor-pointer bg-transparent pr-0' onClick={() => setSummaryOpen(!summaryOpen)}>
                    <Typography className='font-bold flex items-center gap-2 text-primary' variant='body-lg'>₹{subtotal.toLocaleString("en-IN")}</Typography>
                    {summaryOpen ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />}
                </Button>
            </div>

            {summaryOpen && (
                <div className="pb-4 space-y-3">
                    {/* Cart items */}
                    {items.map(item => (
                        <div className="flex items-center gap-3 py-2" key={getItemKey(item)}>

                            {/* Image */}
                            <div className="h-12 w-12 rounded-lg border border-grayBorder overflow-hidden shrink-0 bg-muted">
                                {item.image && (
                                    <img src={item.image} className="h-full w-full object-cover" alt="" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 min-w-0 items-start justify-between gap-3">

                                {/* Left text */}
                                <div className="min-w-0">
                                    <Typography className="font-semibold text-[14px] truncate">
                                        {item.title}
                                    </Typography>

                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                        {item.size && (
                                            <Typography variant="caption">
                                                Size: {item.size}
                                            </Typography>
                                        )}
                                        {item.thickness && (
                                            <Typography variant="caption">
                                                • {item.thickness}
                                            </Typography>
                                        )}
                                        {item.mounting_method && (
                                            <Typography variant="caption">
                                                • {item.mounting_method}
                                            </Typography>
                                        )}
                                    </div>
                                </div>

                                {/* Right price */}
                                <div className="text-right shrink-0">
                                    <Typography className="font-semibold" variant="body">
                                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                    </Typography>

                                    <Typography className="font-semibold" variant="caption">
                                        ×{item.quantity}
                                    </Typography>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="border-t border-grayBorder pt-3 space-y-1.5">
                <div className="flex justify-between gap-2">
                    <Typography variant='label'>Subtotal:</Typography>
                    <Typography variant='label'>₹{subtotal.toLocaleString("en-IN")}</Typography>
                </div>
                <div className="flex justify-between gap-2">
                    <Typography variant='label'>Shipping:</Typography>
                    <Typography variant='label'>₹{shipping.toLocaleString("en-IN")}</Typography>
                </div>

                <div className="flex justify-between font-bold text-base border-t border-grayBorder pt-2">
                    <Typography variant='body-lg'>Total:</Typography>
                    <Typography variant='body-lg' className='text-primary'>₹{subtotal.toLocaleString("en-IN")}</Typography>
                </div>
            </div>
        </div>
    )
}

export default PaymentSummaryCard