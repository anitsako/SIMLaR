-- Custom SQL migration file, put your code below! --
TRUNCATE TABLE public.proyectos_mineros_etapas RESTART IDENTITY CASCADE;

-- Etapas basicas
INSERT INTO public.proyectos_mineros_etapas (nombre,color,usuario_creador_id,usuario_modificador_id) VALUES
	 ('Exploración','red',1,1),
	 ('Prospección','blue',1,1),
	 ('Proyecto de inversión','green',1,1);
