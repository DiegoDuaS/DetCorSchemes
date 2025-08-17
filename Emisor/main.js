import { Socket } from 'net'; 
import { generarCodigoHamming } from '../Hamming/emisor_hamming.js';
import { binarioABytes, fletcher16, aBinario } from '../Fletcher_Crc/emisor_fletcher.js';

// Configuración
const HOST = 'localhost'; 
const PORT = 5000;
const MENSAJE = "planet";   // Mensaje fijo
const OPCION = '1';             // "1" = Hamming, "2" = Fletcher-16
const NUM_ENVIOS = 1000;        // Número de veces a enviar
const PROB_ERROR = 0.01;        // Probabilidad de ruido por bit
const DELAY_MS = 50;            // Pausa entre mensajes (milisegundos)

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

function stringToBinary(str) {
  return str.split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

function prepararTrama(mensaje, opcion) {
  const trama = stringToBinary(mensaje);
  let tramaFinal = '';

  if(opcion === '1') {
    const resultadoHamming = generarCodigoHamming(trama);
    tramaFinal = resultadoHamming.codigo;
    tramaFinal = aplicarRuido(tramaFinal, PROB_ERROR);
    console.log('Trama con Hamming:', tramaFinal);
  } else if(opcion === '2') {
    const bytes = binarioABytes(trama);
    const checksum = fletcher16(bytes);
    const checksumBin = aBinario(checksum, 16);
    tramaFinal = trama + checksumBin;
    tramaFinal = aplicarRuido(tramaFinal, PROB_ERROR);
    console.log('Trama con Fletcher-16:', tramaFinal);
  } else {
    console.log('Opción no válida');
    return null;
  }

  return tramaFinal;
}

// Función auxiliar: delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function enviarMensajes() {
  for (let i = 1; i <= NUM_ENVIOS; i++) {
    const tramaFinal = prepararTrama(MENSAJE, OPCION);
    if (!tramaFinal) break;

    await new Promise((resolve) => {
      const client = new Socket();
      client.connect(PORT, HOST, () => {
        console.log(`\n[${i}] Conectado al servidor Python`);
        client.write(tramaFinal);
        console.log(`[${i}] Trama enviada:`, tramaFinal);
        client.end();
      });

      client.on('end', resolve);
      client.on('error', (err) => {
        console.error(`[${i}] Error en conexión:`, err.message);
        resolve();
      });
    });

    // Pausa entre mensajes
    await sleep(DELAY_MS);
  }
}

enviarMensajes();
