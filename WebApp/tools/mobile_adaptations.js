export function mobile_focus_for_fields() {
    const body = document.querySelector("body");
    let now_page_position_y = window.scrollY;
    body.addEventListener('touchstart', (event) => {
        if (!event.target.closest('.input_field') && !event.target.closest('.time_input_field')) {
            now_page_position_y = window.scrollY;
            const input_field = document.querySelector(".input_field");
            const date_input_field = document.querySelector(".date_input_field");
            if (input_field) {
                input_field.tabIndex = -1;
            }
            if (date_input_field) {
                date_input_field.tabIndex = -1;
            }
            document.querySelector("body").tabIndex = 1;
            document.querySelector("body").focus();
            window.scrollTo(0, now_page_position_y);
        }
    });
}