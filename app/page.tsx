import TarotApp from '@/components/TarotApp';

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] justify-center bg-ink">
      <div
        className="relative w-full max-w-[480px] min-h-[100dvh] overflow-hidden"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <TarotApp />
      </div>
    </main>
  );
}
