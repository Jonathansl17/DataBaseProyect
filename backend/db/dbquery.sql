-- Crear la base de datos y usarla
-- CREATE DATABASE fastfitness;
-- USE fastfitness;

--USE master
--DROP DATABASE fastfitness


--Regla de restriccion para la cedula, para que el formato sea exactamente 9 numeros sin signos ni letras
CREATE RULE ReglaCedulaNumerica AS
    @cedula LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]';
GO

--Creamos el tipo de dato cedulaRestringida
EXEC	sp_addtype	CedulaRestringida,	'CHAR(9)',	'NOT NULL'
GO

--Asociamos la regla ReglaCedulaNumerica con el tipo de dato CedulaRestringida
EXEC	sp_bindrule	'ReglaCedulaNumerica', 'CedulaRestringida'
GO


--Regla de restriccion para validar correos, formato basico algo@algo.algo
CREATE RULE ReglaCorreo AS 
    @correo LIKE '_%@__%.__%'; --Validacion basica de correo
GO

--Creamos el tipo de dato CorreoRestringido
EXEC sp_addtype CorreoRestringido, 'VARCHAR(100)', 'NOT NULL'
GO

--Asociamos la regla ReglaCorreo el tipo de dato CorreoRestringido 
EXEC sp_bindrule 'ReglaCorreo', 'CorreoRestringido'
GO


--Regla de restriccion para los telefonos, en costa rica por ejemplo no existen con 0 o 1,
--pero de 2 para arriba, ejemplo 24470202, 8 numeros exactos
CREATE RULE ReglaTelefono AS
	@telefono LIKE '[2-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]';
GO

--Creamos el tipo de dato TelefonoRestringido
EXEC sp_addtype TelefonoRestringido, 'CHAR(8)', 'NOT NULL'
GO

--Asociamos la regla ReglaTelefono el tipo de dato TelefonoRestringido
EXEC sp_bindrule 'ReglaTelefono', 'TelefonoRestringido'
GO


/*
Solo permite letras mayusculas y minisculas, incluyendo la tilde y la enie, rechaza cualquier numero
o caracter especial como @, asi evitamos que se pongan nombres como XxJos3ProG@merxX*/
CREATE RULE ReglaNombreYApellidos AS
	@nombre NOT LIKE '%[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]%';
GO

--Creamos el tipo de dato ReglaNombreYApellidos
EXEC sp_addtype  NombreYApellidosLimpios, 'Varchar(20)', 'NOT NULL'
GO

----Asociamos la regla ReglaNombreYApellidos el tipo de dato ReglaNombreYApellidos
EXEC sp_bindrule 'ReglaNombreYApellidos', 'NombreYApellidosLimpios'
GO


/* Regla para restriccion de edades, de 5 a 120, por que nadie de menos de 5 anios va a ir al gym, por que 
a esas edades uno debe estar jugando play todo el dia y viendo tok tok y no mas de 120 por que ya
despues de ahi estan muy viejitos para hacer ejercicio y pobrecitos, deben descansar de tanto programar
*/
CREATE RULE ReglaEdad AS 
    @edad BETWEEN 5 AND 120;
GO

-- Creamos el tipo de dato TelefonoRestringido
EXEC sp_addtype EdadRestringida, 'TINYINT', 'NOT NULL';
GO

-- Asociar regla
EXEC sp_bindrule 'ReglaEdad', 'EdadRestringida';
GO



-- Tabla provincias
CREATE TABLE provincias(
	id_provincia TINYINT			NOT NULL,
	nombre_provincia VARCHAR(20)	NOT NULL,
	CONSTRAINT PK_id_provincia_provincias PRIMARY KEY(id_provincia)
);


-- Tabla cantones
CREATE TABLE cantones(
	id_canton TINYINT			NOT NULL,
	provincia TINYINT			NOT NULL,
	nombre_canton VARCHAR(50)	NOT NULL,
	CONSTRAINT PK_canton_cantones PRIMARY KEY(id_canton)
);

-- Tabla distritos
CREATE TABLE distritos(
	id_distrito SMALLINT		NOT NULL,
	canton TINYINT				NOT NULL,
	nombre_distrito VARCHAR(50)	NOT NULL,
	CONSTRAINT PK_id_distrito_distritos PRIMARY KEY(id_distrito)
);

-- Tabla generos
CREATE TABLE generos(
	id_genero TINYINT		NOT NULL,
	genero VARCHAR(9)		NOT NULL,
	CONSTRAINT PK_id_genero_generos PRIMARY KEY(id_genero)
);

-- Tabla persona
CREATE TABLE persona(
	cedula CedulaRestringida			NOT NULL,
	nombre NombreYApellidosLimpios		NOT NULL,
	apellido1 NombreYApellidosLimpios	NOT NULL,
	apellido2 NombreYApellidosLimpios	NOT NULL,
	genero TINYINT						NOT NULL,
	distrito SMALLINT					NOT NULL,
	correo CorreoRestringido			NOT NULL,
	fecha_nacimiento			DATE NOT NULL DEFAULT GETDATE(),
	edad EdadRestringida		NOT NULL,
	CONSTRAINT PK_cedula_personas PRIMARY KEY(cedula)
);

-- Tabla telefonos_personas
CREATE TABLE telefonos_personas (
    cedula_persona CedulaRestringida PRIMARY KEY,  
    telefono TelefonoRestringido NOT NULL,
    CONSTRAINT FK_cedula_persona_tel FOREIGN KEY (cedula_persona) REFERENCES persona(cedula)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Tabla entrenador
CREATE TABLE entrenador(
	cedula  CedulaRestringida			NOT NULL,
	fecha_contratacion DATE				NOT NULL DEFAULT GETDATE(),
	tipo VARCHAR(20)					NOT NULL DEFAULT 'General',
	CONSTRAINT PK_cedula_entrenador PRIMARY KEY(cedula),
	CONSTRAINT FK_entrenador_persona FOREIGN KEY(cedula) REFERENCES persona(cedula)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

-- Tabla administrador
CREATE TABLE administrador(
	cedula CedulaRestringida				NOT NULL,
	fecha_contratacion DATE NOT NULL DEFAULT GETDATE(),
	CONSTRAINT PK_cedula_administrador PRIMARY KEY(cedula),
	CONSTRAINT FK_administrador_persona FOREIGN KEY(cedula) REFERENCES persona(cedula)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);


--Tabla clientes
CREATE TABLE cliente(
	cedula CedulaRestringida	NOT NULL,
	estado TINYINT				NOT NULL DEFAULT 1	,		
	fecha_registro	DATE		NOT NULL DEFAULT GETDATE(),

	CONSTRAINT PK_cedula_cliente PRIMARY KEY(cedula),
	CONSTRAINT FK_cliente_persona FOREIGN KEY(cedula) REFERENCES persona(cedula)
	ON DELETE CASCADE
	ON UPDATE CASCADE
)


--Tabla asistencia_cliente
CREATE TABLE asistencia_cliente (
    id_sesion_programada INT NOT NULL,
    cedula CedulaRestringida NOT NULL,
    asistio BIT NOT NULL DEFAULT 1,
    CONSTRAINT PK_asistencia_cliente PRIMARY KEY (id_sesion_programada, cedula)
);
GO

--Tabla estado de clientes
CREATE TABLE estados_clientes(
	id_estado	TINYINT				NOT NULL,
	estado		VARCHAR(15)		    NOT NULL,
	CONSTRAINT PK_id_estado_estado_clientes PRIMARY KEY(id_estado)
)


--Tabla intermedia clientes_membresias
CREATE TABLE cliente_membresias(
	cedula			 CedulaRestringida	NOT NULL,
	id_membresia	INT					NOT NULL,
	vigente			BIT					NOT NULL DEFAULT 1
	CONSTRAINT PK_cliente_membresias PRIMARY KEY(cedula, id_membresia)
)


--Tabla de membresias
CREATE TABLE membresia(
	id_membresia		INT	IDENTITY(1,1)	NOT NULL,
	fecha_expiracion	DATE				,
	tipo				TINYINT				NOT NULL

	CONSTRAINT PK_id_membresia_membresia PRIMARY KEY(id_membresia)
)


--Tabla de los tipos de membresia
CREATE TABLE tipo_membresia(
	id_tipo_membresia		TINYINT				NOT NULL,
	tipo					VARCHAR(30)			NOT NULL,

	CONSTRAINT PK_id_tipo_tipo_membresia PRIMARY KEY(id_tipo_membresia)
)


--Tabla de formas de pago
CREATE TABLE formas_de_pago (
    id_forma_pago INT ,
    formaDePago VARCHAR(30) NOT NULL

	CONSTRAINT PK_id_forma_pago_formas_de_pago PRIMARY KEY(id_forma_pago)
);


--Tablas de pago
CREATE TABLE pagos (
    id_pago INT IDENTITY(1,1),
    fecha_pago DATE						NOT NULL,
    id_membresia INT					NOT NULL,
	cedula_cliente CedulaRestringida	NOT NULL,
    forma_pago INT						NOT NULL,
    monto INT							NOT NULL
	CONSTRAINT PK_id_pago_pagos PRIMARY KEY(id_pago)
);



--Tabla intermedia de cliente_clase
CREATE TABLE cliente_clase(
	cedula		 CedulaRestringida	NOT NULL,
	id_clase	 INT				NOT NULL
	
	CONSTRAINT PK_cliente_clase PRIMARY KEY(cedula, id_clase)
)


-- Tabla estados de maquinas
CREATE TABLE estados_maquinas(
	id_estado TINYINT	NOT NULL,
	estado VARCHAR(20)	NOT NULL,
	CONSTRAINT PK_id_estado_estados_maquinas PRIMARY KEY(id_estado)
);


-- Tabla maquina
CREATE TABLE maquina(
	id_maquina	INT				NOT NULL,
	estado		TINYINT			NOT NULL,
	tipo		VARCHAR(50)		NOT NULL,
	modelo		VARCHAR(40)		NOT NULL,
	marca		VARCHAR(30)		NOT NULL,
	CONSTRAINT PK_maquina_id_maquina PRIMARY KEY(id_maquina)
);


-- Tabla intermedia admin_maquina
CREATE TABLE admin_maquina(
	cedula  CedulaRestringida	NOT NULL,
	id_maquina INT				NOT NULL,
	ultima_revision DATE		NOT NULL,
	cant_maquinas INT			NOT NULL,
	CONSTRAINT PK_admin_maquina PRIMARY KEY (cedula, id_maquina)
);


--Tabla clase
CREATE TABLE clase(
	id_clase	INT				NOT NULL,
	nombre		VARCHAR(50)		NOT NULL,
	descripcion VARCHAR(200) NOT NULL DEFAULT 'Sin descripción'

	CONSTRAINT PK_clase_id_clase PRIMARY KEY(id_clase)
)
GO

--Tabla intermedia entrenador_clase
CREATE TABLE entrenador_clase(
	cedula	  CedulaRestringida	NOT NULL,
	id_clase INT				NOT NULL

	CONSTRAINT PK_entrenador_clase PRIMARY KEY(cedula, id_clase) 
)
GO

-- Tabla Grupo
CREATE TABLE grupo (
	numero_grupo		  TINYINT NOT NULL,
	cupo_disponible		  TINYINT NOT NULL,
	cantidad_matriculados TINYINT NOT NULL DEFAULT 0,
	CONSTRAINT PK_grupo PRIMARY KEY (numero_grupo)
);
GO

-- Tabla horario
CREATE TABLE horario (
	id_horario INT NOT NULL,
	dia VARCHAR(20) NOT NULL,
	hora_inicio TIME NOT NULL,
	hora_fin TIME NOT NULL,
	CONSTRAINT PK_horario PRIMARY KEY (id_horario)
);
GO

-- Tabla intermedia sesion
CREATE TABLE sesion (
    id_sesion INT			NOT NULL,
    numero_grupo TINYINT	NOT NULL,
    id_horario INT			NOT NULL,
    id_clase INT			NOT NULL

	CONSTRAINT PK_sesion_id_sesion PRIMARY KEY(id_sesion)
);

-- Tabla de sesion programada
CREATE TABLE sesion_programada (
    id_sesion_programada INT IDENTITY(1,1) NOT NULL,
    id_sesion INT			 NOT NULL,
    fecha DATE				 NOT NULL

	CONSTRAINT sesion_programada_id_sesion_programada PRIMARY KEY(id_sesion_programada)
);
GO




-- Agregar las claves foraneas despues de crear todas las tablas

--Llaves foraneas que tienen que ver con persona
-- FK: distritos → cantones
ALTER TABLE distritos
ADD CONSTRAINT FK_canton_distritos FOREIGN KEY(canton) REFERENCES cantones(id_canton)
ON UPDATE CASCADE;
GO

-- FK: cantones → provincias
ALTER TABLE cantones
ADD CONSTRAINT FK_provincia_provincias FOREIGN KEY(provincia) REFERENCES provincias(id_provincia)
ON UPDATE CASCADE;
GO

-- FK: persona → distritos
ALTER TABLE persona
ADD CONSTRAINT FK_distrito_persona FOREIGN KEY(distrito)
REFERENCES distritos(id_distrito)
ON UPDATE CASCADE;
GO

-- FK: persona → generos
ALTER TABLE persona
ADD CONSTRAINT FK_genero_persona FOREIGN KEY(genero)
REFERENCES generos(id_genero)
ON UPDATE CASCADE;
GO


--Llaves foraneas que tienen que ver con cliente
-- FK: cliente->estado_clientes
ALTER TABLE cliente
ADD CONSTRAINT FK_estado_clientes_cliente FOREIGN KEY(estado)
REFERENCES estados_clientes(id_estado)
ON UPDATE CASCADE
GO

-- FK: cliente_membresias->cliente
ALTER TABLE cliente_membresias
ADD CONSTRAINT FK_cliente_membresias_cliente FOREIGN KEY(cedula)
REFERENCES cliente(cedula)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

-- FK: cliente_membresias->membresias
ALTER TABLE cliente_membresias
ADD CONSTRAINT FK_cliente_membresias_membresia FOREIGN KEY(id_membresia)
REFERENCES membresia(id_membresia)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO


--FK: membresia->tipo_membresia
ALTER TABLE membresia
ADD CONSTRAINT FK_tipo_membresia FOREIGN KEY(tipo)
REFERENCES tipo_membresia(id_tipo_membresia)
GO

--FK: cliente_clase ->cliente
ALTER TABLE cliente_clase
ADD CONSTRAINT FK_cliente_clase_cliente FOREIGN KEY(cedula)
REFERENCES cliente(cedula)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

-- FK: cliente_clase ->clase
ALTER TABLE cliente_clase
ADD CONSTRAINT FK_cliente_clase_clase FOREIGN KEY(id_clase)
REFERENCES clase(id_clase)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO




--Llaves foraneas que tienen que ver con administrador
-- FK: admin_maquina → administrador
ALTER TABLE admin_maquina
ADD CONSTRAINT FK_admin_maquina_administrador FOREIGN KEY (cedula)
REFERENCES administrador(cedula)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

-- FK: admin_maquina → maquina
ALTER TABLE admin_maquina
ADD CONSTRAINT FK_admin_maquina_maquina FOREIGN KEY (id_maquina)
REFERENCES maquina(id_maquina)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

-- FK: maquina → estados_maquinas
ALTER TABLE maquina
ADD CONSTRAINT FK_estado_estados FOREIGN KEY(estado)
REFERENCES estados_maquinas(id_estado);
GO






--Llaves foraneas que tienen que ver con entrenador
--FK: entrenador_clase -> entrenador
ALTER TABLE entrenador_clase
ADD CONSTRAINT FK_entrenador_clase_entrenador FOREIGN KEY(cedula)
REFERENCES entrenador(cedula)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO


--FK: entrenador_clase -> clase
ALTER TABLE entrenador_clase
ADD CONSTRAINT FK_entrenador_clase_clase FOREIGN KEY(id_clase)
REFERENCES clase(id_clase)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO



--Llaves foraneas que tienen que ver con clase y sesion
--FK: sesion->grupo
ALTER TABLE sesion
ADD CONSTRAINT FK_sesion_grupo FOREIGN KEY (numero_grupo)
REFERENCES grupo(numero_grupo)
ON DELETE CASCADE
ON UPDATE CASCADE
GO


--FK: sesion->horario
ALTER TABLE sesion
ADD CONSTRAINT FK_sesion_horario FOREIGN KEY (id_horario)
REFERENCES horario(id_horario)
ON DELETE CASCADE
ON UPDATE CASCADE
GO


--FK: sesion->clase
ALTER TABLE sesion
ADD CONSTRAINT FK_sesion_clase FOREIGN KEY (id_clase)
REFERENCES clase(id_clase)
ON DELETE CASCADE
ON UPDATE CASCADE
GO


--FK: sesion_programada -> sesion
ALTER TABLE sesion_programada
ADD CONSTRAINT FK_sesion_programada_sesion FOREIGN KEY (id_sesion)
    REFERENCES sesion(id_sesion) ON DELETE CASCADE ON UPDATE CASCADE;
GO

--FK: asistencia_cliente -> sesion_programada
ALTER TABLE asistencia_cliente
ADD CONSTRAINT FK_asistencia_programada FOREIGN KEY (id_sesion_programada)
REFERENCES sesion_programada(id_sesion_programada)
ON DELETE CASCADE
ON UPDATE CASCADE;


--FK: asistencia_cliente -> cliente
ALTER TABLE asistencia_cliente
ADD CONSTRAINT FK_asistencia_cliente FOREIGN KEY (cedula)
REFERENCES cliente(cedula) 
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

--Llaves foraneas que tiene que ver con membresia y pago
--FK: pagos -> membresia
ALTER TABLE pagos
ADD CONSTRAINT FK_pago_membresia FOREIGN KEY (id_membresia)
REFERENCES membresia(id_membresia)
ON DELETE CASCADE
ON UPDATE CASCADE
GO

--FK: pagos -> forma_pago
ALTER TABLE pagos
ADD CONSTRAINT FK_pago_forma_pago FOREIGN KEY (forma_pago)
REFERENCES formas_de_pago(id_forma_pago)
ON DELETE CASCADE
ON UPDATE CASCADE
GO

--FK: pagos -> cliente
ALTER TABLE pagos
ADD CONSTRAINT FK_pago_cliente FOREIGN KEY (cedula_cliente)
REFERENCES cliente(cedula)
ON DELETE CASCADE
ON UPDATE CASCADE




--Checks para validaciones de datos
ALTER TABLE grupo
ADD CONSTRAINT CK_grupo_cupos CHECK (cantidad_matriculados <= cupo_disponible);



/*Creamos un indice NONCLUSTERED en la columna nombre, apellido1 y apellido2, ya que estas columnas
  son frecuentemente accedidas en muchos lados de la aplicacion

 Ya que solo se puede crear 1 CLUSTERED INDEX por tabla y en el caso de la tabla persona,
 ya existe la llave primaria cedula que automaticamente crea un CLUSTERED INDEX
 
 Por buenas practicas y para que el comportamiento de la tabla no dependa del estado
 previo de la tabla, se especifica que es NONCLUSTERED INDEX
*/
CREATE NONCLUSTERED INDEX idx_persona_nombre ON persona(nombre);
CREATE NONCLUSTERED INDEX idx_persona_apellido1 ON persona(apellido1);
CREATE NONCLUSTERED INDEX idx_persona_apellido2 ON persona(apellido2);


/*Trigger que determina automaticamente la fecha de expiracion de la membresia de acuerdo al tipo,
Tipo 1 → 'Mensual' → +30 días

Tipo 2 → 'Trimestral' → +90 días

Tipo 3 → 'Anual' → +365 días

Tipo 4 → 'Semestral' → +180 días

Tipo 5 → 'Diaria' → +1 día
*/
GO
CREATE OR ALTER TRIGGER trigger_set_fecha_expiracion_membresia
ON membresia
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE tipo NOT IN (1, 2, 3, 4, 5)
    )
    BEGIN
        RAISERROR('Tipo de membresía inválido. Solo se permiten los valores 1-5.', 16, 1);
        RETURN;
    END

    INSERT INTO membresia (fecha_expiracion, tipo)
    SELECT 
        CASE tipo
            WHEN 1 THEN DATEADD(DAY, 30, GETDATE())
            WHEN 2 THEN DATEADD(DAY, 90, GETDATE())
            WHEN 3 THEN DATEADD(DAY, 365, GETDATE())
            WHEN 4 THEN DATEADD(DAY, 180, GETDATE())
            WHEN 5 THEN DATEADD(DAY, 1, GETDATE())
        END,
        tipo
    FROM inserted;
END;
GO




--Inserciones de prueba a todas las tablas
-- Tabla provincias
INSERT INTO provincias (id_provincia, nombre_provincia) VALUES
(1, 'San José'), (2, 'Alajuela'), (3, 'Cartago'),
(4, 'Heredia'), (5, 'Puntarenas'), (6, 'Limón'),
(7, 'Guanacaste'), (8, 'San Rafael'), (9, 'Desamparados'), (10, 'Escazú');

-- Tabla cantones
INSERT INTO cantones (id_canton, provincia, nombre_canton) VALUES
(1,1,'Central'),(2,2,'San Carlos'),(3,3,'El Guarco'),
(4,4,'Belén'),(5,5,'Corredores'),(6,6,'Limón'),(7,7,'Liberia'),
(8,8,'San Rafael'),(9,9,'Desamparados'),(10,10,'Escazú');

-- Tabla distritos
INSERT INTO distritos (id_distrito, canton, nombre_distrito) VALUES
(1,1,'Carmen'),(2,2,'Quesada'),(3,3,'Tejar'),(4,4,'San Antonio'),
(5,5,'Paso Canoas'),(6,6,'Limón Centro'),(7,7,'Liberia Centro'),
(8,8,'Centro'),(9,9,'Desamparados Centro'),(10,10,'Escazú Centro');

-- Tabla generos
INSERT INTO generos (id_genero, genero) VALUES
(1,'Masculino'),(2,'Femenino');

-- Tabla persona
INSERT INTO persona (cedula, nombre, apellido1, apellido2, genero, distrito, correo, fecha_nacimiento, edad) VALUES
('414086906', 'Mónica', 'Soto', 'Campos', 2, 1, 'mónica1@gmail.com', '2002-01-05', 23),
('800308848', 'Lucía', 'Chinchilla', 'Gómez', 2, 10, 'lucía2@correo.com', '2000-11-03', 25),
('746841900', 'Tomás', 'Vargas', 'Castro', 1, 9, 'tomás3@gmail.com', '1999-09-30', 26),
('767402437', 'Paula', 'Rojas', 'Fernández', 1, 4, 'paula4@correo.com', '2008-05-01', 17),
('270735008', 'Ana', 'Campos', 'Chinchilla', 2, 8, 'ana5@example.com', '2006-03-21', 19),
('931161349', 'Tatiana', 'Castro', 'Alvarado', 2, 7, 'tatiana6@correo.com', '2004-12-28', 20),
('393040211', 'Javier', 'Chinchilla', 'Mora', 1, 3, 'javier7@example.com', '1996-10-30', 27),
('290719496', 'Lucía', 'Gómez', 'Vargas', 2, 6, 'lucía8@correo.com', '1998-09-25', 25),
('867978083', 'Luis', 'Alvarado', 'Campos', 1, 5, 'luis9@correo.com', '2003-05-01', 21),
('934827096', 'Emilio', 'Quesada', 'Gómez', 1, 2, 'emilio10@example.com', '1997-11-12', 26),
('681366395', 'Camila', 'Fernández', 'Chinchilla', 2, 1, 'camila11@correo.com', '1993-02-08', 31),
('281520804', 'Pedro', 'Chacón', 'Martínez', 1, 2, 'pedro12@example.com', '1990-08-20', 33),
('261935470', 'Sebastián', 'Gómez', 'Vargas', 1, 3, 'sebastián13@correo.com', '1991-09-10', 32),
('142192323', 'Gabriel', 'Pérez', 'Chinchilla', 1, 4, 'gabriel14@example.com', '1992-07-03', 31),
('569206408', 'Valeria', 'Mora', 'Campos', 2, 5, 'valeria15@gmail.com', '1995-05-15', 30),
('373450054', 'Andrea', 'Castro', 'Gómez', 2, 6, 'andrea16@correo.com', '2000-12-25', 24),
('198689770', 'Juan', 'Campos', 'Quesada', 1, 7, 'juan17@correo.com', '1999-10-14', 25),
('866266009', 'Laura', 'Ramírez', 'Chinchilla', 2, 8, 'laura18@gmail.com', '1998-11-11', 25),
('758085848', 'Isabel', 'Soto', 'Gómez', 2, 9, 'isabel19@correo.com', '1997-01-09', 27),
('920327174', 'Ricardo', 'Chacón', 'Soto', 1, 10, 'ricardo20@example.com', '1996-05-24', 28),
('264451244', 'Natalia', 'Castro', 'Mora', 2, 1, 'natalia21@correo.com', '2002-09-15', 22),
('227902729', 'María', 'Vargas', 'Alvarado', 2, 2, 'maría22@gmail.com', '2003-03-07', 21),
('273939798', 'Andrés', 'Gómez', 'Soto', 1, 3, 'andrés23@example.com', '1995-06-19', 28),
('209902497', 'Carlos', 'Fernández', 'Ramírez', 1, 4, 'carlos24@correo.com', '1993-04-01', 31),
('347260670', 'Diego', 'Campos', 'Martínez', 1, 5, 'diego25@correo.com', '1991-08-22', 32),
('586898512', 'Daniela', 'Gómez', 'Pérez', 2, 6, 'daniela26@example.com', '1999-07-07', 25),
('962000470', 'Esteban', 'Vargas', 'Chinchilla', 1, 7, 'esteban27@correo.com', '2000-10-30', 23),
('352890774', 'Elena', 'Quesada', 'Alvarado', 2, 8, 'elena28@example.com', '2004-06-14', 20),
('313189524', 'Fernando', 'Soto', 'Castro', 1, 9, 'fernando29@correo.com', '2002-11-08', 22),
('711248682', 'Tatiana', 'Ramírez', 'Mora', 2, 10, 'tatiana30@example.com', '2005-01-03', 19);


-- Tabla telefonos_personas
INSERT INTO telefonos_personas (cedula_persona, telefono) VALUES
(414086906, 69138025),
(800308848, 88122452),
(746841900, 44456033),
(767402437, 93412129),
(270735008, 30750417),
(931161349, 87109040),
(393040211, 23331464),
(290719496, 37959276),
(867978083, 71413782),
(934827096, 58514372),
(681366395, 38934314),
(281520804, 50430892),
(261935470, 79960784),
(142192323, 75799887),
(569206408, 76775504),
(373450054, 98648661),
(198689770, 40796733),
(866266009, 37061941),
(758085848, 68129577),
(920327174, 62319951),
(264451244, 71527865),
(227902729, 35321064),
(273939798, 43204296),
(209902497, 63615721),
(347260670, 40214986),
(586898512, 89037154),
(962000470, 39260361),
(352890774, 94309934),
(313189524, 53631283),
(711248682, 92295715);


-- Tabla entrenador
INSERT INTO entrenador (cedula, fecha_contratacion, tipo) VALUES
(373450054, '2025-01-01', 'Personal'),
(198689770, '2025-01-01', 'Personal'),
(866266009, '2025-01-01', 'General'),
(758085848, '2025-01-01', 'Funcional'),
(920327174, '2025-01-01', 'Personal');



-- Tabla administrador
INSERT INTO administrador (cedula, fecha_contratacion) VALUES
(264451244, '2025-01-01'),
(227902729, '2025-01-01'),
(273939798, '2025-01-01'),
(209902497, '2025-01-01'),
(347260670, '2025-01-01');



-- Tabla estados_clientes
INSERT INTO estados_clientes (id_estado, estado) VALUES
(1,'Activo'),(2,'Inactivo'),(3,'Suspendido'),
(4,'Revisión'),(5,'Retirado'),(6,'Nuevo'),(7,'Congelado'),(8,'Bloqueado'),
(9,'Prueba'),(10,'Otros');

-- Tabla cliente
INSERT INTO cliente (cedula, estado, fecha_registro) VALUES
(414086906, 2, '2025-01-01'),
(800308848, 5, '2025-01-01'),
(746841900, 10, '2025-01-01'),
(767402437, 2, '2025-01-01'),
(270735008, 6, '2025-01-01'),
(931161349, 7, '2025-01-01'),
(393040211, 4, '2025-01-01'),
(290719496, 5, '2025-01-01'),
(867978083, 2, '2025-01-01'),
(934827096, 10, '2025-01-01'),
(681366395, 4, '2025-01-01'),
(281520804, 9, '2025-01-01'),
(261935470, 2, '2025-01-01'),
(142192323, 6, '2025-01-01'),
(569206408, 10, '2025-01-01');



-- Tabla tipo_membresia
INSERT INTO tipo_membresia (id_tipo_membresia, tipo) VALUES
(1,'Mensual'),(2,'Trimestral'),(3,'Anual'),
(4,'Semestral'),(5,'Diaria')

-- Tabla membresia
INSERT INTO membresia (tipo) VALUES
(1),
(2),
(3),
(4),
(5),
(2),
(4),
(5),
(1),
(2);


-- Tabla cliente_membresias
INSERT INTO cliente_membresias (cedula, id_membresia) VALUES
(414086906, 1),
(800308848, 2),
(746841900, 3),
(767402437, 4),
(270735008, 5),
(931161349, 6),
(393040211, 7),
(290719496, 8),
(867978083, 9)



-- Tabla clase
INSERT INTO clase (id_clase, nombre, descripcion) VALUES
(1,'Zumba','Ejercicio de baile'),(2,'Spinning','Bicicleta'),
(3,'Yoga','Estiramiento'),(4,'Crossfit','Alta intensidad'),
(5,'Pilates','Cuerpo y mente'),(6,'Boxeo','De contacto'),
(7,'HIIT','Intervalos'),(8,'Funcional','Movimientos útiles'),
(9,'Stretching','Flexibilidad'),(10,'TRX','Con suspensión');

-- Tabla cliente_clase
INSERT INTO cliente_clase (cedula, id_clase) VALUES
(414086906, 10), -- tiene membresía 1 (Mensual)
(800308848, 5),  -- tiene membresía 2 (Trimestral)
(746841900, 8),  -- tiene membresía 3 (Anual)
(767402437, 6),  -- tiene membresía 4 (Semestral)
(270735008, 2),  -- tiene membresía 5 (Diaria)
(931161349, 5),  -- tiene membresía 6 (Trimestral)
(393040211, 1),  -- tiene membresía 7 (Semestral)
(290719496, 6),  -- tiene membresía 8 (Diaria)
(867978083, 6);  -- tiene membresía 9 (Mensual)


-- Tabla entrenador_clase
INSERT INTO entrenador_clase (cedula, id_clase) VALUES
(373450054, 9),
(198689770, 6),
(866266009, 3),
(758085848, 3),
(920327174, 10);


-- Tabla estados_maquinas
INSERT INTO estados_maquinas (id_estado, estado) VALUES
(1,'Operativa'),(2,'Reparación'),(3,'Fuera servicio'),
(4,'Mantenimiento'),(5,'Nueva'),(6,'Revisada'),(7,'Desuso'),
(8,'Reasignada'),(9,'Donada'),(10,'Descompuesta');

-- Tabla maquina
INSERT INTO maquina (id_maquina, estado, tipo, modelo, marca) VALUES
(1,1,'Cardio','X1000','LifeFitness'),(2,2,'Fuerza','P3000','Technogym'),
(3,3,'Elíptica','E500','Precor'),(4,4,'Caminadora','RunFast','Matrix'),
(5,5,'Bicicleta','SpinPro','StarTrac'),(6,6,'Remo','R300','Concept2'),
(7,7,'Escaladora','E900','BH'),(8,8,'Prensa','LegMaster','Nautilus'),
(9,9,'Multipower','MPX','Reebok'),(10,10,'Hack','HX100','Sole');

-- Tabla admin_maquina
INSERT INTO admin_maquina (cedula, id_maquina, ultima_revision, cant_maquinas) VALUES
(264451244, 1, '2025-05-01', 1),
(227902729, 2, '2025-05-01', 1),
(273939798, 3, '2025-05-01', 1),
(209902497, 4, '2025-05-01', 1),
(347260670, 5, '2025-05-01', 1);


-- Tabla grupo
INSERT INTO grupo (numero_grupo, cupo_disponible, cantidad_matriculados) VALUES
(1,10,5),(2,15,12),(3,20,18),(4,8,7),(5,25,20),
(6,12,9),(7,16,15),(8,22,21),(9,10,10),(10,30,30);

-- Tabla horario
INSERT INTO horario (id_horario, dia, hora_inicio, hora_fin) VALUES
(1,'Lunes','08:00','09:00'),(2,'Martes','09:00','10:00'),
(3,'Miércoles','10:00','11:00'),(4,'Jueves','11:00','12:00'),
(5,'Viernes','12:00','13:00'),(6,'Sábado','13:00','14:00'),
(7,'Domingo','14:00','15:00'),(8,'Lunes','15:00','16:00'),
(9,'Martes','16:00','17:00'),(10,'Miércoles','17:00','18:00');


-- Tabla sesion
INSERT INTO sesion (id_sesion, numero_grupo, id_horario, id_clase) VALUES
(1, 1, 1, 1),
(2, 2, 2, 2),
(3, 3, 3, 3),
(4, 4, 4, 4),
(5, 5, 5, 5),
(6, 6, 6, 6),
(7, 7, 7, 7),
(8, 8, 8, 8),
(9, 9, 9, 9),
(10, 10, 10, 10);



-- Insertar sesiones programadas (relacionadas con las sesiones existentes)
INSERT INTO sesion_programada (id_sesion, fecha) VALUES
(1, '2025-06-01'),
(2, '2025-06-02'),
(3, '2025-06-03'),
(4, '2025-06-04'),
(5, '2025-06-05'),
(6, '2025-06-06'),
(7, '2025-06-07'),
(8, '2025-06-08'),
(9, '2025-06-09'),
(10, '2025-06-10');




-- Insertar asistencias de los clientes según la clase asignada
INSERT INTO asistencia_cliente (id_sesion_programada, cedula, asistio) VALUES
(1, 414086906, 1),
(2, 800308848, 1),
(3, 746841900, 1),
(4, 767402437, 1),
(5, 270735008, 1),
(6, 931161349, 1),
(7, 393040211, 1),
(8, 290719496, 1),
(9, 867978083, 1)



INSERT INTO formas_de_pago(id_forma_pago, formaDePago)VALUES
(1,'Tarjeta'),
(2,'Simpe'),
(3,'Efectivo')


INSERT INTO pagos (fecha_pago, id_membresia, cedula_cliente, forma_pago, monto) VALUES 
('2025-05-23', 1, 414086906, 1, 15000), -- Mensual
('2025-05-23', 2, 800308848, 2, 40000), -- Trimestral
('2025-05-23', 3, 746841900, 3, 120000), -- Anual
('2025-05-23', 4, 767402437, 1, 80000), -- Semestral
('2025-05-23', 5, 270735008, 2, 5000), -- Diaria
('2025-05-23', 6, 931161349, 3, 35000), -- Trimestral
('2025-05-23', 7, 393040211, 1, 80000), -- Semestral
('2025-05-23', 8, 290719496, 2, 5000), -- Diaria
('2025-05-23', 9, 867978083, 1, 15000); -- Mensual

SELECT * FROM pagos


SELECT * FROM provincias;
SELECT * FROM cantones;
SELECT * FROM distritos;
SELECT * FROM generos;
SELECT * FROM persona;
SELECT * FROM telefonos_personas;
SELECT * FROM entrenador;
SELECT * FROM administrador;
SELECT * FROM estados_clientes;
SELECT * FROM cliente;
SELECT * FROM tipo_membresia;
SELECT * FROM membresia;
SELECT * FROM cliente_membresias;
SELECT * FROM clase;
SELECT * FROM cliente_clase;
SELECT * FROM entrenador_clase;
SELECT * FROM estados_maquinas;
SELECT * FROM maquina;
SELECT * FROM admin_maquina;
SELECT * FROM grupo;
SELECT * FROM horario;
SELECT * FROM sesion;
GO


--Vista de general de todos los clientes
CREATE OR ALTER VIEW vista_clientes AS
SELECT
    dc.nombre,
    dc.apellido1,
    dc.apellido2,
    dc.cedula,
    dc.correo,
    dc.telefono,
    dc.fecha_registro,
    dm.fecha_expiracion,
    dm.tipo_membresia,
    dc.estado_cliente
FROM
    (
        SELECT
            p.nombre,
            p.apellido1,
            p.apellido2,
            p.correo,
            c.cedula,
            tp.telefono,
            c.fecha_registro,
            ec.estado AS estado_cliente
        FROM cliente c
        JOIN persona p ON c.cedula = p.cedula
        JOIN telefonos_personas tp ON c.cedula = tp.cedula_persona
        JOIN estados_clientes ec ON c.estado = ec.id_estado
    ) AS dc
LEFT JOIN (
        SELECT
            cm.cedula,
            me.fecha_expiracion,
            tm.tipo AS tipo_membresia
        FROM cliente_membresias cm
        JOIN membresia me ON cm.id_membresia = me.id_membresia
        JOIN tipo_membresia tm ON me.tipo = tm.id_tipo_membresia
        WHERE cm.vigente = 1
    ) AS dm
    ON dc.cedula = dm.cedula;
GO




--Vista de clientes con clase actual asignada
CREATE VIEW vista_clientes_clase
AS
SELECT
	p.nombre AS nombre_cliente,
	p.apellido1,
	p.apellido2,
    c.cedula,
	cl.nombre AS nombre_clase,
	cl.descripcion AS descripcion_clase
FROM
	cliente c
	JOIN persona p ON c.cedula = p.cedula
	JOIN cliente_clase cc ON c.cedula = cc.cedula
	JOIN clase cl ON cc.id_clase = cl.id_clase
GO

SELECT * FROM vista_clientes_clase
GO

SELECT * FROM sesion_programada
GO


--Vista de sesion para ver el grupo,horario y la clase que el cliente debe asistir por medio de la tabla asistencia
CREATE OR ALTER VIEW vista_clientes_sesion AS
SELECT
    dc.cedula,
    dc.nombre_cliente,
    ds.id_sesion_programada, 
    ds.nombre_clase,
    ds.descripcion_clase,
    ds.numero_grupo,
    ds.fecha_sesion,
    ds.dia,
    ds.hora_inicio,
    ds.hora_fin,
    CASE 
        WHEN ac.asistio IS NULL THEN NULL         -- aún no se ha registrado
        WHEN ac.asistio = 1 THEN CAST(1 AS BIT)   -- asistió
        ELSE CAST(0 AS BIT)                       -- no asistió
    END AS asistio
FROM 
    (
        SELECT 
            p.cedula,
            p.nombre + ' ' + p.apellido1 + ' ' + p.apellido2 AS nombre_cliente,
            cc.id_clase
        FROM cliente_clase cc
        JOIN persona p ON p.cedula = cc.cedula
    ) AS dc
JOIN (
    SELECT 
        sp.id_sesion_programada, 
        s.id_clase,
        c.nombre AS nombre_clase,
        c.descripcion AS descripcion_clase,
        s.numero_grupo,
        sp.fecha AS fecha_sesion,
        h.dia,
        h.hora_inicio,
        h.hora_fin
    FROM sesion s
    JOIN clase c ON s.id_clase = c.id_clase
    JOIN sesion_programada sp ON s.id_sesion = sp.id_sesion
    JOIN horario h ON s.id_horario = h.id_horario
) AS ds
    ON dc.id_clase = ds.id_clase
LEFT JOIN asistencia_cliente ac
    ON ac.cedula = dc.cedula AND ac.id_sesion_programada = ds.id_sesion_programada;
GO


SELECT * FROM vista_clientes_sesion



GO
CREATE VIEW vista_clientes_membresia_activa
AS
SELECT 
		cm.cedula,
		m.id_membresia,
		m.tipo,
		m.fecha_expiracion,
		tm.tipo AS nombre_tipo
	FROM cliente_membresias cm
	JOIN membresia m ON cm.id_membresia = m.id_membresia
	JOIN tipo_membresia tm ON m.tipo = tm.id_tipo_membresia
	WHERE cm.vigente = 1;
GO
SELECT * FROM vista_clientes_membresia_activa



GO
--Procedimiento almacenado transaccional para insertar un cliente
CREATE OR ALTER PROCEDURE insertar_cliente (
    @cedula CedulaRestringida,
    @nombre NombreYApellidosLimpios,
    @apellido1 NombreYApellidosLimpios,
    @apellido2 NombreYApellidosLimpios,
    @telefono TelefonoRestringido,
    @genero TINYINT,
    @distrito SMALLINT,
    @correo CorreoRestringido,
    @fecha_nacimiento DATE,
    @edad TINYINT
)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Validar que la persona no exista ya
        IF EXISTS (SELECT 1 FROM persona WHERE cedula = @cedula)
        BEGIN
            RAISERROR('El cliente ya existe en la base de datos.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Validar que el teléfono no esté ya registrado
        IF EXISTS (SELECT 1 FROM telefonos_personas WHERE telefono = @telefono)
        BEGIN
            RAISERROR('Este teléfono está registrado para otra persona.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Validar que el correo no esté registrado por otra persona
        IF EXISTS (SELECT 1 FROM persona WHERE correo = @correo)
        BEGIN
            RAISERROR('El correo ya está registrado por otra persona.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Validar que el distrito exista
        IF NOT EXISTS (SELECT 1 FROM distritos WHERE id_distrito = @distrito)
        BEGIN
            RAISERROR('El distrito indicado no existe.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Validar que el género exista
        IF NOT EXISTS (SELECT 1 FROM generos WHERE id_genero = @genero)
        BEGIN
            RAISERROR('El género indicado no existe.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Insertar en persona
        INSERT INTO persona (
            cedula, nombre, apellido1, apellido2,
            genero, distrito, correo,
            fecha_nacimiento, edad
        )
        VALUES (
            @cedula, @nombre, @apellido1, @apellido2,
            @genero, @distrito, @correo,
            @fecha_nacimiento, @edad
        );

        -- Insertar en cliente con estado activo (1)
        INSERT INTO cliente (cedula, estado)
        VALUES (@cedula, 1);

        -- Insertar el teléfono
        INSERT INTO telefonos_personas (cedula_persona, telefono)
        VALUES (@cedula, @telefono);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        DECLARE @mensaje_error NVARCHAR(4000) = ERROR_MESSAGE();

        IF XACT_STATE() != 0
            ROLLBACK TRANSACTION;

        RAISERROR(@mensaje_error, 16, 1);
    END CATCH
END;
GO




/*
Procedimiento almacenado transaccional para actualizar la informacion de una persona, en este caso
el correo y su telefono
*/
CREATE OR ALTER PROCEDURE actualizar_persona(
    @cedula CedulaRestringida,
    @correo CorreoRestringido,
    @telefono TelefonoRestringido
)
AS
BEGIN
	BEGIN TRY
		BEGIN TRANSACTION;

		-- Verificar existencia de la persona
		IF NOT EXISTS (
			SELECT 1 FROM persona WHERE cedula = @cedula
		)
		BEGIN
			RAISERROR('La persona no existe.', 16, 1);
			ROLLBACK TRANSACTION;
			RETURN;
		END

		-- Obtener valores actuales
		DECLARE @correo_actual VARCHAR(100)
		DECLARE @telefono_actual VARCHAR(20)

		SELECT @correo_actual = correo FROM persona WHERE cedula = @cedula;
		SELECT @telefono_actual = telefono FROM telefonos_personas WHERE cedula_persona = @cedula;

		-- Validar que al menos uno cambie
		IF (@correo_actual = @correo OR @correo IS NULL) AND (@telefono_actual = @telefono OR @telefono IS NULL)
		BEGIN
			RAISERROR('Debe modificar al menos el correo o el teléfono.', 16, 1);
			ROLLBACK TRANSACTION;
			RETURN;
		END

		-- Verificar correo no duplicado
		IF EXISTS (
			SELECT 1 FROM persona WHERE correo = @correo AND cedula <> @cedula
		)
		BEGIN
			RAISERROR('El correo ya está registrado por otra persona.', 16, 1);
			ROLLBACK TRANSACTION;
			RETURN;
		END

		-- Actualizar correo solo si cambia
		IF @correo_actual <> @correo
		BEGIN
			UPDATE persona
			SET correo = @correo
			WHERE cedula = @cedula;
		END

		-- Actualizar o insertar telefono solo si cambia
		IF @telefono_actual <> @telefono
		BEGIN
			IF @telefono_actual IS NOT NULL
			BEGIN
				UPDATE telefonos_personas
				SET telefono = @telefono
				WHERE cedula_persona = @cedula;
			END
			ELSE
			BEGIN
				INSERT INTO telefonos_personas (cedula_persona, telefono)
				VALUES (@cedula, @telefono);
			END
		END

		COMMIT TRANSACTION;
	END TRY

    BEGIN CATCH

        DECLARE @msg NVARCHAR(4000) = ERROR_MESSAGE();

        IF XACT_STATE() != 0 ROLLBACK TRANSACTION;
        RAISERROR(@msg, 16, 1);

    END CATCH
END;
GO



--Procedimiento almacenado transaccional para eliminar una persona, como ya la tabla persona tiene
--ON DELETE CASCADE, solo hace falta hacer validaciones para borrar a la persona de la base de datos
CREATE PROCEDURE eliminar_persona(
	@cedula CedulaRestringida
)
AS
BEGIN

	BEGIN TRY
		BEGIN TRANSACTION
			IF NOT EXISTS(
			SELECT 1 FROM persona WHERE cedula = @cedula
			)
			BEGIN
				RAISERROR('La persona no existe en la base de datos',16,1)
				ROLLBACK TRANSACTION;
				RETURN;
			END

		DELETE FROM persona WHERE cedula = @cedula
		COMMIT TRANSACTION;
	END TRY

	BEGIN CATCH
		DECLARE @mensaje_error NVARCHAR(4000) = ERROR_MESSAGE();

		IF XACT_STATE() != 0
			BEGIN
			ROLLBACK TRANSACTION
			END

		RAISERROR(@mensaje_error, 16, 1);
	END CATCH
END;
GO


--Procedimiento almacenado transaccional para inscribir un cliente a una clase
CREATE OR ALTER PROCEDURE asignar_clase_a_cliente (
    @cedula CedulaRestringida,
    @id_clase INT
)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Validar que el cliente existe
        IF NOT EXISTS (SELECT 1 FROM cliente WHERE cedula = @cedula)
        BEGIN
            RAISERROR('Cliente no existe.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Validar que el cliente tenga una membresía activa (fecha no expirada)
        IF NOT EXISTS (
            SELECT 1
            FROM cliente_membresias cm
            JOIN membresia m ON cm.id_membresia = m.id_membresia
            WHERE cm.cedula = @cedula AND m.fecha_expiracion >= CAST(GETDATE() AS DATE)
        )
        BEGIN
            RAISERROR('El cliente no tiene una membresía activa.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Validar que la clase existe
        IF NOT EXISTS (SELECT 1 FROM clase WHERE id_clase = @id_clase)
        BEGIN
            RAISERROR('Clase no existe.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Verificar que no esté duplicado
        IF EXISTS (SELECT 1 FROM cliente_clase WHERE cedula = @cedula AND id_clase = @id_clase)
        BEGIN
            RAISERROR('Cliente ya está inscrito en esta clase.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Insertar inscripción
        INSERT INTO cliente_clase (cedula, id_clase)
        VALUES (@cedula, @id_clase);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        DECLARE @err NVARCHAR(4000) = ERROR_MESSAGE();
        IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
        RAISERROR(@err, 16, 1);
    END CATCH
END;
GO



--Procedimiento almacenado transaccional para registrar la asistencia de una clase programada
CREATE OR ALTER PROCEDURE registrar_asistencia_cliente (
    @cedula CedulaRestringida,
    @id_sesion_programada INT,
	@asistio BIT
)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Validar existencia del cliente
        IF NOT EXISTS (
            SELECT 1 FROM cliente WHERE cedula = @cedula
        )
        BEGIN
            RAISERROR('Cliente no existe.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Validar existencia de la sesion programada
        IF NOT EXISTS (
            SELECT 1 FROM sesion_programada WHERE id_sesion_programada = @id_sesion_programada
        )
        BEGIN
            RAISERROR('Sesión programada no existe.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Obtener el ID de la clase asociada a la sesion programada
        DECLARE @id_clase INT;
        SELECT @id_clase = s.id_clase
        FROM sesion_programada sp
        JOIN sesion s ON sp.id_sesion = s.id_sesion
        WHERE sp.id_sesion_programada = @id_sesion_programada;

        -- Validar que el cliente este inscrito en esa clase
        IF NOT EXISTS (
            SELECT 1 FROM cliente_clase
            WHERE cedula = @cedula AND id_clase = @id_clase
        )
        BEGIN
            RAISERROR('El cliente no está inscrito en la clase de esta sesión.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Verificar si ya existe una asistencia registrada
        IF EXISTS (
            SELECT 1 FROM asistencia_cliente
            WHERE cedula = @cedula AND id_sesion_programada = @id_sesion_programada
        )
        BEGIN
            RAISERROR('Asistencia ya registrada.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Insertar la asistencia
		INSERT INTO asistencia_cliente (cedula, id_sesion_programada, asistio)
		VALUES (@cedula, @id_sesion_programada, @asistio);;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        DECLARE @err NVARCHAR(4000) = ERROR_MESSAGE();
        IF XACT_STATE() != 0 
		ROLLBACK TRANSACTION;
        RAISERROR(@err, 16, 1);
    END CATCH
END;
GO


GO
--Procedimiento almacenado transaccional para registrar el pago de membresia a un cliente
CREATE OR ALTER PROCEDURE registrar_pago_membresia (
    @cedula_cliente CedulaRestringida,
    @tipo_membresia TINYINT,
    @monto DECIMAL(10,2),
    @fecha_pago DATE,
    @id_forma_pago INT
)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Validaciones
        IF NOT EXISTS (SELECT 1 FROM cliente WHERE cedula = @cedula_cliente)
        BEGIN
            RAISERROR('Cliente no existe.', 16, 1);
            ROLLBACK;
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM formas_de_pago WHERE id_forma_pago = @id_forma_pago)
        BEGIN
            RAISERROR('Forma de pago no válida.', 16, 1);
            ROLLBACK;
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM tipo_membresia WHERE id_tipo_membresia = @tipo_membresia)
        BEGIN
            RAISERROR('Tipo de membresía inválido.', 16, 1);
            ROLLBACK;
            RETURN;
        END

        -- Desactivar vigentes
        UPDATE cliente_membresias
        SET vigente = 0
        WHERE cedula = @cedula_cliente;

        -- Insertar nueva membresia (el trigger la configura)
        DECLARE @id_membresia INT;
        INSERT INTO membresia (tipo) VALUES (@tipo_membresia);
        SELECT TOP 1 @id_membresia = id_membresia FROM membresia ORDER BY id_membresia DESC;

        INSERT INTO cliente_membresias (cedula, id_membresia, vigente)
        VALUES (@cedula_cliente, @id_membresia, 1);

        INSERT INTO pagos (fecha_pago, id_membresia, cedula_cliente, forma_pago, monto)
        VALUES (@fecha_pago, @id_membresia, @cedula_cliente, @id_forma_pago, @monto);

        COMMIT;
    END TRY
    BEGIN CATCH
       DECLARE @err NVARCHAR(4000) = ERROR_MESSAGE();
        IF XACT_STATE() != 0 
		ROLLBACK TRANSACTION;
        RAISERROR(@err, 16, 1);
    END CATCH
END;
GO


--Procedimiento almacenado transaccional para actualizar la membresia de un cliente
CREATE OR ALTER PROCEDURE actualizar_membresia_cliente (
    @cedula_cliente CedulaRestringida,
    @tipo_membresia TINYINT,
    @monto DECIMAL(10,2),
    @fecha_pago DATE,
    @id_forma_pago INT
)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Validaciones
        IF NOT EXISTS (SELECT 1 FROM cliente WHERE cedula = @cedula_cliente)
        BEGIN
            RAISERROR('Cliente no existe.', 16, 1);
            ROLLBACK;
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM formas_de_pago WHERE id_forma_pago = @id_forma_pago)
        BEGIN
            RAISERROR('Forma de pago no válida.', 16, 1);
            ROLLBACK;
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM tipo_membresia WHERE id_tipo_membresia = @tipo_membresia)
        BEGIN
            RAISERROR('Tipo de membresía inválido.', 16, 1);
            ROLLBACK;
            RETURN;
        END

        DECLARE @id_membresia INT;

        SELECT TOP 1 @id_membresia = m.id_membresia
        FROM cliente_membresias cm
        JOIN membresia m ON cm.id_membresia = m.id_membresia
        WHERE cm.cedula = @cedula_cliente AND m.tipo = @tipo_membresia
        ORDER BY m.fecha_expiracion DESC;

        IF @id_membresia IS NULL
        BEGIN
            RAISERROR('No existe membresía previa de ese tipo para el cliente.', 16, 1);
            ROLLBACK;
            RETURN;
        END

        -- Actualizar vigencia
        UPDATE cliente_membresias
        SET vigente = CASE 
            WHEN id_membresia = @id_membresia THEN 1 ELSE 0
        END
        WHERE cedula = @cedula_cliente;

        -- Registrar pago
        INSERT INTO pagos (fecha_pago, id_membresia, cedula_cliente, forma_pago, monto)
        VALUES (@fecha_pago, @id_membresia, @cedula_cliente, @id_forma_pago, @monto);

        COMMIT;
    END TRY
    BEGIN CATCH
	DECLARE @err NVARCHAR(4000) = ERROR_MESSAGE();
        IF XACT_STATE() != 0 
		ROLLBACK TRANSACTION;
        RAISERROR(@err, 16, 1);

    END CATCH
END;
GO





GO
--Procedimiento almacenado para renovar la membresia de un cliente
CREATE OR ALTER PROCEDURE renovar_membresia(
	@cedula CedulaRestringida,
    @monto DECIMAL(10,2),
    @id_forma_pago INT
)
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		BEGIN TRANSACTION;

		-- Validar existencia del cliente
		IF NOT EXISTS (
			SELECT 1 FROM cliente WHERE cedula = @cedula
		)
		BEGIN
			RAISERROR('El cliente no existe.', 16, 1);
			ROLLBACK TRANSACTION;
			RETURN;
		END

		-- Validar membresía activa
		IF NOT EXISTS (
			SELECT 1 FROM cliente_membresias WHERE cedula = @cedula
		)
		BEGIN
			RAISERROR('El cliente no tiene una membresía activa.', 16, 1);
			ROLLBACK TRANSACTION;
			RETURN;
		END

        -- Validar forma de pago
        IF NOT EXISTS (
            SELECT 1 FROM formas_de_pago WHERE id_forma_pago = @id_forma_pago
        )
        BEGIN
            RAISERROR('La forma de pago no es válida.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

		-- Obtener membresía actual
		DECLARE @id_membresia INT, @tipo TINYINT;
		SELECT 
			@id_membresia = cm.id_membresia,
			@tipo = m.tipo
		FROM cliente_membresias cm
		JOIN membresia m ON cm.id_membresia = m.id_membresia
		WHERE cm.cedula = @cedula;

		-- Calcular nueva fecha de expiración
		DECLARE @nueva_fecha DATE;
		SELECT @nueva_fecha =
			CASE @tipo
				WHEN 1 THEN DATEADD(DAY, 30, GETDATE())
				WHEN 2 THEN DATEADD(DAY, 90, GETDATE())
				WHEN 3 THEN DATEADD(DAY, 365, GETDATE())
				WHEN 4 THEN DATEADD(DAY, 180, GETDATE())
				WHEN 5 THEN DATEADD(DAY, 1, GETDATE())
				ELSE NULL
			END;

		IF @nueva_fecha IS NULL
		BEGIN
			RAISERROR('Tipo de membresía no válido para renovación.', 16, 1);
			ROLLBACK TRANSACTION;
			RETURN;
		END

		-- Actualizar la fecha de expiración
		UPDATE membresia
		SET fecha_expiracion = @nueva_fecha
		WHERE id_membresia = @id_membresia;

		-- Insertar pago asociado
		INSERT INTO pagos (
			fecha_pago,
			id_membresia,
			cedula_cliente,
			forma_pago,
			monto
		)
		VALUES (
			GETDATE(),
			@id_membresia,
			@cedula,
			@id_forma_pago,
			@monto
		);

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		DECLARE @error NVARCHAR(4000) = ERROR_MESSAGE();
		IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
		RAISERROR(@error, 16, 1);
	END CATCH
END;
GO


--Procedimiento almacenado transaccional para obtener estadisticas del gym
CREATE OR ALTER PROCEDURE obtener_estadisticas_acumuladas_por_fecha
    @fecha DATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Validación: la fecha no puede ser mayor a hoy
    IF @fecha > CAST(GETDATE() AS DATE)
    BEGIN
        RAISERROR('La fecha no puede ser mayor a la fecha actual.', 16, 1)
        RETURN;
    END

    SELECT
        (SELECT COUNT(*) FROM cliente WHERE CAST(fecha_registro AS DATE) <= @fecha) AS total_clientes,
        (SELECT COUNT(*) FROM entrenador WHERE CAST(fecha_contratacion AS DATE) <= @fecha) AS total_entrenadores,
        (SELECT COUNT(*) FROM clase) AS total_clases,
        (SELECT COUNT(*) FROM sesion_programada WHERE CAST(fecha AS DATE) <= @fecha) AS total_sesiones,
        (SELECT ISNULL(SUM(monto), 0) FROM pagos WHERE CAST(fecha_pago AS DATE) <= @fecha) AS total_pagos,
        (SELECT COUNT(*) FROM maquina) AS total_maquinas 
END;
GO

EXEC obtener_estadisticas_acumuladas_por_fecha '2025-05-23';

GO



GO



--Consulta avanzada 1: Ranking de clientes por numero de clases inscritas de manera descendente
SELECT 
    p.cedula,
    p.nombre + ' ' + p.apellido1 + ' ' + p.apellido2 AS nombre_completo,
    COUNT(cc.id_clase) AS total_clases,
    RANK() OVER (ORDER BY COUNT(cc.id_clase) DESC) AS posicion
FROM cliente_clase cc
JOIN persona p ON cc.cedula = p.cedula
GROUP BY p.cedula, p.nombre, p.apellido1, p.apellido2;


--Consulta avanzada 2: Clientes que tienen membresia proxima a vencer
SELECT 
    p.cedula,
    p.nombre + ' ' + p.apellido1 + ' ' + p.apellido2 AS nombre_completo,
    m.fecha_expiracion,
    DATEDIFF(DAY, GETDATE(), m.fecha_expiracion) AS dias_restantes
FROM cliente_membresias cm
JOIN membresia m ON cm.id_membresia = m.id_membresia
JOIN persona p ON cm.cedula = p.cedula
WHERE 
    m.fecha_expiracion >= CAST(GETDATE() AS DATE)
    AND m.fecha_expiracion < DATEADD(DAY, 7, CAST(GETDATE() AS DATE));




SELECT * FROM sesion_programada

--Consulta avanzada 3: Promedio de matriculados por grupo y detección de sobrecupo
SELECT 
    numero_grupo,
    cupo_disponible,
    cantidad_matriculados,
    CASE 
        WHEN cantidad_matriculados > cupo_disponible THEN 'Sobrecupo'
        WHEN cantidad_matriculados = cupo_disponible THEN 'Lleno'
        ELSE 'Disponible'
    END AS estado
FROM grupo;


--Consulta avanzada 4: distribucion de genero por estado de clientes 
SELECT 
    ec.estado,
    SUM(CASE WHEN g.genero = 'Masculino' THEN 1 ELSE 0 END) AS hombres,
    SUM(CASE WHEN g.genero = 'Femenino' THEN 1 ELSE 0 END) AS mujeres,
    COUNT(*) AS total
FROM cliente c
JOIN persona p ON c.cedula = p.cedula
JOIN generos g ON p.genero = g.id_genero
JOIN estados_clientes ec ON c.estado = ec.id_estado
GROUP BY ec.estado;



--Consulta avanzada 5: Cuenta la cantidades de sesiones por fecha
SELECT 
    c.nombre AS clase,
    sp.fecha AS fecha_sesion,
    COUNT(*) AS total_sesiones_en_fecha
FROM sesion s
JOIN clase c ON s.id_clase = c.id_clase
JOIN sesion_programada sp ON s.id_sesion = sp.id_sesion
GROUP BY c.nombre, sp.fecha
ORDER BY c.nombre, sp.fecha;




SELECT * FROM vista_clientes_sesion
