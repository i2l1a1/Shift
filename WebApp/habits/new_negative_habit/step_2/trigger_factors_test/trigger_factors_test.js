import {send_data_to_server, send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {action_timer, get_item, serve_accept_button, serve_input_field} from "../../../../tools/auxiliary_tools.js";

const time_of_days_textarea = document.getElementById("time_of_days_textarea");
const situations_textarea = document.getElementById("situations_textarea");
const triggers_textarea = document.getElementById("triggers_textarea");
const behaviour_textarea = document.getElementById("behaviour_textarea");
const consequences_textarea = document.getElementById("consequences_textarea");
const accept_button = document.querySelector(".accept_button_div");

serve_input_field(time_of_days_textarea, "time_of_days_textarea");
serve_input_field(situations_textarea, "situations_textarea");
serve_input_field(triggers_textarea, "triggers_textarea");
serve_input_field(behaviour_textarea, "behaviour_textarea");
serve_input_field(consequences_textarea, "consequences_textarea");

serve_accept_button([
    time_of_days_textarea,
    situations_textarea,
    triggers_textarea,
    behaviour_textarea,
    consequences_textarea], ["active_data", "active_time"]
);

send_page_name_to_server("new_negative_habit/step_2/trigger_factors_test/trigger_factors_test.html").then(r => {

});

accept_button.addEventListener("click", () => {

    let data_for_send = {
        "time_of_days": time_of_days_textarea.value,
        "situations": situations_textarea.value,
        "triggers": triggers_textarea.value,
        "behaviour": behaviour_textarea.value,
        "consequences": consequences_textarea.value,
    }

    const url = `http://127.0.0.1:9091/edit_negative_habit/stage_2/add_trigger_factors/${get_item("active_habit", false)}`;

    send_data_to_server(url, data_for_send).then(r => {

    });
});

action_timer(5,
    "../support_group/support_group.html",
    2,
    `http://127.0.0.1:9091/edit_negative_habit/stage_2/start_trigger_tracking/${get_item("active_habit", false)}`,
    "Далее",
    ["active", "active_time"]);

accept_button.addEventListener("click", (event) => {
    if (accept_button.getAttribute("active_data") === "true" &&
        accept_button.getAttribute("active_time") === "true") {
        event.preventDefault();
        window.location.href = "../support_group/support_group.html";
    }
});