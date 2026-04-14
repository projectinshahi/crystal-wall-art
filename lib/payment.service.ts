import { FormInputProps } from "@/components/Checkout"
import { toast } from "sonner";

interface Props {
    form: FormInputProps;
    cartItems: any;
    setSubmitting: (submitting: boolean) => void;
    router: any;
}

export const handleRazorpaySubmit = ({
    form,
    cartItems,
    setSubmitting,
    router,
}: Props) => {
    if (!form.name.trim() || !form.email.trim()) {
        toast.error("Name and email are required");
        return;
    }

    if (cartItems.length === 0) {
        toast.error("Cart is empty");
        return;
    }

    setSubmitting(true);

    try {
        router.push(`/order-success/${11111}`);
    } catch (error: any) {
        toast.error("Failed to initiate payment", {
            description: error.message,
        });
    } finally {
        setSubmitting(false);
    }
};

export const handleCODSubmit = ({ form, cartItems, setSubmitting, router }: Props) => {

}