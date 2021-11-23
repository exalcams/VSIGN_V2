function pdfMakeImg(page) {


    // draw page to fit into 96x96 canvas
    var vp = page.getViewport({ scale: 1 });
    var canvas = document.createElement("canvas");
    canvas.width = 130;canvas.height = 170;
    var scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
    return page.render({ canvasContext: canvas.getContext("2d"), viewport: page.getViewport({ scale: scale }) }).promise.then(function() {
        return canvas;
    });


}

function GetPdfImages(url) {
    var imArr = [];
    return pdfjsLib.getDocument(url).promise.then(function(doc) {
        var pages = [];

        // console.log(pages);
        while (pages.length < doc.numPages) pages.push(pages.length + 1);
        console.log("PAGES",pages);
        return Promise.all(pages.map(function(num) {
            // create a div for each page and build a small canvas for it

            return doc.getPage(num).then(pdfMakeImg)
                .then(function(canvas) {
                    console.log(imArr);
                    return imArr.push(canvas.toDataURL("image/png"));

                });
        }));
    }).then(() => {
        return imArr;
    })
    // alert(url);
}