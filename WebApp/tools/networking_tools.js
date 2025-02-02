export async function get_data_from_server(url) {
    try {
        const response = await fetch(url, {
            method: "GET"
        });
        if (response.ok) {
            return [response.status, await response.json()];
        } else {
            console.log(response.status);
            return [response.status, ""]
        }
    } catch (error) {
        console.log(error);
        return [error, ""];
    }
}

export async function send_data_to_server(url, data_for_send) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data_for_send),
    });

    return await response.json();
}