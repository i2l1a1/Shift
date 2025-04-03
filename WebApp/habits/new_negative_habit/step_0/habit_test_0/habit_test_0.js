import {create_test_options, test_1} from "../../../../tools/test_functions.js";

const accept_button = document.querySelector(".accept_button_div");
const question_with_options = document.querySelector(".question_with_options");
const habit_test_question_1 = document.getElementById("habit_test_question_1");

test_1.question_1.question_text = `«${localStorage.getItem("negative_habit_name_page_0")}»${test_1.question_1.question_text}`;
question_with_options.innerHTML = test_1.question_1.question_text;

create_test_options(test_1.question_1.options, habit_test_question_1, "answer_0_for_test_page_1");

accept_button.addEventListener("click", () => {
    if (localStorage.getItem("answer_0_for_test_page_1") === "option_1") {
        accept_button.querySelector(".accept_button").href = "../habit_test_yes_1/habit_test_yes_1.html";
    } else {
        accept_button.querySelector(".accept_button").href = "../habit_test_no_1/habit_test_no_1.html";
    }
});
