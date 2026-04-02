-- Custom SQL migration file, put your code below! --

TRUNCATE TABLE public.aeropuertos RESTART IDENTITY;

INSERT INTO public.aeropuertos (geom,nombre,tipo) VALUES
	 ('SRID=4326;POINT (-66.29936247777142 -30.339197563527087)'::public.geometry,'BASE AEREA CHAMICAL','AERODROMO'),
	 ('SRID=4326;POINT (-66.79368986720411 -29.379352980964875)'::public.geometry,'CAPITAN VICENTE ALMANDOS ALMON','AEROPUERTO');
