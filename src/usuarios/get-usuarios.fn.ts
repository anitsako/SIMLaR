import { createServerFn } from '@tanstack/react-start';
import { db } from '../db';
import { usuariosTable } from '@/db/schemas/usuarios.schema';

export const getUsuariosFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  return db
    .select({
      id: usuariosTable.id,
      username: usuariosTable.username,
      apellido: usuariosTable.apellido,
      nombre: usuariosTable.nombre,
      email: usuariosTable.email,
      esAdmin: usuariosTable.esAdmin,
    })
    .from(usuariosTable)
    .orderBy(usuariosTable.apellido, usuariosTable.nombre);
});
