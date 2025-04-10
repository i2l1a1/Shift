import {
    send_page_name_to_server
} from "../../../../tools/networking_tools.js";
import {action_timer} from "../../../../tools/auxiliary_tools.js";

send_page_name_to_server("new_negative_habit/step_2/trigger_factors/trigger_factors.html").then(r => {

});

action_timer(5,
    "../trigger_factors_test/trigger_factors_test.html",
    2,
    `http://127.0.0.1:9091/edit_negative_habit/stage_2/start_trigger_tracking/${localStorage.getItem("active_habit")}`);
