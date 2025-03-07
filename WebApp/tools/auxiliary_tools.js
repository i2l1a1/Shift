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
