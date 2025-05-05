import {send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {current_habit_is_negative, update_stage_number} from "../../../../tools/auxiliary_tools.js";

const subgoals_text = document.getElementById("subgoals_text");

if (current_habit_is_negative()) {
    subgoals_text.textContent = "Подцели — это маленькие, конкретные шаги к вашей цели. Например, если вы хотите меньше тратить, подцелью может быть «не пользоваться картой в выходные». Такие шаги делают путь к цели понятнее и достижимее.";
} else {
    subgoals_text.textContent = "Подцели — это маленькие, конкретные шаги к вашей цели. Например, если вы хотите начать заниматься спортом, подцелью может быть «пробегать 1 километр в день». Такие шаги делают путь к цели понятнее и достижимее.";
}

send_page_name_to_server("new_habit/step_2/method_info/method_info.html").then(r => {

});

update_stage_number(2);
