## Enunciado
Después del lanzamiento inicial de DeliverUS, los inversores solicitaron una nueva función que permita a los propietarios fijar sus restaurantes. Cada propietario puede marcar tantos restaurantes como desee.

Un propietario puede fijar restaurantes de dos maneras diferentes:
- En el formulario de creación de restaurante. De forma predeterminada, no se fijará, pero el propietario puede optar por fijarlo. Para hacer esto, Switch se debe proporcionar un que funcione con una propiedad llamada pinned. Si Switch está marcado, el restaurante debe crearse como fijado. El backend espera que la pinned propiedad sea booleana y opcional. Si la propiedad no está presente, se debe crear como no fijada.
- En la pantalla Mis Restaurantes, a través de un icono que actuará como botón y se mostrará al lado de cada restaurante.
 
Finalmente, los restaurantes fijados siempre aparecerán en la parte superior de las listas de restaurantes presentadas a su propietario y estarán ordenados por la fecha en que fueron fijados (los más antiguos primero), seguidos de los que no están fijados.

Realice todos los cambios necesarios en el proyecto backend para implementar el nuevo requisito. Las pruebas de backend esperan que la ruta sea: PATCH /restaurants/:restaurantId/togglePiny que los restaurantes tengan una nueva propiedad llamada pinnedAt

## Backend

1. Añadir nueva propiedad a Restaurant (pinnedAt, que es tipo Date)
2. Cambiar indexOwner (RestaurantController) y create
3. Implementar toggledRestaurant
4. Añadir Restaurant Validations
5. Crear ruta