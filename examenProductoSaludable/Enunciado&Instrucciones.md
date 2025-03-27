Debido a la normativa reguladora de alimentación, se pide que se informe al cliente de la cantidad de carbohidratos, proteínas y grasas por cada 100 gramos de cada uno de los productos que están a la venta en DeliverUS.

Dada la existencia de platos hipercalóricos que no están recomendados en una dieta saludable, se pide que un plato no pueda contener más de 1000 calorías por 100g de producto. Para ello, se usará la siguiente formula aproximada de cálculo energético:
Calorías producto = (grasas * 9) + (proteínas * 4) + (carbohidratos * 4)

## ¿Cómo se resuelve?
1. Añadir las tres nuevas propiedades a Product y a createProduct
2. Validar noMoreThan1000Calories
3. Validar check100grams
4. Añadir a create y update
5. Añadir al create y update de ProductController