import {get_data_from_server, send_data_to_server} from "./networking_tools.js";

export function get_current_date() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

export function get_dates_and_times_for_regular_reminders(dates_from_server, times_from_server) {
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
        0: "Определение этапа",
        1: "Этап 1 — раздумье.",
        2: "Этап 2 — подготовка.",
        3: "Этап 3 — усилия.",
        4: "Этап 4 — постоянство.",
        5: "Этап 5 — сохранение.",
    };
    return stages[stage_number];
}


export function update_stage_number(stage_number) {
    let data_for_send = {
        "stage_number": stage_number
    }

    const url = `http://127.0.0.1:9091/edit_negative_habit/change_stage/${get_item("active_habit", false)}`;

    send_data_to_server(url, data_for_send).then(r => {

    });
}

function get_status_and_date(stage_number) {
    const url = `http://127.0.0.1:9091/get_negative_habit/${get_item("active_habit", false)}`;

    return get_data_from_server(url).then((data_from_server) => {
        let response_status = data_from_server[0];
        data_from_server = data_from_server[1];
        let unlock_date = data_from_server[0][`unlock_date_for_stage_${stage_number}`];

        const url_for_check = `http://127.0.0.1:9091/stage_${stage_number}/get_unlock_status_stage_${stage_number}/${get_item("active_habit", false)}`;

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

export function action_timer(number_of_days, url_for_button, stage_number, url_for_changing, text_for_button_after_action = "Далее") {
    const accept_button = document.querySelector(".accept_button_div");

    get_status_and_date(stage_number).then((status_and_date) => {
        if (status_and_date.date !== null) {
            if (status_and_date.status === 1) {
                accept_button.querySelector(".accept_button").textContent = text_for_button_after_action;
                accept_button.href = url_for_button;
            } else {
                accept_button.querySelector(".accept_button").textContent = `Откроется ${status_and_date.date}`;
            }
        }
    });

    accept_button.addEventListener("click", () => {
        get_status_and_date(stage_number).then((status_and_date) => {
            if (status_and_date.date !== null) {
                if (status_and_date.status === 1) {
                    window.location.href = url_for_button;
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

export function remove_item(key) {
    localStorage.removeItem(key);
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
