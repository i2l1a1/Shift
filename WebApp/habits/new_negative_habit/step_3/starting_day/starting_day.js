import {send_data_to_server, send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {get_current_date} from "../../../../tools/auxiliary_tools.js";
import {mobile_focus_for_fields} from "../../../../tools/mobile_adaptations.js";

send_page_name_to_server("new_negative_habit/step_2/starting_day/starting_day.html").then(r => {

});

const accept_button = document.querySelector(".accept_button_div");
const date_input_field = document.getElementById("date_input_field");


date_input_field.value = get_current_date();

accept_button.addEventListener("click", () => {
    const url = `http://127.0.0.1:9091/edit_negative_habit/stage_2/add_starting_date/${localStorage.getItem("active_habit")}`;
    let data_for_send = {
        "date": date_input_field.value
    }

    send_data_to_server(url, data_for_send).then(r => {

    });
});

mobile_focus_for_fields();
