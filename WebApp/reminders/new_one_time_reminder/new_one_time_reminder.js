import {send_data_to_server} from "../../tools/networking_tools.js";
import {
    check_date,
    get_current_date,
    get_item, is_valid_time,
    off_accept_button,
    on_accept_button, remove_item, set_item
} from "../../tools/auxiliary_tools.js";
import {mobile_focus_for_fields} from "../../tools/mobile_adaptations.js";

const accept_button = document.querySelector(".accept_button_div");
const reminder_input_field = document.getElementById("reminder_input_field");
const date_input_field = document.getElementById("date_input_field");
const time_input_field = document.getElementById("time_input_field");

const prev_text_from_user = get_item("one_time_reminder_text", false);
const prev_date_from_user = get_item("one_time_reminder_date", false);
const prev_time_from_user = get_item("one_time_reminder_time", false);

if (prev_text_from_user) {
    reminder_input_field.value = prev_text_from_user;
}

if (prev_date_from_user) {
    date_input_field.value = prev_date_from_user;
} else {
    date_input_field.value = get_current_date();
}

if (prev_time_from_user) {
    time_input_field.value = prev_time_from_user;
}

if (reminder_input_field.value !== "") {
    on_accept_button("active", ["active", "active_time", "active_date"]);
} else {
    off_accept_button("active", ["active", "active_time", "active_date"]);
}

if (check_date(date_input_field.value)) {
    on_accept_button("active_date", ["active", "active_time", "active_date"]);
} else {
    off_accept_button("active_date", ["active", "active_time", "active_date"]);
}

if (is_valid_time(time_input_field.value)) {
    on_accept_button("active_time", ["active", "active_time", "active_date"]);
} else {
    off_accept_button("active_time", ["active", "active_time", "active_date"]);
}

reminder_input_field.addEventListener("input", () => {
    set_item("one_time_reminder_text", reminder_input_field.value, false);
    if (reminder_input_field.value !== "") {
        on_accept_button("active", ["active", "active_time", "active_date"]);
    } else {
        off_accept_button("active", ["active", "active_time", "active_date"]);
    }
});
date_input_field.addEventListener("input", () => {
    set_item("one_time_reminder_date", date_input_field.value, false);
    if (check_date(date_input_field.value)) {
        on_accept_button("active_date", ["active", "active_time", "active_date"]);
    } else {
        off_accept_button("active_date", ["active", "active_time", "active_date"]);
    }
});

time_input_field.addEventListener("input", () => {
    set_item("one_time_reminder_time", time_input_field.value, false);
    if (is_valid_time(time_input_field.value)) {
        on_accept_button("active_time", ["active", "active_time", "active_date"]);
    } else {
        off_accept_button("active_time", ["active", "active_time", "active_date"]);
    }
});


accept_button.addEventListener("click", (event) => {
    if (accept_button.getAttribute("active") === "true" &&
        accept_button.getAttribute("active_date") === "true" &&
        accept_button.getAttribute("active_time") === "true") {

        event.preventDefault();

        const url = "http://127.0.0.1:9091/new_one_time_reminder";
        let data_for_send = {
            "text": reminder_input_field.value,
            "date": date_input_field.value,
            "time": time_input_field.value,
            // "tg_user_id": window.Telegram.WebApp.initDataUnsafe.user.id.toString()
            "tg_user_id": "487020656"
        }

        send_data_to_server(url, data_for_send).then(r => {
            remove_item("one_time_reminder_text");
            remove_item("one_time_reminder_date");
            remove_item("one_time_reminder_time");
            window.location.href = "../reminders_page/reminders.html";
        });
    }
});

mobile_focus_for_fields();
