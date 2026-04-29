const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center animate-pulse">
      
      {/* Image skeleton */}
      <div className="w-full aspect-square rounded-[28px] bg-gray-200" />

      {/* Title skeleton */}
      <div className="mt-3 h-4 w-3/4 bg-gray-200 rounded" />
    </div>
  );
};

export default ProductCardSkeleton;