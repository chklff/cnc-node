// scenarios.js
const axios = require('axios');

const listScenarios = async (url, organizationId, limit, token) => {
    try {
        const response = await axios.get(`${url}/api/v2/scenarios`, {
            params: {
                organizationId: organizationId,
                'pg[offset]':0,
                'pg[limit]': limit,
                'pg[returnTotalCount]': true
            },
            headers: {
                //"Authorization": `Token ${token}`,
                "Authorization": `Token ${token}`

            }
        });

        return response.data;
    } catch (error) {
        console.error(`Error making request: ${error}`);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx


            console.log(error.request.url);
            console.log(error.request.headers);
            console.log(error.request.data);
          

            console.log(error.config.url);
            console.log(error.config.params);
            console.log(error.config.headers);
            console.log(error.config.params);

            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in Node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    }
}

module.exports = listScenarios; // Use this instead of `export default`
