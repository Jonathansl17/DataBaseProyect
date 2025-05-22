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
	cedula_persona CedulaRestringida	NOT NULL,
	telefono TelefonoRestringido		NOT NULL,
	PRIMARY KEY (cedula_persona, telefono),
	CONSTRAINT FK_cedula_persona_tel FOREIGN KEY (cedula_persona) REFERENCES persona(cedula)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

-- Tabla entrenador
CREATE TABLE entrenador(
	cedula  CedulaRestringida			NOT NULL,
	fecha_contratacion DATE				NOT NULL DEFAULT GETDATE(),
	tipo VARCHAR(20)					NOT NULL,
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
	cedula			 CedulaRestringida		NOT NULL,
	estado			TINYINT					NOT NULL,
	fecha_registro	DATE					NOT NULL DEFAULT GETDATE(),

	CONSTRAINT PK_cedula_cliente PRIMARY KEY(cedula),
	CONSTRAINT FK_cliente_persona FOREIGN KEY(cedula) REFERENCES persona(cedula)
	ON DELETE CASCADE
	ON UPDATE CASCADE
)

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

	CONSTRAINT PK_cliente_membresias PRIMARY KEY(cedula, id_membresia)
)


--Tabla de membresias
CREATE TABLE membresia(
	id_membresia		INT				NOT NULL,
	fecha_expiracion	DATE			NOT NULL,
	tipo				TINYINT			NOT NULL

	CONSTRAINT PK_id_membresia_membresia PRIMARY KEY(id_membresia)
)


--Tabla de los tipos de membresia
CREATE TABLE tipo_membresia(
	id_tipo_membresia		TINYINT				NOT NULL,
	tipo					VARCHAR(30)			NOT NULL,

	CONSTRAINT PK_id_tipo_tipo_membresia PRIMARY KEY(id_tipo_membresia)
)


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
	descripcion	VARCHAR(200)	NOT NULL

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
	numero_grupo TINYINT NOT NULL,
	cupo_disponible TINYINT NOT NULL,
	cantidad_matriculados TINYINT NOT NULL,
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

-- Tabla asistencia
CREATE TABLE asistencia (
	id_asistencia INT NOT NULL,
	fecha DATE NOT NULL,
	CONSTRAINT PK_asistencia PRIMARY KEY (id_asistencia)
);
GO

-- Tabla intermedia sesion
CREATE TABLE sesion (
	numero_grupo TINYINT NOT NULL,
	id_horario INT NOT NULL,
	id_asistencia INT NOT NULL,
	id_clase INT NOT NULL,
	CONSTRAINT PK_sesion PRIMARY KEY (numero_grupo, id_horario, id_asistencia, id_clase)
)
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

--FK: sesion->asistencia
ALTER TABLE sesion
ADD CONSTRAINT FK_sesion_asistencia FOREIGN KEY (id_asistencia)
REFERENCES asistencia(id_asistencia)
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



--Checks para validaciones de datos
ALTER TABLE grupo
ADD CONSTRAINT CK_grupo_cupos CHECK (cantidad_matriculados <= cupo_disponible);



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
INSERT INTO persona (cedula, nombre, apellido1,apellido2, genero, distrito, correo, fecha_nacimiento, edad) VALUES
(118560552,'Luis','Castro','Madriz',1,1,'luis@correo.com','1990-05-15',5),
(203456789,'María','Soto','Rodriguez',2,2,'maria@correo.com','1995-03-22',29),
(304567890,'Carlos','Mora','Vazques',1,3,'carlos@correo.com','1985-11-30',38),
(409876543,'Ana','Rojas','Mora',2,4,'ana@correo.com','1998-07-09',25),
(512345678,'Javier','Chacón','Rojas',1,5,'javier@correo.com','2000-01-01',24),
(612345678,'Paula','Ramírez','Sanchez',2,6,'paula@correo.com','1994-06-12',30),
(701234567,'Diego','Fernández','Perez',1,7,'diego@correo.com','1992-08-19',32),
(812345679,'Sofía','Campos','Retana',2,8,'sofia@correo.com','1996-12-01',27),
(902345678,'Marco','Quesada','Carrera',1,9,'marco@correo.com','1989-02-28',35),
(100123456,'Valeria','Chinchilla','Lopez',2,10,'valeria@correo.com','2001-04-04',23);

-- Tabla telefonos_personas
INSERT INTO telefonos_personas (cedula_persona, telefono) VALUES
(118560552,88881234),(203456789,89994321),(304567890,87001234),
(409876543,88009876),(512345678,86543210),(612345678,89000000),
(701234567,85005050),(812345679,83003333),(902345678,84555555),
(100123456,80000001);

-- Tabla entrenador
INSERT INTO entrenador (cedula, fecha_contratacion, tipo) VALUES
(118560552,'2020-01-01','Personal'),
(203456789,'2021-06-15','Funcional');

-- Tabla administrador
INSERT INTO administrador (cedula, fecha_contratacion) VALUES
(304567890,'2020-01-01'),
(409876543,'2021-01-01'),
(512345678,'2022-01-01');

-- Tabla estados_clientes
INSERT INTO estados_clientes (id_estado, estado) VALUES
(1,'Activo'),(2,'Inactivo'),(3,'Suspendido'),
(4,'Revisión'),(5,'Retirado'),(6,'Nuevo'),(7,'Congelado'),(8,'Bloqueado'),
(9,'Prueba'),(10,'Otros');

-- Tabla cliente
INSERT INTO cliente (cedula, estado, fecha_registro) VALUES
(612345678,1,'2022-01-01'),(701234567,2,'2022-02-01'),
(812345679,3,'2023-01-01'),(902345678,4,'2024-01-01'),
(100123456,5,'2024-02-01');

-- Tabla tipo_membresia
INSERT INTO tipo_membresia (id_tipo_membresia, tipo) VALUES
(1,'Mensual'),(2,'Trimestral'),(3,'Anual'),
(4,'Semestral'),(5,'Diaria'),(6,'Free'),(7,'Promo'),
(8,'VIP'),(9,'Combo'),(10,'Ilimitado');

-- Tabla membresia
INSERT INTO membresia (id_membresia, fecha_expiracion, tipo) VALUES
(1,'2024-06-01',1),(2,'2024-09-01',2),(3,'2025-05-01',3),
(4,'2024-12-01',4),(5,'2024-05-04',5),(6,'2024-05-05',6),
(7,'2024-05-06',7),(8,'2024-05-07',8),(9,'2024-05-08',9),
(10,'2024-05-09',10);

-- Tabla cliente_membresias
INSERT INTO cliente_membresias (cedula, id_membresia) VALUES
(612345678,1),(701234567,2),(812345679,3),
(902345678,4),(100123456,5);

-- Tabla clase
INSERT INTO clase (id_clase, nombre, descripcion) VALUES
(1,'Zumba','Ejercicio de baile'),(2,'Spinning','Bicicleta'),
(3,'Yoga','Estiramiento'),(4,'Crossfit','Alta intensidad'),
(5,'Pilates','Cuerpo y mente'),(6,'Boxeo','De contacto'),
(7,'HIIT','Intervalos'),(8,'Funcional','Movimientos útiles'),
(9,'Stretching','Flexibilidad'),(10,'TRX','Con suspensión');

-- Tabla cliente_clase
INSERT INTO cliente_clase (cedula, id_clase) VALUES
(612345678,1),(701234567,2),(812345679,3),
(902345678,4),(100123456,5);

-- Tabla entrenador_clase
INSERT INTO entrenador_clase (cedula, id_clase) VALUES
(118560552,6),(203456789,7);

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
(304567890,1,'2024-01-01',1),(409876543,2,'2024-01-01',1),
(512345678,3,'2024-01-01',1),(304567890,4,'2024-01-01',1),
(409876543,5,'2024-01-01',1);

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

-- Tabla asistencia
INSERT INTO asistencia (id_asistencia, fecha) VALUES
(1,'2024-05-01'),(2,'2024-05-02'),(3,'2024-05-03'),
(4,'2024-05-04'),(5,'2024-05-05'),(6,'2024-05-06'),
(7,'2024-05-07'),(8,'2024-05-08'),(9,'2024-05-09'),(10,'2024-05-10');

-- Tabla sesion
INSERT INTO sesion (numero_grupo, id_horario, id_asistencia, id_clase) VALUES
(1,1,1,1),(2,2,2,2),(3,3,3,3),(4,4,4,4),(5,5,5,5),
(6,6,6,6),(7,7,7,7),(8,8,8,8),(9,9,9,9),(10,10,10,10);


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
SELECT * FROM asistencia;
SELECT * FROM sesion;
GO


--Vista de clientes general
CREATE VIEW vista_clientes
AS
SELECT
	p.nombre,
	p.apellido1,
	p.apellido2,
    c.cedula,
    c.fecha_registro,
    m.fecha_expiracion,
    tm.tipo AS tipo_membresia,
    ec.estado AS estado_cliente
FROM 
    cliente c
	JOIN persona p ON c.cedula = p.cedula
    JOIN cliente_membresias cm ON c.cedula = cm.cedula
    JOIN membresia m ON cm.id_membresia = m.id_membresia
    JOIN tipo_membresia tm ON m.tipo = tm.id_tipo_membresia
    JOIN estados_clientes ec ON c.estado = ec.id_estado
	GO

SELECT * FROM vista_clientes
GO


--Procedimiento almacenado transaccional para insertar un cliente
CREATE PROCEDURE insertar_cliente (
    @cedula CedulaRestringida,
    @nombre NombreYApellidosLimpios,
    @apellido1 NombreYApellidosLimpios,
    @apellido2 NombreYApellidosLimpios,
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

        IF EXISTS (SELECT 1 FROM persona WHERE cedula = @cedula)
        BEGIN
            RAISERROR('El cliente ya existe', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF NOT EXISTS (SELECT * FROM distritos WHERE id_distrito = @distrito)
        BEGIN
            RAISERROR('El distrito no existe', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END


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


        INSERT INTO cliente (cedula, estado)
        VALUES (@cedula, 1);

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

/*
EXEC insertar_cliente
    @cedula = 880123236,
    @nombre = 'Juan',
    @apellido1 = 'Pérez',
	@apellido2 = 'Gómez',
    @genero = 1,
	@distrito = 1,  
    @correo = 'juan@example.com',
	@fecha_nacimiento = '1990-05-19',
    @edad = 35;

EXEC eliminar_persona '880123236'
SELECT * FROM persona WHERE cedula = '880123236'
/*