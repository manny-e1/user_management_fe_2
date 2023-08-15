import { SessionTimeout } from '@/components/SessionTimeout';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SessionTimeout />
      <Sidebar />
      <main className="flex-grow overflow-x-hidden  bg-[#f5f7fb] h-screen bg-forgotten">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
