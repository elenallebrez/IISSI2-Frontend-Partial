## Enunciado
Se desea visualizar los restaurantes que son económicos. Un restaurante económico tendrá una etiqueta € y un restaurante no económico tendrá una etiqueta €€.

Haga uso de la coloración ‘brandSuccess’ y ‘brandPrimary’ respectivamente para las etiquetas anteriores. Un restaurante será económico si, una vez se dé de alta un producto del mismo, el precio medio de los productos del mismo sea menor que el precio medio de los productos del resto de restaurantes.
1. Para hacer un filtrado de productos cuyo restaurante sea distinto del restaurante actual puede usar el operador not equal (Sequelize.Op.ne)
2. Para computar el valor medio de una columna, deberá usar la función Sequelize.fn('AVG', Sequelize.col('columnName')).

Para mayor claridad, puede observar el uso de estos operadores en una de las fotografías adjuntas, donde se computa la media de los costes de envío de los pedidos que no se corresponden con el usuario currentUserId.

## Backend

1. Añadir nueva propiedad (Restaurant y create Restaurant)
2. Añadir a Product Controller una funcion que filtre por restaurantes economicos
3. Añadir a create (Product Controller)

## Frontend

1. Añadir simbolo en Restaurant Screen donde badge
