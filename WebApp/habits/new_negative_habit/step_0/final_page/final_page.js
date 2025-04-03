import {state_dict, state_numbers, test_1} from "../../../../tools/test_functions.js";


const back_button = document.querySelector(".back_button");
const current_state_paragraph = document.getElementById("current_state_paragraph");

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