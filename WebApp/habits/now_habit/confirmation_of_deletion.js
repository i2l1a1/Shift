import {send_data_to_server, server_url} from "../../tools/networking_tools.js";
import {
    get_item, remove_item
} from "../../tools/auxiliary_tools.js";

const accept_button = document.querySelector(".accept_button_div");

function delete_habit_from_localstorage(active_habit) {
    const suffix = `_${active_habit}`;

    const keys_to_delete = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.endsWith(suffix)) {
            keys_to_delete.push(key);
        }
    }

    keys_to_delete.forEach((key) => {
        remove_item(key, false);
    });
}

accept_button.addEventListener("click", () => {
    const url = `${server_url}/delete_habit/${get_item("active_habit", false)}`;

    send_data_to_server(url, NaN).then(r => {
        const active_habit = get_item("active_habit", false);
        delete_habit_from_localstorage(active_habit);

        window.location.href = "../../index.html";
    });
});
