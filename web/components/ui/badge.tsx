import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground rounded-full py-1 px-3 text-[11px] font-bold uppercase tracking-wider',
        coral:
          'bg-primary text-primary-foreground rounded-full py-1 px-3 text-[11px] font-bold uppercase tracking-wider',
        secondary:
          'bg-brand-surface-card text-brand-ink rounded-full py-1 px-3 text-xs font-medium border border-brand-hairline',
        pill: 'bg-brand-surface-card text-brand-ink rounded-full py-1 px-3 text-xs font-medium border border-brand-hairline',
        destructive:
          'bg-destructive/10 text-destructive rounded-full py-1 px-3 text-xs font-medium focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'border-brand-hairline border bg-transparent text-brand-ink rounded-full py-1 px-3 text-xs font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface BadgeProps extends useRender.ComponentProps<'span'>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant = 'default', render, ...props }: BadgeProps) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  });
}

export { Badge, badgeVariants };
