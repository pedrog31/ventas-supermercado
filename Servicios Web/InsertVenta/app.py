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
        cur.execute('USE ventas_supermercado;')
        errores = []
        countError = 0
        for producto in event['productos']:
            cur.execute('SELECT stock, nombre FROM Producto WHERE sku = %s;', producto['sku'])
            row = cur.fetchone()
            if (producto['cantidad'] > row[0]):
                countError = countError + 1
                errores.append("Está solicitando una cantidad de " + row[1] + " mayor que la existente")
        if (countError > 0):
            return errores
        cur.execute('INSERT INTO Venta (Comprador_tipo_identificacion, Comprador_identificacion, precio_productos, fecha, precio_domicilio, valor_descuento) VALUES (%s, %s, %s, %s, %s, %s);', (event['Comprador_tipo_identificacion'], event['Comprador_identificacion'], int(event['precio_productos']), event['fecha'], int(event['precio_domicilio']), int(event['valor_descuento'])))
        cur.execute('SELECT LAST_INSERT_ID();')
        idVenta = cur.fetchone()[0]
        if (event['valor_descuento'] != 0):
            cur.execute('UPDATE Comprador SET descuento = null WHERE tipo_identificacion = %s AND identificacion = %s', (event['Comprador_tipo_identificacion'], event['Comprador_identificacion']))
        for producto in event['productos']:
            cur.execute('INSERT INTO Productos_X_Venta (Compra_idCompra, Producto_sku, cantidad) VALUES (%s, %s, %s);', (idVenta, producto['sku'], producto['cantidad']))
            cur.execute('SELECT stock FROM Producto WHERE sku = %s;', producto['sku'])
            cantidadActual = cur.fetchone()[0]
            cantidadFinal = cantidadActual-int(producto['cantidad'])
            cur.execute('UPDATE Producto SET stock = %s WHERE sku = %s;',(cantidadFinal, producto['sku']))
        conn.commit()
    response = {"response":"Ok","message":"Venta registrada con éxito"}
    return response