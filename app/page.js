import IOSDevice from '@/components/IOSFrame';
import TarotApp from '@/components/TarotApp';
import FitToViewport from '@/components/FitToViewport';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-ink">
      <FitToViewport width={480} height={960}>
        <IOSDevice width={480} height={960} dark>
          <TarotApp />
        </IOSDevice>
      </FitToViewport>
    </main>
  );
}
