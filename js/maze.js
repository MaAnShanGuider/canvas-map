'use strict';

var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Maze = function() {
    function Maze(r, c, id) {
        _classCallCheck(this, Maze);

        this.r = r;
        this.c = c;
        this.accessed = [];
        this.notAccessed = [];
        this.arr = [];

        this.init(id);
    }

    _createClass(Maze, [{
        key: 'init',
        value: function init(id) {
            if (this.r === 0 || this.c === 0) {
                return;
            }
            this.initArray();
            this.initCanvas(id);
            this.generate();
            this.render();
        }
    }, {
        key: 'initArray',
        value: function initArray() {
/**
 * 数组初始化 
 * 
 * 他这里其实就是在判断 n 的二进制有没有进位，
 * 进位了，就说明，n, (n-1)在最大位上都是1，最小位上n为 1,(n-1)为0。
 * 那么他们的差自然为1。满足条件。
 *
 * 也就是说，这里判断的是，n 是否为奇偶数。
 * n 为奇数，那么 n ^ (n-1) === 1, 满足条件;
 * n 为偶数，那么 n ^ (n-1) > 1 不满足条件;
 *
 * 
 * 不过这个notAccessed是什么作用
 * notAccessed的数组的作用是: 
 *     当前所有的通路格子对应的坐标的索引，为0，即表示通路
 *                                      为1，即表示断路
 */
            for (var i = 0; i < 2 * this.r + 1; ++i) {
                this.arr[i] = [];
                for (var n = 0; n < 2 * this.c + 1; ++n) {
                    if ((n ^ n - 1) === 1 && (i ^ i - 1) === 1) {
                        this.arr[i][n] = 0;
                        this.notAccessed.push(0);
                    } else {
                        this.arr[i][n] = 1;
                    }
                }
            }
            this.arr[1][0] = 0;
            this.arr[2 * this.r - 1][2 * this.c] = 0;
        }
    },
/**
 * 数组生成
 * count: 当前通路格子的全部数量，arr[1][0] 和 arr[2 * this.r - 1][2 * this.c]不记在内
 * 随机找到一个当前的通路格子。
 *
 * tr,tc其实是通路的坐标
 * 将所有的通路格子看成一个坐标系，因为刚开始，count = this.r * this.c ,即所有的通路格子，
 * 即r列，c行组成的坐标系，
 * 那么 (count / this.c) 的整除部分，就是第几行， 余数部分，就是第几列。
 * 所以，tr, tc是坐标。
 */
     {
        key: 'generate',
        value: function generate() {
            var count = this.r * this.c;
            var cur = MathUtil.randomInt(0, count);
            var offs = [-this.c, this.c, -1, 1],
                offr = [-1, 1, 0, 0],
                offc = [0, 0, -1, 1];
            this.accessed.push(cur);
            this.notAccessed[cur] = 1;

            console.log('cur:', cur);
            console.log(JSON.parse(JSON.stringify(this.accessed)));
            console.log(JSON.parse(JSON.stringify(this.notAccessed)));

            while (this.accessed.length < count) {
                /**
                 * 每次随机挑选一个通路坐标。
                 * num的取值范围是: 1, 2, 3, 4。刚好是四个方向
                 * @type {[type]}
                 */
                var tr = Math.floor(cur / this.c),
                    tc = cur % this.c;
                var num = 0,
                    off = -1;

                console.log(tr, tc, '坐标');
                while (++num < 5) {
                    var around = MathUtil.randomInt(0, 4),
                        nr = tr + offr[around],
                        nc = tc + offc[around];
                        /**
                         * nr >= 0 && nc >= 0 && nr < this.r && nc < this.c
                         * 表示的是，nr, nc 必须在count的坐标系内。
                         */
                    console.log('num:', num);
                    if (nr >= 0 && nc >= 0 && nr < this.r && nc < this.c && this.notAccessed[cur + offs[around]] === 0) {
                        console.log('走到我这里了', num);
                        off = around;
                        break;
                    }
                }

                if (off < 0) {
                    console.log('不可能小于0');
                    cur = this.accessed[MathUtil.randomInt(0, this.accessed.length)];
                } else {
                    tr = 2 * tr + 1;
                    tc = 2 * tc + 1;
                    this.arr[tr + offr[off]][tc + offc[off]] = 0;
                    cur = cur + offs[off];
                    this.notAccessed[cur] = 1;
                    this.accessed.push(cur);
                }
            }
        }
    }, {
        key: 'initCanvas',
        value: function initCanvas(id) {
            if (typeof id === 'string') {
                this.canvas = document.getElementById(id);
                this.ctx = this.canvas.getContext('2d');
            } else {
                this.createCanvas();
            }
        }
    }, {
        key: 'createCanvas',
        value: function createCanvas() {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');

            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.canvas.width = "1200";
            this.canvas.height = "1200";
            document.body.appendChild(this.canvas);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            this.arr.forEach(function(value, i) {
                value.forEach(function(item, n) {
                    _this.ctx.save();
                    _this.ctx.beginPath();
                    _this.ctx.fillStyle = item === 1 ? 'black' : 'white';
                    _this.ctx.rect(n * 10, i * 10, 10, 10);
                    _this.ctx.fill();
                    _this.ctx.closePath();
                    _this.ctx.restore();
                });
            });
        }
    }]);

    return Maze;
}();