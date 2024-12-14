const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src', 'inference', 'median-model.onnx');
const destDir = path.join(__dirname, 'dist', 'inference');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Copy file
fs.copyFileSync(src, path.join(destDir, 'median-model.onnx'));
console.log('ONNX model copied successfully!');
