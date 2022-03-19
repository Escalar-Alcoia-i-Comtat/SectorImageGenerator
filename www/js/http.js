/**
 * Makes an HTTP GET request on {url}.
 * @author Arnau Mora
 * @since 20220319
 * @param url {string} The url to make the request to.
 * @return {string} The response of the GET request.
 */
const httpGet = (url) => {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
};
