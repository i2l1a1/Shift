import {send_data_to_server} from "../tools/networking_tools.js";

const accept_button = document.getElementById("accept_button");
const reminder_input_field = document.getElementById("reminder_input_field");
const date_input_field = document.getElementById("date_input_field");
const time_input_field = document.getElementById("time_input_field");


accept_button.addEventListener("click", () => {
    console.log(reminder_input_field.value);
    console.log(date_input_field.value);
    console.log(time_input_field.value);

    const url = "http://127.0.0.1:9091/new_one_time_reminder";
    let data_for_send = {
        "text": reminder_input_field.value,
        "date": date_input_field.value,
        "time": time_input_field.value
    }

    send_data_to_server(url, data_for_send).then(r => {

    });
});