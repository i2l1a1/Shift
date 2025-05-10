import {
    get_data_from_server,
    send_page_name_to_server, server_url
} from "../../../../tools/networking_tools.js";
import {action_timer, get_item} from "../../../../tools/auxiliary_tools.js";

send_page_name_to_server("new_habit/step_3/change_statistics/change_statistics.html").then(r => {

});

const success_value = document.getElementById("success_value");
const failure_value = document.getElementById("failure_value");
const success_bar = document.getElementById("success_bar");
const failure_bar = document.getElementById("failure_bar");


const url = `${server_url}/get_negative_habit/${get_item("active_habit", false)}`;

get_data_from_server(url).then((data_from_server) => {
    let response_status = data_from_server[0];
    data_from_server = data_from_server[1][0];

    const successCount = data_from_server["success_counter"];
    const failureCount = data_from_server["failure_counter"];

    success_value.textContent = successCount;
    failure_value.textContent = failureCount;

    const max_count = Math.max(successCount, failureCount, 1);

    success_bar.style.height = `${(successCount / max_count) * 100}%`;
    failure_bar.style.height = `${(failureCount / max_count) * 100}%`;
});

action_timer(5,
    "../final_page/final_page.html",
    3,
    `${server_url}/edit_negative_habit/stage_3/start_effort_stage/${get_item("active_habit", false)}`,
    "Далее",
    false,
    true,
    ["active"]);
