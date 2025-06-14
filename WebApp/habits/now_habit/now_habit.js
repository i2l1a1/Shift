import {get_data_from_server, send_data_to_server, server_url} from "../../tools/networking_tools.js";
import {
    get_item,
    get_text_stage_by_number,
    convert_dates_and_times_for_user,
    current_habit_is_negative, transform_date_for_user,
} from "../../tools/auxiliary_tools.js";
import {create_element} from "../../tools/graphical_tools.js";

const url = `${server_url}/get_negative_habit/${get_item("active_habit", false)}`;

const accept_button = document.querySelector(".accept_button_div");

const negative_habit_text = document.getElementById("negative_habit_text");
const positive_habit_text = document.getElementById("positive_habit_text");
const subgoals_section = document.getElementById("subgoals_section");
const now_stage_text = document.getElementById("now_stage_text");
const success_counter_text = document.getElementById("success_counter_text");
const failure_counter_text = document.getElementById("failure_counter_text");
const starting_date_text = document.getElementById("starting_date_text");
const reminders_text = document.getElementById("reminders_text");
const time_of_days_text = document.getElementById("time_of_days_text");
const situations_text = document.getElementById("situations_text");
const triggers_text = document.getElementById("triggers_text");
const behaviour_text = document.getElementById("behaviour_text");
const consequences_text = document.getElementById("consequences_text");
const breakdown_places_text = document.getElementById("breakdown_places_text");
const breakdown_actions_text = document.getElementById("breakdown_actions_text");
const breakdown_when_text = document.getElementById("breakdown_when_text");
const breakdown_who_text = document.getElementById("breakdown_who_text");
const trigger_factors_1 = document.getElementById("trigger_factors_1");
const trigger_factors_2 = document.getElementById("trigger_factors_2");
const trigger_factors_3 = document.getElementById("trigger_factors_3");
const trigger_factors_4 = document.getElementById("trigger_factors_4");
const trigger_factors_5 = document.getElementById("trigger_factors_5");
const delete_button = document.getElementById("delete_button");

const trigger_section = document.getElementById("trigger_section");

get_data_from_server(url).then((data_from_server) => {
    let response_status = data_from_server[0];
    data_from_server = data_from_server[1][0];

    accept_button.querySelector(".accept_button").href = `../${data_from_server["now_page"]}`;

    if (data_from_server["negative_habit_name"]) {
        negative_habit_text.textContent = data_from_server["negative_habit_name"];
        document.getElementById("negative_habit_header").removeAttribute("hidden");
        document.getElementById("negative_habit_text").removeAttribute("hidden");
    }

    if (data_from_server["positive_habit_name"]) {
        positive_habit_text.textContent = data_from_server["positive_habit_name"];
        document.getElementById("positive_habit_header").removeAttribute("hidden");
        document.getElementById("positive_habit_text").removeAttribute("hidden");
    }

    if (data_from_server["subgoals"]) {
        subgoals_section.removeAttribute("hidden");
        let subgoal_elem_holder = create_element("div", "subgoal_elem_holder");
        for (let i = 0; i < data_from_server["subgoals"].length; ++i) {
            let subgoal_elem = create_element("div", "text", `${i + 1}. ${data_from_server["subgoals"][i]}`);
            subgoal_elem_holder.appendChild(subgoal_elem);
        }
        subgoals_section.appendChild(subgoal_elem_holder);
    }

    if (data_from_server["now_state"]) {
        now_stage_text.textContent = get_text_stage_by_number(data_from_server["now_state"]);
        document.getElementById("now_stage_header").removeAttribute("hidden");
        now_stage_text.removeAttribute("hidden");
    }

    if (data_from_server["success_counter"]) {
        success_counter_text.textContent = data_from_server["success_counter"];
        document.getElementById("progress_header").removeAttribute("hidden");
        document.getElementById("success_section").removeAttribute("hidden");
    }

    if (data_from_server["failure_counter"]) {
        failure_counter_text.textContent = data_from_server["failure_counter"];
        document.getElementById("progress_header").removeAttribute("hidden");
        document.getElementById("failure_section").removeAttribute("hidden");
    }

    if (data_from_server["starting_date"]) {
        starting_date_text.textContent = transform_date_for_user(data_from_server["starting_date"]);
        document.getElementById("starting_date_header").removeAttribute("hidden");
        starting_date_text.removeAttribute("hidden");
    }

    if (data_from_server["dates"]) {
        reminders_text.textContent = convert_dates_and_times_for_user(data_from_server["dates"], data_from_server["times"]);
        document.getElementById("reminders_header").removeAttribute("hidden");
        reminders_text.removeAttribute("hidden");
    }

    if (data_from_server["trigger_factors_answer_1"] &&
        data_from_server["trigger_factors_answer_2"] &&
        data_from_server["trigger_factors_answer_3"] &&
        data_from_server["trigger_factors_answer_4"] &&
        data_from_server["trigger_factors_answer_5"]) {
        time_of_days_text.textContent = data_from_server["trigger_factors_answer_1"];
        situations_text.textContent = data_from_server["trigger_factors_answer_2"];
        triggers_text.textContent = data_from_server["trigger_factors_answer_3"];
        behaviour_text.textContent = data_from_server["trigger_factors_answer_4"];
        consequences_text.textContent = data_from_server["trigger_factors_answer_5"];
        if (current_habit_is_negative()) {
            trigger_factors_1.textContent = "Время суток";
            trigger_factors_2.textContent = "Ситуации";
            trigger_factors_3.textContent = "Факторы";
            trigger_factors_4.textContent = "Поведение";
            trigger_factors_5.textContent = "Последствия";
        } else {
            trigger_factors_1.textContent = "Ситуации";
            trigger_factors_2.textContent = "Чувства";
            trigger_factors_3.textContent = "Мысли";
            trigger_factors_4.textContent = "Поведение";
            trigger_factors_5.textContent = "Последствия";
        }

        document.getElementById("triggers_header").removeAttribute("hidden");
        document.getElementById("time_of_days_section").removeAttribute("hidden");
        document.getElementById("situations_section").removeAttribute("hidden");
        document.getElementById("triggers_section").removeAttribute("hidden");
        document.getElementById("behaviour_section").removeAttribute("hidden");
        document.getElementById("consequences_section").removeAttribute("hidden");
    }

    if (data_from_server["breakdown_places"] &&
        data_from_server["breakdown_actions"] &&
        data_from_server["breakdown_when"] &&
        data_from_server["breakdown_who"]
    ) {
        trigger_section.classList.remove("hidden");
        breakdown_places_text.textContent = data_from_server["breakdown_places"];
        breakdown_actions_text.textContent = data_from_server["breakdown_actions"];
        breakdown_when_text.textContent = data_from_server["breakdown_when"];
        breakdown_who_text.textContent = data_from_server["breakdown_who"];
        document.getElementById("trigger_section").removeAttribute("hidden");
        document.getElementById("breakdown_places_section").removeAttribute("hidden");
        document.getElementById("breakdown_actions_section").removeAttribute("hidden");
        document.getElementById("breakdown_when_section").removeAttribute("hidden");
        document.getElementById("breakdown_who_section").removeAttribute("hidden");
    }
});
