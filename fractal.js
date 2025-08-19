class FractalGenerator {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.pixelRatio = window.devicePixelRatio || 1;
        
        this.fractals = {
            mandelbrot: this.mandelbrot.bind(this)
        };
        
        this.options = {
            fractalType: options.fractalType || 'mandelbrot',
            complexity: options.complexity || 100,
            palette: options.palette || 'fire',
            centerX: options.centerX || -0.5,
            centerY: options.centerY || 0,
            zoom: options.zoom || 1,
            juliaC: options.juliaC || { real: -0.7, imag: 0.27015 },
            ...options
        };
        
        this.palettes = {
            cosmic: [
                [0, 0, 0],
                [25, 7, 26],
                [9, 1, 47],
                [4, 4, 73],
                [0, 7, 100],
                [12, 44, 138],
                [24, 82, 177],
                [57, 125, 209],
                [134, 181, 229],
                [211, 236, 248],
                [241, 233, 191],
                [248, 201, 95],
                [255, 170, 0],
                [204, 128, 0],
                [153, 87, 0],
                [106, 52, 3]
            ],
            fire: [
                [0, 0, 0],
                [32, 0, 0],
                [64, 0, 0],
                [96, 0, 0],
                [128, 0, 0],
                [160, 32, 0],
                [192, 64, 0],
                [224, 96, 0],
                [255, 128, 0],
                [255, 160, 32],
                [255, 192, 64],
                [255, 224, 96],
                [255, 255, 128],
                [255, 255, 160],
                [255, 255, 192],
                [255, 255, 255]
            ],
            ocean: [
                [0, 0, 0],
                [0, 0, 51],
                [0, 0, 102],
                [0, 25, 153],
                [0, 51, 204],
                [0, 102, 255],
                [51, 153, 255],
                [102, 204, 255],
                [153, 230, 255],
                [204, 242, 255],
                [230, 248, 255],
                [242, 251, 255],
                [248, 253, 255],
                [251, 254, 255],
                [253, 255, 255],
                [255, 255, 255]
            ]
        };
    }
    
    mandelbrot(x, y, width = this.width, height = this.height) {
        const maxIter = this.options.complexity;
        const zoom = this.options.zoom;
        const centerX = this.options.centerX;
        const centerY = this.options.centerY;
        
        const xScale = (3.5 / zoom) / width;
        const yScale = (2.0 / zoom) / height;
        
        const cx = (x - width / 2) * xScale + centerX;
        const cy = (y - height / 2) * yScale + centerY;
        
        let zx = 0;
        let zy = 0;
        let iter = 0;
        
        while (zx * zx + zy * zy < 4 && iter < maxIter) {
            const tmp = zx * zx - zy * zy + cx;
            zy = 2 * zx * zy + cy;
            zx = tmp;
            iter++;
        }
        
        return iter;
    }
    
    
    // Test if a point is near the Mandelbrot set boundary
    isNearBoundary(x, y, threshold = 10) {
        const iterations = this.mandelbrotIterations(x, y, 100);
        // Points are interesting if they escape but take some time (near boundary)
        return iterations > threshold && iterations < 100;
    }
    
    // Raw Mandelbrot calculation without zoom/center transforms
    mandelbrotIterations(cx, cy, maxIter) {
        let zx = 0;
        let zy = 0;
        let iter = 0;
        
        while (zx * zx + zy * zy < 4 && iter < maxIter) {
            const tmp = zx * zx - zy * zy + cx;
            zy = 2 * zx * zy + cy;
            zx = tmp;
            iter++;
        }
        
        return iter;
    }
    
    // Find a random point near the Mandelbrot boundary
    findRandomBoundaryPoint() {
        let attempts = 0;
        const maxAttempts = 100;
        
        while (attempts < maxAttempts) {
            // Sample from different regions with varying probabilities
            let x, y;
            
            const region = Math.random();
            if (region < 0.4) {
                // Main body area (-2 to 0.5, -1 to 1)
                x = -2 + Math.random() * 2.5;
                y = -1 + Math.random() * 2;
            } else if (region < 0.7) {
                // Right region near (0.25, 0)
                x = 0.2 + Math.random() * 0.1;
                y = -0.1 + Math.random() * 0.2;
            } else if (region < 0.9) {
                // Left bulb region near (-0.75, 0)
                x = -0.8 + Math.random() * 0.1;
                y = -0.2 + Math.random() * 0.4;
            } else {
                // Upper/lower tendrils
                x = -1.8 + Math.random() * 1.3;
                y = Math.random() < 0.5 ? 0.5 + Math.random() * 0.5 : -0.5 - Math.random() * 0.5;
            }
            
            if (this.isNearBoundary(x, y)) {
                return { x, y };
            }
            attempts++;
        }
        
        // Fallback to a known interesting point
        const fallbacks = [
            { x: -0.7, y: 0.0 },
            { x: -0.8, y: 0.156 },
            { x: 0.285, y: 0.01 },
            { x: -0.4, y: 0.6 }
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
    
    
    getColor(iterations) {
        const maxIter = this.options.complexity;
        const palette = this.palettes[this.options.palette];
        
        if (iterations === maxIter) {
            return [0, 0, 0];
        }
        
        const colorIndex = (iterations / maxIter) * (palette.length - 1);
        const index = Math.floor(colorIndex);
        const fraction = colorIndex - index;
        
        if (index >= palette.length - 1) {
            return palette[palette.length - 1];
        }
        
        const color1 = palette[index];
        const color2 = palette[index + 1];
        
        return [
            Math.floor(color1[0] + (color2[0] - color1[0]) * fraction),
            Math.floor(color1[1] + (color2[1] - color1[1]) * fraction),
            Math.floor(color1[2] + (color2[2] - color1[2]) * fraction)
        ];
    }
    
    generate() {
        // Use the actual canvas resolution for high-DPI rendering
        const actualWidth = this.canvas.width;
        const actualHeight = this.canvas.height;
        
        const imageData = this.ctx.createImageData(actualWidth, actualHeight);
        const data = imageData.data;
        
        const fractalFunction = this.fractals[this.options.fractalType];
        
        for (let y = 0; y < actualHeight; y++) {
            for (let x = 0; x < actualWidth; x++) {
                const iterations = fractalFunction(x, y, actualWidth, actualHeight);
                const color = this.getColor(iterations);
                const pixelIndex = (y * actualWidth + x) * 4;
                
                data[pixelIndex] = color[0];
                data[pixelIndex + 1] = color[1];
                data[pixelIndex + 2] = color[2];
                data[pixelIndex + 3] = 255;
            }
        }
        
        // Reset context transform and draw at actual resolution
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.putImageData(imageData, 0, 0);
        this.ctx.restore();
    }
    
    randomize() {        
        // always use mandelbrot set
        const fractalType = 'mandelbrot';
        this.options.fractalType = fractalType;

        this.options.complexity = 200;
        this.options.palette = 'ocean';
        
        // Find a random boundary point
        const boundaryPoint = this.findRandomBoundaryPoint();
        this.options.centerX = boundaryPoint.x;
        this.options.centerY = boundaryPoint.y;
        
        // Dynamic zoom based on local complexity
        const baseZoom = 1 + Math.random() * 50;
        // const baseZoom = 100;
        const complexityTest = this.mandelbrotIterations(boundaryPoint.x, boundaryPoint.y, 200);
        
        // Higher complexity areas (more detail) get higher zoom
        const complexityMultiplier = Math.max(0.5, complexityTest / 100);
        this.options.zoom = baseZoom * complexityMultiplier;
        
        // Add small random offset for variety
        const offset = 0.1 / Math.sqrt(this.options.zoom);
        this.options.centerX += (Math.random() - 0.5) * offset;
        this.options.centerY += (Math.random() - 0.5) * offset;
        
        
        this.generate();
    }
    
    setOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.generate();
    }
}

function initFractalBackground() {
    const heroSection = document.getElementById('hero');
    const canvas = document.createElement('canvas');
    
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    
    function resizeCanvas() {
        const rect = heroSection.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        // Set actual canvas resolution (high-DPI)
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        // Set display size (CSS pixels)
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        // Scale the drawing context to match device pixel ratio
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
    }
    
    heroSection.style.position = 'relative';
    heroSection.appendChild(canvas);
    
    setTimeout(() => {
        resizeCanvas();
        
        const fractalGenerator = new FractalGenerator(canvas);
        fractalGenerator.width = canvas.width;
        fractalGenerator.height = canvas.height;
        fractalGenerator.randomize();
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            // Update fractal generator dimensions to match new canvas size
            fractalGenerator.width = canvas.width;
            fractalGenerator.height = canvas.height;
            fractalGenerator.generate();
        });
        
        window.fractalGenerator = fractalGenerator;
    }, 100);
}

document.addEventListener('DOMContentLoaded', initFractalBackground);