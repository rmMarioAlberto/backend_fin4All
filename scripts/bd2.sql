-- Active: 1762640731795@@ep-gentle-frog-adm0pw2p-pooler.c-2.us-east-1.aws.neon.tech@5432@neondb
#usuario
-- Actualizaciones a la tabla oferta_logistica
ALTER TABLE oferta_logistica 
DROP COLUMN precio_tonelada,
DROP COLUMN ubicacion,
DROP COLUMN precio_km;

ALTER TABLE oferta_logistica 
ADD COLUMN id_oferta_cultivo INT NOT NULL,
ADD COLUMN id_distribuidor INT,
ADD COLUMN origen VARCHAR(255) NOT NULL,
ADD COLUMN destino VARCHAR(255) NOT NULL,
ADD COLUMN distancia_km DECIMAL(10,2) NOT NULL,
ADD COLUMN costo_total DECIMAL(10,2) NOT NULL,
ADD COLUMN estado VARCHAR(50) DEFAULT 'disponible',
ADD CONSTRAINT fk_oferta_logistica_oferta_cultivo FOREIGN KEY (id_oferta_cultivo) REFERENCES oferta_cultivo(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_oferta_logistica_distribuidor FOREIGN KEY (id_distribuidor) REFERENCES usuario(id) ON DELETE SET NULL; 
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

-- Tabla de cultivos
CREATE TABLE cultivo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);


CREATE TABLE certificacion_user (
    id SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    id_servicio INT NOT NULL,
    fecha_validacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento TIMESTAMP NOT NULL,
    CONSTRAINT fk_certificacion_user FOREIGN KEY (id_user) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE oferta_cultivo (
    id SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    id_cultivo INT NOT NULL,
    entidad_federativa VARCHAR(100) NOT NULL,
    cantidad_disponible DECIMAL(10,2) NOT NULL,
    precio_tonelada DECIMAL(10,2) NOT NULL,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_oferta_cultivo_user FOREIGN KEY (id_user) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE oferta_logistica (
    id SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    precio_tonelada DECIMAL(10,2) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    precio_km DECIMAL(10,2) NOT NULL,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_oferta_logistica_user FOREIGN KEY (id_user) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE compra (
    id SERIAL PRIMARY KEY,
    id_comprador INT NOT NULL,
    id_oferta_cultivo INT NOT NULL,
    id_oferta_logistica INT,
    cantidad_cultivo DECIMAL(10,2) NOT NULL,
    precio_total DECIMAL(10,2) NOT NULL,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'pendiente',
    CONSTRAINT fk_compra_comprador FOREIGN KEY (id_comprador) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_compra_oferta_cultivo FOREIGN KEY (id_oferta_cultivo) REFERENCES oferta_cultivo(id) ON DELETE CASCADE,
    CONSTRAINT fk_compra_oferta_logistica FOREIGN KEY (id_oferta_logistica) REFERENCES oferta_logistica(id) ON DELETE SET NULL
);