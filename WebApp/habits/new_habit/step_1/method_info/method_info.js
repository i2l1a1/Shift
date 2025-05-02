import {current_habit_is_negative, update_stage_number} from "../../../../tools/auxiliary_tools.js";
import {send_page_name_to_server} from "../../../../tools/networking_tools.js";

const correct_goal_text = document.getElementById("correct_goal_text");

update_stage_number(1);

if (current_habit_is_negative()) {
    correct_goal_text.textContent = "Тут будет текст про то, что негативную привычку нужно заменить позитивной. Тут будет текст про то, что негативную привычку нужно заменить позитивной. Тут будет текст про то, что негативную привычку нужно заменить позитивной. Тут будет текст про то, что негативную привычку нужно.";
} else {
    correct_goal_text.textContent = "Тут будет текст про позитивную привычку. Тут будет текст про позитивную привычку. Тут будет текст про позитивную привычку. Тут будет текст про позитивную привычку. Тут будет текст про позитивную привычку. Тут будет текст про позитивную привычку. Тут будет текст про позитивную привычку.";
}

send_page_name_to_server("new_habit/step_1/method_info/method_info.html").then(r => {

});
