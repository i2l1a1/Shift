import {send_page_name_to_server, server_url} from "../../../../tools/networking_tools.js";
import {action_timer, get_item, update_stage_number} from "../../../../tools/auxiliary_tools.js";

send_page_name_to_server("new_habit/step_5/method_info/method_info.html").then(r => {

});

action_timer(5,
    "../final_page/final_page.html",
    5,
    `${server_url}/edit_negative_habit/stage_5/start_list_creating/${get_item("active_habit", false)}`,
    "Завершить этот этап!",
    false,
    true,
    ["active"]);

update_stage_number(5);
