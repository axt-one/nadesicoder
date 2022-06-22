'use strict';

async function getNako() {
    let response = await fetch(chrome.runtime.getURL('nako.js'));
    if (response.ok) {
        return await response.text();
    } else {
        console.log('HTTP-Error: ' + response.status);
        return null;
    }
}

function changeLanguage() {
    const select = document.querySelector('div#select-lang select.current');
    for (const option of select.options) {
        if (~option.textContent.indexOf('JavaScript')) {
            option.selected = true;
            option.dispatchEvent(new Event('click'));
        }
    }
}

function createButton(name) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = name;
    button.className = 'btn btn-primary';
    button.style.backgroundColor = '#eebbcb';
    button.style.color = '#a22041';
    button.style.borderColor = '#a22041';
    button.style.marginLeft = '5px';
    return button;
}

function compile(code) {
    let res = nako.compleFromCode(code);
    res = convertCode(res.standalone);
}

function nakoButton() {
    const element = document.getElementById('submit');
    if (!element) return;
    const button = createButton('なでしこ提出');
    element.parentNode.append(button);

    button.onclick = async () => {
        const editorBtn = document.querySelector('.btn-toggle-editor');
        const isPlainText = editorBtn.classList.contains('active');
        const nako = await getNako();
        if (!isPlainText) editorBtn.click();
        const editor = document.querySelector('.plain-textarea');
        let code = editor.value;
        if (!nako || !code) {
            if (!isPlainText) editorBtn.click();
            return
        }
        code = `script = \`${code}\`\n\n${nako}`;
        editor.value = code;
        if (!isPlainText) editorBtn.click();
        changeLanguage();
        element.click();
    };
}

let nakoCode = '';

function nakoTest() {
    const run = document.querySelector('a.btn.btn-primary');
    if (!run) return;
    const button = createButton('なでしこ実行');
    run.parentNode.append(button);

    const editorBtn = document.querySelector('.btn-toggle-editor');
    const isPlainText = editorBtn.classList.contains('active');
    if (!isPlainText) editorBtn.click();
    const editor = document.querySelector('.plain-textarea');
    editor.value = nakoCode;
    if (!isPlainText) editorBtn.click();

    button.onclick = async () => {
        const editorBtn = document.querySelector('.btn-toggle-editor');
        const isPlainText = editorBtn.classList.contains('active');
        const nako = await getNako();
        if (!isPlainText) editorBtn.click();
        const editor = document.querySelector('.plain-textarea');
        let code = editor.value;
        nakoCode = code;
        if (!nako || !code) {
            if (!isPlainText) editorBtn.click();
            return
        }
        code = `script = \`${code}\`\n\n${nako}`;
        editor.value = code;
        if (!isPlainText) editorBtn.click();
        changeLanguage();
        run.click();
    }

}

window.addEventListener('load', () => {
    nakoButton();
    nakoTest();
    const observer = new MutationObserver(nakoTest);
    observer.observe(document.getElementById('vue-custom-test').children[0], {
        childList: true,
        subtree: false
    });
});