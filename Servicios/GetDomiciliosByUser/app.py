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
    attr = ["idDomicilio", "Comprador_tipo_documento", "Comprador_documento","precio_productos", "fecha", "valor_descuento", "precio_domicilio", "estado", "justificacion"]
    domicilios = []
    with conn.cursor() as cur:
        cur.execute('USE ventas_supermercado2;')
        cur.execute('SELECT idDomicilio, Venta.Comprador_tipo_identificacion, Venta.Comprador_identificacion, precio_productos, fecha, valor_descuento, precioDomicilio, estado, justificacion FROM Venta JOIN Domicilio WHERE idCompra = Compra_idCompra AND Domicilio.Comprador_tipo_identificacion = %s AND Domicilio.Comprador_identificacion = %s;', (event['tipo_identificacion'], event['identificacion']))
        for row in cur:
            domicilio = {attr[0]:row[0],
                    attr[1]:row[1],
                    attr[2]:row[2],
                    attr[3]:row[3],
                    attr[4]:str(row[4]),
                    attr[5]:row[5],
                    attr[6]:row[6],
                    attr[7]:row[7],
                    attr[8]:row[8]}
            domicilios.append(domicilio)
        conn.commit()
    return domicilios
