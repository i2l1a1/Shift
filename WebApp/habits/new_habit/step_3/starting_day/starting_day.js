import {send_data_to_server, send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {
    check_date,
    get_current_date,
    get_item,
    off_accept_button,
    on_accept_button,
    set_item
} from "../../../../tools/auxiliary_tools.js";
import {mobile_focus_for_fields} from "../../../../tools/mobile_adaptations.js";

send_page_name_to_server("new_habit/step_3/starting_day/starting_day.html").then(r => {

});

const accept_button = document.querySelector(".accept_button_div");
const date_input_field = document.getElementById("date_input_field");

const prev_date_from_user = get_item("starting_date");

if (prev_date_from_user) {
    date_input_field.value = get_item("starting_date");
} else {
    date_input_field.value = get_current_date();
}

if (check_date(date_input_field.value)) {
    on_accept_button();
} else {
    off_accept_button();
}

date_input_field.addEventListener("input", () => {
    set_item("starting_date", date_input_field.value);

    if (check_date(date_input_field.value)) {
        on_accept_button();
    } else {
        off_accept_button();
    }
});

accept_button.addEventListener("click", (event) => {
    if (accept_button.getAttribute("active") === "true") {
        event.preventDefault();
        const url = `http://127.0.0.1:9091/edit_habit/stage_2/add_starting_date/${get_item("active_habit", false)}`;
        let data_for_send = {
            "date": date_input_field.value
        }

        send_data_to_server(url, data_for_send).then(r => {
            window.location.href = "../change_statistics/change_statistics.html";
        });
    }
});

mobile_focus_for_fields();
