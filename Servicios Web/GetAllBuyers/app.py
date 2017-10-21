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
    attr = ["tipo_identificacion","identificacion", "nombre_completo", "descuento"]
    compradores = []
    with conn.cursor() as cur:
        cur.execute('USE ventas_supermercado;')
        cur.execute('SELECT tipo_identificacion, identificacion, nombre_completo, descuento FROM Comprador;')
        for row in cur:
            if (row[3]):
                tieneDescuento = True
            else:
                tieneDescuento = False
            comprador = {attr[0]:row[0],
                        attr[1]:row[1],
                        attr[2]:row[2],
                        attr[3]:tieneDescuento}
            compradores.append(comprador)
            conn.commit()
    return compradores