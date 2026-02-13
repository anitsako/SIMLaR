-- Custom SQL migration file, put your code below! --
TRUNCATE TABLE public.usuarios RESTART IDENTITY;

-- Usuario admin con contraseña Adm1nAdm1n
INSERT INTO public.usuarios (username,hash_password,apellido,nombre) VALUES
	 ('admin','$2b$12$6pia7KLp/uw.rXgS9ZHLL.9MqXHhxQA.CbYibhgXS3DYod6sPyMLK','admin','admin');
