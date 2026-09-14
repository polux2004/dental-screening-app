import { cn } from '../../lib/utils'

export default function Card({ children, className = '' }) {
  return (
    <div className={cn('bg-white rounded-2xl card-glow border border-slate-100 p-6', className)}>
      {children}
    </div>
  )
}
