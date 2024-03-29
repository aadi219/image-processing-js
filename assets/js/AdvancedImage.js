class Kernel {
    constructor(kernel) {
        this.weights = kernel;
        this.height = kernel.length;
        this.width = kernel[0].length;
    }

    static boxBlur(factor = 1 / 9, shape = 3) {
        return Array.from(Array(shape), () => new Array(shape).fill(factor));
    }
    static sobelTop(factor = 1) {
        return [[1, 2, 1],
                [0, 0, 0],
                [-1, -2, -1]].map(row => row.map((i) => i * factor));
    } 
    static sobelRight(factor = 1) {
        return [[-1, 0, 1],
                [-2, 0, 2],
                [-1, 0, 1]].map(row => row.map(i => i * factor));
    }
}  

class AdvancedImage extends BasicImage {
    constructor(img) {
        super(img);
    }

    pixelAt(x, y) {
        let index = (y * this.img.width + x) * 4;
        return [
            this.rawPixels[index],
            this.rawPixels[index + 1],
            this.rawPixels[index + 2],
            this.rawPixels[index + 3]
        ]
    }

    convolveBW(kernel) {
        this.toGrayscale();
        // assuming all RGB values are same (grayscale).
        for (let y = 0; y < this.img.height; y++) {
            for (let x = 0; x < this.img.width; x++) {
                // for each pixel, initialise a result
                // whose value will be the sum of (each surrounding pixel * respective weight in kernel)
                let result = 0;
                for (let py = 0; py < kernel.height; py++) {
                    for (let px = 0; px < kernel.width; px++) {
                        let w = kernel.weights[py][px];
                        // x + px - 1 gives appropriate surrounding pixels horizontally for a 3x3 kernel, 1 being Math.floor(kernel.width)
                        // x + 0 - 1 = pixel to the left, x + 1 - 1 = pixel at center, x + 2 - 1 = pixel to the right
                        // y + py - 1 being the vertical analog.
                        if (x + px - 1 < 0 || x + px - 1 > this.img.width || y + py - 1 < 0 || y + py - 1 > this.img.height) {
                            continue;
                        } 
                           
                        result += this.pixelAt(x + px - 1, y + py - 1)[0] * w
                    }
                }
                let index = (y * this.img.width + x) * 4
                this.img.pixels[index] = result;
                this.img.pixels[index + 1] = result;    
                this.img.pixels[index + 2] = result;
            }     
        }
        this.img.updatePixels();   
        return this.img.pixels;     
    }

    convolveColor(kernel) {
        for (let y = 0; y < this.img.height; y++) {
            for (let x = 0; x < this.img.width; x++) {
                // for each pixel, initialise a result array of all channels.
                // whose indices will be the sum of (each surrounding pixel's respective channel * respective weight in kernel)
                let result = new Array(4).fill(0);
                for (let py = 0; py < kernel.height; py++) {
                    for (let px = 0; px < kernel.width; px++ ) {
                        let w = kernel.weights[py][px];
                        
                        if (x + px - 1 < 0 || x + px - 1 > this.img.width || y + py - 1 < 0 || y + py - 1 > this.img.height) 
                            continue;
                        result[0] += this.pixelAt(x + px - 1, y + py - 1)[0] * w
                        result[1] += this.pixelAt(x + px - 1, y + py - 1)[1] * w
                        result[2] += this.pixelAt(x + px - 1, y + py - 1)[2] * w
                        result[3] += this.pixelAt(x + px - 1, y + py - 1)[3]
                    }
                }
                let index = (y * this.img.width + x) * 4;   
                this.img.pixels[index] = result[0];
                this.img.pixels[index + 1] = result[1];
                this.img.pixels[index + 2] = result[2];
                this.img.pixels[index + 3] = result[3];
            }
        }
        this.img.updatePixels();  
        return this.img.pixels;      
    }

    convolvePixel(x, y, kernel) {
        // same algorithm as the inner double for-loop in previous convolve functions.
        // separated to get convolution result of a single pixel for two different kernels, used in edgeDetect to find Gx, Gy
        let result = new Array(4).fill(0);
        for (let py = 0; py < kernel.height; py++) {
            for (let px = 0; px < kernel.width; px++) {
                let w = kernel.weights[py][px];

                if (x + px - 1 < 0 || x + px - 1 > this.img.width || y + py - 1 < 0 || y + py - 1 > this.img.height) 
                    continue;                
                result[0] += this.pixelAt(x + px - 1, y + py - 1)[0] * w
                result[1] += this.pixelAt(x + px - 1, y + py - 1)[1] * w
                result[2] += this.pixelAt(x + px - 1, y + py - 1)[2] * w
                result[3] += this.pixelAt(x + px - 1, y + py - 1)[3]
            }
        }
        return result;
    }
    detectEdges() {
        let kernelTop = new Kernel(Kernel.sobelTop());
        let kernelRight = new Kernel(Kernel.sobelRight());

        for (let y = 0; y < this.img.height; y++) {
            for (let x = 0; x < this.img.width; x++) {
                let Gx = this.convolvePixel(x, y, kernelRight);
                let Gy = this.convolvePixel(x, y, kernelTop);

                let newPixel = this.pixelAt(x, y).map((e, i) => Math.sqrt(Math.pow(Gx[i], 2) + Math.pow(Gy[i], 2)));
                
                let index = (y * this.img.width + x) * 4;
                this.img.pixels[index] = newPixel[0];
                this.img.pixels[index + 1] = newPixel[1];
                this.img.pixels[index + 2] = newPixel[2];
            }
        }        
        this.img.updatePixels();
        return this.img.pixels;
    }
}