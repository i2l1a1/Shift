import {send_data_to_server, send_page_name_to_server, server_url} from "../../../../tools/networking_tools.js";
import {
    action_timer,
    current_habit_is_negative,
    get_item, get_status_and_date,
    serve_accept_button,
    serve_input_field
} from "../../../../tools/auxiliary_tools.js";
import {mobile_focus_for_fields} from "../../../../tools/mobile_adaptations.js";

const textarea_1 = document.getElementById("textarea_1");
const textarea_2 = document.getElementById("textarea_2");
const textarea_3 = document.getElementById("textarea_3");
const textarea_4 = document.getElementById("textarea_4");
const textarea_5 = document.getElementById("textarea_5");
const hint_for_user_1 = document.getElementById("hint_for_user_1");
const hint_for_user_2 = document.getElementById("hint_for_user_2");
const hint_for_user_3 = document.getElementById("hint_for_user_3");
const hint_for_user_4 = document.getElementById("hint_for_user_4");
const hint_for_user_5 = document.getElementById("hint_for_user_5");
const accept_button = document.querySelector(".accept_button_div");

if (current_habit_is_negative()) {
    hint_for_user_1.textContent = "Время суток, когда вы сделали то, от чего хотите избавиться. Например, полдень или 19:00.";
    hint_for_user_2.textContent = "Ситуации, вызывающие проблемы. Например, стресс на работе.";
    hint_for_user_3.textContent = "Пусковые факторы, относящиеся к ситуации и чувствам. Где вы были, что делали, с кем были? Что чувствовали? Например, печаль, счастье или напряжение.";
    hint_for_user_4.textContent = "Поведение. Величина или количественная характеристика проблемного поведения. Например, количество выпитого или сумма денег.";
    hint_for_user_5.textContent = "Краткосрочные результаты проблемного поведения, а также долгосрочное воздействие на ваши чувства и реакцию окружающих.";
    textarea_1.placeholder = "Время суток";
    textarea_2.placeholder = "Ситуации";
    textarea_3.placeholder = "Пусковые факторы";
    textarea_4.placeholder = "Поведение";
    textarea_5.placeholder = "Последствия";
} else {
    hint_for_user_1.textContent = "В каких ситуациях вам, скорее всего, будет трудно начать выполнять новую привычку? Например, спешка утром, усталость вечером.";
    hint_for_user_2.textContent = "Какие чувства могут помешать начать новую привычку? Например, лень, тревога, раздражение, скука.";
    hint_for_user_3.textContent = "Какие мысли могут вас останавливать? Например, «не сейчас», «у меня не получится».";
    hint_for_user_4.textContent = "Что вы можете начать делать вместо полезной привычки? Например, скролить ленту, откладывать на потом.";
    hint_for_user_5.textContent = "Какие могут быть последствия, если вы будете избегать новой привычки? Как вы будете себя чувствовать? Как это повлияет на вашу цель?";
    textarea_1.placeholder = "Ситуации";
    textarea_2.placeholder = "Чувства";
    textarea_3.placeholder = "Мысли";
    textarea_4.placeholder = "Поведение";
    textarea_5.placeholder = "Последствия";
}

serve_input_field(textarea_1, "trigger_factors_test_textarea_1");
serve_input_field(textarea_2, "trigger_factors_test_textarea_2");
serve_input_field(textarea_3, "trigger_factors_test_textarea_3");
serve_input_field(textarea_4, "trigger_factors_test_textarea_4");
serve_input_field(textarea_5, "trigger_factors_test_textarea_5");

serve_accept_button([
    textarea_1,
    textarea_2,
    textarea_3,
    textarea_4,
    textarea_5], ["active", "active_time"]
);

send_page_name_to_server("new_habit/step_2/trigger_factors_test/trigger_factors_test.html").then(r => {

});

accept_button.addEventListener("click", () => {

    let data_for_send = {
        "trigger_factors_answer_1": textarea_1.value,
        "trigger_factors_answer_2": textarea_2.value,
        "trigger_factors_answer_3": textarea_3.value,
        "trigger_factors_answer_4": textarea_4.value,
        "trigger_factors_answer_5": textarea_5.value,
    }

    const url = `${server_url}/edit_habit/stage_2/add_trigger_factors/${get_item("active_habit", false)}`;

    send_data_to_server(url, data_for_send).then(r => {

    });
});

action_timer(5,
    "../support_group/support_group.html",
    2,
    `${server_url}/edit_habit/stage_2/start_trigger_tracking/${get_item("active_habit", false)}`,
    "Далее", true, false, ["active", "active_time"]);

accept_button.addEventListener("click", (event) => {
    if (accept_button.getAttribute("active") === "true") {
        get_status_and_date(2).then((status_and_date) => {
            if (status_and_date.date !== null) {
                if (status_and_date.status === 1 || accept_button.getAttribute("active_time") === "true") {
                    event.preventDefault();
                    window.location.href = "../support_group/support_group.html";
                }
            }
        });
    }
});

mobile_focus_for_fields()
