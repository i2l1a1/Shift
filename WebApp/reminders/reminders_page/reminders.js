import {black_bg_color, create_element, create_image} from "../../tools/graphical_tools.js";
import {get_data_from_server, send_data_to_server, server_url, tg_user_id} from "../../tools/networking_tools.js";
import {convert_dates_and_times_for_user} from "../../tools/auxiliary_tools.js";

let tg = window.Telegram.WebApp;

tg.setHeaderColor(black_bg_color);

let one_time_reminders_holder = document.querySelector(".one_time_reminders_holder");
let regular_reminders_holder = document.querySelector(".regular_reminders_holder");
let one_time_reminders_header = document.querySelector('.one_time_reminders_header');
let regular_reminders_header = document.querySelector('.regular_reminders_header');


get_data_from_server(`${server_url}/get_one_time_reminders/${tg_user_id}`).then((data_from_server) => {
    let response_status = data_from_server[0];
    data_from_server = data_from_server[1];
    for (const reminder of data_from_server) {
        one_time_reminders_header.hidden = false;
        let one_time_reminder_div = create_element("div", "one_time_reminder_div");
        let one_time_reminder_div_inner = create_element("div", "one_time_reminder_div_inner");
        one_time_reminder_div_inner.setAttribute("data-id", reminder.id);
        let one_time_reminder_checkbox = create_image("img", "../../icons/checkbox_basic_state.svg");
        let one_time_reminder_text = create_element("div", "one_time_reminder_text", reminder.text)
        let one_time_reminder_date_and_time = create_element("div", "one_time_reminder_date_and_time");
        let one_time_reminder_date = create_element("div", "one_time_reminder_date", reminder.date);
        let one_time_reminder_time = create_element("div", "one_time_reminder_time", reminder.time);

        one_time_reminders_holder.appendChild(one_time_reminder_div);
        one_time_reminder_div.appendChild(one_time_reminder_div_inner);
        one_time_reminder_div_inner.appendChild(one_time_reminder_checkbox);
        one_time_reminder_div_inner.appendChild(one_time_reminder_text);
        one_time_reminder_div_inner.appendChild(one_time_reminder_date_and_time);
        one_time_reminder_date_and_time.appendChild(one_time_reminder_date);
        one_time_reminder_date_and_time.appendChild(one_time_reminder_time);

        one_time_reminder_checkbox.addEventListener("click", () => {
            const reminder_div = one_time_reminder_checkbox.parentElement.parentElement;
            const reminder_div_inner = reminder_div.querySelector(".one_time_reminder_div_inner");
            let reminder_id = reminder_div_inner.getAttribute("data-id");
            send_data_to_server(`${server_url}/delete_one_time_reminder/${reminder_id}`).then(response => {
                if (response["is_ok"] === true) {
                    reminder_div.remove();
                    if (!one_time_reminders_holder.children.length) {
                        one_time_reminders_header.hidden = true;
                    }
                }
            });

        });
    }
});

get_data_from_server(`${server_url}/get_regular_reminders/${tg_user_id}`).then((data_from_server) => {
    let response_status = data_from_server[0];
    data_from_server = data_from_server[1];
    for (const reminder of data_from_server) {
        regular_reminders_header.hidden = false;
        let regular_reminder_div = create_element("div", "regular_reminder_div");
        let regular_reminder_div_inner = create_element("div", "regular_reminder_div_inner");
        regular_reminder_div_inner.setAttribute("data-id", reminder.id);
        let regular_reminder_delete_button = create_image("img", "../../icons/delete_active.svg");
        let regular_reminder_text_and_dates_times_holder = create_element("div", "regular_reminder_text_and_dates_times_holder");
        let regular_reminder_text = create_element("div", "regular_reminder_text", reminder.text)
        let regular_reminder_dates_and_times = create_element("div", "regular_reminder_dates_and_times",
            convert_dates_and_times_for_user(reminder.dates, reminder.times));

        regular_reminders_holder.appendChild(regular_reminder_div);
        regular_reminder_div.appendChild(regular_reminder_div_inner);
        regular_reminder_div_inner.appendChild(regular_reminder_delete_button);
        regular_reminder_div_inner.appendChild(regular_reminder_text_and_dates_times_holder);
        regular_reminder_text_and_dates_times_holder.appendChild(regular_reminder_text);
        regular_reminder_text_and_dates_times_holder.appendChild(regular_reminder_dates_and_times);

        regular_reminder_delete_button.addEventListener("click", () => {
            const reminder_div = regular_reminder_delete_button.parentElement.parentElement;
            const reminder_div_inner = reminder_div.querySelector(".regular_reminder_div_inner");
            let reminder_id = reminder_div_inner.getAttribute("data-id");
            send_data_to_server(`${server_url}/delete_regular_reminder/${reminder_id}`).then(response => {
                if (response["is_ok"] === true) {
                    reminder_div.remove();
                    if (!regular_reminders_holder.children.length) {
                        regular_reminders_header.hidden = true;
                    }
                }
            });
        });
    }
});
