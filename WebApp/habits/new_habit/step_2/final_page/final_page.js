import {send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {remove_item} from "../../../../tools/auxiliary_tools.js";

const accept_button = document.querySelector(".accept_button_div");

send_page_name_to_server("new_habit/step_2/final_page/final_page.html").then(r => {

});

accept_button.addEventListener("click", () => {
    remove_item("subgoals", true);
    remove_item("trigger_factors_test_textarea_1", true);
    remove_item("trigger_factors_test_textarea_2", true);
    remove_item("trigger_factors_test_textarea_3", true);
    remove_item("trigger_factors_test_textarea_4", true);
    remove_item("trigger_factors_test_textarea_5", true);
    remove_item("positive_habit_name", true);
});
