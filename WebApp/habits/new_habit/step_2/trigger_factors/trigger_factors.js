import {
    send_page_name_to_server
} from "../../../../tools/networking_tools.js";
import {current_habit_is_negative} from "../../../../tools/auxiliary_tools.js";

const trigger_factors_text = document.getElementById("trigger_factors_text");
if (current_habit_is_negative()) {
    trigger_factors_text.textContent = "Далее в течение недели вы будете детально изучать то, от чего хотите избавиться. Это поможет вам понять истоки проблемы и действовать более эффективно.";
} else {
    trigger_factors_text.textContent = "Далее в течение недели вы будете исследовать ситуации, в которых вам будет особенно трудно начать новую привычку. Это поможет заранее распознать возможные препятствия и подготовиться к ним.";
}
send_page_name_to_server("new_habit/step_2/trigger_factors/trigger_factors.html").then(r => {

});
