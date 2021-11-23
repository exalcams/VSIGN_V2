import pdfMakeImg from "./help1";
// import * as pdfjsLib from 'pdfjs-dist';

export default function GetPdfImages(url) {
     var pdfjsLib;
    var imArr = [];
    return pdfjsLib.getDocument(url).promise.then(function(doc) {
        var pages = [];

        // console.log(pages);
        while (pages.length < doc.numPages) pages.push(pages.length + 1);
        // console.log("PAGES",pages);
        return Promise.all(pages.map(function(num) {
            // create a div for each page and build a small canvas for it

            return doc.getPage(num).then(pdfMakeImg)
                .then(function(canvas) {
                    // console.log(imArr);
                    return imArr.push(canvas.toDataURL("image/png"));

                });
        }));
    }).then(() => {
        return imArr;
    })

}