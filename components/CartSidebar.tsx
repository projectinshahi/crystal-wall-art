"use client"

import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Typography } from './ui/Typography'
import Link from 'next/link'
import { Input } from './ui/input'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const items = [
    {
        image: 'https://ikiru.in/cdn/shop/products/buy-wall-decor-two-pods-abstract-wall-art-painting-frame-for-living-room-bedroom-and-home-decor-by-the-atrang-on-ikiru-online-store-4.jpg?v=1739196886&width=1946',
        title: 'Two Pods Abstract Wall Art Painting Frame For Living Room Bedroom and Home Decor',
        quantity: 10,
        actualPrice: 3374,
        offerPrice: 2618
    },
    {
        image: 'https://ikiru.in/cdn/shop/files/buy-wall-accents-selective-edition-luna-wall-art-decor-by-la-dimora-selections-on-ikiru-online-store-1.jpg?v=1739221325&width=1946',
        title: 'Luna Wall Art Decor | Sculptures for Living Room Decor',
        quantity: 10,
        actualPrice: 19999,
        offerPrice: 18199
    }
]

const CartSidebar = ({ open, close }: { open: boolean, close: any }) => {

    const router = useRouter();

    const [couponCode, setCouponCode] = useState<string>('')
    const [visible, setVisible] = useState(open);

    const setOpen = (value: boolean) => { }

    const getItemCount: any = () => {
        return 10
    }

    const updateQuantity = (key: any, qty: any) => { }

    const removeItem = (index: any) => { }

    const clearCart = () => { }

    useEffect(() => {
        if (open) {
            setVisible(true);
        } else {
            setTimeout(() => setVisible(false), 300);
        }
    }, [open]);

    if (!visible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
                onClick={close}
            />

            {/* Sidebar */}
            <div
                className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 py-4 border-b border-lightBackground">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        <Typography variant='body-lg' className='font-bold'>Your cart</Typography>
                        <Badge variant="secondary" className="text-xs">{getItemCount()}</Badge>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground/20" />
                            <Typography variant='body-sm' className='text-muted-foreground'>Your cart is empty</Typography>
                            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div key={index} className="flex gap-3 p-3 rounded-[25px] border border-lightBackground bg-muted/20 overflow-hidden">
                                {/* Image */}
                                <div className="h-30 w-30 rounded-[15px] overflow-hidden border border-lightBackground bg-muted shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex flex-col flex-1 min-w-0 space-y-2">
                                    <div className='relative flex justify-end'>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeItem(index)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <p className="text-sm lg:text-base font-semibold truncate">{item.title}</p>
                                    <div className='flex items-center gap-2'>
                                        <span className="text-base lg:text-xl font-bold text-primary">₹{(item.offerPrice * item.quantity).toLocaleString("en-IN")}</span>
                                        <span className="text-xs lg:text-base font-bold text-darkGray/37 line-through">₹{(item.actualPrice * item.quantity).toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="outline" size="icon" className="h-6 w-6 border-lightBackground" onClick={() => updateQuantity(index, item.quantity - 1)}>
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <Typography variant='caption' className='font-semibold text-center'>{item.quantity}</Typography>
                                        <Button variant="outline" size="icon" className="h-6 w-6 border-lightBackground" onClick={() => updateQuantity(index, item.quantity + 1)}>
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t bg-lightGray border-lightBackground space-y-6">

                        <div className='w-full flex flex-row gap-2.5 items-center'>
                            <Input
                                placeholder="Search for you"
                                value={couponCode}
                                onChange={e => setCouponCode(e.target.value)}
                                className="rounded-[15px] bg-lightBackground border-0 text-xs py-5 px-5 placeholder:text-darkGray/37"
                            />
                            <Button className="min-w-25 cursor-pointer text-white font-semibold" size="lg">
                                Apply
                            </Button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-black">Subtotal</span>
                                <span className="text-sm">₹1099</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-black">Discount</span>
                                <span className="text-sm">₹298</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-black">Shipping</span>
                                <span className="text-sm">Free</span>
                            </div>
                        </div>

                        <div className="w-full h-[1px] bg-[repeating-linear-gradient(to_right,#00000054_0,#00000054_6px,transparent_6px,transparent_12px)]" />

                        <div className="flex items-center justify-between">
                            <span className="text-lg text-black font-bold">Total</span>
                            <span className="text-lg text-black font-bold">₹2099</span>
                        </div>

                        <div className='flex flex-col space-y-2'>
                            {/* <Link href="/checkout" onClick={() => {router.push('/checkout'), setOpen(false)}}> */}
                            <Button
                                className="w-full cursor-pointer text-white font-semibold"
                                size="lg"
                                onClick={() => {
                                    router.push('/checkout');
                                    close();
                                }}
                            >
                                Checkout
                            </Button>
                            {/* </Link> */}
                            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground cursor-pointer" onClick={clearCart}>
                                Clear Cart
                            </Button>
                        </div>
                    </div>
                )}

            </div >
        </>
    )
}

export default CartSidebar