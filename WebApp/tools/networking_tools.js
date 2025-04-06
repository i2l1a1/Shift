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

export async function send_page_name_to_server(now_page_url) {
    const now_page = {
        "page_url": now_page_url
    }
    const url = `http://127.0.0.1:9091/edit_negative_habit/edit_now_page/${localStorage.getItem("active_habit")}`;
    // alert("now_page: " + now_page.page_url + " url: " + url)
    // alert(localStorage.getItem("active_habit"));
    send_data_to_server(url, now_page).then(response => {

    });
}