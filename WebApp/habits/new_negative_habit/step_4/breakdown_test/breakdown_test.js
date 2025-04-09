import {
    get_data_from_server,
    send_data_to_server,
    send_page_name_to_server
} from "../../../../tools/networking_tools.js";

const places_textarea = document.getElementById("places_textarea");
const actions_textarea = document.getElementById("actions_textarea");
const when_textarea = document.getElementById("when_textarea");
const who_textarea = document.getElementById("who_textarea");

send_page_name_to_server("new_negative_habit/step_4/breakdown_test/breakdown_test.html").then(r => {

});

const accept_button = document.querySelector(".accept_button_div");

accept_button.addEventListener("click", () => {

    let data_for_send = {
        "places": places_textarea.value,
        "actions": actions_textarea.value,
        "when": when_textarea.value,
        "who": who_textarea.value,
    }

    const url = `http://127.0.0.1:9091/edit_negative_habit/stage_4/add_breakdown_factors/${localStorage.getItem("active_habit")}`;

    send_data_to_server(url, data_for_send).then(r => {

    });
});


const url_for_check = `http://127.0.0.1:9091/stage_4/get_unlock_status_stage_4/${localStorage.getItem("active_habit")}`;

get_data_from_server(url_for_check).then((data_from_server) => {
    let response_status = data_from_server[0];
    data_from_server = data_from_server[1];

    if (data_from_server === 1) {
        accept_button.querySelector(".accept_button").setAttribute("href", "../trigger_factors_test/trigger_factors_test.html");
        window.location.href = "../final_page/final_page.html";
        accept_button.querySelector(".accept_button").textContent = "Далее";
    }
});

accept_button.addEventListener("click", (event) => {
    event.preventDefault();
    // убрать!
    // accept_button.querySelector(".accept_button").setAttribute("href", "../test_after_thinking/test_after_thinking.html");


    get_data_from_server(url_for_check).then((data_from_server) => {
        let response_status = data_from_server[0];
        data_from_server = data_from_server[1];
        // alert(data_from_server);

        if (data_from_server === 1) {
            accept_button.querySelector(".accept_button").setAttribute("href", "../trigger_factors_test/trigger_factors_test.html");
            window.location.href = "../final_page/final_page.html";
            accept_button.querySelector(".accept_button").textContent = "Далее";
        }
    });

    const url = `http://127.0.0.1:9091/edit_negative_habit/stage_4/start_breakdown_tracking/${localStorage.getItem("active_habit")}`;
    let data_for_send = {
        "number_of_days": 5
    }

    send_data_to_server(url, data_for_send).then(response => {
        accept_button.querySelector(".accept_button").textContent = `Откроется ${response}`;
    });
});