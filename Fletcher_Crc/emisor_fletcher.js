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


