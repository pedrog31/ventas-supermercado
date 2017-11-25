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
        cur.execute('SELECT Compra_idCompra, precioDomicilio FROM Domicilio WHERE idDomicilio = %s;', event['idDomicilio'])
        row = cur.fetchone()
        idCompra = row[0]
        precioDomicilio = int(row[1])
        cur.execute('UPDATE Domicilio SET justificacion = %s, estado = "Rechazado" WHERE idDomicilio = %s;', (event['justificacion'], event['idDomicilio']))
        cur.execute('SELECT precio_productos, valor_descuento, numeroCuenta, Comprador_tipo_identificacion, Comprador_identificacion FROM Venta WHERE idCompra = %s;', idCompra)
        row = cur.fetchone()
        precioProductos = int(row[0])
        valorDescuento = int(row[1])
        numeroCuenta = row[2]
        tipoID = row[3]
        ID = row[4]
        valorTotal = precioProductos + precioDomicilio - valorDescuento
        if (numeroCuenta != "false"):
            cur.execute('UPDATE Banco SET saldo = saldo + %s WHERE numeroCuenta = %s;', (valorTotal, numeroCuenta))
            cur.execute('INSERT INTO Transacciones (Comprador_tipo_identificacion, Comprador_identificacion, tipo, valor, banco_numeroCuenta, fecha) VALUES (%s, %s, 1, %s, %s, %s);', (tipoID, ID, valorTotal, numeroCuenta, event['fecha']))
        cur.execute('SELECT cantidad, sku FROM Productos_X_Venta JOIN Producto WHERE Compra_idCompra = %s AND sku = Producto_sku;', idCompra)
        for row in cur:
            cur.execute('UPDATE Producto SET stock = stock + %s WHERE sku = %s', (int(row[0]), row[1]))
        conn.commit()
        if (valorDescuento == 0):
            response = {"message":"El rechazo del domicilio fue exitoso, fueron devueltos " + str(valorTotal) +" pesos", "descuento":False}
        else:
            response = {"message":"El rechazo del domicilio fue exitoso, fueron devueltos " + str(valorTotal) +" pesos", "descuento":True}
    return response
