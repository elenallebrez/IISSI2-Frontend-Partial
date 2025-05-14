## Enunciado
Se desea que los dueños de restaurantes puedan enviar mensajes a sus fans, a modo de anuncios. Para ello, deberás añadir el campo correspondiente a los formularios de creación y edición de restaurantes, tal y como aparece en una de las fotografías adjuntas. 
El mensaje para los fans aparecerá dentro de la ventana Restaurant Detail, encima del botón de crear producto. Su estilo, en negrita, variará de manera intermitente entre los colores negro y azul, esto es, dichos colores se alternarán por segundo. 
El mensaje para los fans tendrá una longitud máxima de 500 caracteres y, obviamente, no se mostrará ni ocupará espacio en pantalla si un dueño de restaurante no ha puesto un mensaje para los fans.

## Backend
1. Añadir propiedad en RestaurantModel y createRestaurant
   
   messageToFans: {

    allowNull: true,

    type: DataTypes.STRING

    }
2. Añadir validacion en create y update (no hay que crear nada)
   
    check('messageToFans').optional({ nullable: true, checkFalsy: true }).isLength({ max: 500 }).isString().trim()

## Frontend
1. Añadir constante AnimatedText a Restaurant Detail
2. Añadirlo a render Header
3. Añadir propiedad al edit restaurant screen
4. Añadir propiedad al create restaurant screen