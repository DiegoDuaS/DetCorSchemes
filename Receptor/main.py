# receptor.py
import socket
import sys
import os

# Agregar la carpeta padre al path
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(parent_dir)

from Hamming.receptor_hamming import verificar_y_corregir_hamming
from Fletcher_Crc.receptor_fletcher import verificar_fletcher

HOST = 'localhost'
PORT = 5000

def binary_to_string(bin_str):
    chars = [bin_str[i:i+8] for i in range(0, len(bin_str), 8)]
    return ''.join([chr(int(c, 2)) for c in chars])

# Elegir algoritmo
opcion = input("Seleccione algoritmo para verificar (1 = Hamming, 2 = Fletcher-16): ")

if opcion not in ['1', '2']:
    print("Opción no válida. Saliendo...")
    exit()

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()
    print('Servidor escuchando en', PORT)
    conn, addr = s.accept()
    with conn:
        print('Conectado por', addr)
        data = b''
        while True:
            packet = conn.recv(1024)
            if not packet:
                break
            data += packet
        trama_binaria = data.decode()  # recibimos la trama en binario ASCII como string
        print('Trama recibida:', trama_binaria)

        # Dependiendo del algoritmo elegido
        if opcion == '1':  # Hamming
            mensaje = verificar_y_corregir_hamming(trama_binaria)
            if mensaje is None:
                print("Error: no se pudo corregir el mensaje Hamming.")
            else:
                print("Mensaje decodificado (Hamming):", binary_to_string(mensaje))
        elif opcion == '2':  # Fletcher-16
            mensaje_bin = verificar_fletcher(trama_binaria)
            if mensaje_bin is None:
                print("Error: el mensaje Fletcher-16 tiene errores.")
            else:
                mensaje = binary_to_string(mensaje_bin)
                print("Mensaje decodificado (Fletcher-16):", mensaje)
