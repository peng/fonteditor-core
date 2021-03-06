/**
 * @file eot转ttf
 * @author mengke01(kekee000@gmail.com)
 */

import Reader from './reader';
import Writer from './writer';
import error from './error';

/**
 * eot格式转换成ttf字体格式
 *
 * @param {ArrayBuffer} eotBuffer eot缓冲数组
 * @param {Object} options 选项
 *
 * @return {ArrayBuffer} ttf格式byte流
 */
export default function eot2ttf(eotBuffer, options = {}) {

    // 这里用小尾方式读取
    let eotReader = new Reader(eotBuffer, 0, eotBuffer.byteLength, true);

    // check magic number
    let magicNumber = eotReader.readUint16(34);
    if (magicNumber !== 0x504C) {
        error.raise(10110);
    }

    // check version
    let version = eotReader.readUint32(8);
    if (version !== 0x20001 && version !== 0x10000 && version !== 0x20002) {
        error.raise(10110);
    }

    let eotSize = eotBuffer.byteLength || eotBuffer.length;
    let fontSize = eotReader.readUint32(4);

    let fontOffset = 82;
    let familyNameSize = eotReader.readUint16(fontOffset);
    fontOffset += 4 + familyNameSize;

    let styleNameSize = eotReader.readUint16(fontOffset);
    fontOffset += 4 + styleNameSize;

    let versionNameSize = eotReader.readUint16(fontOffset);
    fontOffset += 4 + versionNameSize;

    let fullNameSize = eotReader.readUint16(fontOffset);
    fontOffset += 2 + fullNameSize;

    // version 0x20001
    if (version === 0x20001 || version === 0x20002) {
        let rootStringSize = eotReader.readUint16(fontOffset + 2);
        fontOffset += 4 + rootStringSize;
    }

    // version 0x20002
    if (version === 0x20002) {
        fontOffset += 10;
        let signatureSize = eotReader.readUint16(fontOffset);
        fontOffset += 2 + signatureSize;
        fontOffset += 4;
        let eudcFontSize = eotReader.readUint32(fontOffset);
        fontOffset += 4 + eudcFontSize;
    }

    if (fontOffset + fontSize > eotSize) {
        error.raise(10001);
    }

    // support slice
    if (eotBuffer.slice) {
        return eotBuffer.slice(fontOffset, fontOffset + fontSize);
    }

    // not support ArrayBuffer.slice eg. IE10
    let bytes = eotReader.readBytes(fontOffset, fontSize);
    return new Writer(new ArrayBuffer(fontSize)).writeBytes(bytes).getBuffer();
}
