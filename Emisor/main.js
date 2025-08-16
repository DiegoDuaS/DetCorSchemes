import { Socket } from 'net';
import { generarCodigoHamming } from '../Hamming/emisor_hamming.js';
import { binarioABytes, fletcher16, aBinario } from '../Fletcher_Crc/emisor_fletcher.js';
import readline from 'readline';

const HOST = 'localhost'; 
const PORT = 5000;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function aplicarRuido(trama, probabilidadError) {
  let tramaRuidosa = '';

  for (let bit of trama) {
    if (Math.random() < probabilidadError) {
      tramaRuidosa += bit === '0' ? '1' : '0';
    } else {
      tramaRuidosa += bit;
    }
  }

  return tramaRuidosa;
}

// Preguntar mensaje al usuario
rl.question('Ingrese el mensaje a enviar: ', (mensaje) => {

  // Convertir mensaje a binario ASCII
  const trama = stringToBinary(mensaje);

  // Preguntar algoritmo a usar
  rl.question('Seleccione algoritmo (1 = Hamming, 2 = Fletcher-16): ', (opcion) => {
    let tramaFinal = '';

    if(opcion === '1') {
      const resultadoHamming = generarCodigoHamming(trama);
      tramaFinal = resultadoHamming.codigo;
      tramaFinal = aplicarRuido(tramaFinal, 0.01);
      console.log('Trama con Hamming:', tramaFinal);
    } else if(opcion === '2') {
      // Fletcher-16
      const bytes = binarioABytes(trama);
      const checksum = fletcher16(bytes);
      const checksumBin = aBinario(checksum, 16);
      tramaFinal = trama + checksumBin;
      tramaFinal = aplicarRuido(tramaFinal, 0.01);
      console.log('Trama con Fletcher-16:', tramaFinal);
    } else {
      console.log('Opción no válida');
      rl.close(); 
      return;
    }

    // Conectar y enviar al servidor
    const client = new Socket();
    client.connect(PORT, HOST, () => {
      console.log('Conectado al servidor Python');
      client.write(tramaFinal);
      console.log('Trama enviada:', tramaFinal);
      client.end();
      rl.close();
    });

    client.on('error', (err) => {
      console.error('Error en conexión:', err.message);
      rl.close();
    });

  });

});

// Función para convertir string a binario ASCII
function stringToBinary(str) {
  return str.split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

