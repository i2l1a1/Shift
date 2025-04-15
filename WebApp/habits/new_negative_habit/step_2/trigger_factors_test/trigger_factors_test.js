import {send_data_to_server, send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {action_timer} from "../../../../tools/auxiliary_tools.js";

const time_of_days_textarea = document.getElementById("time_of_days_textarea");
const situations_textarea = document.getElementById("situations_textarea");
const triggers_textarea = document.getElementById("triggers_textarea");
const behaviour_textarea = document.getElementById("behaviour_textarea");
const consequences_textarea = document.getElementById("consequences_textarea");
const accept_button = document.querySelector(".accept_button_div");

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

    const url = `http://127.0.0.1:9091/edit_negative_habit/stage_2/add_trigger_factors/${localStorage.getItem("active_habit")}`;

    send_data_to_server(url, data_for_send).then(r => {

    });
});

action_timer(5,
    "../support_group/support_group.html",
    2,
    `http://127.0.0.1:9091/edit_negative_habit/stage_2/start_trigger_tracking/${localStorage.getItem("active_habit")}`);