import {
    get_data_from_server,
    send_page_name_to_server, server_url
} from "../../../../tools/networking_tools.js";
import {action_timer, get_item} from "../../../../tools/auxiliary_tools.js";
import {show_result_chart} from "./result_chart.js";
import {create_element} from "../../../../tools/graphical_tools.js";

const container = document.querySelector(".container");

send_page_name_to_server("new_habit/step_3/change_statistics/change_statistics.html").then(r => {

});

const url = `${server_url}/get_negative_habit/${get_item("active_habit", false)}`;

get_data_from_server(url).then((data_from_server) => {
    let response_status = data_from_server[0];
    data_from_server = data_from_server[1][0];

    const success_counter = data_from_server["success_counter"];
    const failure_counter = data_from_server["failure_counter"];

    if (success_counter > 0 || failure_counter > 0) {
        show_result_chart(success_counter, failure_counter);
    } else {
        const hint = create_element("div", "no_statistics_text", "Пока что нет данных.");
        container.appendChild(hint);
    }
});

action_timer(5,
    "../final_page/final_page.html",
    3,
    `${server_url}/edit_negative_habit/stage_3/start_effort_stage/${get_item("active_habit", false)}`,
    "Далее",
    false,
    true,
    ["active"]);
