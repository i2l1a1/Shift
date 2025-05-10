import {send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {remove_item} from "../../../../tools/auxiliary_tools.js";

const accept_button = document.querySelector(".accept_button_div");

send_page_name_to_server("new_habit/step_3/final_page/final_page.html").then(r => {

});

accept_button.addEventListener("click", () => {
    remove_item("starting_date", true);
});
