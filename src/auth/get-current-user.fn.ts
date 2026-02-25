import { createServerFn } from '@tanstack/react-start';
import { and, eq } from 'drizzle-orm';
import { redirect } from '@tanstack/react-router';
import { useAppSession } from './use-app-session';
import { db } from '@/db';
import { usuariosTable } from '@/db/schemas/usuarios.schema';

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(async () => {
  // Obtengo sesion
  const session = await useAppSession();
  const usuarioId = session.data.usuarioId;

  // Si no hay id de usuario no hay usuario logeado
  if (!usuarioId) {
    return null;
  }

  // Obtengo usuario
  const usuarios = await db
    .select({
      id: usuariosTable.id,
      username: usuariosTable.username,
      apellido: usuariosTable.apellido,
      nombre: usuariosTable.nombre,
    })
    .from(usuariosTable)
    .where(and(eq(usuariosTable.id, usuarioId), eq(usuariosTable.activo, true)));

  // Si no existe el usuario o no esta activo, cierro sesion y redirijo a la página principal
  if (usuarios.length === 0) {
    await session.clear();
    throw redirect({ to: '/' });
  }

  return usuarios[0];
});
