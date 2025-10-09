import ContextBar from '@/components/ui/ContextBar';
import Canvas from '@/components/ui/Canvas';
import BlockPalette from '@/components/ui/BlockPalette';
import BlockEditorPanel from '@/components/ui/BlockEditorPanel';
import PreviewButton from '@/components/ui/PreviewButton';
import { HistoryControls } from '@/components/ui/HistoryControls';

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-bold text-gray-800">Bentobuild</h1>
        <HistoryControls />
      </div>
      <ContextBar />
      <div className="flex flex-1 overflow-hidden">
        <BlockPalette />
        <Canvas />
        <BlockEditorPanel />
      </div>
      <PreviewButton />
    </div>
  );
}
