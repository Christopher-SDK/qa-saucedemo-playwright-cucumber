# language: es
@compra
Característica: Proceso de compra
  Como cliente de Sauce Demo
  Quiero completar el checkout de los productos de mi carrito
  Para poder adquirir los productos que necesito

  Antecedentes:
    Dado que inicié sesión como "standard_user"

  @smoke @positivo @e2e
  Escenario: Completar la compra de un producto hasta la confirmación
    Dado que agregué el producto "Sauce Labs Backpack" al carrito
    Y abro el carrito
    Cuando inicio el checkout
    Y ingreso mis datos de envío:
      | nombre | apellido | código postal |
      | Ana    | Torres   | 15001         |
    Y continúo con el checkout
    Entonces el resumen de la compra debería listar los productos que agregué
    Cuando finalizo la compra
    Entonces debería ver la confirmación "Thank you for your order!"
    Y el carrito debería estar vacío

  @positivo @e2e
  Escenario: El resumen calcula bien subtotal, impuesto y total con varios productos
    Dado que agregué los siguientes productos al carrito:
      | producto                          |
      | Sauce Labs Backpack               |
      | Sauce Labs Bike Light             |
      | Test.allTheThings() T-Shirt (Red) |
    Y abro el carrito
    Cuando inicio el checkout
    Y ingreso datos de envío válidos
    Y continúo con el checkout
    Entonces el resumen de la compra debería listar los productos que agregué
    Y el subtotal debería ser la suma de los precios de los productos
    Y el impuesto debería ser el 8% del subtotal
    Y el total debería ser el subtotal más el impuesto

  @negativo
  Esquema del escenario: No se puede avanzar en el checkout sin <campo>
    Dado que agregué el producto "Sauce Labs Onesie" al carrito
    Y abro el carrito
    Cuando inicio el checkout
    Y ingreso mis datos de envío:
      | nombre   | apellido   | código postal |
      | <nombre> | <apellido> | <cp>          |
    Y continúo con el checkout
    Entonces debería ver el mensaje de error "<mensaje>"
    Y debería seguir en el paso de datos de envío

    Ejemplos:
      | campo             | nombre | apellido | cp    | mensaje                        |
      | nombre            |        | Torres   | 15001 | Error: First Name is required  |
      | apellido          | Ana    |          | 15001 | Error: Last Name is required   |
      | código postal     | Ana    | Torres   |       | Error: Postal Code is required |

  @positivo
  Escenario: Cancelar en el resumen devuelve al catálogo sin perder el carrito
    Dado que agregué el producto "Sauce Labs Bike Light" al carrito
    Y abro el carrito
    Cuando inicio el checkout
    Y ingreso datos de envío válidos
    Y continúo con el checkout
    Y cancelo la compra
    Entonces debería ver el catálogo de productos
    Y el contador del carrito debería mostrar 1
