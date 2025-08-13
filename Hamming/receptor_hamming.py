def detectar_error(codigo):
    n = len(codigo)
    codigo = [int(bit) for bit in codigo]
    codigo.insert(0, None)  # Para que podamos usar índices desde 1 y no desde 0

    # Ahora vamos a calcular cuántos bits de paridad hay según la longitud del código
    r = 0
    while (2 ** r) <= n:
        r += 1

    # Aquí vamos a checar si hay error y en qué posición está
    posicion_error = 0
    for i in range(r):
        pos = 2 ** i
        suma = 0
        # Sumamos los bits que participan en esta paridad (los que tienen el bit 'pos' prendido)
        for k in range(1, n + 1):
            if (k & pos) != 0:
                suma += codigo[k]
        # Si la suma no es par, entonces hay error en ese bit de paridad
        if suma % 2 != 0:
            posicion_error += pos  # Acumulamos la posición del error

    return posicion_error, codigo, r


def extraer_datos(codigo):
    """Sacamos los bits de datos quitando las posiciones de los bits de paridad"""
    datos = []
    for i in range(1, len(codigo)):
        # Si la posición NO es potencia de 2, entonces es dato, lo agregamos
        if (i & (i - 1)) != 0:
            datos.append(str(codigo[i]))
    return "".join(datos)


def main():
    recibido = input("Ingrese el mensaje Hamming recibido: ").strip()

    # Validamos que solo tenga 0 y 1
    if not recibido.isdigit() or any(c not in "01" for c in recibido):
        print("Error: el mensaje debe contener solo 0 y 1.")
        return

    pos_error, codigo, r = detectar_error(recibido)

    print(f"\nMensaje recibido (con paridad): {recibido}")

    if pos_error == 0:
        print("No se detectaron errores.")
        mensaje_limpio = extraer_datos(codigo)
        print(f"Mensaje original (sin paridad): {mensaje_limpio}")
        return

    # Saber si el error fue en un bit de paridad o en uno de datos
    tipo_bit = "paridad" if (pos_error & (pos_error - 1)) == 0 else "dato"
    print(f"!!!! Error detectado en la posición {pos_error} (bit de {tipo_bit}).")

    # Corregimos el bit con error (cambiamos 0 a 1 o 1 a 0)
    codigo[pos_error] = 1 - codigo[pos_error]
    corregido = "".join(str(bit) for bit in codigo[1:])
    print(f"Mensaje corregido (con paridad): {corregido}")

    mensaje_limpio = extraer_datos(codigo)
    print(f"Mensaje original (sin paridad): {mensaje_limpio}")


if __name__ == "__main__":
    main()
