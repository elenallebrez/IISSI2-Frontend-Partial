## Enunciado
Se desea permitir a los dueños de restaurantes crear sus propias categorías de restaurantes.

Al volver a la pantalla de creación de restaurantes tras introducir la nueva categoría, dicha categoría debe estar disponible en la lista desplegable de categorías de restaurantes.

No se debe permitir la creación de una categoría que ya existiera. En dicho caso, el Backend debe responder con un error que será visualizado en la pantalla de creación de categorías de restaurantes al pulsar el botón de submit. Además, el tamaño máximo para los nombres de las categorías de restaurante será de 50 caracteres. Esta restricción debe comprobarse tanto a nivel de formulario en el Frontend como a nivel de Backend

## Backend

1. Añadir propiedades a Restaurant Category y create Restaurant Category
2. Añadir funcion checkCategoryExists en RestauarantCategoryValidation
3. Añadir restriccion del String y nueva funcion en el custom
4. Funcion crear nueva categoria
5. Crear ruta