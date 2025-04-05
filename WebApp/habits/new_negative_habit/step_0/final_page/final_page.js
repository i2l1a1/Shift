import {state_dict, state_numbers, test_1} from "../../../../tools/test_functions.js";
import {send_data_to_server} from "../../../../tools/networking_tools.js";


const back_button = document.querySelector(".back_button");
const current_state_paragraph = document.getElementById("current_state_paragraph");
const accept_button = document.querySelector(".accept_button_div");

let answer_0_for_test_page_1 = localStorage.getItem("answer_0_for_test_page_1");
let answer_0_for_test_page_2 = localStorage.getItem("answer_0_for_test_page_2");
let now_state = 0;

if (answer_0_for_test_page_1 === "option_1") {
    back_button.href = "../habit_test_yes_1/habit_test_yes_1.html";
    if (answer_0_for_test_page_2 === "option_1") { // раздумье
        now_state = 1;
    } else if (answer_0_for_test_page_2 === "option_2") { // подготовка
        now_state = 2;
    } else if (answer_0_for_test_page_2 === "option_3") { // усилия
        now_state = 3;
    }
} else {
    back_button.href = "../habit_test_no_1/habit_test_no_1.html";
    if (answer_0_for_test_page_2 === "option_1") { // раздумья
        now_state = 1;
    } else { // постоянство
        now_state = 4;
    }
}

console.log("negative habit:", localStorage.getItem("negative_habit_name_page_0"));
console.log(`question (yes/no): ${answer_0_for_test_page_1} ('${test_1.question_1.options[answer_0_for_test_page_1]}')`);
console.log(`question (after this): ${answer_0_for_test_page_2} ('${test_1.question_2.options[answer_0_for_test_page_1]}')`);
console.log(`now state: ${now_state} ('${state_dict[now_state]}')`);

current_state_paragraph.innerHTML = `Ваш текущий этап определён! Вы на <b>${state_numbers[now_state]} этапе — ${state_dict[now_state]}</b>.`;

for (let i = 5; i > now_state - 1; --i) {
    document.getElementById(`state_info_${i}`).hidden = false;
}

accept_button.addEventListener("click", (event) => {
    event.preventDefault();
    const url = "http://127.0.0.1:9091/new_negative_habit";
    let data_for_send = {
        "now_state": now_state,
        "negative_habit_name": localStorage.getItem("negative_habit_name_page_0"),
        // "tg_user_id": window.Telegram.WebApp.initDataUnsafe.user.id.toString()
        "tg_user_id": "487020656"
    }

    send_data_to_server(url, data_for_send).then(response => {
        localStorage.setItem("active_habit", response["id"]);
        window.location.href = "../../step_1/method_info/method_info.html";
        localStorage.removeItem("answer_0_for_test_page_1");
        localStorage.removeItem("answer_0_for_test_page_2");
        localStorage.removeItem("negative_habit_name_page_0");
    });
});