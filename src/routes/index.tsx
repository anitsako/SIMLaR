import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-4xl w-full px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">SIMLaR</h1>
          <p className="text-xl text-default-500">Sistema de Información Minera La Rioja</p>
        </div>
      </div>
    </div>
  );
}
