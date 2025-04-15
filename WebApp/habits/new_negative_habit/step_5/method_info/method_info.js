import {send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {action_timer, update_stage_number} from "../../../../tools/auxiliary_tools.js";

send_page_name_to_server("new_negative_habit/step_5/method_info/method_info.html").then(r => {

});

action_timer(5,
    "../final_page/final_page.html",
    5,
    `http://127.0.0.1:9091/edit_negative_habit/stage_5/start_list_creating/${localStorage.getItem("active_habit")}`,
    "Завершить этот этап!");

update_stage_number(5);
