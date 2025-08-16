export function binarioABytes(binario) {
    const bytes = [];
    for (let i = 0; i < binario.length; i += 8) {
        const byteStr = binario.substring(i, i + 8).padEnd(8, '0');
        bytes.push(parseInt(byteStr, 2));
    }
    return bytes;
}

export function fletcher16(bytes) {
    let sum1 = 0;
    let sum2 = 0;
    const MOD = 255;

    for (let byte of bytes) {
        sum1 = (sum1 + byte) % MOD;
        sum2 = (sum2 + sum1) % MOD;
    }

    return (sum2 << 8) | sum1;
}

export function aBinario(num, bits) {
    return num.toString(2).padStart(bits, '0');
}

// Leer bits desde argumentos de la terminal
const bits = process.argv[2];

if (!bits || !/^[01]+$/.test(bits)) {
    console.log("Uso: node emisor_fletcher.js <mensaje_binario>");
    console.log("Ejemplo: node emisor_fletcher.js 10101100");
    process.exit(1);
}

const bytes = binarioABytes(bits);
const checksum = fletcher16(bytes);
const checksumBin = aBinario(checksum, 16);
const mensajeFinal = bits + checksumBin;

console.log(`Mensaje original:         ${bits}`);
console.log(`Checksum (Fletcher-16):   ${checksumBin}`);
console.log(`Mensaje final transmitido: ${mensajeFinal}`);
