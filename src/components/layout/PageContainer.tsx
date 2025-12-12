import { cn } from '@/lib/utils';
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      <div className="py-8 md:py-10 lg:py-12">
        {children}
      </div>
    </div>
  );
}