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
    attr = ["sku","nombre", "precio","url_foto", "stock"]
    productos = []
    with conn.cursor() as cur:
        cur.execute('USE ventas_supermercado2;')
        cur.execute('SELECT * FROM Producto;')
        for row in cur:
            producto = {attr[0]:row[1],
                        attr[1]:row[0],
                        attr[2]:row[2],
                        attr[3]:row[3],
                        attr[4]:row[4]}
            productos.append(producto)
        conn.commit()
    return productos
