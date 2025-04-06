import {get_data_from_server} from "../../tools/networking_tools.js";
import {create_element} from "../../tools/graphical_tools.js";
import {get_text_stage_by_number} from "../../tools/auxiliary_tools.js";

const habits_in_process_holder = document.querySelector(".habits_in_process_holder");
const habits_header = document.querySelector(".habits_header");

// const tg_user_id = window.Telegram.WebApp.initDataUnsafe.user.id.toString()
const tg_user_id = "487020656";
const url = `http://127.0.0.1:9091/get_negative_habits/${tg_user_id}`;

get_data_from_server(url).then((data_from_server) => {
    let response_status = data_from_server[0];
    data_from_server = data_from_server[1];

    console.log(data_from_server);

    for (const habit of data_from_server) {
        habits_header.hidden = false;
        let habit_div = create_element("div", "habit_div");
        let habit_inner = create_element("div", "habit_div_inner");
        habit_inner.setAttribute("data-id", habit.id);
        let habit_text_and_stage_holder = create_element("div", "habit_text_and_stage_holder");
        let habit_text = create_element("div", "habit_text", habit.negative_habit_name)
        let habit_stage = create_element("div", "habit_stage", get_text_stage_by_number(habit.now_state));

        habits_in_process_holder.appendChild(habit_div);
        habit_div.appendChild(habit_inner);
        habit_inner.appendChild(habit_text_and_stage_holder);
        habit_text_and_stage_holder.appendChild(habit_text);
        habit_text_and_stage_holder.appendChild(habit_stage);

        habit_inner.addEventListener("click", () => {
            const active_habit = habit_inner.getAttribute("data-id");
            localStorage.setItem("active_habit", active_habit);

            localStorage.setItem("now_state", habit.now_state);

            const url_for_now_habit_page = `http://127.0.0.1:9091/get_now_page_for_negative_habit/${active_habit}`
            get_data_from_server(url_for_now_habit_page).then((data_from_server) => {
                let response_status = data_from_server[0];
                data_from_server = data_from_server[1];

                console.log(data_from_server);
                window.location.href = `habits/${data_from_server}`;
            });
        });
    }

});