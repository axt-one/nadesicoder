'use strict';


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
    let res = nako.compileStandalone(code, 'main.nako3');
    res = convertCode(res);
    const header = `\
/*
このコードは日本語プログラミング言語「なでしこ」で記述されたソースコードを、
chrome拡張機能「なでしこーだー」でatcoderに提出可能なJavaScriptの形式に
変換したものです。


元のソースコード
-------------------------------------------------------------
${code}
-------------------------------------------------------------
*/


// 変換されたJavaScript

`
    return header + res;
}

function nakoButton() {
    const submit = document.getElementById('submit');
    if (!submit) return;
    const button = createButton('なでしこ提出');
    clickEventListener(submit, button);
}

let nakoCode = '';
let click = false;

function nakoTest() {
    const run = document.querySelector('.form-code-submit a.btn.btn-primary');
    if (!run) return;
    const button = createButton('なでしこ実行');
    clickEventListener(run, button);
}

function clickEventListener(runButton, nakoButton) {
    const editorBtn = document.querySelector('.btn-toggle-editor');
    const isPlainText = editorBtn.classList.contains('active');
    runButton.parentNode.append(nakoButton);

    if (!isPlainText) editorBtn.click();
    const editor = document.querySelector('.plain-textarea');
    if (click) editor.value = nakoCode;
    if (!isPlainText) editorBtn.click();


    nakoButton.onclick = () => {
        click = true;
        if (!isPlainText) editorBtn.click();
        let code = editor.value;
        nakoCode = code;
        if (!code) {
            if (!isPlainText) editorBtn.click();
            return;
        }
        try {
            code = compile(code);
        } catch (error) {
            if (!isPlainText) editorBtn.click();
            window.alert(error);
            return;
        }
        editor.value = code;
        if (!isPlainText) editorBtn.click();
        changeLanguage();
        runButton.click();
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