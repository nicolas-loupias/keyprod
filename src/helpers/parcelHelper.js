import faker from "faker"

/**
 * Get all products weigth.
 */
export function getWeightTotal(products) {
    let weightTotal = 0
    products.forEach((product) => weightTotal += product.weight)
    return weightTotal
}

/**
 * Generate a tracking code
 * 
 * @returns 
 */
export function getTrackingCode() {
    return faker.datatype.uuid().substring(0, 10)
}