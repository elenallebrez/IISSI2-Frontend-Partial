## Enunciado

La empresa permitirá a los propietarios establecer un porcentaje de descuento (0-100) para cada uno de sus restaurantes, aplicable a los productos promocionados. Además, podrán marcar qué productos serán promocionados.  

**Reglas y Funcionamiento**
- Un producto solo se promocionará si el restaurante tiene un descuento mayor a 0%.
- Los propietarios pueden activar/desactivar la promoción de cada producto, pero no modificar el porcentaje en cada uno.  
- Por defecto, los restaurantes tendrán un descuento del 0%.

**Validaciones**
- En backend, un producto solo puede promocionarse si el restaurante tiene descuento > 0.  
- En frontend y backend, el campo de descuento debe cumplir con las restricciones.  

**Interfaz**
- La edición/creación de restaurantes incluirá un campo para definir el descuento.  
- La vista de detalle del restaurante mostrará un botón para activar/desactivar la promoción en productos (solo si el descuento es > 0).  
- La edición/creación de productos no permitirá modificar la promoción.  


## ¿Cómo se resuelve?
1. Añadir propiedad al modelo de restaurant y al modelo product
2. Añadir propiedad a create Restaurant y a create Product
3. Añadir validacion, discount entre 0 y 100 en Restaurant Validation
4. Añadir checkProductCanBePromoted en el middleware de product
5. Funcion de promote en el Product Controller
6. Añadir en indexRestaurant y show Product Controller
7. Hacer ruta en product