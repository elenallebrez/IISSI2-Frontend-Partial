Mediante un cambio en la interfaz de la edición de restaurantes, los propietarios podrán modificar el precio de todos los productos de un restaurante en cuestión de segundos.
- El acceso rápido consistirá en dos botones (flecha arriba y flecha abajo) en la vista de edición de restaurantes, que permiten modificar (incrementar o decrementar) el porcentaje que desea aplicarse al precio base de todos los productos del restaurante en cuestión. Este porcentaje puede ser positivo, lo que implica que se incrementa el precio base, o negativo, que implica un descuento sobre el precio base del producto. Por defecto, el valor de este campo será 0.
- Al pulsar sobre cada uno de los botones, el porcentaje se incrementará o decrementará en más/menos 0.5% con respecto al valor anterior de esta propiedad llamada 'percentage'.
- Una vez finalizados los cambios, el propietario pulsará sobre el botón guardar del formulario de edición de restaurante. Al pulsar este botón, el backend deberá actualizar no sólo la propiedad porcentaje del restaurante, sino también el precio de todos los productos de este, incrementando o decrementando el precio base en el porcentaje indicado. En caso de que el valor del campo sea distinto a 0, la aplicación debe pedir confirmación al propietario antes de guardar los cambios; utilice para ello el componente suministrado ConfirmationModal, similar al componente DeleteModal utilizado en clase.
- Debe crear una nueva propiedad llamada 'basePrice' en la entidad Product. Esta propiedad siempre contendrá el precio original del producto y tan sólo debe modificarse en los métodos create y update de ProductController. Tenga en cuenta que estos cambios ya se encuentran implementados en el proyecto base.

Al modificar el porcentaje, los productos pasarán a tener un precio igual al precio base más el porcentaje indicado:

precio_final = precio_base * (1 + (porcentaje_actual / 100))

Tenga en cuenta que este cambio DEBE persistir el precio del producto en la base de datos, aplicando el nuevo precio al listado de productos de dicho restaurante individualmente. Esto hará que todas las consultas relacionadas con dichos productos reciban la información actualizada. Se valorará el uso de transacciones.

Existe una limitación en el porcentaje para evitar incrementos u ofertas muy agresivas, de manera que el nuevo campo sólo podrá contener valores decimales entre-5 y 5 (excluidos ambos valores). Deberá asegurarse de que esta restricción se cumple tanto en el formulario de edición como en el método adecuado en el backend.

Realice todos los cambios necesarios en el proyecto de backend para implementar el nuevo requisito. Los test de backend esperan que la ruta sea: PUT /restaurants/:restaurantId y GET /restaurants/:restaurantId/products

## Backend
1. Añadir propiedad en Restaurant y a Product
2. Modificar Restaurant Validation en update para que tenga en 5 y -5
3. Editar funcion update para modificar el precio (Restaurant Controller)