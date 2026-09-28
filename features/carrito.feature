# language: es
@carrito
Característica: Carrito de compras
  Como cliente de Sauce Demo
  Quiero agregar productos al carrito y revisarlos
  Para saber exactamente qué voy a comprar

  Antecedentes:
    Dado que inicié sesión como "standard_user"

  @smoke @positivo
  Escenario: Agregar un producto al carrito desde la página de productos
    Cuando agrego el producto "Sauce Labs Backpack" al carrito
    Entonces el contador del carrito debería mostrar 1
    Y el botón del producto "Sauce Labs Backpack" debería decir "Remove"

  @smoke @positivo
  Escenario: Ver en el carrito los productos agregados
    Cuando agrego los siguientes productos al carrito:
      | producto              |
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
      | Sauce Labs Onesie     |
    Y abro el carrito
    Entonces debería ver en el carrito exactamente estos productos:
      | producto              | precio | cantidad |
      | Sauce Labs Backpack   | $29.99 | 1        |
      | Sauce Labs Bike Light | $9.99  | 1        |
      | Sauce Labs Onesie     | $7.99  | 1        |
    Y el contador del carrito debería mostrar 3

  @positivo
  Escenario: Quitar un producto desde la página de productos
    Dado que agregué el producto "Sauce Labs Bolt T-Shirt" al carrito
    Cuando quito el producto "Sauce Labs Bolt T-Shirt" desde la página de productos
    Entonces el carrito debería estar vacío
    Y el botón del producto "Sauce Labs Bolt T-Shirt" debería decir "Add to cart"

  @positivo
  Escenario: Quitar un producto desde el carrito
    Dado que agregué los siguientes productos al carrito:
      | producto                 |
      | Sauce Labs Fleece Jacket |
      | Sauce Labs Onesie        |
    Y abro el carrito
    Cuando quito el producto "Sauce Labs Onesie" del carrito
    Entonces debería ver en el carrito exactamente estos productos:
      | producto                 | precio | cantidad |
      | Sauce Labs Fleece Jacket | $49.99 | 1        |
    Y el contador del carrito debería mostrar 1

  @positivo
  Escenario: El carrito conserva los productos al cerrar sesión y volver a entrar
    Dado que agregué el producto "Sauce Labs Backpack" al carrito
    Cuando cierro sesión
    Y inicio sesión como "standard_user"
    Entonces el contador del carrito debería mostrar 1
