import { createServerFn } from '@tanstack/react-start';
import { listarEdicionesCatastro, publicarEdicionCatastro, publicarSchema } from './ediciones.server';

export const getEdicionesCatastroFn = createServerFn({ method: 'GET' }).handler(async () => listarEdicionesCatastro());
export const publicarEdicionCatastroFn = createServerFn({ method: 'POST' }).validator(publicarSchema).handler(publicarEdicionCatastro);
