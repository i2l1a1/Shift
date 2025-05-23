import {send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {current_habit_is_negative} from "../../../../tools/auxiliary_tools.js";
import {remove_item} from "../../../../tools/auxiliary_tools.js";

const accept_button = document.querySelector(".accept_button_div");

send_page_name_to_server("new_habit/step_4/final_page/final_page.html").then(r => {

});

const summary_text = document.getElementById("summary_text");
const future_text = document.getElementById("future_text");

if (current_habit_is_negative()) {
    summary_text.innerHTML = `Вы научились замечать и отслеживать триггеры, говорить «нет» и справляться с трудными моментами.`;
} else {
    summary_text.innerHTML = `Вы научились замечать и отслеживать триггеры и справляться с трудными моментами.`;
}

future_text.innerHTML = `Впереди финальный этап — <b>сохранение</b>. Вы научитесь сохранять полезную привычку в долгосрочной перспективе. Вперёд!`

accept_button.addEventListener("click", () => {
    remove_item("places_textarea", true);
    remove_item("actions_textarea", true);
    remove_item("when_textarea", true);
    remove_item("who_textarea", true);
});
