import {create_test_options, test_2} from "../../../../tools/test_functions.js";
import {send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {
    current_habit_is_negative,
    get_item,
    off_accept_button,
    on_accept_button,
    set_item
} from "../../../../tools/auxiliary_tools.js";

send_page_name_to_server("new_habit/step_1/test_after_thinking/test_after_thinking.html").then(r => {

});

const accept_button = document.querySelector(".accept_button_div");

const habit_test_question_1 = document.getElementById("habit_test_question_1");
const habit_test_question_2 = document.getElementById("habit_test_question_2");
const habit_test_question_3 = document.getElementById("habit_test_question_3");

const question_1_with_options = document.getElementById("question_1_with_options");
const question_2_with_options = document.getElementById("question_2_with_options");
const question_3_with_options = document.getElementById("question_3_with_options");

if (current_habit_is_negative()) {
    question_1_with_options.innerHTML = test_2.question_1.question_text_negative_habit;
    question_2_with_options.innerHTML = test_2.question_2.question_text_negative_habit;
    question_3_with_options.innerHTML = test_2.question_3.question_text_negative_habit;

} else {
    question_1_with_options.innerHTML = test_2.question_1.question_text_positive_habit;
    question_2_with_options.innerHTML = test_2.question_2.question_text_positive_habit;
    question_3_with_options.innerHTML = test_2.question_3.question_text_positive_habit;
}

function all_true(data) {
    for (let elem of data) if (elem === false) return false;
    return true;
}

let questions_options = document.querySelectorAll(".question_options");

let question_status = [false, false, false];

for (let i = 0; i < questions_options.length; ++i) {
    const answer = get_item(`answer_${i + 1}_for_test`);
    question_status[i] = (answer === "option_1" || answer === "option_2");
}

if (all_true(question_status)) {
    on_accept_button();
}

for (let i = 0; i < questions_options.length; ++i) {
    questions_options[i].addEventListener("input", (event) => {
        question_status[i] = event.target.value === "option_1" || event.target.value === "option_2";
        if (all_true(question_status)) {
            on_accept_button();
        } else {
            off_accept_button();
        }
    });
}

create_test_options(test_2.question_1.options, habit_test_question_1, "answer_1_for_test");
create_test_options(test_2.question_2.options, habit_test_question_2, "answer_2_for_test");
create_test_options(test_2.question_3.options, habit_test_question_3, "answer_3_for_test");

accept_button.addEventListener("click", (event) => {
    if (accept_button.getAttribute("active") === "true") {
        event.preventDefault();
        const question_1 = get_item("answer_1_for_test");
        const question_2 = get_item("answer_2_for_test");
        const question_3 = get_item("answer_3_for_test");

        if (["option_1", "option_2"].includes(question_1) &&
            ["option_1", "option_2"].includes(question_2) &&
            ["option_1", "option_2"].includes(question_3)
        ) {
            accept_button.querySelector(".accept_button").setAttribute("href", "../final_page/final_page.html");
            window.location.href = "../final_page/final_page.html";
        }
    }
});
