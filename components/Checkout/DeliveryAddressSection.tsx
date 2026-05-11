import { Check, Edit2, MapPin, Plus, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Typography } from '../ui/Typography'
import { FormAddress, SavedAddress } from '@/types/address.types';
import { Badge } from '../ui/badge';
import DeliveryAddressForm from './DeliveryAddressForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddressFormValues, addressSchema } from '@/schema/address.schema';

const addresses = [
    {
        id: "addr_1",
        type: "Home",
        name: "Jibi George",
        phone: "9876543210",
        address: "House No. 12, Green Valley, Near St. Mary's Church",
        city: "Talipparamba",
        state: "Kerala",
        pincode: "670141",
        is_default: false,
    },
    {
        id: "addr_2",
        type: "Work",
        name: "Jibi George",
        phone: "9876543210",
        address: "2nd Floor, Tech Park Building, Kannur Road",
        city: "Kannur",
        state: "Kerala",
        pincode: "670002",
        is_default: true,
    },
    {
        id: "addr_3",
        type: "Other",
        name: "Jibi George",
        phone: null,
        address: "Flat 4B, Sunrise Apartments, MG Road",
        city: "Kochi",
        state: "Kerala",
        pincode: "682016",
        is_default: false,
    },
    {
        id: "addr_4",
        type: "Parents",
        name: "George Mathew",
        phone: "9123456780",
        address: "Rose Villa, Near Government Hospital",
        city: "Kottayam",
        state: "Kerala",
        pincode: "686001",
        is_default: false,
    },
]

interface Props {
    setFormAddress: React.Dispatch<React.SetStateAction<AddressFormValues>>;
}

const DeliveryAddressSection = ({ setFormAddress }: Props) => {

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

    const { control, handleSubmit, reset } = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            type: "Home",
            name: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            pincode: ""
        },
    });

    useEffect(() => {
        const loadAddresses = async () => {
            try {
                const res = await fetch("/api/user/address", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch addresses");
                }

                const addresses = await res.json();

                if (addresses && addresses.data.length > 0) {
                    setSavedAddresses(addresses.data as SavedAddress[]);

                    const def =
                        addresses.data.find((a: any) => a.is_default) ||
                        addresses.data[0];

                    setSelectedAddressId(def.id);

                    fillFormFromAddress(def as AddressFormValues);
                } else {
                    setShowAddressForm(true);
                }
            } catch (err) {
                console.error("Error loading addresses:", err);
                setShowAddressForm(true);
            }
        };

        loadAddresses();
    }, []);

    const startEditAddress = (addr: SavedAddress) => {
        setEditingAddressId(addr.id);
        setShowAddressForm(true);
    };

    const selectAddress = (addr: SavedAddress) => {
        setSelectedAddressId(addr.id);
        setShowAddressForm(false);
        setEditingAddressId(null);
        fillFormFromAddress(addr as AddressFormValues);
    };

    const deleteAddress = async (id: string) => {
        // Code for the delete the address from the DB
        setSavedAddresses(prev => prev.filter(a => a.id !== id));
        if (selectedAddressId === id) {
            const remaining = savedAddresses.filter(a => a.id !== id);
            if (remaining.length > 0) { selectAddress(remaining[0]); }
            else { startNewAddress(); }
        }
    };

    const startNewAddress = () => {
        setSelectedAddressId(null);
        setEditingAddressId(null);
        setShowAddressForm(true);
        reset({
            type: "Home",
            name: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            pincode: ""
        })
    };

    const fillFormFromAddress = (addr: AddressFormValues) => {
        setFormAddress({
            type: addr.type as "Home" | "Work" | "Other",
            name: addr.name,
            phone: addr.phone ?? "",
            address: addr.address,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode
        });
        reset({
            type: addr.type as "Home" | "Work" | "Other",
            name: addr.name,
            phone: addr.phone ?? "",
            address: addr.address,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode
        });
    };

    const onSubmit = async (data: AddressFormValues) => {
        const insertedData = await fetch('/api/user/address', {
            method: 'POST',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        const address = await insertedData.json()
        console.log("address",address);
        

        if (address || address.success) {
            setSavedAddresses([...savedAddresses, address.data])
            setShowAddressForm(false)
        } else {
            setSavedAddresses([])
        }
    };

    const selectedAddr = savedAddresses.find(a => a.id === selectedAddressId);

    return (
        <div className='bg-lightGray border border-grayBorder rounded-xl p-4 space-y-3'>
            <div className="flex items-center justify-between">
                <Typography className='font-semibold flex items-center gap-2' variant='label'>
                    <MapPin className="h-4 w-4 text-primary" /> Delivering To
                </Typography>
                {selectedAddr && !showAddressForm && (
                    <button onClick={() => startEditAddress(selectedAddr)} className="text-primary cursor-pointer">
                        <Edit2 className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Saved addresses list */}
            {savedAddresses.length > 0 && !showAddressForm && (
                <div className="space-y-2">
                    {savedAddresses.map(addr => (
                        <button
                            key={addr.id}
                            onClick={() => selectAddress(addr)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selectedAddressId === addr.id ? "border-primary bg-primary/5" : "border-grayBorder hover:border-primary/40"
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="secondary" className="text-[12px] font-semibold">{addr.type}</Badge>
                                        {addr.is_default && <Badge className="text-[12px] bg-primary/10 text-primary border border-grayBorder">Default</Badge>}
                                    </div>
                                    <p className="text-sm font-medium">{addr.name}</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                                    </p>
                                    {addr.phone && <p className="text-xs text-muted-foreground">mobile: {addr.phone}</p>}
                                </div>
                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                    {selectedAddressId === addr.id && <Check className="h-4 w-4 text-primary" />}
                                    <button
                                        onClick={e => { e.stopPropagation(); deleteAddress(addr.id); }}
                                        className="p-1 text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        </button>
                    ))}
                    <button onClick={startNewAddress} className="w-full flex items-center gap-2 p-3 rounded-lg border-2 border-dashed border-primary/30 text-primary text-sm hover:bg-primary/5 transition-colors">
                        <Plus className="h-4 w-4" /> Add New Address
                    </button>
                </div>
            )}

            {/* Address form */}
            {showAddressForm && (
                <DeliveryAddressForm
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    control={control}
                    editingAddressId={editingAddressId}
                    savedAddresses={savedAddresses}
                    setShowAddressForm={setShowAddressForm}
                    selectAddress={selectAddress} />)}
        </div>
    )
}

export default DeliveryAddressSection