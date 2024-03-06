const urlAndOptionsToFetchData = async (url, options) => {
    try {
        const response = await fetch(url, options);
        if (response.ok) {
            if (options.method === "DELETE") {
                return response;
            }
            return await response.json();
        }
        return response;
    } catch (error) {
        throw new Error(`error during fetch data: \n ` + error.stack)
        // console.log(error);
    }
};

export const getData = async (url) => {
    return urlAndOptionsToFetchData(url, { method: "GET" });
};