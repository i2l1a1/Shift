import {mobile_focus_for_fields} from "../../../../tools/mobile_adaptations.js";
import {
    get_data_from_server,
    send_data_to_server,
    send_page_name_to_server
} from "../../../../tools/networking_tools.js";
import {
    create_input_subgoals,
    take_habit_and_subgoals_from_page
} from "../../../../tools/graphical_tools.js";
import {get_item, serve_accept_button, serve_input_field} from "../../../../tools/auxiliary_tools.js";

const accept_button = document.querySelector(".accept_button_div");
const habit_input_field = document.querySelector(".input_field");
const input_fields_holder = document.querySelector(".input_fields_holder");
const input_field = document.querySelector(".input_field");

send_page_name_to_server("new_negative_habit/step_2/subgoals/subgoals.html").then(r => {

});

const url = `http://127.0.0.1:9091/get_negative_habit/${get_item("active_habit", false)}`;

serve_input_field(input_field, "now_positive_habit_name");
serve_accept_button([input_field]);
get_data_from_server(url).then((data_from_server) => {
    let response_status = data_from_server[0];
    data_from_server = data_from_server[1];
    if (get_item("now_positive_habit_name") !== "") {
        habit_input_field.value = get_item("now_positive_habit_name");
    } else {
        habit_input_field.value = data_from_server[0].positive_instead_negative;
    }
});

create_input_subgoals(input_fields_holder);

accept_button.addEventListener("click", (event) => {
    if (accept_button.getAttribute("active") === "true") {
        event.preventDefault();
        const habit_and_subgoals = take_habit_and_subgoals_from_page();
        const url = `http://127.0.0.1:9091/edit_negative_habit/stage_2/add_subgoals/${get_item("active_habit", false)}`;

        let data_for_send = {
            "positive_habit": habit_and_subgoals.positive_habit,
            "subgoals": habit_and_subgoals.subgoals
        }

        send_data_to_server(url, data_for_send).then(r => {
            window.location.href = "../trigger_factors/trigger_factors.html";
        });
    }
});

mobile_focus_for_fields();
