import {send_data_to_server, send_page_name_to_server} from "../../../../tools/networking_tools.js";

const accept_button = document.querySelector(".accept_button_div");

accept_button.addEventListener("click", (event) => {
    event.preventDefault();
    const url = "http://127.0.0.1:9091/new_negative_habit";
    let data_for_send = {
        "now_state": 1,
        "negative_habit_name": localStorage.getItem("negative_habit_name_page_0"),
        // "tg_user_id": window.Telegram.WebApp.initDataUnsafe.user.id.toString()
        "tg_user_id": "487020656"
    }

    send_data_to_server(url, data_for_send).then(response => {
        localStorage.setItem("active_habit", response["id"]);
        send_page_name_to_server("new_negative_habit/step_0/final_page/final_page.html").then(r => {

        });

        window.location.href = "../../step_1/method_info/method_info.html";
    });
});
