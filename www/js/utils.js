/**
 * Checks if a character is a number.
 * @param char The object to check for. Must be a string, otherwise false is returned.
 * @return {boolean} Whether or not {char} is a number.
 * @see <a href="https://bobbyhadz.com/blog/javascript-check-if-character-in-string-is-number">Source</a>
 */
const isNumber = (char) => {
    if (typeof char !== 'string')
        return false;

    if (char.trim() === '')
        return false;

    return !isNaN(char);
}
