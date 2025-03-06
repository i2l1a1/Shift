import {black_bg_color, create_element, create_image} from "../tools/graphical_tools.js";
import {get_data_from_server, send_data_to_server} from "../tools/networking_tools.js";

let tg = window.Telegram.WebApp;

tg.setHeaderColor(black_bg_color);

let one_time_reminders_holder = document.querySelector(".one_time_reminders_holder");

get_data_from_server("http://127.0.0.1:9091/get_one_time_reminders").then((data_from_server) => {
    let response_status = data_from_server[0];
    console.log(response_status);
    data_from_server = data_from_server[1];
    console.log(data_from_server);
    for (const reminder of data_from_server) {
        let one_time_reminder_div = create_element("div", "one_time_reminder_div");
        let one_time_reminder_div_inner = create_element("div", "one_time_reminder_div_inner");
        one_time_reminder_div_inner.setAttribute("data-id", reminder.id);
        let one_time_reminder_checkbox = create_image("img", "../icons/checkbox_basic_state.svg");
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
            send_data_to_server(`http://127.0.0.1:9091/delete_one_time_reminder/${reminder_id}`).then(response => {
                if (response["is_ok"] === true) {
                    reminder_div.remove();
                }
            });
        });
    }
});

