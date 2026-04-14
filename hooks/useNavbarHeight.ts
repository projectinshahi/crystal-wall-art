"use client";

import { useEffect, useState } from "react";

export const useNavbarHeight = () => {
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const nav = document.getElementById("header-section");
    if (!nav) return;

    const updateHeight = () => {
      const h = nav.offsetHeight;
      setHeight(h);

      document.documentElement.style.setProperty(
        "--nav-height",
        `${h}px`
      );
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(nav);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return height;
};