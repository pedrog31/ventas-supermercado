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
        nombreCompleto = event['nombres']
        cur.execute('USE ventas_supermercado2;')
        cur.execute('SELECT nombre_completo, estado FROM Comprador WHERE tipo_identificacion = %s AND identificacion = %s;', (event['tipo_documento'], event['documento']))
        if(cur.rowcount!=0):
            row = cur.fetchone()
            if (row[1] == "Eliminado"):
                cur.execute('UPDATE Comprador SET estado = "Activo", correo = %s, contraseña = %s, nombre_completo = %s, direccion = %s, descuento = null WHERE tipo_identificacion = %s AND identificacion = %s;', (event['correo'], event['contraseña'], nombreCompleto, event['direccion'], event['tipo_documento'], event['documento']))
                conn.commit()
                response = {"response":"Ok","message":"Usuario creado con éxito"}
                return response
            else:
                response = {"response":"Fail","message":"El usuario " + row[0] + " ya se encuentra registrado."}
                conn.commit()
                return response
        cur.execute('SELECT nombre_completo FROM Comprador WHERE correo = %s;', event['correo'])
        if(cur.rowcount!=0):
            row = cur.fetchone()
            response = {"response":"Fail","message":"El correo " + event['correo'] + " ya se encuentra en uso."}
            conn.commit()
            return response
        cur.execute('INSERT INTO Comprador (tipo_identificacion, identificacion, correo, contraseña, nombre_completo, direccion, descuento, estado) VALUES (%s, %s, %s, %s, %s, %s, null, "Activo");', (event['tipo_documento'], event['documento'], event['correo'], event['contraseña'], nombreCompleto, event['direccion']))
        conn.commit()
    response = {"response":"Ok","message":"Usuario creado con éxito"}
    return response
