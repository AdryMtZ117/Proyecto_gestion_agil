-- Usamos la base de datos que definimos en Docker
USE appdb;
CREATE TABLE IF NOT EXISTS Empleado (
    id_empleado INT PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasenia VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellidoP VARCHAR(100) NOT NULL,
    apellidoM VARCHAR(100),
    telefono VARCHAR(15),
    correo_electronico VARCHAR(100),
    rol VARCHAR(20) DEFAULT 'empleado', 
    activo BOOLEAN DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: Maestros
CREATE TABLE IF NOT EXISTS Maestros (
    id_maestro INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    apellidoP VARCHAR(100) NOT NULL,
    apellidoM VARCHAR(100),
    telefono VARCHAR(15)
);

-- TABLA: Clases
CREATE TABLE IF NOT EXISTS Clases (
    id_clase INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    horario VARCHAR(100),
    capacidad_maxima INT,
    nivel VARCHAR(50),
    id_maestro INT,
    activo BOOLEAN DEFAULT 1,
    FOREIGN KEY (id_maestro) REFERENCES Maestros(id_maestro)
);

-- TABLA: Membresia
CREATE TABLE IF NOT EXISTS Membresia (
    id_membresia INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    precio FLOAT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    duracion INT NOT NULL,
    id_clase INT,
    activo BOOLEAN DEFAULT 1,
    FOREIGN KEY (id_clase) REFERENCES Clases(id_clase)
);

-- TABLA: Cliente
CREATE TABLE IF NOT EXISTS Cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellidoP VARCHAR(100) NOT NULL,
    apellidoM VARCHAR(100),
    telefono VARCHAR(15),
    correo_electronico VARCHAR(100),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_membresia INT,
    uid_huella VARCHAR(50) UNIQUE,
    estado VARCHAR(20) DEFAULT 'activo',
    FOREIGN KEY (id_membresia) REFERENCES Membresia(id_membresia)
);

-- TABLA: Historial_pago
CREATE TABLE IF NOT EXISTS Historial_pago (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    id_membresia INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    monto_pagado FLOAT NOT NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_empleado_registro INT,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente),
    FOREIGN KEY (id_membresia) REFERENCES Membresia(id_membresia),
    FOREIGN KEY (id_empleado_registro) REFERENCES Empleado(id_empleado)
);

-- TABLA: Asistencia
CREATE TABLE IF NOT EXISTS Asistencia (
    id_asistencia INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    id_membresia INT NOT NULL,
    id_clase INT NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    alerta_mostrada VARCHAR(100), -- 'ninguna', 'proximo_vencimiento', 'pago_vencido'
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente),
    FOREIGN KEY (id_membresia) REFERENCES Membresia(id_membresia),
    FOREIGN KEY (id_clase) REFERENCES Clases(id_clase)
);

-- TABLA: Historial_gastos
CREATE TABLE IF NOT EXISTS Historial_gastos (
    id_gasto INT PRIMARY KEY AUTO_INCREMENT,
    concepto VARCHAR(255) NOT NULL,
    factura VARCHAR(255),
    monto_pagado FLOAT NOT NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_empleado_registro INT,
    FOREIGN KEY (id_empleado_registro) REFERENCES Empleado(id_empleado)
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================
-- Optimiza búsquedas de clientes por su número de tarjeta
CREATE INDEX idx_cliente_huella ON Cliente(uid_huella);
--  Acelera consultas filtradas por fecha/hora en la tabla de asistencias
CREATE INDEX idx_asistencia_fecha ON Asistencia(fecha_hora);
CREATE INDEX idx_historial_pago_fechas ON Historial_pago(fecha_inicio, fecha_fin);
CREATE INDEX idx_historial_gastos_fecha ON Historial_gastos(fecha_pago);

-- ============================================
-- DATOS INICIALES
-- ============================================

INSERT INTO Empleado (usuario, contrasenia, nombre, apellidoP, rol)
VALUES ('admin', 'admin', 'Administrador', 'Master', 'admin');

SELECT * FROM Empleado;