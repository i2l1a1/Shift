export const black_bg_color = getComputedStyle(document.querySelector('body')).backgroundColor;

export function create_element(element_type, class_name = "", text_content = "", is_hidden = false) {
    let element_variable = document.createElement(element_type);
    if (class_name !== "") {
        element_variable.className = class_name;
    }
    if (text_content !== "") {
        element_variable.textContent = text_content;
    }
    if (is_hidden) {
        element_variable.classList.add("hidden");
    }
    return element_variable;
}

export function create_image(class_name = "", src, alt) {
    let element_variable = document.createElement("img");
    element_variable.className = class_name;
    element_variable.src = src;
    element_variable.alt = alt;
    return element_variable;
}
