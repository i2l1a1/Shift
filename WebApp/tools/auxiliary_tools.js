import {send_data_to_server} from "./networking_tools.js";

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

    const url = `http://127.0.0.1:9091/edit_negative_habit/change_stage/${localStorage.getItem("active_habit")}`;

    send_data_to_server(url, data_for_send).then(r => {

    });
}
