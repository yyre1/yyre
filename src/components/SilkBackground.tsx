import React, { useEffect, useRef } from "react";

interface SilkBackgroundProps {
  className?: string;
  color?: string; // Hex color for the silk tint (default: subtle monochrome/silver #2a2a2e)
  speed?: number; // Speed multiplier (default: 0.8)
  scale?: number; // Wave density/scale (default: 1.2)
  opacity?: number; // Alpha blend (default: 0.35)
}

/**
 * SilkBackground - 21st.dev Silk Background Animation component
 * WebGL-powered organic silk fold and ribbon wave animation with smooth reflection.
 */
export const SilkBackground: React.FC<SilkBackgroundProps> = ({
  className = "",
  color = "#2a2a32",
  speed = 0.8,
  scale = 1.2,
  opacity = 0.35,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    // Parse color hex to RGB normalized
    const hexToRgb = (hex: string) => {
      const clean = hex.replace("#", "");
      const num = parseInt(clean, 16);
      return [
        ((num >> 16) & 255) / 255,
        ((num >> 8) & 255) / 255,
        (num & 255) / 255,
      ];
    };

    const rgbColor = hexToRgb(color);

    // Vertex Shader
    const vsSource = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main() {
        vUv = (aPosition + 1.0) * 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Fragment Shader - Silk wave algorithm with Simplex noise + Sinusoidal interference
    const fsSource = `
      precision mediump float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uSpeed;
      uniform float uScale;
      uniform float uOpacity;

      varying vec2 vUv;

      // Simple 2D Noise
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * frac(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / uResolution;
        float t = uTime * uSpeed * 0.4;

        // Silk fold calculations
        float wave1 = sin(st.x * 6.0 * uScale + t) * cos(st.y * 4.0 * uScale + t * 0.7);
        float wave2 = snoise(vec2(st.x * 3.0 * uScale - t * 0.3, st.y * 3.0 * uScale + t * 0.2));
        float wave3 = sin(st.y * 10.0 * uScale - t * 1.2 + wave1 * 2.0);

        // Sheen and highlight fold
        float fold = smoothstep(-0.2, 0.8, wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2);
        float sheen = pow(fold, 2.5) * 0.6;
        float shadow = pow(1.0 - fold, 1.8) * 0.4;

        vec3 baseColor = uColor;
        vec3 finalColor = mix(baseColor * 0.4, baseColor * 1.8, sheen) - shadow * 0.2;

        // Soft edge fade
        float alpha = uOpacity * (0.6 + 0.4 * fold);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    // Helper compiler
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const aPositionLoc = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uResolutionLoc = gl.getUniformLocation(program, "uResolution");
    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const uColorLoc = gl.getUniformLocation(program, "uColor");
    const uSpeedLoc = gl.getUniformLocation(program, "uSpeed");
    const uScaleLoc = gl.getUniformLocation(program, "uScale");
    const uOpacityLoc = gl.getUniformLocation(program, "uOpacity");

    gl.uniform3fv(uColorLoc, rgbColor);
    gl.uniform1f(uSpeedLoc, speed);
    gl.uniform1f(uScaleLoc, scale);
    gl.uniform1f(uOpacityLoc, opacity);

    // Resize handling
    let animationFrameId: number;
    let startTime = performance.now();

    const resize = () => {
      const displayWidth = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
      const displayHeight = canvas.clientHeight || canvas.parentElement?.clientHeight || 80;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
        gl.uniform2f(uResolutionLoc, displayWidth, displayHeight);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Render loop
    const render = (now: number) => {
      const time = (now - startTime) * 0.001;
      gl.uniform1f(uTimeLoc, time);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, [color, speed, scale, opacity]);

  return (
    <div className={`relative overflow-hidden pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};