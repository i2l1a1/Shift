import {mobile_focus_for_fields} from "../../../../tools/mobile_adaptations.js";
import {
    get_data_from_server,
    send_data_to_server,
    send_page_name_to_server, server_url
} from "../../../../tools/networking_tools.js";
import {
    create_input_date_and_time_fields,
    take_dates_and_times_from_page
} from "../../../../tools/graphical_tools.js";
import {
    get_item,
    serve_input_field,
    serve_accept_button,
    recovery_for_days_and_times, validate_and_save_for_days_and_times, current_habit_is_negative
} from "../../../../tools/auxiliary_tools.js";

const accept_button = document.querySelector(".accept_button_div");
const input_field = document.querySelector(".input_field");
const input_fields_holder = document.querySelector(".input_fields_holder");

if (current_habit_is_negative()) {
    input_field.placeholder = "Полезная привычка";
} else {
    input_field.placeholder = "Желаемая привычка";
}


serve_input_field(input_field, "positive_habit_name");

get_data_from_server(`${server_url}/get_negative_habit/${get_item("active_habit", false)}`).then(data_from_server => {
    data_from_server = data_from_server[1][0];
    if (!current_habit_is_negative()) {
        if (get_item("positive_habit_name")) {
            input_field.value = get_item("positive_habit_name");
        } else {
            input_field.value = data_from_server["positive_habit_name"];
        }
    }
    serve_accept_button([input_field], ["active", "time"]);
});

send_page_name_to_server("new_habit/step_1/positive_instead_negative/positive_instead_negative.html").then(r => {

});

create_input_date_and_time_fields("../../../../icons/delete_inactive.svg");

recovery_for_days_and_times(input_fields_holder);

input_fields_holder.addEventListener("input", () => validate_and_save_for_days_and_times(input_fields_holder));
input_fields_holder.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete_active_svg")) {
        validate_and_save_for_days_and_times(input_fields_holder);
    }
});

accept_button.addEventListener("click", (event) => {
    if (accept_button.getAttribute("active") === "true" &&
        accept_button.getAttribute("time") === "true") {
        event.preventDefault();

        let days_and_times = take_dates_and_times_from_page();

        const url = `${server_url}/edit_habit/stage_1/add_or_change_positive_habit/${get_item("active_habit", false)}`;
        let data_for_send = {
            "positive_habit_name": input_field.value,
            "dates": days_and_times.days_of_week,
            "times": days_and_times.times,
        }

        send_data_to_server(url, data_for_send).then(r => {
            window.location.href = "../mindfulness_and_feelings/mindfulness_and_feelings.html";
        });
    }
});

mobile_focus_for_fields()
