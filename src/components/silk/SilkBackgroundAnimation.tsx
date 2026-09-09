import { useEffect, useRef } from "react";

type SilkBackgroundAnimationProps = {
  className?: string;
  /** Disable the animation loop (e.g. when prefers-reduced-motion is active). */
  animated?: boolean;
};

/**
 * Silk Background Animation
 *
 * A lightweight WebGL fragment-shader animation that renders flowing, layered
 * silk-like waves. Adapted from the 21st.dev "Silk Background Animation"
 * component by waleedkibhen. Self-contained and dependency-free.
 *
 * Isolated in its own component so it can be tuned or swapped out later
 * without affecting the surrounding header.
 */
export function SilkBackgroundAnimation({
  className,
  animated = true,
}: SilkBackgroundAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animatedRef = useRef(animated);

  useEffect(() => {
    animatedRef.current = animated;
  }, [animated]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", {
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false,
      }) || canvas.getContext("experimental-webgl", { alpha: true });

    if (!gl) {
      console.warn("SilkBackgroundAnimation: WebGL is not available");
      return;
    }

    // ---- Vertex shader -------------------------------------------------
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(
      vertexShader,
      `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
      `
    );
    gl.compileShader(vertexShader);

    // ---- Fragment shader ------------------------------------------------
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(
      fragmentShader,
      `
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_time;

      // Layered sine-based "silk" field
      float silk(vec2 uv, float t) {
        float v = 0.0;
        v += sin(uv.x * 6.0 + t) * 0.5;
        v += sin(uv.y * 7.0 - t * 1.2) * 0.4;
        v += sin((uv.x + uv.y) * 4.0 + t * 0.7) * 0.6;
        v += sin(uv.x * 2.0 - uv.y * 3.0 + t * 0.5) * 0.5;
        return v / 2.0;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 p = vec2(uv.x * aspect, uv.y);

        float t = u_time * 0.25;

        // Three blended silk layers with soft, dark, premium tones
        float a = silk(p, t);
        float b = silk(p * 1.4 - 0.6, t * 1.1 + 2.0);
        float c = silk(p * 2.2 + 0.4, t * 0.9 + 4.0);

        vec3 base = vec3(0.05, 0.05, 0.06);          // deep charcoal
        vec3 silkA = vec3(0.55, 0.42, 0.32);         // muted bronze
        vec3 silkB = vec3(0.30, 0.34, 0.42);         // slate blue
        vec3 silkC = vec3(0.42, 0.30, 0.38);         // mauve

        vec3 color = base;
        color = mix(color, silkA, smoothstep(-1.2, 1.2, a) * 0.5);
        color = mix(color, silkB, smoothstep(-1.0, 1.0, b) * 0.35);
        color = mix(color, silkC, smoothstep(-0.8, 0.8, c) * 0.25);

        // Fade toward transparent edges so the header blends into the 3D scene
        float vignette = smoothstep(1.0, 0.3, length(uv - 0.5) * 1.6);
        color *= mix(0.25, 1.0, vignette);

        gl_FragColor = vec4(color, 0.85);
      }
      `
    );
    gl.compileShader(fragmentShader);

    // ---- Program ---------------------------------------------------------
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(
        "SilkBackgroundAnimation: shader link failed",
        gl.getProgramInfoLog(program)
      );
      return;
    }

    gl.useProgram(program);

    // Full-screen triangle
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    let animationFrame = 0;
    const startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth || canvas.offsetWidth;
      const height = canvas.clientHeight || canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, animatedRef.current ? elapsed : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}