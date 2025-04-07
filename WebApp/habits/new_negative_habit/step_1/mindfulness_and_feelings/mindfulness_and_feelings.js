import {
    get_data_from_server,
    send_data_to_server,
    send_page_name_to_server
} from "../../../../tools/networking_tools.js";

send_page_name_to_server("new_negative_habit/step_1/mindfulness_and_feelings/mindfulness_and_feelings.html").then(r => {

});

const accept_button = document.querySelector(".accept_button_div");

const url_for_check = `http://127.0.0.1:9091/stage_1/get_unlock_status_stage_1/${localStorage.getItem("active_habit")}`;

get_data_from_server(url_for_check).then((data_from_server) => {
    let response_status = data_from_server[0];
    data_from_server = data_from_server[1];
    
    if (data_from_server === 1) {
        accept_button.querySelector(".accept_button").setAttribute("href", "../test_after_thinking/test_after_thinking.html");
        window.location.href = "../test_after_thinking/test_after_thinking.html";
        accept_button.querySelector(".accept_button").textContent = "Далее";
    }
});

accept_button.addEventListener("click", () => {
    // убрать!
    // accept_button.querySelector(".accept_button").setAttribute("href", "../test_after_thinking/test_after_thinking.html");


    get_data_from_server(url_for_check).then((data_from_server) => {
        let response_status = data_from_server[0];
        data_from_server = data_from_server[1];

        if (data_from_server === 1) {
            accept_button.querySelector(".accept_button").setAttribute("href", "../test_after_thinking/test_after_thinking.html");
            window.location.href = "../test_after_thinking/test_after_thinking.html";
            accept_button.querySelector(".accept_button").textContent = "Далее";
        }
    });

    const url = `http://127.0.0.1:9091/edit_negative_habit/stage_1/add_number_of_days_for_mindfulness/${localStorage.getItem("active_habit")}`;
    let data_for_send = {
        "number_of_days": 5
    }

    send_data_to_server(url, data_for_send).then(response => {
        accept_button.querySelector(".accept_button").textContent = `Откроется ${response}`;
    });
});
