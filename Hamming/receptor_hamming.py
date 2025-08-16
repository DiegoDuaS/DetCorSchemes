def detectar_error_extendido(codigo):
    n = len(codigo) - 1  # excluimos el bit global
    codigo = [None] + [int(b) for b in codigo]  # indices desde 1
    r = 0
    while (2 ** r) <= n:
        r += 1

    posicion_error = 0
    for i in range(r):
        pos = 2 ** i
        suma = 0
        for k in range(1, n + 1):
            if (k & pos) != 0:
                suma += codigo[k]
        if suma % 2 != 0:
            posicion_error += pos

    # Paridad global recibida
    bit_global = codigo[-1]
    suma_total = sum(codigo[1:n+1]) % 2  # suma solo bits de Hamming

    if posicion_error == 0 and suma_total == bit_global:
        estado = "Sin errores"
    elif posicion_error != 0 and suma_total != bit_global:
        estado = f"Un error en la posición {posicion_error}"
    elif posicion_error != 0 and suma_total == bit_global:
        estado = "Detectados 2 errores o más (no corregibles)"
    else:
        estado = "Situación inesperada"

    return estado, codigo, r



def extraer_datos(codigo):
    """Sacamos los bits de datos quitando las posiciones de los bits de paridad y el global"""
    datos = []
    for i in range(1, len(codigo)-1):
        # Si la posición NO es potencia de 2, entonces es dato
        if (i & (i - 1)) != 0:
            datos.append(str(codigo[i]))
    return "".join(datos)


def main():
    recibido = input("Ingrese el mensaje Hamming recibido: ").strip()

    # Validamos que solo tenga 0 y 1
    if not recibido.isdigit() or any(c not in "01" for c in recibido):
        print("Error: el mensaje debe contener solo 0 y 1.")
        return

    estado, codigo, r = detectar_error_extendido(recibido)

    print(f"\nMensaje recibido (con paridad): {recibido}")
    print(estado)

    if "Un error" in estado:
        # Extraer posición del error del mensaje
        pos_error = int(estado.split()[-1])
        tipo_bit = "paridad" if (pos_error & (pos_error - 1)) == 0 else "dato"
        print(f"!!!! Corrigiendo bit en posición {pos_error} (bit de {tipo_bit}).")
        # Corregimos solo el primer error
        codigo[pos_error] = 1 - codigo[pos_error]
        corregido = "".join(str(bit) for bit in codigo[1:])
        print(f"Mensaje corregido (con paridad): {corregido}")
        mensaje_limpio = extraer_datos(codigo)
        print(f"Mensaje original (sin paridad): {mensaje_limpio}")

    elif "2 errores" in estado:
        print("No se puede corregir el mensaje debido a que hay 2 errores detectados.")

    else:  # Sin errores
        mensaje_limpio = extraer_datos(codigo)
        print(f"Mensaje original (sin paridad): {mensaje_limpio}")


if __name__ == "__main__":
    main()
