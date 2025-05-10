import {get_data_from_server, server_url, tg_user_id} from "../../tools/networking_tools.js";
import {create_element} from "../../tools/graphical_tools.js";
import {get_text_stage_by_number, set_item, remove_item} from "../../tools/auxiliary_tools.js";

const habits_in_process_holder = document.querySelector(".habits_in_process_holder");
const habits_header = document.querySelector(".habits_header");
const negative_habit_div = document.getElementById("negative_habit_div");
const positive_habit_div = document.getElementById("positive_habit_div");

const url = `${server_url}/get_negative_habits/${tg_user_id}`;

get_data_from_server(url).then((data_from_server) => {
    let response_status = data_from_server[0];
    data_from_server = data_from_server[1];

    for (const habit of data_from_server) {
        habits_header.hidden = false;
        let habit_div = create_element("div", "habit_div");
        let habit_inner = create_element("div", "habit_div_inner");
        habit_inner.setAttribute("data-id", habit.id);
        habit_inner.setAttribute("habit-type", habit.habit_type);
        let habit_text_and_stage_holder = create_element("div", "habit_text_and_stage_holder");
        let habit_text_content = habit.positive_habit_name !== null
            ? habit.positive_habit_name
            : `Проблема с «${habit.negative_habit_name}»`;

        let habit_text = create_element("div", "habit_text", habit_text_content);

        let habit_stage = create_element("div", "habit_stage", `${get_text_stage_by_number(habit.now_state)}.`);

        habits_in_process_holder.appendChild(habit_div);
        habit_div.appendChild(habit_inner);
        habit_inner.appendChild(habit_text_and_stage_holder);
        habit_text_and_stage_holder.appendChild(habit_text);
        habit_text_and_stage_holder.appendChild(habit_stage);

        habit_inner.addEventListener("click", () => {
            const active_habit = habit_inner.getAttribute("data-id");
            const current_habit_type = habit_inner.getAttribute("habit-type");
            set_item("active_habit", active_habit, false);
            set_item("current_habit_type", current_habit_type, false);
            set_item("now_state", habit.now_state);

            const url_for_now_habit_page = `${server_url}/get_now_page_for_negative_habit/${active_habit}`
            get_data_from_server(url_for_now_habit_page).then((data_from_server) => {
                let response_status = data_from_server[0];
                data_from_server = data_from_server[1];

                window.location.href = `habits/now_habit/now_habit.html`;
            });
        });
    }

});


negative_habit_div.addEventListener("click", () => {
    remove_item("active_habit");
    set_item("current_habit_type", "negative", false);
});

positive_habit_div.addEventListener("click", () => {
    remove_item("active_habit");
    set_item("current_habit_type", "positive", false);
});