/*
 * @Description: eslint
 * @Date: 2020-03-20 14:38:06
 */
module.exports = {
    root: true,
    "parser": '@typescript-eslint/parser',
    "plugins": ['@typescript-eslint'],
    env: {
        node: true,
        es6: true
    },
    extends: ['plugin:@typescript-eslint/recommended'],
    rules: {
        ////////////////
        // 可能的错误 //
        ////////////////
        '@typescript-eslint/no-explicit-any': 0,
        // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
        // always-multiline：多行模式必须带逗号，单行模式不能带逗号
        "comma-dangle": 0,
        // 禁用 debugger
        "no-debugger": 2,
        // 禁止 function 定义中出现重名参数
        "no-dupe-args": 2,
        // 禁止对象字面量中出现重复的 key
        "no-dupe-keys": 2,
        // 禁止重复的 case 标签
        "no-duplicate-case": 2,
        // 禁止空语句块
        "no-empty": 2,
        // 禁止对 catch 子句的参数重新赋值
        "no-ex-assign": 2,
        // 禁止不必要的布尔转换
        "no-extra-boolean-cast": 0,
        // 禁止不必要的括号 //(a * b) + c;//报错
        "no-extra-parens": 0,
        // 禁止不必要的分号
        "no-extra-semi": 2,
        // 禁止对 function 声明重新赋值
        "no-func-assign": 0,
        // 禁止在嵌套的块中出现 function 或 var 声明
        "no-inner-declarations": [2, "functions"],
        // 禁止直接使用 Object.prototypes 的内置属性
        "no-prototype-builtins": 0,
        // 禁用稀疏数组
        "no-sparse-arrays": 2,
        // 禁止出现令人困惑的多行表达式
        "no-unexpected-multiline": 2,
        // 禁止在return、throw、continue 和 break语句之后出现不可达代码
        "no-unreachable": 2,
        // 要求使用 isNaN() 检查 NaN
        "use-isnan": 0,
        // 强制 typeof 表达式与有效的字符串进行比较
        // typeof foo === "undefimed" 错误
        "valid-typeof": 0,
        //////////////
        // 最佳实践 //
        //////////////
        // 定义对象的set存取器属性时，强制定义get
        "accessor-pairs": 2,
        // 强制数组方法的回调函数中有 return 语句
        "array-callback-return": 0,
        // 强制把变量的使用限制在其定义的作用域范围内
        "block-scoped-var": 2,
        // 限制圈复杂度，也就是类似if else能连续接多少个
        // "complexity": [2, 9],
        // 要求 return 语句要么总是指定返回的值，要么不指定
        "consistent-return": 0,
        // 强制所有控制语句使用一致的括号风格
        "curly": [2, "all"],
        // 强制object.key 中 . 的位置，参数:
        // property，'.'号应与属性在同一行
        // object, '.' 号应与对象名在同一行
        "dot-location": [2, "property"],
        // 使用 === 替代 == allow-null允许null和undefined==
        "eqeqeq": [2, "allow-null"],
        // 不允许在 case 子句中使用词法声明
        "no-case-declarations": 2,
        // 禁止出现空函数.如果一个函数包含了一条注释，它将不会被认为有问题。
        "no-empty-function": 2,
        // 禁止在没有类型检查操作符的情况下与 null 进行比较
        "no-eq-null": 1,
        // 禁用 eval()
        "no-eval": 0,
        // 禁用不必要的标签
        "no-extra-label:": 0,
        // 禁止数字字面量中使用前导和末尾小数点
        "no-floating-decimal": 2,
        // 禁止使用短符号进行类型转换(!!fOO)
        "no-implicit-coercion": 0,
        // 禁止在全局范围内使用 var 和命名的 function 声明
        "no-implicit-globals": 1,
        // 禁止使用类似 eval() 的方法
        "no-implied-eval": 1,
        // 禁用 __iterator__ 属性
        "no-iterator": 2,
        // 禁用不必要的嵌套块
        "no-lone-blocks": 1,
        // 禁止在循环中出现 function 声明和表达式
        "no-loop-func": 1,
        // 禁用魔术数字(3.14什么的用常量代替)
        "no-magic-numbers": [
            0,
            {
                "ignore": [0, -1, 1]
            }
        ],
        // 禁止使用多个空格
        "no-multi-spaces": 2,
        // 禁止在非赋值或条件语句中使用 new 操作符
        "no-new": 2,
        // 禁止对 Function 对象使用 new 操作符
        "no-new-func": 0,
        // 禁用八进制字面量
        "no-octal": 2,
        // 禁止在字符串中使用八进制转义序列
        "no-octal-escape": 2,
        // 禁用 __proto__ 属性
        "no-proto": 0,
        // 禁止使用 var 多次声明同一变量
        "no-redeclare": 2,
        // 禁止使用 javascript: url
        "no-script-url": 0,
        // 禁止自我赋值
        "no-self-assign": 2,
        // 禁用逗号操作符
        "no-sequences": 2,
        // 禁用一成不变的循环条件
        "no-unmodified-loop-condition": 2,
        // 禁止不必要的字符串字面量或模板字面量的连接
        "no-useless-concat": 2,
        // 禁用不必要的转义字符
        "no-useless-escape": 0,
        // 禁用 void 操作符
        "no-void": 0,
        // 禁止在注释中使用特定的警告术语
        "no-warning-comments": 0,
        // 禁用 with 语句
        "no-with": 2,
        // 强制在parseInt()使用基数参数
        "radix": 0,
        // 要求所有的 var 声明出现在它们所在的作用域顶部
        "vars-on-top": 0,
        // 要求 IIFE 使用括号括起来
        "wrap-iife": [2, "any"],
        //////////////
        // 变量声明 //
        //////////////
        // 禁止覆盖受限制的标识符
        "no-shadow-restricted-names": 2,
        // 禁止将变量初始化为 undefined
        "no-undef-init": 2,
        // 禁止出现未使用过的变量
        "no-unused-vars": [
            2,
            {
                "vars": "all",
                "args": "none"
            }
        ],
        // 不允许在变量定义之前使用它们
        "no-use-before-define": 0,
        //////////////
        // 风格指南 //
        //////////////
        // 指定数组的元素之间要以空格隔开(, 后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格
        "array-bracket-spacing": [2, "never"],
        // 禁止或强制在单行代码块中使用空格(禁用)
        "block-spacing": [1, "never"],
        //强制使用一致的缩进 第二个参数为 "tab" 时，会使用tab，
        // if while function 后面的{必须与if在同一行，java风格。
        "brace-style": [
            2,
            "1tbs",
            {
                "allowSingleLine": true
            }
        ],
        // 双峰驼命名格式
        "camelcase": 2,
        // 控制逗号前后的空格
        "comma-spacing": [
            2,
            {
                "before": false,
                "after": true
            }
        ],
        // 控制逗号在行尾出现还是在行首出现 (默认行尾)
        "comma-style": [2, "last"],
        //"SwitchCase" (默认：0) 强制 switch 语句中的 case 子句的缩进水平
        // 以方括号取对象属性时，[ 后面和 ] 前面是否需要空格, 可选参数 never, always
        "computed-property-spacing": [2, "never"],
        // 强制使用命名的 function 表达式
        "func-names": 0,
        // 文件末尾强制换行
        "eol-last": 2,
        "indent": [
            2,
            4,
            {
                "SwitchCase": 1
            }
        ],
        // 强制在对象字面量的属性中键和值之间使用一致的间距
        "key-spacing": [
            2,
            {
                "beforeColon": false,
                "afterColon": true
            }
        ],
        // 强制使用一致的换行风格
        // "linebreak-style": [1, "unix"],
        // 要求在注释周围有空行 ( 要求在块级注释之前有一空行)
        "lines-around-comment": [
            1,
            {
                "beforeBlockComment": true
            }
        ],
        // 强制回调函数最大嵌套深度 5层
        "max-nested-callbacks": [1, 5],
        // 强制在关键字前后使用一致的空格 (前后腰需要)
        "keyword-spacing": 2,
        // 强制一行的最大长度
        "max-len": 0,
        // 强制最大行数
        "max-lines": 0,
        // 强制 function 块最多允许的的语句数量
        "max-statements": [1, 200],
        // 要求构造函数首字母大写 （要求调用 new 操作符时有首字母大小的函数，允许调用首字母大写的函数时没有 new 操作符。）
        "new-cap": [
            2,
            {
                "newIsCap": true,
                "capIsNew": false
            }
        ],
        // 要求调用无参构造函数时有圆括号
        "new-parens": 2,
        // 禁止使用 Array 构造函数
        "no-array-constructor": 2,
        // 要求方法链中每个调用都有一个换行符
        "newline-per-chained-call": 0,
        // 不允许空格和 tab 混合缩进
        "no-mixed-spaces-and-tabs": 0,
        // 不允许多个空行
        "no-multiple-empty-lines": [
            2,
            {
                "max": 2
            }
        ],
        // 禁止使用 Object 的构造函数
        "no-new-object": 2,
        // 禁止 function 标识符和括号之间出现空格
        "func-call-spacing": 2,
        // 禁用行尾空格
        "no-trailing-spaces": 0,
        // 禁止可以在有更简单的可替代的表达式时使用三元操作符
        "no-unneeded-ternary": 2,
        // 禁止属性前有空白
        "no-whitespace-before-property": 2,
        // 强制将对象的属性放在不同的行上
        "object-property-newline": 0,
        // 强制函数中的变量要么一起声明要么分开声明
        "one-var": 0,
        // 强制操作符使用一致的换行符
        "operator-linebreak": [
            2,
            "after",
            {
                "overrides": {
                    "?": "before",
                    ":": "before"
                }
            }
        ],
        // 要求或禁止块内填充
        "padded-blocks": 0,
        // 要求对象字面量属性名称用引号括起来
        "quote-props": 0,
        // 强制使用一致的反勾号、双引号或单引号
        "quotes": [2, "single", "avoid-escape"],
        // 要求使用 JSDoc 注释
        "require-jsdoc": [
            0,
            {
                "require": {
                    "FunctionDeclaration": true,
                    "MethodDefinition": true,
                    "ClassDeclaration": false,
                    "ArrowFunctionExpression": true,
                    "FunctionExpression": false
                }
            }
        ],
        // 强制要求注释使用jsdoc类型
        "valid-jsdoc": 0,
        // 要求或禁止使用分号而不是 ASI（这个才是控制行尾部分号的，）
        "semi": 2,
        // 强制分号之前和之后使用一致的空格
        "semi-spacing": 0,
        // 强制在圆括号内使用一致的空格
        "space-in-parens": [2, "never"],
        // 要求操作符周围有空格
        "space-infix-ops": 2,
        // 强制在一元操作符前后使用一致的空格
        "space-unary-ops": [
            2,
            {
                "words": true,
                "nonwords": false
            }
        ],
        // 强制在注释中 // 或 /* 使用一致的空格
        "spaced-comment": [
            2,
            "always",
            {
                "markers": ["global", "globals", "eslint", "eslint-disable", "*package", "!"]
            }
        ],
        //////////////
        // ES6.相关 //
        //////////////
        // 要求箭头函数体使用大括号
        "arrow-body-style": 2,
        // 要求箭头函数的参数使用圆括号
        "arrow-parens": 2,
        "arrow-spacing": [
            2,
            {
                "before": true,
                "after": true
            }
        ],
        // 强制在子类构造函数中用super()调用父类构造函数，TypeScrip的编译器也会提示
        "constructor-super": 0,
        // 强制 generator 函数中 * 号周围使用一致的空格
        "generator-star-spacing": [
            2,
            {
                "before": true,
                "after": true
            }
        ],
        // 禁止修改类声明的变量
        "no-class-assign": 2,
        // 不允许箭头功能，在那里他们可以混淆的比较
        "no-confusing-arrow": 0,
        // 禁止修改 const 声明的变量
        "no-const-assign": 2,
        // 禁止类成员中出现重复的名称
        "no-dupe-class-members": 2,
        // 不允许复制模块的进口
        "no-duplicate-imports": 0,
        // 禁止 Symbol 的构造函数
        "no-new-symbol": 2,
        // 允许指定模块加载时的进口
        "no-restricted-imports": 0,
        // 禁止在构造函数中，在调用 super() 之前使用 this 或 super
        "no-this-before-super": 2,
        // 禁止不必要的计算性能键对象的文字
        "no-useless-computed-key": 0,
        // 要求使用 let 或 const 而不是 var
        "no-var": 0,
        // 要求或禁止对象字面量中方法和属性使用简写语法
        "object-shorthand": 0,
        // 要求使用箭头函数作为回调
        "prefer-arrow-callback": 0,
        // 要求使用 const 声明那些声明后不再被修改的变量
        "prefer-const": 0,
        // 要求在合适的地方使用 Reflect 方法
        "prefer-reflect": 0,
        // 要求使用扩展运算符而非 .apply()
        "prefer-spread": 0,
        // 要求使用模板字面量而非字符串连接
        "prefer-template": 0,
        // Suggest using the rest parameters instead of arguments
        "prefer-rest-params": 0,
        // 要求generator 函数内有 yield
        "require-yield": 0,
        // enforce spacing between rest and spread operators and their expressions
        "rest-spread-spacing": 0,
        // 强制模块内的 import 排序
        "sort-imports": 0,
        // 要求或禁止模板字符串中的嵌入表达式周围空格的使用
        "template-curly-spacing": 1
    },
    globals: { _: true }
};
