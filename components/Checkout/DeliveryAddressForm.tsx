import React from 'react'
import FormInput from '../inputs/FormInput'
import { Control, useController } from 'react-hook-form';
import { AddressFormValues } from '@/schema/address.schema';
import FormTextarea from '../inputs/FormTextarea';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';
import { SavedAddress } from '@/types/address.types';

interface Props {
    control: Control<AddressFormValues>;
    handleSubmit: any;
    onSubmit: (data: AddressFormValues) => void;
    editingAddressId?: string | null;
    savedAddresses: SavedAddress[];
    setShowAddressForm: any;
    selectAddress: any;
}

const DeliveryAddressForm = ({ control,
    handleSubmit,
    onSubmit,
    editingAddressId,
    savedAddresses,
    setShowAddressForm,
    selectAddress }: Props) => {

    const userId = 13121;

    const {
        field: { value, onChange },
    } = useController({
        name: "type",
        control,
    });

    return (
        <form className="space-y-3 pt-1" onSubmit={handleSubmit(onSubmit)}>
            {/* Label chips */}
            <div className="flex gap-2">
                {["Home", "Work", "Other"].map(label => (
                    <button
                        type="button"
                        key={label}
                        onClick={() => onChange(label)}
                        className={`px-3 py-1 rounded-full text-xs border transition-colors cursor-pointer ${value === label
                            ? "bg-primary text-white border-primary"
                            : "border-border hover:border-primary/40"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <FormInput
                        name="name"
                        control={control}
                        label="Full Name" />
                </div>
                <div className="space-y-1">
                    <FormInput
                        name="phone"
                        control={control}
                        label="Phone" />
                </div>
            </div>
            <div className="space-y-1">
                <FormTextarea
                    name="address"
                    control={control}
                    label="Address" />
            </div>
            <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                    <FormInput
                        name="city"
                        control={control}
                        label="City" />
                </div>
                <div className="space-y-1">
                    <FormInput
                        name="state"
                        control={control}
                        label="State" />
                </div>
                <div className="space-y-1">
                    <FormInput
                        name="pincode"
                        control={control}
                        label="Pincode" />
                </div>
            </div>
            <div className="flex gap-2">
                {userId && (
                    <Button size="sm" onClick={handleSubmit(onSubmit)} className='text-white'>
                        <Check className="h-3.5 w-3.5 mr-1" /> {editingAddressId ? "Update" : "Save"} Address
                    </Button>
                )}
                {savedAddresses.length > 0 && (
                    <Button size="sm" variant="ghost" onClick={() => { setShowAddressForm(false); if (savedAddresses.length > 0) selectAddress(savedAddresses[0]); }}>
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    )
}

export default DeliveryAddressForm