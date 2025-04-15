import {
    send_page_name_to_server
} from "../../../../tools/networking_tools.js";
import {action_timer, get_item} from "../../../../tools/auxiliary_tools.js";

send_page_name_to_server("new_negative_habit/step_1/mindfulness_and_feelings/mindfulness_and_feelings.html").then(r => {

});

action_timer(5,
    "../test_after_thinking/test_after_thinking.html",
    1,
    `http://127.0.0.1:9091/edit_negative_habit/stage_1/add_number_of_days_for_mindfulness/${get_item("active_habit", false)}`);
