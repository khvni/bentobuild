import ContextBar from '@/components/ui/ContextBar';
import Canvas from '@/components/ui/Canvas';
import BlockPalette from '@/components/ui/BlockPalette';

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <ContextBar />
      <div className="flex flex-1 overflow-hidden">
        <BlockPalette />
        <Canvas />
      </div>
    </div>
  );
}
