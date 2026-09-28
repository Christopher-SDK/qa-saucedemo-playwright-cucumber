# language: es
@login
Característica: Inicio de sesión
  Como cliente de Sauce Demo
  Quiero iniciar sesión con mis credenciales
  Para poder acceder al catálogo de productos

  Antecedentes:
    Dado que estoy en la página de inicio de sesión

  @smoke @positivo
  Escenario: Inicio de sesión exitoso con el usuario estándar
    Cuando inicio sesión como "standard_user"
    Entonces debería ver el catálogo de productos

  @smoke @negativo
  Escenario: El usuario bloqueado no puede iniciar sesión
    Cuando inicio sesión como "locked_out_user"
    Entonces debería ver el mensaje de error "Epic sadface: Sorry, this user has been locked out."
    Y debería seguir en la página de inicio de sesión

  @negativo
  Esquema del escenario: No se puede iniciar sesión con credenciales inválidas: <caso>
    Cuando ingreso el usuario "<usuario>" y la contraseña "<contraseña>"
    Entonces debería ver el mensaje de error "<mensaje>"
    Y debería seguir en la página de inicio de sesión

    Ejemplos:
      | caso                           | usuario          | contraseña    | mensaje                                                                   |
      | contraseña incorrecta          | standard_user    | clave_erronea | Epic sadface: Username and password do not match any user in this service |
      | usuario que no existe          | usuario_fantasma | secret_sauce  | Epic sadface: Username and password do not match any user in this service |
      | usuario en mayúsculas          | STANDARD_USER    | secret_sauce  | Epic sadface: Username and password do not match any user in this service |
      | usuario vacío                  |                  | secret_sauce  | Epic sadface: Username is required                                        |
      | contraseña vacía               | standard_user    |               | Epic sadface: Password is required                                        |
      | ambos campos vacíos            |                  |               | Epic sadface: Username is required                                        |

  @negativo @seguridad
  Escenario: No se puede entrar al catálogo sin haber iniciado sesión
    Cuando intento abrir directamente la página del catálogo
    Entonces debería ver el mensaje de error "Epic sadface: You can only access '/inventory.html' when you are logged in."
    Y debería seguir en la página de inicio de sesión

  @positivo
  Escenario: Cerrar sesión devuelve al usuario al inicio de sesión
    Dado que inicio sesión como "standard_user"
    Cuando cierro sesión
    Entonces debería seguir en la página de inicio de sesión
    Y al intentar abrir directamente la página del catálogo debería ser rechazado

  # Sauce Demo trae más perfiles además de los dos que pide el reto. Los incluyo porque
  # performance_glitch_user demora varios segundos en entrar: si la suite tuviera esperas
  # fijas en vez de esperas inteligentes, este caso sería el primero en fallar.
  @positivo @otros-usuarios
  Esquema del escenario: Otros perfiles de usuario habilitados pueden iniciar sesión: <usuario>
    Cuando inicio sesión como "<usuario>"
    Entonces debería ver el catálogo de productos

    Ejemplos:
      | usuario                 |
      | problem_user            |
      | performance_glitch_user |
      | error_user              |
      | visual_user             |
