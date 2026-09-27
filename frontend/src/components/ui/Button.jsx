import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:   'btn-shimmer text-white shadow-md hover:shadow-teal-200 hover:shadow-lg active:scale-[0.98]',
        secondary: 'border-2 border-teal-200 bg-white text-teal-700 hover:bg-teal-50 hover:border-teal-300',
        ghost:     'text-slate-500 hover:text-teal-600 hover:bg-teal-50',
      },
    },
    defaultVariants: { variant: 'primary' },
  }
)

export default function Button({ children, onClick, variant = 'primary', disabled = false, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(buttonVariants({ variant }), 'py-2.5 px-4', className)}
    >
      {children}
    </button>
  )
}
