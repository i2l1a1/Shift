import {create_element, create_image} from "../../tools/graphical_tools.js";
import {mobile_focus_for_fields} from "../../tools/mobile_adaptations.js";
import {send_data_to_server} from "../../tools/networking_tools.js";

const input_fields_holder = document.querySelector(".input_fields_holder");
const time_input_field = document.querySelector(".time_input_field");
const accept_button = document.querySelector(".accept_button_div");
const reminder_input_field = document.querySelector(".input_field");

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

function create_input_date_and_time_fields_holder() {
    const new_input_date_and_time_fields_holder = create_element("div", "input_data_and_time_fields_holder");
    const new_time_input_field = create_element("input", "time_input_field");
    new_time_input_field.placeholder = "Время...";
    const new_drop_down_list = create_drop_down_list();
    const new_delete_inactive_svg = create_image("delete_inactive_svg", "../../icons/delete_inactive.svg");

    let need_to_add_date_time_holder = true;

    new_time_input_field.addEventListener('input', function () {
        if (new_time_input_field.value.length >= 2 && need_to_add_date_time_holder) {
            create_input_date_and_time_fields_holder();
            need_to_add_date_time_holder = false;
        }
    });

    input_fields_holder.appendChild(new_input_date_and_time_fields_holder);
    new_input_date_and_time_fields_holder.appendChild(new_drop_down_list);
    new_input_date_and_time_fields_holder.appendChild(new_time_input_field);
    new_input_date_and_time_fields_holder.appendChild(new_delete_inactive_svg);
}

let need_to_add_date_time_holder = true;
time_input_field.addEventListener('input', function () {
    if (time_input_field.value.length >= 2 && need_to_add_date_time_holder) {
        create_input_date_and_time_fields_holder();
        need_to_add_date_time_holder = false;
    }
});

accept_button.addEventListener("click", () => {
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
    console.log(days_of_week);
    console.log(times);

    const url = "http://127.0.0.1:9091/new_regular_reminder";
    let data_for_send = {
        "text": reminder_input_field.value,
        "dates": days_of_week,
        "times": times,
        // "tg_user_id": window.Telegram.WebApp.initDataUnsafe.user.id.toString()
        "tg_user_id": "487020656"
    }

    send_data_to_server(url, data_for_send).then(r => {

    });
});


mobile_focus_for_fields()