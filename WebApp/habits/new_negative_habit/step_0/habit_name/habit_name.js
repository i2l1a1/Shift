import {mobile_focus_for_fields} from "../../../../tools/mobile_adaptations.js";
import {
    set_item,
    get_item,
    serve_input_field,
    serve_accept_button
} from "../../../../tools/auxiliary_tools.js";
import {send_data_to_server, send_page_name_to_server} from "../../../../tools/networking_tools.js";

const accept_button = document.querySelector(".accept_button_div");
const input_field = document.querySelector(".input_field");
const current_text_input_field = get_item("negative_habit_name");

if (current_text_input_field !== "") {
    input_field.textContent = current_text_input_field;
}

accept_button.addEventListener("click", (event) => {
    if (accept_button.getAttribute("active") === "true") {
        event.preventDefault();
        const url = "http://127.0.0.1:9091/new_negative_habit";
        let data_for_send = {
            "now_state": 0,
            "negative_habit_name": input_field.value,
            // "tg_user_id": window.Telegram.WebApp.initDataUnsafe.user.id.toString()
            "tg_user_id": "487020656"
        }

        send_data_to_server(url, data_for_send).then(response => {
            set_item("active_habit", response["id"], false);
            set_item("negative_habit_name", input_field.value);
            send_page_name_to_server("new_negative_habit/step_0/habit_name/habit_name.html").then(r => {
                window.location.href = "../final_page/final_page.html";
            });
        });
    }
});

serve_input_field(input_field, "now_negative_habit_name", false);
serve_accept_button([input_field]);
mobile_focus_for_fields();