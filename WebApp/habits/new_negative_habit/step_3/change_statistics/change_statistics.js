import {
    get_data_from_server,
    send_data_to_server,
    send_page_name_to_server
} from "../../../../tools/networking_tools.js";

send_page_name_to_server("new_negative_habit/step_3/change_statistics/change_statistics.html").then(r => {

});

const success_value = document.getElementById("success_value");
const failure_value = document.getElementById("failure_value");
const success_bar = document.getElementById("success_bar");
const failure_bar = document.getElementById("failure_bar");
const accept_button = document.querySelector(".accept_button_div");


const url = `http://127.0.0.1:9091/get_negative_habit/${localStorage.getItem("active_habit")}`;

get_data_from_server(url).then((data_from_server) => {
    let response_status = data_from_server[0];
    data_from_server = data_from_server[1][0];

    const successCount = data_from_server["success_counter"];
    const failureCount = data_from_server["failure_counter"];

    success_value.textContent = successCount;
    failure_value.textContent = failureCount;

    const max_count = Math.max(successCount, failureCount, 1);

    success_bar.style.height = `${(successCount / max_count) * 100}%`;
    failure_bar.style.height = `${(failureCount / max_count) * 100}%`;
});

const url_for_check = `http://127.0.0.1:9091/stage_3/get_unlock_status_stage_3/${localStorage.getItem("active_habit")}`;

get_data_from_server(url_for_check).then((data_from_server) => {
    let response_status = data_from_server[0];
    data_from_server = data_from_server[1];

    if (data_from_server === 1) {
        accept_button.querySelector(".accept_button").setAttribute("href", "../trigger_factors_test/trigger_factors_test.html");
        window.location.href = "../final_page/final_page.html";
        accept_button.querySelector(".accept_button").textContent = "Завершить этот этап";
    }
});

accept_button.addEventListener("click", (event) => {
    event.preventDefault();
    // убрать!
    // accept_button.querySelector(".accept_button").setAttribute("href", "../test_after_thinking/test_after_thinking.html");


    get_data_from_server(url_for_check).then((data_from_server) => {
        let response_status = data_from_server[0];
        data_from_server = data_from_server[1];

        if (data_from_server === 1) {
            accept_button.querySelector(".accept_button").setAttribute("href", "../trigger_factors_test/trigger_factors_test.html");
            window.location.href = "../final_page/final_page.html";
            accept_button.querySelector(".accept_button").textContent = "Завершить этот этап";
        }
    });

    const url = `http://127.0.0.1:9091/edit_negative_habit/stage_3/start_effort_stage/${localStorage.getItem("active_habit")}`;
    let data_for_send = {
        "number_of_days": 5
    }

    send_data_to_server(url, data_for_send).then(response => {
        accept_button.querySelector(".accept_button").textContent = `Откроется ${response}`;
    });
});