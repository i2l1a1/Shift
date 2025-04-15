import {
    send_data_to_server,
    send_page_name_to_server
} from "../../../../tools/networking_tools.js";
import {action_timer} from "../../../../tools/auxiliary_tools.js";

const places_textarea = document.getElementById("places_textarea");
const actions_textarea = document.getElementById("actions_textarea");
const when_textarea = document.getElementById("when_textarea");
const who_textarea = document.getElementById("who_textarea");

send_page_name_to_server("new_negative_habit/step_4/breakdown_test/breakdown_test.html").then(r => {

});

const accept_button = document.querySelector(".accept_button_div");

action_timer(5,
    "../final_page/final_page.html",
    4,
    `http://127.0.0.1:9091/edit_negative_habit/stage_4/start_breakdown_tracking/${localStorage.getItem("active_habit")}`);

accept_button.addEventListener("click", () => {

    let data_for_send = {
        "places": places_textarea.value,
        "actions": actions_textarea.value,
        "when": when_textarea.value,
        "who": who_textarea.value,
    }

    const url = `http://127.0.0.1:9091/edit_negative_habit/stage_4/add_breakdown_factors/${localStorage.getItem("active_habit")}`;

    send_data_to_server(url, data_for_send).then(r => {

    });
});
