import sys
import rds_config
import pymysql
import hashlib
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
        cur.execute('SELECT contraseña, tipo_identificacion, identificacion, nombre_completo, descuento, direccion FROM Comprador WHERE correo=%s AND estado = "Activo";', event['email'])
        if(cur.rowcount > 0):
            row = cur.fetchone()
            if(computeMD5hash(row[0]) == event['pass']):
                if (row[4]):
                    response = {"response":"comprador","nombre":row[3],"tipoIdentificacion":row[1],"identificacion":row[2], "descuento":True, "direccion": row[5]}
                    conn.commit()
                    return response
                else:
                    response = {"response":"comprador","nombre":row[3],"tipoIdentificacion":row[1],"identificacion":row[2], "descuento":False, "direccion": row[5]}
                    conn.commit()
                    return response
        cur.execute('SELECT contraseña, tipo_identificacion, identificacion, nombre_completo FROM Vendedor WHERE correo=%s;', event['email'])
        if(cur.rowcount > 0):
            row = cur.fetchone()
            if(computeMD5hash(row[0]) == event['pass']):
                response = {"response":"vendedor","nombre":row[3],"tipoIdentificacion":row[1],"identificacion":row[2]}
                conn.commit()
                return response
        response = {"response":"Fail"}
        conn.commit()
    return response

def computeMD5hash(my_string):
    m = hashlib.md5()
    m.update(my_string.encode('utf-8'))
    return m.hexdigest()
