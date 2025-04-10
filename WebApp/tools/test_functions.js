import {create_element} from "./graphical_tools.js";

export let test_2 = {
    question_1: {
        question_text: "Я искал информацию о проблеме своего поведения.",
        options: {
            option_1: "Да",
            option_2: "Скорее, да",
            option_3: "Скорее, нет",
            option_4: "Нет",
        }
    },
    question_2: {
        question_text: "Я размышлял о том, что прочитал в статьях и книгах, и о том, как преодолеть мои проблемы.",
        options: {
            option_1: "Да",
            option_2: "Скорее, да",
            option_3: "Скорее, нет",
            option_4: "Нет",
        }
    },
    question_3: {
        question_text: "Я вспомнил, что говорили мне люди о преимуществах изменения моего поведения.",
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
        if (input.value === localStorage.getItem(label_for_local_storage)) {
            input.checked = true;
        }

        label.appendChild(input);
        label.appendChild(document.createTextNode(value));

        parent_element.appendChild(label);

        input.addEventListener("change", function () {
            localStorage.setItem(label_for_local_storage, this.value);
        });
    }
}