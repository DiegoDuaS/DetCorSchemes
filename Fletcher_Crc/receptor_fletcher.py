def binario_a_bytes(binario):
    bytes_list = []
    for i in range(0, len(binario), 8):
        byte_str = binario[i:i+8].ljust(8, '0')
        bytes_list.append(int(byte_str, 2))
    return bytes_list

def fletcher16(bytes_list):
    sum1 = 0
    sum2 = 0
    MOD = 255

    for byte in bytes_list:
        sum1 = (sum1 + byte) % MOD
        sum2 = (sum2 + sum1) % MOD

    return (sum2 << 8) | sum1

def verificar_fletcher(trama_binaria):
    """
    Recibe la trama binaria completa (datos + checksum Fletcher-16)
    Devuelve:
    - los datos si el checksum coincide
    - None si hay error detectado
    """
    if len(trama_binaria) < 16:
        return None  # demasiado corta

    datos_bin = trama_binaria[:-16]
    checksum_recibido = int(trama_binaria[-16:], 2)

    bytes_datos = binario_a_bytes(datos_bin)
    checksum_calculado = fletcher16(bytes_datos)

    if checksum_recibido == checksum_calculado:
        return datos_bin  # mensaje válido
    else:
        return None  # error detectado

def main():
    recibido = input("Ingrese el mensaje completo (datos + checksum): ").strip()

    if not recibido.isdigit() or any(c not in "01" for c in recibido):
        print("Error: el mensaje debe contener solo 0 y 1.")
        return

    if len(recibido) < 16:
        print("Error: el mensaje es demasiado corto para contener un checksum.")
        return

    datos = recibido[:-16]
    checksum_recibido = recibido[-16:]

    bytes_datos = binario_a_bytes(datos)
    checksum_calculado = fletcher16(bytes_datos)
    checksum_calculado_bin = format(checksum_calculado, '016b')

    print(f"\nMensaje recibido:         {recibido}")
    print(f"Checksum recibido:        {checksum_recibido}")
    print(f"Checksum recalculado:     {checksum_calculado_bin}")

    if checksum_recibido == checksum_calculado_bin:
        print(" No se detectaron errores.")
        print(f"Mensaje original:         {datos}")
    else:
        print(" Se detectaron errores en la transmisión. Mensaje descartado.")

if __name__ == "__main__":
    main()
