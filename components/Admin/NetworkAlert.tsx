"use client";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { WifiOff, Wifi } from "lucide-react";

export const NetworkAlert = () => {
  const { isOnline } = useNetworkStatus();
  const isMounted = useRef(false);

  useEffect(() => {
    // Skip the very first render — don't toast on page load
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (!isOnline) {
      toast.error("No internet connection", {
        description: "Please check your network and try again.",
        icon: <WifiOff className="h-4 w-4" />,
        duration: Infinity,   // stays until back online
        id: "network-offline", // prevents duplicate toasts
      });
    } else {
      toast.dismiss("network-offline");
      toast.success("Back online", {
        icon: <Wifi className="h-4 w-4" />,
        duration: 3000,
        id: "network-online",
      });
    }
  }, [isOnline]);

  return null;
};