import {create_test_options, test_2} from "../../../../tools/test_functions.js";

const accept_button = document.querySelector(".accept_button_div");

const habit_test_question_1 = document.getElementById("habit_test_question_1");
const habit_test_question_2 = document.getElementById("habit_test_question_2");
const habit_test_question_3 = document.getElementById("habit_test_question_3");

const question_1_with_options = document.getElementById("question_1_with_options");
const question_2_with_options = document.getElementById("question_2_with_options");
const question_3_with_options = document.getElementById("question_3_with_options");

question_1_with_options.innerHTML = test_2.question_1.question_text;
question_2_with_options.innerHTML = test_2.question_2.question_text;
question_3_with_options.innerHTML = test_2.question_3.question_text;

create_test_options(test_2.question_1.options, habit_test_question_1, "answer_1_for_test_page_1");
create_test_options(test_2.question_2.options, habit_test_question_2, "answer_2_for_test_page_1");
create_test_options(test_2.question_3.options, habit_test_question_3, "answer_3_for_test_page_1");

accept_button.addEventListener("click", (event) => {
    event.preventDefault();
    const question_1 = localStorage.getItem("answer_1_for_test_page_1");
    const question_2 = localStorage.getItem("answer_2_for_test_page_1");
    const question_3 = localStorage.getItem("answer_3_for_test_page_1");

    if (["option_1", "option_2"].includes(question_1) &&
        ["option_1", "option_2"].includes(question_2) &&
        ["option_1", "option_2"].includes(question_3)
    ) {
        accept_button.querySelector(".accept_button").setAttribute("href", "../final_page/final_page.html");
        window.location.href = "../final_page/final_page.html";
    }

    console.log(`question_1: ${question_1}\nquestion_2: ${question_2}\nquestion_3: ${question_3}\n`)
});
