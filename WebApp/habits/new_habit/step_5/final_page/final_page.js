import {send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {update_stage_number} from "../../../../tools/auxiliary_tools.js";

send_page_name_to_server("new_habit/step_5/final_page/final_page.html").then(r => {

});

update_stage_number(6);
