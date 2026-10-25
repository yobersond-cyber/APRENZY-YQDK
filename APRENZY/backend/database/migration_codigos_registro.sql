-- Ejecutar UNA SOLA VEZ sobre la base de datos aprenzy existente.
-- Haz una copia de seguridad antes de aplicar cambios.
USE aprenzy;

ALTER TABLE colegio ADD COLUMN codigo_institucion VARCHAR(32) NULL UNIQUE;
ALTER TABLE curso ADD COLUMN codigo_acceso VARCHAR(32) NULL UNIQUE;

-- Rellena automáticamente códigos aleatorios para registros existentes.
UPDATE colegio SET codigo_institucion = UPPER(SUBSTRING(REPLACE(UUID(), '-', ''), 1, 8)) WHERE codigo_institucion IS NULL;
UPDATE curso SET codigo_acceso = UPPER(SUBSTRING(REPLACE(UUID(), '-', ''), 1, 8)) WHERE codigo_acceso IS NULL;

ALTER TABLE colegio MODIFY codigo_institucion VARCHAR(32) NOT NULL;
ALTER TABLE curso MODIFY codigo_acceso VARCHAR(32) NOT NULL;
