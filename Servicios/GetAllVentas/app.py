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
    attr = ["idCompra", "Comprador_tipo_documento", "Comprador_documento","precio_productos", "fecha", "valor_descuento"]
    ventas = []
    with conn.cursor() as cur:
        cur.execute('USE ventas_supermercado2;')
        cur.execute('SELECT idCompra, Venta.Comprador_tipo_identificacion, Venta.Comprador_identificacion, precio_productos, fecha, valor_descuento FROM Venta JOIN Domicilio WHERE MONTH(fecha) = %s AND domicilio = "true" AND estado = "Recibido" AND Compra_idCompra = idCompra UNION SELECT idCompra, Venta.Comprador_tipo_identificacion, Venta.Comprador_identificacion, precio_productos, fecha, valor_descuento FROM Venta WHERE MONTH(fecha) = %s AND domicilio = "false" ORDER BY idCompra;', (event['mes'], event['mes']))
        for row in cur:
            venta = {attr[0]:row[0],
                    attr[1]:row[1],
                    attr[2]:row[2],
                    attr[3]:row[3],
                    attr[4]:str(row[4]),
                    attr[5]:row[5]}
            ventas.append(venta)
        conn.commit()
    return ventas
