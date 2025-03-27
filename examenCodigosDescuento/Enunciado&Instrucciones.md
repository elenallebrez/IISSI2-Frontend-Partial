## Enunciado
The company has decided to offer owners the possibility of associating a discount code (e.g: SALES20) to their restaurants, so that the system can later display and apply the specified discount promotion code. As an illustrative example, a restaurant owner could apply the SPRING code associated with a 10% discount to Casa Felix, and another discount code, e.g. EXTREME, associated with a 30% discount to another restaurant.

Remember that:
- The maximum number of characters of a discount code is 10.
- The discount is in the range [1, 99].
- The discount code cannot be repeated for restaurants owned by the same owner.

## Backend
Tenemos dos nuevas propiedades,que serán:
- discount Code: String, puede ser null, con maximo de 10 carcateres
- discount:Float,puede ser null, entre 0 y 99

1. Añadir propiedades en Restaurant
2. Añadir ambas validaciones create y update (Restaurant Validation)
3. checkDiscountCodeNoRepeatedCreate (Restaurant Validation)
4. checkDiscountCodeNotRepeatedUpdate (Restaurant Validation)
5. Volvemos a validaciones de create y update
6. Ordenamos por descuento Restaurant Controller indexOwner