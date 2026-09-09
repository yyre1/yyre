import { Header } from "@/components/Header";
import { DemoOne } from "@/components/ui/demo";

const Index = () => {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black text-white selection:bg-white/10">
      
      {/* 
        LAYERING SCHEME:
        - Floating Glass Header (z-50, top)
        - Silk Fullscreen Animated Hero Demo (z-0, back)
      */}

      {/* Floating Glass Header with its own clipped local silk background */}
      <Header />

      {/* Fullscreen Interactive Silk Animation with original 21st.dev visual and typography */}
      <div className="relative z-0 w-full min-h-screen">
        <DemoOne />
      </div>

    </div>
  );
};

export default Index;