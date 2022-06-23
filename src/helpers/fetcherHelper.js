
/**
 * Format incorrectly build server data.
 * 
 * @returns Formatted object.
 */
 export function formatServerResponseObject(objectToFormat) {
    const myCustomObject = objectToFormat
    myCustomObject.products = myCustomObject.products.data
    myCustomObject.user = myCustomObject.user.data

    return myCustomObject
}