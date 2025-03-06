export function mobile_focus_for_fields() {
    const body = document.querySelector("body");
    let now_page_position_y = window.scrollY;
    body.addEventListener('touchstart', (event) => {
        if (!event.target.closest('.reminder_input_field') && !event.target.closest('.time_input_field')) {
            now_page_position_y = window.scrollY;
            document.querySelector(".reminder_input_field").tabIndex = -1;
            document.querySelector("body").tabIndex = 1;
            document.querySelector("body").focus();
            window.scrollTo(0, now_page_position_y);
        }
    });
}