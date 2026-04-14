"use client"

import React, { useState } from 'react'
import DeliveryAddressSection from './DeliveryAddressSection'
import ContactSection from './ContactSection'
import PaymentSummaryCard from './PaymentSummaryCard'
import PaymentMethod from './PaymentMethod'
import { Button } from '../ui/button'
import { handleCODSubmit, handleRazorpaySubmit } from '@/lib/payment.service'
import { useCartStore } from '@/store/cartStore'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { checkoutSchema } from '@/schema/checkout.schema'

export type FormInputProps = {
    type: "Home" | "Work" | "Other";
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string
    email: string;
    paymentMethod: 'razorpay' | 'cod';
};

const Checkout = () => {

    const router = useRouter();

    const [errors, setErrors] = useState<Partial<Record<keyof FormInputProps, string>>>({});
    const [form, setForm] = useState<FormInputProps>({
        type: "Home",
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        email: '',
        paymentMethod: 'razorpay'
    });

    const [submitting, setSubmitting] = useState(false);

    const { items } = useCartStore();

    const handleProccedCheckout = () => {
        const result = checkoutSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: any = {};

            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof FormInputProps;
                fieldErrors[field] = err.message;
            });

            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        form.paymentMethod === "cod"
            ? handleCODSubmit({ form, cartItems: items, setSubmitting, router })
            : handleRazorpaySubmit({ form, cartItems: items, setSubmitting, router });
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="grid md:grid-cols-[1fr_400px] gap-6">
                <div className="space-y-4">
                    <DeliveryAddressSection
                        setFormAddress={(address: any) =>
                            setForm((prev) => ({
                                ...prev,
                                ...address,
                                phone: address.phone ?? "",
                            }))
                        }
                    />
                    <ContactSection
                        email={form.email}
                        error={errors.email}
                        setEmail={(value: string) =>
                            setForm((prev) => ({
                                ...prev,
                                email: value,
                            }))
                        }
                    />
                </div>
                <div className='space-y-4'>
                    <PaymentSummaryCard />
                    <PaymentMethod
                        method={form.paymentMethod}
                        handlePayment={(method: 'razorpay' | 'cod') =>
                            setForm((prev) => ({
                                ...prev,
                                paymentMethod: method,
                            }))
                        }
                    />
                    <Button className='w-full text-white font-bold py-5' onClick={handleProccedCheckout}>
                        {submitting
                            ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Processing...</>
                            : 'Place Order'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Checkout