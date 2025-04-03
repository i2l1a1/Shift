import {create_test_options, test_1} from "../../../../tools/test_functions.js";

const accept_button = document.querySelector(".accept_button_div");
const habit_test_question_3 = document.getElementById("habit_test_question_3");
const question_with_options = document.querySelector(".question_with_options");

question_with_options.innerHTML = `«${localStorage.getItem("negative_habit_name_page_0")}»${test_1.question_2.question_text}`;

create_test_options(test_1.question_2.options, habit_test_question_3, "answer_0_for_test_page_2");

accept_button.addEventListener("click", () => {

});
