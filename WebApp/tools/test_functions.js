import {create_element} from "./graphical_tools.js";
import {set_item, get_item} from "./auxiliary_tools.js";

export let test_2 = {
    question_1: {
        question_text_negative_habit: "Я искал(а) информацию о проблеме своего текущего поведения.",
        question_text_positive_habit: "Я искал(а) информацию о проблеме своего текущего поведения.",
        options: {
            option_1: "Да",
            option_2: "Скорее, да",
            option_3: "Скорее, нет",
            option_4: "Нет",
        }
    },
    question_2: {
        question_text_negative_habit: "Я размышлял(а) о том, что увидел(а) в фильме, прочитал(а) в книге или статье, и о том, как преодолеть мои проблемы.",
        question_text_positive_habit: "Я размышлял(а) о том, что увидел(а) в фильме, прочитал(а) в книге или статье, и о том, как эффективно развить нужную мне привычку.",
        options: {
            option_1: "Да",
            option_2: "Скорее, да",
            option_3: "Скорее, нет",
            option_4: "Нет",
        }
    },
    question_3: {
        question_text_negative_habit: "Я вспомнил(а), что говорили мне люди о преимуществах изменения моего поведения.",
        question_text_positive_habit: "Я вспомнил(а), что говорили мне люди о преимуществах внедрения этой новой полезной привычки.",
        options: {
            option_1: "Да",
            option_2: "Скорее, да",
            option_3: "Скорее, нет",
            option_4: "Нет",
        }
    }
};


export let state_dict = {
    1: "раздумье",
    2: "подготовка",
    3: "усилия",
    4: "постоянство",
    5: "сохранение"
}

export let state_numbers = {
    1: "первом",
    2: "втором",
    3: "третьем",
    4: "четвёртом",
    5: "пятом"
}

export function create_test_options(options_list, parent_element, label_for_local_storage) {
    for (let key in options_list) {
        let value = options_list[key];

        let label = create_element("label", "question_option");

        let input = create_element("input");
        input.type = "radio";
        input.name = label_for_local_storage;
        input.value = key;
        if (input.value === get_item(label_for_local_storage)) {
            input.checked = true;
        }

        label.appendChild(input);
        label.appendChild(document.createTextNode(value));

        parent_element.appendChild(label);

        input.addEventListener("change", function () {
            set_item(label_for_local_storage, this.value);
        });
    }
}