import {current_habit_is_negative, update_stage_number} from "../../../../tools/auxiliary_tools.js";
import {send_page_name_to_server} from "../../../../tools/networking_tools.js";

const correct_goal_text = document.getElementById("correct_goal_text");
const header_1 = document.getElementById("header_1");
const text_5 = document.getElementById("text_5");

update_stage_number(1);

if (current_habit_is_negative()) {
    header_1.textContent = "Заменяем привычку";
    correct_goal_text.innerHTML = "На первом этапе, этапе <strong>раздумий</strong>, важно заменить вредную привычку на полезную. Вместо борьбы с негативом фокусируемся на позитивной привычке, которая займет её место. Это поможет вам не только избавиться от вредной привычки, но и развиваться. Например, если вы хотите бросить курить, замените это на спорт или медитацию.";
    text_5.textContent = "Формулируйте цель как положительное поведение, а не как прекращение чего-либо. Это будет эффективнее в достижении результата. Даже если вредная привычка абстрактная («постоянно испытываю лишний стресс»), то её нужно трансформировать во что-то позитивное, например, «расслабление» или «дыхательная техника».";
} else {
    header_1.textContent = "Уточняем цель";
    correct_goal_text.innerHTML = "На первом этапе, этапе <strong>раздумий</strong>, важно правильно сформулировать вашу цель, поэтому сейчас можно будет её переформулировать с учётом полезных рекомендаций.";
    text_5.textContent = "Формулируйте цель как положительное поведение, а не как прекращение чего-либо. Это будет эффективнее в достижении результата.";
}

send_page_name_to_server("new_habit/step_1/method_info/method_info.html").then(r => {

});
