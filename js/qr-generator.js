function generateQRCode(dataArray) {
  const qr = new QRious({
    element: document.getElementById('qrCanvas'),
    size: 200,
    value: dataArray.join('\n')
  });
}
