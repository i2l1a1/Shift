import {send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {update_stage_number} from "../../../../tools/auxiliary_tools.js";

send_page_name_to_server("new_habit/step_2/method_info/method_info.html").then(r => {

});

update_stage_number(2);
