import ContextBox from '@/components/ui/ContextBox';
import Canvas from '@/components/ui/Canvas';
import BlockPalette from '@/components/ui/BlockPalette';
import BlockEditorPanel from '@/components/ui/BlockEditorPanel';

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <ContextBox />
      <div className="flex flex-1 overflow-hidden">
        <BlockPalette />
        <Canvas />
        <BlockEditorPanel />
      </div>
    </div>
  );
}
