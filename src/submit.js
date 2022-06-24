'use strict';

window.addEventListener('load', () => {
    const submit = document.getElementById('submit');
    if (!submit) return;
    const button = createButton('なでしこ提出');
    clickEventListener(submit, button);
});