import { createFileRoute } from '@tanstack/react-router';
import { AppBar } from '@/common/app-bar';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="h-screen w-screen flex flex-col items-center">
      <div className="max-w-6xl w-full">
        <AppBar />
      </div>
    </div>
  );
}
