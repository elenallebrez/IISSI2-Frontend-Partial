## Enunciado
Se desea permitir a los dueños de restaurantes destacar los productos de sus restaurantes. Un dueño podrá destacar un producto dentro de un restaurante de dos maneras distintas:

- En el formulario de creación y/o edición de producto. Por defecto, se seleccionará la opción de no destacado. Si el propietario indica que el producto debe estar destacado, pero ya existían cinco productos destacados del mismo restaurante, al pulsar el botón Save se mostrará un error y no se creará o editará el producto. El mecanismo de destacar o no un producto, en este caso, será un deslizable. Nótese: deberá introducir un mensaje avisando del error.
- En la pantalla de "Detalles del restaurante", mediante un botón mostrado junto a cada producto, que permitirá mediante su pulsación destacar el producto en cuestión. Si el propietario pulsa el botón para destacar un nuevo producto y ya existían cinco productos destacados del mismo restaurante, se procederá a destacar el producto indicado y se marcará como "no destacado" el producto más antiguo que fue destacado con anterioridad. La aplicación debe pedir confirmación al propietario cuando se pulse el botón; utilice para ello el componente suministrado ConfirmationModal, similar al componente DeleteModal utilizado en la asignatura.
  
Además, los productos destacados aparecerán siempre al principio de los listados de productos que se le presenten tanto a los dueños como a los clientes dentro de un cierto restaurante. Nótese que el orden de apariencia de los productos destacados irá en función de la fecha de destaque de más reciente a más antigua.

## Backend
1. Añadir la propiedad a Product
2. Crear validacion para que no existan mas de 5 productos promocionados (Product Validation)
3. Se añade a create y update (Product Validation)
4. Crear funcion highlight para destacar o no los productos (Product Controller)
5. Añadir nuevo orden en show (Product Controller)
6. Crear nueva ruta