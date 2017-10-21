import sys
import rds_config
import pymysql
import random
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
        i = 1
        while (i > 0):
            codigo = ''.join(random.choice('0123456789ABCDEF') for i in range(8))
            cur.execute('SELECT identificacion FROM Comprador WHERE descuento = %s', codigo)
            if(cur.rowcount!=0):
                continue
            cur.execute('UPDATE Comprador SET descuento = %s WHERE tipo_identificacion = %s AND identificacion = %s', (codigo, event['tipo_identificacion'], event['identificacion']))
            break
    conn.commit()
    response = {"response":"Ok","codigo":codigo}
    return response