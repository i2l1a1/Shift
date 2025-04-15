import {mobile_focus_for_fields} from "../../../../tools/mobile_adaptations.js";
import {send_data_to_server, send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {
    create_input_date_and_time_fields,
    take_dates_and_times_from_page
} from "../../../../tools/graphical_tools.js";
import {get_item, serve_input_field} from "../../../../tools/auxiliary_tools.js";

const accept_button = document.querySelector(".accept_button_div");
const reminder_input_field = document.querySelector(".input_field");

serve_input_field(reminder_input_field, "positive_instead_negative");

send_page_name_to_server("new_negative_habit/step_1/positive_instead_negative/positive_instead_negative.html").then(r => {

});

create_input_date_and_time_fields("../../../../icons/delete_inactive.svg");

accept_button.addEventListener("click", () => {
    let days_and_times = take_dates_and_times_from_page();

    const url = `http://127.0.0.1:9091/edit_negative_habit/stage_1/add_positive_habit/${get_item("active_habit", false)}`;
    let data_for_send = {
        "positive_instead_negative": reminder_input_field.value,
        "dates": days_and_times.days_of_week,
        "times": days_and_times.times,
    }

    send_data_to_server(url, data_for_send).then(r => {

    });
});

mobile_focus_for_fields()
