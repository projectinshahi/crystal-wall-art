import Image from "next/image";

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      
      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/logo/logo.svg" // 👉 update path if needed
          alt="CRYSTAL WallArt"
          width={200}
          height={40}
          priority
        />
      </div>

      {/* Frame Loader */}
      <div className="flex gap-2 items-center">
        <div className="w-4 h-8 border-2 border-black animate-pulse-scale" />
        <div className="w-4 h-10 border-2 border-black animate-pulse-scale delay-150" />
        <div className="w-4 h-8 border-2 border-black animate-pulse-scale delay-300" />
      </div>

      {/* Tagline */}
      <p className="mt-6 text-sm text-gray-500">
        Loading your gallery...
      </p>
    </div>
  );
}