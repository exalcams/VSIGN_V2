export default function pdfMakeImg(page) {


    // draw page to fit into 96x96 canvas
    var vp = page.getViewport({ scale: 1 });
    var canvas = document.createElement("canvas");
    canvas.width = 130;canvas.height = 170;
    var scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
    return page.render({ canvasContext: canvas.getContext("2d"), viewport: page.getViewport({ scale: scale }) }).promise.then(function() {
        return canvas;
    });


}