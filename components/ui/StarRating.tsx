type StarRatingProps = {
  rating: number;
  reviewCount: number;
  className?: string;
};

export function StarRating({ rating, reviewCount, className = "" }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1 text-[11px] text-amber-400 ${className}`} aria-label={`${rating} sao từ ${reviewCount} đánh giá`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>{index < Math.round(rating) ? "★" : "☆"}</span>
      ))}
      <span className="ml-1 text-zinc-500">({reviewCount})</span>
    </div>
  );
}

export default StarRating;
