import {
    get_data_from_server,
    send_page_name_to_server, server_url
} from "../../../../tools/networking_tools.js";
import {action_timer, get_item, transform_date_for_user} from "../../../../tools/auxiliary_tools.js";
import {show_result_chart} from "./result_chart.js";
import {create_element} from "../../../../tools/graphical_tools.js";

const container = document.querySelector(".container");
const accept_button_div = document.querySelector(".accept_button_div");

send_page_name_to_server("new_habit/step_3/change_statistics/change_statistics.html").then(r => {

});

const url = `${server_url}/get_negative_habit/${get_item("active_habit", false)}`;

get_data_from_server(url).then((data_from_server) => {
    let response_status = data_from_server[0];
    data_from_server = data_from_server[1][0];

    const starting_date = data_from_server["starting_date"];

    const today = new Date();
    const start = new Date(starting_date);

    const success_counter = data_from_server["success_counter"];
    const failure_counter = data_from_server["failure_counter"];

    if (success_counter > 0 || failure_counter > 0) {
        show_result_chart(success_counter, failure_counter);
    } else {
        const hint = create_element("div", "no_statistics_text");
        if (today >= start) {
            accept_button_div.hidden = false;
            hint.textContent = "После нажатия кнопки «Начать!» вам начнут приходить напоминания в выбранные дни недели и время с вопросом о выполнении привычки. Статистику ваших изменений можно будет посмотреть здесь.";
        } else {
            hint.textContent = `${transform_date_for_user(starting_date)} появится кнопка «Начать!». После нажатия этой кнопки вам начнут приходить напоминания в выбранные дни недели и время с вопросом о выполнении привычки. Статистику ваших изменений можно будет посмотреть здесь.`;
        }
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
