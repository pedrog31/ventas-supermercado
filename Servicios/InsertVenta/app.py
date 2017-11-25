import sys
import rds_config
import pymysql
#rds settings
rds_host  = "compumovilinstance.crbgpj4dbvxi.us-east-2.rds.amazonaws.com"
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

try:
    conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
except:
    sys.exit()

def handler(event, context):
    with conn.cursor() as cur:
        cur.execute('USE ventas_supermercado2;')
        porcentaje = int(int(event['precio_productos'])*0.05)
        if (porcentaje > 5000):
            precio_domicilio = porcentaje
        else:
            precio_domicilio = 5000
        if ('numeroCuenta' in event):
            cur.execute('SELECT saldo FROM Banco WHERE numeroCuenta = %s AND fechaVencimiento = %s;', (event['numeroCuenta'], event['fechaVencimiento']))
            if(cur.rowcount > 0):
                row = cur.fetchone()
                saldo = row[0]
                precioTotal = int(event['precio_productos'])
                if ('domicilio' in event):
                    precioTotal = precioTotal + precio_domicilio
                precioTotal = precioTotal - int(event['valor_descuento'])
                if (saldo < precioTotal):
                    response = {"error":"Saldo insuficiente"}
                    conn.commit()
                    return response
            else:
                response = {"error":"No existe una cuenta con dichos datos"}
                conn.commit()
                return response
        errores = []
        countError = 0
        for producto in event['productos']:
            cur.execute('SELECT stock, nombre FROM Producto WHERE sku = %s;', producto['sku'])
            row = cur.fetchone()
            if (producto['cantidad'] > row[0]):
                countError = countError + 1
                errores.append("error Está solicitando una cantidad de " + row[1] + " mayor que la existente")
        if (countError > 0):
            conn.commit()
            return errores
        if ('numeroCuenta' in event):
            nuevoSaldo = saldo - precioTotal
            cur.execute('UPDATE Banco SET saldo = %s WHERE numeroCuenta = %s;', (nuevoSaldo, event['numeroCuenta']))
            cur.execute('INSERT INTO Transacciones (Comprador_tipo_identificacion, Comprador_identificacion, tipo, valor, banco_numeroCuenta, fecha) VALUES (%s, %s, 0, %s, %s, %s);', (event['Comprador_tipo_identificacion'], event['Comprador_identificacion'], precioTotal, event['numeroCuenta'], event['fecha']))
            cur.execute('INSERT INTO Venta (Comprador_tipo_identificacion, Comprador_identificacion, precio_productos, fecha, valor_descuento, numeroCuenta, domicilio) VALUES (%s, %s, %s, %s, %s, %s, "false");', (event['Comprador_tipo_identificacion'], event['Comprador_identificacion'], int(event['precio_productos']), event['fecha'], int(event['valor_descuento']), event['numeroCuenta']))
        else:
            cur.execute('INSERT INTO Venta (Comprador_tipo_identificacion, Comprador_identificacion, precio_productos, fecha, valor_descuento, numeroCuenta, domicilio) VALUES (%s, %s, %s, %s, %s, "false", "false");', (event['Comprador_tipo_identificacion'], event['Comprador_identificacion'], int(event['precio_productos']), event['fecha'], int(event['valor_descuento'])))
        cur.execute('SELECT LAST_INSERT_ID();')
        idVenta = cur.fetchone()[0]
        if (event['valor_descuento'] != 0):
            cur.execute('UPDATE Comprador SET descuento = null WHERE tipo_identificacion = %s AND identificacion = %s;', (event['Comprador_tipo_identificacion'], event['Comprador_identificacion']))
        for producto in event['productos']:
            cur.execute('INSERT INTO Productos_X_Venta (Compra_idCompra, Producto_sku, cantidad) VALUES (%s, %s, %s);', (idVenta, producto['sku'], producto['cantidad']))
            cur.execute('SELECT stock FROM Producto WHERE sku = %s;', producto['sku'])
            cantidadActual = cur.fetchone()[0]
            cantidadFinal = cantidadActual-int(producto['cantidad'])
            cur.execute('UPDATE Producto SET stock = %s WHERE sku = %s;',(cantidadFinal, producto['sku']))
        if ('domicilio' in event):
            cur.execute('UPDATE Venta SET domicilio = "true" WHERE idCompra = %s;', idVenta)
            cur.execute('INSERT INTO Domicilio (Comprador_tipo_identificacion, Comprador_identificacion, precioDomicilio, estado, justificacion, Compra_idCompra) VALUES (%s, %s, %s, "Enviado", null, %s);', (event['Comprador_tipo_identificacion'], event['Comprador_identificacion'], precio_domicilio, idVenta))
        conn.commit()
        response = {"response":"Ok","message":"Venta registrada con éxito"}
    return response
