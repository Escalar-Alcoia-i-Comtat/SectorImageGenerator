/**
 * Parses the contents of a multi-pitch value. Obtains its general value, and the values for each of the pitches.
 *
 * Accepts the array format of the database. Example:
 * <pre>
 * >6b+
 * 1>6b
 * 2>6b+
 * </pre>
 * @author Arnau Mora
 * @since 20220320
 * @param {string} raw The value to parse.
 * @return {{general: string, pitches: {index: number, value: string}[]}}
 */
const parseMultiPitch = (raw) => {
    let signPos = raw.indexOf('>');
    /**
     * @type {string|null}
     */
    let general = null;
    /**
     * @type {{index:number,value:string}[]}
     */
    let pitches = [];

    if (signPos >= 0)
        while (signPos >= 0) {
            // Get the character previous to the current position.
            const negDigit = signPos > 0 ? raw[signPos - 1] : null;
            // If the character previous is a number, it means that this is not general, it's a numbered pitch.
            const prevDigit = isNumber(negDigit);

            if (!prevDigit)
                general = raw.substring(signPos + 1, raw.indexOf('\n', signPos));
            else {
                // If the previous digit is a number, get all the prefixed numbers.
                let numericPrefix = "";
                for (let c = signPos - 1; isNumber(raw.charAt(c)); c--)
                    numericPrefix += raw.charAt(c);
                pitches.push({
                    index: parseInt(numericPrefix),
                    value: raw.substring(signPos + 1, raw.indexOf('\n', signPos)),
                });
            }

            signPos = raw.indexOf('>', signPos + 1);
        }
    else
        general = raw;

    return {general, pitches};
}