-- Custom SQL migration file, put your code below! --
TRUNCATE TABLE public.proyectos_mineros_tipos RESTART IDENTITY CASCADE;

-- Tipos basicos
INSERT INTO public.proyectos_mineros_tipos (nombre,color,usuario_creador_id,usuario_modificador_id) VALUES
	 ('Metalífero','red',1,1),
	 ('No metalífero','blue',1,1);
