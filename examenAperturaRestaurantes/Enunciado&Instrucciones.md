## Enunciado
La empresa ha decidido ofrecer a los propietarios la posibilidad de cambiar manualmente el estado de sus restaurantes abiertos (online u offline).
(Nos están indicando que la nueva funcionalidad es solo para los propietarios, luego en la nueva ruta que hagamos tenemos que verificar que el usuario sea owner.)

En caso de que un restaurante tenga un estado online u offline, la nueva funcionalidad proporcionaría un botón para alternar entre ambos estados. De lo contrario, dicho botón no debe estar disponible.
(Crear la lógica que altere el estado del restaurante al pulsar el botón, tendremos que hacerlo en el RestaurantController)

Tenga en cuenta que cualquier restaurante nuevo se almacena inicialmente como offline de forma predeterminada. Solo los restaurantes offline pueden estar en línea y viceversa.

Por otro lado, si un restaurante alcanza un estado de cerrado o cerrado temporalmente, la posibilidad de cambio manual no estará disponible y su uso estará prohibido por el sistema.

Además, tenga en cuenta que un restaurante tampoco podrá cambiar su estado si tiene pedidos con un valor nulo en deliveredAt.
(Tenemos que crear la restricción que impida cambiar el estado de aquellos que no se encuentran en online u offline.
Además de la restricción que impide que si deliveredAt es nula tampoco se puede cambiar el estado.
Ambas restricciones las añadimos al Middleware de Restaurant.)

La nueva funcionalidad también implicará proporcionar la lista de restaurantes propiedad del usuario ordenados por estado (ascendentemente) y, para el mismo estado, por nombre.
(Tenemos que mostrar el listado de restaurantes en orden ascendente según el estado y después por el nombre, luego las funciones show del restaurantController deben tener ese orden específico.)

Finalmente, el estado de cada restaurante debe ser visible -> FRONTEND

## Backend

**¿Cómo se resuelve?**
1. Añadir nueva propiedad status, ENUM (Restaurant Model y create restaurant)
2. Añadir deliveredAt en modelo Order, pudiendo ser nula
3. Crear logica de la nueva funcion a implementar, si el restaurante tiene estado Online poder ponerlo Offline, y viceversa. (RestaurantController)
4. Añadir nuevas restricciones, si esta cerrado no se puede usar y no poder cambiar el estado de los pedidos con valor nulo en deliveredAt (middleware)
5. Añadr orden en index e indexOwner del RestaurantController
6. Añadir nueva ruta

## Frontend

**¿Cómo se resuelve?**
1. Añadir nueva funcion al endpoint
2. Añadir el botón en Restaurant Screen
3. Crear useState que cambiará cuando pinchamos en el botón
4.  Crear la función que asociaremos al botón para actualizar el estado del restaurante.
5.  Crear Modal
