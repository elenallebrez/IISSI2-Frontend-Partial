## Enunciado
Una vez se ha puesto en marcha la primera versión de DeliverUS, los inversores han solicitado la inclusión de una nueva funcionalidad que consiste en ofrecer a los propietarios la posibilidad de establecer un momento en el que los productos dejarán de ser visibles (visibleUntil).

Un propietario podrá establecer este momento al crear o actualizar un producto con dos escenarios posibles:
- Por defecto, este momento será nulo, por lo que se considera que siempre estará visible.
- Si un propietario establece este momento, el producto solo estará visible hasta la fecha (inclusive).

Además se deben cumplir las siguientes reglas de negocio:
- Un propietario no podrá establecer un momento de fin anterior al momento actual.
- Un propietario no podrá establecer un producto como no disponible y, al mismo tiempo, un momento de fin.

Finalmente, los productos que estén a una semana o menos de desaparecer aparecerán en la interfaz marcados

## Backend
Nada mas empezar, ejecuta el test para ver que nos estan pidiendo

1. Añadir la nueva propiedad a Products
2. Modificar la funcion show (Restaurant Controller)
3. Modificar ProductValidation create y update