-- Active: 1762640731795@@ep-gentle-frog-adm0pw2p-pooler.c-2.us-east-1.aws.neon.tech@5432@neondb
#usuario
-- Tabla para tipos de usuarios 
CREATE TABLE tipo_user (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, 
    descripcion TEXT  
);

-- Tabla de usuarios 
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_tipo_user INT NOT NULL,  
    status INT NOT NULL DEFAULT 1,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tipo_user FOREIGN KEY (id_tipo_user) REFERENCES tipo_user(id) 
);

drop table usuario

-- Tabla de sesiones (para manejo de autenticación)
CREATE TABLE sesion (
    id_sesion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    token_acceso TEXT NOT NULL,
    token_refresh TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE
);




CREATE TABLE certifiacion_user (
    id,
    id_user,
    id_servicio,
    fecha_validacion,
    fecha_vencimiento,
)


create table oferta_cultivo {
    id,
    id_user,
    id_cultivo,
    cantidad_disponible,
    precio_tonelada,
    fecha_publicacion
}

create table ofeta_logistica{
    id,
    id_user,
    precio_tonelada,
    ubiacion,
    precio_km,
    fecha_publicacion
}

create table compra{
    id_comprador,
    id_oferta_cultivo,
    id_ofeta_logistica,
    cantidad_cultivo,
    precio_cultivo,
    

}