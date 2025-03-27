## Enunciado
Una vez se ha puesto en marcha la primera versión de DeliverUS, los inversores han solicitado la inclusión de una nueva funcionalidad que consiste en ofrecer a los propietarios la posibilidad de registrar actuaciones musicales en directo para darle publicidad.

1. En la pantalla "Restaurants" aparecerá un nuevo botón "Nueva actuación" que lleva al formulación de creación de actuación. Si queda menos de una semana para alguna actuación, aparecerá el aviso "¡Próxima actuación!".
2. En la pantalla "CreatePerformance" aparece un formulario para registrar una nueva actuación, para la que se pedirá el nombre del grupo y la fecha en la que tendrá lugar. Solo podrá haber una actuación por día. Todos los campos son obligatorios.
3. En la pantalla de "RestaurantDetail" aparecerá en su cabecera la información de las próximas actuaciones debajo de la información del restaurante, siempre que quede menos de una semana, ordenadas por proximidad temporal.

Realice todos los cambios necesarios en el proyecto de backend para implementar el nuevo requisito. 
Los test de backend esperan que haya una nueva ruta: 
/performances y que los campos de la tabla "Performances" sean "id", "group", "appointment" y "restaurantId".

## Backend
Nos dan un nuevo modelo Performance, que se espera que los parámetros(campos de la tabla"Performances")sean"id","group","appointment"y"restaurantId".
 
Además, dice que las asociaciones son:Entre Restaurant y Performance va a ser: 1 restaurante -> varias actuaciones.

**¿Cómo se resuelve?**
1. Añadir el modelo de Performance a la carpeta de models, y la asociación al RestaurantModels
2. Añadir Performance a models.js
3. Añadir Performance en migrations
4. Hacer las validations de Performance
5. Hacer PerformanceController añadir el crear una performance
6. Hacer middleware de la performance relacionado con el ownership
7. Añadir en index, indexOwner y show (RestaurantController)
8. Hacer ruta