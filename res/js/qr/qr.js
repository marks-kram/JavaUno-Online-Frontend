
function genQr(data){
    const typeNumber = 0;
    const errorCorrectionLevel = 'L';
    const qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(data);
    qr.make();
    return qr.createDataURL(8, 32, '');
}

function handleQrScanResult(result){
    console.debug(result);

}