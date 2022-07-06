'use strict';


function objToString(obj) {
    if (obj === null) {
        return 'null';
    }
    switch (typeof obj) {
        case 'undefined': return 'undefined';
        case 'string': return JSON.stringify(obj);
        case 'function': return obj.toString();
        case 'object':
            var isArray = Array.isArray(obj);
            return ('{['[+isArray] + Object.keys(obj).map(function (key) {
                return (isArray ? '' : JSON.stringify(key) + ':') + objToString(obj[key]);
            }).join(',') + '}]'[+isArray]);
        default: return obj.toString();
    }
}

function convertCode(code) {
    // コンパイルされたstandaloneコードをatcoder用に変換する。
    const startTag = '<JS:standalone>';
    const endTag = '</JS:standalone>';
    const start = code.indexOf(startTag) + startTag.length;
    const end = code.indexOf(endTag);
    let coreCode = code.slice(start, end);
    const output = `\
const self = {}
self.coreVersion = '${nako.coreVersion}'
self.version = '${nako.version}'
self.logger = {
  error: (message) => { console.error(message) },
  warn: (message) => { console.warn(message) },
  send: (level, message) => { console.log(message) },
};
self.__varslist = ${objToString(nako.__varslist)}
self.__v0 = self.__varslist[0]
self.initFuncList = []
self.clearFuncList = []
// Copy module functions
for (const funcName of Object.keys(self.__varslist[0])) {
  const fn = self.__varslist[0][funcName];
  if (~funcName.indexOf('初期化')) {
    self.initFuncList.push(fn)
    continue
  }
  if (funcName === '!クリア') {
    self.clearFuncList.push(fn)
    continue
  }
}
self.__vars = self.__varslist[2];
self.__module = {};
self.__locals = {};
self.__genMode = 'sync';

// プラグインの初期化コードを実行
self.initFuncList.map(f => f(self))

${coreCode}
`
    return output;
}

function compile(code) {
    let res = nako.compileStandalone(code, 'main.nako3');
    res = convertCode(res);
    const header = `\
/*
このコードは日本語プログラミング言語「なでしこ」で記述されたソースコードを、
chrome拡張機能「なでしこーだー」(https://axt-one.github.io/nadesicoder/)
でAtCoderに提出可能なJavaScriptの形式に変換したものです。


元のソースコード
-------------------------------------------------------------
${code}
-------------------------------------------------------------
*/


// 変換されたJavaScript

`
    return header + res;
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

let nakoCode = '';
let click = false;

function clickEventListener(runButton, nakoButton) {
    // TODO: エディター切り替えボタンを使わずにcode mirrorから直接コードを取る
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
