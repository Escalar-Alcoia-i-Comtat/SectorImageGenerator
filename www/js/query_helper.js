/**
 * Fetches the GET parameters from the URL and returns them as a Dictionary.
 * @author Arnau Mora
 * @since 20220318
 * @return {Object.<string, any>} A dictionary with keys the GET names, and values their corresponding values.
 */
const getUrlParameters = () => {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    const query_string = {};
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        const key = decodeURIComponent(pair[0]);
        const value = decodeURIComponent(pair[1]);

        // If first entry with this name
        if (typeof query_string[key] === "undefined")
            query_string[key] = decodeURIComponent(value);
        // If second entry with this name
        else if (typeof query_string[key] === "string")
            query_string[key] = [query_string[key], decodeURIComponent(value)];
        // If third or later entry with this name
        else
            query_string[key].push(decodeURIComponent(value));
    }
    return query_string;
};
