function calcularBitsParidad(m) {
    let r = 1;
    // Buscamos cuántos bits de paridad hacen que se cumpla la fórmula
    while (m + r + 1 > Math.pow(2, r)) {
        r++;
    }
    return r;
}

function generarCodigoHamming(bitsDatos) {
    let m = bitsDatos.length;
    let r = calcularBitsParidad(m);
    let n = m + r;

    let codigo = new Array(n + 1).fill(0);
    let j = 0;

    // Colocar bits de datos en posiciones que no son potencias de 2
    for (let i = 1; i <= n; i++) {
        if (Math.log2(i) % 1 !== 0) {
            codigo[i] = parseInt(bitsDatos[j]);
            j++;
        } else {
            codigo[i] = 0; // bits de paridad por calcular
        }
    }

    // Calcular bits de paridad
    for (let i = 0; i < r; i++) {
        let pos = Math.pow(2, i);
        let suma = 0;
        for (let k = 1; k <= n; k++) {
            if ((k & pos) !== 0) {
                suma += codigo[k];
            }
        }
        codigo[pos] = suma % 2;
    }

    // Calcular bit de paridad global
    let sumaTotal = 0;
    for (let i = 1; i <= n; i++) {
        sumaTotal += codigo[i];
    }
    let bitGlobal = sumaTotal % 2; // 0 si suma par, 1 si suma impar

    // Añadir bit de paridad global al final
    codigo.push(bitGlobal);

    return {
        m: m,
        r: r,
        n: n,
        codigo: codigo.slice(1).join(''), // excluye índice 0
        bitGlobal: bitGlobal
    };
}

// Leer bits desde argumento de la terminal
const bitsDatos = process.argv[2];

if (!bitsDatos || !/^[01]+$/.test(bitsDatos)) {
    console.log("Uso: node emisor_emisor.js <bits_de_datos>");
    console.log("Ejemplo: node emisor_hamming.js 1011");
    process.exit(1);
}

let resultado = generarCodigoHamming(bitsDatos);
console.log(`Bits de datos: ${bitsDatos}`);
console.log(`Bits de paridad (r): ${resultado.r}`);
console.log(`Bit de paridad global: ${resultado.bitGlobal}`);
console.log(`Código Hamming extendido: ${resultado.codigo}`);