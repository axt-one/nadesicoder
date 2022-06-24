'use strict';

function nakoTest() {
    const run = document.querySelector('.form-code-submit a.btn.btn-primary');
    if (!run) return;
    const button = createButton('なでしこ実行');
    clickEventListener(run, button);
}

window.addEventListener('load', () => {
    nakoTest();
    const observer = new MutationObserver(nakoTest);
    observer.observe(document.getElementById('vue-custom-test').children[0], {
        childList: true,
        subtree: false
    });
});