import {mobile_focus_for_fields} from "../../tools/mobile_adaptations.js";
import {send_data_to_server, server_url, tg_user_id} from "../../tools/networking_tools.js";
import {
    create_input_date_and_time_fields,
    take_dates_and_times_from_page
} from "../../tools/graphical_tools.js";
import {
    recovery_for_days_and_times, remove_item,
    serve_accept_button, serve_input_field,
    validate_and_save_for_days_and_times
} from "../../tools/auxiliary_tools.js";

const accept_button = document.querySelector(".accept_button_div");
const reminder_input_field = document.querySelector(".input_field");
const input_fields_holder = document.querySelector(".input_fields_holder");

serve_input_field(reminder_input_field, "regular_reminder_text", false);

create_input_date_and_time_fields("../../../../icons/delete_inactive.svg");

recovery_for_days_and_times(input_fields_holder, false);

input_fields_holder.addEventListener("input", () => validate_and_save_for_days_and_times(input_fields_holder, false));
input_fields_holder.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete_active_svg")) {
        validate_and_save_for_days_and_times(input_fields_holder, false)
    }
});

accept_button.addEventListener("click", (event) => {
    if (accept_button.getAttribute("active") === "true" &&
        accept_button.getAttribute("time") === "true") {
        event.preventDefault();

        remove_item("regular_reminder_text");
        remove_item("days_and_times");

        let days_and_times = take_dates_and_times_from_page();

        const url = `${server_url}/new_regular_reminder`;
        let data_for_send = {
            "text": reminder_input_field.value,
            "dates": days_and_times.days_of_week,
            "times": days_and_times.times,
            "tg_user_id": tg_user_id
        }

        send_data_to_server(url, data_for_send).then(r => {
            window.location.href = "../reminders_page/reminders.html";
        });
    }
});

serve_accept_button([reminder_input_field], ["active", "time"]);

mobile_focus_for_fields()
