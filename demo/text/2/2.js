
//babel库及文件模块导入
const fs = require('fs');

//babel库相关，解析，转换，构建，生产
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const generator = require("@babel/generator").default;
//读取文件
let encode_file = "./encode.js",decode_file = "./decode_result.js";
if (process.argv.length > 2)
{
    encode_file = process.argv[2];
}
if (process.argv.length > 3)
{
    decode_file = process.argv[3];
}

let jscode = fs.readFileSync(encode_file, {encoding: "utf-8"});
//转换为ast树
let ast    = parser.parse(jscode);

const visitor =
    {
        MemberExpression:
            {
                exit({node})
                {
                    const prop = node.property;
                    const _prop = node.object;
                    if (!node.computed && types.isIdentifier(prop))
                    {
                        // console.log(node.property)
                        // console.log(_prop)
                        _prop.name = 'new_name';
                        node.property = types.StringLiteral(prop.name);
                        // console.log('--------------------------------')
                        // console.log(node.property)
                        node.computed = true;
                    }
                }
            },
        ObjectProperty:
            {
                exit({node})
                {
                    const key = node.key;
                    if (!node.computed && types.isIdentifier(key))
                    {
                        key.name = "new_key"
                        node.key = types.StringLiteral(key.name);
                    }
                }
            },
        //TODO  write your code here！
    }


//some function code

//调用插件，处理源代码
traverse(ast,visitor);

//生成新的js code，并保存到文件中输出
let {code} = generator(ast);
fs.writeFile('decode_1.js', code, (err)=>{});