import faker from "faker"
import { getRandomNumberFromRange } from './numberHelper'

/**
 * 
 * Return a unique code respecting 
 * name_v[1-5]_XXXXXX
 * 
 * @param {string} name 
 * @returns 
 */
export function getUniqueCode(name) {
    let productCode = name

    // Generate a random version number between 1 and 4.
    productCode +=  '_V'  + getRandomNumberFromRange(1, 5)
    
    // Add a unique ID of 6 characters.
    const uniqueId = faker.datatype.uuid().substring(0, 6)
    productCode +=  '_'  + uniqueId

    return productCode
}