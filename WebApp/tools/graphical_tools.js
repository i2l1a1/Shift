import {is_valid_time} from "./auxiliary_tools.js";

export const black_bg_color = getComputedStyle(document.querySelector('body')).backgroundColor;

export function create_element(element_type, class_name = "", text_content = "", is_hidden = false) {
    let element_variable = document.createElement(element_type);
    if (class_name !== "") {
        element_variable.className = class_name;
    }
    if (text_content !== "") {
        element_variable.textContent = text_content;
    }
    if (is_hidden) {
        element_variable.classList.add("hidden");
    }
    return element_variable;
}

export function create_image(class_name = "", src, alt) {
    let element_variable = document.createElement("img");
    element_variable.className = class_name;
    element_variable.src = src;
    element_variable.alt = alt;
    return element_variable;
}

function create_drop_down_list() {
    const days_of_week = [
        ["mon", "Понедельник"], ["tue", "Вторник"], ["wed", "Среда"], ["thu", "Четверг"],
        ["fri", "Пятница"], ["sat", "Суббота"], ["sun", "Воскресенье"]
    ];
    const new_drop_down_list = create_element("select", "date_input_field");

    days_of_week.forEach(day => {
        const option_day_of_week = create_element("option");
        option_day_of_week.value = day[0];
        option_day_of_week.textContent = day[1];
        new_drop_down_list.appendChild(option_day_of_week);
    });

    return new_drop_down_list;
}

export function create_input_date_and_time_fields_holder(elements_holder, icon_path) {
    const new_holder = create_element("div", "input_data_and_time_fields_holder");
    const active_icon_path = icon_path.replace("delete_inactive.svg", "delete_active.svg");

    const new_time_input_field = create_element("input", "time_input_field");
    new_time_input_field.placeholder = "Время (мск)";
    const new_drop_down_list = create_drop_down_list();

    let need_to_add_date_time_holder = true;

    new_time_input_field.addEventListener("input", function () {
        if (is_valid_time(new_time_input_field.value) && need_to_add_date_time_holder) {
            const all_holders = elements_holder.querySelectorAll(".input_data_and_time_fields_holder");
            const last_holder = all_holders[all_holders.length - 1];
            if (last_holder.querySelector(".time_input_field").value) {
                create_input_date_and_time_fields_holder(elements_holder, icon_path);
            }
            need_to_add_date_time_holder = false;
        }
    });

    new_holder.appendChild(new_drop_down_list);
    new_holder.appendChild(new_time_input_field);
    elements_holder.appendChild(new_holder);

    function refresh_delete_icons() {
        const holders = elements_holder.querySelectorAll(".input_data_and_time_fields_holder");
        holders.forEach((holder, index) => {
            const old_icon = holder.querySelector("img.delete_active_svg, img.delete_inactive_svg");
            if (old_icon) {
                holder.removeChild(old_icon);
            }

            const is_last = index === holders.length - 1;
            const icon_file_name = is_last ? "delete_inactive.svg" : "delete_active.svg";
            const icon_class = is_last ? "delete_inactive_svg" : "delete_active_svg";
            const icon_src = is_last ? icon_path : active_icon_path;
            const delete_icon = create_image(icon_class, icon_src, "");

            if (!is_last) {
                delete_icon.style.cursor = "pointer";
                delete_icon.addEventListener("click", () => {
                    elements_holder.removeChild(holder);
                    refresh_delete_icons();
                });
            }

            holder.appendChild(delete_icon);
        });
    }

    refresh_delete_icons();
}


export function take_dates_and_times_from_page() {
    const all_input_date_time_holders = document.querySelectorAll(".input_data_and_time_fields_holder");
    let days_of_week = [];
    let times = [];
    all_input_date_time_holders.forEach(current_input => {
        let current_day_of_week = current_input.querySelector(".date_input_field").value;
        let current_time = current_input.querySelector(".time_input_field").value;
        if (current_time) {
            days_of_week.push(current_day_of_week);
            times.push(current_time);
        }
    });
    return {
        "days_of_week": days_of_week,
        "times": times
    }
}

export function create_input_date_and_time_fields(icon_path) {
    const time_input_field = document.querySelector(".time_input_field");
    const input_fields_holder = document.querySelector(".input_fields_holder");

    let need_to_add_date_time_holder = true;
    time_input_field.addEventListener('input', function () {
        if (is_valid_time(time_input_field.value) && need_to_add_date_time_holder) {

            const all_holders = input_fields_holder.querySelectorAll(".input_data_and_time_fields_holder");
            const last_holder = all_holders[all_holders.length - 1];
            if (last_holder.querySelector(".time_input_field").value) {
                create_input_date_and_time_fields_holder(input_fields_holder, icon_path);
            }
            need_to_add_date_time_holder = false;
        }
    });
}

export function create_input_subgoals(elements_holder) {
    const active_icon_path = "../../../../icons/delete_active.svg";
    const inactive_icon_path = "../../../../icons/delete_inactive.svg";

    function refresh_delete_icons() {
        const holders = elements_holder.querySelectorAll(".new_subgoal_and_icon_holder");
        holders.forEach((holder, index) => {
            const old_icon = holder.querySelector("img.delete_active_svg, img.delete_inactive_svg");
            if (old_icon) {
                holder.removeChild(old_icon);
            }

            const is_last = index === holders.length - 1;
            const icon_src   = is_last ? inactive_icon_path : active_icon_path;
            const icon_class = is_last ? "delete_inactive_svg" : "delete_active_svg";
            const delete_icon = create_image(icon_class, icon_src, "");

            if (!is_last) {
                delete_icon.style.cursor = "pointer";
                delete_icon.addEventListener("click", () => {
                    elements_holder.removeChild(holder);
                    refresh_delete_icons();
                });
            }

            holder.appendChild(delete_icon);
        });
    }

    const new_holder = create_element("div", "new_subgoal_and_icon_holder");
    const new_subgoal_input_field = create_element("input", "new_subgoal_input_field");
    new_subgoal_input_field.placeholder = "Подцель...";

    elements_holder.appendChild(new_holder);
    new_holder.appendChild(new_subgoal_input_field);

    let need_to_add_subgoal_holder = true;
    new_subgoal_input_field.addEventListener("input", () => {
        if (new_subgoal_input_field.value && need_to_add_subgoal_holder) {

            const all_holders = elements_holder.querySelectorAll(".new_subgoal_and_icon_holder");
            const last_holder = all_holders[all_holders.length - 1];
            if (last_holder.querySelector(".new_subgoal_input_field").value) {
                create_input_subgoals(elements_holder);
            }

            need_to_add_subgoal_holder = false;
        }
    });

    refresh_delete_icons();
}


export function take_habit_and_subgoals_from_page() {
    const all_input_field_holders = document.querySelectorAll(".new_subgoal_and_icon_holder");
    const habit_input_field = document.querySelector(".input_field");

    let subgoals = [];
    all_input_field_holders.forEach(current_input_holder => {
        const current_input = current_input_holder.querySelector(".new_subgoal_input_field");
        if (current_input.value) {
            subgoals.push(current_input.value);
        }
    });

    return {
        "positive_habit": habit_input_field.value,
        "subgoals": subgoals
    }
}

