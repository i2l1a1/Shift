import {send_data_to_server, server_url} from "../../tools/networking_tools.js";
import {
    get_item
} from "../../tools/auxiliary_tools.js";

const accept_button = document.querySelector(".accept_button_div");


accept_button.addEventListener("click", () => {
    const url = `${server_url}/delete_habit/${get_item("active_habit", false)}`;

    send_data_to_server(url, NaN).then(r => {
        window.location.href = "../../index.html";
    });
});
