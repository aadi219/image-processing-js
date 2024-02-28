let img;

function preload() {
    img = loadImage('assets/Valve_original_(1).png');
    pixelDensity(1);
}

function setup() {
    let modified = createCanvas(600,600);
    modified.parent('image')
    modified.class('border border-dark')

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
    $('#detectEdgesBW')[0].addEventListener('click', () => {
        imgData.detectEdgesBW();
    })
}

function draw() {
    image(imgData.img, 0, 0, width, height);

}
