import {get_data_from_server, send_page_name_to_server, server_url} from "../../../../tools/networking_tools.js";
import {get_item, transform_date_for_user} from "../../../../tools/auxiliary_tools.js";

send_page_name_to_server("new_habit/step_3/date_confirmation/date_confirmation.html").then(r => {

});

const text_for_user = document.getElementById("text_for_user");

const url = `${server_url}/get_negative_habit/${get_item("active_habit", false)}`;

get_data_from_server(url).then((data_from_server) => {
    let response_status = data_from_server[0];
    data_from_server = data_from_server[1][0];
    text_for_user.innerHTML = `Вы выбрали дату ${transform_date_for_user(data_from_server["starting_date"])}. <strong>После подтверждения её уже нельзя будет изменить.</strong>`;
});

