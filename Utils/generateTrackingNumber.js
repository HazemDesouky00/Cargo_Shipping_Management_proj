function generateTrackingNumber() {
    const random = Math.floor(100000 + Math.random() * 900000);
    return "CE" + random;  // CE = CargoEase
}

module.exports = generateTrackingNumber;
