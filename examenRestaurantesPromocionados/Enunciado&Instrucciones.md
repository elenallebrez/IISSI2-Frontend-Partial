## Enunciado
Se desea permitir a los dueños de restaurantes promocionar sus restaurantes. Un dueño podrá promocionar un restaurante de dos maneras distintas:
- En el formulario de creación y/o edición de restaurante. Por defecto, se seleccionará la opción de no promocionado. Si el propietario indica que el nuevo restaurante debe estar promocionado, pero ya existían restaurantes promocionados del mismo dueño, al pulsar el botón Save se mostrará un error y no se creará o editará el restaurante.
- En la pantalla de "Mis restaurantes", mediante un botón mostrado junto a cada restaurante, que permitirá mediante su pulsación promocionar el restaurante en cuestión. Si el propietario pulsa el botón para promocionar un nuevo restaurante y ya existían otros restaurantes promocionados del mismo dueño, se procederá a promocionar el restaurante indicado y se marcará como "no promocionado" el restaurante que lo fuese anteriormente.

Además, los restaurantes promocionados aparecerán siempre al principio de los listados de restaurantes que se le presentan tanto a los dueños como a los clientes.

## Backend
1. Añadir propiedades a Restaurant
2. Añadir checkOnlyOnePromoted a las validaciones (Restaurant Validation)
3. Añade la validacion a create y update (Restaurant Validation)
4. Funcion de promote en Restaurant Controller
5. Añadir nuevo orden al index e indexOwner Restaurant Controller
6. Crear ruta

## Frontend

1. Añadir Endpoint
2. Crear useState
3. Añadir boton
4. Añadir funcion llamando a la del endpoint
5. Crear Confirmation Modal
6. Crear el badge
7. Añadir propiedad a create Restaurant Screen
8. Añadir Switch