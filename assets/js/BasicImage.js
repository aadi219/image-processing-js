class BasicImage {
    constructor(img) {
        this.img = img;
        print(img);
        this.img.loadPixels();
        this.rawPixels = [...this.img.pixels];
    }

    thresholdBW(value) {
        if (this.gray == undefined)
            this.toGrayscale();
        for (let i = 0; i < this.img.width * this.img.height; i++) {
            if (this.gray[i] > value) {
                this.img.pixels[i * 4] = 255;
                this.img.pixels[i * 4 + 1] = 255;
                this.img.pixels[i * 4 + 2] = 255;
            }
            else if (this.gray[i] == value) {
                this.img.pixels[i * 4] = this.gray[i];
                this.img.pixels[i * 4 + 1] = this.gray[i];
                this.img.pixels[i * 4 + 2] = this.gray[i];
            }
            else {
                this.img.pixels[i * 4] = 0;
                this.img.pixels[i * 4 + 1] = 0;
                this.img.pixels[i * 4 + 2] = 0;
            }
        }
        this.img.updatePixels();
    }

    toRaw() {
        for (let i = 0; i < this.img.width * this.img.height; i++) {
            this.img.pixels[i * 4] = this.rawPixels[i * 4];
            this.img.pixels[i * 4 + 1] = this.rawPixels[i * 4 + 1];
            this.img.pixels[i * 4 + 2] = this.rawPixels[i * 4 + 2];
        }
        this.img.updatePixels();
    }

    toNegative() {
        for (let y = 0; y < this.img.height; y++) {
            for (let x = 0; x < this.img.width; x++) {
                let index = (y * this.img.width + x) * 4;
                this.img.pixels[index] = 255 - this.rawPixels[index]
                this.img.pixels[index + 1] = 255 - this.rawPixels[index + 1]
                this.img.pixels[index + 2] = 255 - this.rawPixels[index + 2]
            }
        }
        this.img.updatePixels();
    }

    toGrayscale() {
        if (this.gray == undefined)
                this.gray = new Array(this.img.width * this.img.height);
        for (let y = 0; y < this.img.height; y++) {
            for (let x = 0; x < this.img.width; x++) {
                let index = (y * this.img.width + x) * 4;
                let red, green, blue, alpha;
                red = this.rawPixels[index];
                green = this.rawPixels[index + 1];
                blue = this.rawPixels[index + 2];
                let gray = (red + green + blue) / 3;
                this.gray[index / 4] = gray;
                this.img.pixels[index] = gray
                this.img.pixels[index + 1] = gray
                this.img.pixels[index + 2] = gray
            }
        }      
        this.img.updatePixels();
    }

    changeBase() {
        this.rawPixels = [...this.img.pixels];
    }

    toGrid() {
        let grid = Array.from(new Array(this.img.width), () => new Array(this.img.height));
        
        for (let y = 0; y < this.img.height; y++) {
            for (let x = 0; x < this.img.width; x++) {
                let index = (y * this.img.width + x) * 4;
                grid[y][x] = [
                    this.rawPixels[index],
                    this.rawPixels[index + 1],
                    this.rawPixels[index + 2],
                    this.rawPixels[index + 3],
                ]
            }
        }
        
        return grid;
    }

}