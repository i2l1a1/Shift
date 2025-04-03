import {mobile_focus_for_fields} from "../../../../tools/mobile_adaptations.js";

const accept_button = document.querySelector(".accept_button_div");
const input_field = document.querySelector(".input_field");


accept_button.addEventListener("click", () => {
    localStorage.setItem("negative_habit_name_page_0", input_field.value);
});

mobile_focus_for_fields()