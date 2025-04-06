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

function create_input_date_and_time_fields_holder_(elements_holder, icon_path) {
    const new_input_date_and_time_fields_holder = create_element("div", "input_data_and_time_fields_holder");
    const new_time_input_field = create_element("input", "time_input_field");
    new_time_input_field.placeholder = "Время...";
    const new_drop_down_list = create_drop_down_list();
    const new_delete_inactive_svg = create_image("delete_inactive_svg", icon_path);

    let need_to_add_date_time_holder = true;

    new_time_input_field.addEventListener('input', function () {
        if (new_time_input_field.value.length >= 2 && need_to_add_date_time_holder) {
            create_input_date_and_time_fields_holder_(elements_holder, icon_path);
            need_to_add_date_time_holder = false;
        }
    });

    elements_holder.appendChild(new_input_date_and_time_fields_holder);
    new_input_date_and_time_fields_holder.appendChild(new_drop_down_list);
    new_input_date_and_time_fields_holder.appendChild(new_time_input_field);
    new_input_date_and_time_fields_holder.appendChild(new_delete_inactive_svg);
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
        if (time_input_field.value.length >= 2 && need_to_add_date_time_holder) {
            create_input_date_and_time_fields_holder_(input_fields_holder, icon_path);
            need_to_add_date_time_holder = false;
        }
    });
}

export function create_input_subgoals(elements_holder) {
    const new_subgoal_and_icon_holder = create_element("div", "new_subgoal_and_icon_holder");
    const new_subgoal_input_field = create_element("input", "new_subgoal_input_field");
    new_subgoal_input_field.placeholder = "Подцель...";
    const new_delete_inactive_svg = create_image("delete_inactive_svg", "../../../../icons/delete_inactive.svg");

    let need_to_add_subgoal_holder = true;

    new_subgoal_input_field.addEventListener('input', function () {
        if (new_subgoal_input_field.value.length >= 2 && need_to_add_subgoal_holder) {
            create_input_subgoals(elements_holder);
            need_to_add_subgoal_holder = false;
        }
    });

    elements_holder.appendChild(new_subgoal_and_icon_holder);
    new_subgoal_and_icon_holder.appendChild(new_subgoal_input_field);
    new_subgoal_and_icon_holder.appendChild(new_delete_inactive_svg);
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

    // let days_of_week = [];
    // let times = [];
    // all_input_date_time_holders.forEach(current_input => {
    //     let current_day_of_week = current_input.querySelector(".date_input_field").value;
    //     let current_time = current_input.querySelector(".time_input_field").value;
    //     if (current_time) {
    //         days_of_week.push(current_day_of_week);
    //         times.push(current_time);
    //     }
    // });
    // return {
    //     "days_of_week": days_of_week,
    //     "times": times
    // }
}

