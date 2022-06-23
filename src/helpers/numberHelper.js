
/**
 * Returns a random number respecting a range.
 * 
 * @param {int} min 
 * @param {int} max 
 * @returns Radnom number
 */
export function getRandomNumberFromRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}