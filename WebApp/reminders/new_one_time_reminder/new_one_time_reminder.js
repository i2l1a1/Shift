import {send_data_to_server} from "../../tools/networking_tools.js";
import {get_current_date} from "../../tools/auxiliary_tools.js";
import {mobile_focus_for_fields} from "../../tools/mobile_adaptations.js";

const container = document.querySelector(".container");
const body = document.querySelector("body");
const accept_button = document.querySelector(".accept_button_div");
const reminder_input_field = document.getElementById("reminder_input_field");
const date_input_field = document.getElementById("date_input_field");
const time_input_field = document.getElementById("time_input_field");


date_input_field.value = get_current_date();


accept_button.addEventListener("click", () => {
    console.log(reminder_input_field.value);
    console.log(date_input_field.value);
    console.log(time_input_field.value);

    const url = "http://127.0.0.1:9091/new_one_time_reminder";
    let data_for_send = {
        "text": reminder_input_field.value,
        "date": date_input_field.value,
        "time": time_input_field.value,
        // "tg_user_id": window.Telegram.WebApp.initDataUnsafe.user.id.toString()
        "tg_user_id": "487020656"
    }

    send_data_to_server(url, data_for_send).then(r => {

    });
});

mobile_focus_for_fields()


