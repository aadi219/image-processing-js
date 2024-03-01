let img;
let upload;
let width = 600, height = 600;

let newImg;

function preload() {
    img = loadImage('assets/img/Valve_original_(1).png');
    pixelDensity(1);
}

function setup() {
    let modified = createCanvas(600,600);
    modified.parent('image')
    modified.class('border border-dark')

    upload = createFileInput(handleUpload)
    upload.parent('imgUpload');
    upload.class('form-control')

    img.resize(width, height);

    imgData = new AdvancedImage(img);
    $('#toGrayscale')[0].addEventListener('click', () => {
        imgData.toGrayscale();
    })
    $('#toRaw')[0].addEventListener('click', () => {
        imgData.toRaw();
    })
    $('#thresholdValue')[0].addEventListener('change', () => {
        let value = $('#thresholdValue')[0].value;
        imgData.thresholdBW(parseInt(value));
    })
    $('#toNegative')[0].addEventListener('click', () => {
        imgData.toNegative();
    })
    $('#changeBase')[0].addEventListener('click', () => {
        imgData.changeBase()
    })
    $('#convolve')[0].addEventListener('click', () => {
        let kernelValue = $('#kernel')[0].value;
        if (Kernel[kernelValue] != undefined)
            imgData.convolveBW(new Kernel(Kernel[kernelValue]()));
    })
    $('#convolveColor')[0].addEventListener('click', () => {
        let kernelValue = $('#kernel')[0].value;
        if (Kernel[kernelValue] != undefined)
            imgData.convolveColor(new Kernel(Kernel[kernelValue]()));
    })
    $('#detectColor')[0].addEventListener('click', () => {
        imgData.detectEdges();
    })
    $('#detectBW')[0].addEventListener('click', () => {
        imgData.detectEdges(true);
    })
}

function draw() {
    background(51);
    // var scale = 0.8;
    imageMode(CENTER);
    // image(imgData.img, 0.5*width, 0.5*height, scale*width, scale*img.height*width/img.width);  
    image(imgData.img, 0.5 * width, 0.5 * height);  
}


function handleUpload(file) {
    if (file.type === 'image') {
        newImg = loadImage(file.data, newImg => {
            newImg.resize(0, width);
            pixelDensity(1);
            imgData = new AdvancedImage(newImg);
        });
    }
}