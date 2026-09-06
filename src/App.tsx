import { Scene } from './components/3d/Scene'
import { RotatingBox } from './components/3d/RotatingBox'

function App() {
  return (
    <main className="w-full h-screen relative bg-[#0a0a0a]">
      {/* HTML Overlay */}
      <div className="absolute top-0 left-0 w-full p-8 z-10 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-black tracking-tighter text-white pointer-events-auto">
            YYRE
          </h1>
          <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <p className="text-xs font-medium text-white uppercase tracking-widest">
              3D Environment Active
            </p>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Scene>
          <RotatingBox />
        </Scene>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 left-8 z-10 pointer-events-none">
        <p className="text-white/40 text-xs font-mono">
          R3F + Three.js + TypeScript
        </p>
      </div>
    </main>
  )
}

export default App
