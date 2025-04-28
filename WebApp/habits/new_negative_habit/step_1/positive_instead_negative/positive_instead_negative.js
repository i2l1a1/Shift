import {mobile_focus_for_fields} from "../../../../tools/mobile_adaptations.js";
import {send_data_to_server, send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {
    create_input_date_and_time_fields, create_input_date_and_time_fields_holder,
    take_dates_and_times_from_page
} from "../../../../tools/graphical_tools.js";
import {
    get_item,
    serve_input_field,
    serve_accept_button,
    on_accept_button,
    off_accept_button, is_valid_time, set_item
} from "../../../../tools/auxiliary_tools.js";

const accept_button = document.querySelector(".accept_button_div");
const reminder_input_field = document.querySelector(".input_field");
const input_fields_holder = document.querySelector(".input_fields_holder");

serve_input_field(reminder_input_field, "positive_instead_negative");

send_page_name_to_server("new_negative_habit/step_1/positive_instead_negative/positive_instead_negative.html").then(r => {

});

create_input_date_and_time_fields("../../../../icons/delete_inactive.svg");

let loaded_days_and_times = JSON.parse(get_item("days_and_times"));

for (let i = 0; i < loaded_days_and_times.days_of_week.length; ++i) {
    create_input_date_and_time_fields_holder(input_fields_holder, "../../../../icons/delete_inactive.svg");
}

let now_time_input_elements = input_fields_holder.querySelectorAll(".input_data_and_time_fields_holder");

let all_ok = true;

for (let i = 0; i < loaded_days_and_times.days_of_week.length; ++i) {
    now_time_input_elements[i].querySelector(".date_input_field").value = loaded_days_and_times.days_of_week[i];
    now_time_input_elements[i].querySelector(".time_input_field").value = loaded_days_and_times.times[i];

    if (!is_valid_time(loaded_days_and_times.times[i])) {
        all_ok = false;
    }
}

if (all_ok) {
    on_accept_button("time", ["active", "time"]);
}

input_fields_holder.addEventListener("input", () => {

    let now_time_input_elements = input_fields_holder.querySelectorAll(".time_input_field");
    let all_ok = true;

    let days_and_times = take_dates_and_times_from_page();

    set_item(
        "days_and_times",
        JSON.stringify(days_and_times)
    );

    if (now_time_input_elements.length === 1) {
        all_ok = false;
    } else {
        for (let i = 0; i < now_time_input_elements.length; ++i) {
            if (!is_valid_time(now_time_input_elements[i].value) && now_time_input_elements[i].value) {
                all_ok = false;
            }
        }

        const has_any_text = Array.from(now_time_input_elements).some(el => el.value.trim() !== '');

        if (!has_any_text) {
            all_ok = false;
        }
    }

    if (all_ok) {
        on_accept_button("time", ["active", "time"]);
    } else {
        off_accept_button("time", ["active", "time"]);
    }
});


accept_button.addEventListener("click", (event) => {
    if (accept_button.getAttribute("active") === "true" &&
        accept_button.getAttribute("time") === "true") {
        event.preventDefault();

        let days_and_times = take_dates_and_times_from_page();

        alert(days_and_times.times);

        const url = `http://127.0.0.1:9091/edit_negative_habit/stage_1/add_positive_habit/${get_item("active_habit", false)}`;
        let data_for_send = {
            "positive_instead_negative": reminder_input_field.value,
            "dates": days_and_times.days_of_week,
            "times": days_and_times.times,
        }

        send_data_to_server(url, data_for_send).then(r => {
            window.location.href = "../mindfulness_and_feelings/mindfulness_and_feelings.html";
        });
    }
});

serve_accept_button([reminder_input_field], ["active", "time"]);
mobile_focus_for_fields()
