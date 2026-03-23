import IconRail from './IconRail';

interface ForgeLayoutProps {
  children: React.ReactNode;
}

export default function ForgeLayout({ children }: ForgeLayoutProps) {
  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden">
      <IconRail />
      <main className="flex-1 ml-20 overflow-auto">
        {children}
      </main>
    </div>
  );
}
