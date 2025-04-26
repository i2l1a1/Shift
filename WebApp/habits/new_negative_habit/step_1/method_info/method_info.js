import {update_stage_number} from "../../../../tools/auxiliary_tools.js";
import {send_page_name_to_server} from "../../../../tools/networking_tools.js";

update_stage_number(1);

send_page_name_to_server("new_negative_habit/step_1/method_info/method_info.html").then(r => {

});
