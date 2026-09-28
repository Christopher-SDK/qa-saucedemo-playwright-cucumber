// Todos los usuarios de Sauce Demo comparten la misma contraseña. La leo de una variable
// de entorno (con el valor público por defecto) para no dejar credenciales regadas en los steps.
const password = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

/**
 * Usuarios que ofrece Sauce Demo. En los features solo escribo el nombre del usuario
 * ("standard_user") y aquí resuelvo su contraseña; así el Gherkin queda limpio.
 */
export const users = {
  standard_user: { username: 'standard_user', password },
  locked_out_user: { username: 'locked_out_user', password },
  problem_user: { username: 'problem_user', password },
  performance_glitch_user: { username: 'performance_glitch_user', password },
  error_user: { username: 'error_user', password },
  visual_user: { username: 'visual_user', password },
} as const;

export type UserName = keyof typeof users;

export function getUser(name: string) {
  const user = users[name as UserName];
  if (!user) {
    // Prefiero que falle con un mensaje claro a que intente loguear con undefined.
    throw new Error(`El usuario "${name}" no está definido en src/data/users.ts`);
  }
  return user;
}
