import { and, eq } from 'drizzle-orm';
import { useAppSession } from '@/auth/use-app-session';
import { db } from '@/db';
import { usuariosTable } from '@/db/schemas/usuarios.schema';

export async function requireCatastroAdmin() {
  const session = await useAppSession();
  if (!session.data.usuarioId) throw new Error('Iniciá sesión para administrar el catastro.');
  const [user] = await db.select({ id: usuariosTable.id }).from(usuariosTable).where(and(
    eq(usuariosTable.id, session.data.usuarioId),
    eq(usuariosTable.activo, true),
    eq(usuariosTable.esAdmin, true),
  ));
  if (!user) throw new Error('Solo un administrador activo puede publicar o modificar el catastro.');
  return user.id;
}
