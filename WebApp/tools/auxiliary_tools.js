import {get_data_from_server, send_data_to_server, server_url} from "./networking_tools.js";
import {create_input_date_and_time_fields_holder, take_dates_and_times_from_page} from "./graphical_tools.js";

export function get_current_date() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function check_date(selected_date) {
    const selected_date_obj = new Date(selected_date);

    const today_date = new Date();
    today_date.setHours(0, 0, 0, 0);

    return selected_date_obj >= today_date;
}

function get_day_of_week_for_user(days_of_week_from_server) {
    let days_of_week_for_user = [];
    const days_of_week_for_user_dict = {
        "mon": "ПН",
        "tue": "ВТ",
        "wed": "СР",
        "thu": "ЧТ",
        "fri": "ПТ",
        "sat": "СБ",
        "sun": "ВС"
    };

    for (let current_day of days_of_week_from_server) {
        days_of_week_for_user.push(days_of_week_for_user_dict[current_day]);
    }

    return days_of_week_for_user;
}

export function convert_dates_and_times_for_user(dates_from_server, times_from_server) {
    dates_from_server = get_day_of_week_for_user(dates_from_server);
    let string_for_user = ""
    dates_from_server.forEach((current_date, index) => {
        let current_time = times_from_server[index];
        string_for_user += `${current_date} ${current_time}, `
    });
    return string_for_user.slice(0, -2);
}

export function get_text_stage_by_number(stage_number) {
    const stages = {
        0: "Начало",
        1: "Этап 1 — раздумье",
        2: "Этап 2 — подготовка",
        3: "Этап 3 — усилия",
        4: "Этап 4 — постоянство",
        5: "Этап 5 — сохранение",
        6: "Все этапы пройдены",
    };
    return stages[stage_number];
}


export function update_stage_number(stage_number) {
    let data_for_send = {
        "stage_number": stage_number
    }

    const url = `${server_url}/edit_negative_habit/change_stage/${get_item("active_habit", false)}`;

    send_data_to_server(url, data_for_send).then(r => {

    });
}

export function get_status_and_date(stage_number) {
    const url = `${server_url}/get_negative_habit/${get_item("active_habit", false)}`;

    return get_data_from_server(url).then((data_from_server) => {
        let response_status = data_from_server[0];
        data_from_server = data_from_server[1];
        let unlock_date = data_from_server[0][`unlock_date_for_stage_${stage_number}`];

        const url_for_check = `${server_url}/stage_${stage_number}/get_unlock_status_stage_${stage_number}/${get_item("active_habit", false)}`;

        return get_data_from_server(url_for_check).then((data_from_server) => {
            let response_status = data_from_server[0];
            data_from_server = data_from_server[1];
            let unlock_status = data_from_server;

            return {
                "status": unlock_status,
                "date": unlock_date
            };
        });
    });
}

export function action_timer(number_of_days, url_for_button, stage_number, url_for_changing, text_for_button_after_action = "Далее", reject_href = false, reject_off = false, all_attribute = ["active"]) {
    const accept_button = document.querySelector(".accept_button_div");

    get_status_and_date(stage_number).then((status_and_date) => {
        if (status_and_date.date !== null) {
            if (status_and_date.status === 1) {
                accept_button.querySelector(".accept_button").textContent = text_for_button_after_action;
                on_accept_button("active_time", all_attribute);
            } else {
                accept_button.querySelector(".accept_button").textContent = `Откроется ${status_and_date.date}`;
                if (!reject_off) {
                    off_accept_button("active_time", all_attribute);
                }
            }
        }
    });

    accept_button.addEventListener("click", () => {
        get_status_and_date(stage_number).then((status_and_date) => {
            if (status_and_date.date !== null) {
                if (status_and_date.status === 1) {
                    if (!reject_href) {
                        window.location.href = url_for_button;
                    }
                } else {
                    accept_button.querySelector(".accept_button").textContent = `Откроется ${status_and_date.date}`;
                }
            } else {
                let data_for_send = {
                    "number_of_days": number_of_days
                }

                send_data_to_server(url_for_changing, data_for_send).then(response => {
                    accept_button.querySelector(".accept_button").textContent = `Откроется ${response}`;
                });
            }
        });
    });
}

export function get_item(key, add_postfix = true) {
    if (add_postfix) {
        return localStorage.getItem(`${key}_${localStorage.getItem("active_habit")}`);
    } else {
        return localStorage.getItem(key);
    }
}

export function set_item(key, value, add_postfix = true) {
    if (add_postfix) {
        localStorage.setItem(`${key}_${get_item("active_habit", false)}`, value);
    } else {
        localStorage.setItem(key, value);
    }
}

export function remove_item(key, add_postfix = false) {
    if (add_postfix) {
        return localStorage.removeItem(`${key}_${localStorage.getItem("active_habit")}`);
    } else {
        return localStorage.removeItem(key);
    }
}

function set_data_from_input_immediately(element, key, add_postfix = true) {
    element.addEventListener('input', () => {
        set_item(key, element.value, add_postfix);
    });
}


function recovery_data_for_input(element, key, add_postfix = true) {
    element.value = get_item(key, add_postfix);
}

export function serve_input_field(element, key, add_postfix = true) {
    set_data_from_input_immediately(element, key, add_postfix);
    recovery_data_for_input(element, key, add_postfix);
}

export function on_accept_button(attribute = "active", all_attribute = ["active"]) {
    let accept_button_div = document.querySelector(".accept_button_div");
    let accept_button = document.querySelector(".accept_button");

    accept_button_div.setAttribute(attribute, "true");

    let all_ok = true;
    for (let elem of all_attribute) {
        if (accept_button_div.getAttribute(elem) !== "true") {
            all_ok = false;
        }
    }

    if (all_ok) {
        accept_button_div.classList.remove("accept_button_div_inactive");
        accept_button.classList.remove("accept_button_inactive");
    }
}

export function off_accept_button(attribute = "active", all_attribute = ["active"]) {
    let accept_button_div = document.querySelector(".accept_button_div");
    let accept_button = document.querySelector(".accept_button");

    accept_button_div.setAttribute(attribute, "false");

    for (let elem of all_attribute) {
        if (accept_button_div.getAttribute(elem) !== "true") {
            accept_button_div.classList.add("accept_button_div_inactive");
            accept_button.classList.add("accept_button_inactive");
        }
    }
}

export function serve_accept_button(input_fields, all_attribute = ["active"]) {
    let all_ok = true;
    for (let input_field of input_fields) {
        if (input_field.value === "") {
            all_ok = false;
        }
    }

    if (all_ok) {
        on_accept_button("active", all_attribute);
    } else {
        off_accept_button("active", all_attribute);
    }

    for (let input_field of input_fields) {
        input_field.addEventListener("input", () => {
            let all_ok = true;
            for (let input_field of input_fields) {
                if (input_field.value === "") {
                    all_ok = false;
                }
            }

            if (all_ok) {
                on_accept_button("active", all_attribute);
            } else {
                off_accept_button("active", all_attribute);
            }
        });
    }
}

export function validate_and_save_for_days_and_times(input_fields_holder, add_postfix = true) {
    const now_time_input_elements = input_fields_holder.querySelectorAll(".time_input_field");
    let all_ok = true;

    const days_and_times = take_dates_and_times_from_page();
    set_item("days_and_times", JSON.stringify(days_and_times), add_postfix);

    if (now_time_input_elements.length === 1) {
        all_ok = false;
    } else {
        for (let elem of now_time_input_elements) {
            if (elem.value && !is_valid_time(elem.value)) {
                all_ok = false;
                break;
            }
        }

        const has_any_text = Array.from(now_time_input_elements)
            .some(el => el.value.trim() !== "");
        if (!has_any_text) {
            all_ok = false;
        }
    }

    if (all_ok) {
        on_accept_button("time", ["active", "time"]);
    } else {
        off_accept_button("time", ["active", "time"]);
    }
}

export function recovery_for_days_and_times(input_fields_holder, add_postfix = true) {
    let loaded_days_and_times = JSON.parse(get_item("days_and_times", add_postfix));

    if (loaded_days_and_times) {
        for (let i = 0; i < loaded_days_and_times.days_of_week.length; ++i) {
            create_input_date_and_time_fields_holder(input_fields_holder, "../../../../icons/delete_inactive.svg");
        }

        let now_time_input_elements = input_fields_holder.querySelectorAll(".input_data_and_time_fields_holder");

        let all_ok = true;

        for (let i = 0; i < loaded_days_and_times.days_of_week.length; ++i) {
            now_time_input_elements[i].querySelector(".date_input_field").value = loaded_days_and_times.days_of_week[i];
            now_time_input_elements[i].querySelector(".time_input_field").value = loaded_days_and_times.times[i];

            if (!is_valid_time(loaded_days_and_times.times[i])) {
                all_ok = false;
            }
        }

        if (loaded_days_and_times.times.length === 0) {
            all_ok = false;
        }

        if (all_ok) {
            on_accept_button("time", ["active", "time"]);
        } else {
            off_accept_button("time", ["active", "time"]);
        }
    }
}

export function is_valid_time(time_from_user) {
    return /^([01]?\d|2[0-3]):[0-5]\d$/.test(time_from_user);
}

export function current_habit_is_negative() {
    return get_item("current_habit_type", false) === "negative";
}
