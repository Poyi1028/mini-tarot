import TarotApp from '@/components/TarotApp';

export default function Home() {
  return (
    <main className="flex h-[100dvh] min-h-0 w-full overflow-hidden bg-ink justify-center">
      <div
        className="relative h-full min-h-0 w-full max-w-[480px] overflow-hidden"
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
