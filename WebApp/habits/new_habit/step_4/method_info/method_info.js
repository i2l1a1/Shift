import {send_page_name_to_server} from "../../../../tools/networking_tools.js";
import {update_stage_number, current_habit_is_negative} from "../../../../tools/auxiliary_tools.js";

send_page_name_to_server("new_habit/step_4/method_info/method_info.html").then(r => {

});

update_stage_number(4);

const triggers_text = document.getElementById("triggers_text");
const say_no_header = document.getElementById("say_no_header");
const say_no_text_1 = document.getElementById("say_no_text_1");
const say_no_text_2 = document.getElementById("say_no_text_2");
const say_no_text_3 = document.getElementById("say_no_text_3");

if (current_habit_is_negative()) {
    triggers_text.innerHTML = `На четвёртом этапе, этапе <b>постоянства</b>, вы закрепите свой результат. Самые частые причины возращения старого поведения — это так называемые триггеры высокого риска: стресс, усталость, скука, определённые люди или места. На этом этапе мы будем отслеживать эти триггеры.`;

    say_no_header.textContent = "Говорим «нет»";
    say_no_text_1.textContent = "Не менее важно научиться отказывать людям, обстоятельствам и даже самому себе.";
    say_no_text_2.textContent = "Представьте типичную ситуацию риска и потренируйтесь говорить твёрдое «нет». Сначала — мысленно. Затем — вслух, даже просто перед зеркалом или с кем-то из вашей группы поддержки. Такой репетиции будет достаточно, чтобы в реальной ситуации вы чувствовали себя уверенно.";
    say_no_text_3.textContent = "И помните: каждый отказ от старого поведения — это шаг к закреплению новой привычки.";
} else {
    triggers_text.innerHTML = `На четвёртом этапе, этапе <b>постоянства</b>, вы закрепите новый стиль жизни. Самые частые причины временного отказа от полезной привычки — это так называемые триггеры высокого риска: усталость, перегрузка, смена обстановки, определённые люди или события. На этом этапе мы будем отслеживать эти триггеры.`;

    say_no_header.remove();
    say_no_text_1.remove();
    say_no_text_2.remove();
    say_no_text_3.remove();
}
