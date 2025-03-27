## Enunciado
Se desea permitir a los dueños de restaurantes promocionar los productos de sus restaurantes.
Un dueño podrá promocionar un producto dentro de un restaurante de dos maneras distintas:
- En el formulario de creación y/o edición de producto. Por defecto, se seleccionará la opción de no promocionado. Si el propietario indica que el producto debe estar promocionado, pero ya existían productos promocionados del mismo restaurante, al pulsar el botón Save se mostrará un error y no se creará o editará el producto. El mecanismo de promocionar o no producto, en este caso, será un deslizable.
- En la pantalla de "Detalles del restaurante", mediante un botón mostrado junto a cada producto, que permitirá mediante su pulsación promocionar el producto en cuestión. Si el propietario pulsa el botón para promocionar un nuevo producto y ya existían otros productos promocionados del mismo restaurante, se procederá a promocionar el producto indicado y se marcará como "no promocionado" el producto que lo fuese con anterioridad. La aplicación debe pedir confirmación al propietario cuando se pulse el botón; utilice para ello el componente suministrado ConfirmationModal, similar al componente DeleteModal utilizado en la asignatura.

Además, los productos promocionados aparecerán siempre al principio de los listados de productos que se le presenten tanto a los dueños como a los clientes dentro de un cierto restaurante.

Además de presentarse al principio, los productos promocionados deben destacarse visualmente, por lo que aparecerá una etiqueta de texto Promoted! con brandSuccess; por su contra, aparecerá Not promoted con brandPrimary

## Backend
Estamos trabajando sobre el modelo Product, en el cual vamos a definir una nueva propiedad llamada promoted que va a ser un booleano que tome valor true si está promocionado o valor false si no está promocionado.

**¿Cómo se resuelve?**
1. Añadir propiedad promoted a Product (Modelo y Migration)
2. Validación SOLO UN producto promocionado (Si el propietario indica que el producto debe estar promocionado, pero ya existen productos promocionados en el mismo restaurante, al pulsar el botón "Save" se mostrará un error y no se creará ni editará el producto.)
3. Añadir la validacion a create y update
4. Funcion promote (ver con transacciones y sin transacciones)
5. Editar show para que aparezcan primeros los promocionados (show Restaurant Controller)
6. Ruta