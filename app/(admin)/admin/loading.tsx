export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center gap-2 text-gray-500">
        <svg
          className="animate-spin h-5 w-5"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
        </svg>
        Loading...
      </div>
    </div>
  );
}