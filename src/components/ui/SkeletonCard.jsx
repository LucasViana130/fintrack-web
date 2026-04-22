export default function SkeletonCard({ className = '' }) {
  return (
    <div className={`card p-5 space-y-3 ${className}`}>
      <div className="h-3 w-24 rounded-full shimmer" />
      <div className="h-7 w-36 rounded-lg shimmer" />
      <div className="h-2 w-16 rounded-full shimmer" />
    </div>
  )
}
