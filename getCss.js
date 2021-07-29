function getCss(nodeStr){
    let cssOnion = []
    function isSingle(str,single = [
        'br','hr','img','input','param','meta','link'
    ]){
        for (const i of single) {
           if(str.indexOf(i) !== -1) {
               return true
           }
        }
        return false
    }
    let cou = {},objStr='',head=0
    // 将除了标签外的内容去除防止大于小于符号干扰
    for (let key = 0; key<nodeStr.length;key++) {
        if(nodeStr[key] === '<'){
            cou.start = key
            head = 1
        }
        if(nodeStr[key] === '>'){
            cou.end = key
            head--
            if(head == 0){
                objStr += nodeStr.slice(cou.start,cou.end + 1)
            }else{
                head = 0
            }
        }
    }
    // 从头开始拆分字符
    cssOnion = chai(objStr)
    // 保证最外层是一个标签
    function chai(nodeStr){
        if(nodeStr.length == 0){
            return []
        }
        let res = []
        let cou = {},objStr='',head=0,coou = {},flag = true,className=[]
        for (let key = 0; key<nodeStr.length;key++) {
            if(nodeStr[key] === '<'){
                cou.start = key
                if(flag){
                    let k = key
                    while (k < nodeStr.length - 1) {
                        if(nodeStr[k] == '>') {
                            coou.start = k
                            console.log(k)
                            flag = false
                            break
                        }
                        k++
                    }
                    objStr = nodeStr.slice(cou.start,coou.start)
                    if(objStr.indexOf('class') !== -1){
                        let sCssname = objStr.slice(objStr.indexOf('class="')+'class="'.length,objStr.length)
                        let sCssnames = sCssname.slice(0,sCssname.indexOf('"'))
                        // 如果有多个空格隔开的类名￥￥￥￥，目前就处理一个空格
                        className = sCssnames.split(' ')
                        for (const i in className) {
                            if (Object.hasOwnProperty.call(className, i)) {
                                const element = className[i];
                                className[i] = '.' + element
                            }
                        }
                    }
                }
            }
            if(nodeStr[key] === '>'){
                cou.end = key
                objStr = nodeStr.slice(cou.start,cou.end + 1)
                if(objStr.length > 2 && objStr.indexOf('</') == 0){
                    head--
                    if(head == 0){
                        // 等于0，说明是最开始的双标签的闭标签，此时objStr最外层是一个标签
                        if(!flag){
                            let k = key
                            while (k > 0) {
                                if(nodeStr[k] == '<') {
                                    coou.end = k
                                    flag = true
                                    break
                                }
                                k--
                            }
                        }
                        console.log('1231231232',nodeStr.slice(coou.start + 1,coou.end))
                        res.push({
                            tag:objStr.slice(2,objStr.indexOf('>')),
                            cssName:className,
                            content:chai(nodeStr.slice(coou.start + 1,coou.end))
                        })
                    }
                }else if(objStr.length > 2 && objStr.indexOf('/>') == objStr.length - 2){
                    // 单标签处理
                }else{
                    head++
                }
            }
        }
        return res
    }

    // 形成css结构字符串
    return cssS(cssOnion)
    function cssS(s){
        let ress = ''
        if(s.length == 0){
            return ''
        }
        for (const i of s) {
            ress += (()=>{
                let o = ''
                for (const c of i.cssName) {
                    o += c + ','
                }
                return o.slice(0,o.length - 1)
            })() + '{' + cssS(i.content) + '}'
        }
        return ress 
    }
    
}

module.exports = getCss
