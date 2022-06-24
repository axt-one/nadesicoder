function objToString(obj) {
    if (obj === null) {
        return 'null';
    }
    switch (typeof obj) {
        case "undefined": return 'undefined';
        case "string": return '`' + obj + '`';
        case "function": return obj.toString();
        case "object":
            var isArray = Array.isArray(obj);
            return ('{['[+isArray] + Object.keys(obj).map(function (key) {
                return (isArray ? '' : '"' + key + '": ') + objToString(obj[key]);
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
