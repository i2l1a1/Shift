import {mobile_focus_for_fields} from "../../../../tools/mobile_adaptations.js";
import {
    set_item,
    get_item,
    serve_input_field,
    serve_accept_button, current_habit_is_negative, remove_item
} from "../../../../tools/auxiliary_tools.js";
import {send_data_to_server, send_page_name_to_server, server_url} from "../../../../tools/networking_tools.js";

const accept_button = document.querySelector(".accept_button_div");
const input_field = document.querySelector(".input_field");
const hint_for_user = document.querySelector(".hint_for_user");
const habit_textarea = document.getElementById("habit_textarea");

if (current_habit_is_negative()) {
    habit_textarea.placeholder = "Ваша вредная привычка";
    hint_for_user.textContent = "Напишите привычку, от которой хотите избавиться. Например, «неподвижный образ жизни» или «переедание». На следующих этапах мы поработаем над её трансформацией в положительное поведение.";
    serve_input_field(input_field, "negative_habit_name_before_sending", false);
    habit_textarea.value = get_item("negative_habit_name_before_sending", false);
} else {
    habit_textarea.placeholder = "Желаемая привычка";
    hint_for_user.textContent = "Например, «ЗОЖ» или «чтение книг».";
    serve_input_field(input_field, "positive_habit_name_before_sending", false);
    habit_textarea.value = get_item("positive_habit_name_before_sending", false);
}

accept_button.addEventListener("click", (event) => {
    if (accept_button.getAttribute("active") === "true") {
        event.preventDefault();
        const url = `${server_url}/new_habit`;
        let data_for_send = {
            "now_state": 0,
            "habit_name": input_field.value,
            // "tg_user_id": window.Telegram.WebApp.initDataUnsafe.user.id.toString()
            "tg_user_id": "487020656",
            "habit_type": get_item("current_habit_type", false)
        }

        send_data_to_server(url, data_for_send).then(response => {
            set_item("active_habit", response["id"], false);
            if (current_habit_is_negative()) {
                remove_item("negative_habit_name_before_sending", false);
            } else {
                remove_item("positive_habit_name_before_sending", false);
            }
            send_page_name_to_server("new_habit/step_0/habit_name/habit_name.html").then(r => {
                window.location.href = "../final_page/final_page.html";
            });
        });
    }
});

serve_accept_button([input_field]);
mobile_focus_for_fields();