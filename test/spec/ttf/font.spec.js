/**
 * @file font
 * @author mengke01(kekee000@gmail.com)
 */
/* eslint-disable fecs-no-require */
/* globals before */
import assert from 'assert';
import {readData} from '../data';
import Font from 'fonteditor-core/ttf/font';
import main from 'fonteditor-core/main';

describe('测试 Font 对象============================', function () {

    it('test create empty', function () {
        let font = Font.create();
        assert.equal(font.data.version, 1);
        assert.equal(font.data.glyf.length, 1);
    });

    it('test create by object', function () {
        let font = Font.create({
            version: 1,
            glyf: []
        });
        assert.equal(font.data.version, 1);
        assert.equal(font.data.glyf.length, 0);
    });
});

describe('读ttf数据', function () {
    let font = Font.create(readData('baiduHealth.ttf'), {
        type: 'ttf'
    });
    it('test read ttf', function () {
        assert.equal(font.data.version, 1);
        assert.equal(font.data.numTables, 15);
    });
});

describe('转换compound到simple', function () {
    let font = Font.create(readData('baiduHealth.ttf'), {
        type: 'ttf',
        compound2simple: true
    });
    it('test read ttf glyf', function () {
        assert.equal(!!font.data.glyf[16].compound, false);
        assert.equal(!!font.data.glyf[16].glyfs, false);
        assert.equal(font.data.glyf[16].contours.length, 4);
    });
});

describe('读otf数据', function () {
    let font = Font.create(readData('BalladeContour.otf'), {
        type: 'otf'
    });
    it('test read otf', function () {
        assert.equal(font.data.version, 0x1);
        assert.equal(font.data.numTables, 9);
        assert.equal(font.data.rangeShift, 16);
        assert.equal(font.data.searchRenge, 128);
    });
});

describe('读取 woff 数据', function () {
    let buffer = Font.create(readData('baiduHealth.ttf'), {
        type: 'ttf'
    }).write({
        type: 'woff'
    });
    let font = Font.create(buffer, {
        type: 'woff'
    });

    it('test read woff', function () {
        assert.equal(font.data.version, 1);
        assert.equal(font.data.head.magickNumber, 1594834165);
        assert.equal(font.data.head.unitsPerEm, 512);
    });
});

describe('读取 woff2 数据', function () {
    this.timeout(2000);
    before(function (done) {
        main.woff2.init().then(() => done());
    });

    it('test read woff2', function () {
        let buffer = Font.create(readData('baiduHealth.ttf'), {
            type: 'ttf'
        }).write({
            type: 'woff2'
        });
        let font = Font.create(buffer, {
            type: 'woff2'
        });
        assert.equal(font.data.version, 1);
        assert.equal(font.data.head.magickNumber, 1594834165);
        assert.equal(font.data.head.unitsPerEm, 512);
    });
});

describe('读取 eot 数据', function () {
    let buffer = Font.create(readData('baiduHealth.ttf'), {
        type: 'ttf'
    }).write({
        type: 'eot'
    });
    let font = Font.create(buffer, {
        type: 'eot'
    });

    it('test read eot', function () {
        assert.equal(font.data.version, 1);
        assert.equal(font.data.head.magickNumber, 1594834165);
        assert.equal(font.data.head.unitsPerEm, 512);
    });
});

describe('读取 svg 文件', function () {
    let font = Font.create(readData('iconfont-xin.svg'), {
        type: 'svg'
    });
    it('test read svg', function () {
        assert.equal(font.data.from, 'svg');
        assert.equal(font.data.glyf.length, 2);
        assert.equal(font.data.glyf[0].contours.length, 7);
        assert.equal(font.data.glyf[1].contours.length, 1);
    });
});

describe('读取 svg 字体', function () {
    let font = Font.create(readData('icomoon.svg'), {
        type: 'svg'
    });
    it('test read svg font', function () {
        assert.equal(font.data.from, 'svgfont');
        assert.equal(font.data.id, 'icomoon');
        assert.equal(font.data.name.fontFamily, 'icomoon');
        assert.equal(font.data.metadata, 'Generated by IcoMoon');
    });

    it('test svg font glyf', function () {
        assert.equal(font.data.glyf.length, 3);
        assert.equal(font.data.glyf[2].leftSideBearing, 0);
        assert.equal(font.data.glyf[2].advanceWidth, 1024);
        assert.equal(font.data.glyf[2].contours.length, 7);
        assert.equal(font.data.glyf[2].unicode[0], 57345);
    });
});



describe('写ttf数据', function () {

    it('test write ttf', function () {
        let buffer = Font.create(readData('baiduHealth.ttf'), {
            type: 'ttf'
        }).write();
        assert.ok(buffer.byteLength > 1000);
        assert.ok(buffer.byteLength < 10000);

        let font = Font.create(buffer, {
            type: 'ttf'
        });
        assert.equal(font.data.version, 1);
        assert.equal(font.data.head.magickNumber, 1594834165);
        assert.equal(font.data.head.unitsPerEm, 512);
    });

    it('test write ttf hinting', function () {
        let buffer = Font.create(readData('baiduHealth-hinting.ttf'), {
            type: 'ttf',
            hinting: true
        }).write({
            hinting: true
        });
        assert.ok(buffer.byteLength > 1000);
        assert.ok(buffer.byteLength < 10000);

        let font = Font.create(buffer, {
            type: 'ttf',
            hinting: true
        });
        assert.equal(font.data.cvt.length, 24);
        assert.equal(font.data.fpgm.length, 371);
        assert.equal(font.data.prep.length, 204);
        assert.equal(font.data.gasp.length, 8);
    });
});

describe('写eot数据', function () {
    let buffer = Font.create(readData('baiduHealth.ttf'), {
        type: 'ttf'
    }).write({
        type: 'eot'
    });
    it('test eot format', function () {
        assert.ok(buffer.byteLength > 1000);
        assert.ok(buffer.byteLength < 10000);
    });

    it('test read eot', function () {
        let font = Font.create(buffer, {
            type: 'eot'
        });
        assert.equal(font.data.version, 1);
        assert.equal(font.data.head.magickNumber, 1594834165);
        assert.equal(font.data.head.unitsPerEm, 512);
    });
});

describe('写woff数据', function () {
    let buffer = Font.create(readData('baiduHealth.ttf'), {
        type: 'ttf'
    }).write({
        type: 'woff'
    });
    it('test woff format', function () {
        assert.ok(buffer.byteLength > 1000);
        assert.ok(buffer.byteLength < 10000);
    });

    it('test read woff', function () {
        let font = Font.create(buffer, {
            type: 'woff'
        });
        assert.equal(font.data.version, 1);
        assert.equal(font.data.head.magickNumber, 1594834165);
        assert.equal(font.data.head.unitsPerEm, 512);
    });
});

describe('写woff2数据', function () {
    this.timeout(2000);
    before(function (done) {
        main.woff2.init().then(() => done());
    });

    it('test read woff2', function () {
        let buffer = Font.create(readData('baiduHealth.ttf'), {
            type: 'ttf'
        }).write({
            type: 'woff2'
        });
        it('test woff format', function () {
            assert.ok(buffer.byteLength > 1000);
            assert.ok(buffer.byteLength < 10000);
        });

        let font = Font.create(buffer, {
            type: 'woff2'
        });
        assert.equal(font.data.version, 1);
        assert.equal(font.data.head.magickNumber, 1594834165);
        assert.equal(font.data.head.unitsPerEm, 512);
    });
});

describe('写svg数据', function () {
    let font = Font.create(readData('baiduHealth.ttf'), {
        type: 'ttf'
    });
    let svg = font.write({
        type: 'svg'
    });
    it('test svg format', function () {
        assert.ok(svg.length > 1000);
    });
    let symbol = font.write({
        type: 'symbol'
    });
    it('test symbol format', function () {
        assert.ok(symbol.length > 1000);
    });

});

describe('toBase64', function () {
    this.timeout(2000);
    before(function (done) {
        main.woff2.init().then(() => done());
    });

    it('test ttf to toBase64', function () {
        let base64Str = Font.create(readData('baiduHealth.ttf'), {
            type: 'ttf'
        }).toBase64({
            type: 'ttf'
        });
        assert.equal(base64Str.indexOf('data:font/ttf;'), 0);
        assert.ok(base64Str.length > 1000);
        assert.ok(base64Str.length < 10000);
    });

    it('test woff to toBase64', function () {
        let base64Str = Font.create(readData('baiduHealth.ttf'), {
            type: 'ttf'
        }).toBase64({
            type: 'woff'
        });
        assert.equal(base64Str.indexOf('data:font/woff;'), 0);
        assert.ok(base64Str.length > 1000);
        assert.ok(base64Str.length < 10000);
    });

    it('test woff2 to toBase64', function () {
        let base64Str = Font.create(readData('baiduHealth.ttf'), {
            type: 'ttf'
        }).toBase64({
            type: 'woff2'
        });
        assert.equal(base64Str.indexOf('data:font/woff2;'), 0);
        assert.ok(base64Str.length > 1000);
        assert.ok(base64Str.length < 10000);
    });

    it('test eot to toBase64', function () {
        let base64Str = Font.create(readData('baiduHealth.ttf'), {
            type: 'ttf'
        }).toBase64({
            type: 'eot'
        });
        assert.equal(base64Str.indexOf('data:font/eot;'), 0);
        assert.ok(base64Str.length > 1000);
        assert.ok(base64Str.length < 10000);
    });

    it('test svg to toBase64', function () {
        let base64Str = Font.create(readData('baiduHealth.ttf'), {
            type: 'ttf'
        }).toBase64({
            type: 'svg'
        });
        assert.equal(base64Str.indexOf('data:font/svg;'), 0);
        assert.ok(base64Str.length > 1000);
        assert.ok(base64Str.length < 20000);
    });

    it('test svg symbol to toBase64', function () {
        let base64Str = Font.create(readData('baiduHealth.ttf'), {
            type: 'ttf'
        }).toBase64({
            type: 'symbol'
        });
        assert.equal(base64Str.indexOf('data:image/svg+xml;'), 0);
        assert.ok(base64Str.length > 1000);
    });

});

describe('font method', function () {
    it('compound2simple', function () {
        let font = Font.create(readData('baiduHealth.ttf'), {
            type: 'ttf'
        });
        font.compound2simple();
        assert.equal(!!font.data.glyf[16].compound, false);
        assert.equal(!!font.data.glyf[16].glyfs, false);
        assert.equal(font.data.glyf[16].contours.length, 4);
    });

    it('optimize', function () {
        let font = Font.create(readData('baiduHealth.ttf'), {
            type: 'ttf'
        });
        font.compound2simple();
        assert.equal(font.data.glyf.length, 17);
        font.optimize();
        assert.equal(font.data.glyf.length, 15);
    });

    it('sort', function () {
        let font = Font.create(readData('baiduHealth.ttf'), {
            type: 'ttf'
        });
        font.sort();
        assert.equal(font.data.glyf[2].unicode, null);
        font.compound2simple().sort();
        assert.equal(font.data.glyf[2].unicode[0], 0xe003);
    });

    it('find', function () {
        let font = Font.create(readData('baiduHealth.ttf'), {
            type: 'ttf'
        });
        let list = font.find({
            unicode: 0xe003
        });
        assert.equal(list.length, 1);
        assert.equal(list[0].unicode[0], 0xe003);

        list = font.find({
            name: 'uniE00'
        });
        assert.equal(list.length, 4);

        list = font.find({
            filter(glyf) {
                return glyf.name === 'uniE003';
            }
        });
        assert.equal(list.length, 1);
    });

    it('merge', function () {
        let font = Font.create(readData('baiduHealth.ttf'), {
            type: 'ttf'
        });
        let font1 = Font.create(readData('icomoon.svg'), {
            type: 'svg'
        });
        font1.optimize();
        assert.equal(font.data.glyf.length, 17);
        assert.equal(font1.data.glyf.length, 2);
        font.merge(font1);
        assert.equal(font.data.glyf.length, 18);
    });

    it('toBase64', function () {
        let str = Font.toBase64('abcd');
        assert.equal(str, 'YWJjZA==');

        let buffer = new Int8Array([65, 66, 67]);
        str = Font.toBase64(buffer);
        assert.equal(str, 'QUJD');

        str = Font.toBase64(buffer.buffer);
        assert.equal(str, 'QUJD');
    });

});
