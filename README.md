# DetCorSchemes

Este laboratorio implementa un sistema de transmisión de mensajes entre un emisor (JavaScript) y un receptor (Python) utilizando sockets TCP.
Durante la transmisión, el mensaje es convertido a binario y protegido con dos métodos diferentes: Hamming (SECDED) y Fletcher-16, con el fin de analizar cómo se detectan y corrigen errores de transmisión.

## Métodos Implementados

### Códigos de Hamming
- Se agregan bits de paridad en posiciones específicas para detectar y corregir un error de un solo bit en la transmisión.
- En el receptor (Python), se reconstruye la palabra binaria y, si se detecta un error, se corrige automáticamente.

### Fletcher-16
- Calcula un checksum de 16 bits a partir del mensaje original.
- Permite detectar errores en la transmisión, pero no corregirlos.
- En el receptor, si el checksum no coincide, se descarta el mensaje como corrupto.

## Arquitectura
### Emisor (JavaScript → main.js)
- Toma un mensaje de texto.
- Lo convierte a binario.
- Aplica el algoritmo de control de errores (Hamming o Fletcher).
- Aplica ruido.
- Abre un socket TCP y envía los datos al receptor.

### Receptor (Python → main.py)
- Escucha en un puerto específico con sockets TCP.
- Recibe los datos binarios enviados por el emisor.
- Aplica el algoritmo correspondiente para verificar (y en el caso de Hamming, corregir) el mensaje.
- Reconstruye el texto original y lo muestra en consola.

## Requisitos
- Node.js para ejecutar el emisor en JavaScript.
- Python 3.x para ejecutar el receptor.
- Librerías estándar de socket (Python) y net (Node.js).

## Ejecución
1. Abrir primero el receptor en Python:
```
python3 main.py
```
Aqui te pedirá con que algoritmo escuchará.
Esto iniciará un servidor en el puerto definido (ej. 5000).

2. Ejecutar el emisor en JavaScript:
```
node main.js
```
Aquí te preguntará que algoritmo debe de usar.
El programa esta hecho para enviar 1000 mensajes de prueba.

3. Verificar resultados en el receptor:

En este punto, el programa te eneseñara cuantos de los mensajes recibidos fueron recibidos correctamente (independientemente si fueron corregidos o no) y cuantos no pudieron mostrarse debido a el ruido implementado. 
