import {get_item} from "./auxiliary_tools.js";

export const server_url = "https://shift-project.ru:9091";
// export const server_url = "http://127.0.0.1:9091";

export const tg_user_id = window.Telegram.WebApp.initDataUnsafe.user.id.toString();

// export const tg_user_id = "487020656";

export async function get_data_from_server(url) {
    try {
        const response = await fetch(url, {
            method: "GET"
        });
        if (response.ok) {
            return [response.status, await response.json()];
        } else {
            return [response.status, ""]
        }
    } catch (error) {
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
    const url = `${server_url}/edit_negative_habit/edit_now_page/${get_item("active_habit", false)}`;
    send_data_to_server(url, now_page).then(response => {

    });
}