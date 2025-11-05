function LoadingSpinner() {
  return (
    <div 
      role="status" 
      aria-label="Loading" 
      className="fixed inset-0 flex items-center justify-center"
    >
      <div className="flex items-center gap-1.5">
        <div 
          className="h-2 w-2 rounded-full bg-current animate-bounce" 
          style={{ animationDelay: "0ms" }} 
        />
        <div 
          className="h-2 w-2 rounded-full bg-current animate-bounce" 
          style={{ animationDelay: "150ms" }} 
        />
        <div 
          className="h-2 w-2 rounded-full bg-current animate-bounce" 
          style={{ animationDelay: "300ms" }} 
        />
      </div>
    </div>
  );
}

export default LoadingSpinner;