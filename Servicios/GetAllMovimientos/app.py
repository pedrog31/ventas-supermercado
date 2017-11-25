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
    attr = ["id", "tipo", "valor","numeroCuenta", "fecha"]
    movimientos = []
    with conn.cursor() as cur:
        cur.execute('USE ventas_supermercado2;')
        cur.execute('SELECT idTran, tipo, valor, banco_numeroCuenta, fecha FROM Transacciones WHERE Comprador_tipo_identificacion = %s AND Comprador_identificacion = %s;', (event['tipo_identificacion'], event['identificacion']))
        for row in cur:
            if (row[1] == 0):
                valor = "-" + str(row[2])
            else:
                valor = "+" + str(row[2])
            movimiento = {attr[0]:row[0],
                    attr[1]:row[1],
                    attr[2]:valor,
                    attr[3]:row[3],
                    attr[4]:str(row[4])}
            movimientos.append(movimiento)
        conn.commit()
    return movimientos
