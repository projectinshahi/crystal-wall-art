"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/Container/Container";

interface Props {
  title?: string;
  onBack?: () => void;
}

export default function BackHeader({ title, onBack }: Props) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-primary">
      <Container>
        <div className="flex items-center justify-between h-14 sm:h-16">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          {title && (
            <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold truncate max-w-[60%] text-white">
              {title}
            </h1>
          )}
        </div>
      </Container>
      <div className="h-[1px] bg-border" />
    </header>
  );
}