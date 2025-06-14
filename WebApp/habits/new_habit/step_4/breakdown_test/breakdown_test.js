import {
    send_data_to_server,
    send_page_name_to_server, server_url
} from "../../../../tools/networking_tools.js";
import {
    action_timer,
    get_item,
    get_status_and_date,
    serve_accept_button,
    serve_input_field
} from "../../../../tools/auxiliary_tools.js";
import {mobile_focus_for_fields} from "../../../../tools/mobile_adaptations.js";

const places_textarea = document.getElementById("places_textarea");
const actions_textarea = document.getElementById("actions_textarea");
const when_textarea = document.getElementById("when_textarea");
const who_textarea = document.getElementById("who_textarea");

serve_input_field(places_textarea, "places_textarea");
serve_input_field(actions_textarea, "actions_textarea");
serve_input_field(when_textarea, "when_textarea");
serve_input_field(who_textarea, "who_textarea");

serve_accept_button([
    places_textarea,
    actions_textarea,
    when_textarea,
    who_textarea], ["active", "active_time"]
);

send_page_name_to_server("new_habit/step_4/breakdown_test/breakdown_test.html").then(r => {

});

const accept_button = document.querySelector(".accept_button_div");

action_timer(5,
    "../final_page/final_page.html",
    4,
    `${server_url}/edit_negative_habit/stage_4/start_breakdown_tracking/${get_item("active_habit", false)}`,
    "Далее", true, false, ["active", "active_time"]);

accept_button.addEventListener("click", (event) => {
    if (accept_button.getAttribute("active") === "true") {
        get_status_and_date(4).then((status_and_date) => {
            if (status_and_date.date !== null) {
                if (status_and_date.status === 1 || accept_button.getAttribute("active_time") === "true") {
                    event.preventDefault();
                    let data_for_send = {
                        "places": places_textarea.value,
                        "actions": actions_textarea.value,
                        "when": when_textarea.value,
                        "who": who_textarea.value,
                    }

                    const url = `${server_url}/edit_habit/stage_4/add_breakdown_factors/${get_item("active_habit", false)}`;

                    send_data_to_server(url, data_for_send).then(r => {
                        window.location.href = "../final_page/final_page.html";
                    });
                }
            }
        });
    }
});

mobile_focus_for_fields()
