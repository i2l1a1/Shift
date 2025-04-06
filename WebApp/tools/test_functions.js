import {create_element} from "./graphical_tools.js";

export let test_1 = {
    question_1: {
        question_text: " — есть ли у меня в настоящее время проблема с этим?",
        options: {
            option_1: "Есть",
            option_2: "Нет"
        }
    },
    question_2: {
        question_text: " — почему Вы об этом вспомнили сейчас?",
        options: {
            option_1: "Потому что для меня это не проблема, но я это пока что не изменил",
            option_2: "Потому что я уже изменил это"
        }
    },
    question_3: {
        question_text: "Когда Вы собираетесь менять ситуацию?",
        options: {
            option_1: "Когда-нибудь",
            option_2: "В ближайшие несколько недель",
            option_3: "Я уже меняю ситуацию"
        }
    },
};

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
    4: "чертвёртом",
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