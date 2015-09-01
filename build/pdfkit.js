!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.PDFDocument=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Data;

Data = (function() {
  function Data(data) {
    this.data = data != null ? data : [];
    this.pos = 0;
    this.length = this.data.length;
  }

  Data.prototype.readByte = function() {
    return this.data[this.pos++];
  };

  Data.prototype.writeByte = function(byte) {
    return this.data[this.pos++] = byte;
  };

  Data.prototype.byteAt = function(index) {
    return this.data[index];
  };

  Data.prototype.readBool = function() {
    return !!this.readByte();
  };

  Data.prototype.writeBool = function(val) {
    return this.writeByte(val ? 1 : 0);
  };

  Data.prototype.readUInt32 = function() {
    var b1, b2, b3, b4;
    b1 = this.readByte() * 0x1000000;
    b2 = this.readByte() << 16;
    b3 = this.readByte() << 8;
    b4 = this.readByte();
    return b1 + b2 + b3 + b4;
  };

  Data.prototype.writeUInt32 = function(val) {
    this.writeByte((val >>> 24) & 0xff);
    this.writeByte((val >> 16) & 0xff);
    this.writeByte((val >> 8) & 0xff);
    return this.writeByte(val & 0xff);
  };

  Data.prototype.readInt32 = function() {
    var int;
    int = this.readUInt32();
    if (int >= 0x80000000) {
      return int - 0x100000000;
    } else {
      return int;
    }
  };

  Data.prototype.writeInt32 = function(val) {
    if (val < 0) {
      val += 0x100000000;
    }
    return this.writeUInt32(val);
  };

  Data.prototype.readUInt16 = function() {
    var b1, b2;
    b1 = this.readByte() << 8;
    b2 = this.readByte();
    return b1 | b2;
  };

  Data.prototype.writeUInt16 = function(val) {
    this.writeByte((val >> 8) & 0xff);
    return this.writeByte(val & 0xff);
  };

  Data.prototype.readInt16 = function() {
    var int;
    int = this.readUInt16();
    if (int >= 0x8000) {
      return int - 0x10000;
    } else {
      return int;
    }
  };

  Data.prototype.writeInt16 = function(val) {
    if (val < 0) {
      val += 0x10000;
    }
    return this.writeUInt16(val);
  };

  Data.prototype.readString = function(length) {
    var i, ret, _i;
    ret = [];
    for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
      ret[i] = String.fromCharCode(this.readByte());
    }
    return ret.join('');
  };

  Data.prototype.writeString = function(val) {
    var i, _i, _ref, _results;
    _results = [];
    for (i = _i = 0, _ref = val.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      _results.push(this.writeByte(val.charCodeAt(i)));
    }
    return _results;
  };

  Data.prototype.stringAt = function(pos, length) {
    this.pos = pos;
    return this.readString(length);
  };

  Data.prototype.readShort = function() {
    return this.readInt16();
  };

  Data.prototype.writeShort = function(val) {
    return this.writeInt16(val);
  };

  Data.prototype.readLongLong = function() {
    var b1, b2, b3, b4, b5, b6, b7, b8;
    b1 = this.readByte();
    b2 = this.readByte();
    b3 = this.readByte();
    b4 = this.readByte();
    b5 = this.readByte();
    b6 = this.readByte();
    b7 = this.readByte();
    b8 = this.readByte();
    if (b1 & 0x80) {
      return ((b1 ^ 0xff) * 0x100000000000000 + (b2 ^ 0xff) * 0x1000000000000 + (b3 ^ 0xff) * 0x10000000000 + (b4 ^ 0xff) * 0x100000000 + (b5 ^ 0xff) * 0x1000000 + (b6 ^ 0xff) * 0x10000 + (b7 ^ 0xff) * 0x100 + (b8 ^ 0xff) + 1) * -1;
    }
    return b1 * 0x100000000000000 + b2 * 0x1000000000000 + b3 * 0x10000000000 + b4 * 0x100000000 + b5 * 0x1000000 + b6 * 0x10000 + b7 * 0x100 + b8;
  };

  Data.prototype.writeLongLong = function(val) {
    var high, low;
    high = Math.floor(val / 0x100000000);
    low = val & 0xffffffff;
    this.writeByte((high >> 24) & 0xff);
    this.writeByte((high >> 16) & 0xff);
    this.writeByte((high >> 8) & 0xff);
    this.writeByte(high & 0xff);
    this.writeByte((low >> 24) & 0xff);
    this.writeByte((low >> 16) & 0xff);
    this.writeByte((low >> 8) & 0xff);
    return this.writeByte(low & 0xff);
  };

  Data.prototype.readInt = function() {
    return this.readInt32();
  };

  Data.prototype.writeInt = function(val) {
    return this.writeInt32(val);
  };

  Data.prototype.slice = function(start, end) {
    return this.data.slice(start, end);
  };

  Data.prototype.read = function(bytes) {
    var buf, i, _i;
    buf = [];
    for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
      buf.push(this.readByte());
    }
    return buf;
  };

  Data.prototype.write = function(bytes) {
    var byte, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = bytes.length; _i < _len; _i++) {
      byte = bytes[_i];
      _results.push(this.writeByte(byte));
    }
    return _results;
  };

  return Data;

})();

module.exports = Data;


},{}],2:[function(_dereq_,module,exports){
(function (Buffer){

/*
PDFDocument - represents an entire PDF document
By Devon Govett
 */
var PDFDocument, PDFObject, PDFPage, PDFReference, fs, stream,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

stream = _dereq_('stream');

fs = _dereq_('fs');

PDFObject = _dereq_('./object');

PDFReference = _dereq_('./reference');

PDFPage = _dereq_('./page');

PDFDocument = (function(_super) {
  var mixin;

  __extends(PDFDocument, _super);

  function PDFDocument(options) {
    var key, val, _ref, _ref1;
    this.options = options != null ? options : {};
    PDFDocument.__super__.constructor.apply(this, arguments);
    this.version = 1.3;
    this.compress = (_ref = this.options.compress) != null ? _ref : true;
    this._pageBuffer = [];
    this._pageBufferStart = 0;
    this._offsets = [];
    this._waiting = 0;
    this._ended = false;
    this._offset = 0;
    this._root = this.ref({
      Type: 'Catalog',
      Pages: this.ref({
        Type: 'Pages',
        Count: 0,
        Kids: []
      })
    });
    this.page = null;
    this.initColor();
    this.initVector();
    this.initFonts();
    this.initText();
    this.initImages();
    this.info = {
      Producer: 'PDFKit',
      Creator: 'PDFKit',
      CreationDate: new Date()
    };
    if (this.options.info) {
      _ref1 = this.options.info;
      for (key in _ref1) {
        val = _ref1[key];
        this.info[key] = val;
      }
    }
    this._write("%PDF-" + this.version);
    this._write("%\xFF\xFF\xFF\xFF");
    if (this.options.autoFirstPage !== false) {
      this.addPage();
    }
  }

  mixin = function(methods) {
    var method, name, _results;
    _results = [];
    for (name in methods) {
      method = methods[name];
      _results.push(PDFDocument.prototype[name] = method);
    }
    return _results;
  };

  mixin(_dereq_('./mixins/color'));

  mixin(_dereq_('./mixins/vector'));

  mixin(_dereq_('./mixins/fonts'));

  mixin(_dereq_('./mixins/text'));

  mixin(_dereq_('./mixins/images'));

  mixin(_dereq_('./mixins/annotations'));

  PDFDocument.prototype.addPage = function(options) {
    var pages;
    if (options == null) {
      options = this.options;
    }
    if (!this.options.bufferPages) {
      this.flushPages();
    }
    this.page = new PDFPage(this, options);
    this._pageBuffer.push(this.page);
    pages = this._root.data.Pages.data;
    pages.Kids.push(this.page.dictionary);
    pages.Count++;
    this.x = this.page.margins.left;
    this.y = this.page.margins.top;
    this._ctm = [1, 0, 0, 1, 0, 0];
    this.transform(1, 0, 0, -1, 0, this.page.height);
    return this;
  };

  PDFDocument.prototype.bufferedPageRange = function() {
    return {
      start: this._pageBufferStart,
      count: this._pageBuffer.length
    };
  };

  PDFDocument.prototype.switchToPage = function(n) {
    var page;
    if (!(page = this._pageBuffer[n - this._pageBufferStart])) {
      throw new Error("switchToPage(" + n + ") out of bounds, current buffer covers pages " + this._pageBufferStart + " to " + (this._pageBufferStart + this._pageBuffer.length - 1));
    }
    return this.page = page;
  };

  PDFDocument.prototype.flushPages = function() {
    var page, pages, _i, _len;
    pages = this._pageBuffer;
    this._pageBuffer = [];
    this._pageBufferStart += pages.length;
    for (_i = 0, _len = pages.length; _i < _len; _i++) {
      page = pages[_i];
      page.end();
    }
  };

  PDFDocument.prototype.ref = function(data) {
    var ref;
    ref = new PDFReference(this, this._offsets.length + 1, data);
    this._offsets.push(null);
    this._waiting++;
    return ref;
  };

  PDFDocument.prototype._read = function() {};

  PDFDocument.prototype._write = function(data) {
    if (!Buffer.isBuffer(data)) {
      data = new Buffer(data + '\n', 'binary');
    }
    this.push(data);
    return this._offset += data.length;
  };

  PDFDocument.prototype.addContent = function(data) {
    this.page.write(data);
    return this;
  };

  PDFDocument.prototype._refEnd = function(ref) {
    this._offsets[ref.id - 1] = ref.offset;
    if (--this._waiting === 0 && this._ended) {
      this._finalize();
      return this._ended = false;
    }
  };

  PDFDocument.prototype.write = function(filename, fn) {
    var err;
    err = new Error('PDFDocument#write is deprecated, and will be removed in a future version of PDFKit. Please pipe the document into a Node stream.');
    console.warn(err.stack);
    this.pipe(fs.createWriteStream(filename));
    this.end();
    return this.once('end', fn);
  };

  PDFDocument.prototype.output = function(fn) {
    throw new Error('PDFDocument#output is deprecated, and has been removed from PDFKit. Please pipe the document into a Node stream.');
  };

  PDFDocument.prototype.end = function() {
    var font, key, name, val, _ref, _ref1;
    this.flushPages();
    this._info = this.ref();
    _ref = this.info;
    for (key in _ref) {
      val = _ref[key];
      if (typeof val === 'string') {
        val = new String(val);
      }
      this._info.data[key] = val;
    }
    this._info.end();
    _ref1 = this._fontFamilies;
    for (name in _ref1) {
      font = _ref1[name];
      font.embed();
    }
    this._root.end();
    this._root.data.Pages.end();
    if (this._waiting === 0) {
      return this._finalize();
    } else {
      return this._ended = true;
    }
  };

  PDFDocument.prototype._finalize = function(fn) {
    var offset, xRefOffset, _i, _len, _ref;
    xRefOffset = this._offset;
    this._write("xref");
    this._write("0 " + (this._offsets.length + 1));
    this._write("0000000000 65535 f ");
    _ref = this._offsets;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      offset = _ref[_i];
      offset = ('0000000000' + offset).slice(-10);
      this._write(offset + ' 00000 n ');
    }
    this._write('trailer');
    this._write(PDFObject.convert({
      Size: this._offsets.length + 1,
      Root: this._root,
      Info: this._info
    }));
    this._write('startxref');
    this._write("" + xRefOffset);
    this._write('%%EOF');
    return this.push(null);
  };

  PDFDocument.prototype.toString = function() {
    return "[object PDFDocument]";
  };

  return PDFDocument;

})(stream.Readable);

module.exports = PDFDocument;


}).call(this,_dereq_("buffer").Buffer)
},{"./mixins/annotations":26,"./mixins/color":27,"./mixins/fonts":28,"./mixins/images":29,"./mixins/text":30,"./mixins/vector":31,"./object":32,"./page":33,"./reference":35,"buffer":51,"fs":36,"stream":58}],3:[function(_dereq_,module,exports){
(function (Buffer){

/*
PDFFont - embeds fonts in PDF documents
By Devon Govett
 */
var AFMFont, PDFFont, Subset, TTFFont, fs;

TTFFont = _dereq_('./font/ttf');

AFMFont = _dereq_('./font/afm');

Subset = _dereq_('./font/subset');

fs = _dereq_('fs');

PDFFont = (function() {
  var STANDARD_FONTS, toUnicodeCmap;

  function PDFFont(document, src, family, id) {
    this.document = document;
    this.id = id;
    if (typeof src === 'string') {
      if (src in STANDARD_FONTS) {
        this.isAFM = true;
        this.font = new AFMFont(STANDARD_FONTS[src]());
        this.registerAFM(src);
        return;
      } else if (/\.(ttf|ttc)$/i.test(src)) {
        this.font = TTFFont.open(src, family);
      } else if (/\.dfont$/i.test(src)) {
        this.font = TTFFont.fromDFont(src, family);
      } else {
        throw new Error('Not a supported font format or standard PDF font.');
      }
    } else if (Buffer.isBuffer(src)) {
      this.font = TTFFont.fromBuffer(src, family);
    } else if (src instanceof Uint8Array) {
      this.font = TTFFont.fromBuffer(new Buffer(src), family);
    } else if (src instanceof ArrayBuffer) {
      this.font = TTFFont.fromBuffer(new Buffer(new Uint8Array(src)), family);
    } else {
      throw new Error('Not a supported font format or standard PDF font.');
    }
    this.subset = new Subset(this.font);
    this.registerTTF();
  }

  STANDARD_FONTS = {
    "Helvetica": function() {
      return "StartFontMetrics 4.1\nComment Copyright (c) 1985, 1987, 1989, 1990, 1997 Adobe Systems Incorporated.  All Rights Reserved.\nComment Creation Date: Thu May  1 12:38:23 1997\nComment UniqueID 43054\nComment VMusage 37069 48094\nFontName Helvetica\nFullName Helvetica\nFamilyName Helvetica\nWeight Medium\nItalicAngle 0\nIsFixedPitch false\nCharacterSet ExtendedRoman\nFontBBox -166 -225 1000 931 \nUnderlinePosition -100\nUnderlineThickness 50\nVersion 002.000\nNotice Copyright (c) 1985, 1987, 1989, 1990, 1997 Adobe Systems Incorporated.  All Rights Reserved.Helvetica is a trademark of Linotype-Hell AG and/or its subsidiaries.\nEncodingScheme AdobeStandardEncoding\nCapHeight 718\nXHeight 523\nAscender 718\nDescender -207\nStdHW 76\nStdVW 88\nStartCharMetrics 315\nC 32 ; WX 278 ; N space ; B 0 0 0 0 ;\nC 33 ; WX 278 ; N exclam ; B 90 0 187 718 ;\nC 34 ; WX 355 ; N quotedbl ; B 70 463 285 718 ;\nC 35 ; WX 556 ; N numbersign ; B 28 0 529 688 ;\nC 36 ; WX 556 ; N dollar ; B 32 -115 520 775 ;\nC 37 ; WX 889 ; N percent ; B 39 -19 850 703 ;\nC 38 ; WX 667 ; N ampersand ; B 44 -15 645 718 ;\nC 39 ; WX 222 ; N quoteright ; B 53 463 157 718 ;\nC 40 ; WX 333 ; N parenleft ; B 68 -207 299 733 ;\nC 41 ; WX 333 ; N parenright ; B 34 -207 265 733 ;\nC 42 ; WX 389 ; N asterisk ; B 39 431 349 718 ;\nC 43 ; WX 584 ; N plus ; B 39 0 545 505 ;\nC 44 ; WX 278 ; N comma ; B 87 -147 191 106 ;\nC 45 ; WX 333 ; N hyphen ; B 44 232 289 322 ;\nC 46 ; WX 278 ; N period ; B 87 0 191 106 ;\nC 47 ; WX 278 ; N slash ; B -17 -19 295 737 ;\nC 48 ; WX 556 ; N zero ; B 37 -19 519 703 ;\nC 49 ; WX 556 ; N one ; B 101 0 359 703 ;\nC 50 ; WX 556 ; N two ; B 26 0 507 703 ;\nC 51 ; WX 556 ; N three ; B 34 -19 522 703 ;\nC 52 ; WX 556 ; N four ; B 25 0 523 703 ;\nC 53 ; WX 556 ; N five ; B 32 -19 514 688 ;\nC 54 ; WX 556 ; N six ; B 38 -19 518 703 ;\nC 55 ; WX 556 ; N seven ; B 37 0 523 688 ;\nC 56 ; WX 556 ; N eight ; B 38 -19 517 703 ;\nC 57 ; WX 556 ; N nine ; B 42 -19 514 703 ;\nC 58 ; WX 278 ; N colon ; B 87 0 191 516 ;\nC 59 ; WX 278 ; N semicolon ; B 87 -147 191 516 ;\nC 60 ; WX 584 ; N less ; B 48 11 536 495 ;\nC 61 ; WX 584 ; N equal ; B 39 115 545 390 ;\nC 62 ; WX 584 ; N greater ; B 48 11 536 495 ;\nC 63 ; WX 556 ; N question ; B 56 0 492 727 ;\nC 64 ; WX 1015 ; N at ; B 147 -19 868 737 ;\nC 65 ; WX 667 ; N A ; B 14 0 654 718 ;\nC 66 ; WX 667 ; N B ; B 74 0 627 718 ;\nC 67 ; WX 722 ; N C ; B 44 -19 681 737 ;\nC 68 ; WX 722 ; N D ; B 81 0 674 718 ;\nC 69 ; WX 667 ; N E ; B 86 0 616 718 ;\nC 70 ; WX 611 ; N F ; B 86 0 583 718 ;\nC 71 ; WX 778 ; N G ; B 48 -19 704 737 ;\nC 72 ; WX 722 ; N H ; B 77 0 646 718 ;\nC 73 ; WX 278 ; N I ; B 91 0 188 718 ;\nC 74 ; WX 500 ; N J ; B 17 -19 428 718 ;\nC 75 ; WX 667 ; N K ; B 76 0 663 718 ;\nC 76 ; WX 556 ; N L ; B 76 0 537 718 ;\nC 77 ; WX 833 ; N M ; B 73 0 761 718 ;\nC 78 ; WX 722 ; N N ; B 76 0 646 718 ;\nC 79 ; WX 778 ; N O ; B 39 -19 739 737 ;\nC 80 ; WX 667 ; N P ; B 86 0 622 718 ;\nC 81 ; WX 778 ; N Q ; B 39 -56 739 737 ;\nC 82 ; WX 722 ; N R ; B 88 0 684 718 ;\nC 83 ; WX 667 ; N S ; B 49 -19 620 737 ;\nC 84 ; WX 611 ; N T ; B 14 0 597 718 ;\nC 85 ; WX 722 ; N U ; B 79 -19 644 718 ;\nC 86 ; WX 667 ; N V ; B 20 0 647 718 ;\nC 87 ; WX 944 ; N W ; B 16 0 928 718 ;\nC 88 ; WX 667 ; N X ; B 19 0 648 718 ;\nC 89 ; WX 667 ; N Y ; B 14 0 653 718 ;\nC 90 ; WX 611 ; N Z ; B 23 0 588 718 ;\nC 91 ; WX 278 ; N bracketleft ; B 63 -196 250 722 ;\nC 92 ; WX 278 ; N backslash ; B -17 -19 295 737 ;\nC 93 ; WX 278 ; N bracketright ; B 28 -196 215 722 ;\nC 94 ; WX 469 ; N asciicircum ; B -14 264 483 688 ;\nC 95 ; WX 556 ; N underscore ; B 0 -125 556 -75 ;\nC 96 ; WX 222 ; N quoteleft ; B 65 470 169 725 ;\nC 97 ; WX 556 ; N a ; B 36 -15 530 538 ;\nC 98 ; WX 556 ; N b ; B 58 -15 517 718 ;\nC 99 ; WX 500 ; N c ; B 30 -15 477 538 ;\nC 100 ; WX 556 ; N d ; B 35 -15 499 718 ;\nC 101 ; WX 556 ; N e ; B 40 -15 516 538 ;\nC 102 ; WX 278 ; N f ; B 14 0 262 728 ; L i fi ; L l fl ;\nC 103 ; WX 556 ; N g ; B 40 -220 499 538 ;\nC 104 ; WX 556 ; N h ; B 65 0 491 718 ;\nC 105 ; WX 222 ; N i ; B 67 0 155 718 ;\nC 106 ; WX 222 ; N j ; B -16 -210 155 718 ;\nC 107 ; WX 500 ; N k ; B 67 0 501 718 ;\nC 108 ; WX 222 ; N l ; B 67 0 155 718 ;\nC 109 ; WX 833 ; N m ; B 65 0 769 538 ;\nC 110 ; WX 556 ; N n ; B 65 0 491 538 ;\nC 111 ; WX 556 ; N o ; B 35 -14 521 538 ;\nC 112 ; WX 556 ; N p ; B 58 -207 517 538 ;\nC 113 ; WX 556 ; N q ; B 35 -207 494 538 ;\nC 114 ; WX 333 ; N r ; B 77 0 332 538 ;\nC 115 ; WX 500 ; N s ; B 32 -15 464 538 ;\nC 116 ; WX 278 ; N t ; B 14 -7 257 669 ;\nC 117 ; WX 556 ; N u ; B 68 -15 489 523 ;\nC 118 ; WX 500 ; N v ; B 8 0 492 523 ;\nC 119 ; WX 722 ; N w ; B 14 0 709 523 ;\nC 120 ; WX 500 ; N x ; B 11 0 490 523 ;\nC 121 ; WX 500 ; N y ; B 11 -214 489 523 ;\nC 122 ; WX 500 ; N z ; B 31 0 469 523 ;\nC 123 ; WX 334 ; N braceleft ; B 42 -196 292 722 ;\nC 124 ; WX 260 ; N bar ; B 94 -225 167 775 ;\nC 125 ; WX 334 ; N braceright ; B 42 -196 292 722 ;\nC 126 ; WX 584 ; N asciitilde ; B 61 180 523 326 ;\nC 161 ; WX 333 ; N exclamdown ; B 118 -195 215 523 ;\nC 162 ; WX 556 ; N cent ; B 51 -115 513 623 ;\nC 163 ; WX 556 ; N sterling ; B 33 -16 539 718 ;\nC 164 ; WX 167 ; N fraction ; B -166 -19 333 703 ;\nC 165 ; WX 556 ; N yen ; B 3 0 553 688 ;\nC 166 ; WX 556 ; N florin ; B -11 -207 501 737 ;\nC 167 ; WX 556 ; N section ; B 43 -191 512 737 ;\nC 168 ; WX 556 ; N currency ; B 28 99 528 603 ;\nC 169 ; WX 191 ; N quotesingle ; B 59 463 132 718 ;\nC 170 ; WX 333 ; N quotedblleft ; B 38 470 307 725 ;\nC 171 ; WX 556 ; N guillemotleft ; B 97 108 459 446 ;\nC 172 ; WX 333 ; N guilsinglleft ; B 88 108 245 446 ;\nC 173 ; WX 333 ; N guilsinglright ; B 88 108 245 446 ;\nC 174 ; WX 500 ; N fi ; B 14 0 434 728 ;\nC 175 ; WX 500 ; N fl ; B 14 0 432 728 ;\nC 177 ; WX 556 ; N endash ; B 0 240 556 313 ;\nC 178 ; WX 556 ; N dagger ; B 43 -159 514 718 ;\nC 179 ; WX 556 ; N daggerdbl ; B 43 -159 514 718 ;\nC 180 ; WX 278 ; N periodcentered ; B 77 190 202 315 ;\nC 182 ; WX 537 ; N paragraph ; B 18 -173 497 718 ;\nC 183 ; WX 350 ; N bullet ; B 18 202 333 517 ;\nC 184 ; WX 222 ; N quotesinglbase ; B 53 -149 157 106 ;\nC 185 ; WX 333 ; N quotedblbase ; B 26 -149 295 106 ;\nC 186 ; WX 333 ; N quotedblright ; B 26 463 295 718 ;\nC 187 ; WX 556 ; N guillemotright ; B 97 108 459 446 ;\nC 188 ; WX 1000 ; N ellipsis ; B 115 0 885 106 ;\nC 189 ; WX 1000 ; N perthousand ; B 7 -19 994 703 ;\nC 191 ; WX 611 ; N questiondown ; B 91 -201 527 525 ;\nC 193 ; WX 333 ; N grave ; B 14 593 211 734 ;\nC 194 ; WX 333 ; N acute ; B 122 593 319 734 ;\nC 195 ; WX 333 ; N circumflex ; B 21 593 312 734 ;\nC 196 ; WX 333 ; N tilde ; B -4 606 337 722 ;\nC 197 ; WX 333 ; N macron ; B 10 627 323 684 ;\nC 198 ; WX 333 ; N breve ; B 13 595 321 731 ;\nC 199 ; WX 333 ; N dotaccent ; B 121 604 212 706 ;\nC 200 ; WX 333 ; N dieresis ; B 40 604 293 706 ;\nC 202 ; WX 333 ; N ring ; B 75 572 259 756 ;\nC 203 ; WX 333 ; N cedilla ; B 45 -225 259 0 ;\nC 205 ; WX 333 ; N hungarumlaut ; B 31 593 409 734 ;\nC 206 ; WX 333 ; N ogonek ; B 73 -225 287 0 ;\nC 207 ; WX 333 ; N caron ; B 21 593 312 734 ;\nC 208 ; WX 1000 ; N emdash ; B 0 240 1000 313 ;\nC 225 ; WX 1000 ; N AE ; B 8 0 951 718 ;\nC 227 ; WX 370 ; N ordfeminine ; B 24 405 346 737 ;\nC 232 ; WX 556 ; N Lslash ; B -20 0 537 718 ;\nC 233 ; WX 778 ; N Oslash ; B 39 -19 740 737 ;\nC 234 ; WX 1000 ; N OE ; B 36 -19 965 737 ;\nC 235 ; WX 365 ; N ordmasculine ; B 25 405 341 737 ;\nC 241 ; WX 889 ; N ae ; B 36 -15 847 538 ;\nC 245 ; WX 278 ; N dotlessi ; B 95 0 183 523 ;\nC 248 ; WX 222 ; N lslash ; B -20 0 242 718 ;\nC 249 ; WX 611 ; N oslash ; B 28 -22 537 545 ;\nC 250 ; WX 944 ; N oe ; B 35 -15 902 538 ;\nC 251 ; WX 611 ; N germandbls ; B 67 -15 571 728 ;\nC -1 ; WX 278 ; N Idieresis ; B 13 0 266 901 ;\nC -1 ; WX 556 ; N eacute ; B 40 -15 516 734 ;\nC -1 ; WX 556 ; N abreve ; B 36 -15 530 731 ;\nC -1 ; WX 556 ; N uhungarumlaut ; B 68 -15 521 734 ;\nC -1 ; WX 556 ; N ecaron ; B 40 -15 516 734 ;\nC -1 ; WX 667 ; N Ydieresis ; B 14 0 653 901 ;\nC -1 ; WX 584 ; N divide ; B 39 -19 545 524 ;\nC -1 ; WX 667 ; N Yacute ; B 14 0 653 929 ;\nC -1 ; WX 667 ; N Acircumflex ; B 14 0 654 929 ;\nC -1 ; WX 556 ; N aacute ; B 36 -15 530 734 ;\nC -1 ; WX 722 ; N Ucircumflex ; B 79 -19 644 929 ;\nC -1 ; WX 500 ; N yacute ; B 11 -214 489 734 ;\nC -1 ; WX 500 ; N scommaaccent ; B 32 -225 464 538 ;\nC -1 ; WX 556 ; N ecircumflex ; B 40 -15 516 734 ;\nC -1 ; WX 722 ; N Uring ; B 79 -19 644 931 ;\nC -1 ; WX 722 ; N Udieresis ; B 79 -19 644 901 ;\nC -1 ; WX 556 ; N aogonek ; B 36 -220 547 538 ;\nC -1 ; WX 722 ; N Uacute ; B 79 -19 644 929 ;\nC -1 ; WX 556 ; N uogonek ; B 68 -225 519 523 ;\nC -1 ; WX 667 ; N Edieresis ; B 86 0 616 901 ;\nC -1 ; WX 722 ; N Dcroat ; B 0 0 674 718 ;\nC -1 ; WX 250 ; N commaaccent ; B 87 -225 181 -40 ;\nC -1 ; WX 737 ; N copyright ; B -14 -19 752 737 ;\nC -1 ; WX 667 ; N Emacron ; B 86 0 616 879 ;\nC -1 ; WX 500 ; N ccaron ; B 30 -15 477 734 ;\nC -1 ; WX 556 ; N aring ; B 36 -15 530 756 ;\nC -1 ; WX 722 ; N Ncommaaccent ; B 76 -225 646 718 ;\nC -1 ; WX 222 ; N lacute ; B 67 0 264 929 ;\nC -1 ; WX 556 ; N agrave ; B 36 -15 530 734 ;\nC -1 ; WX 611 ; N Tcommaaccent ; B 14 -225 597 718 ;\nC -1 ; WX 722 ; N Cacute ; B 44 -19 681 929 ;\nC -1 ; WX 556 ; N atilde ; B 36 -15 530 722 ;\nC -1 ; WX 667 ; N Edotaccent ; B 86 0 616 901 ;\nC -1 ; WX 500 ; N scaron ; B 32 -15 464 734 ;\nC -1 ; WX 500 ; N scedilla ; B 32 -225 464 538 ;\nC -1 ; WX 278 ; N iacute ; B 95 0 292 734 ;\nC -1 ; WX 471 ; N lozenge ; B 10 0 462 728 ;\nC -1 ; WX 722 ; N Rcaron ; B 88 0 684 929 ;\nC -1 ; WX 778 ; N Gcommaaccent ; B 48 -225 704 737 ;\nC -1 ; WX 556 ; N ucircumflex ; B 68 -15 489 734 ;\nC -1 ; WX 556 ; N acircumflex ; B 36 -15 530 734 ;\nC -1 ; WX 667 ; N Amacron ; B 14 0 654 879 ;\nC -1 ; WX 333 ; N rcaron ; B 61 0 352 734 ;\nC -1 ; WX 500 ; N ccedilla ; B 30 -225 477 538 ;\nC -1 ; WX 611 ; N Zdotaccent ; B 23 0 588 901 ;\nC -1 ; WX 667 ; N Thorn ; B 86 0 622 718 ;\nC -1 ; WX 778 ; N Omacron ; B 39 -19 739 879 ;\nC -1 ; WX 722 ; N Racute ; B 88 0 684 929 ;\nC -1 ; WX 667 ; N Sacute ; B 49 -19 620 929 ;\nC -1 ; WX 643 ; N dcaron ; B 35 -15 655 718 ;\nC -1 ; WX 722 ; N Umacron ; B 79 -19 644 879 ;\nC -1 ; WX 556 ; N uring ; B 68 -15 489 756 ;\nC -1 ; WX 333 ; N threesuperior ; B 5 270 325 703 ;\nC -1 ; WX 778 ; N Ograve ; B 39 -19 739 929 ;\nC -1 ; WX 667 ; N Agrave ; B 14 0 654 929 ;\nC -1 ; WX 667 ; N Abreve ; B 14 0 654 926 ;\nC -1 ; WX 584 ; N multiply ; B 39 0 545 506 ;\nC -1 ; WX 556 ; N uacute ; B 68 -15 489 734 ;\nC -1 ; WX 611 ; N Tcaron ; B 14 0 597 929 ;\nC -1 ; WX 476 ; N partialdiff ; B 13 -38 463 714 ;\nC -1 ; WX 500 ; N ydieresis ; B 11 -214 489 706 ;\nC -1 ; WX 722 ; N Nacute ; B 76 0 646 929 ;\nC -1 ; WX 278 ; N icircumflex ; B -6 0 285 734 ;\nC -1 ; WX 667 ; N Ecircumflex ; B 86 0 616 929 ;\nC -1 ; WX 556 ; N adieresis ; B 36 -15 530 706 ;\nC -1 ; WX 556 ; N edieresis ; B 40 -15 516 706 ;\nC -1 ; WX 500 ; N cacute ; B 30 -15 477 734 ;\nC -1 ; WX 556 ; N nacute ; B 65 0 491 734 ;\nC -1 ; WX 556 ; N umacron ; B 68 -15 489 684 ;\nC -1 ; WX 722 ; N Ncaron ; B 76 0 646 929 ;\nC -1 ; WX 278 ; N Iacute ; B 91 0 292 929 ;\nC -1 ; WX 584 ; N plusminus ; B 39 0 545 506 ;\nC -1 ; WX 260 ; N brokenbar ; B 94 -150 167 700 ;\nC -1 ; WX 737 ; N registered ; B -14 -19 752 737 ;\nC -1 ; WX 778 ; N Gbreve ; B 48 -19 704 926 ;\nC -1 ; WX 278 ; N Idotaccent ; B 91 0 188 901 ;\nC -1 ; WX 600 ; N summation ; B 15 -10 586 706 ;\nC -1 ; WX 667 ; N Egrave ; B 86 0 616 929 ;\nC -1 ; WX 333 ; N racute ; B 77 0 332 734 ;\nC -1 ; WX 556 ; N omacron ; B 35 -14 521 684 ;\nC -1 ; WX 611 ; N Zacute ; B 23 0 588 929 ;\nC -1 ; WX 611 ; N Zcaron ; B 23 0 588 929 ;\nC -1 ; WX 549 ; N greaterequal ; B 26 0 523 674 ;\nC -1 ; WX 722 ; N Eth ; B 0 0 674 718 ;\nC -1 ; WX 722 ; N Ccedilla ; B 44 -225 681 737 ;\nC -1 ; WX 222 ; N lcommaaccent ; B 67 -225 167 718 ;\nC -1 ; WX 317 ; N tcaron ; B 14 -7 329 808 ;\nC -1 ; WX 556 ; N eogonek ; B 40 -225 516 538 ;\nC -1 ; WX 722 ; N Uogonek ; B 79 -225 644 718 ;\nC -1 ; WX 667 ; N Aacute ; B 14 0 654 929 ;\nC -1 ; WX 667 ; N Adieresis ; B 14 0 654 901 ;\nC -1 ; WX 556 ; N egrave ; B 40 -15 516 734 ;\nC -1 ; WX 500 ; N zacute ; B 31 0 469 734 ;\nC -1 ; WX 222 ; N iogonek ; B -31 -225 183 718 ;\nC -1 ; WX 778 ; N Oacute ; B 39 -19 739 929 ;\nC -1 ; WX 556 ; N oacute ; B 35 -14 521 734 ;\nC -1 ; WX 556 ; N amacron ; B 36 -15 530 684 ;\nC -1 ; WX 500 ; N sacute ; B 32 -15 464 734 ;\nC -1 ; WX 278 ; N idieresis ; B 13 0 266 706 ;\nC -1 ; WX 778 ; N Ocircumflex ; B 39 -19 739 929 ;\nC -1 ; WX 722 ; N Ugrave ; B 79 -19 644 929 ;\nC -1 ; WX 612 ; N Delta ; B 6 0 608 688 ;\nC -1 ; WX 556 ; N thorn ; B 58 -207 517 718 ;\nC -1 ; WX 333 ; N twosuperior ; B 4 281 323 703 ;\nC -1 ; WX 778 ; N Odieresis ; B 39 -19 739 901 ;\nC -1 ; WX 556 ; N mu ; B 68 -207 489 523 ;\nC -1 ; WX 278 ; N igrave ; B -13 0 184 734 ;\nC -1 ; WX 556 ; N ohungarumlaut ; B 35 -14 521 734 ;\nC -1 ; WX 667 ; N Eogonek ; B 86 -220 633 718 ;\nC -1 ; WX 556 ; N dcroat ; B 35 -15 550 718 ;\nC -1 ; WX 834 ; N threequarters ; B 45 -19 810 703 ;\nC -1 ; WX 667 ; N Scedilla ; B 49 -225 620 737 ;\nC -1 ; WX 299 ; N lcaron ; B 67 0 311 718 ;\nC -1 ; WX 667 ; N Kcommaaccent ; B 76 -225 663 718 ;\nC -1 ; WX 556 ; N Lacute ; B 76 0 537 929 ;\nC -1 ; WX 1000 ; N trademark ; B 46 306 903 718 ;\nC -1 ; WX 556 ; N edotaccent ; B 40 -15 516 706 ;\nC -1 ; WX 278 ; N Igrave ; B -13 0 188 929 ;\nC -1 ; WX 278 ; N Imacron ; B -17 0 296 879 ;\nC -1 ; WX 556 ; N Lcaron ; B 76 0 537 718 ;\nC -1 ; WX 834 ; N onehalf ; B 43 -19 773 703 ;\nC -1 ; WX 549 ; N lessequal ; B 26 0 523 674 ;\nC -1 ; WX 556 ; N ocircumflex ; B 35 -14 521 734 ;\nC -1 ; WX 556 ; N ntilde ; B 65 0 491 722 ;\nC -1 ; WX 722 ; N Uhungarumlaut ; B 79 -19 644 929 ;\nC -1 ; WX 667 ; N Eacute ; B 86 0 616 929 ;\nC -1 ; WX 556 ; N emacron ; B 40 -15 516 684 ;\nC -1 ; WX 556 ; N gbreve ; B 40 -220 499 731 ;\nC -1 ; WX 834 ; N onequarter ; B 73 -19 756 703 ;\nC -1 ; WX 667 ; N Scaron ; B 49 -19 620 929 ;\nC -1 ; WX 667 ; N Scommaaccent ; B 49 -225 620 737 ;\nC -1 ; WX 778 ; N Ohungarumlaut ; B 39 -19 739 929 ;\nC -1 ; WX 400 ; N degree ; B 54 411 346 703 ;\nC -1 ; WX 556 ; N ograve ; B 35 -14 521 734 ;\nC -1 ; WX 722 ; N Ccaron ; B 44 -19 681 929 ;\nC -1 ; WX 556 ; N ugrave ; B 68 -15 489 734 ;\nC -1 ; WX 453 ; N radical ; B -4 -80 458 762 ;\nC -1 ; WX 722 ; N Dcaron ; B 81 0 674 929 ;\nC -1 ; WX 333 ; N rcommaaccent ; B 77 -225 332 538 ;\nC -1 ; WX 722 ; N Ntilde ; B 76 0 646 917 ;\nC -1 ; WX 556 ; N otilde ; B 35 -14 521 722 ;\nC -1 ; WX 722 ; N Rcommaaccent ; B 88 -225 684 718 ;\nC -1 ; WX 556 ; N Lcommaaccent ; B 76 -225 537 718 ;\nC -1 ; WX 667 ; N Atilde ; B 14 0 654 917 ;\nC -1 ; WX 667 ; N Aogonek ; B 14 -225 654 718 ;\nC -1 ; WX 667 ; N Aring ; B 14 0 654 931 ;\nC -1 ; WX 778 ; N Otilde ; B 39 -19 739 917 ;\nC -1 ; WX 500 ; N zdotaccent ; B 31 0 469 706 ;\nC -1 ; WX 667 ; N Ecaron ; B 86 0 616 929 ;\nC -1 ; WX 278 ; N Iogonek ; B -3 -225 211 718 ;\nC -1 ; WX 500 ; N kcommaaccent ; B 67 -225 501 718 ;\nC -1 ; WX 584 ; N minus ; B 39 216 545 289 ;\nC -1 ; WX 278 ; N Icircumflex ; B -6 0 285 929 ;\nC -1 ; WX 556 ; N ncaron ; B 65 0 491 734 ;\nC -1 ; WX 278 ; N tcommaaccent ; B 14 -225 257 669 ;\nC -1 ; WX 584 ; N logicalnot ; B 39 108 545 390 ;\nC -1 ; WX 556 ; N odieresis ; B 35 -14 521 706 ;\nC -1 ; WX 556 ; N udieresis ; B 68 -15 489 706 ;\nC -1 ; WX 549 ; N notequal ; B 12 -35 537 551 ;\nC -1 ; WX 556 ; N gcommaaccent ; B 40 -220 499 822 ;\nC -1 ; WX 556 ; N eth ; B 35 -15 522 737 ;\nC -1 ; WX 500 ; N zcaron ; B 31 0 469 734 ;\nC -1 ; WX 556 ; N ncommaaccent ; B 65 -225 491 538 ;\nC -1 ; WX 333 ; N onesuperior ; B 43 281 222 703 ;\nC -1 ; WX 278 ; N imacron ; B 5 0 272 684 ;\nC -1 ; WX 556 ; N Euro ; B 0 0 0 0 ;\nEndCharMetrics\nStartKernData\nStartKernPairs 2705\nKPX A C -30\nKPX A Cacute -30\nKPX A Ccaron -30\nKPX A Ccedilla -30\nKPX A G -30\nKPX A Gbreve -30\nKPX A Gcommaaccent -30\nKPX A O -30\nKPX A Oacute -30\nKPX A Ocircumflex -30\nKPX A Odieresis -30\nKPX A Ograve -30\nKPX A Ohungarumlaut -30\nKPX A Omacron -30\nKPX A Oslash -30\nKPX A Otilde -30\nKPX A Q -30\nKPX A T -120\nKPX A Tcaron -120\nKPX A Tcommaaccent -120\nKPX A U -50\nKPX A Uacute -50\nKPX A Ucircumflex -50\nKPX A Udieresis -50\nKPX A Ugrave -50\nKPX A Uhungarumlaut -50\nKPX A Umacron -50\nKPX A Uogonek -50\nKPX A Uring -50\nKPX A V -70\nKPX A W -50\nKPX A Y -100\nKPX A Yacute -100\nKPX A Ydieresis -100\nKPX A u -30\nKPX A uacute -30\nKPX A ucircumflex -30\nKPX A udieresis -30\nKPX A ugrave -30\nKPX A uhungarumlaut -30\nKPX A umacron -30\nKPX A uogonek -30\nKPX A uring -30\nKPX A v -40\nKPX A w -40\nKPX A y -40\nKPX A yacute -40\nKPX A ydieresis -40\nKPX Aacute C -30\nKPX Aacute Cacute -30\nKPX Aacute Ccaron -30\nKPX Aacute Ccedilla -30\nKPX Aacute G -30\nKPX Aacute Gbreve -30\nKPX Aacute Gcommaaccent -30\nKPX Aacute O -30\nKPX Aacute Oacute -30\nKPX Aacute Ocircumflex -30\nKPX Aacute Odieresis -30\nKPX Aacute Ograve -30\nKPX Aacute Ohungarumlaut -30\nKPX Aacute Omacron -30\nKPX Aacute Oslash -30\nKPX Aacute Otilde -30\nKPX Aacute Q -30\nKPX Aacute T -120\nKPX Aacute Tcaron -120\nKPX Aacute Tcommaaccent -120\nKPX Aacute U -50\nKPX Aacute Uacute -50\nKPX Aacute Ucircumflex -50\nKPX Aacute Udieresis -50\nKPX Aacute Ugrave -50\nKPX Aacute Uhungarumlaut -50\nKPX Aacute Umacron -50\nKPX Aacute Uogonek -50\nKPX Aacute Uring -50\nKPX Aacute V -70\nKPX Aacute W -50\nKPX Aacute Y -100\nKPX Aacute Yacute -100\nKPX Aacute Ydieresis -100\nKPX Aacute u -30\nKPX Aacute uacute -30\nKPX Aacute ucircumflex -30\nKPX Aacute udieresis -30\nKPX Aacute ugrave -30\nKPX Aacute uhungarumlaut -30\nKPX Aacute umacron -30\nKPX Aacute uogonek -30\nKPX Aacute uring -30\nKPX Aacute v -40\nKPX Aacute w -40\nKPX Aacute y -40\nKPX Aacute yacute -40\nKPX Aacute ydieresis -40\nKPX Abreve C -30\nKPX Abreve Cacute -30\nKPX Abreve Ccaron -30\nKPX Abreve Ccedilla -30\nKPX Abreve G -30\nKPX Abreve Gbreve -30\nKPX Abreve Gcommaaccent -30\nKPX Abreve O -30\nKPX Abreve Oacute -30\nKPX Abreve Ocircumflex -30\nKPX Abreve Odieresis -30\nKPX Abreve Ograve -30\nKPX Abreve Ohungarumlaut -30\nKPX Abreve Omacron -30\nKPX Abreve Oslash -30\nKPX Abreve Otilde -30\nKPX Abreve Q -30\nKPX Abreve T -120\nKPX Abreve Tcaron -120\nKPX Abreve Tcommaaccent -120\nKPX Abreve U -50\nKPX Abreve Uacute -50\nKPX Abreve Ucircumflex -50\nKPX Abreve Udieresis -50\nKPX Abreve Ugrave -50\nKPX Abreve Uhungarumlaut -50\nKPX Abreve Umacron -50\nKPX Abreve Uogonek -50\nKPX Abreve Uring -50\nKPX Abreve V -70\nKPX Abreve W -50\nKPX Abreve Y -100\nKPX Abreve Yacute -100\nKPX Abreve Ydieresis -100\nKPX Abreve u -30\nKPX Abreve uacute -30\nKPX Abreve ucircumflex -30\nKPX Abreve udieresis -30\nKPX Abreve ugrave -30\nKPX Abreve uhungarumlaut -30\nKPX Abreve umacron -30\nKPX Abreve uogonek -30\nKPX Abreve uring -30\nKPX Abreve v -40\nKPX Abreve w -40\nKPX Abreve y -40\nKPX Abreve yacute -40\nKPX Abreve ydieresis -40\nKPX Acircumflex C -30\nKPX Acircumflex Cacute -30\nKPX Acircumflex Ccaron -30\nKPX Acircumflex Ccedilla -30\nKPX Acircumflex G -30\nKPX Acircumflex Gbreve -30\nKPX Acircumflex Gcommaaccent -30\nKPX Acircumflex O -30\nKPX Acircumflex Oacute -30\nKPX Acircumflex Ocircumflex -30\nKPX Acircumflex Odieresis -30\nKPX Acircumflex Ograve -30\nKPX Acircumflex Ohungarumlaut -30\nKPX Acircumflex Omacron -30\nKPX Acircumflex Oslash -30\nKPX Acircumflex Otilde -30\nKPX Acircumflex Q -30\nKPX Acircumflex T -120\nKPX Acircumflex Tcaron -120\nKPX Acircumflex Tcommaaccent -120\nKPX Acircumflex U -50\nKPX Acircumflex Uacute -50\nKPX Acircumflex Ucircumflex -50\nKPX Acircumflex Udieresis -50\nKPX Acircumflex Ugrave -50\nKPX Acircumflex Uhungarumlaut -50\nKPX Acircumflex Umacron -50\nKPX Acircumflex Uogonek -50\nKPX Acircumflex Uring -50\nKPX Acircumflex V -70\nKPX Acircumflex W -50\nKPX Acircumflex Y -100\nKPX Acircumflex Yacute -100\nKPX Acircumflex Ydieresis -100\nKPX Acircumflex u -30\nKPX Acircumflex uacute -30\nKPX Acircumflex ucircumflex -30\nKPX Acircumflex udieresis -30\nKPX Acircumflex ugrave -30\nKPX Acircumflex uhungarumlaut -30\nKPX Acircumflex umacron -30\nKPX Acircumflex uogonek -30\nKPX Acircumflex uring -30\nKPX Acircumflex v -40\nKPX Acircumflex w -40\nKPX Acircumflex y -40\nKPX Acircumflex yacute -40\nKPX Acircumflex ydieresis -40\nKPX Adieresis C -30\nKPX Adieresis Cacute -30\nKPX Adieresis Ccaron -30\nKPX Adieresis Ccedilla -30\nKPX Adieresis G -30\nKPX Adieresis Gbreve -30\nKPX Adieresis Gcommaaccent -30\nKPX Adieresis O -30\nKPX Adieresis Oacute -30\nKPX Adieresis Ocircumflex -30\nKPX Adieresis Odieresis -30\nKPX Adieresis Ograve -30\nKPX Adieresis Ohungarumlaut -30\nKPX Adieresis Omacron -30\nKPX Adieresis Oslash -30\nKPX Adieresis Otilde -30\nKPX Adieresis Q -30\nKPX Adieresis T -120\nKPX Adieresis Tcaron -120\nKPX Adieresis Tcommaaccent -120\nKPX Adieresis U -50\nKPX Adieresis Uacute -50\nKPX Adieresis Ucircumflex -50\nKPX Adieresis Udieresis -50\nKPX Adieresis Ugrave -50\nKPX Adieresis Uhungarumlaut -50\nKPX Adieresis Umacron -50\nKPX Adieresis Uogonek -50\nKPX Adieresis Uring -50\nKPX Adieresis V -70\nKPX Adieresis W -50\nKPX Adieresis Y -100\nKPX Adieresis Yacute -100\nKPX Adieresis Ydieresis -100\nKPX Adieresis u -30\nKPX Adieresis uacute -30\nKPX Adieresis ucircumflex -30\nKPX Adieresis udieresis -30\nKPX Adieresis ugrave -30\nKPX Adieresis uhungarumlaut -30\nKPX Adieresis umacron -30\nKPX Adieresis uogonek -30\nKPX Adieresis uring -30\nKPX Adieresis v -40\nKPX Adieresis w -40\nKPX Adieresis y -40\nKPX Adieresis yacute -40\nKPX Adieresis ydieresis -40\nKPX Agrave C -30\nKPX Agrave Cacute -30\nKPX Agrave Ccaron -30\nKPX Agrave Ccedilla -30\nKPX Agrave G -30\nKPX Agrave Gbreve -30\nKPX Agrave Gcommaaccent -30\nKPX Agrave O -30\nKPX Agrave Oacute -30\nKPX Agrave Ocircumflex -30\nKPX Agrave Odieresis -30\nKPX Agrave Ograve -30\nKPX Agrave Ohungarumlaut -30\nKPX Agrave Omacron -30\nKPX Agrave Oslash -30\nKPX Agrave Otilde -30\nKPX Agrave Q -30\nKPX Agrave T -120\nKPX Agrave Tcaron -120\nKPX Agrave Tcommaaccent -120\nKPX Agrave U -50\nKPX Agrave Uacute -50\nKPX Agrave Ucircumflex -50\nKPX Agrave Udieresis -50\nKPX Agrave Ugrave -50\nKPX Agrave Uhungarumlaut -50\nKPX Agrave Umacron -50\nKPX Agrave Uogonek -50\nKPX Agrave Uring -50\nKPX Agrave V -70\nKPX Agrave W -50\nKPX Agrave Y -100\nKPX Agrave Yacute -100\nKPX Agrave Ydieresis -100\nKPX Agrave u -30\nKPX Agrave uacute -30\nKPX Agrave ucircumflex -30\nKPX Agrave udieresis -30\nKPX Agrave ugrave -30\nKPX Agrave uhungarumlaut -30\nKPX Agrave umacron -30\nKPX Agrave uogonek -30\nKPX Agrave uring -30\nKPX Agrave v -40\nKPX Agrave w -40\nKPX Agrave y -40\nKPX Agrave yacute -40\nKPX Agrave ydieresis -40\nKPX Amacron C -30\nKPX Amacron Cacute -30\nKPX Amacron Ccaron -30\nKPX Amacron Ccedilla -30\nKPX Amacron G -30\nKPX Amacron Gbreve -30\nKPX Amacron Gcommaaccent -30\nKPX Amacron O -30\nKPX Amacron Oacute -30\nKPX Amacron Ocircumflex -30\nKPX Amacron Odieresis -30\nKPX Amacron Ograve -30\nKPX Amacron Ohungarumlaut -30\nKPX Amacron Omacron -30\nKPX Amacron Oslash -30\nKPX Amacron Otilde -30\nKPX Amacron Q -30\nKPX Amacron T -120\nKPX Amacron Tcaron -120\nKPX Amacron Tcommaaccent -120\nKPX Amacron U -50\nKPX Amacron Uacute -50\nKPX Amacron Ucircumflex -50\nKPX Amacron Udieresis -50\nKPX Amacron Ugrave -50\nKPX Amacron Uhungarumlaut -50\nKPX Amacron Umacron -50\nKPX Amacron Uogonek -50\nKPX Amacron Uring -50\nKPX Amacron V -70\nKPX Amacron W -50\nKPX Amacron Y -100\nKPX Amacron Yacute -100\nKPX Amacron Ydieresis -100\nKPX Amacron u -30\nKPX Amacron uacute -30\nKPX Amacron ucircumflex -30\nKPX Amacron udieresis -30\nKPX Amacron ugrave -30\nKPX Amacron uhungarumlaut -30\nKPX Amacron umacron -30\nKPX Amacron uogonek -30\nKPX Amacron uring -30\nKPX Amacron v -40\nKPX Amacron w -40\nKPX Amacron y -40\nKPX Amacron yacute -40\nKPX Amacron ydieresis -40\nKPX Aogonek C -30\nKPX Aogonek Cacute -30\nKPX Aogonek Ccaron -30\nKPX Aogonek Ccedilla -30\nKPX Aogonek G -30\nKPX Aogonek Gbreve -30\nKPX Aogonek Gcommaaccent -30\nKPX Aogonek O -30\nKPX Aogonek Oacute -30\nKPX Aogonek Ocircumflex -30\nKPX Aogonek Odieresis -30\nKPX Aogonek Ograve -30\nKPX Aogonek Ohungarumlaut -30\nKPX Aogonek Omacron -30\nKPX Aogonek Oslash -30\nKPX Aogonek Otilde -30\nKPX Aogonek Q -30\nKPX Aogonek T -120\nKPX Aogonek Tcaron -120\nKPX Aogonek Tcommaaccent -120\nKPX Aogonek U -50\nKPX Aogonek Uacute -50\nKPX Aogonek Ucircumflex -50\nKPX Aogonek Udieresis -50\nKPX Aogonek Ugrave -50\nKPX Aogonek Uhungarumlaut -50\nKPX Aogonek Umacron -50\nKPX Aogonek Uogonek -50\nKPX Aogonek Uring -50\nKPX Aogonek V -70\nKPX Aogonek W -50\nKPX Aogonek Y -100\nKPX Aogonek Yacute -100\nKPX Aogonek Ydieresis -100\nKPX Aogonek u -30\nKPX Aogonek uacute -30\nKPX Aogonek ucircumflex -30\nKPX Aogonek udieresis -30\nKPX Aogonek ugrave -30\nKPX Aogonek uhungarumlaut -30\nKPX Aogonek umacron -30\nKPX Aogonek uogonek -30\nKPX Aogonek uring -30\nKPX Aogonek v -40\nKPX Aogonek w -40\nKPX Aogonek y -40\nKPX Aogonek yacute -40\nKPX Aogonek ydieresis -40\nKPX Aring C -30\nKPX Aring Cacute -30\nKPX Aring Ccaron -30\nKPX Aring Ccedilla -30\nKPX Aring G -30\nKPX Aring Gbreve -30\nKPX Aring Gcommaaccent -30\nKPX Aring O -30\nKPX Aring Oacute -30\nKPX Aring Ocircumflex -30\nKPX Aring Odieresis -30\nKPX Aring Ograve -30\nKPX Aring Ohungarumlaut -30\nKPX Aring Omacron -30\nKPX Aring Oslash -30\nKPX Aring Otilde -30\nKPX Aring Q -30\nKPX Aring T -120\nKPX Aring Tcaron -120\nKPX Aring Tcommaaccent -120\nKPX Aring U -50\nKPX Aring Uacute -50\nKPX Aring Ucircumflex -50\nKPX Aring Udieresis -50\nKPX Aring Ugrave -50\nKPX Aring Uhungarumlaut -50\nKPX Aring Umacron -50\nKPX Aring Uogonek -50\nKPX Aring Uring -50\nKPX Aring V -70\nKPX Aring W -50\nKPX Aring Y -100\nKPX Aring Yacute -100\nKPX Aring Ydieresis -100\nKPX Aring u -30\nKPX Aring uacute -30\nKPX Aring ucircumflex -30\nKPX Aring udieresis -30\nKPX Aring ugrave -30\nKPX Aring uhungarumlaut -30\nKPX Aring umacron -30\nKPX Aring uogonek -30\nKPX Aring uring -30\nKPX Aring v -40\nKPX Aring w -40\nKPX Aring y -40\nKPX Aring yacute -40\nKPX Aring ydieresis -40\nKPX Atilde C -30\nKPX Atilde Cacute -30\nKPX Atilde Ccaron -30\nKPX Atilde Ccedilla -30\nKPX Atilde G -30\nKPX Atilde Gbreve -30\nKPX Atilde Gcommaaccent -30\nKPX Atilde O -30\nKPX Atilde Oacute -30\nKPX Atilde Ocircumflex -30\nKPX Atilde Odieresis -30\nKPX Atilde Ograve -30\nKPX Atilde Ohungarumlaut -30\nKPX Atilde Omacron -30\nKPX Atilde Oslash -30\nKPX Atilde Otilde -30\nKPX Atilde Q -30\nKPX Atilde T -120\nKPX Atilde Tcaron -120\nKPX Atilde Tcommaaccent -120\nKPX Atilde U -50\nKPX Atilde Uacute -50\nKPX Atilde Ucircumflex -50\nKPX Atilde Udieresis -50\nKPX Atilde Ugrave -50\nKPX Atilde Uhungarumlaut -50\nKPX Atilde Umacron -50\nKPX Atilde Uogonek -50\nKPX Atilde Uring -50\nKPX Atilde V -70\nKPX Atilde W -50\nKPX Atilde Y -100\nKPX Atilde Yacute -100\nKPX Atilde Ydieresis -100\nKPX Atilde u -30\nKPX Atilde uacute -30\nKPX Atilde ucircumflex -30\nKPX Atilde udieresis -30\nKPX Atilde ugrave -30\nKPX Atilde uhungarumlaut -30\nKPX Atilde umacron -30\nKPX Atilde uogonek -30\nKPX Atilde uring -30\nKPX Atilde v -40\nKPX Atilde w -40\nKPX Atilde y -40\nKPX Atilde yacute -40\nKPX Atilde ydieresis -40\nKPX B U -10\nKPX B Uacute -10\nKPX B Ucircumflex -10\nKPX B Udieresis -10\nKPX B Ugrave -10\nKPX B Uhungarumlaut -10\nKPX B Umacron -10\nKPX B Uogonek -10\nKPX B Uring -10\nKPX B comma -20\nKPX B period -20\nKPX C comma -30\nKPX C period -30\nKPX Cacute comma -30\nKPX Cacute period -30\nKPX Ccaron comma -30\nKPX Ccaron period -30\nKPX Ccedilla comma -30\nKPX Ccedilla period -30\nKPX D A -40\nKPX D Aacute -40\nKPX D Abreve -40\nKPX D Acircumflex -40\nKPX D Adieresis -40\nKPX D Agrave -40\nKPX D Amacron -40\nKPX D Aogonek -40\nKPX D Aring -40\nKPX D Atilde -40\nKPX D V -70\nKPX D W -40\nKPX D Y -90\nKPX D Yacute -90\nKPX D Ydieresis -90\nKPX D comma -70\nKPX D period -70\nKPX Dcaron A -40\nKPX Dcaron Aacute -40\nKPX Dcaron Abreve -40\nKPX Dcaron Acircumflex -40\nKPX Dcaron Adieresis -40\nKPX Dcaron Agrave -40\nKPX Dcaron Amacron -40\nKPX Dcaron Aogonek -40\nKPX Dcaron Aring -40\nKPX Dcaron Atilde -40\nKPX Dcaron V -70\nKPX Dcaron W -40\nKPX Dcaron Y -90\nKPX Dcaron Yacute -90\nKPX Dcaron Ydieresis -90\nKPX Dcaron comma -70\nKPX Dcaron period -70\nKPX Dcroat A -40\nKPX Dcroat Aacute -40\nKPX Dcroat Abreve -40\nKPX Dcroat Acircumflex -40\nKPX Dcroat Adieresis -40\nKPX Dcroat Agrave -40\nKPX Dcroat Amacron -40\nKPX Dcroat Aogonek -40\nKPX Dcroat Aring -40\nKPX Dcroat Atilde -40\nKPX Dcroat V -70\nKPX Dcroat W -40\nKPX Dcroat Y -90\nKPX Dcroat Yacute -90\nKPX Dcroat Ydieresis -90\nKPX Dcroat comma -70\nKPX Dcroat period -70\nKPX F A -80\nKPX F Aacute -80\nKPX F Abreve -80\nKPX F Acircumflex -80\nKPX F Adieresis -80\nKPX F Agrave -80\nKPX F Amacron -80\nKPX F Aogonek -80\nKPX F Aring -80\nKPX F Atilde -80\nKPX F a -50\nKPX F aacute -50\nKPX F abreve -50\nKPX F acircumflex -50\nKPX F adieresis -50\nKPX F agrave -50\nKPX F amacron -50\nKPX F aogonek -50\nKPX F aring -50\nKPX F atilde -50\nKPX F comma -150\nKPX F e -30\nKPX F eacute -30\nKPX F ecaron -30\nKPX F ecircumflex -30\nKPX F edieresis -30\nKPX F edotaccent -30\nKPX F egrave -30\nKPX F emacron -30\nKPX F eogonek -30\nKPX F o -30\nKPX F oacute -30\nKPX F ocircumflex -30\nKPX F odieresis -30\nKPX F ograve -30\nKPX F ohungarumlaut -30\nKPX F omacron -30\nKPX F oslash -30\nKPX F otilde -30\nKPX F period -150\nKPX F r -45\nKPX F racute -45\nKPX F rcaron -45\nKPX F rcommaaccent -45\nKPX J A -20\nKPX J Aacute -20\nKPX J Abreve -20\nKPX J Acircumflex -20\nKPX J Adieresis -20\nKPX J Agrave -20\nKPX J Amacron -20\nKPX J Aogonek -20\nKPX J Aring -20\nKPX J Atilde -20\nKPX J a -20\nKPX J aacute -20\nKPX J abreve -20\nKPX J acircumflex -20\nKPX J adieresis -20\nKPX J agrave -20\nKPX J amacron -20\nKPX J aogonek -20\nKPX J aring -20\nKPX J atilde -20\nKPX J comma -30\nKPX J period -30\nKPX J u -20\nKPX J uacute -20\nKPX J ucircumflex -20\nKPX J udieresis -20\nKPX J ugrave -20\nKPX J uhungarumlaut -20\nKPX J umacron -20\nKPX J uogonek -20\nKPX J uring -20\nKPX K O -50\nKPX K Oacute -50\nKPX K Ocircumflex -50\nKPX K Odieresis -50\nKPX K Ograve -50\nKPX K Ohungarumlaut -50\nKPX K Omacron -50\nKPX K Oslash -50\nKPX K Otilde -50\nKPX K e -40\nKPX K eacute -40\nKPX K ecaron -40\nKPX K ecircumflex -40\nKPX K edieresis -40\nKPX K edotaccent -40\nKPX K egrave -40\nKPX K emacron -40\nKPX K eogonek -40\nKPX K o -40\nKPX K oacute -40\nKPX K ocircumflex -40\nKPX K odieresis -40\nKPX K ograve -40\nKPX K ohungarumlaut -40\nKPX K omacron -40\nKPX K oslash -40\nKPX K otilde -40\nKPX K u -30\nKPX K uacute -30\nKPX K ucircumflex -30\nKPX K udieresis -30\nKPX K ugrave -30\nKPX K uhungarumlaut -30\nKPX K umacron -30\nKPX K uogonek -30\nKPX K uring -30\nKPX K y -50\nKPX K yacute -50\nKPX K ydieresis -50\nKPX Kcommaaccent O -50\nKPX Kcommaaccent Oacute -50\nKPX Kcommaaccent Ocircumflex -50\nKPX Kcommaaccent Odieresis -50\nKPX Kcommaaccent Ograve -50\nKPX Kcommaaccent Ohungarumlaut -50\nKPX Kcommaaccent Omacron -50\nKPX Kcommaaccent Oslash -50\nKPX Kcommaaccent Otilde -50\nKPX Kcommaaccent e -40\nKPX Kcommaaccent eacute -40\nKPX Kcommaaccent ecaron -40\nKPX Kcommaaccent ecircumflex -40\nKPX Kcommaaccent edieresis -40\nKPX Kcommaaccent edotaccent -40\nKPX Kcommaaccent egrave -40\nKPX Kcommaaccent emacron -40\nKPX Kcommaaccent eogonek -40\nKPX Kcommaaccent o -40\nKPX Kcommaaccent oacute -40\nKPX Kcommaaccent ocircumflex -40\nKPX Kcommaaccent odieresis -40\nKPX Kcommaaccent ograve -40\nKPX Kcommaaccent ohungarumlaut -40\nKPX Kcommaaccent omacron -40\nKPX Kcommaaccent oslash -40\nKPX Kcommaaccent otilde -40\nKPX Kcommaaccent u -30\nKPX Kcommaaccent uacute -30\nKPX Kcommaaccent ucircumflex -30\nKPX Kcommaaccent udieresis -30\nKPX Kcommaaccent ugrave -30\nKPX Kcommaaccent uhungarumlaut -30\nKPX Kcommaaccent umacron -30\nKPX Kcommaaccent uogonek -30\nKPX Kcommaaccent uring -30\nKPX Kcommaaccent y -50\nKPX Kcommaaccent yacute -50\nKPX Kcommaaccent ydieresis -50\nKPX L T -110\nKPX L Tcaron -110\nKPX L Tcommaaccent -110\nKPX L V -110\nKPX L W -70\nKPX L Y -140\nKPX L Yacute -140\nKPX L Ydieresis -140\nKPX L quotedblright -140\nKPX L quoteright -160\nKPX L y -30\nKPX L yacute -30\nKPX L ydieresis -30\nKPX Lacute T -110\nKPX Lacute Tcaron -110\nKPX Lacute Tcommaaccent -110\nKPX Lacute V -110\nKPX Lacute W -70\nKPX Lacute Y -140\nKPX Lacute Yacute -140\nKPX Lacute Ydieresis -140\nKPX Lacute quotedblright -140\nKPX Lacute quoteright -160\nKPX Lacute y -30\nKPX Lacute yacute -30\nKPX Lacute ydieresis -30\nKPX Lcaron T -110\nKPX Lcaron Tcaron -110\nKPX Lcaron Tcommaaccent -110\nKPX Lcaron V -110\nKPX Lcaron W -70\nKPX Lcaron Y -140\nKPX Lcaron Yacute -140\nKPX Lcaron Ydieresis -140\nKPX Lcaron quotedblright -140\nKPX Lcaron quoteright -160\nKPX Lcaron y -30\nKPX Lcaron yacute -30\nKPX Lcaron ydieresis -30\nKPX Lcommaaccent T -110\nKPX Lcommaaccent Tcaron -110\nKPX Lcommaaccent Tcommaaccent -110\nKPX Lcommaaccent V -110\nKPX Lcommaaccent W -70\nKPX Lcommaaccent Y -140\nKPX Lcommaaccent Yacute -140\nKPX Lcommaaccent Ydieresis -140\nKPX Lcommaaccent quotedblright -140\nKPX Lcommaaccent quoteright -160\nKPX Lcommaaccent y -30\nKPX Lcommaaccent yacute -30\nKPX Lcommaaccent ydieresis -30\nKPX Lslash T -110\nKPX Lslash Tcaron -110\nKPX Lslash Tcommaaccent -110\nKPX Lslash V -110\nKPX Lslash W -70\nKPX Lslash Y -140\nKPX Lslash Yacute -140\nKPX Lslash Ydieresis -140\nKPX Lslash quotedblright -140\nKPX Lslash quoteright -160\nKPX Lslash y -30\nKPX Lslash yacute -30\nKPX Lslash ydieresis -30\nKPX O A -20\nKPX O Aacute -20\nKPX O Abreve -20\nKPX O Acircumflex -20\nKPX O Adieresis -20\nKPX O Agrave -20\nKPX O Amacron -20\nKPX O Aogonek -20\nKPX O Aring -20\nKPX O Atilde -20\nKPX O T -40\nKPX O Tcaron -40\nKPX O Tcommaaccent -40\nKPX O V -50\nKPX O W -30\nKPX O X -60\nKPX O Y -70\nKPX O Yacute -70\nKPX O Ydieresis -70\nKPX O comma -40\nKPX O period -40\nKPX Oacute A -20\nKPX Oacute Aacute -20\nKPX Oacute Abreve -20\nKPX Oacute Acircumflex -20\nKPX Oacute Adieresis -20\nKPX Oacute Agrave -20\nKPX Oacute Amacron -20\nKPX Oacute Aogonek -20\nKPX Oacute Aring -20\nKPX Oacute Atilde -20\nKPX Oacute T -40\nKPX Oacute Tcaron -40\nKPX Oacute Tcommaaccent -40\nKPX Oacute V -50\nKPX Oacute W -30\nKPX Oacute X -60\nKPX Oacute Y -70\nKPX Oacute Yacute -70\nKPX Oacute Ydieresis -70\nKPX Oacute comma -40\nKPX Oacute period -40\nKPX Ocircumflex A -20\nKPX Ocircumflex Aacute -20\nKPX Ocircumflex Abreve -20\nKPX Ocircumflex Acircumflex -20\nKPX Ocircumflex Adieresis -20\nKPX Ocircumflex Agrave -20\nKPX Ocircumflex Amacron -20\nKPX Ocircumflex Aogonek -20\nKPX Ocircumflex Aring -20\nKPX Ocircumflex Atilde -20\nKPX Ocircumflex T -40\nKPX Ocircumflex Tcaron -40\nKPX Ocircumflex Tcommaaccent -40\nKPX Ocircumflex V -50\nKPX Ocircumflex W -30\nKPX Ocircumflex X -60\nKPX Ocircumflex Y -70\nKPX Ocircumflex Yacute -70\nKPX Ocircumflex Ydieresis -70\nKPX Ocircumflex comma -40\nKPX Ocircumflex period -40\nKPX Odieresis A -20\nKPX Odieresis Aacute -20\nKPX Odieresis Abreve -20\nKPX Odieresis Acircumflex -20\nKPX Odieresis Adieresis -20\nKPX Odieresis Agrave -20\nKPX Odieresis Amacron -20\nKPX Odieresis Aogonek -20\nKPX Odieresis Aring -20\nKPX Odieresis Atilde -20\nKPX Odieresis T -40\nKPX Odieresis Tcaron -40\nKPX Odieresis Tcommaaccent -40\nKPX Odieresis V -50\nKPX Odieresis W -30\nKPX Odieresis X -60\nKPX Odieresis Y -70\nKPX Odieresis Yacute -70\nKPX Odieresis Ydieresis -70\nKPX Odieresis comma -40\nKPX Odieresis period -40\nKPX Ograve A -20\nKPX Ograve Aacute -20\nKPX Ograve Abreve -20\nKPX Ograve Acircumflex -20\nKPX Ograve Adieresis -20\nKPX Ograve Agrave -20\nKPX Ograve Amacron -20\nKPX Ograve Aogonek -20\nKPX Ograve Aring -20\nKPX Ograve Atilde -20\nKPX Ograve T -40\nKPX Ograve Tcaron -40\nKPX Ograve Tcommaaccent -40\nKPX Ograve V -50\nKPX Ograve W -30\nKPX Ograve X -60\nKPX Ograve Y -70\nKPX Ograve Yacute -70\nKPX Ograve Ydieresis -70\nKPX Ograve comma -40\nKPX Ograve period -40\nKPX Ohungarumlaut A -20\nKPX Ohungarumlaut Aacute -20\nKPX Ohungarumlaut Abreve -20\nKPX Ohungarumlaut Acircumflex -20\nKPX Ohungarumlaut Adieresis -20\nKPX Ohungarumlaut Agrave -20\nKPX Ohungarumlaut Amacron -20\nKPX Ohungarumlaut Aogonek -20\nKPX Ohungarumlaut Aring -20\nKPX Ohungarumlaut Atilde -20\nKPX Ohungarumlaut T -40\nKPX Ohungarumlaut Tcaron -40\nKPX Ohungarumlaut Tcommaaccent -40\nKPX Ohungarumlaut V -50\nKPX Ohungarumlaut W -30\nKPX Ohungarumlaut X -60\nKPX Ohungarumlaut Y -70\nKPX Ohungarumlaut Yacute -70\nKPX Ohungarumlaut Ydieresis -70\nKPX Ohungarumlaut comma -40\nKPX Ohungarumlaut period -40\nKPX Omacron A -20\nKPX Omacron Aacute -20\nKPX Omacron Abreve -20\nKPX Omacron Acircumflex -20\nKPX Omacron Adieresis -20\nKPX Omacron Agrave -20\nKPX Omacron Amacron -20\nKPX Omacron Aogonek -20\nKPX Omacron Aring -20\nKPX Omacron Atilde -20\nKPX Omacron T -40\nKPX Omacron Tcaron -40\nKPX Omacron Tcommaaccent -40\nKPX Omacron V -50\nKPX Omacron W -30\nKPX Omacron X -60\nKPX Omacron Y -70\nKPX Omacron Yacute -70\nKPX Omacron Ydieresis -70\nKPX Omacron comma -40\nKPX Omacron period -40\nKPX Oslash A -20\nKPX Oslash Aacute -20\nKPX Oslash Abreve -20\nKPX Oslash Acircumflex -20\nKPX Oslash Adieresis -20\nKPX Oslash Agrave -20\nKPX Oslash Amacron -20\nKPX Oslash Aogonek -20\nKPX Oslash Aring -20\nKPX Oslash Atilde -20\nKPX Oslash T -40\nKPX Oslash Tcaron -40\nKPX Oslash Tcommaaccent -40\nKPX Oslash V -50\nKPX Oslash W -30\nKPX Oslash X -60\nKPX Oslash Y -70\nKPX Oslash Yacute -70\nKPX Oslash Ydieresis -70\nKPX Oslash comma -40\nKPX Oslash period -40\nKPX Otilde A -20\nKPX Otilde Aacute -20\nKPX Otilde Abreve -20\nKPX Otilde Acircumflex -20\nKPX Otilde Adieresis -20\nKPX Otilde Agrave -20\nKPX Otilde Amacron -20\nKPX Otilde Aogonek -20\nKPX Otilde Aring -20\nKPX Otilde Atilde -20\nKPX Otilde T -40\nKPX Otilde Tcaron -40\nKPX Otilde Tcommaaccent -40\nKPX Otilde V -50\nKPX Otilde W -30\nKPX Otilde X -60\nKPX Otilde Y -70\nKPX Otilde Yacute -70\nKPX Otilde Ydieresis -70\nKPX Otilde comma -40\nKPX Otilde period -40\nKPX P A -120\nKPX P Aacute -120\nKPX P Abreve -120\nKPX P Acircumflex -120\nKPX P Adieresis -120\nKPX P Agrave -120\nKPX P Amacron -120\nKPX P Aogonek -120\nKPX P Aring -120\nKPX P Atilde -120\nKPX P a -40\nKPX P aacute -40\nKPX P abreve -40\nKPX P acircumflex -40\nKPX P adieresis -40\nKPX P agrave -40\nKPX P amacron -40\nKPX P aogonek -40\nKPX P aring -40\nKPX P atilde -40\nKPX P comma -180\nKPX P e -50\nKPX P eacute -50\nKPX P ecaron -50\nKPX P ecircumflex -50\nKPX P edieresis -50\nKPX P edotaccent -50\nKPX P egrave -50\nKPX P emacron -50\nKPX P eogonek -50\nKPX P o -50\nKPX P oacute -50\nKPX P ocircumflex -50\nKPX P odieresis -50\nKPX P ograve -50\nKPX P ohungarumlaut -50\nKPX P omacron -50\nKPX P oslash -50\nKPX P otilde -50\nKPX P period -180\nKPX Q U -10\nKPX Q Uacute -10\nKPX Q Ucircumflex -10\nKPX Q Udieresis -10\nKPX Q Ugrave -10\nKPX Q Uhungarumlaut -10\nKPX Q Umacron -10\nKPX Q Uogonek -10\nKPX Q Uring -10\nKPX R O -20\nKPX R Oacute -20\nKPX R Ocircumflex -20\nKPX R Odieresis -20\nKPX R Ograve -20\nKPX R Ohungarumlaut -20\nKPX R Omacron -20\nKPX R Oslash -20\nKPX R Otilde -20\nKPX R T -30\nKPX R Tcaron -30\nKPX R Tcommaaccent -30\nKPX R U -40\nKPX R Uacute -40\nKPX R Ucircumflex -40\nKPX R Udieresis -40\nKPX R Ugrave -40\nKPX R Uhungarumlaut -40\nKPX R Umacron -40\nKPX R Uogonek -40\nKPX R Uring -40\nKPX R V -50\nKPX R W -30\nKPX R Y -50\nKPX R Yacute -50\nKPX R Ydieresis -50\nKPX Racute O -20\nKPX Racute Oacute -20\nKPX Racute Ocircumflex -20\nKPX Racute Odieresis -20\nKPX Racute Ograve -20\nKPX Racute Ohungarumlaut -20\nKPX Racute Omacron -20\nKPX Racute Oslash -20\nKPX Racute Otilde -20\nKPX Racute T -30\nKPX Racute Tcaron -30\nKPX Racute Tcommaaccent -30\nKPX Racute U -40\nKPX Racute Uacute -40\nKPX Racute Ucircumflex -40\nKPX Racute Udieresis -40\nKPX Racute Ugrave -40\nKPX Racute Uhungarumlaut -40\nKPX Racute Umacron -40\nKPX Racute Uogonek -40\nKPX Racute Uring -40\nKPX Racute V -50\nKPX Racute W -30\nKPX Racute Y -50\nKPX Racute Yacute -50\nKPX Racute Ydieresis -50\nKPX Rcaron O -20\nKPX Rcaron Oacute -20\nKPX Rcaron Ocircumflex -20\nKPX Rcaron Odieresis -20\nKPX Rcaron Ograve -20\nKPX Rcaron Ohungarumlaut -20\nKPX Rcaron Omacron -20\nKPX Rcaron Oslash -20\nKPX Rcaron Otilde -20\nKPX Rcaron T -30\nKPX Rcaron Tcaron -30\nKPX Rcaron Tcommaaccent -30\nKPX Rcaron U -40\nKPX Rcaron Uacute -40\nKPX Rcaron Ucircumflex -40\nKPX Rcaron Udieresis -40\nKPX Rcaron Ugrave -40\nKPX Rcaron Uhungarumlaut -40\nKPX Rcaron Umacron -40\nKPX Rcaron Uogonek -40\nKPX Rcaron Uring -40\nKPX Rcaron V -50\nKPX Rcaron W -30\nKPX Rcaron Y -50\nKPX Rcaron Yacute -50\nKPX Rcaron Ydieresis -50\nKPX Rcommaaccent O -20\nKPX Rcommaaccent Oacute -20\nKPX Rcommaaccent Ocircumflex -20\nKPX Rcommaaccent Odieresis -20\nKPX Rcommaaccent Ograve -20\nKPX Rcommaaccent Ohungarumlaut -20\nKPX Rcommaaccent Omacron -20\nKPX Rcommaaccent Oslash -20\nKPX Rcommaaccent Otilde -20\nKPX Rcommaaccent T -30\nKPX Rcommaaccent Tcaron -30\nKPX Rcommaaccent Tcommaaccent -30\nKPX Rcommaaccent U -40\nKPX Rcommaaccent Uacute -40\nKPX Rcommaaccent Ucircumflex -40\nKPX Rcommaaccent Udieresis -40\nKPX Rcommaaccent Ugrave -40\nKPX Rcommaaccent Uhungarumlaut -40\nKPX Rcommaaccent Umacron -40\nKPX Rcommaaccent Uogonek -40\nKPX Rcommaaccent Uring -40\nKPX Rcommaaccent V -50\nKPX Rcommaaccent W -30\nKPX Rcommaaccent Y -50\nKPX Rcommaaccent Yacute -50\nKPX Rcommaaccent Ydieresis -50\nKPX S comma -20\nKPX S period -20\nKPX Sacute comma -20\nKPX Sacute period -20\nKPX Scaron comma -20\nKPX Scaron period -20\nKPX Scedilla comma -20\nKPX Scedilla period -20\nKPX Scommaaccent comma -20\nKPX Scommaaccent period -20\nKPX T A -120\nKPX T Aacute -120\nKPX T Abreve -120\nKPX T Acircumflex -120\nKPX T Adieresis -120\nKPX T Agrave -120\nKPX T Amacron -120\nKPX T Aogonek -120\nKPX T Aring -120\nKPX T Atilde -120\nKPX T O -40\nKPX T Oacute -40\nKPX T Ocircumflex -40\nKPX T Odieresis -40\nKPX T Ograve -40\nKPX T Ohungarumlaut -40\nKPX T Omacron -40\nKPX T Oslash -40\nKPX T Otilde -40\nKPX T a -120\nKPX T aacute -120\nKPX T abreve -60\nKPX T acircumflex -120\nKPX T adieresis -120\nKPX T agrave -120\nKPX T amacron -60\nKPX T aogonek -120\nKPX T aring -120\nKPX T atilde -60\nKPX T colon -20\nKPX T comma -120\nKPX T e -120\nKPX T eacute -120\nKPX T ecaron -120\nKPX T ecircumflex -120\nKPX T edieresis -120\nKPX T edotaccent -120\nKPX T egrave -60\nKPX T emacron -60\nKPX T eogonek -120\nKPX T hyphen -140\nKPX T o -120\nKPX T oacute -120\nKPX T ocircumflex -120\nKPX T odieresis -120\nKPX T ograve -120\nKPX T ohungarumlaut -120\nKPX T omacron -60\nKPX T oslash -120\nKPX T otilde -60\nKPX T period -120\nKPX T r -120\nKPX T racute -120\nKPX T rcaron -120\nKPX T rcommaaccent -120\nKPX T semicolon -20\nKPX T u -120\nKPX T uacute -120\nKPX T ucircumflex -120\nKPX T udieresis -120\nKPX T ugrave -120\nKPX T uhungarumlaut -120\nKPX T umacron -60\nKPX T uogonek -120\nKPX T uring -120\nKPX T w -120\nKPX T y -120\nKPX T yacute -120\nKPX T ydieresis -60\nKPX Tcaron A -120\nKPX Tcaron Aacute -120\nKPX Tcaron Abreve -120\nKPX Tcaron Acircumflex -120\nKPX Tcaron Adieresis -120\nKPX Tcaron Agrave -120\nKPX Tcaron Amacron -120\nKPX Tcaron Aogonek -120\nKPX Tcaron Aring -120\nKPX Tcaron Atilde -120\nKPX Tcaron O -40\nKPX Tcaron Oacute -40\nKPX Tcaron Ocircumflex -40\nKPX Tcaron Odieresis -40\nKPX Tcaron Ograve -40\nKPX Tcaron Ohungarumlaut -40\nKPX Tcaron Omacron -40\nKPX Tcaron Oslash -40\nKPX Tcaron Otilde -40\nKPX Tcaron a -120\nKPX Tcaron aacute -120\nKPX Tcaron abreve -60\nKPX Tcaron acircumflex -120\nKPX Tcaron adieresis -120\nKPX Tcaron agrave -120\nKPX Tcaron amacron -60\nKPX Tcaron aogonek -120\nKPX Tcaron aring -120\nKPX Tcaron atilde -60\nKPX Tcaron colon -20\nKPX Tcaron comma -120\nKPX Tcaron e -120\nKPX Tcaron eacute -120\nKPX Tcaron ecaron -120\nKPX Tcaron ecircumflex -120\nKPX Tcaron edieresis -120\nKPX Tcaron edotaccent -120\nKPX Tcaron egrave -60\nKPX Tcaron emacron -60\nKPX Tcaron eogonek -120\nKPX Tcaron hyphen -140\nKPX Tcaron o -120\nKPX Tcaron oacute -120\nKPX Tcaron ocircumflex -120\nKPX Tcaron odieresis -120\nKPX Tcaron ograve -120\nKPX Tcaron ohungarumlaut -120\nKPX Tcaron omacron -60\nKPX Tcaron oslash -120\nKPX Tcaron otilde -60\nKPX Tcaron period -120\nKPX Tcaron r -120\nKPX Tcaron racute -120\nKPX Tcaron rcaron -120\nKPX Tcaron rcommaaccent -120\nKPX Tcaron semicolon -20\nKPX Tcaron u -120\nKPX Tcaron uacute -120\nKPX Tcaron ucircumflex -120\nKPX Tcaron udieresis -120\nKPX Tcaron ugrave -120\nKPX Tcaron uhungarumlaut -120\nKPX Tcaron umacron -60\nKPX Tcaron uogonek -120\nKPX Tcaron uring -120\nKPX Tcaron w -120\nKPX Tcaron y -120\nKPX Tcaron yacute -120\nKPX Tcaron ydieresis -60\nKPX Tcommaaccent A -120\nKPX Tcommaaccent Aacute -120\nKPX Tcommaaccent Abreve -120\nKPX Tcommaaccent Acircumflex -120\nKPX Tcommaaccent Adieresis -120\nKPX Tcommaaccent Agrave -120\nKPX Tcommaaccent Amacron -120\nKPX Tcommaaccent Aogonek -120\nKPX Tcommaaccent Aring -120\nKPX Tcommaaccent Atilde -120\nKPX Tcommaaccent O -40\nKPX Tcommaaccent Oacute -40\nKPX Tcommaaccent Ocircumflex -40\nKPX Tcommaaccent Odieresis -40\nKPX Tcommaaccent Ograve -40\nKPX Tcommaaccent Ohungarumlaut -40\nKPX Tcommaaccent Omacron -40\nKPX Tcommaaccent Oslash -40\nKPX Tcommaaccent Otilde -40\nKPX Tcommaaccent a -120\nKPX Tcommaaccent aacute -120\nKPX Tcommaaccent abreve -60\nKPX Tcommaaccent acircumflex -120\nKPX Tcommaaccent adieresis -120\nKPX Tcommaaccent agrave -120\nKPX Tcommaaccent amacron -60\nKPX Tcommaaccent aogonek -120\nKPX Tcommaaccent aring -120\nKPX Tcommaaccent atilde -60\nKPX Tcommaaccent colon -20\nKPX Tcommaaccent comma -120\nKPX Tcommaaccent e -120\nKPX Tcommaaccent eacute -120\nKPX Tcommaaccent ecaron -120\nKPX Tcommaaccent ecircumflex -120\nKPX Tcommaaccent edieresis -120\nKPX Tcommaaccent edotaccent -120\nKPX Tcommaaccent egrave -60\nKPX Tcommaaccent emacron -60\nKPX Tcommaaccent eogonek -120\nKPX Tcommaaccent hyphen -140\nKPX Tcommaaccent o -120\nKPX Tcommaaccent oacute -120\nKPX Tcommaaccent ocircumflex -120\nKPX Tcommaaccent odieresis -120\nKPX Tcommaaccent ograve -120\nKPX Tcommaaccent ohungarumlaut -120\nKPX Tcommaaccent omacron -60\nKPX Tcommaaccent oslash -120\nKPX Tcommaaccent otilde -60\nKPX Tcommaaccent period -120\nKPX Tcommaaccent r -120\nKPX Tcommaaccent racute -120\nKPX Tcommaaccent rcaron -120\nKPX Tcommaaccent rcommaaccent -120\nKPX Tcommaaccent semicolon -20\nKPX Tcommaaccent u -120\nKPX Tcommaaccent uacute -120\nKPX Tcommaaccent ucircumflex -120\nKPX Tcommaaccent udieresis -120\nKPX Tcommaaccent ugrave -120\nKPX Tcommaaccent uhungarumlaut -120\nKPX Tcommaaccent umacron -60\nKPX Tcommaaccent uogonek -120\nKPX Tcommaaccent uring -120\nKPX Tcommaaccent w -120\nKPX Tcommaaccent y -120\nKPX Tcommaaccent yacute -120\nKPX Tcommaaccent ydieresis -60\nKPX U A -40\nKPX U Aacute -40\nKPX U Abreve -40\nKPX U Acircumflex -40\nKPX U Adieresis -40\nKPX U Agrave -40\nKPX U Amacron -40\nKPX U Aogonek -40\nKPX U Aring -40\nKPX U Atilde -40\nKPX U comma -40\nKPX U period -40\nKPX Uacute A -40\nKPX Uacute Aacute -40\nKPX Uacute Abreve -40\nKPX Uacute Acircumflex -40\nKPX Uacute Adieresis -40\nKPX Uacute Agrave -40\nKPX Uacute Amacron -40\nKPX Uacute Aogonek -40\nKPX Uacute Aring -40\nKPX Uacute Atilde -40\nKPX Uacute comma -40\nKPX Uacute period -40\nKPX Ucircumflex A -40\nKPX Ucircumflex Aacute -40\nKPX Ucircumflex Abreve -40\nKPX Ucircumflex Acircumflex -40\nKPX Ucircumflex Adieresis -40\nKPX Ucircumflex Agrave -40\nKPX Ucircumflex Amacron -40\nKPX Ucircumflex Aogonek -40\nKPX Ucircumflex Aring -40\nKPX Ucircumflex Atilde -40\nKPX Ucircumflex comma -40\nKPX Ucircumflex period -40\nKPX Udieresis A -40\nKPX Udieresis Aacute -40\nKPX Udieresis Abreve -40\nKPX Udieresis Acircumflex -40\nKPX Udieresis Adieresis -40\nKPX Udieresis Agrave -40\nKPX Udieresis Amacron -40\nKPX Udieresis Aogonek -40\nKPX Udieresis Aring -40\nKPX Udieresis Atilde -40\nKPX Udieresis comma -40\nKPX Udieresis period -40\nKPX Ugrave A -40\nKPX Ugrave Aacute -40\nKPX Ugrave Abreve -40\nKPX Ugrave Acircumflex -40\nKPX Ugrave Adieresis -40\nKPX Ugrave Agrave -40\nKPX Ugrave Amacron -40\nKPX Ugrave Aogonek -40\nKPX Ugrave Aring -40\nKPX Ugrave Atilde -40\nKPX Ugrave comma -40\nKPX Ugrave period -40\nKPX Uhungarumlaut A -40\nKPX Uhungarumlaut Aacute -40\nKPX Uhungarumlaut Abreve -40\nKPX Uhungarumlaut Acircumflex -40\nKPX Uhungarumlaut Adieresis -40\nKPX Uhungarumlaut Agrave -40\nKPX Uhungarumlaut Amacron -40\nKPX Uhungarumlaut Aogonek -40\nKPX Uhungarumlaut Aring -40\nKPX Uhungarumlaut Atilde -40\nKPX Uhungarumlaut comma -40\nKPX Uhungarumlaut period -40\nKPX Umacron A -40\nKPX Umacron Aacute -40\nKPX Umacron Abreve -40\nKPX Umacron Acircumflex -40\nKPX Umacron Adieresis -40\nKPX Umacron Agrave -40\nKPX Umacron Amacron -40\nKPX Umacron Aogonek -40\nKPX Umacron Aring -40\nKPX Umacron Atilde -40\nKPX Umacron comma -40\nKPX Umacron period -40\nKPX Uogonek A -40\nKPX Uogonek Aacute -40\nKPX Uogonek Abreve -40\nKPX Uogonek Acircumflex -40\nKPX Uogonek Adieresis -40\nKPX Uogonek Agrave -40\nKPX Uogonek Amacron -40\nKPX Uogonek Aogonek -40\nKPX Uogonek Aring -40\nKPX Uogonek Atilde -40\nKPX Uogonek comma -40\nKPX Uogonek period -40\nKPX Uring A -40\nKPX Uring Aacute -40\nKPX Uring Abreve -40\nKPX Uring Acircumflex -40\nKPX Uring Adieresis -40\nKPX Uring Agrave -40\nKPX Uring Amacron -40\nKPX Uring Aogonek -40\nKPX Uring Aring -40\nKPX Uring Atilde -40\nKPX Uring comma -40\nKPX Uring period -40\nKPX V A -80\nKPX V Aacute -80\nKPX V Abreve -80\nKPX V Acircumflex -80\nKPX V Adieresis -80\nKPX V Agrave -80\nKPX V Amacron -80\nKPX V Aogonek -80\nKPX V Aring -80\nKPX V Atilde -80\nKPX V G -40\nKPX V Gbreve -40\nKPX V Gcommaaccent -40\nKPX V O -40\nKPX V Oacute -40\nKPX V Ocircumflex -40\nKPX V Odieresis -40\nKPX V Ograve -40\nKPX V Ohungarumlaut -40\nKPX V Omacron -40\nKPX V Oslash -40\nKPX V Otilde -40\nKPX V a -70\nKPX V aacute -70\nKPX V abreve -70\nKPX V acircumflex -70\nKPX V adieresis -70\nKPX V agrave -70\nKPX V amacron -70\nKPX V aogonek -70\nKPX V aring -70\nKPX V atilde -70\nKPX V colon -40\nKPX V comma -125\nKPX V e -80\nKPX V eacute -80\nKPX V ecaron -80\nKPX V ecircumflex -80\nKPX V edieresis -80\nKPX V edotaccent -80\nKPX V egrave -80\nKPX V emacron -80\nKPX V eogonek -80\nKPX V hyphen -80\nKPX V o -80\nKPX V oacute -80\nKPX V ocircumflex -80\nKPX V odieresis -80\nKPX V ograve -80\nKPX V ohungarumlaut -80\nKPX V omacron -80\nKPX V oslash -80\nKPX V otilde -80\nKPX V period -125\nKPX V semicolon -40\nKPX V u -70\nKPX V uacute -70\nKPX V ucircumflex -70\nKPX V udieresis -70\nKPX V ugrave -70\nKPX V uhungarumlaut -70\nKPX V umacron -70\nKPX V uogonek -70\nKPX V uring -70\nKPX W A -50\nKPX W Aacute -50\nKPX W Abreve -50\nKPX W Acircumflex -50\nKPX W Adieresis -50\nKPX W Agrave -50\nKPX W Amacron -50\nKPX W Aogonek -50\nKPX W Aring -50\nKPX W Atilde -50\nKPX W O -20\nKPX W Oacute -20\nKPX W Ocircumflex -20\nKPX W Odieresis -20\nKPX W Ograve -20\nKPX W Ohungarumlaut -20\nKPX W Omacron -20\nKPX W Oslash -20\nKPX W Otilde -20\nKPX W a -40\nKPX W aacute -40\nKPX W abreve -40\nKPX W acircumflex -40\nKPX W adieresis -40\nKPX W agrave -40\nKPX W amacron -40\nKPX W aogonek -40\nKPX W aring -40\nKPX W atilde -40\nKPX W comma -80\nKPX W e -30\nKPX W eacute -30\nKPX W ecaron -30\nKPX W ecircumflex -30\nKPX W edieresis -30\nKPX W edotaccent -30\nKPX W egrave -30\nKPX W emacron -30\nKPX W eogonek -30\nKPX W hyphen -40\nKPX W o -30\nKPX W oacute -30\nKPX W ocircumflex -30\nKPX W odieresis -30\nKPX W ograve -30\nKPX W ohungarumlaut -30\nKPX W omacron -30\nKPX W oslash -30\nKPX W otilde -30\nKPX W period -80\nKPX W u -30\nKPX W uacute -30\nKPX W ucircumflex -30\nKPX W udieresis -30\nKPX W ugrave -30\nKPX W uhungarumlaut -30\nKPX W umacron -30\nKPX W uogonek -30\nKPX W uring -30\nKPX W y -20\nKPX W yacute -20\nKPX W ydieresis -20\nKPX Y A -110\nKPX Y Aacute -110\nKPX Y Abreve -110\nKPX Y Acircumflex -110\nKPX Y Adieresis -110\nKPX Y Agrave -110\nKPX Y Amacron -110\nKPX Y Aogonek -110\nKPX Y Aring -110\nKPX Y Atilde -110\nKPX Y O -85\nKPX Y Oacute -85\nKPX Y Ocircumflex -85\nKPX Y Odieresis -85\nKPX Y Ograve -85\nKPX Y Ohungarumlaut -85\nKPX Y Omacron -85\nKPX Y Oslash -85\nKPX Y Otilde -85\nKPX Y a -140\nKPX Y aacute -140\nKPX Y abreve -70\nKPX Y acircumflex -140\nKPX Y adieresis -140\nKPX Y agrave -140\nKPX Y amacron -70\nKPX Y aogonek -140\nKPX Y aring -140\nKPX Y atilde -140\nKPX Y colon -60\nKPX Y comma -140\nKPX Y e -140\nKPX Y eacute -140\nKPX Y ecaron -140\nKPX Y ecircumflex -140\nKPX Y edieresis -140\nKPX Y edotaccent -140\nKPX Y egrave -140\nKPX Y emacron -70\nKPX Y eogonek -140\nKPX Y hyphen -140\nKPX Y i -20\nKPX Y iacute -20\nKPX Y iogonek -20\nKPX Y o -140\nKPX Y oacute -140\nKPX Y ocircumflex -140\nKPX Y odieresis -140\nKPX Y ograve -140\nKPX Y ohungarumlaut -140\nKPX Y omacron -140\nKPX Y oslash -140\nKPX Y otilde -140\nKPX Y period -140\nKPX Y semicolon -60\nKPX Y u -110\nKPX Y uacute -110\nKPX Y ucircumflex -110\nKPX Y udieresis -110\nKPX Y ugrave -110\nKPX Y uhungarumlaut -110\nKPX Y umacron -110\nKPX Y uogonek -110\nKPX Y uring -110\nKPX Yacute A -110\nKPX Yacute Aacute -110\nKPX Yacute Abreve -110\nKPX Yacute Acircumflex -110\nKPX Yacute Adieresis -110\nKPX Yacute Agrave -110\nKPX Yacute Amacron -110\nKPX Yacute Aogonek -110\nKPX Yacute Aring -110\nKPX Yacute Atilde -110\nKPX Yacute O -85\nKPX Yacute Oacute -85\nKPX Yacute Ocircumflex -85\nKPX Yacute Odieresis -85\nKPX Yacute Ograve -85\nKPX Yacute Ohungarumlaut -85\nKPX Yacute Omacron -85\nKPX Yacute Oslash -85\nKPX Yacute Otilde -85\nKPX Yacute a -140\nKPX Yacute aacute -140\nKPX Yacute abreve -70\nKPX Yacute acircumflex -140\nKPX Yacute adieresis -140\nKPX Yacute agrave -140\nKPX Yacute amacron -70\nKPX Yacute aogonek -140\nKPX Yacute aring -140\nKPX Yacute atilde -70\nKPX Yacute colon -60\nKPX Yacute comma -140\nKPX Yacute e -140\nKPX Yacute eacute -140\nKPX Yacute ecaron -140\nKPX Yacute ecircumflex -140\nKPX Yacute edieresis -140\nKPX Yacute edotaccent -140\nKPX Yacute egrave -140\nKPX Yacute emacron -70\nKPX Yacute eogonek -140\nKPX Yacute hyphen -140\nKPX Yacute i -20\nKPX Yacute iacute -20\nKPX Yacute iogonek -20\nKPX Yacute o -140\nKPX Yacute oacute -140\nKPX Yacute ocircumflex -140\nKPX Yacute odieresis -140\nKPX Yacute ograve -140\nKPX Yacute ohungarumlaut -140\nKPX Yacute omacron -70\nKPX Yacute oslash -140\nKPX Yacute otilde -140\nKPX Yacute period -140\nKPX Yacute semicolon -60\nKPX Yacute u -110\nKPX Yacute uacute -110\nKPX Yacute ucircumflex -110\nKPX Yacute udieresis -110\nKPX Yacute ugrave -110\nKPX Yacute uhungarumlaut -110\nKPX Yacute umacron -110\nKPX Yacute uogonek -110\nKPX Yacute uring -110\nKPX Ydieresis A -110\nKPX Ydieresis Aacute -110\nKPX Ydieresis Abreve -110\nKPX Ydieresis Acircumflex -110\nKPX Ydieresis Adieresis -110\nKPX Ydieresis Agrave -110\nKPX Ydieresis Amacron -110\nKPX Ydieresis Aogonek -110\nKPX Ydieresis Aring -110\nKPX Ydieresis Atilde -110\nKPX Ydieresis O -85\nKPX Ydieresis Oacute -85\nKPX Ydieresis Ocircumflex -85\nKPX Ydieresis Odieresis -85\nKPX Ydieresis Ograve -85\nKPX Ydieresis Ohungarumlaut -85\nKPX Ydieresis Omacron -85\nKPX Ydieresis Oslash -85\nKPX Ydieresis Otilde -85\nKPX Ydieresis a -140\nKPX Ydieresis aacute -140\nKPX Ydieresis abreve -70\nKPX Ydieresis acircumflex -140\nKPX Ydieresis adieresis -140\nKPX Ydieresis agrave -140\nKPX Ydieresis amacron -70\nKPX Ydieresis aogonek -140\nKPX Ydieresis aring -140\nKPX Ydieresis atilde -70\nKPX Ydieresis colon -60\nKPX Ydieresis comma -140\nKPX Ydieresis e -140\nKPX Ydieresis eacute -140\nKPX Ydieresis ecaron -140\nKPX Ydieresis ecircumflex -140\nKPX Ydieresis edieresis -140\nKPX Ydieresis edotaccent -140\nKPX Ydieresis egrave -140\nKPX Ydieresis emacron -70\nKPX Ydieresis eogonek -140\nKPX Ydieresis hyphen -140\nKPX Ydieresis i -20\nKPX Ydieresis iacute -20\nKPX Ydieresis iogonek -20\nKPX Ydieresis o -140\nKPX Ydieresis oacute -140\nKPX Ydieresis ocircumflex -140\nKPX Ydieresis odieresis -140\nKPX Ydieresis ograve -140\nKPX Ydieresis ohungarumlaut -140\nKPX Ydieresis omacron -140\nKPX Ydieresis oslash -140\nKPX Ydieresis otilde -140\nKPX Ydieresis period -140\nKPX Ydieresis semicolon -60\nKPX Ydieresis u -110\nKPX Ydieresis uacute -110\nKPX Ydieresis ucircumflex -110\nKPX Ydieresis udieresis -110\nKPX Ydieresis ugrave -110\nKPX Ydieresis uhungarumlaut -110\nKPX Ydieresis umacron -110\nKPX Ydieresis uogonek -110\nKPX Ydieresis uring -110\nKPX a v -20\nKPX a w -20\nKPX a y -30\nKPX a yacute -30\nKPX a ydieresis -30\nKPX aacute v -20\nKPX aacute w -20\nKPX aacute y -30\nKPX aacute yacute -30\nKPX aacute ydieresis -30\nKPX abreve v -20\nKPX abreve w -20\nKPX abreve y -30\nKPX abreve yacute -30\nKPX abreve ydieresis -30\nKPX acircumflex v -20\nKPX acircumflex w -20\nKPX acircumflex y -30\nKPX acircumflex yacute -30\nKPX acircumflex ydieresis -30\nKPX adieresis v -20\nKPX adieresis w -20\nKPX adieresis y -30\nKPX adieresis yacute -30\nKPX adieresis ydieresis -30\nKPX agrave v -20\nKPX agrave w -20\nKPX agrave y -30\nKPX agrave yacute -30\nKPX agrave ydieresis -30\nKPX amacron v -20\nKPX amacron w -20\nKPX amacron y -30\nKPX amacron yacute -30\nKPX amacron ydieresis -30\nKPX aogonek v -20\nKPX aogonek w -20\nKPX aogonek y -30\nKPX aogonek yacute -30\nKPX aogonek ydieresis -30\nKPX aring v -20\nKPX aring w -20\nKPX aring y -30\nKPX aring yacute -30\nKPX aring ydieresis -30\nKPX atilde v -20\nKPX atilde w -20\nKPX atilde y -30\nKPX atilde yacute -30\nKPX atilde ydieresis -30\nKPX b b -10\nKPX b comma -40\nKPX b l -20\nKPX b lacute -20\nKPX b lcommaaccent -20\nKPX b lslash -20\nKPX b period -40\nKPX b u -20\nKPX b uacute -20\nKPX b ucircumflex -20\nKPX b udieresis -20\nKPX b ugrave -20\nKPX b uhungarumlaut -20\nKPX b umacron -20\nKPX b uogonek -20\nKPX b uring -20\nKPX b v -20\nKPX b y -20\nKPX b yacute -20\nKPX b ydieresis -20\nKPX c comma -15\nKPX c k -20\nKPX c kcommaaccent -20\nKPX cacute comma -15\nKPX cacute k -20\nKPX cacute kcommaaccent -20\nKPX ccaron comma -15\nKPX ccaron k -20\nKPX ccaron kcommaaccent -20\nKPX ccedilla comma -15\nKPX ccedilla k -20\nKPX ccedilla kcommaaccent -20\nKPX colon space -50\nKPX comma quotedblright -100\nKPX comma quoteright -100\nKPX e comma -15\nKPX e period -15\nKPX e v -30\nKPX e w -20\nKPX e x -30\nKPX e y -20\nKPX e yacute -20\nKPX e ydieresis -20\nKPX eacute comma -15\nKPX eacute period -15\nKPX eacute v -30\nKPX eacute w -20\nKPX eacute x -30\nKPX eacute y -20\nKPX eacute yacute -20\nKPX eacute ydieresis -20\nKPX ecaron comma -15\nKPX ecaron period -15\nKPX ecaron v -30\nKPX ecaron w -20\nKPX ecaron x -30\nKPX ecaron y -20\nKPX ecaron yacute -20\nKPX ecaron ydieresis -20\nKPX ecircumflex comma -15\nKPX ecircumflex period -15\nKPX ecircumflex v -30\nKPX ecircumflex w -20\nKPX ecircumflex x -30\nKPX ecircumflex y -20\nKPX ecircumflex yacute -20\nKPX ecircumflex ydieresis -20\nKPX edieresis comma -15\nKPX edieresis period -15\nKPX edieresis v -30\nKPX edieresis w -20\nKPX edieresis x -30\nKPX edieresis y -20\nKPX edieresis yacute -20\nKPX edieresis ydieresis -20\nKPX edotaccent comma -15\nKPX edotaccent period -15\nKPX edotaccent v -30\nKPX edotaccent w -20\nKPX edotaccent x -30\nKPX edotaccent y -20\nKPX edotaccent yacute -20\nKPX edotaccent ydieresis -20\nKPX egrave comma -15\nKPX egrave period -15\nKPX egrave v -30\nKPX egrave w -20\nKPX egrave x -30\nKPX egrave y -20\nKPX egrave yacute -20\nKPX egrave ydieresis -20\nKPX emacron comma -15\nKPX emacron period -15\nKPX emacron v -30\nKPX emacron w -20\nKPX emacron x -30\nKPX emacron y -20\nKPX emacron yacute -20\nKPX emacron ydieresis -20\nKPX eogonek comma -15\nKPX eogonek period -15\nKPX eogonek v -30\nKPX eogonek w -20\nKPX eogonek x -30\nKPX eogonek y -20\nKPX eogonek yacute -20\nKPX eogonek ydieresis -20\nKPX f a -30\nKPX f aacute -30\nKPX f abreve -30\nKPX f acircumflex -30\nKPX f adieresis -30\nKPX f agrave -30\nKPX f amacron -30\nKPX f aogonek -30\nKPX f aring -30\nKPX f atilde -30\nKPX f comma -30\nKPX f dotlessi -28\nKPX f e -30\nKPX f eacute -30\nKPX f ecaron -30\nKPX f ecircumflex -30\nKPX f edieresis -30\nKPX f edotaccent -30\nKPX f egrave -30\nKPX f emacron -30\nKPX f eogonek -30\nKPX f o -30\nKPX f oacute -30\nKPX f ocircumflex -30\nKPX f odieresis -30\nKPX f ograve -30\nKPX f ohungarumlaut -30\nKPX f omacron -30\nKPX f oslash -30\nKPX f otilde -30\nKPX f period -30\nKPX f quotedblright 60\nKPX f quoteright 50\nKPX g r -10\nKPX g racute -10\nKPX g rcaron -10\nKPX g rcommaaccent -10\nKPX gbreve r -10\nKPX gbreve racute -10\nKPX gbreve rcaron -10\nKPX gbreve rcommaaccent -10\nKPX gcommaaccent r -10\nKPX gcommaaccent racute -10\nKPX gcommaaccent rcaron -10\nKPX gcommaaccent rcommaaccent -10\nKPX h y -30\nKPX h yacute -30\nKPX h ydieresis -30\nKPX k e -20\nKPX k eacute -20\nKPX k ecaron -20\nKPX k ecircumflex -20\nKPX k edieresis -20\nKPX k edotaccent -20\nKPX k egrave -20\nKPX k emacron -20\nKPX k eogonek -20\nKPX k o -20\nKPX k oacute -20\nKPX k ocircumflex -20\nKPX k odieresis -20\nKPX k ograve -20\nKPX k ohungarumlaut -20\nKPX k omacron -20\nKPX k oslash -20\nKPX k otilde -20\nKPX kcommaaccent e -20\nKPX kcommaaccent eacute -20\nKPX kcommaaccent ecaron -20\nKPX kcommaaccent ecircumflex -20\nKPX kcommaaccent edieresis -20\nKPX kcommaaccent edotaccent -20\nKPX kcommaaccent egrave -20\nKPX kcommaaccent emacron -20\nKPX kcommaaccent eogonek -20\nKPX kcommaaccent o -20\nKPX kcommaaccent oacute -20\nKPX kcommaaccent ocircumflex -20\nKPX kcommaaccent odieresis -20\nKPX kcommaaccent ograve -20\nKPX kcommaaccent ohungarumlaut -20\nKPX kcommaaccent omacron -20\nKPX kcommaaccent oslash -20\nKPX kcommaaccent otilde -20\nKPX m u -10\nKPX m uacute -10\nKPX m ucircumflex -10\nKPX m udieresis -10\nKPX m ugrave -10\nKPX m uhungarumlaut -10\nKPX m umacron -10\nKPX m uogonek -10\nKPX m uring -10\nKPX m y -15\nKPX m yacute -15\nKPX m ydieresis -15\nKPX n u -10\nKPX n uacute -10\nKPX n ucircumflex -10\nKPX n udieresis -10\nKPX n ugrave -10\nKPX n uhungarumlaut -10\nKPX n umacron -10\nKPX n uogonek -10\nKPX n uring -10\nKPX n v -20\nKPX n y -15\nKPX n yacute -15\nKPX n ydieresis -15\nKPX nacute u -10\nKPX nacute uacute -10\nKPX nacute ucircumflex -10\nKPX nacute udieresis -10\nKPX nacute ugrave -10\nKPX nacute uhungarumlaut -10\nKPX nacute umacron -10\nKPX nacute uogonek -10\nKPX nacute uring -10\nKPX nacute v -20\nKPX nacute y -15\nKPX nacute yacute -15\nKPX nacute ydieresis -15\nKPX ncaron u -10\nKPX ncaron uacute -10\nKPX ncaron ucircumflex -10\nKPX ncaron udieresis -10\nKPX ncaron ugrave -10\nKPX ncaron uhungarumlaut -10\nKPX ncaron umacron -10\nKPX ncaron uogonek -10\nKPX ncaron uring -10\nKPX ncaron v -20\nKPX ncaron y -15\nKPX ncaron yacute -15\nKPX ncaron ydieresis -15\nKPX ncommaaccent u -10\nKPX ncommaaccent uacute -10\nKPX ncommaaccent ucircumflex -10\nKPX ncommaaccent udieresis -10\nKPX ncommaaccent ugrave -10\nKPX ncommaaccent uhungarumlaut -10\nKPX ncommaaccent umacron -10\nKPX ncommaaccent uogonek -10\nKPX ncommaaccent uring -10\nKPX ncommaaccent v -20\nKPX ncommaaccent y -15\nKPX ncommaaccent yacute -15\nKPX ncommaaccent ydieresis -15\nKPX ntilde u -10\nKPX ntilde uacute -10\nKPX ntilde ucircumflex -10\nKPX ntilde udieresis -10\nKPX ntilde ugrave -10\nKPX ntilde uhungarumlaut -10\nKPX ntilde umacron -10\nKPX ntilde uogonek -10\nKPX ntilde uring -10\nKPX ntilde v -20\nKPX ntilde y -15\nKPX ntilde yacute -15\nKPX ntilde ydieresis -15\nKPX o comma -40\nKPX o period -40\nKPX o v -15\nKPX o w -15\nKPX o x -30\nKPX o y -30\nKPX o yacute -30\nKPX o ydieresis -30\nKPX oacute comma -40\nKPX oacute period -40\nKPX oacute v -15\nKPX oacute w -15\nKPX oacute x -30\nKPX oacute y -30\nKPX oacute yacute -30\nKPX oacute ydieresis -30\nKPX ocircumflex comma -40\nKPX ocircumflex period -40\nKPX ocircumflex v -15\nKPX ocircumflex w -15\nKPX ocircumflex x -30\nKPX ocircumflex y -30\nKPX ocircumflex yacute -30\nKPX ocircumflex ydieresis -30\nKPX odieresis comma -40\nKPX odieresis period -40\nKPX odieresis v -15\nKPX odieresis w -15\nKPX odieresis x -30\nKPX odieresis y -30\nKPX odieresis yacute -30\nKPX odieresis ydieresis -30\nKPX ograve comma -40\nKPX ograve period -40\nKPX ograve v -15\nKPX ograve w -15\nKPX ograve x -30\nKPX ograve y -30\nKPX ograve yacute -30\nKPX ograve ydieresis -30\nKPX ohungarumlaut comma -40\nKPX ohungarumlaut period -40\nKPX ohungarumlaut v -15\nKPX ohungarumlaut w -15\nKPX ohungarumlaut x -30\nKPX ohungarumlaut y -30\nKPX ohungarumlaut yacute -30\nKPX ohungarumlaut ydieresis -30\nKPX omacron comma -40\nKPX omacron period -40\nKPX omacron v -15\nKPX omacron w -15\nKPX omacron x -30\nKPX omacron y -30\nKPX omacron yacute -30\nKPX omacron ydieresis -30\nKPX oslash a -55\nKPX oslash aacute -55\nKPX oslash abreve -55\nKPX oslash acircumflex -55\nKPX oslash adieresis -55\nKPX oslash agrave -55\nKPX oslash amacron -55\nKPX oslash aogonek -55\nKPX oslash aring -55\nKPX oslash atilde -55\nKPX oslash b -55\nKPX oslash c -55\nKPX oslash cacute -55\nKPX oslash ccaron -55\nKPX oslash ccedilla -55\nKPX oslash comma -95\nKPX oslash d -55\nKPX oslash dcroat -55\nKPX oslash e -55\nKPX oslash eacute -55\nKPX oslash ecaron -55\nKPX oslash ecircumflex -55\nKPX oslash edieresis -55\nKPX oslash edotaccent -55\nKPX oslash egrave -55\nKPX oslash emacron -55\nKPX oslash eogonek -55\nKPX oslash f -55\nKPX oslash g -55\nKPX oslash gbreve -55\nKPX oslash gcommaaccent -55\nKPX oslash h -55\nKPX oslash i -55\nKPX oslash iacute -55\nKPX oslash icircumflex -55\nKPX oslash idieresis -55\nKPX oslash igrave -55\nKPX oslash imacron -55\nKPX oslash iogonek -55\nKPX oslash j -55\nKPX oslash k -55\nKPX oslash kcommaaccent -55\nKPX oslash l -55\nKPX oslash lacute -55\nKPX oslash lcommaaccent -55\nKPX oslash lslash -55\nKPX oslash m -55\nKPX oslash n -55\nKPX oslash nacute -55\nKPX oslash ncaron -55\nKPX oslash ncommaaccent -55\nKPX oslash ntilde -55\nKPX oslash o -55\nKPX oslash oacute -55\nKPX oslash ocircumflex -55\nKPX oslash odieresis -55\nKPX oslash ograve -55\nKPX oslash ohungarumlaut -55\nKPX oslash omacron -55\nKPX oslash oslash -55\nKPX oslash otilde -55\nKPX oslash p -55\nKPX oslash period -95\nKPX oslash q -55\nKPX oslash r -55\nKPX oslash racute -55\nKPX oslash rcaron -55\nKPX oslash rcommaaccent -55\nKPX oslash s -55\nKPX oslash sacute -55\nKPX oslash scaron -55\nKPX oslash scedilla -55\nKPX oslash scommaaccent -55\nKPX oslash t -55\nKPX oslash tcommaaccent -55\nKPX oslash u -55\nKPX oslash uacute -55\nKPX oslash ucircumflex -55\nKPX oslash udieresis -55\nKPX oslash ugrave -55\nKPX oslash uhungarumlaut -55\nKPX oslash umacron -55\nKPX oslash uogonek -55\nKPX oslash uring -55\nKPX oslash v -70\nKPX oslash w -70\nKPX oslash x -85\nKPX oslash y -70\nKPX oslash yacute -70\nKPX oslash ydieresis -70\nKPX oslash z -55\nKPX oslash zacute -55\nKPX oslash zcaron -55\nKPX oslash zdotaccent -55\nKPX otilde comma -40\nKPX otilde period -40\nKPX otilde v -15\nKPX otilde w -15\nKPX otilde x -30\nKPX otilde y -30\nKPX otilde yacute -30\nKPX otilde ydieresis -30\nKPX p comma -35\nKPX p period -35\nKPX p y -30\nKPX p yacute -30\nKPX p ydieresis -30\nKPX period quotedblright -100\nKPX period quoteright -100\nKPX period space -60\nKPX quotedblright space -40\nKPX quoteleft quoteleft -57\nKPX quoteright d -50\nKPX quoteright dcroat -50\nKPX quoteright quoteright -57\nKPX quoteright r -50\nKPX quoteright racute -50\nKPX quoteright rcaron -50\nKPX quoteright rcommaaccent -50\nKPX quoteright s -50\nKPX quoteright sacute -50\nKPX quoteright scaron -50\nKPX quoteright scedilla -50\nKPX quoteright scommaaccent -50\nKPX quoteright space -70\nKPX r a -10\nKPX r aacute -10\nKPX r abreve -10\nKPX r acircumflex -10\nKPX r adieresis -10\nKPX r agrave -10\nKPX r amacron -10\nKPX r aogonek -10\nKPX r aring -10\nKPX r atilde -10\nKPX r colon 30\nKPX r comma -50\nKPX r i 15\nKPX r iacute 15\nKPX r icircumflex 15\nKPX r idieresis 15\nKPX r igrave 15\nKPX r imacron 15\nKPX r iogonek 15\nKPX r k 15\nKPX r kcommaaccent 15\nKPX r l 15\nKPX r lacute 15\nKPX r lcommaaccent 15\nKPX r lslash 15\nKPX r m 25\nKPX r n 25\nKPX r nacute 25\nKPX r ncaron 25\nKPX r ncommaaccent 25\nKPX r ntilde 25\nKPX r p 30\nKPX r period -50\nKPX r semicolon 30\nKPX r t 40\nKPX r tcommaaccent 40\nKPX r u 15\nKPX r uacute 15\nKPX r ucircumflex 15\nKPX r udieresis 15\nKPX r ugrave 15\nKPX r uhungarumlaut 15\nKPX r umacron 15\nKPX r uogonek 15\nKPX r uring 15\nKPX r v 30\nKPX r y 30\nKPX r yacute 30\nKPX r ydieresis 30\nKPX racute a -10\nKPX racute aacute -10\nKPX racute abreve -10\nKPX racute acircumflex -10\nKPX racute adieresis -10\nKPX racute agrave -10\nKPX racute amacron -10\nKPX racute aogonek -10\nKPX racute aring -10\nKPX racute atilde -10\nKPX racute colon 30\nKPX racute comma -50\nKPX racute i 15\nKPX racute iacute 15\nKPX racute icircumflex 15\nKPX racute idieresis 15\nKPX racute igrave 15\nKPX racute imacron 15\nKPX racute iogonek 15\nKPX racute k 15\nKPX racute kcommaaccent 15\nKPX racute l 15\nKPX racute lacute 15\nKPX racute lcommaaccent 15\nKPX racute lslash 15\nKPX racute m 25\nKPX racute n 25\nKPX racute nacute 25\nKPX racute ncaron 25\nKPX racute ncommaaccent 25\nKPX racute ntilde 25\nKPX racute p 30\nKPX racute period -50\nKPX racute semicolon 30\nKPX racute t 40\nKPX racute tcommaaccent 40\nKPX racute u 15\nKPX racute uacute 15\nKPX racute ucircumflex 15\nKPX racute udieresis 15\nKPX racute ugrave 15\nKPX racute uhungarumlaut 15\nKPX racute umacron 15\nKPX racute uogonek 15\nKPX racute uring 15\nKPX racute v 30\nKPX racute y 30\nKPX racute yacute 30\nKPX racute ydieresis 30\nKPX rcaron a -10\nKPX rcaron aacute -10\nKPX rcaron abreve -10\nKPX rcaron acircumflex -10\nKPX rcaron adieresis -10\nKPX rcaron agrave -10\nKPX rcaron amacron -10\nKPX rcaron aogonek -10\nKPX rcaron aring -10\nKPX rcaron atilde -10\nKPX rcaron colon 30\nKPX rcaron comma -50\nKPX rcaron i 15\nKPX rcaron iacute 15\nKPX rcaron icircumflex 15\nKPX rcaron idieresis 15\nKPX rcaron igrave 15\nKPX rcaron imacron 15\nKPX rcaron iogonek 15\nKPX rcaron k 15\nKPX rcaron kcommaaccent 15\nKPX rcaron l 15\nKPX rcaron lacute 15\nKPX rcaron lcommaaccent 15\nKPX rcaron lslash 15\nKPX rcaron m 25\nKPX rcaron n 25\nKPX rcaron nacute 25\nKPX rcaron ncaron 25\nKPX rcaron ncommaaccent 25\nKPX rcaron ntilde 25\nKPX rcaron p 30\nKPX rcaron period -50\nKPX rcaron semicolon 30\nKPX rcaron t 40\nKPX rcaron tcommaaccent 40\nKPX rcaron u 15\nKPX rcaron uacute 15\nKPX rcaron ucircumflex 15\nKPX rcaron udieresis 15\nKPX rcaron ugrave 15\nKPX rcaron uhungarumlaut 15\nKPX rcaron umacron 15\nKPX rcaron uogonek 15\nKPX rcaron uring 15\nKPX rcaron v 30\nKPX rcaron y 30\nKPX rcaron yacute 30\nKPX rcaron ydieresis 30\nKPX rcommaaccent a -10\nKPX rcommaaccent aacute -10\nKPX rcommaaccent abreve -10\nKPX rcommaaccent acircumflex -10\nKPX rcommaaccent adieresis -10\nKPX rcommaaccent agrave -10\nKPX rcommaaccent amacron -10\nKPX rcommaaccent aogonek -10\nKPX rcommaaccent aring -10\nKPX rcommaaccent atilde -10\nKPX rcommaaccent colon 30\nKPX rcommaaccent comma -50\nKPX rcommaaccent i 15\nKPX rcommaaccent iacute 15\nKPX rcommaaccent icircumflex 15\nKPX rcommaaccent idieresis 15\nKPX rcommaaccent igrave 15\nKPX rcommaaccent imacron 15\nKPX rcommaaccent iogonek 15\nKPX rcommaaccent k 15\nKPX rcommaaccent kcommaaccent 15\nKPX rcommaaccent l 15\nKPX rcommaaccent lacute 15\nKPX rcommaaccent lcommaaccent 15\nKPX rcommaaccent lslash 15\nKPX rcommaaccent m 25\nKPX rcommaaccent n 25\nKPX rcommaaccent nacute 25\nKPX rcommaaccent ncaron 25\nKPX rcommaaccent ncommaaccent 25\nKPX rcommaaccent ntilde 25\nKPX rcommaaccent p 30\nKPX rcommaaccent period -50\nKPX rcommaaccent semicolon 30\nKPX rcommaaccent t 40\nKPX rcommaaccent tcommaaccent 40\nKPX rcommaaccent u 15\nKPX rcommaaccent uacute 15\nKPX rcommaaccent ucircumflex 15\nKPX rcommaaccent udieresis 15\nKPX rcommaaccent ugrave 15\nKPX rcommaaccent uhungarumlaut 15\nKPX rcommaaccent umacron 15\nKPX rcommaaccent uogonek 15\nKPX rcommaaccent uring 15\nKPX rcommaaccent v 30\nKPX rcommaaccent y 30\nKPX rcommaaccent yacute 30\nKPX rcommaaccent ydieresis 30\nKPX s comma -15\nKPX s period -15\nKPX s w -30\nKPX sacute comma -15\nKPX sacute period -15\nKPX sacute w -30\nKPX scaron comma -15\nKPX scaron period -15\nKPX scaron w -30\nKPX scedilla comma -15\nKPX scedilla period -15\nKPX scedilla w -30\nKPX scommaaccent comma -15\nKPX scommaaccent period -15\nKPX scommaaccent w -30\nKPX semicolon space -50\nKPX space T -50\nKPX space Tcaron -50\nKPX space Tcommaaccent -50\nKPX space V -50\nKPX space W -40\nKPX space Y -90\nKPX space Yacute -90\nKPX space Ydieresis -90\nKPX space quotedblleft -30\nKPX space quoteleft -60\nKPX v a -25\nKPX v aacute -25\nKPX v abreve -25\nKPX v acircumflex -25\nKPX v adieresis -25\nKPX v agrave -25\nKPX v amacron -25\nKPX v aogonek -25\nKPX v aring -25\nKPX v atilde -25\nKPX v comma -80\nKPX v e -25\nKPX v eacute -25\nKPX v ecaron -25\nKPX v ecircumflex -25\nKPX v edieresis -25\nKPX v edotaccent -25\nKPX v egrave -25\nKPX v emacron -25\nKPX v eogonek -25\nKPX v o -25\nKPX v oacute -25\nKPX v ocircumflex -25\nKPX v odieresis -25\nKPX v ograve -25\nKPX v ohungarumlaut -25\nKPX v omacron -25\nKPX v oslash -25\nKPX v otilde -25\nKPX v period -80\nKPX w a -15\nKPX w aacute -15\nKPX w abreve -15\nKPX w acircumflex -15\nKPX w adieresis -15\nKPX w agrave -15\nKPX w amacron -15\nKPX w aogonek -15\nKPX w aring -15\nKPX w atilde -15\nKPX w comma -60\nKPX w e -10\nKPX w eacute -10\nKPX w ecaron -10\nKPX w ecircumflex -10\nKPX w edieresis -10\nKPX w edotaccent -10\nKPX w egrave -10\nKPX w emacron -10\nKPX w eogonek -10\nKPX w o -10\nKPX w oacute -10\nKPX w ocircumflex -10\nKPX w odieresis -10\nKPX w ograve -10\nKPX w ohungarumlaut -10\nKPX w omacron -10\nKPX w oslash -10\nKPX w otilde -10\nKPX w period -60\nKPX x e -30\nKPX x eacute -30\nKPX x ecaron -30\nKPX x ecircumflex -30\nKPX x edieresis -30\nKPX x edotaccent -30\nKPX x egrave -30\nKPX x emacron -30\nKPX x eogonek -30\nKPX y a -20\nKPX y aacute -20\nKPX y abreve -20\nKPX y acircumflex -20\nKPX y adieresis -20\nKPX y agrave -20\nKPX y amacron -20\nKPX y aogonek -20\nKPX y aring -20\nKPX y atilde -20\nKPX y comma -100\nKPX y e -20\nKPX y eacute -20\nKPX y ecaron -20\nKPX y ecircumflex -20\nKPX y edieresis -20\nKPX y edotaccent -20\nKPX y egrave -20\nKPX y emacron -20\nKPX y eogonek -20\nKPX y o -20\nKPX y oacute -20\nKPX y ocircumflex -20\nKPX y odieresis -20\nKPX y ograve -20\nKPX y ohungarumlaut -20\nKPX y omacron -20\nKPX y oslash -20\nKPX y otilde -20\nKPX y period -100\nKPX yacute a -20\nKPX yacute aacute -20\nKPX yacute abreve -20\nKPX yacute acircumflex -20\nKPX yacute adieresis -20\nKPX yacute agrave -20\nKPX yacute amacron -20\nKPX yacute aogonek -20\nKPX yacute aring -20\nKPX yacute atilde -20\nKPX yacute comma -100\nKPX yacute e -20\nKPX yacute eacute -20\nKPX yacute ecaron -20\nKPX yacute ecircumflex -20\nKPX yacute edieresis -20\nKPX yacute edotaccent -20\nKPX yacute egrave -20\nKPX yacute emacron -20\nKPX yacute eogonek -20\nKPX yacute o -20\nKPX yacute oacute -20\nKPX yacute ocircumflex -20\nKPX yacute odieresis -20\nKPX yacute ograve -20\nKPX yacute ohungarumlaut -20\nKPX yacute omacron -20\nKPX yacute oslash -20\nKPX yacute otilde -20\nKPX yacute period -100\nKPX ydieresis a -20\nKPX ydieresis aacute -20\nKPX ydieresis abreve -20\nKPX ydieresis acircumflex -20\nKPX ydieresis adieresis -20\nKPX ydieresis agrave -20\nKPX ydieresis amacron -20\nKPX ydieresis aogonek -20\nKPX ydieresis aring -20\nKPX ydieresis atilde -20\nKPX ydieresis comma -100\nKPX ydieresis e -20\nKPX ydieresis eacute -20\nKPX ydieresis ecaron -20\nKPX ydieresis ecircumflex -20\nKPX ydieresis edieresis -20\nKPX ydieresis edotaccent -20\nKPX ydieresis egrave -20\nKPX ydieresis emacron -20\nKPX ydieresis eogonek -20\nKPX ydieresis o -20\nKPX ydieresis oacute -20\nKPX ydieresis ocircumflex -20\nKPX ydieresis odieresis -20\nKPX ydieresis ograve -20\nKPX ydieresis ohungarumlaut -20\nKPX ydieresis omacron -20\nKPX ydieresis oslash -20\nKPX ydieresis otilde -20\nKPX ydieresis period -100\nKPX z e -15\nKPX z eacute -15\nKPX z ecaron -15\nKPX z ecircumflex -15\nKPX z edieresis -15\nKPX z edotaccent -15\nKPX z egrave -15\nKPX z emacron -15\nKPX z eogonek -15\nKPX z o -15\nKPX z oacute -15\nKPX z ocircumflex -15\nKPX z odieresis -15\nKPX z ograve -15\nKPX z ohungarumlaut -15\nKPX z omacron -15\nKPX z oslash -15\nKPX z otilde -15\nKPX zacute e -15\nKPX zacute eacute -15\nKPX zacute ecaron -15\nKPX zacute ecircumflex -15\nKPX zacute edieresis -15\nKPX zacute edotaccent -15\nKPX zacute egrave -15\nKPX zacute emacron -15\nKPX zacute eogonek -15\nKPX zacute o -15\nKPX zacute oacute -15\nKPX zacute ocircumflex -15\nKPX zacute odieresis -15\nKPX zacute ograve -15\nKPX zacute ohungarumlaut -15\nKPX zacute omacron -15\nKPX zacute oslash -15\nKPX zacute otilde -15\nKPX zcaron e -15\nKPX zcaron eacute -15\nKPX zcaron ecaron -15\nKPX zcaron ecircumflex -15\nKPX zcaron edieresis -15\nKPX zcaron edotaccent -15\nKPX zcaron egrave -15\nKPX zcaron emacron -15\nKPX zcaron eogonek -15\nKPX zcaron o -15\nKPX zcaron oacute -15\nKPX zcaron ocircumflex -15\nKPX zcaron odieresis -15\nKPX zcaron ograve -15\nKPX zcaron ohungarumlaut -15\nKPX zcaron omacron -15\nKPX zcaron oslash -15\nKPX zcaron otilde -15\nKPX zdotaccent e -15\nKPX zdotaccent eacute -15\nKPX zdotaccent ecaron -15\nKPX zdotaccent ecircumflex -15\nKPX zdotaccent edieresis -15\nKPX zdotaccent edotaccent -15\nKPX zdotaccent egrave -15\nKPX zdotaccent emacron -15\nKPX zdotaccent eogonek -15\nKPX zdotaccent o -15\nKPX zdotaccent oacute -15\nKPX zdotaccent ocircumflex -15\nKPX zdotaccent odieresis -15\nKPX zdotaccent ograve -15\nKPX zdotaccent ohungarumlaut -15\nKPX zdotaccent omacron -15\nKPX zdotaccent oslash -15\nKPX zdotaccent otilde -15\nEndKernPairs\nEndKernData\nEndFontMetrics\n";
    },
    "Helvetica-Bold": function() {
      return "StartFontMetrics 4.1\nComment Copyright (c) 1985, 1987, 1989, 1990, 1997 Adobe Systems Incorporated.  All Rights Reserved.\nComment Creation Date: Thu May  1 12:43:52 1997\nComment UniqueID 43052\nComment VMusage 37169 48194\nFontName Helvetica-Bold\nFullName Helvetica Bold\nFamilyName Helvetica\nWeight Bold\nItalicAngle 0\nIsFixedPitch false\nCharacterSet ExtendedRoman\nFontBBox -170 -228 1003 962 \nUnderlinePosition -100\nUnderlineThickness 50\nVersion 002.000\nNotice Copyright (c) 1985, 1987, 1989, 1990, 1997 Adobe Systems Incorporated.  All Rights Reserved.Helvetica is a trademark of Linotype-Hell AG and/or its subsidiaries.\nEncodingScheme AdobeStandardEncoding\nCapHeight 718\nXHeight 532\nAscender 718\nDescender -207\nStdHW 118\nStdVW 140\nStartCharMetrics 315\nC 32 ; WX 278 ; N space ; B 0 0 0 0 ;\nC 33 ; WX 333 ; N exclam ; B 90 0 244 718 ;\nC 34 ; WX 474 ; N quotedbl ; B 98 447 376 718 ;\nC 35 ; WX 556 ; N numbersign ; B 18 0 538 698 ;\nC 36 ; WX 556 ; N dollar ; B 30 -115 523 775 ;\nC 37 ; WX 889 ; N percent ; B 28 -19 861 710 ;\nC 38 ; WX 722 ; N ampersand ; B 54 -19 701 718 ;\nC 39 ; WX 278 ; N quoteright ; B 69 445 209 718 ;\nC 40 ; WX 333 ; N parenleft ; B 35 -208 314 734 ;\nC 41 ; WX 333 ; N parenright ; B 19 -208 298 734 ;\nC 42 ; WX 389 ; N asterisk ; B 27 387 362 718 ;\nC 43 ; WX 584 ; N plus ; B 40 0 544 506 ;\nC 44 ; WX 278 ; N comma ; B 64 -168 214 146 ;\nC 45 ; WX 333 ; N hyphen ; B 27 215 306 345 ;\nC 46 ; WX 278 ; N period ; B 64 0 214 146 ;\nC 47 ; WX 278 ; N slash ; B -33 -19 311 737 ;\nC 48 ; WX 556 ; N zero ; B 32 -19 524 710 ;\nC 49 ; WX 556 ; N one ; B 69 0 378 710 ;\nC 50 ; WX 556 ; N two ; B 26 0 511 710 ;\nC 51 ; WX 556 ; N three ; B 27 -19 516 710 ;\nC 52 ; WX 556 ; N four ; B 27 0 526 710 ;\nC 53 ; WX 556 ; N five ; B 27 -19 516 698 ;\nC 54 ; WX 556 ; N six ; B 31 -19 520 710 ;\nC 55 ; WX 556 ; N seven ; B 25 0 528 698 ;\nC 56 ; WX 556 ; N eight ; B 32 -19 524 710 ;\nC 57 ; WX 556 ; N nine ; B 30 -19 522 710 ;\nC 58 ; WX 333 ; N colon ; B 92 0 242 512 ;\nC 59 ; WX 333 ; N semicolon ; B 92 -168 242 512 ;\nC 60 ; WX 584 ; N less ; B 38 -8 546 514 ;\nC 61 ; WX 584 ; N equal ; B 40 87 544 419 ;\nC 62 ; WX 584 ; N greater ; B 38 -8 546 514 ;\nC 63 ; WX 611 ; N question ; B 60 0 556 727 ;\nC 64 ; WX 975 ; N at ; B 118 -19 856 737 ;\nC 65 ; WX 722 ; N A ; B 20 0 702 718 ;\nC 66 ; WX 722 ; N B ; B 76 0 669 718 ;\nC 67 ; WX 722 ; N C ; B 44 -19 684 737 ;\nC 68 ; WX 722 ; N D ; B 76 0 685 718 ;\nC 69 ; WX 667 ; N E ; B 76 0 621 718 ;\nC 70 ; WX 611 ; N F ; B 76 0 587 718 ;\nC 71 ; WX 778 ; N G ; B 44 -19 713 737 ;\nC 72 ; WX 722 ; N H ; B 71 0 651 718 ;\nC 73 ; WX 278 ; N I ; B 64 0 214 718 ;\nC 74 ; WX 556 ; N J ; B 22 -18 484 718 ;\nC 75 ; WX 722 ; N K ; B 87 0 722 718 ;\nC 76 ; WX 611 ; N L ; B 76 0 583 718 ;\nC 77 ; WX 833 ; N M ; B 69 0 765 718 ;\nC 78 ; WX 722 ; N N ; B 69 0 654 718 ;\nC 79 ; WX 778 ; N O ; B 44 -19 734 737 ;\nC 80 ; WX 667 ; N P ; B 76 0 627 718 ;\nC 81 ; WX 778 ; N Q ; B 44 -52 737 737 ;\nC 82 ; WX 722 ; N R ; B 76 0 677 718 ;\nC 83 ; WX 667 ; N S ; B 39 -19 629 737 ;\nC 84 ; WX 611 ; N T ; B 14 0 598 718 ;\nC 85 ; WX 722 ; N U ; B 72 -19 651 718 ;\nC 86 ; WX 667 ; N V ; B 19 0 648 718 ;\nC 87 ; WX 944 ; N W ; B 16 0 929 718 ;\nC 88 ; WX 667 ; N X ; B 14 0 653 718 ;\nC 89 ; WX 667 ; N Y ; B 15 0 653 718 ;\nC 90 ; WX 611 ; N Z ; B 25 0 586 718 ;\nC 91 ; WX 333 ; N bracketleft ; B 63 -196 309 722 ;\nC 92 ; WX 278 ; N backslash ; B -33 -19 311 737 ;\nC 93 ; WX 333 ; N bracketright ; B 24 -196 270 722 ;\nC 94 ; WX 584 ; N asciicircum ; B 62 323 522 698 ;\nC 95 ; WX 556 ; N underscore ; B 0 -125 556 -75 ;\nC 96 ; WX 278 ; N quoteleft ; B 69 454 209 727 ;\nC 97 ; WX 556 ; N a ; B 29 -14 527 546 ;\nC 98 ; WX 611 ; N b ; B 61 -14 578 718 ;\nC 99 ; WX 556 ; N c ; B 34 -14 524 546 ;\nC 100 ; WX 611 ; N d ; B 34 -14 551 718 ;\nC 101 ; WX 556 ; N e ; B 23 -14 528 546 ;\nC 102 ; WX 333 ; N f ; B 10 0 318 727 ; L i fi ; L l fl ;\nC 103 ; WX 611 ; N g ; B 40 -217 553 546 ;\nC 104 ; WX 611 ; N h ; B 65 0 546 718 ;\nC 105 ; WX 278 ; N i ; B 69 0 209 725 ;\nC 106 ; WX 278 ; N j ; B 3 -214 209 725 ;\nC 107 ; WX 556 ; N k ; B 69 0 562 718 ;\nC 108 ; WX 278 ; N l ; B 69 0 209 718 ;\nC 109 ; WX 889 ; N m ; B 64 0 826 546 ;\nC 110 ; WX 611 ; N n ; B 65 0 546 546 ;\nC 111 ; WX 611 ; N o ; B 34 -14 578 546 ;\nC 112 ; WX 611 ; N p ; B 62 -207 578 546 ;\nC 113 ; WX 611 ; N q ; B 34 -207 552 546 ;\nC 114 ; WX 389 ; N r ; B 64 0 373 546 ;\nC 115 ; WX 556 ; N s ; B 30 -14 519 546 ;\nC 116 ; WX 333 ; N t ; B 10 -6 309 676 ;\nC 117 ; WX 611 ; N u ; B 66 -14 545 532 ;\nC 118 ; WX 556 ; N v ; B 13 0 543 532 ;\nC 119 ; WX 778 ; N w ; B 10 0 769 532 ;\nC 120 ; WX 556 ; N x ; B 15 0 541 532 ;\nC 121 ; WX 556 ; N y ; B 10 -214 539 532 ;\nC 122 ; WX 500 ; N z ; B 20 0 480 532 ;\nC 123 ; WX 389 ; N braceleft ; B 48 -196 365 722 ;\nC 124 ; WX 280 ; N bar ; B 84 -225 196 775 ;\nC 125 ; WX 389 ; N braceright ; B 24 -196 341 722 ;\nC 126 ; WX 584 ; N asciitilde ; B 61 163 523 343 ;\nC 161 ; WX 333 ; N exclamdown ; B 90 -186 244 532 ;\nC 162 ; WX 556 ; N cent ; B 34 -118 524 628 ;\nC 163 ; WX 556 ; N sterling ; B 28 -16 541 718 ;\nC 164 ; WX 167 ; N fraction ; B -170 -19 336 710 ;\nC 165 ; WX 556 ; N yen ; B -9 0 565 698 ;\nC 166 ; WX 556 ; N florin ; B -10 -210 516 737 ;\nC 167 ; WX 556 ; N section ; B 34 -184 522 727 ;\nC 168 ; WX 556 ; N currency ; B -3 76 559 636 ;\nC 169 ; WX 238 ; N quotesingle ; B 70 447 168 718 ;\nC 170 ; WX 500 ; N quotedblleft ; B 64 454 436 727 ;\nC 171 ; WX 556 ; N guillemotleft ; B 88 76 468 484 ;\nC 172 ; WX 333 ; N guilsinglleft ; B 83 76 250 484 ;\nC 173 ; WX 333 ; N guilsinglright ; B 83 76 250 484 ;\nC 174 ; WX 611 ; N fi ; B 10 0 542 727 ;\nC 175 ; WX 611 ; N fl ; B 10 0 542 727 ;\nC 177 ; WX 556 ; N endash ; B 0 227 556 333 ;\nC 178 ; WX 556 ; N dagger ; B 36 -171 520 718 ;\nC 179 ; WX 556 ; N daggerdbl ; B 36 -171 520 718 ;\nC 180 ; WX 278 ; N periodcentered ; B 58 172 220 334 ;\nC 182 ; WX 556 ; N paragraph ; B -8 -191 539 700 ;\nC 183 ; WX 350 ; N bullet ; B 10 194 340 524 ;\nC 184 ; WX 278 ; N quotesinglbase ; B 69 -146 209 127 ;\nC 185 ; WX 500 ; N quotedblbase ; B 64 -146 436 127 ;\nC 186 ; WX 500 ; N quotedblright ; B 64 445 436 718 ;\nC 187 ; WX 556 ; N guillemotright ; B 88 76 468 484 ;\nC 188 ; WX 1000 ; N ellipsis ; B 92 0 908 146 ;\nC 189 ; WX 1000 ; N perthousand ; B -3 -19 1003 710 ;\nC 191 ; WX 611 ; N questiondown ; B 55 -195 551 532 ;\nC 193 ; WX 333 ; N grave ; B -23 604 225 750 ;\nC 194 ; WX 333 ; N acute ; B 108 604 356 750 ;\nC 195 ; WX 333 ; N circumflex ; B -10 604 343 750 ;\nC 196 ; WX 333 ; N tilde ; B -17 610 350 737 ;\nC 197 ; WX 333 ; N macron ; B -6 604 339 678 ;\nC 198 ; WX 333 ; N breve ; B -2 604 335 750 ;\nC 199 ; WX 333 ; N dotaccent ; B 104 614 230 729 ;\nC 200 ; WX 333 ; N dieresis ; B 6 614 327 729 ;\nC 202 ; WX 333 ; N ring ; B 59 568 275 776 ;\nC 203 ; WX 333 ; N cedilla ; B 6 -228 245 0 ;\nC 205 ; WX 333 ; N hungarumlaut ; B 9 604 486 750 ;\nC 206 ; WX 333 ; N ogonek ; B 71 -228 304 0 ;\nC 207 ; WX 333 ; N caron ; B -10 604 343 750 ;\nC 208 ; WX 1000 ; N emdash ; B 0 227 1000 333 ;\nC 225 ; WX 1000 ; N AE ; B 5 0 954 718 ;\nC 227 ; WX 370 ; N ordfeminine ; B 22 401 347 737 ;\nC 232 ; WX 611 ; N Lslash ; B -20 0 583 718 ;\nC 233 ; WX 778 ; N Oslash ; B 33 -27 744 745 ;\nC 234 ; WX 1000 ; N OE ; B 37 -19 961 737 ;\nC 235 ; WX 365 ; N ordmasculine ; B 6 401 360 737 ;\nC 241 ; WX 889 ; N ae ; B 29 -14 858 546 ;\nC 245 ; WX 278 ; N dotlessi ; B 69 0 209 532 ;\nC 248 ; WX 278 ; N lslash ; B -18 0 296 718 ;\nC 249 ; WX 611 ; N oslash ; B 22 -29 589 560 ;\nC 250 ; WX 944 ; N oe ; B 34 -14 912 546 ;\nC 251 ; WX 611 ; N germandbls ; B 69 -14 579 731 ;\nC -1 ; WX 278 ; N Idieresis ; B -21 0 300 915 ;\nC -1 ; WX 556 ; N eacute ; B 23 -14 528 750 ;\nC -1 ; WX 556 ; N abreve ; B 29 -14 527 750 ;\nC -1 ; WX 611 ; N uhungarumlaut ; B 66 -14 625 750 ;\nC -1 ; WX 556 ; N ecaron ; B 23 -14 528 750 ;\nC -1 ; WX 667 ; N Ydieresis ; B 15 0 653 915 ;\nC -1 ; WX 584 ; N divide ; B 40 -42 544 548 ;\nC -1 ; WX 667 ; N Yacute ; B 15 0 653 936 ;\nC -1 ; WX 722 ; N Acircumflex ; B 20 0 702 936 ;\nC -1 ; WX 556 ; N aacute ; B 29 -14 527 750 ;\nC -1 ; WX 722 ; N Ucircumflex ; B 72 -19 651 936 ;\nC -1 ; WX 556 ; N yacute ; B 10 -214 539 750 ;\nC -1 ; WX 556 ; N scommaaccent ; B 30 -228 519 546 ;\nC -1 ; WX 556 ; N ecircumflex ; B 23 -14 528 750 ;\nC -1 ; WX 722 ; N Uring ; B 72 -19 651 962 ;\nC -1 ; WX 722 ; N Udieresis ; B 72 -19 651 915 ;\nC -1 ; WX 556 ; N aogonek ; B 29 -224 545 546 ;\nC -1 ; WX 722 ; N Uacute ; B 72 -19 651 936 ;\nC -1 ; WX 611 ; N uogonek ; B 66 -228 545 532 ;\nC -1 ; WX 667 ; N Edieresis ; B 76 0 621 915 ;\nC -1 ; WX 722 ; N Dcroat ; B -5 0 685 718 ;\nC -1 ; WX 250 ; N commaaccent ; B 64 -228 199 -50 ;\nC -1 ; WX 737 ; N copyright ; B -11 -19 749 737 ;\nC -1 ; WX 667 ; N Emacron ; B 76 0 621 864 ;\nC -1 ; WX 556 ; N ccaron ; B 34 -14 524 750 ;\nC -1 ; WX 556 ; N aring ; B 29 -14 527 776 ;\nC -1 ; WX 722 ; N Ncommaaccent ; B 69 -228 654 718 ;\nC -1 ; WX 278 ; N lacute ; B 69 0 329 936 ;\nC -1 ; WX 556 ; N agrave ; B 29 -14 527 750 ;\nC -1 ; WX 611 ; N Tcommaaccent ; B 14 -228 598 718 ;\nC -1 ; WX 722 ; N Cacute ; B 44 -19 684 936 ;\nC -1 ; WX 556 ; N atilde ; B 29 -14 527 737 ;\nC -1 ; WX 667 ; N Edotaccent ; B 76 0 621 915 ;\nC -1 ; WX 556 ; N scaron ; B 30 -14 519 750 ;\nC -1 ; WX 556 ; N scedilla ; B 30 -228 519 546 ;\nC -1 ; WX 278 ; N iacute ; B 69 0 329 750 ;\nC -1 ; WX 494 ; N lozenge ; B 10 0 484 745 ;\nC -1 ; WX 722 ; N Rcaron ; B 76 0 677 936 ;\nC -1 ; WX 778 ; N Gcommaaccent ; B 44 -228 713 737 ;\nC -1 ; WX 611 ; N ucircumflex ; B 66 -14 545 750 ;\nC -1 ; WX 556 ; N acircumflex ; B 29 -14 527 750 ;\nC -1 ; WX 722 ; N Amacron ; B 20 0 702 864 ;\nC -1 ; WX 389 ; N rcaron ; B 18 0 373 750 ;\nC -1 ; WX 556 ; N ccedilla ; B 34 -228 524 546 ;\nC -1 ; WX 611 ; N Zdotaccent ; B 25 0 586 915 ;\nC -1 ; WX 667 ; N Thorn ; B 76 0 627 718 ;\nC -1 ; WX 778 ; N Omacron ; B 44 -19 734 864 ;\nC -1 ; WX 722 ; N Racute ; B 76 0 677 936 ;\nC -1 ; WX 667 ; N Sacute ; B 39 -19 629 936 ;\nC -1 ; WX 743 ; N dcaron ; B 34 -14 750 718 ;\nC -1 ; WX 722 ; N Umacron ; B 72 -19 651 864 ;\nC -1 ; WX 611 ; N uring ; B 66 -14 545 776 ;\nC -1 ; WX 333 ; N threesuperior ; B 8 271 326 710 ;\nC -1 ; WX 778 ; N Ograve ; B 44 -19 734 936 ;\nC -1 ; WX 722 ; N Agrave ; B 20 0 702 936 ;\nC -1 ; WX 722 ; N Abreve ; B 20 0 702 936 ;\nC -1 ; WX 584 ; N multiply ; B 40 1 545 505 ;\nC -1 ; WX 611 ; N uacute ; B 66 -14 545 750 ;\nC -1 ; WX 611 ; N Tcaron ; B 14 0 598 936 ;\nC -1 ; WX 494 ; N partialdiff ; B 11 -21 494 750 ;\nC -1 ; WX 556 ; N ydieresis ; B 10 -214 539 729 ;\nC -1 ; WX 722 ; N Nacute ; B 69 0 654 936 ;\nC -1 ; WX 278 ; N icircumflex ; B -37 0 316 750 ;\nC -1 ; WX 667 ; N Ecircumflex ; B 76 0 621 936 ;\nC -1 ; WX 556 ; N adieresis ; B 29 -14 527 729 ;\nC -1 ; WX 556 ; N edieresis ; B 23 -14 528 729 ;\nC -1 ; WX 556 ; N cacute ; B 34 -14 524 750 ;\nC -1 ; WX 611 ; N nacute ; B 65 0 546 750 ;\nC -1 ; WX 611 ; N umacron ; B 66 -14 545 678 ;\nC -1 ; WX 722 ; N Ncaron ; B 69 0 654 936 ;\nC -1 ; WX 278 ; N Iacute ; B 64 0 329 936 ;\nC -1 ; WX 584 ; N plusminus ; B 40 0 544 506 ;\nC -1 ; WX 280 ; N brokenbar ; B 84 -150 196 700 ;\nC -1 ; WX 737 ; N registered ; B -11 -19 748 737 ;\nC -1 ; WX 778 ; N Gbreve ; B 44 -19 713 936 ;\nC -1 ; WX 278 ; N Idotaccent ; B 64 0 214 915 ;\nC -1 ; WX 600 ; N summation ; B 14 -10 585 706 ;\nC -1 ; WX 667 ; N Egrave ; B 76 0 621 936 ;\nC -1 ; WX 389 ; N racute ; B 64 0 384 750 ;\nC -1 ; WX 611 ; N omacron ; B 34 -14 578 678 ;\nC -1 ; WX 611 ; N Zacute ; B 25 0 586 936 ;\nC -1 ; WX 611 ; N Zcaron ; B 25 0 586 936 ;\nC -1 ; WX 549 ; N greaterequal ; B 26 0 523 704 ;\nC -1 ; WX 722 ; N Eth ; B -5 0 685 718 ;\nC -1 ; WX 722 ; N Ccedilla ; B 44 -228 684 737 ;\nC -1 ; WX 278 ; N lcommaaccent ; B 69 -228 213 718 ;\nC -1 ; WX 389 ; N tcaron ; B 10 -6 421 878 ;\nC -1 ; WX 556 ; N eogonek ; B 23 -228 528 546 ;\nC -1 ; WX 722 ; N Uogonek ; B 72 -228 651 718 ;\nC -1 ; WX 722 ; N Aacute ; B 20 0 702 936 ;\nC -1 ; WX 722 ; N Adieresis ; B 20 0 702 915 ;\nC -1 ; WX 556 ; N egrave ; B 23 -14 528 750 ;\nC -1 ; WX 500 ; N zacute ; B 20 0 480 750 ;\nC -1 ; WX 278 ; N iogonek ; B 16 -224 249 725 ;\nC -1 ; WX 778 ; N Oacute ; B 44 -19 734 936 ;\nC -1 ; WX 611 ; N oacute ; B 34 -14 578 750 ;\nC -1 ; WX 556 ; N amacron ; B 29 -14 527 678 ;\nC -1 ; WX 556 ; N sacute ; B 30 -14 519 750 ;\nC -1 ; WX 278 ; N idieresis ; B -21 0 300 729 ;\nC -1 ; WX 778 ; N Ocircumflex ; B 44 -19 734 936 ;\nC -1 ; WX 722 ; N Ugrave ; B 72 -19 651 936 ;\nC -1 ; WX 612 ; N Delta ; B 6 0 608 688 ;\nC -1 ; WX 611 ; N thorn ; B 62 -208 578 718 ;\nC -1 ; WX 333 ; N twosuperior ; B 9 283 324 710 ;\nC -1 ; WX 778 ; N Odieresis ; B 44 -19 734 915 ;\nC -1 ; WX 611 ; N mu ; B 66 -207 545 532 ;\nC -1 ; WX 278 ; N igrave ; B -50 0 209 750 ;\nC -1 ; WX 611 ; N ohungarumlaut ; B 34 -14 625 750 ;\nC -1 ; WX 667 ; N Eogonek ; B 76 -224 639 718 ;\nC -1 ; WX 611 ; N dcroat ; B 34 -14 650 718 ;\nC -1 ; WX 834 ; N threequarters ; B 16 -19 799 710 ;\nC -1 ; WX 667 ; N Scedilla ; B 39 -228 629 737 ;\nC -1 ; WX 400 ; N lcaron ; B 69 0 408 718 ;\nC -1 ; WX 722 ; N Kcommaaccent ; B 87 -228 722 718 ;\nC -1 ; WX 611 ; N Lacute ; B 76 0 583 936 ;\nC -1 ; WX 1000 ; N trademark ; B 44 306 956 718 ;\nC -1 ; WX 556 ; N edotaccent ; B 23 -14 528 729 ;\nC -1 ; WX 278 ; N Igrave ; B -50 0 214 936 ;\nC -1 ; WX 278 ; N Imacron ; B -33 0 312 864 ;\nC -1 ; WX 611 ; N Lcaron ; B 76 0 583 718 ;\nC -1 ; WX 834 ; N onehalf ; B 26 -19 794 710 ;\nC -1 ; WX 549 ; N lessequal ; B 29 0 526 704 ;\nC -1 ; WX 611 ; N ocircumflex ; B 34 -14 578 750 ;\nC -1 ; WX 611 ; N ntilde ; B 65 0 546 737 ;\nC -1 ; WX 722 ; N Uhungarumlaut ; B 72 -19 681 936 ;\nC -1 ; WX 667 ; N Eacute ; B 76 0 621 936 ;\nC -1 ; WX 556 ; N emacron ; B 23 -14 528 678 ;\nC -1 ; WX 611 ; N gbreve ; B 40 -217 553 750 ;\nC -1 ; WX 834 ; N onequarter ; B 26 -19 766 710 ;\nC -1 ; WX 667 ; N Scaron ; B 39 -19 629 936 ;\nC -1 ; WX 667 ; N Scommaaccent ; B 39 -228 629 737 ;\nC -1 ; WX 778 ; N Ohungarumlaut ; B 44 -19 734 936 ;\nC -1 ; WX 400 ; N degree ; B 57 426 343 712 ;\nC -1 ; WX 611 ; N ograve ; B 34 -14 578 750 ;\nC -1 ; WX 722 ; N Ccaron ; B 44 -19 684 936 ;\nC -1 ; WX 611 ; N ugrave ; B 66 -14 545 750 ;\nC -1 ; WX 549 ; N radical ; B 10 -46 512 850 ;\nC -1 ; WX 722 ; N Dcaron ; B 76 0 685 936 ;\nC -1 ; WX 389 ; N rcommaaccent ; B 64 -228 373 546 ;\nC -1 ; WX 722 ; N Ntilde ; B 69 0 654 923 ;\nC -1 ; WX 611 ; N otilde ; B 34 -14 578 737 ;\nC -1 ; WX 722 ; N Rcommaaccent ; B 76 -228 677 718 ;\nC -1 ; WX 611 ; N Lcommaaccent ; B 76 -228 583 718 ;\nC -1 ; WX 722 ; N Atilde ; B 20 0 702 923 ;\nC -1 ; WX 722 ; N Aogonek ; B 20 -224 742 718 ;\nC -1 ; WX 722 ; N Aring ; B 20 0 702 962 ;\nC -1 ; WX 778 ; N Otilde ; B 44 -19 734 923 ;\nC -1 ; WX 500 ; N zdotaccent ; B 20 0 480 729 ;\nC -1 ; WX 667 ; N Ecaron ; B 76 0 621 936 ;\nC -1 ; WX 278 ; N Iogonek ; B -11 -228 222 718 ;\nC -1 ; WX 556 ; N kcommaaccent ; B 69 -228 562 718 ;\nC -1 ; WX 584 ; N minus ; B 40 197 544 309 ;\nC -1 ; WX 278 ; N Icircumflex ; B -37 0 316 936 ;\nC -1 ; WX 611 ; N ncaron ; B 65 0 546 750 ;\nC -1 ; WX 333 ; N tcommaaccent ; B 10 -228 309 676 ;\nC -1 ; WX 584 ; N logicalnot ; B 40 108 544 419 ;\nC -1 ; WX 611 ; N odieresis ; B 34 -14 578 729 ;\nC -1 ; WX 611 ; N udieresis ; B 66 -14 545 729 ;\nC -1 ; WX 549 ; N notequal ; B 15 -49 540 570 ;\nC -1 ; WX 611 ; N gcommaaccent ; B 40 -217 553 850 ;\nC -1 ; WX 611 ; N eth ; B 34 -14 578 737 ;\nC -1 ; WX 500 ; N zcaron ; B 20 0 480 750 ;\nC -1 ; WX 611 ; N ncommaaccent ; B 65 -228 546 546 ;\nC -1 ; WX 333 ; N onesuperior ; B 26 283 237 710 ;\nC -1 ; WX 278 ; N imacron ; B -8 0 285 678 ;\nC -1 ; WX 556 ; N Euro ; B 0 0 0 0 ;\nEndCharMetrics\nStartKernData\nStartKernPairs 2481\nKPX A C -40\nKPX A Cacute -40\nKPX A Ccaron -40\nKPX A Ccedilla -40\nKPX A G -50\nKPX A Gbreve -50\nKPX A Gcommaaccent -50\nKPX A O -40\nKPX A Oacute -40\nKPX A Ocircumflex -40\nKPX A Odieresis -40\nKPX A Ograve -40\nKPX A Ohungarumlaut -40\nKPX A Omacron -40\nKPX A Oslash -40\nKPX A Otilde -40\nKPX A Q -40\nKPX A T -90\nKPX A Tcaron -90\nKPX A Tcommaaccent -90\nKPX A U -50\nKPX A Uacute -50\nKPX A Ucircumflex -50\nKPX A Udieresis -50\nKPX A Ugrave -50\nKPX A Uhungarumlaut -50\nKPX A Umacron -50\nKPX A Uogonek -50\nKPX A Uring -50\nKPX A V -80\nKPX A W -60\nKPX A Y -110\nKPX A Yacute -110\nKPX A Ydieresis -110\nKPX A u -30\nKPX A uacute -30\nKPX A ucircumflex -30\nKPX A udieresis -30\nKPX A ugrave -30\nKPX A uhungarumlaut -30\nKPX A umacron -30\nKPX A uogonek -30\nKPX A uring -30\nKPX A v -40\nKPX A w -30\nKPX A y -30\nKPX A yacute -30\nKPX A ydieresis -30\nKPX Aacute C -40\nKPX Aacute Cacute -40\nKPX Aacute Ccaron -40\nKPX Aacute Ccedilla -40\nKPX Aacute G -50\nKPX Aacute Gbreve -50\nKPX Aacute Gcommaaccent -50\nKPX Aacute O -40\nKPX Aacute Oacute -40\nKPX Aacute Ocircumflex -40\nKPX Aacute Odieresis -40\nKPX Aacute Ograve -40\nKPX Aacute Ohungarumlaut -40\nKPX Aacute Omacron -40\nKPX Aacute Oslash -40\nKPX Aacute Otilde -40\nKPX Aacute Q -40\nKPX Aacute T -90\nKPX Aacute Tcaron -90\nKPX Aacute Tcommaaccent -90\nKPX Aacute U -50\nKPX Aacute Uacute -50\nKPX Aacute Ucircumflex -50\nKPX Aacute Udieresis -50\nKPX Aacute Ugrave -50\nKPX Aacute Uhungarumlaut -50\nKPX Aacute Umacron -50\nKPX Aacute Uogonek -50\nKPX Aacute Uring -50\nKPX Aacute V -80\nKPX Aacute W -60\nKPX Aacute Y -110\nKPX Aacute Yacute -110\nKPX Aacute Ydieresis -110\nKPX Aacute u -30\nKPX Aacute uacute -30\nKPX Aacute ucircumflex -30\nKPX Aacute udieresis -30\nKPX Aacute ugrave -30\nKPX Aacute uhungarumlaut -30\nKPX Aacute umacron -30\nKPX Aacute uogonek -30\nKPX Aacute uring -30\nKPX Aacute v -40\nKPX Aacute w -30\nKPX Aacute y -30\nKPX Aacute yacute -30\nKPX Aacute ydieresis -30\nKPX Abreve C -40\nKPX Abreve Cacute -40\nKPX Abreve Ccaron -40\nKPX Abreve Ccedilla -40\nKPX Abreve G -50\nKPX Abreve Gbreve -50\nKPX Abreve Gcommaaccent -50\nKPX Abreve O -40\nKPX Abreve Oacute -40\nKPX Abreve Ocircumflex -40\nKPX Abreve Odieresis -40\nKPX Abreve Ograve -40\nKPX Abreve Ohungarumlaut -40\nKPX Abreve Omacron -40\nKPX Abreve Oslash -40\nKPX Abreve Otilde -40\nKPX Abreve Q -40\nKPX Abreve T -90\nKPX Abreve Tcaron -90\nKPX Abreve Tcommaaccent -90\nKPX Abreve U -50\nKPX Abreve Uacute -50\nKPX Abreve Ucircumflex -50\nKPX Abreve Udieresis -50\nKPX Abreve Ugrave -50\nKPX Abreve Uhungarumlaut -50\nKPX Abreve Umacron -50\nKPX Abreve Uogonek -50\nKPX Abreve Uring -50\nKPX Abreve V -80\nKPX Abreve W -60\nKPX Abreve Y -110\nKPX Abreve Yacute -110\nKPX Abreve Ydieresis -110\nKPX Abreve u -30\nKPX Abreve uacute -30\nKPX Abreve ucircumflex -30\nKPX Abreve udieresis -30\nKPX Abreve ugrave -30\nKPX Abreve uhungarumlaut -30\nKPX Abreve umacron -30\nKPX Abreve uogonek -30\nKPX Abreve uring -30\nKPX Abreve v -40\nKPX Abreve w -30\nKPX Abreve y -30\nKPX Abreve yacute -30\nKPX Abreve ydieresis -30\nKPX Acircumflex C -40\nKPX Acircumflex Cacute -40\nKPX Acircumflex Ccaron -40\nKPX Acircumflex Ccedilla -40\nKPX Acircumflex G -50\nKPX Acircumflex Gbreve -50\nKPX Acircumflex Gcommaaccent -50\nKPX Acircumflex O -40\nKPX Acircumflex Oacute -40\nKPX Acircumflex Ocircumflex -40\nKPX Acircumflex Odieresis -40\nKPX Acircumflex Ograve -40\nKPX Acircumflex Ohungarumlaut -40\nKPX Acircumflex Omacron -40\nKPX Acircumflex Oslash -40\nKPX Acircumflex Otilde -40\nKPX Acircumflex Q -40\nKPX Acircumflex T -90\nKPX Acircumflex Tcaron -90\nKPX Acircumflex Tcommaaccent -90\nKPX Acircumflex U -50\nKPX Acircumflex Uacute -50\nKPX Acircumflex Ucircumflex -50\nKPX Acircumflex Udieresis -50\nKPX Acircumflex Ugrave -50\nKPX Acircumflex Uhungarumlaut -50\nKPX Acircumflex Umacron -50\nKPX Acircumflex Uogonek -50\nKPX Acircumflex Uring -50\nKPX Acircumflex V -80\nKPX Acircumflex W -60\nKPX Acircumflex Y -110\nKPX Acircumflex Yacute -110\nKPX Acircumflex Ydieresis -110\nKPX Acircumflex u -30\nKPX Acircumflex uacute -30\nKPX Acircumflex ucircumflex -30\nKPX Acircumflex udieresis -30\nKPX Acircumflex ugrave -30\nKPX Acircumflex uhungarumlaut -30\nKPX Acircumflex umacron -30\nKPX Acircumflex uogonek -30\nKPX Acircumflex uring -30\nKPX Acircumflex v -40\nKPX Acircumflex w -30\nKPX Acircumflex y -30\nKPX Acircumflex yacute -30\nKPX Acircumflex ydieresis -30\nKPX Adieresis C -40\nKPX Adieresis Cacute -40\nKPX Adieresis Ccaron -40\nKPX Adieresis Ccedilla -40\nKPX Adieresis G -50\nKPX Adieresis Gbreve -50\nKPX Adieresis Gcommaaccent -50\nKPX Adieresis O -40\nKPX Adieresis Oacute -40\nKPX Adieresis Ocircumflex -40\nKPX Adieresis Odieresis -40\nKPX Adieresis Ograve -40\nKPX Adieresis Ohungarumlaut -40\nKPX Adieresis Omacron -40\nKPX Adieresis Oslash -40\nKPX Adieresis Otilde -40\nKPX Adieresis Q -40\nKPX Adieresis T -90\nKPX Adieresis Tcaron -90\nKPX Adieresis Tcommaaccent -90\nKPX Adieresis U -50\nKPX Adieresis Uacute -50\nKPX Adieresis Ucircumflex -50\nKPX Adieresis Udieresis -50\nKPX Adieresis Ugrave -50\nKPX Adieresis Uhungarumlaut -50\nKPX Adieresis Umacron -50\nKPX Adieresis Uogonek -50\nKPX Adieresis Uring -50\nKPX Adieresis V -80\nKPX Adieresis W -60\nKPX Adieresis Y -110\nKPX Adieresis Yacute -110\nKPX Adieresis Ydieresis -110\nKPX Adieresis u -30\nKPX Adieresis uacute -30\nKPX Adieresis ucircumflex -30\nKPX Adieresis udieresis -30\nKPX Adieresis ugrave -30\nKPX Adieresis uhungarumlaut -30\nKPX Adieresis umacron -30\nKPX Adieresis uogonek -30\nKPX Adieresis uring -30\nKPX Adieresis v -40\nKPX Adieresis w -30\nKPX Adieresis y -30\nKPX Adieresis yacute -30\nKPX Adieresis ydieresis -30\nKPX Agrave C -40\nKPX Agrave Cacute -40\nKPX Agrave Ccaron -40\nKPX Agrave Ccedilla -40\nKPX Agrave G -50\nKPX Agrave Gbreve -50\nKPX Agrave Gcommaaccent -50\nKPX Agrave O -40\nKPX Agrave Oacute -40\nKPX Agrave Ocircumflex -40\nKPX Agrave Odieresis -40\nKPX Agrave Ograve -40\nKPX Agrave Ohungarumlaut -40\nKPX Agrave Omacron -40\nKPX Agrave Oslash -40\nKPX Agrave Otilde -40\nKPX Agrave Q -40\nKPX Agrave T -90\nKPX Agrave Tcaron -90\nKPX Agrave Tcommaaccent -90\nKPX Agrave U -50\nKPX Agrave Uacute -50\nKPX Agrave Ucircumflex -50\nKPX Agrave Udieresis -50\nKPX Agrave Ugrave -50\nKPX Agrave Uhungarumlaut -50\nKPX Agrave Umacron -50\nKPX Agrave Uogonek -50\nKPX Agrave Uring -50\nKPX Agrave V -80\nKPX Agrave W -60\nKPX Agrave Y -110\nKPX Agrave Yacute -110\nKPX Agrave Ydieresis -110\nKPX Agrave u -30\nKPX Agrave uacute -30\nKPX Agrave ucircumflex -30\nKPX Agrave udieresis -30\nKPX Agrave ugrave -30\nKPX Agrave uhungarumlaut -30\nKPX Agrave umacron -30\nKPX Agrave uogonek -30\nKPX Agrave uring -30\nKPX Agrave v -40\nKPX Agrave w -30\nKPX Agrave y -30\nKPX Agrave yacute -30\nKPX Agrave ydieresis -30\nKPX Amacron C -40\nKPX Amacron Cacute -40\nKPX Amacron Ccaron -40\nKPX Amacron Ccedilla -40\nKPX Amacron G -50\nKPX Amacron Gbreve -50\nKPX Amacron Gcommaaccent -50\nKPX Amacron O -40\nKPX Amacron Oacute -40\nKPX Amacron Ocircumflex -40\nKPX Amacron Odieresis -40\nKPX Amacron Ograve -40\nKPX Amacron Ohungarumlaut -40\nKPX Amacron Omacron -40\nKPX Amacron Oslash -40\nKPX Amacron Otilde -40\nKPX Amacron Q -40\nKPX Amacron T -90\nKPX Amacron Tcaron -90\nKPX Amacron Tcommaaccent -90\nKPX Amacron U -50\nKPX Amacron Uacute -50\nKPX Amacron Ucircumflex -50\nKPX Amacron Udieresis -50\nKPX Amacron Ugrave -50\nKPX Amacron Uhungarumlaut -50\nKPX Amacron Umacron -50\nKPX Amacron Uogonek -50\nKPX Amacron Uring -50\nKPX Amacron V -80\nKPX Amacron W -60\nKPX Amacron Y -110\nKPX Amacron Yacute -110\nKPX Amacron Ydieresis -110\nKPX Amacron u -30\nKPX Amacron uacute -30\nKPX Amacron ucircumflex -30\nKPX Amacron udieresis -30\nKPX Amacron ugrave -30\nKPX Amacron uhungarumlaut -30\nKPX Amacron umacron -30\nKPX Amacron uogonek -30\nKPX Amacron uring -30\nKPX Amacron v -40\nKPX Amacron w -30\nKPX Amacron y -30\nKPX Amacron yacute -30\nKPX Amacron ydieresis -30\nKPX Aogonek C -40\nKPX Aogonek Cacute -40\nKPX Aogonek Ccaron -40\nKPX Aogonek Ccedilla -40\nKPX Aogonek G -50\nKPX Aogonek Gbreve -50\nKPX Aogonek Gcommaaccent -50\nKPX Aogonek O -40\nKPX Aogonek Oacute -40\nKPX Aogonek Ocircumflex -40\nKPX Aogonek Odieresis -40\nKPX Aogonek Ograve -40\nKPX Aogonek Ohungarumlaut -40\nKPX Aogonek Omacron -40\nKPX Aogonek Oslash -40\nKPX Aogonek Otilde -40\nKPX Aogonek Q -40\nKPX Aogonek T -90\nKPX Aogonek Tcaron -90\nKPX Aogonek Tcommaaccent -90\nKPX Aogonek U -50\nKPX Aogonek Uacute -50\nKPX Aogonek Ucircumflex -50\nKPX Aogonek Udieresis -50\nKPX Aogonek Ugrave -50\nKPX Aogonek Uhungarumlaut -50\nKPX Aogonek Umacron -50\nKPX Aogonek Uogonek -50\nKPX Aogonek Uring -50\nKPX Aogonek V -80\nKPX Aogonek W -60\nKPX Aogonek Y -110\nKPX Aogonek Yacute -110\nKPX Aogonek Ydieresis -110\nKPX Aogonek u -30\nKPX Aogonek uacute -30\nKPX Aogonek ucircumflex -30\nKPX Aogonek udieresis -30\nKPX Aogonek ugrave -30\nKPX Aogonek uhungarumlaut -30\nKPX Aogonek umacron -30\nKPX Aogonek uogonek -30\nKPX Aogonek uring -30\nKPX Aogonek v -40\nKPX Aogonek w -30\nKPX Aogonek y -30\nKPX Aogonek yacute -30\nKPX Aogonek ydieresis -30\nKPX Aring C -40\nKPX Aring Cacute -40\nKPX Aring Ccaron -40\nKPX Aring Ccedilla -40\nKPX Aring G -50\nKPX Aring Gbreve -50\nKPX Aring Gcommaaccent -50\nKPX Aring O -40\nKPX Aring Oacute -40\nKPX Aring Ocircumflex -40\nKPX Aring Odieresis -40\nKPX Aring Ograve -40\nKPX Aring Ohungarumlaut -40\nKPX Aring Omacron -40\nKPX Aring Oslash -40\nKPX Aring Otilde -40\nKPX Aring Q -40\nKPX Aring T -90\nKPX Aring Tcaron -90\nKPX Aring Tcommaaccent -90\nKPX Aring U -50\nKPX Aring Uacute -50\nKPX Aring Ucircumflex -50\nKPX Aring Udieresis -50\nKPX Aring Ugrave -50\nKPX Aring Uhungarumlaut -50\nKPX Aring Umacron -50\nKPX Aring Uogonek -50\nKPX Aring Uring -50\nKPX Aring V -80\nKPX Aring W -60\nKPX Aring Y -110\nKPX Aring Yacute -110\nKPX Aring Ydieresis -110\nKPX Aring u -30\nKPX Aring uacute -30\nKPX Aring ucircumflex -30\nKPX Aring udieresis -30\nKPX Aring ugrave -30\nKPX Aring uhungarumlaut -30\nKPX Aring umacron -30\nKPX Aring uogonek -30\nKPX Aring uring -30\nKPX Aring v -40\nKPX Aring w -30\nKPX Aring y -30\nKPX Aring yacute -30\nKPX Aring ydieresis -30\nKPX Atilde C -40\nKPX Atilde Cacute -40\nKPX Atilde Ccaron -40\nKPX Atilde Ccedilla -40\nKPX Atilde G -50\nKPX Atilde Gbreve -50\nKPX Atilde Gcommaaccent -50\nKPX Atilde O -40\nKPX Atilde Oacute -40\nKPX Atilde Ocircumflex -40\nKPX Atilde Odieresis -40\nKPX Atilde Ograve -40\nKPX Atilde Ohungarumlaut -40\nKPX Atilde Omacron -40\nKPX Atilde Oslash -40\nKPX Atilde Otilde -40\nKPX Atilde Q -40\nKPX Atilde T -90\nKPX Atilde Tcaron -90\nKPX Atilde Tcommaaccent -90\nKPX Atilde U -50\nKPX Atilde Uacute -50\nKPX Atilde Ucircumflex -50\nKPX Atilde Udieresis -50\nKPX Atilde Ugrave -50\nKPX Atilde Uhungarumlaut -50\nKPX Atilde Umacron -50\nKPX Atilde Uogonek -50\nKPX Atilde Uring -50\nKPX Atilde V -80\nKPX Atilde W -60\nKPX Atilde Y -110\nKPX Atilde Yacute -110\nKPX Atilde Ydieresis -110\nKPX Atilde u -30\nKPX Atilde uacute -30\nKPX Atilde ucircumflex -30\nKPX Atilde udieresis -30\nKPX Atilde ugrave -30\nKPX Atilde uhungarumlaut -30\nKPX Atilde umacron -30\nKPX Atilde uogonek -30\nKPX Atilde uring -30\nKPX Atilde v -40\nKPX Atilde w -30\nKPX Atilde y -30\nKPX Atilde yacute -30\nKPX Atilde ydieresis -30\nKPX B A -30\nKPX B Aacute -30\nKPX B Abreve -30\nKPX B Acircumflex -30\nKPX B Adieresis -30\nKPX B Agrave -30\nKPX B Amacron -30\nKPX B Aogonek -30\nKPX B Aring -30\nKPX B Atilde -30\nKPX B U -10\nKPX B Uacute -10\nKPX B Ucircumflex -10\nKPX B Udieresis -10\nKPX B Ugrave -10\nKPX B Uhungarumlaut -10\nKPX B Umacron -10\nKPX B Uogonek -10\nKPX B Uring -10\nKPX D A -40\nKPX D Aacute -40\nKPX D Abreve -40\nKPX D Acircumflex -40\nKPX D Adieresis -40\nKPX D Agrave -40\nKPX D Amacron -40\nKPX D Aogonek -40\nKPX D Aring -40\nKPX D Atilde -40\nKPX D V -40\nKPX D W -40\nKPX D Y -70\nKPX D Yacute -70\nKPX D Ydieresis -70\nKPX D comma -30\nKPX D period -30\nKPX Dcaron A -40\nKPX Dcaron Aacute -40\nKPX Dcaron Abreve -40\nKPX Dcaron Acircumflex -40\nKPX Dcaron Adieresis -40\nKPX Dcaron Agrave -40\nKPX Dcaron Amacron -40\nKPX Dcaron Aogonek -40\nKPX Dcaron Aring -40\nKPX Dcaron Atilde -40\nKPX Dcaron V -40\nKPX Dcaron W -40\nKPX Dcaron Y -70\nKPX Dcaron Yacute -70\nKPX Dcaron Ydieresis -70\nKPX Dcaron comma -30\nKPX Dcaron period -30\nKPX Dcroat A -40\nKPX Dcroat Aacute -40\nKPX Dcroat Abreve -40\nKPX Dcroat Acircumflex -40\nKPX Dcroat Adieresis -40\nKPX Dcroat Agrave -40\nKPX Dcroat Amacron -40\nKPX Dcroat Aogonek -40\nKPX Dcroat Aring -40\nKPX Dcroat Atilde -40\nKPX Dcroat V -40\nKPX Dcroat W -40\nKPX Dcroat Y -70\nKPX Dcroat Yacute -70\nKPX Dcroat Ydieresis -70\nKPX Dcroat comma -30\nKPX Dcroat period -30\nKPX F A -80\nKPX F Aacute -80\nKPX F Abreve -80\nKPX F Acircumflex -80\nKPX F Adieresis -80\nKPX F Agrave -80\nKPX F Amacron -80\nKPX F Aogonek -80\nKPX F Aring -80\nKPX F Atilde -80\nKPX F a -20\nKPX F aacute -20\nKPX F abreve -20\nKPX F acircumflex -20\nKPX F adieresis -20\nKPX F agrave -20\nKPX F amacron -20\nKPX F aogonek -20\nKPX F aring -20\nKPX F atilde -20\nKPX F comma -100\nKPX F period -100\nKPX J A -20\nKPX J Aacute -20\nKPX J Abreve -20\nKPX J Acircumflex -20\nKPX J Adieresis -20\nKPX J Agrave -20\nKPX J Amacron -20\nKPX J Aogonek -20\nKPX J Aring -20\nKPX J Atilde -20\nKPX J comma -20\nKPX J period -20\nKPX J u -20\nKPX J uacute -20\nKPX J ucircumflex -20\nKPX J udieresis -20\nKPX J ugrave -20\nKPX J uhungarumlaut -20\nKPX J umacron -20\nKPX J uogonek -20\nKPX J uring -20\nKPX K O -30\nKPX K Oacute -30\nKPX K Ocircumflex -30\nKPX K Odieresis -30\nKPX K Ograve -30\nKPX K Ohungarumlaut -30\nKPX K Omacron -30\nKPX K Oslash -30\nKPX K Otilde -30\nKPX K e -15\nKPX K eacute -15\nKPX K ecaron -15\nKPX K ecircumflex -15\nKPX K edieresis -15\nKPX K edotaccent -15\nKPX K egrave -15\nKPX K emacron -15\nKPX K eogonek -15\nKPX K o -35\nKPX K oacute -35\nKPX K ocircumflex -35\nKPX K odieresis -35\nKPX K ograve -35\nKPX K ohungarumlaut -35\nKPX K omacron -35\nKPX K oslash -35\nKPX K otilde -35\nKPX K u -30\nKPX K uacute -30\nKPX K ucircumflex -30\nKPX K udieresis -30\nKPX K ugrave -30\nKPX K uhungarumlaut -30\nKPX K umacron -30\nKPX K uogonek -30\nKPX K uring -30\nKPX K y -40\nKPX K yacute -40\nKPX K ydieresis -40\nKPX Kcommaaccent O -30\nKPX Kcommaaccent Oacute -30\nKPX Kcommaaccent Ocircumflex -30\nKPX Kcommaaccent Odieresis -30\nKPX Kcommaaccent Ograve -30\nKPX Kcommaaccent Ohungarumlaut -30\nKPX Kcommaaccent Omacron -30\nKPX Kcommaaccent Oslash -30\nKPX Kcommaaccent Otilde -30\nKPX Kcommaaccent e -15\nKPX Kcommaaccent eacute -15\nKPX Kcommaaccent ecaron -15\nKPX Kcommaaccent ecircumflex -15\nKPX Kcommaaccent edieresis -15\nKPX Kcommaaccent edotaccent -15\nKPX Kcommaaccent egrave -15\nKPX Kcommaaccent emacron -15\nKPX Kcommaaccent eogonek -15\nKPX Kcommaaccent o -35\nKPX Kcommaaccent oacute -35\nKPX Kcommaaccent ocircumflex -35\nKPX Kcommaaccent odieresis -35\nKPX Kcommaaccent ograve -35\nKPX Kcommaaccent ohungarumlaut -35\nKPX Kcommaaccent omacron -35\nKPX Kcommaaccent oslash -35\nKPX Kcommaaccent otilde -35\nKPX Kcommaaccent u -30\nKPX Kcommaaccent uacute -30\nKPX Kcommaaccent ucircumflex -30\nKPX Kcommaaccent udieresis -30\nKPX Kcommaaccent ugrave -30\nKPX Kcommaaccent uhungarumlaut -30\nKPX Kcommaaccent umacron -30\nKPX Kcommaaccent uogonek -30\nKPX Kcommaaccent uring -30\nKPX Kcommaaccent y -40\nKPX Kcommaaccent yacute -40\nKPX Kcommaaccent ydieresis -40\nKPX L T -90\nKPX L Tcaron -90\nKPX L Tcommaaccent -90\nKPX L V -110\nKPX L W -80\nKPX L Y -120\nKPX L Yacute -120\nKPX L Ydieresis -120\nKPX L quotedblright -140\nKPX L quoteright -140\nKPX L y -30\nKPX L yacute -30\nKPX L ydieresis -30\nKPX Lacute T -90\nKPX Lacute Tcaron -90\nKPX Lacute Tcommaaccent -90\nKPX Lacute V -110\nKPX Lacute W -80\nKPX Lacute Y -120\nKPX Lacute Yacute -120\nKPX Lacute Ydieresis -120\nKPX Lacute quotedblright -140\nKPX Lacute quoteright -140\nKPX Lacute y -30\nKPX Lacute yacute -30\nKPX Lacute ydieresis -30\nKPX Lcommaaccent T -90\nKPX Lcommaaccent Tcaron -90\nKPX Lcommaaccent Tcommaaccent -90\nKPX Lcommaaccent V -110\nKPX Lcommaaccent W -80\nKPX Lcommaaccent Y -120\nKPX Lcommaaccent Yacute -120\nKPX Lcommaaccent Ydieresis -120\nKPX Lcommaaccent quotedblright -140\nKPX Lcommaaccent quoteright -140\nKPX Lcommaaccent y -30\nKPX Lcommaaccent yacute -30\nKPX Lcommaaccent ydieresis -30\nKPX Lslash T -90\nKPX Lslash Tcaron -90\nKPX Lslash Tcommaaccent -90\nKPX Lslash V -110\nKPX Lslash W -80\nKPX Lslash Y -120\nKPX Lslash Yacute -120\nKPX Lslash Ydieresis -120\nKPX Lslash quotedblright -140\nKPX Lslash quoteright -140\nKPX Lslash y -30\nKPX Lslash yacute -30\nKPX Lslash ydieresis -30\nKPX O A -50\nKPX O Aacute -50\nKPX O Abreve -50\nKPX O Acircumflex -50\nKPX O Adieresis -50\nKPX O Agrave -50\nKPX O Amacron -50\nKPX O Aogonek -50\nKPX O Aring -50\nKPX O Atilde -50\nKPX O T -40\nKPX O Tcaron -40\nKPX O Tcommaaccent -40\nKPX O V -50\nKPX O W -50\nKPX O X -50\nKPX O Y -70\nKPX O Yacute -70\nKPX O Ydieresis -70\nKPX O comma -40\nKPX O period -40\nKPX Oacute A -50\nKPX Oacute Aacute -50\nKPX Oacute Abreve -50\nKPX Oacute Acircumflex -50\nKPX Oacute Adieresis -50\nKPX Oacute Agrave -50\nKPX Oacute Amacron -50\nKPX Oacute Aogonek -50\nKPX Oacute Aring -50\nKPX Oacute Atilde -50\nKPX Oacute T -40\nKPX Oacute Tcaron -40\nKPX Oacute Tcommaaccent -40\nKPX Oacute V -50\nKPX Oacute W -50\nKPX Oacute X -50\nKPX Oacute Y -70\nKPX Oacute Yacute -70\nKPX Oacute Ydieresis -70\nKPX Oacute comma -40\nKPX Oacute period -40\nKPX Ocircumflex A -50\nKPX Ocircumflex Aacute -50\nKPX Ocircumflex Abreve -50\nKPX Ocircumflex Acircumflex -50\nKPX Ocircumflex Adieresis -50\nKPX Ocircumflex Agrave -50\nKPX Ocircumflex Amacron -50\nKPX Ocircumflex Aogonek -50\nKPX Ocircumflex Aring -50\nKPX Ocircumflex Atilde -50\nKPX Ocircumflex T -40\nKPX Ocircumflex Tcaron -40\nKPX Ocircumflex Tcommaaccent -40\nKPX Ocircumflex V -50\nKPX Ocircumflex W -50\nKPX Ocircumflex X -50\nKPX Ocircumflex Y -70\nKPX Ocircumflex Yacute -70\nKPX Ocircumflex Ydieresis -70\nKPX Ocircumflex comma -40\nKPX Ocircumflex period -40\nKPX Odieresis A -50\nKPX Odieresis Aacute -50\nKPX Odieresis Abreve -50\nKPX Odieresis Acircumflex -50\nKPX Odieresis Adieresis -50\nKPX Odieresis Agrave -50\nKPX Odieresis Amacron -50\nKPX Odieresis Aogonek -50\nKPX Odieresis Aring -50\nKPX Odieresis Atilde -50\nKPX Odieresis T -40\nKPX Odieresis Tcaron -40\nKPX Odieresis Tcommaaccent -40\nKPX Odieresis V -50\nKPX Odieresis W -50\nKPX Odieresis X -50\nKPX Odieresis Y -70\nKPX Odieresis Yacute -70\nKPX Odieresis Ydieresis -70\nKPX Odieresis comma -40\nKPX Odieresis period -40\nKPX Ograve A -50\nKPX Ograve Aacute -50\nKPX Ograve Abreve -50\nKPX Ograve Acircumflex -50\nKPX Ograve Adieresis -50\nKPX Ograve Agrave -50\nKPX Ograve Amacron -50\nKPX Ograve Aogonek -50\nKPX Ograve Aring -50\nKPX Ograve Atilde -50\nKPX Ograve T -40\nKPX Ograve Tcaron -40\nKPX Ograve Tcommaaccent -40\nKPX Ograve V -50\nKPX Ograve W -50\nKPX Ograve X -50\nKPX Ograve Y -70\nKPX Ograve Yacute -70\nKPX Ograve Ydieresis -70\nKPX Ograve comma -40\nKPX Ograve period -40\nKPX Ohungarumlaut A -50\nKPX Ohungarumlaut Aacute -50\nKPX Ohungarumlaut Abreve -50\nKPX Ohungarumlaut Acircumflex -50\nKPX Ohungarumlaut Adieresis -50\nKPX Ohungarumlaut Agrave -50\nKPX Ohungarumlaut Amacron -50\nKPX Ohungarumlaut Aogonek -50\nKPX Ohungarumlaut Aring -50\nKPX Ohungarumlaut Atilde -50\nKPX Ohungarumlaut T -40\nKPX Ohungarumlaut Tcaron -40\nKPX Ohungarumlaut Tcommaaccent -40\nKPX Ohungarumlaut V -50\nKPX Ohungarumlaut W -50\nKPX Ohungarumlaut X -50\nKPX Ohungarumlaut Y -70\nKPX Ohungarumlaut Yacute -70\nKPX Ohungarumlaut Ydieresis -70\nKPX Ohungarumlaut comma -40\nKPX Ohungarumlaut period -40\nKPX Omacron A -50\nKPX Omacron Aacute -50\nKPX Omacron Abreve -50\nKPX Omacron Acircumflex -50\nKPX Omacron Adieresis -50\nKPX Omacron Agrave -50\nKPX Omacron Amacron -50\nKPX Omacron Aogonek -50\nKPX Omacron Aring -50\nKPX Omacron Atilde -50\nKPX Omacron T -40\nKPX Omacron Tcaron -40\nKPX Omacron Tcommaaccent -40\nKPX Omacron V -50\nKPX Omacron W -50\nKPX Omacron X -50\nKPX Omacron Y -70\nKPX Omacron Yacute -70\nKPX Omacron Ydieresis -70\nKPX Omacron comma -40\nKPX Omacron period -40\nKPX Oslash A -50\nKPX Oslash Aacute -50\nKPX Oslash Abreve -50\nKPX Oslash Acircumflex -50\nKPX Oslash Adieresis -50\nKPX Oslash Agrave -50\nKPX Oslash Amacron -50\nKPX Oslash Aogonek -50\nKPX Oslash Aring -50\nKPX Oslash Atilde -50\nKPX Oslash T -40\nKPX Oslash Tcaron -40\nKPX Oslash Tcommaaccent -40\nKPX Oslash V -50\nKPX Oslash W -50\nKPX Oslash X -50\nKPX Oslash Y -70\nKPX Oslash Yacute -70\nKPX Oslash Ydieresis -70\nKPX Oslash comma -40\nKPX Oslash period -40\nKPX Otilde A -50\nKPX Otilde Aacute -50\nKPX Otilde Abreve -50\nKPX Otilde Acircumflex -50\nKPX Otilde Adieresis -50\nKPX Otilde Agrave -50\nKPX Otilde Amacron -50\nKPX Otilde Aogonek -50\nKPX Otilde Aring -50\nKPX Otilde Atilde -50\nKPX Otilde T -40\nKPX Otilde Tcaron -40\nKPX Otilde Tcommaaccent -40\nKPX Otilde V -50\nKPX Otilde W -50\nKPX Otilde X -50\nKPX Otilde Y -70\nKPX Otilde Yacute -70\nKPX Otilde Ydieresis -70\nKPX Otilde comma -40\nKPX Otilde period -40\nKPX P A -100\nKPX P Aacute -100\nKPX P Abreve -100\nKPX P Acircumflex -100\nKPX P Adieresis -100\nKPX P Agrave -100\nKPX P Amacron -100\nKPX P Aogonek -100\nKPX P Aring -100\nKPX P Atilde -100\nKPX P a -30\nKPX P aacute -30\nKPX P abreve -30\nKPX P acircumflex -30\nKPX P adieresis -30\nKPX P agrave -30\nKPX P amacron -30\nKPX P aogonek -30\nKPX P aring -30\nKPX P atilde -30\nKPX P comma -120\nKPX P e -30\nKPX P eacute -30\nKPX P ecaron -30\nKPX P ecircumflex -30\nKPX P edieresis -30\nKPX P edotaccent -30\nKPX P egrave -30\nKPX P emacron -30\nKPX P eogonek -30\nKPX P o -40\nKPX P oacute -40\nKPX P ocircumflex -40\nKPX P odieresis -40\nKPX P ograve -40\nKPX P ohungarumlaut -40\nKPX P omacron -40\nKPX P oslash -40\nKPX P otilde -40\nKPX P period -120\nKPX Q U -10\nKPX Q Uacute -10\nKPX Q Ucircumflex -10\nKPX Q Udieresis -10\nKPX Q Ugrave -10\nKPX Q Uhungarumlaut -10\nKPX Q Umacron -10\nKPX Q Uogonek -10\nKPX Q Uring -10\nKPX Q comma 20\nKPX Q period 20\nKPX R O -20\nKPX R Oacute -20\nKPX R Ocircumflex -20\nKPX R Odieresis -20\nKPX R Ograve -20\nKPX R Ohungarumlaut -20\nKPX R Omacron -20\nKPX R Oslash -20\nKPX R Otilde -20\nKPX R T -20\nKPX R Tcaron -20\nKPX R Tcommaaccent -20\nKPX R U -20\nKPX R Uacute -20\nKPX R Ucircumflex -20\nKPX R Udieresis -20\nKPX R Ugrave -20\nKPX R Uhungarumlaut -20\nKPX R Umacron -20\nKPX R Uogonek -20\nKPX R Uring -20\nKPX R V -50\nKPX R W -40\nKPX R Y -50\nKPX R Yacute -50\nKPX R Ydieresis -50\nKPX Racute O -20\nKPX Racute Oacute -20\nKPX Racute Ocircumflex -20\nKPX Racute Odieresis -20\nKPX Racute Ograve -20\nKPX Racute Ohungarumlaut -20\nKPX Racute Omacron -20\nKPX Racute Oslash -20\nKPX Racute Otilde -20\nKPX Racute T -20\nKPX Racute Tcaron -20\nKPX Racute Tcommaaccent -20\nKPX Racute U -20\nKPX Racute Uacute -20\nKPX Racute Ucircumflex -20\nKPX Racute Udieresis -20\nKPX Racute Ugrave -20\nKPX Racute Uhungarumlaut -20\nKPX Racute Umacron -20\nKPX Racute Uogonek -20\nKPX Racute Uring -20\nKPX Racute V -50\nKPX Racute W -40\nKPX Racute Y -50\nKPX Racute Yacute -50\nKPX Racute Ydieresis -50\nKPX Rcaron O -20\nKPX Rcaron Oacute -20\nKPX Rcaron Ocircumflex -20\nKPX Rcaron Odieresis -20\nKPX Rcaron Ograve -20\nKPX Rcaron Ohungarumlaut -20\nKPX Rcaron Omacron -20\nKPX Rcaron Oslash -20\nKPX Rcaron Otilde -20\nKPX Rcaron T -20\nKPX Rcaron Tcaron -20\nKPX Rcaron Tcommaaccent -20\nKPX Rcaron U -20\nKPX Rcaron Uacute -20\nKPX Rcaron Ucircumflex -20\nKPX Rcaron Udieresis -20\nKPX Rcaron Ugrave -20\nKPX Rcaron Uhungarumlaut -20\nKPX Rcaron Umacron -20\nKPX Rcaron Uogonek -20\nKPX Rcaron Uring -20\nKPX Rcaron V -50\nKPX Rcaron W -40\nKPX Rcaron Y -50\nKPX Rcaron Yacute -50\nKPX Rcaron Ydieresis -50\nKPX Rcommaaccent O -20\nKPX Rcommaaccent Oacute -20\nKPX Rcommaaccent Ocircumflex -20\nKPX Rcommaaccent Odieresis -20\nKPX Rcommaaccent Ograve -20\nKPX Rcommaaccent Ohungarumlaut -20\nKPX Rcommaaccent Omacron -20\nKPX Rcommaaccent Oslash -20\nKPX Rcommaaccent Otilde -20\nKPX Rcommaaccent T -20\nKPX Rcommaaccent Tcaron -20\nKPX Rcommaaccent Tcommaaccent -20\nKPX Rcommaaccent U -20\nKPX Rcommaaccent Uacute -20\nKPX Rcommaaccent Ucircumflex -20\nKPX Rcommaaccent Udieresis -20\nKPX Rcommaaccent Ugrave -20\nKPX Rcommaaccent Uhungarumlaut -20\nKPX Rcommaaccent Umacron -20\nKPX Rcommaaccent Uogonek -20\nKPX Rcommaaccent Uring -20\nKPX Rcommaaccent V -50\nKPX Rcommaaccent W -40\nKPX Rcommaaccent Y -50\nKPX Rcommaaccent Yacute -50\nKPX Rcommaaccent Ydieresis -50\nKPX T A -90\nKPX T Aacute -90\nKPX T Abreve -90\nKPX T Acircumflex -90\nKPX T Adieresis -90\nKPX T Agrave -90\nKPX T Amacron -90\nKPX T Aogonek -90\nKPX T Aring -90\nKPX T Atilde -90\nKPX T O -40\nKPX T Oacute -40\nKPX T Ocircumflex -40\nKPX T Odieresis -40\nKPX T Ograve -40\nKPX T Ohungarumlaut -40\nKPX T Omacron -40\nKPX T Oslash -40\nKPX T Otilde -40\nKPX T a -80\nKPX T aacute -80\nKPX T abreve -80\nKPX T acircumflex -80\nKPX T adieresis -80\nKPX T agrave -80\nKPX T amacron -80\nKPX T aogonek -80\nKPX T aring -80\nKPX T atilde -80\nKPX T colon -40\nKPX T comma -80\nKPX T e -60\nKPX T eacute -60\nKPX T ecaron -60\nKPX T ecircumflex -60\nKPX T edieresis -60\nKPX T edotaccent -60\nKPX T egrave -60\nKPX T emacron -60\nKPX T eogonek -60\nKPX T hyphen -120\nKPX T o -80\nKPX T oacute -80\nKPX T ocircumflex -80\nKPX T odieresis -80\nKPX T ograve -80\nKPX T ohungarumlaut -80\nKPX T omacron -80\nKPX T oslash -80\nKPX T otilde -80\nKPX T period -80\nKPX T r -80\nKPX T racute -80\nKPX T rcommaaccent -80\nKPX T semicolon -40\nKPX T u -90\nKPX T uacute -90\nKPX T ucircumflex -90\nKPX T udieresis -90\nKPX T ugrave -90\nKPX T uhungarumlaut -90\nKPX T umacron -90\nKPX T uogonek -90\nKPX T uring -90\nKPX T w -60\nKPX T y -60\nKPX T yacute -60\nKPX T ydieresis -60\nKPX Tcaron A -90\nKPX Tcaron Aacute -90\nKPX Tcaron Abreve -90\nKPX Tcaron Acircumflex -90\nKPX Tcaron Adieresis -90\nKPX Tcaron Agrave -90\nKPX Tcaron Amacron -90\nKPX Tcaron Aogonek -90\nKPX Tcaron Aring -90\nKPX Tcaron Atilde -90\nKPX Tcaron O -40\nKPX Tcaron Oacute -40\nKPX Tcaron Ocircumflex -40\nKPX Tcaron Odieresis -40\nKPX Tcaron Ograve -40\nKPX Tcaron Ohungarumlaut -40\nKPX Tcaron Omacron -40\nKPX Tcaron Oslash -40\nKPX Tcaron Otilde -40\nKPX Tcaron a -80\nKPX Tcaron aacute -80\nKPX Tcaron abreve -80\nKPX Tcaron acircumflex -80\nKPX Tcaron adieresis -80\nKPX Tcaron agrave -80\nKPX Tcaron amacron -80\nKPX Tcaron aogonek -80\nKPX Tcaron aring -80\nKPX Tcaron atilde -80\nKPX Tcaron colon -40\nKPX Tcaron comma -80\nKPX Tcaron e -60\nKPX Tcaron eacute -60\nKPX Tcaron ecaron -60\nKPX Tcaron ecircumflex -60\nKPX Tcaron edieresis -60\nKPX Tcaron edotaccent -60\nKPX Tcaron egrave -60\nKPX Tcaron emacron -60\nKPX Tcaron eogonek -60\nKPX Tcaron hyphen -120\nKPX Tcaron o -80\nKPX Tcaron oacute -80\nKPX Tcaron ocircumflex -80\nKPX Tcaron odieresis -80\nKPX Tcaron ograve -80\nKPX Tcaron ohungarumlaut -80\nKPX Tcaron omacron -80\nKPX Tcaron oslash -80\nKPX Tcaron otilde -80\nKPX Tcaron period -80\nKPX Tcaron r -80\nKPX Tcaron racute -80\nKPX Tcaron rcommaaccent -80\nKPX Tcaron semicolon -40\nKPX Tcaron u -90\nKPX Tcaron uacute -90\nKPX Tcaron ucircumflex -90\nKPX Tcaron udieresis -90\nKPX Tcaron ugrave -90\nKPX Tcaron uhungarumlaut -90\nKPX Tcaron umacron -90\nKPX Tcaron uogonek -90\nKPX Tcaron uring -90\nKPX Tcaron w -60\nKPX Tcaron y -60\nKPX Tcaron yacute -60\nKPX Tcaron ydieresis -60\nKPX Tcommaaccent A -90\nKPX Tcommaaccent Aacute -90\nKPX Tcommaaccent Abreve -90\nKPX Tcommaaccent Acircumflex -90\nKPX Tcommaaccent Adieresis -90\nKPX Tcommaaccent Agrave -90\nKPX Tcommaaccent Amacron -90\nKPX Tcommaaccent Aogonek -90\nKPX Tcommaaccent Aring -90\nKPX Tcommaaccent Atilde -90\nKPX Tcommaaccent O -40\nKPX Tcommaaccent Oacute -40\nKPX Tcommaaccent Ocircumflex -40\nKPX Tcommaaccent Odieresis -40\nKPX Tcommaaccent Ograve -40\nKPX Tcommaaccent Ohungarumlaut -40\nKPX Tcommaaccent Omacron -40\nKPX Tcommaaccent Oslash -40\nKPX Tcommaaccent Otilde -40\nKPX Tcommaaccent a -80\nKPX Tcommaaccent aacute -80\nKPX Tcommaaccent abreve -80\nKPX Tcommaaccent acircumflex -80\nKPX Tcommaaccent adieresis -80\nKPX Tcommaaccent agrave -80\nKPX Tcommaaccent amacron -80\nKPX Tcommaaccent aogonek -80\nKPX Tcommaaccent aring -80\nKPX Tcommaaccent atilde -80\nKPX Tcommaaccent colon -40\nKPX Tcommaaccent comma -80\nKPX Tcommaaccent e -60\nKPX Tcommaaccent eacute -60\nKPX Tcommaaccent ecaron -60\nKPX Tcommaaccent ecircumflex -60\nKPX Tcommaaccent edieresis -60\nKPX Tcommaaccent edotaccent -60\nKPX Tcommaaccent egrave -60\nKPX Tcommaaccent emacron -60\nKPX Tcommaaccent eogonek -60\nKPX Tcommaaccent hyphen -120\nKPX Tcommaaccent o -80\nKPX Tcommaaccent oacute -80\nKPX Tcommaaccent ocircumflex -80\nKPX Tcommaaccent odieresis -80\nKPX Tcommaaccent ograve -80\nKPX Tcommaaccent ohungarumlaut -80\nKPX Tcommaaccent omacron -80\nKPX Tcommaaccent oslash -80\nKPX Tcommaaccent otilde -80\nKPX Tcommaaccent period -80\nKPX Tcommaaccent r -80\nKPX Tcommaaccent racute -80\nKPX Tcommaaccent rcommaaccent -80\nKPX Tcommaaccent semicolon -40\nKPX Tcommaaccent u -90\nKPX Tcommaaccent uacute -90\nKPX Tcommaaccent ucircumflex -90\nKPX Tcommaaccent udieresis -90\nKPX Tcommaaccent ugrave -90\nKPX Tcommaaccent uhungarumlaut -90\nKPX Tcommaaccent umacron -90\nKPX Tcommaaccent uogonek -90\nKPX Tcommaaccent uring -90\nKPX Tcommaaccent w -60\nKPX Tcommaaccent y -60\nKPX Tcommaaccent yacute -60\nKPX Tcommaaccent ydieresis -60\nKPX U A -50\nKPX U Aacute -50\nKPX U Abreve -50\nKPX U Acircumflex -50\nKPX U Adieresis -50\nKPX U Agrave -50\nKPX U Amacron -50\nKPX U Aogonek -50\nKPX U Aring -50\nKPX U Atilde -50\nKPX U comma -30\nKPX U period -30\nKPX Uacute A -50\nKPX Uacute Aacute -50\nKPX Uacute Abreve -50\nKPX Uacute Acircumflex -50\nKPX Uacute Adieresis -50\nKPX Uacute Agrave -50\nKPX Uacute Amacron -50\nKPX Uacute Aogonek -50\nKPX Uacute Aring -50\nKPX Uacute Atilde -50\nKPX Uacute comma -30\nKPX Uacute period -30\nKPX Ucircumflex A -50\nKPX Ucircumflex Aacute -50\nKPX Ucircumflex Abreve -50\nKPX Ucircumflex Acircumflex -50\nKPX Ucircumflex Adieresis -50\nKPX Ucircumflex Agrave -50\nKPX Ucircumflex Amacron -50\nKPX Ucircumflex Aogonek -50\nKPX Ucircumflex Aring -50\nKPX Ucircumflex Atilde -50\nKPX Ucircumflex comma -30\nKPX Ucircumflex period -30\nKPX Udieresis A -50\nKPX Udieresis Aacute -50\nKPX Udieresis Abreve -50\nKPX Udieresis Acircumflex -50\nKPX Udieresis Adieresis -50\nKPX Udieresis Agrave -50\nKPX Udieresis Amacron -50\nKPX Udieresis Aogonek -50\nKPX Udieresis Aring -50\nKPX Udieresis Atilde -50\nKPX Udieresis comma -30\nKPX Udieresis period -30\nKPX Ugrave A -50\nKPX Ugrave Aacute -50\nKPX Ugrave Abreve -50\nKPX Ugrave Acircumflex -50\nKPX Ugrave Adieresis -50\nKPX Ugrave Agrave -50\nKPX Ugrave Amacron -50\nKPX Ugrave Aogonek -50\nKPX Ugrave Aring -50\nKPX Ugrave Atilde -50\nKPX Ugrave comma -30\nKPX Ugrave period -30\nKPX Uhungarumlaut A -50\nKPX Uhungarumlaut Aacute -50\nKPX Uhungarumlaut Abreve -50\nKPX Uhungarumlaut Acircumflex -50\nKPX Uhungarumlaut Adieresis -50\nKPX Uhungarumlaut Agrave -50\nKPX Uhungarumlaut Amacron -50\nKPX Uhungarumlaut Aogonek -50\nKPX Uhungarumlaut Aring -50\nKPX Uhungarumlaut Atilde -50\nKPX Uhungarumlaut comma -30\nKPX Uhungarumlaut period -30\nKPX Umacron A -50\nKPX Umacron Aacute -50\nKPX Umacron Abreve -50\nKPX Umacron Acircumflex -50\nKPX Umacron Adieresis -50\nKPX Umacron Agrave -50\nKPX Umacron Amacron -50\nKPX Umacron Aogonek -50\nKPX Umacron Aring -50\nKPX Umacron Atilde -50\nKPX Umacron comma -30\nKPX Umacron period -30\nKPX Uogonek A -50\nKPX Uogonek Aacute -50\nKPX Uogonek Abreve -50\nKPX Uogonek Acircumflex -50\nKPX Uogonek Adieresis -50\nKPX Uogonek Agrave -50\nKPX Uogonek Amacron -50\nKPX Uogonek Aogonek -50\nKPX Uogonek Aring -50\nKPX Uogonek Atilde -50\nKPX Uogonek comma -30\nKPX Uogonek period -30\nKPX Uring A -50\nKPX Uring Aacute -50\nKPX Uring Abreve -50\nKPX Uring Acircumflex -50\nKPX Uring Adieresis -50\nKPX Uring Agrave -50\nKPX Uring Amacron -50\nKPX Uring Aogonek -50\nKPX Uring Aring -50\nKPX Uring Atilde -50\nKPX Uring comma -30\nKPX Uring period -30\nKPX V A -80\nKPX V Aacute -80\nKPX V Abreve -80\nKPX V Acircumflex -80\nKPX V Adieresis -80\nKPX V Agrave -80\nKPX V Amacron -80\nKPX V Aogonek -80\nKPX V Aring -80\nKPX V Atilde -80\nKPX V G -50\nKPX V Gbreve -50\nKPX V Gcommaaccent -50\nKPX V O -50\nKPX V Oacute -50\nKPX V Ocircumflex -50\nKPX V Odieresis -50\nKPX V Ograve -50\nKPX V Ohungarumlaut -50\nKPX V Omacron -50\nKPX V Oslash -50\nKPX V Otilde -50\nKPX V a -60\nKPX V aacute -60\nKPX V abreve -60\nKPX V acircumflex -60\nKPX V adieresis -60\nKPX V agrave -60\nKPX V amacron -60\nKPX V aogonek -60\nKPX V aring -60\nKPX V atilde -60\nKPX V colon -40\nKPX V comma -120\nKPX V e -50\nKPX V eacute -50\nKPX V ecaron -50\nKPX V ecircumflex -50\nKPX V edieresis -50\nKPX V edotaccent -50\nKPX V egrave -50\nKPX V emacron -50\nKPX V eogonek -50\nKPX V hyphen -80\nKPX V o -90\nKPX V oacute -90\nKPX V ocircumflex -90\nKPX V odieresis -90\nKPX V ograve -90\nKPX V ohungarumlaut -90\nKPX V omacron -90\nKPX V oslash -90\nKPX V otilde -90\nKPX V period -120\nKPX V semicolon -40\nKPX V u -60\nKPX V uacute -60\nKPX V ucircumflex -60\nKPX V udieresis -60\nKPX V ugrave -60\nKPX V uhungarumlaut -60\nKPX V umacron -60\nKPX V uogonek -60\nKPX V uring -60\nKPX W A -60\nKPX W Aacute -60\nKPX W Abreve -60\nKPX W Acircumflex -60\nKPX W Adieresis -60\nKPX W Agrave -60\nKPX W Amacron -60\nKPX W Aogonek -60\nKPX W Aring -60\nKPX W Atilde -60\nKPX W O -20\nKPX W Oacute -20\nKPX W Ocircumflex -20\nKPX W Odieresis -20\nKPX W Ograve -20\nKPX W Ohungarumlaut -20\nKPX W Omacron -20\nKPX W Oslash -20\nKPX W Otilde -20\nKPX W a -40\nKPX W aacute -40\nKPX W abreve -40\nKPX W acircumflex -40\nKPX W adieresis -40\nKPX W agrave -40\nKPX W amacron -40\nKPX W aogonek -40\nKPX W aring -40\nKPX W atilde -40\nKPX W colon -10\nKPX W comma -80\nKPX W e -35\nKPX W eacute -35\nKPX W ecaron -35\nKPX W ecircumflex -35\nKPX W edieresis -35\nKPX W edotaccent -35\nKPX W egrave -35\nKPX W emacron -35\nKPX W eogonek -35\nKPX W hyphen -40\nKPX W o -60\nKPX W oacute -60\nKPX W ocircumflex -60\nKPX W odieresis -60\nKPX W ograve -60\nKPX W ohungarumlaut -60\nKPX W omacron -60\nKPX W oslash -60\nKPX W otilde -60\nKPX W period -80\nKPX W semicolon -10\nKPX W u -45\nKPX W uacute -45\nKPX W ucircumflex -45\nKPX W udieresis -45\nKPX W ugrave -45\nKPX W uhungarumlaut -45\nKPX W umacron -45\nKPX W uogonek -45\nKPX W uring -45\nKPX W y -20\nKPX W yacute -20\nKPX W ydieresis -20\nKPX Y A -110\nKPX Y Aacute -110\nKPX Y Abreve -110\nKPX Y Acircumflex -110\nKPX Y Adieresis -110\nKPX Y Agrave -110\nKPX Y Amacron -110\nKPX Y Aogonek -110\nKPX Y Aring -110\nKPX Y Atilde -110\nKPX Y O -70\nKPX Y Oacute -70\nKPX Y Ocircumflex -70\nKPX Y Odieresis -70\nKPX Y Ograve -70\nKPX Y Ohungarumlaut -70\nKPX Y Omacron -70\nKPX Y Oslash -70\nKPX Y Otilde -70\nKPX Y a -90\nKPX Y aacute -90\nKPX Y abreve -90\nKPX Y acircumflex -90\nKPX Y adieresis -90\nKPX Y agrave -90\nKPX Y amacron -90\nKPX Y aogonek -90\nKPX Y aring -90\nKPX Y atilde -90\nKPX Y colon -50\nKPX Y comma -100\nKPX Y e -80\nKPX Y eacute -80\nKPX Y ecaron -80\nKPX Y ecircumflex -80\nKPX Y edieresis -80\nKPX Y edotaccent -80\nKPX Y egrave -80\nKPX Y emacron -80\nKPX Y eogonek -80\nKPX Y o -100\nKPX Y oacute -100\nKPX Y ocircumflex -100\nKPX Y odieresis -100\nKPX Y ograve -100\nKPX Y ohungarumlaut -100\nKPX Y omacron -100\nKPX Y oslash -100\nKPX Y otilde -100\nKPX Y period -100\nKPX Y semicolon -50\nKPX Y u -100\nKPX Y uacute -100\nKPX Y ucircumflex -100\nKPX Y udieresis -100\nKPX Y ugrave -100\nKPX Y uhungarumlaut -100\nKPX Y umacron -100\nKPX Y uogonek -100\nKPX Y uring -100\nKPX Yacute A -110\nKPX Yacute Aacute -110\nKPX Yacute Abreve -110\nKPX Yacute Acircumflex -110\nKPX Yacute Adieresis -110\nKPX Yacute Agrave -110\nKPX Yacute Amacron -110\nKPX Yacute Aogonek -110\nKPX Yacute Aring -110\nKPX Yacute Atilde -110\nKPX Yacute O -70\nKPX Yacute Oacute -70\nKPX Yacute Ocircumflex -70\nKPX Yacute Odieresis -70\nKPX Yacute Ograve -70\nKPX Yacute Ohungarumlaut -70\nKPX Yacute Omacron -70\nKPX Yacute Oslash -70\nKPX Yacute Otilde -70\nKPX Yacute a -90\nKPX Yacute aacute -90\nKPX Yacute abreve -90\nKPX Yacute acircumflex -90\nKPX Yacute adieresis -90\nKPX Yacute agrave -90\nKPX Yacute amacron -90\nKPX Yacute aogonek -90\nKPX Yacute aring -90\nKPX Yacute atilde -90\nKPX Yacute colon -50\nKPX Yacute comma -100\nKPX Yacute e -80\nKPX Yacute eacute -80\nKPX Yacute ecaron -80\nKPX Yacute ecircumflex -80\nKPX Yacute edieresis -80\nKPX Yacute edotaccent -80\nKPX Yacute egrave -80\nKPX Yacute emacron -80\nKPX Yacute eogonek -80\nKPX Yacute o -100\nKPX Yacute oacute -100\nKPX Yacute ocircumflex -100\nKPX Yacute odieresis -100\nKPX Yacute ograve -100\nKPX Yacute ohungarumlaut -100\nKPX Yacute omacron -100\nKPX Yacute oslash -100\nKPX Yacute otilde -100\nKPX Yacute period -100\nKPX Yacute semicolon -50\nKPX Yacute u -100\nKPX Yacute uacute -100\nKPX Yacute ucircumflex -100\nKPX Yacute udieresis -100\nKPX Yacute ugrave -100\nKPX Yacute uhungarumlaut -100\nKPX Yacute umacron -100\nKPX Yacute uogonek -100\nKPX Yacute uring -100\nKPX Ydieresis A -110\nKPX Ydieresis Aacute -110\nKPX Ydieresis Abreve -110\nKPX Ydieresis Acircumflex -110\nKPX Ydieresis Adieresis -110\nKPX Ydieresis Agrave -110\nKPX Ydieresis Amacron -110\nKPX Ydieresis Aogonek -110\nKPX Ydieresis Aring -110\nKPX Ydieresis Atilde -110\nKPX Ydieresis O -70\nKPX Ydieresis Oacute -70\nKPX Ydieresis Ocircumflex -70\nKPX Ydieresis Odieresis -70\nKPX Ydieresis Ograve -70\nKPX Ydieresis Ohungarumlaut -70\nKPX Ydieresis Omacron -70\nKPX Ydieresis Oslash -70\nKPX Ydieresis Otilde -70\nKPX Ydieresis a -90\nKPX Ydieresis aacute -90\nKPX Ydieresis abreve -90\nKPX Ydieresis acircumflex -90\nKPX Ydieresis adieresis -90\nKPX Ydieresis agrave -90\nKPX Ydieresis amacron -90\nKPX Ydieresis aogonek -90\nKPX Ydieresis aring -90\nKPX Ydieresis atilde -90\nKPX Ydieresis colon -50\nKPX Ydieresis comma -100\nKPX Ydieresis e -80\nKPX Ydieresis eacute -80\nKPX Ydieresis ecaron -80\nKPX Ydieresis ecircumflex -80\nKPX Ydieresis edieresis -80\nKPX Ydieresis edotaccent -80\nKPX Ydieresis egrave -80\nKPX Ydieresis emacron -80\nKPX Ydieresis eogonek -80\nKPX Ydieresis o -100\nKPX Ydieresis oacute -100\nKPX Ydieresis ocircumflex -100\nKPX Ydieresis odieresis -100\nKPX Ydieresis ograve -100\nKPX Ydieresis ohungarumlaut -100\nKPX Ydieresis omacron -100\nKPX Ydieresis oslash -100\nKPX Ydieresis otilde -100\nKPX Ydieresis period -100\nKPX Ydieresis semicolon -50\nKPX Ydieresis u -100\nKPX Ydieresis uacute -100\nKPX Ydieresis ucircumflex -100\nKPX Ydieresis udieresis -100\nKPX Ydieresis ugrave -100\nKPX Ydieresis uhungarumlaut -100\nKPX Ydieresis umacron -100\nKPX Ydieresis uogonek -100\nKPX Ydieresis uring -100\nKPX a g -10\nKPX a gbreve -10\nKPX a gcommaaccent -10\nKPX a v -15\nKPX a w -15\nKPX a y -20\nKPX a yacute -20\nKPX a ydieresis -20\nKPX aacute g -10\nKPX aacute gbreve -10\nKPX aacute gcommaaccent -10\nKPX aacute v -15\nKPX aacute w -15\nKPX aacute y -20\nKPX aacute yacute -20\nKPX aacute ydieresis -20\nKPX abreve g -10\nKPX abreve gbreve -10\nKPX abreve gcommaaccent -10\nKPX abreve v -15\nKPX abreve w -15\nKPX abreve y -20\nKPX abreve yacute -20\nKPX abreve ydieresis -20\nKPX acircumflex g -10\nKPX acircumflex gbreve -10\nKPX acircumflex gcommaaccent -10\nKPX acircumflex v -15\nKPX acircumflex w -15\nKPX acircumflex y -20\nKPX acircumflex yacute -20\nKPX acircumflex ydieresis -20\nKPX adieresis g -10\nKPX adieresis gbreve -10\nKPX adieresis gcommaaccent -10\nKPX adieresis v -15\nKPX adieresis w -15\nKPX adieresis y -20\nKPX adieresis yacute -20\nKPX adieresis ydieresis -20\nKPX agrave g -10\nKPX agrave gbreve -10\nKPX agrave gcommaaccent -10\nKPX agrave v -15\nKPX agrave w -15\nKPX agrave y -20\nKPX agrave yacute -20\nKPX agrave ydieresis -20\nKPX amacron g -10\nKPX amacron gbreve -10\nKPX amacron gcommaaccent -10\nKPX amacron v -15\nKPX amacron w -15\nKPX amacron y -20\nKPX amacron yacute -20\nKPX amacron ydieresis -20\nKPX aogonek g -10\nKPX aogonek gbreve -10\nKPX aogonek gcommaaccent -10\nKPX aogonek v -15\nKPX aogonek w -15\nKPX aogonek y -20\nKPX aogonek yacute -20\nKPX aogonek ydieresis -20\nKPX aring g -10\nKPX aring gbreve -10\nKPX aring gcommaaccent -10\nKPX aring v -15\nKPX aring w -15\nKPX aring y -20\nKPX aring yacute -20\nKPX aring ydieresis -20\nKPX atilde g -10\nKPX atilde gbreve -10\nKPX atilde gcommaaccent -10\nKPX atilde v -15\nKPX atilde w -15\nKPX atilde y -20\nKPX atilde yacute -20\nKPX atilde ydieresis -20\nKPX b l -10\nKPX b lacute -10\nKPX b lcommaaccent -10\nKPX b lslash -10\nKPX b u -20\nKPX b uacute -20\nKPX b ucircumflex -20\nKPX b udieresis -20\nKPX b ugrave -20\nKPX b uhungarumlaut -20\nKPX b umacron -20\nKPX b uogonek -20\nKPX b uring -20\nKPX b v -20\nKPX b y -20\nKPX b yacute -20\nKPX b ydieresis -20\nKPX c h -10\nKPX c k -20\nKPX c kcommaaccent -20\nKPX c l -20\nKPX c lacute -20\nKPX c lcommaaccent -20\nKPX c lslash -20\nKPX c y -10\nKPX c yacute -10\nKPX c ydieresis -10\nKPX cacute h -10\nKPX cacute k -20\nKPX cacute kcommaaccent -20\nKPX cacute l -20\nKPX cacute lacute -20\nKPX cacute lcommaaccent -20\nKPX cacute lslash -20\nKPX cacute y -10\nKPX cacute yacute -10\nKPX cacute ydieresis -10\nKPX ccaron h -10\nKPX ccaron k -20\nKPX ccaron kcommaaccent -20\nKPX ccaron l -20\nKPX ccaron lacute -20\nKPX ccaron lcommaaccent -20\nKPX ccaron lslash -20\nKPX ccaron y -10\nKPX ccaron yacute -10\nKPX ccaron ydieresis -10\nKPX ccedilla h -10\nKPX ccedilla k -20\nKPX ccedilla kcommaaccent -20\nKPX ccedilla l -20\nKPX ccedilla lacute -20\nKPX ccedilla lcommaaccent -20\nKPX ccedilla lslash -20\nKPX ccedilla y -10\nKPX ccedilla yacute -10\nKPX ccedilla ydieresis -10\nKPX colon space -40\nKPX comma quotedblright -120\nKPX comma quoteright -120\nKPX comma space -40\nKPX d d -10\nKPX d dcroat -10\nKPX d v -15\nKPX d w -15\nKPX d y -15\nKPX d yacute -15\nKPX d ydieresis -15\nKPX dcroat d -10\nKPX dcroat dcroat -10\nKPX dcroat v -15\nKPX dcroat w -15\nKPX dcroat y -15\nKPX dcroat yacute -15\nKPX dcroat ydieresis -15\nKPX e comma 10\nKPX e period 20\nKPX e v -15\nKPX e w -15\nKPX e x -15\nKPX e y -15\nKPX e yacute -15\nKPX e ydieresis -15\nKPX eacute comma 10\nKPX eacute period 20\nKPX eacute v -15\nKPX eacute w -15\nKPX eacute x -15\nKPX eacute y -15\nKPX eacute yacute -15\nKPX eacute ydieresis -15\nKPX ecaron comma 10\nKPX ecaron period 20\nKPX ecaron v -15\nKPX ecaron w -15\nKPX ecaron x -15\nKPX ecaron y -15\nKPX ecaron yacute -15\nKPX ecaron ydieresis -15\nKPX ecircumflex comma 10\nKPX ecircumflex period 20\nKPX ecircumflex v -15\nKPX ecircumflex w -15\nKPX ecircumflex x -15\nKPX ecircumflex y -15\nKPX ecircumflex yacute -15\nKPX ecircumflex ydieresis -15\nKPX edieresis comma 10\nKPX edieresis period 20\nKPX edieresis v -15\nKPX edieresis w -15\nKPX edieresis x -15\nKPX edieresis y -15\nKPX edieresis yacute -15\nKPX edieresis ydieresis -15\nKPX edotaccent comma 10\nKPX edotaccent period 20\nKPX edotaccent v -15\nKPX edotaccent w -15\nKPX edotaccent x -15\nKPX edotaccent y -15\nKPX edotaccent yacute -15\nKPX edotaccent ydieresis -15\nKPX egrave comma 10\nKPX egrave period 20\nKPX egrave v -15\nKPX egrave w -15\nKPX egrave x -15\nKPX egrave y -15\nKPX egrave yacute -15\nKPX egrave ydieresis -15\nKPX emacron comma 10\nKPX emacron period 20\nKPX emacron v -15\nKPX emacron w -15\nKPX emacron x -15\nKPX emacron y -15\nKPX emacron yacute -15\nKPX emacron ydieresis -15\nKPX eogonek comma 10\nKPX eogonek period 20\nKPX eogonek v -15\nKPX eogonek w -15\nKPX eogonek x -15\nKPX eogonek y -15\nKPX eogonek yacute -15\nKPX eogonek ydieresis -15\nKPX f comma -10\nKPX f e -10\nKPX f eacute -10\nKPX f ecaron -10\nKPX f ecircumflex -10\nKPX f edieresis -10\nKPX f edotaccent -10\nKPX f egrave -10\nKPX f emacron -10\nKPX f eogonek -10\nKPX f o -20\nKPX f oacute -20\nKPX f ocircumflex -20\nKPX f odieresis -20\nKPX f ograve -20\nKPX f ohungarumlaut -20\nKPX f omacron -20\nKPX f oslash -20\nKPX f otilde -20\nKPX f period -10\nKPX f quotedblright 30\nKPX f quoteright 30\nKPX g e 10\nKPX g eacute 10\nKPX g ecaron 10\nKPX g ecircumflex 10\nKPX g edieresis 10\nKPX g edotaccent 10\nKPX g egrave 10\nKPX g emacron 10\nKPX g eogonek 10\nKPX g g -10\nKPX g gbreve -10\nKPX g gcommaaccent -10\nKPX gbreve e 10\nKPX gbreve eacute 10\nKPX gbreve ecaron 10\nKPX gbreve ecircumflex 10\nKPX gbreve edieresis 10\nKPX gbreve edotaccent 10\nKPX gbreve egrave 10\nKPX gbreve emacron 10\nKPX gbreve eogonek 10\nKPX gbreve g -10\nKPX gbreve gbreve -10\nKPX gbreve gcommaaccent -10\nKPX gcommaaccent e 10\nKPX gcommaaccent eacute 10\nKPX gcommaaccent ecaron 10\nKPX gcommaaccent ecircumflex 10\nKPX gcommaaccent edieresis 10\nKPX gcommaaccent edotaccent 10\nKPX gcommaaccent egrave 10\nKPX gcommaaccent emacron 10\nKPX gcommaaccent eogonek 10\nKPX gcommaaccent g -10\nKPX gcommaaccent gbreve -10\nKPX gcommaaccent gcommaaccent -10\nKPX h y -20\nKPX h yacute -20\nKPX h ydieresis -20\nKPX k o -15\nKPX k oacute -15\nKPX k ocircumflex -15\nKPX k odieresis -15\nKPX k ograve -15\nKPX k ohungarumlaut -15\nKPX k omacron -15\nKPX k oslash -15\nKPX k otilde -15\nKPX kcommaaccent o -15\nKPX kcommaaccent oacute -15\nKPX kcommaaccent ocircumflex -15\nKPX kcommaaccent odieresis -15\nKPX kcommaaccent ograve -15\nKPX kcommaaccent ohungarumlaut -15\nKPX kcommaaccent omacron -15\nKPX kcommaaccent oslash -15\nKPX kcommaaccent otilde -15\nKPX l w -15\nKPX l y -15\nKPX l yacute -15\nKPX l ydieresis -15\nKPX lacute w -15\nKPX lacute y -15\nKPX lacute yacute -15\nKPX lacute ydieresis -15\nKPX lcommaaccent w -15\nKPX lcommaaccent y -15\nKPX lcommaaccent yacute -15\nKPX lcommaaccent ydieresis -15\nKPX lslash w -15\nKPX lslash y -15\nKPX lslash yacute -15\nKPX lslash ydieresis -15\nKPX m u -20\nKPX m uacute -20\nKPX m ucircumflex -20\nKPX m udieresis -20\nKPX m ugrave -20\nKPX m uhungarumlaut -20\nKPX m umacron -20\nKPX m uogonek -20\nKPX m uring -20\nKPX m y -30\nKPX m yacute -30\nKPX m ydieresis -30\nKPX n u -10\nKPX n uacute -10\nKPX n ucircumflex -10\nKPX n udieresis -10\nKPX n ugrave -10\nKPX n uhungarumlaut -10\nKPX n umacron -10\nKPX n uogonek -10\nKPX n uring -10\nKPX n v -40\nKPX n y -20\nKPX n yacute -20\nKPX n ydieresis -20\nKPX nacute u -10\nKPX nacute uacute -10\nKPX nacute ucircumflex -10\nKPX nacute udieresis -10\nKPX nacute ugrave -10\nKPX nacute uhungarumlaut -10\nKPX nacute umacron -10\nKPX nacute uogonek -10\nKPX nacute uring -10\nKPX nacute v -40\nKPX nacute y -20\nKPX nacute yacute -20\nKPX nacute ydieresis -20\nKPX ncaron u -10\nKPX ncaron uacute -10\nKPX ncaron ucircumflex -10\nKPX ncaron udieresis -10\nKPX ncaron ugrave -10\nKPX ncaron uhungarumlaut -10\nKPX ncaron umacron -10\nKPX ncaron uogonek -10\nKPX ncaron uring -10\nKPX ncaron v -40\nKPX ncaron y -20\nKPX ncaron yacute -20\nKPX ncaron ydieresis -20\nKPX ncommaaccent u -10\nKPX ncommaaccent uacute -10\nKPX ncommaaccent ucircumflex -10\nKPX ncommaaccent udieresis -10\nKPX ncommaaccent ugrave -10\nKPX ncommaaccent uhungarumlaut -10\nKPX ncommaaccent umacron -10\nKPX ncommaaccent uogonek -10\nKPX ncommaaccent uring -10\nKPX ncommaaccent v -40\nKPX ncommaaccent y -20\nKPX ncommaaccent yacute -20\nKPX ncommaaccent ydieresis -20\nKPX ntilde u -10\nKPX ntilde uacute -10\nKPX ntilde ucircumflex -10\nKPX ntilde udieresis -10\nKPX ntilde ugrave -10\nKPX ntilde uhungarumlaut -10\nKPX ntilde umacron -10\nKPX ntilde uogonek -10\nKPX ntilde uring -10\nKPX ntilde v -40\nKPX ntilde y -20\nKPX ntilde yacute -20\nKPX ntilde ydieresis -20\nKPX o v -20\nKPX o w -15\nKPX o x -30\nKPX o y -20\nKPX o yacute -20\nKPX o ydieresis -20\nKPX oacute v -20\nKPX oacute w -15\nKPX oacute x -30\nKPX oacute y -20\nKPX oacute yacute -20\nKPX oacute ydieresis -20\nKPX ocircumflex v -20\nKPX ocircumflex w -15\nKPX ocircumflex x -30\nKPX ocircumflex y -20\nKPX ocircumflex yacute -20\nKPX ocircumflex ydieresis -20\nKPX odieresis v -20\nKPX odieresis w -15\nKPX odieresis x -30\nKPX odieresis y -20\nKPX odieresis yacute -20\nKPX odieresis ydieresis -20\nKPX ograve v -20\nKPX ograve w -15\nKPX ograve x -30\nKPX ograve y -20\nKPX ograve yacute -20\nKPX ograve ydieresis -20\nKPX ohungarumlaut v -20\nKPX ohungarumlaut w -15\nKPX ohungarumlaut x -30\nKPX ohungarumlaut y -20\nKPX ohungarumlaut yacute -20\nKPX ohungarumlaut ydieresis -20\nKPX omacron v -20\nKPX omacron w -15\nKPX omacron x -30\nKPX omacron y -20\nKPX omacron yacute -20\nKPX omacron ydieresis -20\nKPX oslash v -20\nKPX oslash w -15\nKPX oslash x -30\nKPX oslash y -20\nKPX oslash yacute -20\nKPX oslash ydieresis -20\nKPX otilde v -20\nKPX otilde w -15\nKPX otilde x -30\nKPX otilde y -20\nKPX otilde yacute -20\nKPX otilde ydieresis -20\nKPX p y -15\nKPX p yacute -15\nKPX p ydieresis -15\nKPX period quotedblright -120\nKPX period quoteright -120\nKPX period space -40\nKPX quotedblright space -80\nKPX quoteleft quoteleft -46\nKPX quoteright d -80\nKPX quoteright dcroat -80\nKPX quoteright l -20\nKPX quoteright lacute -20\nKPX quoteright lcommaaccent -20\nKPX quoteright lslash -20\nKPX quoteright quoteright -46\nKPX quoteright r -40\nKPX quoteright racute -40\nKPX quoteright rcaron -40\nKPX quoteright rcommaaccent -40\nKPX quoteright s -60\nKPX quoteright sacute -60\nKPX quoteright scaron -60\nKPX quoteright scedilla -60\nKPX quoteright scommaaccent -60\nKPX quoteright space -80\nKPX quoteright v -20\nKPX r c -20\nKPX r cacute -20\nKPX r ccaron -20\nKPX r ccedilla -20\nKPX r comma -60\nKPX r d -20\nKPX r dcroat -20\nKPX r g -15\nKPX r gbreve -15\nKPX r gcommaaccent -15\nKPX r hyphen -20\nKPX r o -20\nKPX r oacute -20\nKPX r ocircumflex -20\nKPX r odieresis -20\nKPX r ograve -20\nKPX r ohungarumlaut -20\nKPX r omacron -20\nKPX r oslash -20\nKPX r otilde -20\nKPX r period -60\nKPX r q -20\nKPX r s -15\nKPX r sacute -15\nKPX r scaron -15\nKPX r scedilla -15\nKPX r scommaaccent -15\nKPX r t 20\nKPX r tcommaaccent 20\nKPX r v 10\nKPX r y 10\nKPX r yacute 10\nKPX r ydieresis 10\nKPX racute c -20\nKPX racute cacute -20\nKPX racute ccaron -20\nKPX racute ccedilla -20\nKPX racute comma -60\nKPX racute d -20\nKPX racute dcroat -20\nKPX racute g -15\nKPX racute gbreve -15\nKPX racute gcommaaccent -15\nKPX racute hyphen -20\nKPX racute o -20\nKPX racute oacute -20\nKPX racute ocircumflex -20\nKPX racute odieresis -20\nKPX racute ograve -20\nKPX racute ohungarumlaut -20\nKPX racute omacron -20\nKPX racute oslash -20\nKPX racute otilde -20\nKPX racute period -60\nKPX racute q -20\nKPX racute s -15\nKPX racute sacute -15\nKPX racute scaron -15\nKPX racute scedilla -15\nKPX racute scommaaccent -15\nKPX racute t 20\nKPX racute tcommaaccent 20\nKPX racute v 10\nKPX racute y 10\nKPX racute yacute 10\nKPX racute ydieresis 10\nKPX rcaron c -20\nKPX rcaron cacute -20\nKPX rcaron ccaron -20\nKPX rcaron ccedilla -20\nKPX rcaron comma -60\nKPX rcaron d -20\nKPX rcaron dcroat -20\nKPX rcaron g -15\nKPX rcaron gbreve -15\nKPX rcaron gcommaaccent -15\nKPX rcaron hyphen -20\nKPX rcaron o -20\nKPX rcaron oacute -20\nKPX rcaron ocircumflex -20\nKPX rcaron odieresis -20\nKPX rcaron ograve -20\nKPX rcaron ohungarumlaut -20\nKPX rcaron omacron -20\nKPX rcaron oslash -20\nKPX rcaron otilde -20\nKPX rcaron period -60\nKPX rcaron q -20\nKPX rcaron s -15\nKPX rcaron sacute -15\nKPX rcaron scaron -15\nKPX rcaron scedilla -15\nKPX rcaron scommaaccent -15\nKPX rcaron t 20\nKPX rcaron tcommaaccent 20\nKPX rcaron v 10\nKPX rcaron y 10\nKPX rcaron yacute 10\nKPX rcaron ydieresis 10\nKPX rcommaaccent c -20\nKPX rcommaaccent cacute -20\nKPX rcommaaccent ccaron -20\nKPX rcommaaccent ccedilla -20\nKPX rcommaaccent comma -60\nKPX rcommaaccent d -20\nKPX rcommaaccent dcroat -20\nKPX rcommaaccent g -15\nKPX rcommaaccent gbreve -15\nKPX rcommaaccent gcommaaccent -15\nKPX rcommaaccent hyphen -20\nKPX rcommaaccent o -20\nKPX rcommaaccent oacute -20\nKPX rcommaaccent ocircumflex -20\nKPX rcommaaccent odieresis -20\nKPX rcommaaccent ograve -20\nKPX rcommaaccent ohungarumlaut -20\nKPX rcommaaccent omacron -20\nKPX rcommaaccent oslash -20\nKPX rcommaaccent otilde -20\nKPX rcommaaccent period -60\nKPX rcommaaccent q -20\nKPX rcommaaccent s -15\nKPX rcommaaccent sacute -15\nKPX rcommaaccent scaron -15\nKPX rcommaaccent scedilla -15\nKPX rcommaaccent scommaaccent -15\nKPX rcommaaccent t 20\nKPX rcommaaccent tcommaaccent 20\nKPX rcommaaccent v 10\nKPX rcommaaccent y 10\nKPX rcommaaccent yacute 10\nKPX rcommaaccent ydieresis 10\nKPX s w -15\nKPX sacute w -15\nKPX scaron w -15\nKPX scedilla w -15\nKPX scommaaccent w -15\nKPX semicolon space -40\nKPX space T -100\nKPX space Tcaron -100\nKPX space Tcommaaccent -100\nKPX space V -80\nKPX space W -80\nKPX space Y -120\nKPX space Yacute -120\nKPX space Ydieresis -120\nKPX space quotedblleft -80\nKPX space quoteleft -60\nKPX v a -20\nKPX v aacute -20\nKPX v abreve -20\nKPX v acircumflex -20\nKPX v adieresis -20\nKPX v agrave -20\nKPX v amacron -20\nKPX v aogonek -20\nKPX v aring -20\nKPX v atilde -20\nKPX v comma -80\nKPX v o -30\nKPX v oacute -30\nKPX v ocircumflex -30\nKPX v odieresis -30\nKPX v ograve -30\nKPX v ohungarumlaut -30\nKPX v omacron -30\nKPX v oslash -30\nKPX v otilde -30\nKPX v period -80\nKPX w comma -40\nKPX w o -20\nKPX w oacute -20\nKPX w ocircumflex -20\nKPX w odieresis -20\nKPX w ograve -20\nKPX w ohungarumlaut -20\nKPX w omacron -20\nKPX w oslash -20\nKPX w otilde -20\nKPX w period -40\nKPX x e -10\nKPX x eacute -10\nKPX x ecaron -10\nKPX x ecircumflex -10\nKPX x edieresis -10\nKPX x edotaccent -10\nKPX x egrave -10\nKPX x emacron -10\nKPX x eogonek -10\nKPX y a -30\nKPX y aacute -30\nKPX y abreve -30\nKPX y acircumflex -30\nKPX y adieresis -30\nKPX y agrave -30\nKPX y amacron -30\nKPX y aogonek -30\nKPX y aring -30\nKPX y atilde -30\nKPX y comma -80\nKPX y e -10\nKPX y eacute -10\nKPX y ecaron -10\nKPX y ecircumflex -10\nKPX y edieresis -10\nKPX y edotaccent -10\nKPX y egrave -10\nKPX y emacron -10\nKPX y eogonek -10\nKPX y o -25\nKPX y oacute -25\nKPX y ocircumflex -25\nKPX y odieresis -25\nKPX y ograve -25\nKPX y ohungarumlaut -25\nKPX y omacron -25\nKPX y oslash -25\nKPX y otilde -25\nKPX y period -80\nKPX yacute a -30\nKPX yacute aacute -30\nKPX yacute abreve -30\nKPX yacute acircumflex -30\nKPX yacute adieresis -30\nKPX yacute agrave -30\nKPX yacute amacron -30\nKPX yacute aogonek -30\nKPX yacute aring -30\nKPX yacute atilde -30\nKPX yacute comma -80\nKPX yacute e -10\nKPX yacute eacute -10\nKPX yacute ecaron -10\nKPX yacute ecircumflex -10\nKPX yacute edieresis -10\nKPX yacute edotaccent -10\nKPX yacute egrave -10\nKPX yacute emacron -10\nKPX yacute eogonek -10\nKPX yacute o -25\nKPX yacute oacute -25\nKPX yacute ocircumflex -25\nKPX yacute odieresis -25\nKPX yacute ograve -25\nKPX yacute ohungarumlaut -25\nKPX yacute omacron -25\nKPX yacute oslash -25\nKPX yacute otilde -25\nKPX yacute period -80\nKPX ydieresis a -30\nKPX ydieresis aacute -30\nKPX ydieresis abreve -30\nKPX ydieresis acircumflex -30\nKPX ydieresis adieresis -30\nKPX ydieresis agrave -30\nKPX ydieresis amacron -30\nKPX ydieresis aogonek -30\nKPX ydieresis aring -30\nKPX ydieresis atilde -30\nKPX ydieresis comma -80\nKPX ydieresis e -10\nKPX ydieresis eacute -10\nKPX ydieresis ecaron -10\nKPX ydieresis ecircumflex -10\nKPX ydieresis edieresis -10\nKPX ydieresis edotaccent -10\nKPX ydieresis egrave -10\nKPX ydieresis emacron -10\nKPX ydieresis eogonek -10\nKPX ydieresis o -25\nKPX ydieresis oacute -25\nKPX ydieresis ocircumflex -25\nKPX ydieresis odieresis -25\nKPX ydieresis ograve -25\nKPX ydieresis ohungarumlaut -25\nKPX ydieresis omacron -25\nKPX ydieresis oslash -25\nKPX ydieresis otilde -25\nKPX ydieresis period -80\nKPX z e 10\nKPX z eacute 10\nKPX z ecaron 10\nKPX z ecircumflex 10\nKPX z edieresis 10\nKPX z edotaccent 10\nKPX z egrave 10\nKPX z emacron 10\nKPX z eogonek 10\nKPX zacute e 10\nKPX zacute eacute 10\nKPX zacute ecaron 10\nKPX zacute ecircumflex 10\nKPX zacute edieresis 10\nKPX zacute edotaccent 10\nKPX zacute egrave 10\nKPX zacute emacron 10\nKPX zacute eogonek 10\nKPX zcaron e 10\nKPX zcaron eacute 10\nKPX zcaron ecaron 10\nKPX zcaron ecircumflex 10\nKPX zcaron edieresis 10\nKPX zcaron edotaccent 10\nKPX zcaron egrave 10\nKPX zcaron emacron 10\nKPX zcaron eogonek 10\nKPX zdotaccent e 10\nKPX zdotaccent eacute 10\nKPX zdotaccent ecaron 10\nKPX zdotaccent ecircumflex 10\nKPX zdotaccent edieresis 10\nKPX zdotaccent edotaccent 10\nKPX zdotaccent egrave 10\nKPX zdotaccent emacron 10\nKPX zdotaccent eogonek 10\nEndKernPairs\nEndKernData\nEndFontMetrics\n";
    },
    "Times-Roman": function() {
      return "StartFontMetrics 4.1\nComment Copyright (c) 1985, 1987, 1989, 1990, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.\nComment Creation Date: Thu May  1 12:49:17 1997\nComment UniqueID 43068\nComment VMusage 43909 54934\nFontName Times-Roman\nFullName Times Roman\nFamilyName Times\nWeight Roman\nItalicAngle 0\nIsFixedPitch false\nCharacterSet ExtendedRoman\nFontBBox -168 -218 1000 898 \nUnderlinePosition -100\nUnderlineThickness 50\nVersion 002.000\nNotice Copyright (c) 1985, 1987, 1989, 1990, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.Times is a trademark of Linotype-Hell AG and/or its subsidiaries.\nEncodingScheme AdobeStandardEncoding\nCapHeight 662\nXHeight 450\nAscender 683\nDescender -217\nStdHW 28\nStdVW 84\nStartCharMetrics 315\nC 32 ; WX 250 ; N space ; B 0 0 0 0 ;\nC 33 ; WX 333 ; N exclam ; B 130 -9 238 676 ;\nC 34 ; WX 408 ; N quotedbl ; B 77 431 331 676 ;\nC 35 ; WX 500 ; N numbersign ; B 5 0 496 662 ;\nC 36 ; WX 500 ; N dollar ; B 44 -87 457 727 ;\nC 37 ; WX 833 ; N percent ; B 61 -13 772 676 ;\nC 38 ; WX 778 ; N ampersand ; B 42 -13 750 676 ;\nC 39 ; WX 333 ; N quoteright ; B 79 433 218 676 ;\nC 40 ; WX 333 ; N parenleft ; B 48 -177 304 676 ;\nC 41 ; WX 333 ; N parenright ; B 29 -177 285 676 ;\nC 42 ; WX 500 ; N asterisk ; B 69 265 432 676 ;\nC 43 ; WX 564 ; N plus ; B 30 0 534 506 ;\nC 44 ; WX 250 ; N comma ; B 56 -141 195 102 ;\nC 45 ; WX 333 ; N hyphen ; B 39 194 285 257 ;\nC 46 ; WX 250 ; N period ; B 70 -11 181 100 ;\nC 47 ; WX 278 ; N slash ; B -9 -14 287 676 ;\nC 48 ; WX 500 ; N zero ; B 24 -14 476 676 ;\nC 49 ; WX 500 ; N one ; B 111 0 394 676 ;\nC 50 ; WX 500 ; N two ; B 30 0 475 676 ;\nC 51 ; WX 500 ; N three ; B 43 -14 431 676 ;\nC 52 ; WX 500 ; N four ; B 12 0 472 676 ;\nC 53 ; WX 500 ; N five ; B 32 -14 438 688 ;\nC 54 ; WX 500 ; N six ; B 34 -14 468 684 ;\nC 55 ; WX 500 ; N seven ; B 20 -8 449 662 ;\nC 56 ; WX 500 ; N eight ; B 56 -14 445 676 ;\nC 57 ; WX 500 ; N nine ; B 30 -22 459 676 ;\nC 58 ; WX 278 ; N colon ; B 81 -11 192 459 ;\nC 59 ; WX 278 ; N semicolon ; B 80 -141 219 459 ;\nC 60 ; WX 564 ; N less ; B 28 -8 536 514 ;\nC 61 ; WX 564 ; N equal ; B 30 120 534 386 ;\nC 62 ; WX 564 ; N greater ; B 28 -8 536 514 ;\nC 63 ; WX 444 ; N question ; B 68 -8 414 676 ;\nC 64 ; WX 921 ; N at ; B 116 -14 809 676 ;\nC 65 ; WX 722 ; N A ; B 15 0 706 674 ;\nC 66 ; WX 667 ; N B ; B 17 0 593 662 ;\nC 67 ; WX 667 ; N C ; B 28 -14 633 676 ;\nC 68 ; WX 722 ; N D ; B 16 0 685 662 ;\nC 69 ; WX 611 ; N E ; B 12 0 597 662 ;\nC 70 ; WX 556 ; N F ; B 12 0 546 662 ;\nC 71 ; WX 722 ; N G ; B 32 -14 709 676 ;\nC 72 ; WX 722 ; N H ; B 19 0 702 662 ;\nC 73 ; WX 333 ; N I ; B 18 0 315 662 ;\nC 74 ; WX 389 ; N J ; B 10 -14 370 662 ;\nC 75 ; WX 722 ; N K ; B 34 0 723 662 ;\nC 76 ; WX 611 ; N L ; B 12 0 598 662 ;\nC 77 ; WX 889 ; N M ; B 12 0 863 662 ;\nC 78 ; WX 722 ; N N ; B 12 -11 707 662 ;\nC 79 ; WX 722 ; N O ; B 34 -14 688 676 ;\nC 80 ; WX 556 ; N P ; B 16 0 542 662 ;\nC 81 ; WX 722 ; N Q ; B 34 -178 701 676 ;\nC 82 ; WX 667 ; N R ; B 17 0 659 662 ;\nC 83 ; WX 556 ; N S ; B 42 -14 491 676 ;\nC 84 ; WX 611 ; N T ; B 17 0 593 662 ;\nC 85 ; WX 722 ; N U ; B 14 -14 705 662 ;\nC 86 ; WX 722 ; N V ; B 16 -11 697 662 ;\nC 87 ; WX 944 ; N W ; B 5 -11 932 662 ;\nC 88 ; WX 722 ; N X ; B 10 0 704 662 ;\nC 89 ; WX 722 ; N Y ; B 22 0 703 662 ;\nC 90 ; WX 611 ; N Z ; B 9 0 597 662 ;\nC 91 ; WX 333 ; N bracketleft ; B 88 -156 299 662 ;\nC 92 ; WX 278 ; N backslash ; B -9 -14 287 676 ;\nC 93 ; WX 333 ; N bracketright ; B 34 -156 245 662 ;\nC 94 ; WX 469 ; N asciicircum ; B 24 297 446 662 ;\nC 95 ; WX 500 ; N underscore ; B 0 -125 500 -75 ;\nC 96 ; WX 333 ; N quoteleft ; B 115 433 254 676 ;\nC 97 ; WX 444 ; N a ; B 37 -10 442 460 ;\nC 98 ; WX 500 ; N b ; B 3 -10 468 683 ;\nC 99 ; WX 444 ; N c ; B 25 -10 412 460 ;\nC 100 ; WX 500 ; N d ; B 27 -10 491 683 ;\nC 101 ; WX 444 ; N e ; B 25 -10 424 460 ;\nC 102 ; WX 333 ; N f ; B 20 0 383 683 ; L i fi ; L l fl ;\nC 103 ; WX 500 ; N g ; B 28 -218 470 460 ;\nC 104 ; WX 500 ; N h ; B 9 0 487 683 ;\nC 105 ; WX 278 ; N i ; B 16 0 253 683 ;\nC 106 ; WX 278 ; N j ; B -70 -218 194 683 ;\nC 107 ; WX 500 ; N k ; B 7 0 505 683 ;\nC 108 ; WX 278 ; N l ; B 19 0 257 683 ;\nC 109 ; WX 778 ; N m ; B 16 0 775 460 ;\nC 110 ; WX 500 ; N n ; B 16 0 485 460 ;\nC 111 ; WX 500 ; N o ; B 29 -10 470 460 ;\nC 112 ; WX 500 ; N p ; B 5 -217 470 460 ;\nC 113 ; WX 500 ; N q ; B 24 -217 488 460 ;\nC 114 ; WX 333 ; N r ; B 5 0 335 460 ;\nC 115 ; WX 389 ; N s ; B 51 -10 348 460 ;\nC 116 ; WX 278 ; N t ; B 13 -10 279 579 ;\nC 117 ; WX 500 ; N u ; B 9 -10 479 450 ;\nC 118 ; WX 500 ; N v ; B 19 -14 477 450 ;\nC 119 ; WX 722 ; N w ; B 21 -14 694 450 ;\nC 120 ; WX 500 ; N x ; B 17 0 479 450 ;\nC 121 ; WX 500 ; N y ; B 14 -218 475 450 ;\nC 122 ; WX 444 ; N z ; B 27 0 418 450 ;\nC 123 ; WX 480 ; N braceleft ; B 100 -181 350 680 ;\nC 124 ; WX 200 ; N bar ; B 67 -218 133 782 ;\nC 125 ; WX 480 ; N braceright ; B 130 -181 380 680 ;\nC 126 ; WX 541 ; N asciitilde ; B 40 183 502 323 ;\nC 161 ; WX 333 ; N exclamdown ; B 97 -218 205 467 ;\nC 162 ; WX 500 ; N cent ; B 53 -138 448 579 ;\nC 163 ; WX 500 ; N sterling ; B 12 -8 490 676 ;\nC 164 ; WX 167 ; N fraction ; B -168 -14 331 676 ;\nC 165 ; WX 500 ; N yen ; B -53 0 512 662 ;\nC 166 ; WX 500 ; N florin ; B 7 -189 490 676 ;\nC 167 ; WX 500 ; N section ; B 70 -148 426 676 ;\nC 168 ; WX 500 ; N currency ; B -22 58 522 602 ;\nC 169 ; WX 180 ; N quotesingle ; B 48 431 133 676 ;\nC 170 ; WX 444 ; N quotedblleft ; B 43 433 414 676 ;\nC 171 ; WX 500 ; N guillemotleft ; B 42 33 456 416 ;\nC 172 ; WX 333 ; N guilsinglleft ; B 63 33 285 416 ;\nC 173 ; WX 333 ; N guilsinglright ; B 48 33 270 416 ;\nC 174 ; WX 556 ; N fi ; B 31 0 521 683 ;\nC 175 ; WX 556 ; N fl ; B 32 0 521 683 ;\nC 177 ; WX 500 ; N endash ; B 0 201 500 250 ;\nC 178 ; WX 500 ; N dagger ; B 59 -149 442 676 ;\nC 179 ; WX 500 ; N daggerdbl ; B 58 -153 442 676 ;\nC 180 ; WX 250 ; N periodcentered ; B 70 199 181 310 ;\nC 182 ; WX 453 ; N paragraph ; B -22 -154 450 662 ;\nC 183 ; WX 350 ; N bullet ; B 40 196 310 466 ;\nC 184 ; WX 333 ; N quotesinglbase ; B 79 -141 218 102 ;\nC 185 ; WX 444 ; N quotedblbase ; B 45 -141 416 102 ;\nC 186 ; WX 444 ; N quotedblright ; B 30 433 401 676 ;\nC 187 ; WX 500 ; N guillemotright ; B 44 33 458 416 ;\nC 188 ; WX 1000 ; N ellipsis ; B 111 -11 888 100 ;\nC 189 ; WX 1000 ; N perthousand ; B 7 -19 994 706 ;\nC 191 ; WX 444 ; N questiondown ; B 30 -218 376 466 ;\nC 193 ; WX 333 ; N grave ; B 19 507 242 678 ;\nC 194 ; WX 333 ; N acute ; B 93 507 317 678 ;\nC 195 ; WX 333 ; N circumflex ; B 11 507 322 674 ;\nC 196 ; WX 333 ; N tilde ; B 1 532 331 638 ;\nC 197 ; WX 333 ; N macron ; B 11 547 322 601 ;\nC 198 ; WX 333 ; N breve ; B 26 507 307 664 ;\nC 199 ; WX 333 ; N dotaccent ; B 118 581 216 681 ;\nC 200 ; WX 333 ; N dieresis ; B 18 581 315 681 ;\nC 202 ; WX 333 ; N ring ; B 67 512 266 711 ;\nC 203 ; WX 333 ; N cedilla ; B 52 -215 261 0 ;\nC 205 ; WX 333 ; N hungarumlaut ; B -3 507 377 678 ;\nC 206 ; WX 333 ; N ogonek ; B 62 -165 243 0 ;\nC 207 ; WX 333 ; N caron ; B 11 507 322 674 ;\nC 208 ; WX 1000 ; N emdash ; B 0 201 1000 250 ;\nC 225 ; WX 889 ; N AE ; B 0 0 863 662 ;\nC 227 ; WX 276 ; N ordfeminine ; B 4 394 270 676 ;\nC 232 ; WX 611 ; N Lslash ; B 12 0 598 662 ;\nC 233 ; WX 722 ; N Oslash ; B 34 -80 688 734 ;\nC 234 ; WX 889 ; N OE ; B 30 -6 885 668 ;\nC 235 ; WX 310 ; N ordmasculine ; B 6 394 304 676 ;\nC 241 ; WX 667 ; N ae ; B 38 -10 632 460 ;\nC 245 ; WX 278 ; N dotlessi ; B 16 0 253 460 ;\nC 248 ; WX 278 ; N lslash ; B 19 0 259 683 ;\nC 249 ; WX 500 ; N oslash ; B 29 -112 470 551 ;\nC 250 ; WX 722 ; N oe ; B 30 -10 690 460 ;\nC 251 ; WX 500 ; N germandbls ; B 12 -9 468 683 ;\nC -1 ; WX 333 ; N Idieresis ; B 18 0 315 835 ;\nC -1 ; WX 444 ; N eacute ; B 25 -10 424 678 ;\nC -1 ; WX 444 ; N abreve ; B 37 -10 442 664 ;\nC -1 ; WX 500 ; N uhungarumlaut ; B 9 -10 501 678 ;\nC -1 ; WX 444 ; N ecaron ; B 25 -10 424 674 ;\nC -1 ; WX 722 ; N Ydieresis ; B 22 0 703 835 ;\nC -1 ; WX 564 ; N divide ; B 30 -10 534 516 ;\nC -1 ; WX 722 ; N Yacute ; B 22 0 703 890 ;\nC -1 ; WX 722 ; N Acircumflex ; B 15 0 706 886 ;\nC -1 ; WX 444 ; N aacute ; B 37 -10 442 678 ;\nC -1 ; WX 722 ; N Ucircumflex ; B 14 -14 705 886 ;\nC -1 ; WX 500 ; N yacute ; B 14 -218 475 678 ;\nC -1 ; WX 389 ; N scommaaccent ; B 51 -218 348 460 ;\nC -1 ; WX 444 ; N ecircumflex ; B 25 -10 424 674 ;\nC -1 ; WX 722 ; N Uring ; B 14 -14 705 898 ;\nC -1 ; WX 722 ; N Udieresis ; B 14 -14 705 835 ;\nC -1 ; WX 444 ; N aogonek ; B 37 -165 469 460 ;\nC -1 ; WX 722 ; N Uacute ; B 14 -14 705 890 ;\nC -1 ; WX 500 ; N uogonek ; B 9 -155 487 450 ;\nC -1 ; WX 611 ; N Edieresis ; B 12 0 597 835 ;\nC -1 ; WX 722 ; N Dcroat ; B 16 0 685 662 ;\nC -1 ; WX 250 ; N commaaccent ; B 59 -218 184 -50 ;\nC -1 ; WX 760 ; N copyright ; B 38 -14 722 676 ;\nC -1 ; WX 611 ; N Emacron ; B 12 0 597 813 ;\nC -1 ; WX 444 ; N ccaron ; B 25 -10 412 674 ;\nC -1 ; WX 444 ; N aring ; B 37 -10 442 711 ;\nC -1 ; WX 722 ; N Ncommaaccent ; B 12 -198 707 662 ;\nC -1 ; WX 278 ; N lacute ; B 19 0 290 890 ;\nC -1 ; WX 444 ; N agrave ; B 37 -10 442 678 ;\nC -1 ; WX 611 ; N Tcommaaccent ; B 17 -218 593 662 ;\nC -1 ; WX 667 ; N Cacute ; B 28 -14 633 890 ;\nC -1 ; WX 444 ; N atilde ; B 37 -10 442 638 ;\nC -1 ; WX 611 ; N Edotaccent ; B 12 0 597 835 ;\nC -1 ; WX 389 ; N scaron ; B 39 -10 350 674 ;\nC -1 ; WX 389 ; N scedilla ; B 51 -215 348 460 ;\nC -1 ; WX 278 ; N iacute ; B 16 0 290 678 ;\nC -1 ; WX 471 ; N lozenge ; B 13 0 459 724 ;\nC -1 ; WX 667 ; N Rcaron ; B 17 0 659 886 ;\nC -1 ; WX 722 ; N Gcommaaccent ; B 32 -218 709 676 ;\nC -1 ; WX 500 ; N ucircumflex ; B 9 -10 479 674 ;\nC -1 ; WX 444 ; N acircumflex ; B 37 -10 442 674 ;\nC -1 ; WX 722 ; N Amacron ; B 15 0 706 813 ;\nC -1 ; WX 333 ; N rcaron ; B 5 0 335 674 ;\nC -1 ; WX 444 ; N ccedilla ; B 25 -215 412 460 ;\nC -1 ; WX 611 ; N Zdotaccent ; B 9 0 597 835 ;\nC -1 ; WX 556 ; N Thorn ; B 16 0 542 662 ;\nC -1 ; WX 722 ; N Omacron ; B 34 -14 688 813 ;\nC -1 ; WX 667 ; N Racute ; B 17 0 659 890 ;\nC -1 ; WX 556 ; N Sacute ; B 42 -14 491 890 ;\nC -1 ; WX 588 ; N dcaron ; B 27 -10 589 695 ;\nC -1 ; WX 722 ; N Umacron ; B 14 -14 705 813 ;\nC -1 ; WX 500 ; N uring ; B 9 -10 479 711 ;\nC -1 ; WX 300 ; N threesuperior ; B 15 262 291 676 ;\nC -1 ; WX 722 ; N Ograve ; B 34 -14 688 890 ;\nC -1 ; WX 722 ; N Agrave ; B 15 0 706 890 ;\nC -1 ; WX 722 ; N Abreve ; B 15 0 706 876 ;\nC -1 ; WX 564 ; N multiply ; B 38 8 527 497 ;\nC -1 ; WX 500 ; N uacute ; B 9 -10 479 678 ;\nC -1 ; WX 611 ; N Tcaron ; B 17 0 593 886 ;\nC -1 ; WX 476 ; N partialdiff ; B 17 -38 459 710 ;\nC -1 ; WX 500 ; N ydieresis ; B 14 -218 475 623 ;\nC -1 ; WX 722 ; N Nacute ; B 12 -11 707 890 ;\nC -1 ; WX 278 ; N icircumflex ; B -16 0 295 674 ;\nC -1 ; WX 611 ; N Ecircumflex ; B 12 0 597 886 ;\nC -1 ; WX 444 ; N adieresis ; B 37 -10 442 623 ;\nC -1 ; WX 444 ; N edieresis ; B 25 -10 424 623 ;\nC -1 ; WX 444 ; N cacute ; B 25 -10 413 678 ;\nC -1 ; WX 500 ; N nacute ; B 16 0 485 678 ;\nC -1 ; WX 500 ; N umacron ; B 9 -10 479 601 ;\nC -1 ; WX 722 ; N Ncaron ; B 12 -11 707 886 ;\nC -1 ; WX 333 ; N Iacute ; B 18 0 317 890 ;\nC -1 ; WX 564 ; N plusminus ; B 30 0 534 506 ;\nC -1 ; WX 200 ; N brokenbar ; B 67 -143 133 707 ;\nC -1 ; WX 760 ; N registered ; B 38 -14 722 676 ;\nC -1 ; WX 722 ; N Gbreve ; B 32 -14 709 876 ;\nC -1 ; WX 333 ; N Idotaccent ; B 18 0 315 835 ;\nC -1 ; WX 600 ; N summation ; B 15 -10 585 706 ;\nC -1 ; WX 611 ; N Egrave ; B 12 0 597 890 ;\nC -1 ; WX 333 ; N racute ; B 5 0 335 678 ;\nC -1 ; WX 500 ; N omacron ; B 29 -10 470 601 ;\nC -1 ; WX 611 ; N Zacute ; B 9 0 597 890 ;\nC -1 ; WX 611 ; N Zcaron ; B 9 0 597 886 ;\nC -1 ; WX 549 ; N greaterequal ; B 26 0 523 666 ;\nC -1 ; WX 722 ; N Eth ; B 16 0 685 662 ;\nC -1 ; WX 667 ; N Ccedilla ; B 28 -215 633 676 ;\nC -1 ; WX 278 ; N lcommaaccent ; B 19 -218 257 683 ;\nC -1 ; WX 326 ; N tcaron ; B 13 -10 318 722 ;\nC -1 ; WX 444 ; N eogonek ; B 25 -165 424 460 ;\nC -1 ; WX 722 ; N Uogonek ; B 14 -165 705 662 ;\nC -1 ; WX 722 ; N Aacute ; B 15 0 706 890 ;\nC -1 ; WX 722 ; N Adieresis ; B 15 0 706 835 ;\nC -1 ; WX 444 ; N egrave ; B 25 -10 424 678 ;\nC -1 ; WX 444 ; N zacute ; B 27 0 418 678 ;\nC -1 ; WX 278 ; N iogonek ; B 16 -165 265 683 ;\nC -1 ; WX 722 ; N Oacute ; B 34 -14 688 890 ;\nC -1 ; WX 500 ; N oacute ; B 29 -10 470 678 ;\nC -1 ; WX 444 ; N amacron ; B 37 -10 442 601 ;\nC -1 ; WX 389 ; N sacute ; B 51 -10 348 678 ;\nC -1 ; WX 278 ; N idieresis ; B -9 0 288 623 ;\nC -1 ; WX 722 ; N Ocircumflex ; B 34 -14 688 886 ;\nC -1 ; WX 722 ; N Ugrave ; B 14 -14 705 890 ;\nC -1 ; WX 612 ; N Delta ; B 6 0 608 688 ;\nC -1 ; WX 500 ; N thorn ; B 5 -217 470 683 ;\nC -1 ; WX 300 ; N twosuperior ; B 1 270 296 676 ;\nC -1 ; WX 722 ; N Odieresis ; B 34 -14 688 835 ;\nC -1 ; WX 500 ; N mu ; B 36 -218 512 450 ;\nC -1 ; WX 278 ; N igrave ; B -8 0 253 678 ;\nC -1 ; WX 500 ; N ohungarumlaut ; B 29 -10 491 678 ;\nC -1 ; WX 611 ; N Eogonek ; B 12 -165 597 662 ;\nC -1 ; WX 500 ; N dcroat ; B 27 -10 500 683 ;\nC -1 ; WX 750 ; N threequarters ; B 15 -14 718 676 ;\nC -1 ; WX 556 ; N Scedilla ; B 42 -215 491 676 ;\nC -1 ; WX 344 ; N lcaron ; B 19 0 347 695 ;\nC -1 ; WX 722 ; N Kcommaaccent ; B 34 -198 723 662 ;\nC -1 ; WX 611 ; N Lacute ; B 12 0 598 890 ;\nC -1 ; WX 980 ; N trademark ; B 30 256 957 662 ;\nC -1 ; WX 444 ; N edotaccent ; B 25 -10 424 623 ;\nC -1 ; WX 333 ; N Igrave ; B 18 0 315 890 ;\nC -1 ; WX 333 ; N Imacron ; B 11 0 322 813 ;\nC -1 ; WX 611 ; N Lcaron ; B 12 0 598 676 ;\nC -1 ; WX 750 ; N onehalf ; B 31 -14 746 676 ;\nC -1 ; WX 549 ; N lessequal ; B 26 0 523 666 ;\nC -1 ; WX 500 ; N ocircumflex ; B 29 -10 470 674 ;\nC -1 ; WX 500 ; N ntilde ; B 16 0 485 638 ;\nC -1 ; WX 722 ; N Uhungarumlaut ; B 14 -14 705 890 ;\nC -1 ; WX 611 ; N Eacute ; B 12 0 597 890 ;\nC -1 ; WX 444 ; N emacron ; B 25 -10 424 601 ;\nC -1 ; WX 500 ; N gbreve ; B 28 -218 470 664 ;\nC -1 ; WX 750 ; N onequarter ; B 37 -14 718 676 ;\nC -1 ; WX 556 ; N Scaron ; B 42 -14 491 886 ;\nC -1 ; WX 556 ; N Scommaaccent ; B 42 -218 491 676 ;\nC -1 ; WX 722 ; N Ohungarumlaut ; B 34 -14 688 890 ;\nC -1 ; WX 400 ; N degree ; B 57 390 343 676 ;\nC -1 ; WX 500 ; N ograve ; B 29 -10 470 678 ;\nC -1 ; WX 667 ; N Ccaron ; B 28 -14 633 886 ;\nC -1 ; WX 500 ; N ugrave ; B 9 -10 479 678 ;\nC -1 ; WX 453 ; N radical ; B 2 -60 452 768 ;\nC -1 ; WX 722 ; N Dcaron ; B 16 0 685 886 ;\nC -1 ; WX 333 ; N rcommaaccent ; B 5 -218 335 460 ;\nC -1 ; WX 722 ; N Ntilde ; B 12 -11 707 850 ;\nC -1 ; WX 500 ; N otilde ; B 29 -10 470 638 ;\nC -1 ; WX 667 ; N Rcommaaccent ; B 17 -198 659 662 ;\nC -1 ; WX 611 ; N Lcommaaccent ; B 12 -218 598 662 ;\nC -1 ; WX 722 ; N Atilde ; B 15 0 706 850 ;\nC -1 ; WX 722 ; N Aogonek ; B 15 -165 738 674 ;\nC -1 ; WX 722 ; N Aring ; B 15 0 706 898 ;\nC -1 ; WX 722 ; N Otilde ; B 34 -14 688 850 ;\nC -1 ; WX 444 ; N zdotaccent ; B 27 0 418 623 ;\nC -1 ; WX 611 ; N Ecaron ; B 12 0 597 886 ;\nC -1 ; WX 333 ; N Iogonek ; B 18 -165 315 662 ;\nC -1 ; WX 500 ; N kcommaaccent ; B 7 -218 505 683 ;\nC -1 ; WX 564 ; N minus ; B 30 220 534 286 ;\nC -1 ; WX 333 ; N Icircumflex ; B 11 0 322 886 ;\nC -1 ; WX 500 ; N ncaron ; B 16 0 485 674 ;\nC -1 ; WX 278 ; N tcommaaccent ; B 13 -218 279 579 ;\nC -1 ; WX 564 ; N logicalnot ; B 30 108 534 386 ;\nC -1 ; WX 500 ; N odieresis ; B 29 -10 470 623 ;\nC -1 ; WX 500 ; N udieresis ; B 9 -10 479 623 ;\nC -1 ; WX 549 ; N notequal ; B 12 -31 537 547 ;\nC -1 ; WX 500 ; N gcommaaccent ; B 28 -218 470 749 ;\nC -1 ; WX 500 ; N eth ; B 29 -10 471 686 ;\nC -1 ; WX 444 ; N zcaron ; B 27 0 418 674 ;\nC -1 ; WX 500 ; N ncommaaccent ; B 16 -218 485 460 ;\nC -1 ; WX 300 ; N onesuperior ; B 57 270 248 676 ;\nC -1 ; WX 278 ; N imacron ; B 6 0 271 601 ;\nC -1 ; WX 500 ; N Euro ; B 0 0 0 0 ;\nEndCharMetrics\nStartKernData\nStartKernPairs 2073\nKPX A C -40\nKPX A Cacute -40\nKPX A Ccaron -40\nKPX A Ccedilla -40\nKPX A G -40\nKPX A Gbreve -40\nKPX A Gcommaaccent -40\nKPX A O -55\nKPX A Oacute -55\nKPX A Ocircumflex -55\nKPX A Odieresis -55\nKPX A Ograve -55\nKPX A Ohungarumlaut -55\nKPX A Omacron -55\nKPX A Oslash -55\nKPX A Otilde -55\nKPX A Q -55\nKPX A T -111\nKPX A Tcaron -111\nKPX A Tcommaaccent -111\nKPX A U -55\nKPX A Uacute -55\nKPX A Ucircumflex -55\nKPX A Udieresis -55\nKPX A Ugrave -55\nKPX A Uhungarumlaut -55\nKPX A Umacron -55\nKPX A Uogonek -55\nKPX A Uring -55\nKPX A V -135\nKPX A W -90\nKPX A Y -105\nKPX A Yacute -105\nKPX A Ydieresis -105\nKPX A quoteright -111\nKPX A v -74\nKPX A w -92\nKPX A y -92\nKPX A yacute -92\nKPX A ydieresis -92\nKPX Aacute C -40\nKPX Aacute Cacute -40\nKPX Aacute Ccaron -40\nKPX Aacute Ccedilla -40\nKPX Aacute G -40\nKPX Aacute Gbreve -40\nKPX Aacute Gcommaaccent -40\nKPX Aacute O -55\nKPX Aacute Oacute -55\nKPX Aacute Ocircumflex -55\nKPX Aacute Odieresis -55\nKPX Aacute Ograve -55\nKPX Aacute Ohungarumlaut -55\nKPX Aacute Omacron -55\nKPX Aacute Oslash -55\nKPX Aacute Otilde -55\nKPX Aacute Q -55\nKPX Aacute T -111\nKPX Aacute Tcaron -111\nKPX Aacute Tcommaaccent -111\nKPX Aacute U -55\nKPX Aacute Uacute -55\nKPX Aacute Ucircumflex -55\nKPX Aacute Udieresis -55\nKPX Aacute Ugrave -55\nKPX Aacute Uhungarumlaut -55\nKPX Aacute Umacron -55\nKPX Aacute Uogonek -55\nKPX Aacute Uring -55\nKPX Aacute V -135\nKPX Aacute W -90\nKPX Aacute Y -105\nKPX Aacute Yacute -105\nKPX Aacute Ydieresis -105\nKPX Aacute quoteright -111\nKPX Aacute v -74\nKPX Aacute w -92\nKPX Aacute y -92\nKPX Aacute yacute -92\nKPX Aacute ydieresis -92\nKPX Abreve C -40\nKPX Abreve Cacute -40\nKPX Abreve Ccaron -40\nKPX Abreve Ccedilla -40\nKPX Abreve G -40\nKPX Abreve Gbreve -40\nKPX Abreve Gcommaaccent -40\nKPX Abreve O -55\nKPX Abreve Oacute -55\nKPX Abreve Ocircumflex -55\nKPX Abreve Odieresis -55\nKPX Abreve Ograve -55\nKPX Abreve Ohungarumlaut -55\nKPX Abreve Omacron -55\nKPX Abreve Oslash -55\nKPX Abreve Otilde -55\nKPX Abreve Q -55\nKPX Abreve T -111\nKPX Abreve Tcaron -111\nKPX Abreve Tcommaaccent -111\nKPX Abreve U -55\nKPX Abreve Uacute -55\nKPX Abreve Ucircumflex -55\nKPX Abreve Udieresis -55\nKPX Abreve Ugrave -55\nKPX Abreve Uhungarumlaut -55\nKPX Abreve Umacron -55\nKPX Abreve Uogonek -55\nKPX Abreve Uring -55\nKPX Abreve V -135\nKPX Abreve W -90\nKPX Abreve Y -105\nKPX Abreve Yacute -105\nKPX Abreve Ydieresis -105\nKPX Abreve quoteright -111\nKPX Abreve v -74\nKPX Abreve w -92\nKPX Abreve y -92\nKPX Abreve yacute -92\nKPX Abreve ydieresis -92\nKPX Acircumflex C -40\nKPX Acircumflex Cacute -40\nKPX Acircumflex Ccaron -40\nKPX Acircumflex Ccedilla -40\nKPX Acircumflex G -40\nKPX Acircumflex Gbreve -40\nKPX Acircumflex Gcommaaccent -40\nKPX Acircumflex O -55\nKPX Acircumflex Oacute -55\nKPX Acircumflex Ocircumflex -55\nKPX Acircumflex Odieresis -55\nKPX Acircumflex Ograve -55\nKPX Acircumflex Ohungarumlaut -55\nKPX Acircumflex Omacron -55\nKPX Acircumflex Oslash -55\nKPX Acircumflex Otilde -55\nKPX Acircumflex Q -55\nKPX Acircumflex T -111\nKPX Acircumflex Tcaron -111\nKPX Acircumflex Tcommaaccent -111\nKPX Acircumflex U -55\nKPX Acircumflex Uacute -55\nKPX Acircumflex Ucircumflex -55\nKPX Acircumflex Udieresis -55\nKPX Acircumflex Ugrave -55\nKPX Acircumflex Uhungarumlaut -55\nKPX Acircumflex Umacron -55\nKPX Acircumflex Uogonek -55\nKPX Acircumflex Uring -55\nKPX Acircumflex V -135\nKPX Acircumflex W -90\nKPX Acircumflex Y -105\nKPX Acircumflex Yacute -105\nKPX Acircumflex Ydieresis -105\nKPX Acircumflex quoteright -111\nKPX Acircumflex v -74\nKPX Acircumflex w -92\nKPX Acircumflex y -92\nKPX Acircumflex yacute -92\nKPX Acircumflex ydieresis -92\nKPX Adieresis C -40\nKPX Adieresis Cacute -40\nKPX Adieresis Ccaron -40\nKPX Adieresis Ccedilla -40\nKPX Adieresis G -40\nKPX Adieresis Gbreve -40\nKPX Adieresis Gcommaaccent -40\nKPX Adieresis O -55\nKPX Adieresis Oacute -55\nKPX Adieresis Ocircumflex -55\nKPX Adieresis Odieresis -55\nKPX Adieresis Ograve -55\nKPX Adieresis Ohungarumlaut -55\nKPX Adieresis Omacron -55\nKPX Adieresis Oslash -55\nKPX Adieresis Otilde -55\nKPX Adieresis Q -55\nKPX Adieresis T -111\nKPX Adieresis Tcaron -111\nKPX Adieresis Tcommaaccent -111\nKPX Adieresis U -55\nKPX Adieresis Uacute -55\nKPX Adieresis Ucircumflex -55\nKPX Adieresis Udieresis -55\nKPX Adieresis Ugrave -55\nKPX Adieresis Uhungarumlaut -55\nKPX Adieresis Umacron -55\nKPX Adieresis Uogonek -55\nKPX Adieresis Uring -55\nKPX Adieresis V -135\nKPX Adieresis W -90\nKPX Adieresis Y -105\nKPX Adieresis Yacute -105\nKPX Adieresis Ydieresis -105\nKPX Adieresis quoteright -111\nKPX Adieresis v -74\nKPX Adieresis w -92\nKPX Adieresis y -92\nKPX Adieresis yacute -92\nKPX Adieresis ydieresis -92\nKPX Agrave C -40\nKPX Agrave Cacute -40\nKPX Agrave Ccaron -40\nKPX Agrave Ccedilla -40\nKPX Agrave G -40\nKPX Agrave Gbreve -40\nKPX Agrave Gcommaaccent -40\nKPX Agrave O -55\nKPX Agrave Oacute -55\nKPX Agrave Ocircumflex -55\nKPX Agrave Odieresis -55\nKPX Agrave Ograve -55\nKPX Agrave Ohungarumlaut -55\nKPX Agrave Omacron -55\nKPX Agrave Oslash -55\nKPX Agrave Otilde -55\nKPX Agrave Q -55\nKPX Agrave T -111\nKPX Agrave Tcaron -111\nKPX Agrave Tcommaaccent -111\nKPX Agrave U -55\nKPX Agrave Uacute -55\nKPX Agrave Ucircumflex -55\nKPX Agrave Udieresis -55\nKPX Agrave Ugrave -55\nKPX Agrave Uhungarumlaut -55\nKPX Agrave Umacron -55\nKPX Agrave Uogonek -55\nKPX Agrave Uring -55\nKPX Agrave V -135\nKPX Agrave W -90\nKPX Agrave Y -105\nKPX Agrave Yacute -105\nKPX Agrave Ydieresis -105\nKPX Agrave quoteright -111\nKPX Agrave v -74\nKPX Agrave w -92\nKPX Agrave y -92\nKPX Agrave yacute -92\nKPX Agrave ydieresis -92\nKPX Amacron C -40\nKPX Amacron Cacute -40\nKPX Amacron Ccaron -40\nKPX Amacron Ccedilla -40\nKPX Amacron G -40\nKPX Amacron Gbreve -40\nKPX Amacron Gcommaaccent -40\nKPX Amacron O -55\nKPX Amacron Oacute -55\nKPX Amacron Ocircumflex -55\nKPX Amacron Odieresis -55\nKPX Amacron Ograve -55\nKPX Amacron Ohungarumlaut -55\nKPX Amacron Omacron -55\nKPX Amacron Oslash -55\nKPX Amacron Otilde -55\nKPX Amacron Q -55\nKPX Amacron T -111\nKPX Amacron Tcaron -111\nKPX Amacron Tcommaaccent -111\nKPX Amacron U -55\nKPX Amacron Uacute -55\nKPX Amacron Ucircumflex -55\nKPX Amacron Udieresis -55\nKPX Amacron Ugrave -55\nKPX Amacron Uhungarumlaut -55\nKPX Amacron Umacron -55\nKPX Amacron Uogonek -55\nKPX Amacron Uring -55\nKPX Amacron V -135\nKPX Amacron W -90\nKPX Amacron Y -105\nKPX Amacron Yacute -105\nKPX Amacron Ydieresis -105\nKPX Amacron quoteright -111\nKPX Amacron v -74\nKPX Amacron w -92\nKPX Amacron y -92\nKPX Amacron yacute -92\nKPX Amacron ydieresis -92\nKPX Aogonek C -40\nKPX Aogonek Cacute -40\nKPX Aogonek Ccaron -40\nKPX Aogonek Ccedilla -40\nKPX Aogonek G -40\nKPX Aogonek Gbreve -40\nKPX Aogonek Gcommaaccent -40\nKPX Aogonek O -55\nKPX Aogonek Oacute -55\nKPX Aogonek Ocircumflex -55\nKPX Aogonek Odieresis -55\nKPX Aogonek Ograve -55\nKPX Aogonek Ohungarumlaut -55\nKPX Aogonek Omacron -55\nKPX Aogonek Oslash -55\nKPX Aogonek Otilde -55\nKPX Aogonek Q -55\nKPX Aogonek T -111\nKPX Aogonek Tcaron -111\nKPX Aogonek Tcommaaccent -111\nKPX Aogonek U -55\nKPX Aogonek Uacute -55\nKPX Aogonek Ucircumflex -55\nKPX Aogonek Udieresis -55\nKPX Aogonek Ugrave -55\nKPX Aogonek Uhungarumlaut -55\nKPX Aogonek Umacron -55\nKPX Aogonek Uogonek -55\nKPX Aogonek Uring -55\nKPX Aogonek V -135\nKPX Aogonek W -90\nKPX Aogonek Y -105\nKPX Aogonek Yacute -105\nKPX Aogonek Ydieresis -105\nKPX Aogonek quoteright -111\nKPX Aogonek v -74\nKPX Aogonek w -52\nKPX Aogonek y -52\nKPX Aogonek yacute -52\nKPX Aogonek ydieresis -52\nKPX Aring C -40\nKPX Aring Cacute -40\nKPX Aring Ccaron -40\nKPX Aring Ccedilla -40\nKPX Aring G -40\nKPX Aring Gbreve -40\nKPX Aring Gcommaaccent -40\nKPX Aring O -55\nKPX Aring Oacute -55\nKPX Aring Ocircumflex -55\nKPX Aring Odieresis -55\nKPX Aring Ograve -55\nKPX Aring Ohungarumlaut -55\nKPX Aring Omacron -55\nKPX Aring Oslash -55\nKPX Aring Otilde -55\nKPX Aring Q -55\nKPX Aring T -111\nKPX Aring Tcaron -111\nKPX Aring Tcommaaccent -111\nKPX Aring U -55\nKPX Aring Uacute -55\nKPX Aring Ucircumflex -55\nKPX Aring Udieresis -55\nKPX Aring Ugrave -55\nKPX Aring Uhungarumlaut -55\nKPX Aring Umacron -55\nKPX Aring Uogonek -55\nKPX Aring Uring -55\nKPX Aring V -135\nKPX Aring W -90\nKPX Aring Y -105\nKPX Aring Yacute -105\nKPX Aring Ydieresis -105\nKPX Aring quoteright -111\nKPX Aring v -74\nKPX Aring w -92\nKPX Aring y -92\nKPX Aring yacute -92\nKPX Aring ydieresis -92\nKPX Atilde C -40\nKPX Atilde Cacute -40\nKPX Atilde Ccaron -40\nKPX Atilde Ccedilla -40\nKPX Atilde G -40\nKPX Atilde Gbreve -40\nKPX Atilde Gcommaaccent -40\nKPX Atilde O -55\nKPX Atilde Oacute -55\nKPX Atilde Ocircumflex -55\nKPX Atilde Odieresis -55\nKPX Atilde Ograve -55\nKPX Atilde Ohungarumlaut -55\nKPX Atilde Omacron -55\nKPX Atilde Oslash -55\nKPX Atilde Otilde -55\nKPX Atilde Q -55\nKPX Atilde T -111\nKPX Atilde Tcaron -111\nKPX Atilde Tcommaaccent -111\nKPX Atilde U -55\nKPX Atilde Uacute -55\nKPX Atilde Ucircumflex -55\nKPX Atilde Udieresis -55\nKPX Atilde Ugrave -55\nKPX Atilde Uhungarumlaut -55\nKPX Atilde Umacron -55\nKPX Atilde Uogonek -55\nKPX Atilde Uring -55\nKPX Atilde V -135\nKPX Atilde W -90\nKPX Atilde Y -105\nKPX Atilde Yacute -105\nKPX Atilde Ydieresis -105\nKPX Atilde quoteright -111\nKPX Atilde v -74\nKPX Atilde w -92\nKPX Atilde y -92\nKPX Atilde yacute -92\nKPX Atilde ydieresis -92\nKPX B A -35\nKPX B Aacute -35\nKPX B Abreve -35\nKPX B Acircumflex -35\nKPX B Adieresis -35\nKPX B Agrave -35\nKPX B Amacron -35\nKPX B Aogonek -35\nKPX B Aring -35\nKPX B Atilde -35\nKPX B U -10\nKPX B Uacute -10\nKPX B Ucircumflex -10\nKPX B Udieresis -10\nKPX B Ugrave -10\nKPX B Uhungarumlaut -10\nKPX B Umacron -10\nKPX B Uogonek -10\nKPX B Uring -10\nKPX D A -40\nKPX D Aacute -40\nKPX D Abreve -40\nKPX D Acircumflex -40\nKPX D Adieresis -40\nKPX D Agrave -40\nKPX D Amacron -40\nKPX D Aogonek -40\nKPX D Aring -40\nKPX D Atilde -40\nKPX D V -40\nKPX D W -30\nKPX D Y -55\nKPX D Yacute -55\nKPX D Ydieresis -55\nKPX Dcaron A -40\nKPX Dcaron Aacute -40\nKPX Dcaron Abreve -40\nKPX Dcaron Acircumflex -40\nKPX Dcaron Adieresis -40\nKPX Dcaron Agrave -40\nKPX Dcaron Amacron -40\nKPX Dcaron Aogonek -40\nKPX Dcaron Aring -40\nKPX Dcaron Atilde -40\nKPX Dcaron V -40\nKPX Dcaron W -30\nKPX Dcaron Y -55\nKPX Dcaron Yacute -55\nKPX Dcaron Ydieresis -55\nKPX Dcroat A -40\nKPX Dcroat Aacute -40\nKPX Dcroat Abreve -40\nKPX Dcroat Acircumflex -40\nKPX Dcroat Adieresis -40\nKPX Dcroat Agrave -40\nKPX Dcroat Amacron -40\nKPX Dcroat Aogonek -40\nKPX Dcroat Aring -40\nKPX Dcroat Atilde -40\nKPX Dcroat V -40\nKPX Dcroat W -30\nKPX Dcroat Y -55\nKPX Dcroat Yacute -55\nKPX Dcroat Ydieresis -55\nKPX F A -74\nKPX F Aacute -74\nKPX F Abreve -74\nKPX F Acircumflex -74\nKPX F Adieresis -74\nKPX F Agrave -74\nKPX F Amacron -74\nKPX F Aogonek -74\nKPX F Aring -74\nKPX F Atilde -74\nKPX F a -15\nKPX F aacute -15\nKPX F abreve -15\nKPX F acircumflex -15\nKPX F adieresis -15\nKPX F agrave -15\nKPX F amacron -15\nKPX F aogonek -15\nKPX F aring -15\nKPX F atilde -15\nKPX F comma -80\nKPX F o -15\nKPX F oacute -15\nKPX F ocircumflex -15\nKPX F odieresis -15\nKPX F ograve -15\nKPX F ohungarumlaut -15\nKPX F omacron -15\nKPX F oslash -15\nKPX F otilde -15\nKPX F period -80\nKPX J A -60\nKPX J Aacute -60\nKPX J Abreve -60\nKPX J Acircumflex -60\nKPX J Adieresis -60\nKPX J Agrave -60\nKPX J Amacron -60\nKPX J Aogonek -60\nKPX J Aring -60\nKPX J Atilde -60\nKPX K O -30\nKPX K Oacute -30\nKPX K Ocircumflex -30\nKPX K Odieresis -30\nKPX K Ograve -30\nKPX K Ohungarumlaut -30\nKPX K Omacron -30\nKPX K Oslash -30\nKPX K Otilde -30\nKPX K e -25\nKPX K eacute -25\nKPX K ecaron -25\nKPX K ecircumflex -25\nKPX K edieresis -25\nKPX K edotaccent -25\nKPX K egrave -25\nKPX K emacron -25\nKPX K eogonek -25\nKPX K o -35\nKPX K oacute -35\nKPX K ocircumflex -35\nKPX K odieresis -35\nKPX K ograve -35\nKPX K ohungarumlaut -35\nKPX K omacron -35\nKPX K oslash -35\nKPX K otilde -35\nKPX K u -15\nKPX K uacute -15\nKPX K ucircumflex -15\nKPX K udieresis -15\nKPX K ugrave -15\nKPX K uhungarumlaut -15\nKPX K umacron -15\nKPX K uogonek -15\nKPX K uring -15\nKPX K y -25\nKPX K yacute -25\nKPX K ydieresis -25\nKPX Kcommaaccent O -30\nKPX Kcommaaccent Oacute -30\nKPX Kcommaaccent Ocircumflex -30\nKPX Kcommaaccent Odieresis -30\nKPX Kcommaaccent Ograve -30\nKPX Kcommaaccent Ohungarumlaut -30\nKPX Kcommaaccent Omacron -30\nKPX Kcommaaccent Oslash -30\nKPX Kcommaaccent Otilde -30\nKPX Kcommaaccent e -25\nKPX Kcommaaccent eacute -25\nKPX Kcommaaccent ecaron -25\nKPX Kcommaaccent ecircumflex -25\nKPX Kcommaaccent edieresis -25\nKPX Kcommaaccent edotaccent -25\nKPX Kcommaaccent egrave -25\nKPX Kcommaaccent emacron -25\nKPX Kcommaaccent eogonek -25\nKPX Kcommaaccent o -35\nKPX Kcommaaccent oacute -35\nKPX Kcommaaccent ocircumflex -35\nKPX Kcommaaccent odieresis -35\nKPX Kcommaaccent ograve -35\nKPX Kcommaaccent ohungarumlaut -35\nKPX Kcommaaccent omacron -35\nKPX Kcommaaccent oslash -35\nKPX Kcommaaccent otilde -35\nKPX Kcommaaccent u -15\nKPX Kcommaaccent uacute -15\nKPX Kcommaaccent ucircumflex -15\nKPX Kcommaaccent udieresis -15\nKPX Kcommaaccent ugrave -15\nKPX Kcommaaccent uhungarumlaut -15\nKPX Kcommaaccent umacron -15\nKPX Kcommaaccent uogonek -15\nKPX Kcommaaccent uring -15\nKPX Kcommaaccent y -25\nKPX Kcommaaccent yacute -25\nKPX Kcommaaccent ydieresis -25\nKPX L T -92\nKPX L Tcaron -92\nKPX L Tcommaaccent -92\nKPX L V -100\nKPX L W -74\nKPX L Y -100\nKPX L Yacute -100\nKPX L Ydieresis -100\nKPX L quoteright -92\nKPX L y -55\nKPX L yacute -55\nKPX L ydieresis -55\nKPX Lacute T -92\nKPX Lacute Tcaron -92\nKPX Lacute Tcommaaccent -92\nKPX Lacute V -100\nKPX Lacute W -74\nKPX Lacute Y -100\nKPX Lacute Yacute -100\nKPX Lacute Ydieresis -100\nKPX Lacute quoteright -92\nKPX Lacute y -55\nKPX Lacute yacute -55\nKPX Lacute ydieresis -55\nKPX Lcaron quoteright -92\nKPX Lcaron y -55\nKPX Lcaron yacute -55\nKPX Lcaron ydieresis -55\nKPX Lcommaaccent T -92\nKPX Lcommaaccent Tcaron -92\nKPX Lcommaaccent Tcommaaccent -92\nKPX Lcommaaccent V -100\nKPX Lcommaaccent W -74\nKPX Lcommaaccent Y -100\nKPX Lcommaaccent Yacute -100\nKPX Lcommaaccent Ydieresis -100\nKPX Lcommaaccent quoteright -92\nKPX Lcommaaccent y -55\nKPX Lcommaaccent yacute -55\nKPX Lcommaaccent ydieresis -55\nKPX Lslash T -92\nKPX Lslash Tcaron -92\nKPX Lslash Tcommaaccent -92\nKPX Lslash V -100\nKPX Lslash W -74\nKPX Lslash Y -100\nKPX Lslash Yacute -100\nKPX Lslash Ydieresis -100\nKPX Lslash quoteright -92\nKPX Lslash y -55\nKPX Lslash yacute -55\nKPX Lslash ydieresis -55\nKPX N A -35\nKPX N Aacute -35\nKPX N Abreve -35\nKPX N Acircumflex -35\nKPX N Adieresis -35\nKPX N Agrave -35\nKPX N Amacron -35\nKPX N Aogonek -35\nKPX N Aring -35\nKPX N Atilde -35\nKPX Nacute A -35\nKPX Nacute Aacute -35\nKPX Nacute Abreve -35\nKPX Nacute Acircumflex -35\nKPX Nacute Adieresis -35\nKPX Nacute Agrave -35\nKPX Nacute Amacron -35\nKPX Nacute Aogonek -35\nKPX Nacute Aring -35\nKPX Nacute Atilde -35\nKPX Ncaron A -35\nKPX Ncaron Aacute -35\nKPX Ncaron Abreve -35\nKPX Ncaron Acircumflex -35\nKPX Ncaron Adieresis -35\nKPX Ncaron Agrave -35\nKPX Ncaron Amacron -35\nKPX Ncaron Aogonek -35\nKPX Ncaron Aring -35\nKPX Ncaron Atilde -35\nKPX Ncommaaccent A -35\nKPX Ncommaaccent Aacute -35\nKPX Ncommaaccent Abreve -35\nKPX Ncommaaccent Acircumflex -35\nKPX Ncommaaccent Adieresis -35\nKPX Ncommaaccent Agrave -35\nKPX Ncommaaccent Amacron -35\nKPX Ncommaaccent Aogonek -35\nKPX Ncommaaccent Aring -35\nKPX Ncommaaccent Atilde -35\nKPX Ntilde A -35\nKPX Ntilde Aacute -35\nKPX Ntilde Abreve -35\nKPX Ntilde Acircumflex -35\nKPX Ntilde Adieresis -35\nKPX Ntilde Agrave -35\nKPX Ntilde Amacron -35\nKPX Ntilde Aogonek -35\nKPX Ntilde Aring -35\nKPX Ntilde Atilde -35\nKPX O A -35\nKPX O Aacute -35\nKPX O Abreve -35\nKPX O Acircumflex -35\nKPX O Adieresis -35\nKPX O Agrave -35\nKPX O Amacron -35\nKPX O Aogonek -35\nKPX O Aring -35\nKPX O Atilde -35\nKPX O T -40\nKPX O Tcaron -40\nKPX O Tcommaaccent -40\nKPX O V -50\nKPX O W -35\nKPX O X -40\nKPX O Y -50\nKPX O Yacute -50\nKPX O Ydieresis -50\nKPX Oacute A -35\nKPX Oacute Aacute -35\nKPX Oacute Abreve -35\nKPX Oacute Acircumflex -35\nKPX Oacute Adieresis -35\nKPX Oacute Agrave -35\nKPX Oacute Amacron -35\nKPX Oacute Aogonek -35\nKPX Oacute Aring -35\nKPX Oacute Atilde -35\nKPX Oacute T -40\nKPX Oacute Tcaron -40\nKPX Oacute Tcommaaccent -40\nKPX Oacute V -50\nKPX Oacute W -35\nKPX Oacute X -40\nKPX Oacute Y -50\nKPX Oacute Yacute -50\nKPX Oacute Ydieresis -50\nKPX Ocircumflex A -35\nKPX Ocircumflex Aacute -35\nKPX Ocircumflex Abreve -35\nKPX Ocircumflex Acircumflex -35\nKPX Ocircumflex Adieresis -35\nKPX Ocircumflex Agrave -35\nKPX Ocircumflex Amacron -35\nKPX Ocircumflex Aogonek -35\nKPX Ocircumflex Aring -35\nKPX Ocircumflex Atilde -35\nKPX Ocircumflex T -40\nKPX Ocircumflex Tcaron -40\nKPX Ocircumflex Tcommaaccent -40\nKPX Ocircumflex V -50\nKPX Ocircumflex W -35\nKPX Ocircumflex X -40\nKPX Ocircumflex Y -50\nKPX Ocircumflex Yacute -50\nKPX Ocircumflex Ydieresis -50\nKPX Odieresis A -35\nKPX Odieresis Aacute -35\nKPX Odieresis Abreve -35\nKPX Odieresis Acircumflex -35\nKPX Odieresis Adieresis -35\nKPX Odieresis Agrave -35\nKPX Odieresis Amacron -35\nKPX Odieresis Aogonek -35\nKPX Odieresis Aring -35\nKPX Odieresis Atilde -35\nKPX Odieresis T -40\nKPX Odieresis Tcaron -40\nKPX Odieresis Tcommaaccent -40\nKPX Odieresis V -50\nKPX Odieresis W -35\nKPX Odieresis X -40\nKPX Odieresis Y -50\nKPX Odieresis Yacute -50\nKPX Odieresis Ydieresis -50\nKPX Ograve A -35\nKPX Ograve Aacute -35\nKPX Ograve Abreve -35\nKPX Ograve Acircumflex -35\nKPX Ograve Adieresis -35\nKPX Ograve Agrave -35\nKPX Ograve Amacron -35\nKPX Ograve Aogonek -35\nKPX Ograve Aring -35\nKPX Ograve Atilde -35\nKPX Ograve T -40\nKPX Ograve Tcaron -40\nKPX Ograve Tcommaaccent -40\nKPX Ograve V -50\nKPX Ograve W -35\nKPX Ograve X -40\nKPX Ograve Y -50\nKPX Ograve Yacute -50\nKPX Ograve Ydieresis -50\nKPX Ohungarumlaut A -35\nKPX Ohungarumlaut Aacute -35\nKPX Ohungarumlaut Abreve -35\nKPX Ohungarumlaut Acircumflex -35\nKPX Ohungarumlaut Adieresis -35\nKPX Ohungarumlaut Agrave -35\nKPX Ohungarumlaut Amacron -35\nKPX Ohungarumlaut Aogonek -35\nKPX Ohungarumlaut Aring -35\nKPX Ohungarumlaut Atilde -35\nKPX Ohungarumlaut T -40\nKPX Ohungarumlaut Tcaron -40\nKPX Ohungarumlaut Tcommaaccent -40\nKPX Ohungarumlaut V -50\nKPX Ohungarumlaut W -35\nKPX Ohungarumlaut X -40\nKPX Ohungarumlaut Y -50\nKPX Ohungarumlaut Yacute -50\nKPX Ohungarumlaut Ydieresis -50\nKPX Omacron A -35\nKPX Omacron Aacute -35\nKPX Omacron Abreve -35\nKPX Omacron Acircumflex -35\nKPX Omacron Adieresis -35\nKPX Omacron Agrave -35\nKPX Omacron Amacron -35\nKPX Omacron Aogonek -35\nKPX Omacron Aring -35\nKPX Omacron Atilde -35\nKPX Omacron T -40\nKPX Omacron Tcaron -40\nKPX Omacron Tcommaaccent -40\nKPX Omacron V -50\nKPX Omacron W -35\nKPX Omacron X -40\nKPX Omacron Y -50\nKPX Omacron Yacute -50\nKPX Omacron Ydieresis -50\nKPX Oslash A -35\nKPX Oslash Aacute -35\nKPX Oslash Abreve -35\nKPX Oslash Acircumflex -35\nKPX Oslash Adieresis -35\nKPX Oslash Agrave -35\nKPX Oslash Amacron -35\nKPX Oslash Aogonek -35\nKPX Oslash Aring -35\nKPX Oslash Atilde -35\nKPX Oslash T -40\nKPX Oslash Tcaron -40\nKPX Oslash Tcommaaccent -40\nKPX Oslash V -50\nKPX Oslash W -35\nKPX Oslash X -40\nKPX Oslash Y -50\nKPX Oslash Yacute -50\nKPX Oslash Ydieresis -50\nKPX Otilde A -35\nKPX Otilde Aacute -35\nKPX Otilde Abreve -35\nKPX Otilde Acircumflex -35\nKPX Otilde Adieresis -35\nKPX Otilde Agrave -35\nKPX Otilde Amacron -35\nKPX Otilde Aogonek -35\nKPX Otilde Aring -35\nKPX Otilde Atilde -35\nKPX Otilde T -40\nKPX Otilde Tcaron -40\nKPX Otilde Tcommaaccent -40\nKPX Otilde V -50\nKPX Otilde W -35\nKPX Otilde X -40\nKPX Otilde Y -50\nKPX Otilde Yacute -50\nKPX Otilde Ydieresis -50\nKPX P A -92\nKPX P Aacute -92\nKPX P Abreve -92\nKPX P Acircumflex -92\nKPX P Adieresis -92\nKPX P Agrave -92\nKPX P Amacron -92\nKPX P Aogonek -92\nKPX P Aring -92\nKPX P Atilde -92\nKPX P a -15\nKPX P aacute -15\nKPX P abreve -15\nKPX P acircumflex -15\nKPX P adieresis -15\nKPX P agrave -15\nKPX P amacron -15\nKPX P aogonek -15\nKPX P aring -15\nKPX P atilde -15\nKPX P comma -111\nKPX P period -111\nKPX Q U -10\nKPX Q Uacute -10\nKPX Q Ucircumflex -10\nKPX Q Udieresis -10\nKPX Q Ugrave -10\nKPX Q Uhungarumlaut -10\nKPX Q Umacron -10\nKPX Q Uogonek -10\nKPX Q Uring -10\nKPX R O -40\nKPX R Oacute -40\nKPX R Ocircumflex -40\nKPX R Odieresis -40\nKPX R Ograve -40\nKPX R Ohungarumlaut -40\nKPX R Omacron -40\nKPX R Oslash -40\nKPX R Otilde -40\nKPX R T -60\nKPX R Tcaron -60\nKPX R Tcommaaccent -60\nKPX R U -40\nKPX R Uacute -40\nKPX R Ucircumflex -40\nKPX R Udieresis -40\nKPX R Ugrave -40\nKPX R Uhungarumlaut -40\nKPX R Umacron -40\nKPX R Uogonek -40\nKPX R Uring -40\nKPX R V -80\nKPX R W -55\nKPX R Y -65\nKPX R Yacute -65\nKPX R Ydieresis -65\nKPX Racute O -40\nKPX Racute Oacute -40\nKPX Racute Ocircumflex -40\nKPX Racute Odieresis -40\nKPX Racute Ograve -40\nKPX Racute Ohungarumlaut -40\nKPX Racute Omacron -40\nKPX Racute Oslash -40\nKPX Racute Otilde -40\nKPX Racute T -60\nKPX Racute Tcaron -60\nKPX Racute Tcommaaccent -60\nKPX Racute U -40\nKPX Racute Uacute -40\nKPX Racute Ucircumflex -40\nKPX Racute Udieresis -40\nKPX Racute Ugrave -40\nKPX Racute Uhungarumlaut -40\nKPX Racute Umacron -40\nKPX Racute Uogonek -40\nKPX Racute Uring -40\nKPX Racute V -80\nKPX Racute W -55\nKPX Racute Y -65\nKPX Racute Yacute -65\nKPX Racute Ydieresis -65\nKPX Rcaron O -40\nKPX Rcaron Oacute -40\nKPX Rcaron Ocircumflex -40\nKPX Rcaron Odieresis -40\nKPX Rcaron Ograve -40\nKPX Rcaron Ohungarumlaut -40\nKPX Rcaron Omacron -40\nKPX Rcaron Oslash -40\nKPX Rcaron Otilde -40\nKPX Rcaron T -60\nKPX Rcaron Tcaron -60\nKPX Rcaron Tcommaaccent -60\nKPX Rcaron U -40\nKPX Rcaron Uacute -40\nKPX Rcaron Ucircumflex -40\nKPX Rcaron Udieresis -40\nKPX Rcaron Ugrave -40\nKPX Rcaron Uhungarumlaut -40\nKPX Rcaron Umacron -40\nKPX Rcaron Uogonek -40\nKPX Rcaron Uring -40\nKPX Rcaron V -80\nKPX Rcaron W -55\nKPX Rcaron Y -65\nKPX Rcaron Yacute -65\nKPX Rcaron Ydieresis -65\nKPX Rcommaaccent O -40\nKPX Rcommaaccent Oacute -40\nKPX Rcommaaccent Ocircumflex -40\nKPX Rcommaaccent Odieresis -40\nKPX Rcommaaccent Ograve -40\nKPX Rcommaaccent Ohungarumlaut -40\nKPX Rcommaaccent Omacron -40\nKPX Rcommaaccent Oslash -40\nKPX Rcommaaccent Otilde -40\nKPX Rcommaaccent T -60\nKPX Rcommaaccent Tcaron -60\nKPX Rcommaaccent Tcommaaccent -60\nKPX Rcommaaccent U -40\nKPX Rcommaaccent Uacute -40\nKPX Rcommaaccent Ucircumflex -40\nKPX Rcommaaccent Udieresis -40\nKPX Rcommaaccent Ugrave -40\nKPX Rcommaaccent Uhungarumlaut -40\nKPX Rcommaaccent Umacron -40\nKPX Rcommaaccent Uogonek -40\nKPX Rcommaaccent Uring -40\nKPX Rcommaaccent V -80\nKPX Rcommaaccent W -55\nKPX Rcommaaccent Y -65\nKPX Rcommaaccent Yacute -65\nKPX Rcommaaccent Ydieresis -65\nKPX T A -93\nKPX T Aacute -93\nKPX T Abreve -93\nKPX T Acircumflex -93\nKPX T Adieresis -93\nKPX T Agrave -93\nKPX T Amacron -93\nKPX T Aogonek -93\nKPX T Aring -93\nKPX T Atilde -93\nKPX T O -18\nKPX T Oacute -18\nKPX T Ocircumflex -18\nKPX T Odieresis -18\nKPX T Ograve -18\nKPX T Ohungarumlaut -18\nKPX T Omacron -18\nKPX T Oslash -18\nKPX T Otilde -18\nKPX T a -80\nKPX T aacute -80\nKPX T abreve -80\nKPX T acircumflex -80\nKPX T adieresis -40\nKPX T agrave -40\nKPX T amacron -40\nKPX T aogonek -80\nKPX T aring -80\nKPX T atilde -40\nKPX T colon -50\nKPX T comma -74\nKPX T e -70\nKPX T eacute -70\nKPX T ecaron -70\nKPX T ecircumflex -70\nKPX T edieresis -30\nKPX T edotaccent -70\nKPX T egrave -70\nKPX T emacron -30\nKPX T eogonek -70\nKPX T hyphen -92\nKPX T i -35\nKPX T iacute -35\nKPX T iogonek -35\nKPX T o -80\nKPX T oacute -80\nKPX T ocircumflex -80\nKPX T odieresis -80\nKPX T ograve -80\nKPX T ohungarumlaut -80\nKPX T omacron -80\nKPX T oslash -80\nKPX T otilde -80\nKPX T period -74\nKPX T r -35\nKPX T racute -35\nKPX T rcaron -35\nKPX T rcommaaccent -35\nKPX T semicolon -55\nKPX T u -45\nKPX T uacute -45\nKPX T ucircumflex -45\nKPX T udieresis -45\nKPX T ugrave -45\nKPX T uhungarumlaut -45\nKPX T umacron -45\nKPX T uogonek -45\nKPX T uring -45\nKPX T w -80\nKPX T y -80\nKPX T yacute -80\nKPX T ydieresis -80\nKPX Tcaron A -93\nKPX Tcaron Aacute -93\nKPX Tcaron Abreve -93\nKPX Tcaron Acircumflex -93\nKPX Tcaron Adieresis -93\nKPX Tcaron Agrave -93\nKPX Tcaron Amacron -93\nKPX Tcaron Aogonek -93\nKPX Tcaron Aring -93\nKPX Tcaron Atilde -93\nKPX Tcaron O -18\nKPX Tcaron Oacute -18\nKPX Tcaron Ocircumflex -18\nKPX Tcaron Odieresis -18\nKPX Tcaron Ograve -18\nKPX Tcaron Ohungarumlaut -18\nKPX Tcaron Omacron -18\nKPX Tcaron Oslash -18\nKPX Tcaron Otilde -18\nKPX Tcaron a -80\nKPX Tcaron aacute -80\nKPX Tcaron abreve -80\nKPX Tcaron acircumflex -80\nKPX Tcaron adieresis -40\nKPX Tcaron agrave -40\nKPX Tcaron amacron -40\nKPX Tcaron aogonek -80\nKPX Tcaron aring -80\nKPX Tcaron atilde -40\nKPX Tcaron colon -50\nKPX Tcaron comma -74\nKPX Tcaron e -70\nKPX Tcaron eacute -70\nKPX Tcaron ecaron -70\nKPX Tcaron ecircumflex -30\nKPX Tcaron edieresis -30\nKPX Tcaron edotaccent -70\nKPX Tcaron egrave -70\nKPX Tcaron emacron -30\nKPX Tcaron eogonek -70\nKPX Tcaron hyphen -92\nKPX Tcaron i -35\nKPX Tcaron iacute -35\nKPX Tcaron iogonek -35\nKPX Tcaron o -80\nKPX Tcaron oacute -80\nKPX Tcaron ocircumflex -80\nKPX Tcaron odieresis -80\nKPX Tcaron ograve -80\nKPX Tcaron ohungarumlaut -80\nKPX Tcaron omacron -80\nKPX Tcaron oslash -80\nKPX Tcaron otilde -80\nKPX Tcaron period -74\nKPX Tcaron r -35\nKPX Tcaron racute -35\nKPX Tcaron rcaron -35\nKPX Tcaron rcommaaccent -35\nKPX Tcaron semicolon -55\nKPX Tcaron u -45\nKPX Tcaron uacute -45\nKPX Tcaron ucircumflex -45\nKPX Tcaron udieresis -45\nKPX Tcaron ugrave -45\nKPX Tcaron uhungarumlaut -45\nKPX Tcaron umacron -45\nKPX Tcaron uogonek -45\nKPX Tcaron uring -45\nKPX Tcaron w -80\nKPX Tcaron y -80\nKPX Tcaron yacute -80\nKPX Tcaron ydieresis -80\nKPX Tcommaaccent A -93\nKPX Tcommaaccent Aacute -93\nKPX Tcommaaccent Abreve -93\nKPX Tcommaaccent Acircumflex -93\nKPX Tcommaaccent Adieresis -93\nKPX Tcommaaccent Agrave -93\nKPX Tcommaaccent Amacron -93\nKPX Tcommaaccent Aogonek -93\nKPX Tcommaaccent Aring -93\nKPX Tcommaaccent Atilde -93\nKPX Tcommaaccent O -18\nKPX Tcommaaccent Oacute -18\nKPX Tcommaaccent Ocircumflex -18\nKPX Tcommaaccent Odieresis -18\nKPX Tcommaaccent Ograve -18\nKPX Tcommaaccent Ohungarumlaut -18\nKPX Tcommaaccent Omacron -18\nKPX Tcommaaccent Oslash -18\nKPX Tcommaaccent Otilde -18\nKPX Tcommaaccent a -80\nKPX Tcommaaccent aacute -80\nKPX Tcommaaccent abreve -80\nKPX Tcommaaccent acircumflex -80\nKPX Tcommaaccent adieresis -40\nKPX Tcommaaccent agrave -40\nKPX Tcommaaccent amacron -40\nKPX Tcommaaccent aogonek -80\nKPX Tcommaaccent aring -80\nKPX Tcommaaccent atilde -40\nKPX Tcommaaccent colon -50\nKPX Tcommaaccent comma -74\nKPX Tcommaaccent e -70\nKPX Tcommaaccent eacute -70\nKPX Tcommaaccent ecaron -70\nKPX Tcommaaccent ecircumflex -30\nKPX Tcommaaccent edieresis -30\nKPX Tcommaaccent edotaccent -70\nKPX Tcommaaccent egrave -30\nKPX Tcommaaccent emacron -70\nKPX Tcommaaccent eogonek -70\nKPX Tcommaaccent hyphen -92\nKPX Tcommaaccent i -35\nKPX Tcommaaccent iacute -35\nKPX Tcommaaccent iogonek -35\nKPX Tcommaaccent o -80\nKPX Tcommaaccent oacute -80\nKPX Tcommaaccent ocircumflex -80\nKPX Tcommaaccent odieresis -80\nKPX Tcommaaccent ograve -80\nKPX Tcommaaccent ohungarumlaut -80\nKPX Tcommaaccent omacron -80\nKPX Tcommaaccent oslash -80\nKPX Tcommaaccent otilde -80\nKPX Tcommaaccent period -74\nKPX Tcommaaccent r -35\nKPX Tcommaaccent racute -35\nKPX Tcommaaccent rcaron -35\nKPX Tcommaaccent rcommaaccent -35\nKPX Tcommaaccent semicolon -55\nKPX Tcommaaccent u -45\nKPX Tcommaaccent uacute -45\nKPX Tcommaaccent ucircumflex -45\nKPX Tcommaaccent udieresis -45\nKPX Tcommaaccent ugrave -45\nKPX Tcommaaccent uhungarumlaut -45\nKPX Tcommaaccent umacron -45\nKPX Tcommaaccent uogonek -45\nKPX Tcommaaccent uring -45\nKPX Tcommaaccent w -80\nKPX Tcommaaccent y -80\nKPX Tcommaaccent yacute -80\nKPX Tcommaaccent ydieresis -80\nKPX U A -40\nKPX U Aacute -40\nKPX U Abreve -40\nKPX U Acircumflex -40\nKPX U Adieresis -40\nKPX U Agrave -40\nKPX U Amacron -40\nKPX U Aogonek -40\nKPX U Aring -40\nKPX U Atilde -40\nKPX Uacute A -40\nKPX Uacute Aacute -40\nKPX Uacute Abreve -40\nKPX Uacute Acircumflex -40\nKPX Uacute Adieresis -40\nKPX Uacute Agrave -40\nKPX Uacute Amacron -40\nKPX Uacute Aogonek -40\nKPX Uacute Aring -40\nKPX Uacute Atilde -40\nKPX Ucircumflex A -40\nKPX Ucircumflex Aacute -40\nKPX Ucircumflex Abreve -40\nKPX Ucircumflex Acircumflex -40\nKPX Ucircumflex Adieresis -40\nKPX Ucircumflex Agrave -40\nKPX Ucircumflex Amacron -40\nKPX Ucircumflex Aogonek -40\nKPX Ucircumflex Aring -40\nKPX Ucircumflex Atilde -40\nKPX Udieresis A -40\nKPX Udieresis Aacute -40\nKPX Udieresis Abreve -40\nKPX Udieresis Acircumflex -40\nKPX Udieresis Adieresis -40\nKPX Udieresis Agrave -40\nKPX Udieresis Amacron -40\nKPX Udieresis Aogonek -40\nKPX Udieresis Aring -40\nKPX Udieresis Atilde -40\nKPX Ugrave A -40\nKPX Ugrave Aacute -40\nKPX Ugrave Abreve -40\nKPX Ugrave Acircumflex -40\nKPX Ugrave Adieresis -40\nKPX Ugrave Agrave -40\nKPX Ugrave Amacron -40\nKPX Ugrave Aogonek -40\nKPX Ugrave Aring -40\nKPX Ugrave Atilde -40\nKPX Uhungarumlaut A -40\nKPX Uhungarumlaut Aacute -40\nKPX Uhungarumlaut Abreve -40\nKPX Uhungarumlaut Acircumflex -40\nKPX Uhungarumlaut Adieresis -40\nKPX Uhungarumlaut Agrave -40\nKPX Uhungarumlaut Amacron -40\nKPX Uhungarumlaut Aogonek -40\nKPX Uhungarumlaut Aring -40\nKPX Uhungarumlaut Atilde -40\nKPX Umacron A -40\nKPX Umacron Aacute -40\nKPX Umacron Abreve -40\nKPX Umacron Acircumflex -40\nKPX Umacron Adieresis -40\nKPX Umacron Agrave -40\nKPX Umacron Amacron -40\nKPX Umacron Aogonek -40\nKPX Umacron Aring -40\nKPX Umacron Atilde -40\nKPX Uogonek A -40\nKPX Uogonek Aacute -40\nKPX Uogonek Abreve -40\nKPX Uogonek Acircumflex -40\nKPX Uogonek Adieresis -40\nKPX Uogonek Agrave -40\nKPX Uogonek Amacron -40\nKPX Uogonek Aogonek -40\nKPX Uogonek Aring -40\nKPX Uogonek Atilde -40\nKPX Uring A -40\nKPX Uring Aacute -40\nKPX Uring Abreve -40\nKPX Uring Acircumflex -40\nKPX Uring Adieresis -40\nKPX Uring Agrave -40\nKPX Uring Amacron -40\nKPX Uring Aogonek -40\nKPX Uring Aring -40\nKPX Uring Atilde -40\nKPX V A -135\nKPX V Aacute -135\nKPX V Abreve -135\nKPX V Acircumflex -135\nKPX V Adieresis -135\nKPX V Agrave -135\nKPX V Amacron -135\nKPX V Aogonek -135\nKPX V Aring -135\nKPX V Atilde -135\nKPX V G -15\nKPX V Gbreve -15\nKPX V Gcommaaccent -15\nKPX V O -40\nKPX V Oacute -40\nKPX V Ocircumflex -40\nKPX V Odieresis -40\nKPX V Ograve -40\nKPX V Ohungarumlaut -40\nKPX V Omacron -40\nKPX V Oslash -40\nKPX V Otilde -40\nKPX V a -111\nKPX V aacute -111\nKPX V abreve -111\nKPX V acircumflex -71\nKPX V adieresis -71\nKPX V agrave -71\nKPX V amacron -71\nKPX V aogonek -111\nKPX V aring -111\nKPX V atilde -71\nKPX V colon -74\nKPX V comma -129\nKPX V e -111\nKPX V eacute -111\nKPX V ecaron -71\nKPX V ecircumflex -71\nKPX V edieresis -71\nKPX V edotaccent -111\nKPX V egrave -71\nKPX V emacron -71\nKPX V eogonek -111\nKPX V hyphen -100\nKPX V i -60\nKPX V iacute -60\nKPX V icircumflex -20\nKPX V idieresis -20\nKPX V igrave -20\nKPX V imacron -20\nKPX V iogonek -60\nKPX V o -129\nKPX V oacute -129\nKPX V ocircumflex -129\nKPX V odieresis -89\nKPX V ograve -89\nKPX V ohungarumlaut -129\nKPX V omacron -89\nKPX V oslash -129\nKPX V otilde -89\nKPX V period -129\nKPX V semicolon -74\nKPX V u -75\nKPX V uacute -75\nKPX V ucircumflex -75\nKPX V udieresis -75\nKPX V ugrave -75\nKPX V uhungarumlaut -75\nKPX V umacron -75\nKPX V uogonek -75\nKPX V uring -75\nKPX W A -120\nKPX W Aacute -120\nKPX W Abreve -120\nKPX W Acircumflex -120\nKPX W Adieresis -120\nKPX W Agrave -120\nKPX W Amacron -120\nKPX W Aogonek -120\nKPX W Aring -120\nKPX W Atilde -120\nKPX W O -10\nKPX W Oacute -10\nKPX W Ocircumflex -10\nKPX W Odieresis -10\nKPX W Ograve -10\nKPX W Ohungarumlaut -10\nKPX W Omacron -10\nKPX W Oslash -10\nKPX W Otilde -10\nKPX W a -80\nKPX W aacute -80\nKPX W abreve -80\nKPX W acircumflex -80\nKPX W adieresis -80\nKPX W agrave -80\nKPX W amacron -80\nKPX W aogonek -80\nKPX W aring -80\nKPX W atilde -80\nKPX W colon -37\nKPX W comma -92\nKPX W e -80\nKPX W eacute -80\nKPX W ecaron -80\nKPX W ecircumflex -80\nKPX W edieresis -40\nKPX W edotaccent -80\nKPX W egrave -40\nKPX W emacron -40\nKPX W eogonek -80\nKPX W hyphen -65\nKPX W i -40\nKPX W iacute -40\nKPX W iogonek -40\nKPX W o -80\nKPX W oacute -80\nKPX W ocircumflex -80\nKPX W odieresis -80\nKPX W ograve -80\nKPX W ohungarumlaut -80\nKPX W omacron -80\nKPX W oslash -80\nKPX W otilde -80\nKPX W period -92\nKPX W semicolon -37\nKPX W u -50\nKPX W uacute -50\nKPX W ucircumflex -50\nKPX W udieresis -50\nKPX W ugrave -50\nKPX W uhungarumlaut -50\nKPX W umacron -50\nKPX W uogonek -50\nKPX W uring -50\nKPX W y -73\nKPX W yacute -73\nKPX W ydieresis -73\nKPX Y A -120\nKPX Y Aacute -120\nKPX Y Abreve -120\nKPX Y Acircumflex -120\nKPX Y Adieresis -120\nKPX Y Agrave -120\nKPX Y Amacron -120\nKPX Y Aogonek -120\nKPX Y Aring -120\nKPX Y Atilde -120\nKPX Y O -30\nKPX Y Oacute -30\nKPX Y Ocircumflex -30\nKPX Y Odieresis -30\nKPX Y Ograve -30\nKPX Y Ohungarumlaut -30\nKPX Y Omacron -30\nKPX Y Oslash -30\nKPX Y Otilde -30\nKPX Y a -100\nKPX Y aacute -100\nKPX Y abreve -100\nKPX Y acircumflex -100\nKPX Y adieresis -60\nKPX Y agrave -60\nKPX Y amacron -60\nKPX Y aogonek -100\nKPX Y aring -100\nKPX Y atilde -60\nKPX Y colon -92\nKPX Y comma -129\nKPX Y e -100\nKPX Y eacute -100\nKPX Y ecaron -100\nKPX Y ecircumflex -100\nKPX Y edieresis -60\nKPX Y edotaccent -100\nKPX Y egrave -60\nKPX Y emacron -60\nKPX Y eogonek -100\nKPX Y hyphen -111\nKPX Y i -55\nKPX Y iacute -55\nKPX Y iogonek -55\nKPX Y o -110\nKPX Y oacute -110\nKPX Y ocircumflex -110\nKPX Y odieresis -70\nKPX Y ograve -70\nKPX Y ohungarumlaut -110\nKPX Y omacron -70\nKPX Y oslash -110\nKPX Y otilde -70\nKPX Y period -129\nKPX Y semicolon -92\nKPX Y u -111\nKPX Y uacute -111\nKPX Y ucircumflex -111\nKPX Y udieresis -71\nKPX Y ugrave -71\nKPX Y uhungarumlaut -111\nKPX Y umacron -71\nKPX Y uogonek -111\nKPX Y uring -111\nKPX Yacute A -120\nKPX Yacute Aacute -120\nKPX Yacute Abreve -120\nKPX Yacute Acircumflex -120\nKPX Yacute Adieresis -120\nKPX Yacute Agrave -120\nKPX Yacute Amacron -120\nKPX Yacute Aogonek -120\nKPX Yacute Aring -120\nKPX Yacute Atilde -120\nKPX Yacute O -30\nKPX Yacute Oacute -30\nKPX Yacute Ocircumflex -30\nKPX Yacute Odieresis -30\nKPX Yacute Ograve -30\nKPX Yacute Ohungarumlaut -30\nKPX Yacute Omacron -30\nKPX Yacute Oslash -30\nKPX Yacute Otilde -30\nKPX Yacute a -100\nKPX Yacute aacute -100\nKPX Yacute abreve -100\nKPX Yacute acircumflex -100\nKPX Yacute adieresis -60\nKPX Yacute agrave -60\nKPX Yacute amacron -60\nKPX Yacute aogonek -100\nKPX Yacute aring -100\nKPX Yacute atilde -60\nKPX Yacute colon -92\nKPX Yacute comma -129\nKPX Yacute e -100\nKPX Yacute eacute -100\nKPX Yacute ecaron -100\nKPX Yacute ecircumflex -100\nKPX Yacute edieresis -60\nKPX Yacute edotaccent -100\nKPX Yacute egrave -60\nKPX Yacute emacron -60\nKPX Yacute eogonek -100\nKPX Yacute hyphen -111\nKPX Yacute i -55\nKPX Yacute iacute -55\nKPX Yacute iogonek -55\nKPX Yacute o -110\nKPX Yacute oacute -110\nKPX Yacute ocircumflex -110\nKPX Yacute odieresis -70\nKPX Yacute ograve -70\nKPX Yacute ohungarumlaut -110\nKPX Yacute omacron -70\nKPX Yacute oslash -110\nKPX Yacute otilde -70\nKPX Yacute period -129\nKPX Yacute semicolon -92\nKPX Yacute u -111\nKPX Yacute uacute -111\nKPX Yacute ucircumflex -111\nKPX Yacute udieresis -71\nKPX Yacute ugrave -71\nKPX Yacute uhungarumlaut -111\nKPX Yacute umacron -71\nKPX Yacute uogonek -111\nKPX Yacute uring -111\nKPX Ydieresis A -120\nKPX Ydieresis Aacute -120\nKPX Ydieresis Abreve -120\nKPX Ydieresis Acircumflex -120\nKPX Ydieresis Adieresis -120\nKPX Ydieresis Agrave -120\nKPX Ydieresis Amacron -120\nKPX Ydieresis Aogonek -120\nKPX Ydieresis Aring -120\nKPX Ydieresis Atilde -120\nKPX Ydieresis O -30\nKPX Ydieresis Oacute -30\nKPX Ydieresis Ocircumflex -30\nKPX Ydieresis Odieresis -30\nKPX Ydieresis Ograve -30\nKPX Ydieresis Ohungarumlaut -30\nKPX Ydieresis Omacron -30\nKPX Ydieresis Oslash -30\nKPX Ydieresis Otilde -30\nKPX Ydieresis a -100\nKPX Ydieresis aacute -100\nKPX Ydieresis abreve -100\nKPX Ydieresis acircumflex -100\nKPX Ydieresis adieresis -60\nKPX Ydieresis agrave -60\nKPX Ydieresis amacron -60\nKPX Ydieresis aogonek -100\nKPX Ydieresis aring -100\nKPX Ydieresis atilde -100\nKPX Ydieresis colon -92\nKPX Ydieresis comma -129\nKPX Ydieresis e -100\nKPX Ydieresis eacute -100\nKPX Ydieresis ecaron -100\nKPX Ydieresis ecircumflex -100\nKPX Ydieresis edieresis -60\nKPX Ydieresis edotaccent -100\nKPX Ydieresis egrave -60\nKPX Ydieresis emacron -60\nKPX Ydieresis eogonek -100\nKPX Ydieresis hyphen -111\nKPX Ydieresis i -55\nKPX Ydieresis iacute -55\nKPX Ydieresis iogonek -55\nKPX Ydieresis o -110\nKPX Ydieresis oacute -110\nKPX Ydieresis ocircumflex -110\nKPX Ydieresis odieresis -70\nKPX Ydieresis ograve -70\nKPX Ydieresis ohungarumlaut -110\nKPX Ydieresis omacron -70\nKPX Ydieresis oslash -110\nKPX Ydieresis otilde -70\nKPX Ydieresis period -129\nKPX Ydieresis semicolon -92\nKPX Ydieresis u -111\nKPX Ydieresis uacute -111\nKPX Ydieresis ucircumflex -111\nKPX Ydieresis udieresis -71\nKPX Ydieresis ugrave -71\nKPX Ydieresis uhungarumlaut -111\nKPX Ydieresis umacron -71\nKPX Ydieresis uogonek -111\nKPX Ydieresis uring -111\nKPX a v -20\nKPX a w -15\nKPX aacute v -20\nKPX aacute w -15\nKPX abreve v -20\nKPX abreve w -15\nKPX acircumflex v -20\nKPX acircumflex w -15\nKPX adieresis v -20\nKPX adieresis w -15\nKPX agrave v -20\nKPX agrave w -15\nKPX amacron v -20\nKPX amacron w -15\nKPX aogonek v -20\nKPX aogonek w -15\nKPX aring v -20\nKPX aring w -15\nKPX atilde v -20\nKPX atilde w -15\nKPX b period -40\nKPX b u -20\nKPX b uacute -20\nKPX b ucircumflex -20\nKPX b udieresis -20\nKPX b ugrave -20\nKPX b uhungarumlaut -20\nKPX b umacron -20\nKPX b uogonek -20\nKPX b uring -20\nKPX b v -15\nKPX c y -15\nKPX c yacute -15\nKPX c ydieresis -15\nKPX cacute y -15\nKPX cacute yacute -15\nKPX cacute ydieresis -15\nKPX ccaron y -15\nKPX ccaron yacute -15\nKPX ccaron ydieresis -15\nKPX ccedilla y -15\nKPX ccedilla yacute -15\nKPX ccedilla ydieresis -15\nKPX comma quotedblright -70\nKPX comma quoteright -70\nKPX e g -15\nKPX e gbreve -15\nKPX e gcommaaccent -15\nKPX e v -25\nKPX e w -25\nKPX e x -15\nKPX e y -15\nKPX e yacute -15\nKPX e ydieresis -15\nKPX eacute g -15\nKPX eacute gbreve -15\nKPX eacute gcommaaccent -15\nKPX eacute v -25\nKPX eacute w -25\nKPX eacute x -15\nKPX eacute y -15\nKPX eacute yacute -15\nKPX eacute ydieresis -15\nKPX ecaron g -15\nKPX ecaron gbreve -15\nKPX ecaron gcommaaccent -15\nKPX ecaron v -25\nKPX ecaron w -25\nKPX ecaron x -15\nKPX ecaron y -15\nKPX ecaron yacute -15\nKPX ecaron ydieresis -15\nKPX ecircumflex g -15\nKPX ecircumflex gbreve -15\nKPX ecircumflex gcommaaccent -15\nKPX ecircumflex v -25\nKPX ecircumflex w -25\nKPX ecircumflex x -15\nKPX ecircumflex y -15\nKPX ecircumflex yacute -15\nKPX ecircumflex ydieresis -15\nKPX edieresis g -15\nKPX edieresis gbreve -15\nKPX edieresis gcommaaccent -15\nKPX edieresis v -25\nKPX edieresis w -25\nKPX edieresis x -15\nKPX edieresis y -15\nKPX edieresis yacute -15\nKPX edieresis ydieresis -15\nKPX edotaccent g -15\nKPX edotaccent gbreve -15\nKPX edotaccent gcommaaccent -15\nKPX edotaccent v -25\nKPX edotaccent w -25\nKPX edotaccent x -15\nKPX edotaccent y -15\nKPX edotaccent yacute -15\nKPX edotaccent ydieresis -15\nKPX egrave g -15\nKPX egrave gbreve -15\nKPX egrave gcommaaccent -15\nKPX egrave v -25\nKPX egrave w -25\nKPX egrave x -15\nKPX egrave y -15\nKPX egrave yacute -15\nKPX egrave ydieresis -15\nKPX emacron g -15\nKPX emacron gbreve -15\nKPX emacron gcommaaccent -15\nKPX emacron v -25\nKPX emacron w -25\nKPX emacron x -15\nKPX emacron y -15\nKPX emacron yacute -15\nKPX emacron ydieresis -15\nKPX eogonek g -15\nKPX eogonek gbreve -15\nKPX eogonek gcommaaccent -15\nKPX eogonek v -25\nKPX eogonek w -25\nKPX eogonek x -15\nKPX eogonek y -15\nKPX eogonek yacute -15\nKPX eogonek ydieresis -15\nKPX f a -10\nKPX f aacute -10\nKPX f abreve -10\nKPX f acircumflex -10\nKPX f adieresis -10\nKPX f agrave -10\nKPX f amacron -10\nKPX f aogonek -10\nKPX f aring -10\nKPX f atilde -10\nKPX f dotlessi -50\nKPX f f -25\nKPX f i -20\nKPX f iacute -20\nKPX f quoteright 55\nKPX g a -5\nKPX g aacute -5\nKPX g abreve -5\nKPX g acircumflex -5\nKPX g adieresis -5\nKPX g agrave -5\nKPX g amacron -5\nKPX g aogonek -5\nKPX g aring -5\nKPX g atilde -5\nKPX gbreve a -5\nKPX gbreve aacute -5\nKPX gbreve abreve -5\nKPX gbreve acircumflex -5\nKPX gbreve adieresis -5\nKPX gbreve agrave -5\nKPX gbreve amacron -5\nKPX gbreve aogonek -5\nKPX gbreve aring -5\nKPX gbreve atilde -5\nKPX gcommaaccent a -5\nKPX gcommaaccent aacute -5\nKPX gcommaaccent abreve -5\nKPX gcommaaccent acircumflex -5\nKPX gcommaaccent adieresis -5\nKPX gcommaaccent agrave -5\nKPX gcommaaccent amacron -5\nKPX gcommaaccent aogonek -5\nKPX gcommaaccent aring -5\nKPX gcommaaccent atilde -5\nKPX h y -5\nKPX h yacute -5\nKPX h ydieresis -5\nKPX i v -25\nKPX iacute v -25\nKPX icircumflex v -25\nKPX idieresis v -25\nKPX igrave v -25\nKPX imacron v -25\nKPX iogonek v -25\nKPX k e -10\nKPX k eacute -10\nKPX k ecaron -10\nKPX k ecircumflex -10\nKPX k edieresis -10\nKPX k edotaccent -10\nKPX k egrave -10\nKPX k emacron -10\nKPX k eogonek -10\nKPX k o -10\nKPX k oacute -10\nKPX k ocircumflex -10\nKPX k odieresis -10\nKPX k ograve -10\nKPX k ohungarumlaut -10\nKPX k omacron -10\nKPX k oslash -10\nKPX k otilde -10\nKPX k y -15\nKPX k yacute -15\nKPX k ydieresis -15\nKPX kcommaaccent e -10\nKPX kcommaaccent eacute -10\nKPX kcommaaccent ecaron -10\nKPX kcommaaccent ecircumflex -10\nKPX kcommaaccent edieresis -10\nKPX kcommaaccent edotaccent -10\nKPX kcommaaccent egrave -10\nKPX kcommaaccent emacron -10\nKPX kcommaaccent eogonek -10\nKPX kcommaaccent o -10\nKPX kcommaaccent oacute -10\nKPX kcommaaccent ocircumflex -10\nKPX kcommaaccent odieresis -10\nKPX kcommaaccent ograve -10\nKPX kcommaaccent ohungarumlaut -10\nKPX kcommaaccent omacron -10\nKPX kcommaaccent oslash -10\nKPX kcommaaccent otilde -10\nKPX kcommaaccent y -15\nKPX kcommaaccent yacute -15\nKPX kcommaaccent ydieresis -15\nKPX l w -10\nKPX lacute w -10\nKPX lcommaaccent w -10\nKPX lslash w -10\nKPX n v -40\nKPX n y -15\nKPX n yacute -15\nKPX n ydieresis -15\nKPX nacute v -40\nKPX nacute y -15\nKPX nacute yacute -15\nKPX nacute ydieresis -15\nKPX ncaron v -40\nKPX ncaron y -15\nKPX ncaron yacute -15\nKPX ncaron ydieresis -15\nKPX ncommaaccent v -40\nKPX ncommaaccent y -15\nKPX ncommaaccent yacute -15\nKPX ncommaaccent ydieresis -15\nKPX ntilde v -40\nKPX ntilde y -15\nKPX ntilde yacute -15\nKPX ntilde ydieresis -15\nKPX o v -15\nKPX o w -25\nKPX o y -10\nKPX o yacute -10\nKPX o ydieresis -10\nKPX oacute v -15\nKPX oacute w -25\nKPX oacute y -10\nKPX oacute yacute -10\nKPX oacute ydieresis -10\nKPX ocircumflex v -15\nKPX ocircumflex w -25\nKPX ocircumflex y -10\nKPX ocircumflex yacute -10\nKPX ocircumflex ydieresis -10\nKPX odieresis v -15\nKPX odieresis w -25\nKPX odieresis y -10\nKPX odieresis yacute -10\nKPX odieresis ydieresis -10\nKPX ograve v -15\nKPX ograve w -25\nKPX ograve y -10\nKPX ograve yacute -10\nKPX ograve ydieresis -10\nKPX ohungarumlaut v -15\nKPX ohungarumlaut w -25\nKPX ohungarumlaut y -10\nKPX ohungarumlaut yacute -10\nKPX ohungarumlaut ydieresis -10\nKPX omacron v -15\nKPX omacron w -25\nKPX omacron y -10\nKPX omacron yacute -10\nKPX omacron ydieresis -10\nKPX oslash v -15\nKPX oslash w -25\nKPX oslash y -10\nKPX oslash yacute -10\nKPX oslash ydieresis -10\nKPX otilde v -15\nKPX otilde w -25\nKPX otilde y -10\nKPX otilde yacute -10\nKPX otilde ydieresis -10\nKPX p y -10\nKPX p yacute -10\nKPX p ydieresis -10\nKPX period quotedblright -70\nKPX period quoteright -70\nKPX quotedblleft A -80\nKPX quotedblleft Aacute -80\nKPX quotedblleft Abreve -80\nKPX quotedblleft Acircumflex -80\nKPX quotedblleft Adieresis -80\nKPX quotedblleft Agrave -80\nKPX quotedblleft Amacron -80\nKPX quotedblleft Aogonek -80\nKPX quotedblleft Aring -80\nKPX quotedblleft Atilde -80\nKPX quoteleft A -80\nKPX quoteleft Aacute -80\nKPX quoteleft Abreve -80\nKPX quoteleft Acircumflex -80\nKPX quoteleft Adieresis -80\nKPX quoteleft Agrave -80\nKPX quoteleft Amacron -80\nKPX quoteleft Aogonek -80\nKPX quoteleft Aring -80\nKPX quoteleft Atilde -80\nKPX quoteleft quoteleft -74\nKPX quoteright d -50\nKPX quoteright dcroat -50\nKPX quoteright l -10\nKPX quoteright lacute -10\nKPX quoteright lcommaaccent -10\nKPX quoteright lslash -10\nKPX quoteright quoteright -74\nKPX quoteright r -50\nKPX quoteright racute -50\nKPX quoteright rcaron -50\nKPX quoteright rcommaaccent -50\nKPX quoteright s -55\nKPX quoteright sacute -55\nKPX quoteright scaron -55\nKPX quoteright scedilla -55\nKPX quoteright scommaaccent -55\nKPX quoteright space -74\nKPX quoteright t -18\nKPX quoteright tcommaaccent -18\nKPX quoteright v -50\nKPX r comma -40\nKPX r g -18\nKPX r gbreve -18\nKPX r gcommaaccent -18\nKPX r hyphen -20\nKPX r period -55\nKPX racute comma -40\nKPX racute g -18\nKPX racute gbreve -18\nKPX racute gcommaaccent -18\nKPX racute hyphen -20\nKPX racute period -55\nKPX rcaron comma -40\nKPX rcaron g -18\nKPX rcaron gbreve -18\nKPX rcaron gcommaaccent -18\nKPX rcaron hyphen -20\nKPX rcaron period -55\nKPX rcommaaccent comma -40\nKPX rcommaaccent g -18\nKPX rcommaaccent gbreve -18\nKPX rcommaaccent gcommaaccent -18\nKPX rcommaaccent hyphen -20\nKPX rcommaaccent period -55\nKPX space A -55\nKPX space Aacute -55\nKPX space Abreve -55\nKPX space Acircumflex -55\nKPX space Adieresis -55\nKPX space Agrave -55\nKPX space Amacron -55\nKPX space Aogonek -55\nKPX space Aring -55\nKPX space Atilde -55\nKPX space T -18\nKPX space Tcaron -18\nKPX space Tcommaaccent -18\nKPX space V -50\nKPX space W -30\nKPX space Y -90\nKPX space Yacute -90\nKPX space Ydieresis -90\nKPX v a -25\nKPX v aacute -25\nKPX v abreve -25\nKPX v acircumflex -25\nKPX v adieresis -25\nKPX v agrave -25\nKPX v amacron -25\nKPX v aogonek -25\nKPX v aring -25\nKPX v atilde -25\nKPX v comma -65\nKPX v e -15\nKPX v eacute -15\nKPX v ecaron -15\nKPX v ecircumflex -15\nKPX v edieresis -15\nKPX v edotaccent -15\nKPX v egrave -15\nKPX v emacron -15\nKPX v eogonek -15\nKPX v o -20\nKPX v oacute -20\nKPX v ocircumflex -20\nKPX v odieresis -20\nKPX v ograve -20\nKPX v ohungarumlaut -20\nKPX v omacron -20\nKPX v oslash -20\nKPX v otilde -20\nKPX v period -65\nKPX w a -10\nKPX w aacute -10\nKPX w abreve -10\nKPX w acircumflex -10\nKPX w adieresis -10\nKPX w agrave -10\nKPX w amacron -10\nKPX w aogonek -10\nKPX w aring -10\nKPX w atilde -10\nKPX w comma -65\nKPX w o -10\nKPX w oacute -10\nKPX w ocircumflex -10\nKPX w odieresis -10\nKPX w ograve -10\nKPX w ohungarumlaut -10\nKPX w omacron -10\nKPX w oslash -10\nKPX w otilde -10\nKPX w period -65\nKPX x e -15\nKPX x eacute -15\nKPX x ecaron -15\nKPX x ecircumflex -15\nKPX x edieresis -15\nKPX x edotaccent -15\nKPX x egrave -15\nKPX x emacron -15\nKPX x eogonek -15\nKPX y comma -65\nKPX y period -65\nKPX yacute comma -65\nKPX yacute period -65\nKPX ydieresis comma -65\nKPX ydieresis period -65\nEndKernPairs\nEndKernData\nEndFontMetrics\n";
    },
    "Times-Bold": function() {
      return "StartFontMetrics 4.1\nComment Copyright (c) 1985, 1987, 1989, 1990, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.\nComment Creation Date: Thu May  1 12:52:56 1997\nComment UniqueID 43065\nComment VMusage 41636 52661\nFontName Times-Bold\nFullName Times Bold\nFamilyName Times\nWeight Bold\nItalicAngle 0\nIsFixedPitch false\nCharacterSet ExtendedRoman\nFontBBox -168 -218 1000 935 \nUnderlinePosition -100\nUnderlineThickness 50\nVersion 002.000\nNotice Copyright (c) 1985, 1987, 1989, 1990, 1993, 1997 Adobe Systems Incorporated.  All Rights Reserved.Times is a trademark of Linotype-Hell AG and/or its subsidiaries.\nEncodingScheme AdobeStandardEncoding\nCapHeight 676\nXHeight 461\nAscender 683\nDescender -217\nStdHW 44\nStdVW 139\nStartCharMetrics 315\nC 32 ; WX 250 ; N space ; B 0 0 0 0 ;\nC 33 ; WX 333 ; N exclam ; B 81 -13 251 691 ;\nC 34 ; WX 555 ; N quotedbl ; B 83 404 472 691 ;\nC 35 ; WX 500 ; N numbersign ; B 4 0 496 700 ;\nC 36 ; WX 500 ; N dollar ; B 29 -99 472 750 ;\nC 37 ; WX 1000 ; N percent ; B 124 -14 877 692 ;\nC 38 ; WX 833 ; N ampersand ; B 62 -16 787 691 ;\nC 39 ; WX 333 ; N quoteright ; B 79 356 263 691 ;\nC 40 ; WX 333 ; N parenleft ; B 46 -168 306 694 ;\nC 41 ; WX 333 ; N parenright ; B 27 -168 287 694 ;\nC 42 ; WX 500 ; N asterisk ; B 56 255 447 691 ;\nC 43 ; WX 570 ; N plus ; B 33 0 537 506 ;\nC 44 ; WX 250 ; N comma ; B 39 -180 223 155 ;\nC 45 ; WX 333 ; N hyphen ; B 44 171 287 287 ;\nC 46 ; WX 250 ; N period ; B 41 -13 210 156 ;\nC 47 ; WX 278 ; N slash ; B -24 -19 302 691 ;\nC 48 ; WX 500 ; N zero ; B 24 -13 476 688 ;\nC 49 ; WX 500 ; N one ; B 65 0 442 688 ;\nC 50 ; WX 500 ; N two ; B 17 0 478 688 ;\nC 51 ; WX 500 ; N three ; B 16 -14 468 688 ;\nC 52 ; WX 500 ; N four ; B 19 0 475 688 ;\nC 53 ; WX 500 ; N five ; B 22 -8 470 676 ;\nC 54 ; WX 500 ; N six ; B 28 -13 475 688 ;\nC 55 ; WX 500 ; N seven ; B 17 0 477 676 ;\nC 56 ; WX 500 ; N eight ; B 28 -13 472 688 ;\nC 57 ; WX 500 ; N nine ; B 26 -13 473 688 ;\nC 58 ; WX 333 ; N colon ; B 82 -13 251 472 ;\nC 59 ; WX 333 ; N semicolon ; B 82 -180 266 472 ;\nC 60 ; WX 570 ; N less ; B 31 -8 539 514 ;\nC 61 ; WX 570 ; N equal ; B 33 107 537 399 ;\nC 62 ; WX 570 ; N greater ; B 31 -8 539 514 ;\nC 63 ; WX 500 ; N question ; B 57 -13 445 689 ;\nC 64 ; WX 930 ; N at ; B 108 -19 822 691 ;\nC 65 ; WX 722 ; N A ; B 9 0 689 690 ;\nC 66 ; WX 667 ; N B ; B 16 0 619 676 ;\nC 67 ; WX 722 ; N C ; B 49 -19 687 691 ;\nC 68 ; WX 722 ; N D ; B 14 0 690 676 ;\nC 69 ; WX 667 ; N E ; B 16 0 641 676 ;\nC 70 ; WX 611 ; N F ; B 16 0 583 676 ;\nC 71 ; WX 778 ; N G ; B 37 -19 755 691 ;\nC 72 ; WX 778 ; N H ; B 21 0 759 676 ;\nC 73 ; WX 389 ; N I ; B 20 0 370 676 ;\nC 74 ; WX 500 ; N J ; B 3 -96 479 676 ;\nC 75 ; WX 778 ; N K ; B 30 0 769 676 ;\nC 76 ; WX 667 ; N L ; B 19 0 638 676 ;\nC 77 ; WX 944 ; N M ; B 14 0 921 676 ;\nC 78 ; WX 722 ; N N ; B 16 -18 701 676 ;\nC 79 ; WX 778 ; N O ; B 35 -19 743 691 ;\nC 80 ; WX 611 ; N P ; B 16 0 600 676 ;\nC 81 ; WX 778 ; N Q ; B 35 -176 743 691 ;\nC 82 ; WX 722 ; N R ; B 26 0 715 676 ;\nC 83 ; WX 556 ; N S ; B 35 -19 513 692 ;\nC 84 ; WX 667 ; N T ; B 31 0 636 676 ;\nC 85 ; WX 722 ; N U ; B 16 -19 701 676 ;\nC 86 ; WX 722 ; N V ; B 16 -18 701 676 ;\nC 87 ; WX 1000 ; N W ; B 19 -15 981 676 ;\nC 88 ; WX 722 ; N X ; B 16 0 699 676 ;\nC 89 ; WX 722 ; N Y ; B 15 0 699 676 ;\nC 90 ; WX 667 ; N Z ; B 28 0 634 676 ;\nC 91 ; WX 333 ; N bracketleft ; B 67 -149 301 678 ;\nC 92 ; WX 278 ; N backslash ; B -25 -19 303 691 ;\nC 93 ; WX 333 ; N bracketright ; B 32 -149 266 678 ;\nC 94 ; WX 581 ; N asciicircum ; B 73 311 509 676 ;\nC 95 ; WX 500 ; N underscore ; B 0 -125 500 -75 ;\nC 96 ; WX 333 ; N quoteleft ; B 70 356 254 691 ;\nC 97 ; WX 500 ; N a ; B 25 -14 488 473 ;\nC 98 ; WX 556 ; N b ; B 17 -14 521 676 ;\nC 99 ; WX 444 ; N c ; B 25 -14 430 473 ;\nC 100 ; WX 556 ; N d ; B 25 -14 534 676 ;\nC 101 ; WX 444 ; N e ; B 25 -14 426 473 ;\nC 102 ; WX 333 ; N f ; B 14 0 389 691 ; L i fi ; L l fl ;\nC 103 ; WX 500 ; N g ; B 28 -206 483 473 ;\nC 104 ; WX 556 ; N h ; B 16 0 534 676 ;\nC 105 ; WX 278 ; N i ; B 16 0 255 691 ;\nC 106 ; WX 333 ; N j ; B -57 -203 263 691 ;\nC 107 ; WX 556 ; N k ; B 22 0 543 676 ;\nC 108 ; WX 278 ; N l ; B 16 0 255 676 ;\nC 109 ; WX 833 ; N m ; B 16 0 814 473 ;\nC 110 ; WX 556 ; N n ; B 21 0 539 473 ;\nC 111 ; WX 500 ; N o ; B 25 -14 476 473 ;\nC 112 ; WX 556 ; N p ; B 19 -205 524 473 ;\nC 113 ; WX 556 ; N q ; B 34 -205 536 473 ;\nC 114 ; WX 444 ; N r ; B 29 0 434 473 ;\nC 115 ; WX 389 ; N s ; B 25 -14 361 473 ;\nC 116 ; WX 333 ; N t ; B 20 -12 332 630 ;\nC 117 ; WX 556 ; N u ; B 16 -14 537 461 ;\nC 118 ; WX 500 ; N v ; B 21 -14 485 461 ;\nC 119 ; WX 722 ; N w ; B 23 -14 707 461 ;\nC 120 ; WX 500 ; N x ; B 12 0 484 461 ;\nC 121 ; WX 500 ; N y ; B 16 -205 480 461 ;\nC 122 ; WX 444 ; N z ; B 21 0 420 461 ;\nC 123 ; WX 394 ; N braceleft ; B 22 -175 340 698 ;\nC 124 ; WX 220 ; N bar ; B 66 -218 154 782 ;\nC 125 ; WX 394 ; N braceright ; B 54 -175 372 698 ;\nC 126 ; WX 520 ; N asciitilde ; B 29 173 491 333 ;\nC 161 ; WX 333 ; N exclamdown ; B 82 -203 252 501 ;\nC 162 ; WX 500 ; N cent ; B 53 -140 458 588 ;\nC 163 ; WX 500 ; N sterling ; B 21 -14 477 684 ;\nC 164 ; WX 167 ; N fraction ; B -168 -12 329 688 ;\nC 165 ; WX 500 ; N yen ; B -64 0 547 676 ;\nC 166 ; WX 500 ; N florin ; B 0 -155 498 706 ;\nC 167 ; WX 500 ; N section ; B 57 -132 443 691 ;\nC 168 ; WX 500 ; N currency ; B -26 61 526 613 ;\nC 169 ; WX 278 ; N quotesingle ; B 75 404 204 691 ;\nC 170 ; WX 500 ; N quotedblleft ; B 32 356 486 691 ;\nC 171 ; WX 500 ; N guillemotleft ; B 23 36 473 415 ;\nC 172 ; WX 333 ; N guilsinglleft ; B 51 36 305 415 ;\nC 173 ; WX 333 ; N guilsinglright ; B 28 36 282 415 ;\nC 174 ; WX 556 ; N fi ; B 14 0 536 691 ;\nC 175 ; WX 556 ; N fl ; B 14 0 536 691 ;\nC 177 ; WX 500 ; N endash ; B 0 181 500 271 ;\nC 178 ; WX 500 ; N dagger ; B 47 -134 453 691 ;\nC 179 ; WX 500 ; N daggerdbl ; B 45 -132 456 691 ;\nC 180 ; WX 250 ; N periodcentered ; B 41 248 210 417 ;\nC 182 ; WX 540 ; N paragraph ; B 0 -186 519 676 ;\nC 183 ; WX 350 ; N bullet ; B 35 198 315 478 ;\nC 184 ; WX 333 ; N quotesinglbase ; B 79 -180 263 155 ;\nC 185 ; WX 500 ; N quotedblbase ; B 14 -180 468 155 ;\nC 186 ; WX 500 ; N quotedblright ; B 14 356 468 691 ;\nC 187 ; WX 500 ; N guillemotright ; B 27 36 477 415 ;\nC 188 ; WX 1000 ; N ellipsis ; B 82 -13 917 156 ;\nC 189 ; WX 1000 ; N perthousand ; B 7 -29 995 706 ;\nC 191 ; WX 500 ; N questiondown ; B 55 -201 443 501 ;\nC 193 ; WX 333 ; N grave ; B 8 528 246 713 ;\nC 194 ; WX 333 ; N acute ; B 86 528 324 713 ;\nC 195 ; WX 333 ; N circumflex ; B -2 528 335 704 ;\nC 196 ; WX 333 ; N tilde ; B -16 547 349 674 ;\nC 197 ; WX 333 ; N macron ; B 1 565 331 637 ;\nC 198 ; WX 333 ; N breve ; B 15 528 318 691 ;\nC 199 ; WX 333 ; N dotaccent ; B 103 536 258 691 ;\nC 200 ; WX 333 ; N dieresis ; B -2 537 335 667 ;\nC 202 ; WX 333 ; N ring ; B 60 527 273 740 ;\nC 203 ; WX 333 ; N cedilla ; B 68 -218 294 0 ;\nC 205 ; WX 333 ; N hungarumlaut ; B -13 528 425 713 ;\nC 206 ; WX 333 ; N ogonek ; B 90 -193 319 24 ;\nC 207 ; WX 333 ; N caron ; B -2 528 335 704 ;\nC 208 ; WX 1000 ; N emdash ; B 0 181 1000 271 ;\nC 225 ; WX 1000 ; N AE ; B 4 0 951 676 ;\nC 227 ; WX 300 ; N ordfeminine ; B -1 397 301 688 ;\nC 232 ; WX 667 ; N Lslash ; B 19 0 638 676 ;\nC 233 ; WX 778 ; N Oslash ; B 35 -74 743 737 ;\nC 234 ; WX 1000 ; N OE ; B 22 -5 981 684 ;\nC 235 ; WX 330 ; N ordmasculine ; B 18 397 312 688 ;\nC 241 ; WX 722 ; N ae ; B 33 -14 693 473 ;\nC 245 ; WX 278 ; N dotlessi ; B 16 0 255 461 ;\nC 248 ; WX 278 ; N lslash ; B -22 0 303 676 ;\nC 249 ; WX 500 ; N oslash ; B 25 -92 476 549 ;\nC 250 ; WX 722 ; N oe ; B 22 -14 696 473 ;\nC 251 ; WX 556 ; N germandbls ; B 19 -12 517 691 ;\nC -1 ; WX 389 ; N Idieresis ; B 20 0 370 877 ;\nC -1 ; WX 444 ; N eacute ; B 25 -14 426 713 ;\nC -1 ; WX 500 ; N abreve ; B 25 -14 488 691 ;\nC -1 ; WX 556 ; N uhungarumlaut ; B 16 -14 557 713 ;\nC -1 ; WX 444 ; N ecaron ; B 25 -14 426 704 ;\nC -1 ; WX 722 ; N Ydieresis ; B 15 0 699 877 ;\nC -1 ; WX 570 ; N divide ; B 33 -31 537 537 ;\nC -1 ; WX 722 ; N Yacute ; B 15 0 699 923 ;\nC -1 ; WX 722 ; N Acircumflex ; B 9 0 689 914 ;\nC -1 ; WX 500 ; N aacute ; B 25 -14 488 713 ;\nC -1 ; WX 722 ; N Ucircumflex ; B 16 -19 701 914 ;\nC -1 ; WX 500 ; N yacute ; B 16 -205 480 713 ;\nC -1 ; WX 389 ; N scommaaccent ; B 25 -218 361 473 ;\nC -1 ; WX 444 ; N ecircumflex ; B 25 -14 426 704 ;\nC -1 ; WX 722 ; N Uring ; B 16 -19 701 935 ;\nC -1 ; WX 722 ; N Udieresis ; B 16 -19 701 877 ;\nC -1 ; WX 500 ; N aogonek ; B 25 -193 504 473 ;\nC -1 ; WX 722 ; N Uacute ; B 16 -19 701 923 ;\nC -1 ; WX 556 ; N uogonek ; B 16 -193 539 461 ;\nC -1 ; WX 667 ; N Edieresis ; B 16 0 641 877 ;\nC -1 ; WX 722 ; N Dcroat ; B 6 0 690 676 ;\nC -1 ; WX 250 ; N commaaccent ; B 47 -218 203 -50 ;\nC -1 ; WX 747 ; N copyright ; B 26 -19 721 691 ;\nC -1 ; WX 667 ; N Emacron ; B 16 0 641 847 ;\nC -1 ; WX 444 ; N ccaron ; B 25 -14 430 704 ;\nC -1 ; WX 500 ; N aring ; B 25 -14 488 740 ;\nC -1 ; WX 722 ; N Ncommaaccent ; B 16 -188 701 676 ;\nC -1 ; WX 278 ; N lacute ; B 16 0 297 923 ;\nC -1 ; WX 500 ; N agrave ; B 25 -14 488 713 ;\nC -1 ; WX 667 ; N Tcommaaccent ; B 31 -218 636 676 ;\nC -1 ; WX 722 ; N Cacute ; B 49 -19 687 923 ;\nC -1 ; WX 500 ; N atilde ; B 25 -14 488 674 ;\nC -1 ; WX 667 ; N Edotaccent ; B 16 0 641 901 ;\nC -1 ; WX 389 ; N scaron ; B 25 -14 363 704 ;\nC -1 ; WX 389 ; N scedilla ; B 25 -218 361 473 ;\nC -1 ; WX 278 ; N iacute ; B 16 0 289 713 ;\nC -1 ; WX 494 ; N lozenge ; B 10 0 484 745 ;\nC -1 ; WX 722 ; N Rcaron ; B 26 0 715 914 ;\nC -1 ; WX 778 ; N Gcommaaccent ; B 37 -218 755 691 ;\nC -1 ; WX 556 ; N ucircumflex ; B 16 -14 537 704 ;\nC -1 ; WX 500 ; N acircumflex ; B 25 -14 488 704 ;\nC -1 ; WX 722 ; N Amacron ; B 9 0 689 847 ;\nC -1 ; WX 444 ; N rcaron ; B 29 0 434 704 ;\nC -1 ; WX 444 ; N ccedilla ; B 25 -218 430 473 ;\nC -1 ; WX 667 ; N Zdotaccent ; B 28 0 634 901 ;\nC -1 ; WX 611 ; N Thorn ; B 16 0 600 676 ;\nC -1 ; WX 778 ; N Omacron ; B 35 -19 743 847 ;\nC -1 ; WX 722 ; N Racute ; B 26 0 715 923 ;\nC -1 ; WX 556 ; N Sacute ; B 35 -19 513 923 ;\nC -1 ; WX 672 ; N dcaron ; B 25 -14 681 682 ;\nC -1 ; WX 722 ; N Umacron ; B 16 -19 701 847 ;\nC -1 ; WX 556 ; N uring ; B 16 -14 537 740 ;\nC -1 ; WX 300 ; N threesuperior ; B 3 268 297 688 ;\nC -1 ; WX 778 ; N Ograve ; B 35 -19 743 923 ;\nC -1 ; WX 722 ; N Agrave ; B 9 0 689 923 ;\nC -1 ; WX 722 ; N Abreve ; B 9 0 689 901 ;\nC -1 ; WX 570 ; N multiply ; B 48 16 522 490 ;\nC -1 ; WX 556 ; N uacute ; B 16 -14 537 713 ;\nC -1 ; WX 667 ; N Tcaron ; B 31 0 636 914 ;\nC -1 ; WX 494 ; N partialdiff ; B 11 -21 494 750 ;\nC -1 ; WX 500 ; N ydieresis ; B 16 -205 480 667 ;\nC -1 ; WX 722 ; N Nacute ; B 16 -18 701 923 ;\nC -1 ; WX 278 ; N icircumflex ; B -37 0 300 704 ;\nC -1 ; WX 667 ; N Ecircumflex ; B 16 0 641 914 ;\nC -1 ; WX 500 ; N adieresis ; B 25 -14 488 667 ;\nC -1 ; WX 444 ; N edieresis ; B 25 -14 426 667 ;\nC -1 ; WX 444 ; N cacute ; B 25 -14 430 713 ;\nC -1 ; WX 556 ; N nacute ; B 21 0 539 713 ;\nC -1 ; WX 556 ; N umacron ; B 16 -14 537 637 ;\nC -1 ; WX 722 ; N Ncaron ; B 16 -18 701 914 ;\nC -1 ; WX 389 ; N Iacute ; B 20 0 370 923 ;\nC -1 ; WX 570 ; N plusminus ; B 33 0 537 506 ;\nC -1 ; WX 220 ; N brokenbar ; B 66 -143 154 707 ;\nC -1 ; WX 747 ; N registered ; B 26 -19 721 691 ;\nC -1 ; WX 778 ; N Gbreve ; B 37 -19 755 901 ;\nC -1 ; WX 389 ; N Idotaccent ; B 20 0 370 901 ;\nC -1 ; WX 600 ; N summation ; B 14 -10 585 706 ;\nC -1 ; WX 667 ; N Egrave ; B 16 0 641 923 ;\nC -1 ; WX 444 ; N racute ; B 29 0 434 713 ;\nC -1 ; WX 500 ; N omacron ; B 25 -14 476 637 ;\nC -1 ; WX 667 ; N Zacute ; B 28 0 634 923 ;\nC -1 ; WX 667 ; N Zcaron ; B 28 0 634 914 ;\nC -1 ; WX 549 ; N greaterequal ; B 26 0 523 704 ;\nC -1 ; WX 722 ; N Eth ; B 6 0 690 676 ;\nC -1 ; WX 722 ; N Ccedilla ; B 49 -218 687 691 ;\nC -1 ; WX 278 ; N lcommaaccent ; B 16 -218 255 676 ;\nC -1 ; WX 416 ; N tcaron ; B 20 -12 425 815 ;\nC -1 ; WX 444 ; N eogonek ; B 25 -193 426 473 ;\nC -1 ; WX 722 ; N Uogonek ; B 16 -193 701 676 ;\nC -1 ; WX 722 ; N Aacute ; B 9 0 689 923 ;\nC -1 ; WX 722 ; N Adieresis ; B 9 0 689 877 ;\nC -1 ; WX 444 ; N egrave ; B 25 -14 426 713 ;\nC -1 ; WX 444 ; N zacute ; B 21 0 420 713 ;\nC -1 ; WX 278 ; N iogonek ; B 16 -193 274 691 ;\nC -1 ; WX 778 ; N Oacute ; B 35 -19 743 923 ;\nC -1 ; WX 500 ; N oacute ; B 25 -14 476 713 ;\nC -1 ; WX 500 ; N amacron ; B 25 -14 488 637 ;\nC -1 ; WX 389 ; N sacute ; B 25 -14 361 713 ;\nC -1 ; WX 278 ; N idieresis ; B -37 0 300 667 ;\nC -1 ; WX 778 ; N Ocircumflex ; B 35 -19 743 914 ;\nC -1 ; WX 722 ; N Ugrave ; B 16 -19 701 923 ;\nC -1 ; WX 612 ; N Delta ; B 6 0 608 688 ;\nC -1 ; WX 556 ; N thorn ; B 19 -205 524 676 ;\nC -1 ; WX 300 ; N twosuperior ; B 0 275 300 688 ;\nC -1 ; WX 778 ; N Odieresis ; B 35 -19 743 877 ;\nC -1 ; WX 556 ; N mu ; B 33 -206 536 461 ;\nC -1 ; WX 278 ; N igrave ; B -27 0 255 713 ;\nC -1 ; WX 500 ; N ohungarumlaut ; B 25 -14 529 713 ;\nC -1 ; WX 667 ; N Eogonek ; B 16 -193 644 676 ;\nC -1 ; WX 556 ; N dcroat ; B 25 -14 534 676 ;\nC -1 ; WX 750 ; N threequarters ; B 23 -12 733 688 ;\nC -1 ; WX 556 ; N Scedilla ; B 35 -218 513 692 ;\nC -1 ; WX 394 ; N lcaron ; B 16 0 412 682 ;\nC -1 ; WX 778 ; N Kcommaaccent ; B 30 -218 769 676 ;\nC -1 ; WX 667 ; N Lacute ; B 19 0 638 923 ;\nC -1 ; WX 1000 ; N trademark ; B 24 271 977 676 ;\nC -1 ; WX 444 ; N edotaccent ; B 25 -14 426 691 ;\nC -1 ; WX 389 ; N Igrave ; B 20 0 370 923 ;\nC -1 ; WX 389 ; N Imacron ; B 20 0 370 847 ;\nC -1 ; WX 667 ; N Lcaron ; B 19 0 652 682 ;\nC -1 ; WX 750 ; N onehalf ; B -7 -12 775 688 ;\nC -1 ; WX 549 ; N lessequal ; B 29 0 526 704 ;\nC -1 ; WX 500 ; N ocircumflex ; B 25 -14 476 704 ;\nC -1 ; WX 556 ; N ntilde ; B 21 0 539 674 ;\nC -1 ; WX 722 ; N Uhungarumlaut ; B 16 -19 701 923 ;\nC -1 ; WX 667 ; N Eacute ; B 16 0 641 923 ;\nC -1 ; WX 444 ; N emacron ; B 25 -14 426 637 ;\nC -1 ; WX 500 ; N gbreve ; B 28 -206 483 691 ;\nC -1 ; WX 750 ; N onequarter ; B 28 -12 743 688 ;\nC -1 ; WX 556 ; N Scaron ; B 35 -19 513 914 ;\nC -1 ; WX 556 ; N Scommaaccent ; B 35 -218 513 692 ;\nC -1 ; WX 778 ; N Ohungarumlaut ; B 35 -19 743 923 ;\nC -1 ; WX 400 ; N degree ; B 57 402 343 688 ;\nC -1 ; WX 500 ; N ograve ; B 25 -14 476 713 ;\nC -1 ; WX 722 ; N Ccaron ; B 49 -19 687 914 ;\nC -1 ; WX 556 ; N ugrave ; B 16 -14 537 713 ;\nC -1 ; WX 549 ; N radical ; B 10 -46 512 850 ;\nC -1 ; WX 722 ; N Dcaron ; B 14 0 690 914 ;\nC -1 ; WX 444 ; N rcommaaccent ; B 29 -218 434 473 ;\nC -1 ; WX 722 ; N Ntilde ; B 16 -18 701 884 ;\nC -1 ; WX 500 ; N otilde ; B 25 -14 476 674 ;\nC -1 ; WX 722 ; N Rcommaaccent ; B 26 -218 715 676 ;\nC -1 ; WX 667 ; N Lcommaaccent ; B 19 -218 638 676 ;\nC -1 ; WX 722 ; N Atilde ; B 9 0 689 884 ;\nC -1 ; WX 722 ; N Aogonek ; B 9 -193 699 690 ;\nC -1 ; WX 722 ; N Aring ; B 9 0 689 935 ;\nC -1 ; WX 778 ; N Otilde ; B 35 -19 743 884 ;\nC -1 ; WX 444 ; N zdotaccent ; B 21 0 420 691 ;\nC -1 ; WX 667 ; N Ecaron ; B 16 0 641 914 ;\nC -1 ; WX 389 ; N Iogonek ; B 20 -193 370 676 ;\nC -1 ; WX 556 ; N kcommaaccent ; B 22 -218 543 676 ;\nC -1 ; WX 570 ; N minus ; B 33 209 537 297 ;\nC -1 ; WX 389 ; N Icircumflex ; B 20 0 370 914 ;\nC -1 ; WX 556 ; N ncaron ; B 21 0 539 704 ;\nC -1 ; WX 333 ; N tcommaaccent ; B 20 -218 332 630 ;\nC -1 ; WX 570 ; N logicalnot ; B 33 108 537 399 ;\nC -1 ; WX 500 ; N odieresis ; B 25 -14 476 667 ;\nC -1 ; WX 556 ; N udieresis ; B 16 -14 537 667 ;\nC -1 ; WX 549 ; N notequal ; B 15 -49 540 570 ;\nC -1 ; WX 500 ; N gcommaaccent ; B 28 -206 483 829 ;\nC -1 ; WX 500 ; N eth ; B 25 -14 476 691 ;\nC -1 ; WX 444 ; N zcaron ; B 21 0 420 704 ;\nC -1 ; WX 556 ; N ncommaaccent ; B 21 -218 539 473 ;\nC -1 ; WX 300 ; N onesuperior ; B 28 275 273 688 ;\nC -1 ; WX 278 ; N imacron ; B -8 0 272 637 ;\nC -1 ; WX 500 ; N Euro ; B 0 0 0 0 ;\nEndCharMetrics\nStartKernData\nStartKernPairs 2242\nKPX A C -55\nKPX A Cacute -55\nKPX A Ccaron -55\nKPX A Ccedilla -55\nKPX A G -55\nKPX A Gbreve -55\nKPX A Gcommaaccent -55\nKPX A O -45\nKPX A Oacute -45\nKPX A Ocircumflex -45\nKPX A Odieresis -45\nKPX A Ograve -45\nKPX A Ohungarumlaut -45\nKPX A Omacron -45\nKPX A Oslash -45\nKPX A Otilde -45\nKPX A Q -45\nKPX A T -95\nKPX A Tcaron -95\nKPX A Tcommaaccent -95\nKPX A U -50\nKPX A Uacute -50\nKPX A Ucircumflex -50\nKPX A Udieresis -50\nKPX A Ugrave -50\nKPX A Uhungarumlaut -50\nKPX A Umacron -50\nKPX A Uogonek -50\nKPX A Uring -50\nKPX A V -145\nKPX A W -130\nKPX A Y -100\nKPX A Yacute -100\nKPX A Ydieresis -100\nKPX A p -25\nKPX A quoteright -74\nKPX A u -50\nKPX A uacute -50\nKPX A ucircumflex -50\nKPX A udieresis -50\nKPX A ugrave -50\nKPX A uhungarumlaut -50\nKPX A umacron -50\nKPX A uogonek -50\nKPX A uring -50\nKPX A v -100\nKPX A w -90\nKPX A y -74\nKPX A yacute -74\nKPX A ydieresis -74\nKPX Aacute C -55\nKPX Aacute Cacute -55\nKPX Aacute Ccaron -55\nKPX Aacute Ccedilla -55\nKPX Aacute G -55\nKPX Aacute Gbreve -55\nKPX Aacute Gcommaaccent -55\nKPX Aacute O -45\nKPX Aacute Oacute -45\nKPX Aacute Ocircumflex -45\nKPX Aacute Odieresis -45\nKPX Aacute Ograve -45\nKPX Aacute Ohungarumlaut -45\nKPX Aacute Omacron -45\nKPX Aacute Oslash -45\nKPX Aacute Otilde -45\nKPX Aacute Q -45\nKPX Aacute T -95\nKPX Aacute Tcaron -95\nKPX Aacute Tcommaaccent -95\nKPX Aacute U -50\nKPX Aacute Uacute -50\nKPX Aacute Ucircumflex -50\nKPX Aacute Udieresis -50\nKPX Aacute Ugrave -50\nKPX Aacute Uhungarumlaut -50\nKPX Aacute Umacron -50\nKPX Aacute Uogonek -50\nKPX Aacute Uring -50\nKPX Aacute V -145\nKPX Aacute W -130\nKPX Aacute Y -100\nKPX Aacute Yacute -100\nKPX Aacute Ydieresis -100\nKPX Aacute p -25\nKPX Aacute quoteright -74\nKPX Aacute u -50\nKPX Aacute uacute -50\nKPX Aacute ucircumflex -50\nKPX Aacute udieresis -50\nKPX Aacute ugrave -50\nKPX Aacute uhungarumlaut -50\nKPX Aacute umacron -50\nKPX Aacute uogonek -50\nKPX Aacute uring -50\nKPX Aacute v -100\nKPX Aacute w -90\nKPX Aacute y -74\nKPX Aacute yacute -74\nKPX Aacute ydieresis -74\nKPX Abreve C -55\nKPX Abreve Cacute -55\nKPX Abreve Ccaron -55\nKPX Abreve Ccedilla -55\nKPX Abreve G -55\nKPX Abreve Gbreve -55\nKPX Abreve Gcommaaccent -55\nKPX Abreve O -45\nKPX Abreve Oacute -45\nKPX Abreve Ocircumflex -45\nKPX Abreve Odieresis -45\nKPX Abreve Ograve -45\nKPX Abreve Ohungarumlaut -45\nKPX Abreve Omacron -45\nKPX Abreve Oslash -45\nKPX Abreve Otilde -45\nKPX Abreve Q -45\nKPX Abreve T -95\nKPX Abreve Tcaron -95\nKPX Abreve Tcommaaccent -95\nKPX Abreve U -50\nKPX Abreve Uacute -50\nKPX Abreve Ucircumflex -50\nKPX Abreve Udieresis -50\nKPX Abreve Ugrave -50\nKPX Abreve Uhungarumlaut -50\nKPX Abreve Umacron -50\nKPX Abreve Uogonek -50\nKPX Abreve Uring -50\nKPX Abreve V -145\nKPX Abreve W -130\nKPX Abreve Y -100\nKPX Abreve Yacute -100\nKPX Abreve Ydieresis -100\nKPX Abreve p -25\nKPX Abreve quoteright -74\nKPX Abreve u -50\nKPX Abreve uacute -50\nKPX Abreve ucircumflex -50\nKPX Abreve udieresis -50\nKPX Abreve ugrave -50\nKPX Abreve uhungarumlaut -50\nKPX Abreve umacron -50\nKPX Abreve uogonek -50\nKPX Abreve uring -50\nKPX Abreve v -100\nKPX Abreve w -90\nKPX Abreve y -74\nKPX Abreve yacute -74\nKPX Abreve ydieresis -74\nKPX Acircumflex C -55\nKPX Acircumflex Cacute -55\nKPX Acircumflex Ccaron -55\nKPX Acircumflex Ccedilla -55\nKPX Acircumflex G -55\nKPX Acircumflex Gbreve -55\nKPX Acircumflex Gcommaaccent -55\nKPX Acircumflex O -45\nKPX Acircumflex Oacute -45\nKPX Acircumflex Ocircumflex -45\nKPX Acircumflex Odieresis -45\nKPX Acircumflex Ograve -45\nKPX Acircumflex Ohungarumlaut -45\nKPX Acircumflex Omacron -45\nKPX Acircumflex Oslash -45\nKPX Acircumflex Otilde -45\nKPX Acircumflex Q -45\nKPX Acircumflex T -95\nKPX Acircumflex Tcaron -95\nKPX Acircumflex Tcommaaccent -95\nKPX Acircumflex U -50\nKPX Acircumflex Uacute -50\nKPX Acircumflex Ucircumflex -50\nKPX Acircumflex Udieresis -50\nKPX Acircumflex Ugrave -50\nKPX Acircumflex Uhungarumlaut -50\nKPX Acircumflex Umacron -50\nKPX Acircumflex Uogonek -50\nKPX Acircumflex Uring -50\nKPX Acircumflex V -145\nKPX Acircumflex W -130\nKPX Acircumflex Y -100\nKPX Acircumflex Yacute -100\nKPX Acircumflex Ydieresis -100\nKPX Acircumflex p -25\nKPX Acircumflex quoteright -74\nKPX Acircumflex u -50\nKPX Acircumflex uacute -50\nKPX Acircumflex ucircumflex -50\nKPX Acircumflex udieresis -50\nKPX Acircumflex ugrave -50\nKPX Acircumflex uhungarumlaut -50\nKPX Acircumflex umacron -50\nKPX Acircumflex uogonek -50\nKPX Acircumflex uring -50\nKPX Acircumflex v -100\nKPX Acircumflex w -90\nKPX Acircumflex y -74\nKPX Acircumflex yacute -74\nKPX Acircumflex ydieresis -74\nKPX Adieresis C -55\nKPX Adieresis Cacute -55\nKPX Adieresis Ccaron -55\nKPX Adieresis Ccedilla -55\nKPX Adieresis G -55\nKPX Adieresis Gbreve -55\nKPX Adieresis Gcommaaccent -55\nKPX Adieresis O -45\nKPX Adieresis Oacute -45\nKPX Adieresis Ocircumflex -45\nKPX Adieresis Odieresis -45\nKPX Adieresis Ograve -45\nKPX Adieresis Ohungarumlaut -45\nKPX Adieresis Omacron -45\nKPX Adieresis Oslash -45\nKPX Adieresis Otilde -45\nKPX Adieresis Q -45\nKPX Adieresis T -95\nKPX Adieresis Tcaron -95\nKPX Adieresis Tcommaaccent -95\nKPX Adieresis U -50\nKPX Adieresis Uacute -50\nKPX Adieresis Ucircumflex -50\nKPX Adieresis Udieresis -50\nKPX Adieresis Ugrave -50\nKPX Adieresis Uhungarumlaut -50\nKPX Adieresis Umacron -50\nKPX Adieresis Uogonek -50\nKPX Adieresis Uring -50\nKPX Adieresis V -145\nKPX Adieresis W -130\nKPX Adieresis Y -100\nKPX Adieresis Yacute -100\nKPX Adieresis Ydieresis -100\nKPX Adieresis p -25\nKPX Adieresis quoteright -74\nKPX Adieresis u -50\nKPX Adieresis uacute -50\nKPX Adieresis ucircumflex -50\nKPX Adieresis udieresis -50\nKPX Adieresis ugrave -50\nKPX Adieresis uhungarumlaut -50\nKPX Adieresis umacron -50\nKPX Adieresis uogonek -50\nKPX Adieresis uring -50\nKPX Adieresis v -100\nKPX Adieresis w -90\nKPX Adieresis y -74\nKPX Adieresis yacute -74\nKPX Adieresis ydieresis -74\nKPX Agrave C -55\nKPX Agrave Cacute -55\nKPX Agrave Ccaron -55\nKPX Agrave Ccedilla -55\nKPX Agrave G -55\nKPX Agrave Gbreve -55\nKPX Agrave Gcommaaccent -55\nKPX Agrave O -45\nKPX Agrave Oacute -45\nKPX Agrave Ocircumflex -45\nKPX Agrave Odieresis -45\nKPX Agrave Ograve -45\nKPX Agrave Ohungarumlaut -45\nKPX Agrave Omacron -45\nKPX Agrave Oslash -45\nKPX Agrave Otilde -45\nKPX Agrave Q -45\nKPX Agrave T -95\nKPX Agrave Tcaron -95\nKPX Agrave Tcommaaccent -95\nKPX Agrave U -50\nKPX Agrave Uacute -50\nKPX Agrave Ucircumflex -50\nKPX Agrave Udieresis -50\nKPX Agrave Ugrave -50\nKPX Agrave Uhungarumlaut -50\nKPX Agrave Umacron -50\nKPX Agrave Uogonek -50\nKPX Agrave Uring -50\nKPX Agrave V -145\nKPX Agrave W -130\nKPX Agrave Y -100\nKPX Agrave Yacute -100\nKPX Agrave Ydieresis -100\nKPX Agrave p -25\nKPX Agrave quoteright -74\nKPX Agrave u -50\nKPX Agrave uacute -50\nKPX Agrave ucircumflex -50\nKPX Agrave udieresis -50\nKPX Agrave ugrave -50\nKPX Agrave uhungarumlaut -50\nKPX Agrave umacron -50\nKPX Agrave uogonek -50\nKPX Agrave uring -50\nKPX Agrave v -100\nKPX Agrave w -90\nKPX Agrave y -74\nKPX Agrave yacute -74\nKPX Agrave ydieresis -74\nKPX Amacron C -55\nKPX Amacron Cacute -55\nKPX Amacron Ccaron -55\nKPX Amacron Ccedilla -55\nKPX Amacron G -55\nKPX Amacron Gbreve -55\nKPX Amacron Gcommaaccent -55\nKPX Amacron O -45\nKPX Amacron Oacute -45\nKPX Amacron Ocircumflex -45\nKPX Amacron Odieresis -45\nKPX Amacron Ograve -45\nKPX Amacron Ohungarumlaut -45\nKPX Amacron Omacron -45\nKPX Amacron Oslash -45\nKPX Amacron Otilde -45\nKPX Amacron Q -45\nKPX Amacron T -95\nKPX Amacron Tcaron -95\nKPX Amacron Tcommaaccent -95\nKPX Amacron U -50\nKPX Amacron Uacute -50\nKPX Amacron Ucircumflex -50\nKPX Amacron Udieresis -50\nKPX Amacron Ugrave -50\nKPX Amacron Uhungarumlaut -50\nKPX Amacron Umacron -50\nKPX Amacron Uogonek -50\nKPX Amacron Uring -50\nKPX Amacron V -145\nKPX Amacron W -130\nKPX Amacron Y -100\nKPX Amacron Yacute -100\nKPX Amacron Ydieresis -100\nKPX Amacron p -25\nKPX Amacron quoteright -74\nKPX Amacron u -50\nKPX Amacron uacute -50\nKPX Amacron ucircumflex -50\nKPX Amacron udieresis -50\nKPX Amacron ugrave -50\nKPX Amacron uhungarumlaut -50\nKPX Amacron umacron -50\nKPX Amacron uogonek -50\nKPX Amacron uring -50\nKPX Amacron v -100\nKPX Amacron w -90\nKPX Amacron y -74\nKPX Amacron yacute -74\nKPX Amacron ydieresis -74\nKPX Aogonek C -55\nKPX Aogonek Cacute -55\nKPX Aogonek Ccaron -55\nKPX Aogonek Ccedilla -55\nKPX Aogonek G -55\nKPX Aogonek Gbreve -55\nKPX Aogonek Gcommaaccent -55\nKPX Aogonek O -45\nKPX Aogonek Oacute -45\nKPX Aogonek Ocircumflex -45\nKPX Aogonek Odieresis -45\nKPX Aogonek Ograve -45\nKPX Aogonek Ohungarumlaut -45\nKPX Aogonek Omacron -45\nKPX Aogonek Oslash -45\nKPX Aogonek Otilde -45\nKPX Aogonek Q -45\nKPX Aogonek T -95\nKPX Aogonek Tcaron -95\nKPX Aogonek Tcommaaccent -95\nKPX Aogonek U -50\nKPX Aogonek Uacute -50\nKPX Aogonek Ucircumflex -50\nKPX Aogonek Udieresis -50\nKPX Aogonek Ugrave -50\nKPX Aogonek Uhungarumlaut -50\nKPX Aogonek Umacron -50\nKPX Aogonek Uogonek -50\nKPX Aogonek Uring -50\nKPX Aogonek V -145\nKPX Aogonek W -130\nKPX Aogonek Y -100\nKPX Aogonek Yacute -100\nKPX Aogonek Ydieresis -100\nKPX Aogonek p -25\nKPX Aogonek quoteright -74\nKPX Aogonek u -50\nKPX Aogonek uacute -50\nKPX Aogonek ucircumflex -50\nKPX Aogonek udieresis -50\nKPX Aogonek ugrave -50\nKPX Aogonek uhungarumlaut -50\nKPX Aogonek umacron -50\nKPX Aogonek uogonek -50\nKPX Aogonek uring -50\nKPX Aogonek v -100\nKPX Aogonek w -90\nKPX Aogonek y -34\nKPX Aogonek yacute -34\nKPX Aogonek ydieresis -34\nKPX Aring C -55\nKPX Aring Cacute -55\nKPX Aring Ccaron -55\nKPX Aring Ccedilla -55\nKPX Aring G -55\nKPX Aring Gbreve -55\nKPX Aring Gcommaaccent -55\nKPX Aring O -45\nKPX Aring Oacute -45\nKPX Aring Ocircumflex -45\nKPX Aring Odieresis -45\nKPX Aring Ograve -45\nKPX Aring Ohungarumlaut -45\nKPX Aring Omacron -45\nKPX Aring Oslash -45\nKPX Aring Otilde -45\nKPX Aring Q -45\nKPX Aring T -95\nKPX Aring Tcaron -95\nKPX Aring Tcommaaccent -95\nKPX Aring U -50\nKPX Aring Uacute -50\nKPX Aring Ucircumflex -50\nKPX Aring Udieresis -50\nKPX Aring Ugrave -50\nKPX Aring Uhungarumlaut -50\nKPX Aring Umacron -50\nKPX Aring Uogonek -50\nKPX Aring Uring -50\nKPX Aring V -145\nKPX Aring W -130\nKPX Aring Y -100\nKPX Aring Yacute -100\nKPX Aring Ydieresis -100\nKPX Aring p -25\nKPX Aring quoteright -74\nKPX Aring u -50\nKPX Aring uacute -50\nKPX Aring ucircumflex -50\nKPX Aring udieresis -50\nKPX Aring ugrave -50\nKPX Aring uhungarumlaut -50\nKPX Aring umacron -50\nKPX Aring uogonek -50\nKPX Aring uring -50\nKPX Aring v -100\nKPX Aring w -90\nKPX Aring y -74\nKPX Aring yacute -74\nKPX Aring ydieresis -74\nKPX Atilde C -55\nKPX Atilde Cacute -55\nKPX Atilde Ccaron -55\nKPX Atilde Ccedilla -55\nKPX Atilde G -55\nKPX Atilde Gbreve -55\nKPX Atilde Gcommaaccent -55\nKPX Atilde O -45\nKPX Atilde Oacute -45\nKPX Atilde Ocircumflex -45\nKPX Atilde Odieresis -45\nKPX Atilde Ograve -45\nKPX Atilde Ohungarumlaut -45\nKPX Atilde Omacron -45\nKPX Atilde Oslash -45\nKPX Atilde Otilde -45\nKPX Atilde Q -45\nKPX Atilde T -95\nKPX Atilde Tcaron -95\nKPX Atilde Tcommaaccent -95\nKPX Atilde U -50\nKPX Atilde Uacute -50\nKPX Atilde Ucircumflex -50\nKPX Atilde Udieresis -50\nKPX Atilde Ugrave -50\nKPX Atilde Uhungarumlaut -50\nKPX Atilde Umacron -50\nKPX Atilde Uogonek -50\nKPX Atilde Uring -50\nKPX Atilde V -145\nKPX Atilde W -130\nKPX Atilde Y -100\nKPX Atilde Yacute -100\nKPX Atilde Ydieresis -100\nKPX Atilde p -25\nKPX Atilde quoteright -74\nKPX Atilde u -50\nKPX Atilde uacute -50\nKPX Atilde ucircumflex -50\nKPX Atilde udieresis -50\nKPX Atilde ugrave -50\nKPX Atilde uhungarumlaut -50\nKPX Atilde umacron -50\nKPX Atilde uogonek -50\nKPX Atilde uring -50\nKPX Atilde v -100\nKPX Atilde w -90\nKPX Atilde y -74\nKPX Atilde yacute -74\nKPX Atilde ydieresis -74\nKPX B A -30\nKPX B Aacute -30\nKPX B Abreve -30\nKPX B Acircumflex -30\nKPX B Adieresis -30\nKPX B Agrave -30\nKPX B Amacron -30\nKPX B Aogonek -30\nKPX B Aring -30\nKPX B Atilde -30\nKPX B U -10\nKPX B Uacute -10\nKPX B Ucircumflex -10\nKPX B Udieresis -10\nKPX B Ugrave -10\nKPX B Uhungarumlaut -10\nKPX B Umacron -10\nKPX B Uogonek -10\nKPX B Uring -10\nKPX D A -35\nKPX D Aacute -35\nKPX D Abreve -35\nKPX D Acircumflex -35\nKPX D Adieresis -35\nKPX D Agrave -35\nKPX D Amacron -35\nKPX D Aogonek -35\nKPX D Aring -35\nKPX D Atilde -35\nKPX D V -40\nKPX D W -40\nKPX D Y -40\nKPX D Yacute -40\nKPX D Ydieresis -40\nKPX D period -20\nKPX Dcaron A -35\nKPX Dcaron Aacute -35\nKPX Dcaron Abreve -35\nKPX Dcaron Acircumflex -35\nKPX Dcaron Adieresis -35\nKPX Dcaron Agrave -35\nKPX Dcaron Amacron -35\nKPX Dcaron Aogonek -35\nKPX Dcaron Aring -35\nKPX Dcaron Atilde -35\nKPX Dcaron V -40\nKPX Dcaron W -40\nKPX Dcaron Y -40\nKPX Dcaron Yacute -40\nKPX Dcaron Ydieresis -40\nKPX Dcaron period -20\nKPX Dcroat A -35\nKPX Dcroat Aacute -35\nKPX Dcroat Abreve -35\nKPX Dcroat Acircumflex -35\nKPX Dcroat Adieresis -35\nKPX Dcroat Agrave -35\nKPX Dcroat Amacron -35\nKPX Dcroat Aogonek -35\nKPX Dcroat Aring -35\nKPX Dcroat Atilde -35\nKPX Dcroat V -40\nKPX Dcroat W -40\nKPX Dcroat Y -40\nKPX Dcroat Yacute -40\nKPX Dcroat Ydieresis -40\nKPX Dcroat period -20\nKPX F A -90\nKPX F Aacute -90\nKPX F Abreve -90\nKPX F Acircumflex -90\nKPX F Adieresis -90\nKPX F Agrave -90\nKPX F Amacron -90\nKPX F Aogonek -90\nKPX F Aring -90\nKPX F Atilde -90\nKPX F a -25\nKPX F aacute -25\nKPX F abreve -25\nKPX F acircumflex -25\nKPX F adieresis -25\nKPX F agrave -25\nKPX F amacron -25\nKPX F aogonek -25\nKPX F aring -25\nKPX F atilde -25\nKPX F comma -92\nKPX F e -25\nKPX F eacute -25\nKPX F ecaron -25\nKPX F ecircumflex -25\nKPX F edieresis -25\nKPX F edotaccent -25\nKPX F egrave -25\nKPX F emacron -25\nKPX F eogonek -25\nKPX F o -25\nKPX F oacute -25\nKPX F ocircumflex -25\nKPX F odieresis -25\nKPX F ograve -25\nKPX F ohungarumlaut -25\nKPX F omacron -25\nKPX F oslash -25\nKPX F otilde -25\nKPX F period -110\nKPX J A -30\nKPX J Aacute -30\nKPX J Abreve -30\nKPX J Acircumflex -30\nKPX J Adieresis -30\nKPX J Agrave -30\nKPX J Amacron -30\nKPX J Aogonek -30\nKPX J Aring -30\nKPX J Atilde -30\nKPX J a -15\nKPX J aacute -15\nKPX J abreve -15\nKPX J acircumflex -15\nKPX J adieresis -15\nKPX J agrave -15\nKPX J amacron -15\nKPX J aogonek -15\nKPX J aring -15\nKPX J atilde -15\nKPX J e -15\nKPX J eacute -15\nKPX J ecaron -15\nKPX J ecircumflex -15\nKPX J edieresis -15\nKPX J edotaccent -15\nKPX J egrave -15\nKPX J emacron -15\nKPX J eogonek -15\nKPX J o -15\nKPX J oacute -15\nKPX J ocircumflex -15\nKPX J odieresis -15\nKPX J ograve -15\nKPX J ohungarumlaut -15\nKPX J omacron -15\nKPX J oslash -15\nKPX J otilde -15\nKPX J period -20\nKPX J u -15\nKPX J uacute -15\nKPX J ucircumflex -15\nKPX J udieresis -15\nKPX J ugrave -15\nKPX J uhungarumlaut -15\nKPX J umacron -15\nKPX J uogonek -15\nKPX J uring -15\nKPX K O -30\nKPX K Oacute -30\nKPX K Ocircumflex -30\nKPX K Odieresis -30\nKPX K Ograve -30\nKPX K Ohungarumlaut -30\nKPX K Omacron -30\nKPX K Oslash -30\nKPX K Otilde -30\nKPX K e -25\nKPX K eacute -25\nKPX K ecaron -25\nKPX K ecircumflex -25\nKPX K edieresis -25\nKPX K edotaccent -25\nKPX K egrave -25\nKPX K emacron -25\nKPX K eogonek -25\nKPX K o -25\nKPX K oacute -25\nKPX K ocircumflex -25\nKPX K odieresis -25\nKPX K ograve -25\nKPX K ohungarumlaut -25\nKPX K omacron -25\nKPX K oslash -25\nKPX K otilde -25\nKPX K u -15\nKPX K uacute -15\nKPX K ucircumflex -15\nKPX K udieresis -15\nKPX K ugrave -15\nKPX K uhungarumlaut -15\nKPX K umacron -15\nKPX K uogonek -15\nKPX K uring -15\nKPX K y -45\nKPX K yacute -45\nKPX K ydieresis -45\nKPX Kcommaaccent O -30\nKPX Kcommaaccent Oacute -30\nKPX Kcommaaccent Ocircumflex -30\nKPX Kcommaaccent Odieresis -30\nKPX Kcommaaccent Ograve -30\nKPX Kcommaaccent Ohungarumlaut -30\nKPX Kcommaaccent Omacron -30\nKPX Kcommaaccent Oslash -30\nKPX Kcommaaccent Otilde -30\nKPX Kcommaaccent e -25\nKPX Kcommaaccent eacute -25\nKPX Kcommaaccent ecaron -25\nKPX Kcommaaccent ecircumflex -25\nKPX Kcommaaccent edieresis -25\nKPX Kcommaaccent edotaccent -25\nKPX Kcommaaccent egrave -25\nKPX Kcommaaccent emacron -25\nKPX Kcommaaccent eogonek -25\nKPX Kcommaaccent o -25\nKPX Kcommaaccent oacute -25\nKPX Kcommaaccent ocircumflex -25\nKPX Kcommaaccent odieresis -25\nKPX Kcommaaccent ograve -25\nKPX Kcommaaccent ohungarumlaut -25\nKPX Kcommaaccent omacron -25\nKPX Kcommaaccent oslash -25\nKPX Kcommaaccent otilde -25\nKPX Kcommaaccent u -15\nKPX Kcommaaccent uacute -15\nKPX Kcommaaccent ucircumflex -15\nKPX Kcommaaccent udieresis -15\nKPX Kcommaaccent ugrave -15\nKPX Kcommaaccent uhungarumlaut -15\nKPX Kcommaaccent umacron -15\nKPX Kcommaaccent uogonek -15\nKPX Kcommaaccent uring -15\nKPX Kcommaaccent y -45\nKPX Kcommaaccent yacute -45\nKPX Kcommaaccent ydieresis -45\nKPX L T -92\nKPX L Tcaron -92\nKPX L Tcommaaccent -92\nKPX L V -92\nKPX L W -92\nKPX L Y -92\nKPX L Yacute -92\nKPX L Ydieresis -92\nKPX L quotedblright -20\nKPX L quoteright -110\nKPX L y -55\nKPX L yacute -55\nKPX L ydieresis -55\nKPX Lacute T -92\nKPX Lacute Tcaron -92\nKPX Lacute Tcommaaccent -92\nKPX Lacute V -92\nKPX Lacute W -92\nKPX Lacute Y -92\nKPX Lacute Yacute -92\nKPX Lacute Ydieresis -92\nKPX Lacute quotedblright -20\nKPX Lacute quoteright -110\nKPX Lacute y -55\nKPX Lacute yacute -55\nKPX Lacute ydieresis -55\nKPX Lcommaaccent T -92\nKPX Lcommaaccent Tcaron -92\nKPX Lcommaaccent Tcommaaccent -92\nKPX Lcommaaccent V -92\nKPX Lcommaaccent W -92\nKPX Lcommaaccent Y -92\nKPX Lcommaaccent Yacute -92\nKPX Lcommaaccent Ydieresis -92\nKPX Lcommaaccent quotedblright -20\nKPX Lcommaaccent quoteright -110\nKPX Lcommaaccent y -55\nKPX Lcommaaccent yacute -55\nKPX Lcommaaccent ydieresis -55\nKPX Lslash T -92\nKPX Lslash Tcaron -92\nKPX Lslash Tcommaaccent -92\nKPX Lslash V -92\nKPX Lslash W -92\nKPX Lslash Y -92\nKPX Lslash Yacute -92\nKPX Lslash Ydieresis -92\nKPX Lslash quotedblright -20\nKPX Lslash quoteright -110\nKPX Lslash y -55\nKPX Lslash yacute -55\nKPX Lslash ydieresis -55\nKPX N A -20\nKPX N Aacute -20\nKPX N Abreve -20\nKPX N Acircumflex -20\nKPX N Adieresis -20\nKPX N Agrave -20\nKPX N Amacron -20\nKPX N Aogonek -20\nKPX N Aring -20\nKPX N Atilde -20\nKPX Nacute A -20\nKPX Nacute Aacute -20\nKPX Nacute Abreve -20\nKPX Nacute Acircumflex -20\nKPX Nacute Adieresis -20\nKPX Nacute Agrave -20\nKPX Nacute Amacron -20\nKPX Nacute Aogonek -20\nKPX Nacute Aring -20\nKPX Nacute Atilde -20\nKPX Ncaron A -20\nKPX Ncaron Aacute -20\nKPX Ncaron Abreve -20\nKPX Ncaron Acircumflex -20\nKPX Ncaron Adieresis -20\nKPX Ncaron Agrave -20\nKPX Ncaron Amacron -20\nKPX Ncaron Aogonek -20\nKPX Ncaron Aring -20\nKPX Ncaron Atilde -20\nKPX Ncommaaccent A -20\nKPX Ncommaaccent Aacute -20\nKPX Ncommaaccent Abreve -20\nKPX Ncommaaccent Acircumflex -20\nKPX Ncommaaccent Adieresis -20\nKPX Ncommaaccent Agrave -20\nKPX Ncommaaccent Amacron -20\nKPX Ncommaaccent Aogonek -20\nKPX Ncommaaccent Aring -20\nKPX Ncommaaccent Atilde -20\nKPX Ntilde A -20\nKPX Ntilde Aacute -20\nKPX Ntilde Abreve -20\nKPX Ntilde Acircumflex -20\nKPX Ntilde Adieresis -20\nKPX Ntilde Agrave -20\nKPX Ntilde Amacron -20\nKPX Ntilde Aogonek -20\nKPX Ntilde Aring -20\nKPX Ntilde Atilde -20\nKPX O A -40\nKPX O Aacute -40\nKPX O Abreve -40\nKPX O Acircumflex -40\nKPX O Adieresis -40\nKPX O Agrave -40\nKPX O Amacron -40\nKPX O Aogonek -40\nKPX O Aring -40\nKPX O Atilde -40\nKPX O T -40\nKPX O Tcaron -40\nKPX O Tcommaaccent -40\nKPX O V -50\nKPX O W -50\nKPX O X -40\nKPX O Y -50\nKPX O Yacute -50\nKPX O Ydieresis -50\nKPX Oacute A -40\nKPX Oacute Aacute -40\nKPX Oacute Abreve -40\nKPX Oacute Acircumflex -40\nKPX Oacute Adieresis -40\nKPX Oacute Agrave -40\nKPX Oacute Amacron -40\nKPX Oacute Aogonek -40\nKPX Oacute Aring -40\nKPX Oacute Atilde -40\nKPX Oacute T -40\nKPX Oacute Tcaron -40\nKPX Oacute Tcommaaccent -40\nKPX Oacute V -50\nKPX Oacute W -50\nKPX Oacute X -40\nKPX Oacute Y -50\nKPX Oacute Yacute -50\nKPX Oacute Ydieresis -50\nKPX Ocircumflex A -40\nKPX Ocircumflex Aacute -40\nKPX Ocircumflex Abreve -40\nKPX Ocircumflex Acircumflex -40\nKPX Ocircumflex Adieresis -40\nKPX Ocircumflex Agrave -40\nKPX Ocircumflex Amacron -40\nKPX Ocircumflex Aogonek -40\nKPX Ocircumflex Aring -40\nKPX Ocircumflex Atilde -40\nKPX Ocircumflex T -40\nKPX Ocircumflex Tcaron -40\nKPX Ocircumflex Tcommaaccent -40\nKPX Ocircumflex V -50\nKPX Ocircumflex W -50\nKPX Ocircumflex X -40\nKPX Ocircumflex Y -50\nKPX Ocircumflex Yacute -50\nKPX Ocircumflex Ydieresis -50\nKPX Odieresis A -40\nKPX Odieresis Aacute -40\nKPX Odieresis Abreve -40\nKPX Odieresis Acircumflex -40\nKPX Odieresis Adieresis -40\nKPX Odieresis Agrave -40\nKPX Odieresis Amacron -40\nKPX Odieresis Aogonek -40\nKPX Odieresis Aring -40\nKPX Odieresis Atilde -40\nKPX Odieresis T -40\nKPX Odieresis Tcaron -40\nKPX Odieresis Tcommaaccent -40\nKPX Odieresis V -50\nKPX Odieresis W -50\nKPX Odieresis X -40\nKPX Odieresis Y -50\nKPX Odieresis Yacute -50\nKPX Odieresis Ydieresis -50\nKPX Ograve A -40\nKPX Ograve Aacute -40\nKPX Ograve Abreve -40\nKPX Ograve Acircumflex -40\nKPX Ograve Adieresis -40\nKPX Ograve Agrave -40\nKPX Ograve Amacron -40\nKPX Ograve Aogonek -40\nKPX Ograve Aring -40\nKPX Ograve Atilde -40\nKPX Ograve T -40\nKPX Ograve Tcaron -40\nKPX Ograve Tcommaaccent -40\nKPX Ograve V -50\nKPX Ograve W -50\nKPX Ograve X -40\nKPX Ograve Y -50\nKPX Ograve Yacute -50\nKPX Ograve Ydieresis -50\nKPX Ohungarumlaut A -40\nKPX Ohungarumlaut Aacute -40\nKPX Ohungarumlaut Abreve -40\nKPX Ohungarumlaut Acircumflex -40\nKPX Ohungarumlaut Adieresis -40\nKPX Ohungarumlaut Agrave -40\nKPX Ohungarumlaut Amacron -40\nKPX Ohungarumlaut Aogonek -40\nKPX Ohungarumlaut Aring -40\nKPX Ohungarumlaut Atilde -40\nKPX Ohungarumlaut T -40\nKPX Ohungarumlaut Tcaron -40\nKPX Ohungarumlaut Tcommaaccent -40\nKPX Ohungarumlaut V -50\nKPX Ohungarumlaut W -50\nKPX Ohungarumlaut X -40\nKPX Ohungarumlaut Y -50\nKPX Ohungarumlaut Yacute -50\nKPX Ohungarumlaut Ydieresis -50\nKPX Omacron A -40\nKPX Omacron Aacute -40\nKPX Omacron Abreve -40\nKPX Omacron Acircumflex -40\nKPX Omacron Adieresis -40\nKPX Omacron Agrave -40\nKPX Omacron Amacron -40\nKPX Omacron Aogonek -40\nKPX Omacron Aring -40\nKPX Omacron Atilde -40\nKPX Omacron T -40\nKPX Omacron Tcaron -40\nKPX Omacron Tcommaaccent -40\nKPX Omacron V -50\nKPX Omacron W -50\nKPX Omacron X -40\nKPX Omacron Y -50\nKPX Omacron Yacute -50\nKPX Omacron Ydieresis -50\nKPX Oslash A -40\nKPX Oslash Aacute -40\nKPX Oslash Abreve -40\nKPX Oslash Acircumflex -40\nKPX Oslash Adieresis -40\nKPX Oslash Agrave -40\nKPX Oslash Amacron -40\nKPX Oslash Aogonek -40\nKPX Oslash Aring -40\nKPX Oslash Atilde -40\nKPX Oslash T -40\nKPX Oslash Tcaron -40\nKPX Oslash Tcommaaccent -40\nKPX Oslash V -50\nKPX Oslash W -50\nKPX Oslash X -40\nKPX Oslash Y -50\nKPX Oslash Yacute -50\nKPX Oslash Ydieresis -50\nKPX Otilde A -40\nKPX Otilde Aacute -40\nKPX Otilde Abreve -40\nKPX Otilde Acircumflex -40\nKPX Otilde Adieresis -40\nKPX Otilde Agrave -40\nKPX Otilde Amacron -40\nKPX Otilde Aogonek -40\nKPX Otilde Aring -40\nKPX Otilde Atilde -40\nKPX Otilde T -40\nKPX Otilde Tcaron -40\nKPX Otilde Tcommaaccent -40\nKPX Otilde V -50\nKPX Otilde W -50\nKPX Otilde X -40\nKPX Otilde Y -50\nKPX Otilde Yacute -50\nKPX Otilde Ydieresis -50\nKPX P A -74\nKPX P Aacute -74\nKPX P Abreve -74\nKPX P Acircumflex -74\nKPX P Adieresis -74\nKPX P Agrave -74\nKPX P Amacron -74\nKPX P Aogonek -74\nKPX P Aring -74\nKPX P Atilde -74\nKPX P a -10\nKPX P aacute -10\nKPX P abreve -10\nKPX P acircumflex -10\nKPX P adieresis -10\nKPX P agrave -10\nKPX P amacron -10\nKPX P aogonek -10\nKPX P aring -10\nKPX P atilde -10\nKPX P comma -92\nKPX P e -20\nKPX P eacute -20\nKPX P ecaron -20\nKPX P ecircumflex -20\nKPX P edieresis -20\nKPX P edotaccent -20\nKPX P egrave -20\nKPX P emacron -20\nKPX P eogonek -20\nKPX P o -20\nKPX P oacute -20\nKPX P ocircumflex -20\nKPX P odieresis -20\nKPX P ograve -20\nKPX P ohungarumlaut -20\nKPX P omacron -20\nKPX P oslash -20\nKPX P otilde -20\nKPX P period -110\nKPX Q U -10\nKPX Q Uacute -10\nKPX Q Ucircumflex -10\nKPX Q Udieresis -10\nKPX Q Ugrave -10\nKPX Q Uhungarumlaut -10\nKPX Q Umacron -10\nKPX Q Uogonek -10\nKPX Q Uring -10\nKPX Q period -20\nKPX R O -30\nKPX R Oacute -30\nKPX R Ocircumflex -30\nKPX R Odieresis -30\nKPX R Ograve -30\nKPX R Ohungarumlaut -30\nKPX R Omacron -30\nKPX R Oslash -30\nKPX R Otilde -30\nKPX R T -40\nKPX R Tcaron -40\nKPX R Tcommaaccent -40\nKPX R U -30\nKPX R Uacute -30\nKPX R Ucircumflex -30\nKPX R Udieresis -30\nKPX R Ugrave -30\nKPX R Uhungarumlaut -30\nKPX R Umacron -30\nKPX R Uogonek -30\nKPX R Uring -30\nKPX R V -55\nKPX R W -35\nKPX R Y -35\nKPX R Yacute -35\nKPX R Ydieresis -35\nKPX Racute O -30\nKPX Racute Oacute -30\nKPX Racute Ocircumflex -30\nKPX Racute Odieresis -30\nKPX Racute Ograve -30\nKPX Racute Ohungarumlaut -30\nKPX Racute Omacron -30\nKPX Racute Oslash -30\nKPX Racute Otilde -30\nKPX Racute T -40\nKPX Racute Tcaron -40\nKPX Racute Tcommaaccent -40\nKPX Racute U -30\nKPX Racute Uacute -30\nKPX Racute Ucircumflex -30\nKPX Racute Udieresis -30\nKPX Racute Ugrave -30\nKPX Racute Uhungarumlaut -30\nKPX Racute Umacron -30\nKPX Racute Uogonek -30\nKPX Racute Uring -30\nKPX Racute V -55\nKPX Racute W -35\nKPX Racute Y -35\nKPX Racute Yacute -35\nKPX Racute Ydieresis -35\nKPX Rcaron O -30\nKPX Rcaron Oacute -30\nKPX Rcaron Ocircumflex -30\nKPX Rcaron Odieresis -30\nKPX Rcaron Ograve -30\nKPX Rcaron Ohungarumlaut -30\nKPX Rcaron Omacron -30\nKPX Rcaron Oslash -30\nKPX Rcaron Otilde -30\nKPX Rcaron T -40\nKPX Rcaron Tcaron -40\nKPX Rcaron Tcommaaccent -40\nKPX Rcaron U -30\nKPX Rcaron Uacute -30\nKPX Rcaron Ucircumflex -30\nKPX Rcaron Udieresis -30\nKPX Rcaron Ugrave -30\nKPX Rcaron Uhungarumlaut -30\nKPX Rcaron Umacron -30\nKPX Rcaron Uogonek -30\nKPX Rcaron Uring -30\nKPX Rcaron V -55\nKPX Rcaron W -35\nKPX Rcaron Y -35\nKPX Rcaron Yacute -35\nKPX Rcaron Ydieresis -35\nKPX Rcommaaccent O -30\nKPX Rcommaaccent Oacute -30\nKPX Rcommaaccent Ocircumflex -30\nKPX Rcommaaccent Odieresis -30\nKPX Rcommaaccent Ograve -30\nKPX Rcommaaccent Ohungarumlaut -30\nKPX Rcommaaccent Omacron -30\nKPX Rcommaaccent Oslash -30\nKPX Rcommaaccent Otilde -30\nKPX Rcommaaccent T -40\nKPX Rcommaaccent Tcaron -40\nKPX Rcommaaccent Tcommaaccent -40\nKPX Rcommaaccent U -30\nKPX Rcommaaccent Uacute -30\nKPX Rcommaaccent Ucircumflex -30\nKPX Rcommaaccent Udieresis -30\nKPX Rcommaaccent Ugrave -30\nKPX Rcommaaccent Uhungarumlaut -30\nKPX Rcommaaccent Umacron -30\nKPX Rcommaaccent Uogonek -30\nKPX Rcommaaccent Uring -30\nKPX Rcommaaccent V -55\nKPX Rcommaaccent W -35\nKPX Rcommaaccent Y -35\nKPX Rcommaaccent Yacute -35\nKPX Rcommaaccent Ydieresis -35\nKPX T A -90\nKPX T Aacute -90\nKPX T Abreve -90\nKPX T Acircumflex -90\nKPX T Adieresis -90\nKPX T Agrave -90\nKPX T Amacron -90\nKPX T Aogonek -90\nKPX T Aring -90\nKPX T Atilde -90\nKPX T O -18\nKPX T Oacute -18\nKPX T Ocircumflex -18\nKPX T Odieresis -18\nKPX T Ograve -18\nKPX T Ohungarumlaut -18\nKPX T Omacron -18\nKPX T Oslash -18\nKPX T Otilde -18\nKPX T a -92\nKPX T aacute -92\nKPX T abreve -52\nKPX T acircumflex -52\nKPX T adieresis -52\nKPX T agrave -52\nKPX T amacron -52\nKPX T aogonek -92\nKPX T aring -92\nKPX T atilde -52\nKPX T colon -74\nKPX T comma -74\nKPX T e -92\nKPX T eacute -92\nKPX T ecaron -92\nKPX T ecircumflex -92\nKPX T edieresis -52\nKPX T edotaccent -92\nKPX T egrave -52\nKPX T emacron -52\nKPX T eogonek -92\nKPX T hyphen -92\nKPX T i -18\nKPX T iacute -18\nKPX T iogonek -18\nKPX T o -92\nKPX T oacute -92\nKPX T ocircumflex -92\nKPX T odieresis -92\nKPX T ograve -92\nKPX T ohungarumlaut -92\nKPX T omacron -92\nKPX T oslash -92\nKPX T otilde -92\nKPX T period -90\nKPX T r -74\nKPX T racute -74\nKPX T rcaron -74\nKPX T rcommaaccent -74\nKPX T semicolon -74\nKPX T u -92\nKPX T uacute -92\nKPX T ucircumflex -92\nKPX T udieresis -92\nKPX T ugrave -92\nKPX T uhungarumlaut -92\nKPX T umacron -92\nKPX T uogonek -92\nKPX T uring -92\nKPX T w -74\nKPX T y -34\nKPX T yacute -34\nKPX T ydieresis -34\nKPX Tcaron A -90\nKPX Tcaron Aacute -90\nKPX Tcaron Abreve -90\nKPX Tcaron Acircumflex -90\nKPX Tcaron Adieresis -90\nKPX Tcaron Agrave -90\nKPX Tcaron Amacron -90\nKPX Tcaron Aogonek -90\nKPX Tcaron Aring -90\nKPX Tcaron Atilde -90\nKPX Tcaron O -18\nKPX Tcaron Oacute -18\nKPX Tcaron Ocircumflex -18\nKPX Tcaron Odieresis -18\nKPX Tcaron Ograve -18\nKPX Tcaron Ohungarumlaut -18\nKPX Tcaron Omacron -18\nKPX Tcaron Oslash -18\nKPX Tcaron Otilde -18\nKPX Tcaron a -92\nKPX Tcaron aacute -92\nKPX Tcaron abreve -52\nKPX Tcaron acircumflex -52\nKPX Tcaron adieresis -52\nKPX Tcaron agrave -52\nKPX Tcaron amacron -52\nKPX Tcaron aogonek -92\nKPX Tcaron aring -92\nKPX Tcaron atilde -52\nKPX Tcaron colon -74\nKPX Tcaron comma -74\nKPX Tcaron e -92\nKPX Tcaron eacute -92\nKPX Tcaron ecaron -92\nKPX Tcaron ecircumflex -92\nKPX Tcaron edieresis -52\nKPX Tcaron edotaccent -92\nKPX Tcaron egrave -52\nKPX Tcaron emacron -52\nKPX Tcaron eogonek -92\nKPX Tcaron hyphen -92\nKPX Tcaron i -18\nKPX Tcaron iacute -18\nKPX Tcaron iogonek -18\nKPX Tcaron o -92\nKPX Tcaron oacute -92\nKPX Tcaron ocircumflex -92\nKPX Tcaron odieresis -92\nKPX Tcaron ograve -92\nKPX Tcaron ohungarumlaut -92\nKPX Tcaron omacron -92\nKPX Tcaron oslash -92\nKPX Tcaron otilde -92\nKPX Tcaron period -90\nKPX Tcaron r -74\nKPX Tcaron racute -74\nKPX Tcaron rcaron -74\nKPX Tcaron rcommaaccent -74\nKPX Tcaron semicolon -74\nKPX Tcaron u -92\nKPX Tcaron uacute -92\nKPX Tcaron ucircumflex -92\nKPX Tcaron udieresis -92\nKPX Tcaron ugrave -92\nKPX Tcaron uhungarumlaut -92\nKPX Tcaron umacron -92\nKPX Tcaron uogonek -92\nKPX Tcaron uring -92\nKPX Tcaron w -74\nKPX Tcaron y -34\nKPX Tcaron yacute -34\nKPX Tcaron ydieresis -34\nKPX Tcommaaccent A -90\nKPX Tcommaaccent Aacute -90\nKPX Tcommaaccent Abreve -90\nKPX Tcommaaccent Acircumflex -90\nKPX Tcommaaccent Adieresis -90\nKPX Tcommaaccent Agrave -90\nKPX Tcommaaccent Amacron -90\nKPX Tcommaaccent Aogonek -90\nKPX Tcommaaccent Aring -90\nKPX Tcommaaccent Atilde -90\nKPX Tcommaaccent O -18\nKPX Tcommaaccent Oacute -18\nKPX Tcommaaccent Ocircumflex -18\nKPX Tcommaaccent Odieresis -18\nKPX Tcommaaccent Ograve -18\nKPX Tcommaaccent Ohungarumlaut -18\nKPX Tcommaaccent Omacron -18\nKPX Tcommaaccent Oslash -18\nKPX Tcommaaccent Otilde -18\nKPX Tcommaaccent a -92\nKPX Tcommaaccent aacute -92\nKPX Tcommaaccent abreve -52\nKPX Tcommaaccent acircumflex -52\nKPX Tcommaaccent adieresis -52\nKPX Tcommaaccent agrave -52\nKPX Tcommaaccent amacron -52\nKPX Tcommaaccent aogonek -92\nKPX Tcommaaccent aring -92\nKPX Tcommaaccent atilde -52\nKPX Tcommaaccent colon -74\nKPX Tcommaaccent comma -74\nKPX Tcommaaccent e -92\nKPX Tcommaaccent eacute -92\nKPX Tcommaaccent ecaron -92\nKPX Tcommaaccent ecircumflex -92\nKPX Tcommaaccent edieresis -52\nKPX Tcommaaccent edotaccent -92\nKPX Tcommaaccent egrave -52\nKPX Tcommaaccent emacron -52\nKPX Tcommaaccent eogonek -92\nKPX Tcommaaccent hyphen -92\nKPX Tcommaaccent i -18\nKPX Tcommaaccent iacute -18\nKPX Tcommaaccent iogonek -18\nKPX Tcommaaccent o -92\nKPX Tcommaaccent oacute -92\nKPX Tcommaaccent ocircumflex -92\nKPX Tcommaaccent odieresis -92\nKPX Tcommaaccent ograve -92\nKPX Tcommaaccent ohungarumlaut -92\nKPX Tcommaaccent omacron -92\nKPX Tcommaaccent oslash -92\nKPX Tcommaaccent otilde -92\nKPX Tcommaaccent period -90\nKPX Tcommaaccent r -74\nKPX Tcommaaccent racute -74\nKPX Tcommaaccent rcaron -74\nKPX Tcommaaccent rcommaaccent -74\nKPX Tcommaaccent semicolon -74\nKPX Tcommaaccent u -92\nKPX Tcommaaccent uacute -92\nKPX Tcommaaccent ucircumflex -92\nKPX Tcommaaccent udieresis -92\nKPX Tcommaaccent ugrave -92\nKPX Tcommaaccent uhungarumlaut -92\nKPX Tcommaaccent umacron -92\nKPX Tcommaaccent uogonek -92\nKPX Tcommaaccent uring -92\nKPX Tcommaaccent w -74\nKPX Tcommaaccent y -34\nKPX Tcommaaccent yacute -34\nKPX Tcommaaccent ydieresis -34\nKPX U A -60\nKPX U Aacute -60\nKPX U Abreve -60\nKPX U Acircumflex -60\nKPX U Adieresis -60\nKPX U Agrave -60\nKPX U Amacron -60\nKPX U Aogonek -60\nKPX U Aring -60\nKPX U Atilde -60\nKPX U comma -50\nKPX U period -50\nKPX Uacute A -60\nKPX Uacute Aacute -60\nKPX Uacute Abreve -60\nKPX Uacute Acircumflex -60\nKPX Uacute Adieresis -60\nKPX Uacute Agrave -60\nKPX Uacute Amacron -60\nKPX Uacute Aogonek -60\nKPX Uacute Aring -60\nKPX Uacute Atilde -60\nKPX Uacute comma -50\nKPX Uacute period -50\nKPX Ucircumflex A -60\nKPX Ucircumflex Aacute -60\nKPX Ucircumflex Abreve -60\nKPX Ucircumflex Acircumflex -60\nKPX Ucircumflex Adieresis -60\nKPX Ucircumflex Agrave -60\nKPX Ucircumflex Amacron -60\nKPX Ucircumflex Aogonek -60\nKPX Ucircumflex Aring -60\nKPX Ucircumflex Atilde -60\nKPX Ucircumflex comma -50\nKPX Ucircumflex period -50\nKPX Udieresis A -60\nKPX Udieresis Aacute -60\nKPX Udieresis Abreve -60\nKPX Udieresis Acircumflex -60\nKPX Udieresis Adieresis -60\nKPX Udieresis Agrave -60\nKPX Udieresis Amacron -60\nKPX Udieresis Aogonek -60\nKPX Udieresis Aring -60\nKPX Udieresis Atilde -60\nKPX Udieresis comma -50\nKPX Udieresis period -50\nKPX Ugrave A -60\nKPX Ugrave Aacute -60\nKPX Ugrave Abreve -60\nKPX Ugrave Acircumflex -60\nKPX Ugrave Adieresis -60\nKPX Ugrave Agrave -60\nKPX Ugrave Amacron -60\nKPX Ugrave Aogonek -60\nKPX Ugrave Aring -60\nKPX Ugrave Atilde -60\nKPX Ugrave comma -50\nKPX Ugrave period -50\nKPX Uhungarumlaut A -60\nKPX Uhungarumlaut Aacute -60\nKPX Uhungarumlaut Abreve -60\nKPX Uhungarumlaut Acircumflex -60\nKPX Uhungarumlaut Adieresis -60\nKPX Uhungarumlaut Agrave -60\nKPX Uhungarumlaut Amacron -60\nKPX Uhungarumlaut Aogonek -60\nKPX Uhungarumlaut Aring -60\nKPX Uhungarumlaut Atilde -60\nKPX Uhungarumlaut comma -50\nKPX Uhungarumlaut period -50\nKPX Umacron A -60\nKPX Umacron Aacute -60\nKPX Umacron Abreve -60\nKPX Umacron Acircumflex -60\nKPX Umacron Adieresis -60\nKPX Umacron Agrave -60\nKPX Umacron Amacron -60\nKPX Umacron Aogonek -60\nKPX Umacron Aring -60\nKPX Umacron Atilde -60\nKPX Umacron comma -50\nKPX Umacron period -50\nKPX Uogonek A -60\nKPX Uogonek Aacute -60\nKPX Uogonek Abreve -60\nKPX Uogonek Acircumflex -60\nKPX Uogonek Adieresis -60\nKPX Uogonek Agrave -60\nKPX Uogonek Amacron -60\nKPX Uogonek Aogonek -60\nKPX Uogonek Aring -60\nKPX Uogonek Atilde -60\nKPX Uogonek comma -50\nKPX Uogonek period -50\nKPX Uring A -60\nKPX Uring Aacute -60\nKPX Uring Abreve -60\nKPX Uring Acircumflex -60\nKPX Uring Adieresis -60\nKPX Uring Agrave -60\nKPX Uring Amacron -60\nKPX Uring Aogonek -60\nKPX Uring Aring -60\nKPX Uring Atilde -60\nKPX Uring comma -50\nKPX Uring period -50\nKPX V A -135\nKPX V Aacute -135\nKPX V Abreve -135\nKPX V Acircumflex -135\nKPX V Adieresis -135\nKPX V Agrave -135\nKPX V Amacron -135\nKPX V Aogonek -135\nKPX V Aring -135\nKPX V Atilde -135\nKPX V G -30\nKPX V Gbreve -30\nKPX V Gcommaaccent -30\nKPX V O -45\nKPX V Oacute -45\nKPX V Ocircumflex -45\nKPX V Odieresis -45\nKPX V Ograve -45\nKPX V Ohungarumlaut -45\nKPX V Omacron -45\nKPX V Oslash -45\nKPX V Otilde -45\nKPX V a -92\nKPX V aacute -92\nKPX V abreve -92\nKPX V acircumflex -92\nKPX V adieresis -92\nKPX V agrave -92\nKPX V amacron -92\nKPX V aogonek -92\nKPX V aring -92\nKPX V atilde -92\nKPX V colon -92\nKPX V comma -129\nKPX V e -100\nKPX V eacute -100\nKPX V ecaron -100\nKPX V ecircumflex -100\nKPX V edieresis -100\nKPX V edotaccent -100\nKPX V egrave -100\nKPX V emacron -100\nKPX V eogonek -100\nKPX V hyphen -74\nKPX V i -37\nKPX V iacute -37\nKPX V icircumflex -37\nKPX V idieresis -37\nKPX V igrave -37\nKPX V imacron -37\nKPX V iogonek -37\nKPX V o -100\nKPX V oacute -100\nKPX V ocircumflex -100\nKPX V odieresis -100\nKPX V ograve -100\nKPX V ohungarumlaut -100\nKPX V omacron -100\nKPX V oslash -100\nKPX V otilde -100\nKPX V period -145\nKPX V semicolon -92\nKPX V u -92\nKPX V uacute -92\nKPX V ucircumflex -92\nKPX V udieresis -92\nKPX V ugrave -92\nKPX V uhungarumlaut -92\nKPX V umacron -92\nKPX V uogonek -92\nKPX V uring -92\nKPX W A -120\nKPX W Aacute -120\nKPX W Abreve -120\nKPX W Acircumflex -120\nKPX W Adieresis -120\nKPX W Agrave -120\nKPX W Amacron -120\nKPX W Aogonek -120\nKPX W Aring -120\nKPX W Atilde -120\nKPX W O -10\nKPX W Oacute -10\nKPX W Ocircumflex -10\nKPX W Odieresis -10\nKPX W Ograve -10\nKPX W Ohungarumlaut -10\nKPX W Omacron -10\nKPX W Oslash -10\nKPX W Otilde -10\nKPX W a -65\nKPX W aacute -65\nKPX W abreve -65\nKPX W acircumflex -65\nKPX W adieresis -65\nKPX W agrave -65\nKPX W amacron -65\nKPX W aogonek -65\nKPX W aring -65\nKPX W atilde -65\nKPX W colon -55\nKPX W comma -92\nKPX W e -65\nKPX W eacute -65\nKPX W ecaron -65\nKPX W ecircumflex -65\nKPX W edieresis -65\nKPX W edotaccent -65\nKPX W egrave -65\nKPX W emacron -65\nKPX W eogonek -65\nKPX W hyphen -37\nKPX W i -18\nKPX W iacute -18\nKPX W iogonek -18\nKPX W o -75\nKPX W oacute -75\nKPX W ocircumflex -75\nKPX W odieresis -75\nKPX W ograve -75\nKPX W ohungarumlaut -75\nKPX W omacron -75\nKPX W oslash -75\nKPX W otilde -75\nKPX W period -92\nKPX W semicolon -55\nKPX W u -50\nKPX W uacute -50\nKPX W ucircumflex -50\nKPX W udieresis -50\nKPX W ugrave -50\nKPX W uhungarumlaut -50\nKPX W umacron -50\nKPX W uogonek -50\nKPX W uring -50\nKPX W y -60\nKPX W yacute -60\nKPX W ydieresis -60\nKPX Y A -110\nKPX Y Aacute -110\nKPX Y Abreve -110\nKPX Y Acircumflex -110\nKPX Y Adieresis -110\nKPX Y Agrave -110\nKPX Y Amacron -110\nKPX Y Aogonek -110\nKPX Y Aring -110\nKPX Y Atilde -110\nKPX Y O -35\nKPX Y Oacute -35\nKPX Y Ocircumflex -35\nKPX Y Odieresis -35\nKPX Y Ograve -35\nKPX Y Ohungarumlaut -35\nKPX Y Omacron -35\nKPX Y Oslash -35\nKPX Y Otilde -35\nKPX Y a -85\nKPX Y aacute -85\nKPX Y abreve -85\nKPX Y acircumflex -85\nKPX Y adieresis -85\nKPX Y agrave -85\nKPX Y amacron -85\nKPX Y aogonek -85\nKPX Y aring -85\nKPX Y atilde -85\nKPX Y colon -92\nKPX Y comma -92\nKPX Y e -111\nKPX Y eacute -111\nKPX Y ecaron -111\nKPX Y ecircumflex -111\nKPX Y edieresis -71\nKPX Y edotaccent -111\nKPX Y egrave -71\nKPX Y emacron -71\nKPX Y eogonek -111\nKPX Y hyphen -92\nKPX Y i -37\nKPX Y iacute -37\nKPX Y iogonek -37\nKPX Y o -111\nKPX Y oacute -111\nKPX Y ocircumflex -111\nKPX Y odieresis -111\nKPX Y ograve -111\nKPX Y ohungarumlaut -111\nKPX Y omacron -111\nKPX Y oslash -111\nKPX Y otilde -111\nKPX Y period -92\nKPX Y semicolon -92\nKPX Y u -92\nKPX Y uacute -92\nKPX Y ucircumflex -92\nKPX Y udieresis -92\nKPX Y ugrave -92\nKPX Y uhungarumlaut -92\nKPX Y umacron -92\nKPX Y uogonek -92\nKPX Y uring -92\nKPX Yacute A -110\nKPX Yacute Aacute -110\nKPX Yacute Abreve -110\nKPX Yacute Acircumflex -110\nKPX Yacute Adieresis -110\nKPX Yacute Agrave -110\nKPX Yacute Amacron -110\nKPX Yacute Aogonek -110\nKPX Yacute Aring -110\nKPX Yacute Atilde -110\nKPX Yacute O -35\nKPX Yacute Oacute -35\nKPX Yacute Ocircumflex -35\nKPX Yacute Odieresis -35\nKPX Yacute Ograve -35\nKPX Yacute Ohungarumlaut -35\nKPX Yacute Omacron -35\nKPX Yacute Oslash -35\nKPX Yacute Otilde -35\nKPX Yacute a -85\nKPX Yacute aacute -85\nKPX Yacute abreve -85\nKPX Yacute acircumflex -85\nKPX Yacute adieresis -85\nKPX Yacute agrave -85\nKPX Yacute amacron -85\nKPX Yacute aogonek -85\nKPX Yacute aring -85\nKPX Yacute atilde -85\nKPX Yacute colon -92\nKPX Yacute comma -92\nKPX Yacute e -111\nKPX Yacute eacute -111\nKPX Yacute ecaron -111\nKPX Yacute ecircumflex -111\nKPX Yacute edieresis -71\nKPX Yacute edotaccent -111\nKPX Yacute egrave -71\nKPX Yacute emacron -71\nKPX Yacute eogonek -111\nKPX Yacute hyphen -92\nKPX Yacute i -37\nKPX Yacute iacute -37\nKPX Yacute iogonek -37\nKPX Yacute o -111\nKPX Yacute oacute -111\nKPX Yacute ocircumflex -111\nKPX Yacute odieresis -111\nKPX Yacute ograve -111\nKPX Yacute ohungarumlaut -111\nKPX Yacute omacron -111\nKPX Yacute oslash -111\nKPX Yacute otilde -111\nKPX Yacute period -92\nKPX Yacute semicolon -92\nKPX Yacute u -92\nKPX Yacute uacute -92\nKPX Yacute ucircumflex -92\nKPX Yacute udieresis -92\nKPX Yacute ugrave -92\nKPX Yacute uhungarumlaut -92\nKPX Yacute umacron -92\nKPX Yacute uogonek -92\nKPX Yacute uring -92\nKPX Ydieresis A -110\nKPX Ydieresis Aacute -110\nKPX Ydieresis Abreve -110\nKPX Ydieresis Acircumflex -110\nKPX Ydieresis Adieresis -110\nKPX Ydieresis Agrave -110\nKPX Ydieresis Amacron -110\nKPX Ydieresis Aogonek -110\nKPX Ydieresis Aring -110\nKPX Ydieresis Atilde -110\nKPX Ydieresis O -35\nKPX Ydieresis Oacute -35\nKPX Ydieresis Ocircumflex -35\nKPX Ydieresis Odieresis -35\nKPX Ydieresis Ograve -35\nKPX Ydieresis Ohungarumlaut -35\nKPX Ydieresis Omacron -35\nKPX Ydieresis Oslash -35\nKPX Ydieresis Otilde -35\nKPX Ydieresis a -85\nKPX Ydieresis aacute -85\nKPX Ydieresis abreve -85\nKPX Ydieresis acircumflex -85\nKPX Ydieresis adieresis -85\nKPX Ydieresis agrave -85\nKPX Ydieresis amacron -85\nKPX Ydieresis aogonek -85\nKPX Ydieresis aring -85\nKPX Ydieresis atilde -85\nKPX Ydieresis colon -92\nKPX Ydieresis comma -92\nKPX Ydieresis e -111\nKPX Ydieresis eacute -111\nKPX Ydieresis ecaron -111\nKPX Ydieresis ecircumflex -111\nKPX Ydieresis edieresis -71\nKPX Ydieresis edotaccent -111\nKPX Ydieresis egrave -71\nKPX Ydieresis emacron -71\nKPX Ydieresis eogonek -111\nKPX Ydieresis hyphen -92\nKPX Ydieresis i -37\nKPX Ydieresis iacute -37\nKPX Ydieresis iogonek -37\nKPX Ydieresis o -111\nKPX Ydieresis oacute -111\nKPX Ydieresis ocircumflex -111\nKPX Ydieresis odieresis -111\nKPX Ydieresis ograve -111\nKPX Ydieresis ohungarumlaut -111\nKPX Ydieresis omacron -111\nKPX Ydieresis oslash -111\nKPX Ydieresis otilde -111\nKPX Ydieresis period -92\nKPX Ydieresis semicolon -92\nKPX Ydieresis u -92\nKPX Ydieresis uacute -92\nKPX Ydieresis ucircumflex -92\nKPX Ydieresis udieresis -92\nKPX Ydieresis ugrave -92\nKPX Ydieresis uhungarumlaut -92\nKPX Ydieresis umacron -92\nKPX Ydieresis uogonek -92\nKPX Ydieresis uring -92\nKPX a v -25\nKPX aacute v -25\nKPX abreve v -25\nKPX acircumflex v -25\nKPX adieresis v -25\nKPX agrave v -25\nKPX amacron v -25\nKPX aogonek v -25\nKPX aring v -25\nKPX atilde v -25\nKPX b b -10\nKPX b period -40\nKPX b u -20\nKPX b uacute -20\nKPX b ucircumflex -20\nKPX b udieresis -20\nKPX b ugrave -20\nKPX b uhungarumlaut -20\nKPX b umacron -20\nKPX b uogonek -20\nKPX b uring -20\nKPX b v -15\nKPX comma quotedblright -45\nKPX comma quoteright -55\nKPX d w -15\nKPX dcroat w -15\nKPX e v -15\nKPX eacute v -15\nKPX ecaron v -15\nKPX ecircumflex v -15\nKPX edieresis v -15\nKPX edotaccent v -15\nKPX egrave v -15\nKPX emacron v -15\nKPX eogonek v -15\nKPX f comma -15\nKPX f dotlessi -35\nKPX f i -25\nKPX f o -25\nKPX f oacute -25\nKPX f ocircumflex -25\nKPX f odieresis -25\nKPX f ograve -25\nKPX f ohungarumlaut -25\nKPX f omacron -25\nKPX f oslash -25\nKPX f otilde -25\nKPX f period -15\nKPX f quotedblright 50\nKPX f quoteright 55\nKPX g period -15\nKPX gbreve period -15\nKPX gcommaaccent period -15\nKPX h y -15\nKPX h yacute -15\nKPX h ydieresis -15\nKPX i v -10\nKPX iacute v -10\nKPX icircumflex v -10\nKPX idieresis v -10\nKPX igrave v -10\nKPX imacron v -10\nKPX iogonek v -10\nKPX k e -10\nKPX k eacute -10\nKPX k ecaron -10\nKPX k ecircumflex -10\nKPX k edieresis -10\nKPX k edotaccent -10\nKPX k egrave -10\nKPX k emacron -10\nKPX k eogonek -10\nKPX k o -15\nKPX k oacute -15\nKPX k ocircumflex -15\nKPX k odieresis -15\nKPX k ograve -15\nKPX k ohungarumlaut -15\nKPX k omacron -15\nKPX k oslash -15\nKPX k otilde -15\nKPX k y -15\nKPX k yacute -15\nKPX k ydieresis -15\nKPX kcommaaccent e -10\nKPX kcommaaccent eacute -10\nKPX kcommaaccent ecaron -10\nKPX kcommaaccent ecircumflex -10\nKPX kcommaaccent edieresis -10\nKPX kcommaaccent edotaccent -10\nKPX kcommaaccent egrave -10\nKPX kcommaaccent emacron -10\nKPX kcommaaccent eogonek -10\nKPX kcommaaccent o -15\nKPX kcommaaccent oacute -15\nKPX kcommaaccent ocircumflex -15\nKPX kcommaaccent odieresis -15\nKPX kcommaaccent ograve -15\nKPX kcommaaccent ohungarumlaut -15\nKPX kcommaaccent omacron -15\nKPX kcommaaccent oslash -15\nKPX kcommaaccent otilde -15\nKPX kcommaaccent y -15\nKPX kcommaaccent yacute -15\nKPX kcommaaccent ydieresis -15\nKPX n v -40\nKPX nacute v -40\nKPX ncaron v -40\nKPX ncommaaccent v -40\nKPX ntilde v -40\nKPX o v -10\nKPX o w -10\nKPX oacute v -10\nKPX oacute w -10\nKPX ocircumflex v -10\nKPX ocircumflex w -10\nKPX odieresis v -10\nKPX odieresis w -10\nKPX ograve v -10\nKPX ograve w -10\nKPX ohungarumlaut v -10\nKPX ohungarumlaut w -10\nKPX omacron v -10\nKPX omacron w -10\nKPX oslash v -10\nKPX oslash w -10\nKPX otilde v -10\nKPX otilde w -10\nKPX period quotedblright -55\nKPX period quoteright -55\nKPX quotedblleft A -10\nKPX quotedblleft Aacute -10\nKPX quotedblleft Abreve -10\nKPX quotedblleft Acircumflex -10\nKPX quotedblleft Adieresis -10\nKPX quotedblleft Agrave -10\nKPX quotedblleft Amacron -10\nKPX quotedblleft Aogonek -10\nKPX quotedblleft Aring -10\nKPX quotedblleft Atilde -10\nKPX quoteleft A -10\nKPX quoteleft Aacute -10\nKPX quoteleft Abreve -10\nKPX quoteleft Acircumflex -10\nKPX quoteleft Adieresis -10\nKPX quoteleft Agrave -10\nKPX quoteleft Amacron -10\nKPX quoteleft Aogonek -10\nKPX quoteleft Aring -10\nKPX quoteleft Atilde -10\nKPX quoteleft quoteleft -63\nKPX quoteright d -20\nKPX quoteright dcroat -20\nKPX quoteright quoteright -63\nKPX quoteright r -20\nKPX quoteright racute -20\nKPX quoteright rcaron -20\nKPX quoteright rcommaaccent -20\nKPX quoteright s -37\nKPX quoteright sacute -37\nKPX quoteright scaron -37\nKPX quoteright scedilla -37\nKPX quoteright scommaaccent -37\nKPX quoteright space -74\nKPX quoteright v -20\nKPX r c -18\nKPX r cacute -18\nKPX r ccaron -18\nKPX r ccedilla -18\nKPX r comma -92\nKPX r e -18\nKPX r eacute -18\nKPX r ecaron -18\nKPX r ecircumflex -18\nKPX r edieresis -18\nKPX r edotaccent -18\nKPX r egrave -18\nKPX r emacron -18\nKPX r eogonek -18\nKPX r g -10\nKPX r gbreve -10\nKPX r gcommaaccent -10\nKPX r hyphen -37\nKPX r n -15\nKPX r nacute -15\nKPX r ncaron -15\nKPX r ncommaaccent -15\nKPX r ntilde -15\nKPX r o -18\nKPX r oacute -18\nKPX r ocircumflex -18\nKPX r odieresis -18\nKPX r ograve -18\nKPX r ohungarumlaut -18\nKPX r omacron -18\nKPX r oslash -18\nKPX r otilde -18\nKPX r p -10\nKPX r period -100\nKPX r q -18\nKPX r v -10\nKPX racute c -18\nKPX racute cacute -18\nKPX racute ccaron -18\nKPX racute ccedilla -18\nKPX racute comma -92\nKPX racute e -18\nKPX racute eacute -18\nKPX racute ecaron -18\nKPX racute ecircumflex -18\nKPX racute edieresis -18\nKPX racute edotaccent -18\nKPX racute egrave -18\nKPX racute emacron -18\nKPX racute eogonek -18\nKPX racute g -10\nKPX racute gbreve -10\nKPX racute gcommaaccent -10\nKPX racute hyphen -37\nKPX racute n -15\nKPX racute nacute -15\nKPX racute ncaron -15\nKPX racute ncommaaccent -15\nKPX racute ntilde -15\nKPX racute o -18\nKPX racute oacute -18\nKPX racute ocircumflex -18\nKPX racute odieresis -18\nKPX racute ograve -18\nKPX racute ohungarumlaut -18\nKPX racute omacron -18\nKPX racute oslash -18\nKPX racute otilde -18\nKPX racute p -10\nKPX racute period -100\nKPX racute q -18\nKPX racute v -10\nKPX rcaron c -18\nKPX rcaron cacute -18\nKPX rcaron ccaron -18\nKPX rcaron ccedilla -18\nKPX rcaron comma -92\nKPX rcaron e -18\nKPX rcaron eacute -18\nKPX rcaron ecaron -18\nKPX rcaron ecircumflex -18\nKPX rcaron edieresis -18\nKPX rcaron edotaccent -18\nKPX rcaron egrave -18\nKPX rcaron emacron -18\nKPX rcaron eogonek -18\nKPX rcaron g -10\nKPX rcaron gbreve -10\nKPX rcaron gcommaaccent -10\nKPX rcaron hyphen -37\nKPX rcaron n -15\nKPX rcaron nacute -15\nKPX rcaron ncaron -15\nKPX rcaron ncommaaccent -15\nKPX rcaron ntilde -15\nKPX rcaron o -18\nKPX rcaron oacute -18\nKPX rcaron ocircumflex -18\nKPX rcaron odieresis -18\nKPX rcaron ograve -18\nKPX rcaron ohungarumlaut -18\nKPX rcaron omacron -18\nKPX rcaron oslash -18\nKPX rcaron otilde -18\nKPX rcaron p -10\nKPX rcaron period -100\nKPX rcaron q -18\nKPX rcaron v -10\nKPX rcommaaccent c -18\nKPX rcommaaccent cacute -18\nKPX rcommaaccent ccaron -18\nKPX rcommaaccent ccedilla -18\nKPX rcommaaccent comma -92\nKPX rcommaaccent e -18\nKPX rcommaaccent eacute -18\nKPX rcommaaccent ecaron -18\nKPX rcommaaccent ecircumflex -18\nKPX rcommaaccent edieresis -18\nKPX rcommaaccent edotaccent -18\nKPX rcommaaccent egrave -18\nKPX rcommaaccent emacron -18\nKPX rcommaaccent eogonek -18\nKPX rcommaaccent g -10\nKPX rcommaaccent gbreve -10\nKPX rcommaaccent gcommaaccent -10\nKPX rcommaaccent hyphen -37\nKPX rcommaaccent n -15\nKPX rcommaaccent nacute -15\nKPX rcommaaccent ncaron -15\nKPX rcommaaccent ncommaaccent -15\nKPX rcommaaccent ntilde -15\nKPX rcommaaccent o -18\nKPX rcommaaccent oacute -18\nKPX rcommaaccent ocircumflex -18\nKPX rcommaaccent odieresis -18\nKPX rcommaaccent ograve -18\nKPX rcommaaccent ohungarumlaut -18\nKPX rcommaaccent omacron -18\nKPX rcommaaccent oslash -18\nKPX rcommaaccent otilde -18\nKPX rcommaaccent p -10\nKPX rcommaaccent period -100\nKPX rcommaaccent q -18\nKPX rcommaaccent v -10\nKPX space A -55\nKPX space Aacute -55\nKPX space Abreve -55\nKPX space Acircumflex -55\nKPX space Adieresis -55\nKPX space Agrave -55\nKPX space Amacron -55\nKPX space Aogonek -55\nKPX space Aring -55\nKPX space Atilde -55\nKPX space T -30\nKPX space Tcaron -30\nKPX space Tcommaaccent -30\nKPX space V -45\nKPX space W -30\nKPX space Y -55\nKPX space Yacute -55\nKPX space Ydieresis -55\nKPX v a -10\nKPX v aacute -10\nKPX v abreve -10\nKPX v acircumflex -10\nKPX v adieresis -10\nKPX v agrave -10\nKPX v amacron -10\nKPX v aogonek -10\nKPX v aring -10\nKPX v atilde -10\nKPX v comma -55\nKPX v e -10\nKPX v eacute -10\nKPX v ecaron -10\nKPX v ecircumflex -10\nKPX v edieresis -10\nKPX v edotaccent -10\nKPX v egrave -10\nKPX v emacron -10\nKPX v eogonek -10\nKPX v o -10\nKPX v oacute -10\nKPX v ocircumflex -10\nKPX v odieresis -10\nKPX v ograve -10\nKPX v ohungarumlaut -10\nKPX v omacron -10\nKPX v oslash -10\nKPX v otilde -10\nKPX v period -70\nKPX w comma -55\nKPX w o -10\nKPX w oacute -10\nKPX w ocircumflex -10\nKPX w odieresis -10\nKPX w ograve -10\nKPX w ohungarumlaut -10\nKPX w omacron -10\nKPX w oslash -10\nKPX w otilde -10\nKPX w period -70\nKPX y comma -55\nKPX y e -10\nKPX y eacute -10\nKPX y ecaron -10\nKPX y ecircumflex -10\nKPX y edieresis -10\nKPX y edotaccent -10\nKPX y egrave -10\nKPX y emacron -10\nKPX y eogonek -10\nKPX y o -25\nKPX y oacute -25\nKPX y ocircumflex -25\nKPX y odieresis -25\nKPX y ograve -25\nKPX y ohungarumlaut -25\nKPX y omacron -25\nKPX y oslash -25\nKPX y otilde -25\nKPX y period -70\nKPX yacute comma -55\nKPX yacute e -10\nKPX yacute eacute -10\nKPX yacute ecaron -10\nKPX yacute ecircumflex -10\nKPX yacute edieresis -10\nKPX yacute edotaccent -10\nKPX yacute egrave -10\nKPX yacute emacron -10\nKPX yacute eogonek -10\nKPX yacute o -25\nKPX yacute oacute -25\nKPX yacute ocircumflex -25\nKPX yacute odieresis -25\nKPX yacute ograve -25\nKPX yacute ohungarumlaut -25\nKPX yacute omacron -25\nKPX yacute oslash -25\nKPX yacute otilde -25\nKPX yacute period -70\nKPX ydieresis comma -55\nKPX ydieresis e -10\nKPX ydieresis eacute -10\nKPX ydieresis ecaron -10\nKPX ydieresis ecircumflex -10\nKPX ydieresis edieresis -10\nKPX ydieresis edotaccent -10\nKPX ydieresis egrave -10\nKPX ydieresis emacron -10\nKPX ydieresis eogonek -10\nKPX ydieresis o -25\nKPX ydieresis oacute -25\nKPX ydieresis ocircumflex -25\nKPX ydieresis odieresis -25\nKPX ydieresis ograve -25\nKPX ydieresis ohungarumlaut -25\nKPX ydieresis omacron -25\nKPX ydieresis oslash -25\nKPX ydieresis otilde -25\nKPX ydieresis period -70\nEndKernPairs\nEndKernData\nEndFontMetrics\n";
    }
  };

  PDFFont.prototype.use = function(characters) {
    var _ref;
    return (_ref = this.subset) != null ? _ref.use(characters) : void 0;
  };

  PDFFont.prototype.embed = function() {
    if (this.embedded || (this.dictionary == null)) {
      return;
    }
    if (this.isAFM) {
      this.embedAFM();
    } else {
      this.embedTTF();
    }
    return this.embedded = true;
  };

  PDFFont.prototype.encode = function(text) {
    var _ref;
    if (this.isAFM) {
      return this.font.encodeText(text);
    } else {
      return ((_ref = this.subset) != null ? _ref.encodeText(text) : void 0) || text;
    }
  };

  PDFFont.prototype.ref = function() {
    return this.dictionary != null ? this.dictionary : this.dictionary = this.document.ref();
  };

  PDFFont.prototype.registerTTF = function() {
    var e, hi, low, raw, _ref;
    this.name = this.font.name.postscriptName;
    this.scaleFactor = 1000.0 / this.font.head.unitsPerEm;
    this.bbox = (function() {
      var _i, _len, _ref, _results;
      _ref = this.font.bbox;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        _results.push(Math.round(e * this.scaleFactor));
      }
      return _results;
    }).call(this);
    this.stemV = 0;
    if (this.font.post.exists) {
      raw = this.font.post.italic_angle;
      hi = raw >> 16;
      low = raw & 0xFF;
      if (hi & 0x8000 !== 0) {
        hi = -((hi ^ 0xFFFF) + 1);
      }
      this.italicAngle = +("" + hi + "." + low);
    } else {
      this.italicAngle = 0;
    }
    this.ascender = Math.round(this.font.ascender * this.scaleFactor);
    this.decender = Math.round(this.font.decender * this.scaleFactor);
    this.lineGap = Math.round(this.font.lineGap * this.scaleFactor);
    this.capHeight = (this.font.os2.exists && this.font.os2.capHeight) || this.ascender;
    this.xHeight = (this.font.os2.exists && this.font.os2.xHeight) || 0;
    this.familyClass = (this.font.os2.exists && this.font.os2.familyClass || 0) >> 8;
    this.isSerif = (_ref = this.familyClass) === 1 || _ref === 2 || _ref === 3 || _ref === 4 || _ref === 5 || _ref === 7;
    this.isScript = this.familyClass === 10;
    this.flags = 0;
    if (this.font.post.isFixedPitch) {
      this.flags |= 1 << 0;
    }
    if (this.isSerif) {
      this.flags |= 1 << 1;
    }
    if (this.isScript) {
      this.flags |= 1 << 3;
    }
    if (this.italicAngle !== 0) {
      this.flags |= 1 << 6;
    }
    this.flags |= 1 << 5;
    if (!this.font.cmap.unicode) {
      throw new Error('No unicode cmap for font');
    }
  };

  PDFFont.prototype.embedTTF = function() {
    var charWidths, cmap, code, data, descriptor, firstChar, fontfile, glyph;
    data = this.subset.encode();
    fontfile = this.document.ref();
    fontfile.write(data);
    fontfile.data.Length1 = fontfile.uncompressedLength;
    fontfile.end();
    descriptor = this.document.ref({
      Type: 'FontDescriptor',
      FontName: this.subset.postscriptName,
      FontFile2: fontfile,
      FontBBox: this.bbox,
      Flags: this.flags,
      StemV: this.stemV,
      ItalicAngle: this.italicAngle,
      Ascent: this.ascender,
      Descent: this.decender,
      CapHeight: this.capHeight,
      XHeight: this.xHeight
    });
    descriptor.end();
    firstChar = +Object.keys(this.subset.cmap)[0];
    charWidths = (function() {
      var _ref, _results;
      _ref = this.subset.cmap;
      _results = [];
      for (code in _ref) {
        glyph = _ref[code];
        _results.push(Math.round(this.font.widthOfGlyph(glyph)));
      }
      return _results;
    }).call(this);
    cmap = this.document.ref();
    cmap.end(toUnicodeCmap(this.subset.subset));
    this.dictionary.data = {
      Type: 'Font',
      BaseFont: this.subset.postscriptName,
      Subtype: 'TrueType',
      FontDescriptor: descriptor,
      FirstChar: firstChar,
      LastChar: firstChar + charWidths.length - 1,
      Widths: charWidths,
      Encoding: 'MacRomanEncoding',
      ToUnicode: cmap
    };
    return this.dictionary.end();
  };

  toUnicodeCmap = function(map) {
    var code, codes, range, unicode, unicodeMap, _i, _len;
    unicodeMap = '/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<00><ff>\nendcodespacerange';
    codes = Object.keys(map).sort(function(a, b) {
      return a - b;
    });
    range = [];
    for (_i = 0, _len = codes.length; _i < _len; _i++) {
      code = codes[_i];
      if (range.length >= 100) {
        unicodeMap += "\n" + range.length + " beginbfchar\n" + (range.join('\n')) + "\nendbfchar";
        range = [];
      }
      unicode = ('0000' + map[code].toString(16)).slice(-4);
      code = (+code).toString(16);
      range.push("<" + code + "><" + unicode + ">");
    }
    if (range.length) {
      unicodeMap += "\n" + range.length + " beginbfchar\n" + (range.join('\n')) + "\nendbfchar\n";
    }
    return unicodeMap += 'endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend';
  };

  PDFFont.prototype.registerAFM = function(name) {
    var _ref;
    this.name = name;
    return _ref = this.font, this.ascender = _ref.ascender, this.decender = _ref.decender, this.bbox = _ref.bbox, this.lineGap = _ref.lineGap, _ref;
  };

  PDFFont.prototype.embedAFM = function() {
    this.dictionary.data = {
      Type: 'Font',
      BaseFont: this.name,
      Subtype: 'Type1',
      Encoding: 'WinAnsiEncoding'
    };
    return this.dictionary.end();
  };

  PDFFont.prototype.widthOfString = function(string, size) {
    var charCode, i, scale, width, _i, _ref;
    string = '' + string;
    width = 0;
    for (i = _i = 0, _ref = string.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      charCode = string.charCodeAt(i);
      width += this.font.widthOfGlyph(this.font.characterToGlyph(charCode)) || 0;
    }
    scale = size / 1000;
    return width * scale;
  };

  PDFFont.prototype.lineHeight = function(size, includeGap) {
    var gap;
    if (includeGap == null) {
      includeGap = false;
    }
    gap = includeGap ? this.lineGap : 0;
    return (this.ascender + gap - this.decender) / 1000 * size;
  };

  return PDFFont;

})();

module.exports = PDFFont;


}).call(this,_dereq_("buffer").Buffer)
},{"./font/afm":4,"./font/subset":7,"./font/ttf":19,"buffer":51,"fs":36}],4:[function(_dereq_,module,exports){
var AFMFont, fs;

fs = _dereq_('fs');

AFMFont = (function() {
  var WIN_ANSI_MAP, characters;

  AFMFont.open = function(filename) {
    return new AFMFont(fs.readFileSync(filename, 'utf8'));
  };

  function AFMFont(contents) {
    var e, i;
    this.contents = contents;
    this.attributes = {};
    this.glyphWidths = {};
    this.boundingBoxes = {};
    this.parse();
    this.charWidths = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 255; i = ++_i) {
        _results.push(this.glyphWidths[characters[i]]);
      }
      return _results;
    }).call(this);
    this.bbox = (function() {
      var _i, _len, _ref, _results;
      _ref = this.attributes['FontBBox'].split(/\s+/);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        _results.push(+e);
      }
      return _results;
    }).call(this);
    this.ascender = +(this.attributes['Ascender'] || 0);
    this.decender = +(this.attributes['Descender'] || 0);
    this.lineGap = (this.bbox[3] - this.bbox[1]) - (this.ascender - this.decender);
  }

  AFMFont.prototype.parse = function() {
    var a, key, line, match, name, section, value, _i, _len, _ref;
    section = '';
    _ref = this.contents.split('\n');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      if (match = line.match(/^Start(\w+)/)) {
        section = match[1];
        continue;
      } else if (match = line.match(/^End(\w+)/)) {
        section = '';
        continue;
      }
      switch (section) {
        case 'FontMetrics':
          match = line.match(/(^\w+)\s+(.*)/);
          key = match[1];
          value = match[2];
          if (a = this.attributes[key]) {
            if (!Array.isArray(a)) {
              a = this.attributes[key] = [a];
            }
            a.push(value);
          } else {
            this.attributes[key] = value;
          }
          break;
        case 'CharMetrics':
          if (!/^CH?\s/.test(line)) {
            continue;
          }
          name = line.match(/\bN\s+(\.?\w+)\s*;/)[1];
          this.glyphWidths[name] = +line.match(/\bWX\s+(\d+)\s*;/)[1];
      }
    }
  };

  WIN_ANSI_MAP = {
    402: 131,
    8211: 150,
    8212: 151,
    8216: 145,
    8217: 146,
    8218: 130,
    8220: 147,
    8221: 148,
    8222: 132,
    8224: 134,
    8225: 135,
    8226: 149,
    8230: 133,
    8364: 128,
    8240: 137,
    8249: 139,
    8250: 155,
    710: 136,
    8482: 153,
    338: 140,
    339: 156,
    732: 152,
    352: 138,
    353: 154,
    376: 159,
    381: 142,
    382: 158
  };

  AFMFont.prototype.encodeText = function(text) {
    var char, i, string, _i, _ref;
    string = '';
    for (i = _i = 0, _ref = text.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      char = text.charCodeAt(i);
      char = WIN_ANSI_MAP[char] || char;
      string += String.fromCharCode(char);
    }
    return string;
  };

  AFMFont.prototype.characterToGlyph = function(character) {
    return characters[WIN_ANSI_MAP[character] || character];
  };

  AFMFont.prototype.widthOfGlyph = function(glyph) {
    return this.glyphWidths[glyph];
  };

  characters = '.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n\nspace         exclam         quotedbl       numbersign\ndollar        percent        ampersand      quotesingle\nparenleft     parenright     asterisk       plus\ncomma         hyphen         period         slash\nzero          one            two            three\nfour          five           six            seven\neight         nine           colon          semicolon\nless          equal          greater        question\n\nat            A              B              C\nD             E              F              G\nH             I              J              K\nL             M              N              O\nP             Q              R              S\nT             U              V              W\nX             Y              Z              bracketleft\nbackslash     bracketright   asciicircum    underscore\n\ngrave         a              b              c\nd             e              f              g\nh             i              j              k\nl             m              n              o\np             q              r              s\nt             u              v              w\nx             y              z              braceleft\nbar           braceright     asciitilde     .notdef\n\nEuro          .notdef        quotesinglbase florin\nquotedblbase  ellipsis       dagger         daggerdbl\ncircumflex    perthousand    Scaron         guilsinglleft\nOE            .notdef        Zcaron         .notdef\n.notdef       quoteleft      quoteright     quotedblleft\nquotedblright bullet         endash         emdash\ntilde         trademark      scaron         guilsinglright\noe            .notdef        zcaron         ydieresis\n\nspace         exclamdown     cent           sterling\ncurrency      yen            brokenbar      section\ndieresis      copyright      ordfeminine    guillemotleft\nlogicalnot    hyphen         registered     macron\ndegree        plusminus      twosuperior    threesuperior\nacute         mu             paragraph      periodcentered\ncedilla       onesuperior    ordmasculine   guillemotright\nonequarter    onehalf        threequarters  questiondown\n\nAgrave        Aacute         Acircumflex    Atilde\nAdieresis     Aring          AE             Ccedilla\nEgrave        Eacute         Ecircumflex    Edieresis\nIgrave        Iacute         Icircumflex    Idieresis\nEth           Ntilde         Ograve         Oacute\nOcircumflex   Otilde         Odieresis      multiply\nOslash        Ugrave         Uacute         Ucircumflex\nUdieresis     Yacute         Thorn          germandbls\n\nagrave        aacute         acircumflex    atilde\nadieresis     aring          ae             ccedilla\negrave        eacute         ecircumflex    edieresis\nigrave        iacute         icircumflex    idieresis\neth           ntilde         ograve         oacute\nocircumflex   otilde         odieresis      divide\noslash        ugrave         uacute         ucircumflex\nudieresis     yacute         thorn          ydieresis'.split(/\s+/);

  return AFMFont;

})();

module.exports = AFMFont;


},{"fs":36}],5:[function(_dereq_,module,exports){
var DFont, Data, Directory, NameTable, fs;

fs = _dereq_('fs');

Data = _dereq_('../data');

Directory = _dereq_('./directory');

NameTable = _dereq_('./tables/name');

DFont = (function() {
  DFont.open = function(filename) {
    var contents;
    contents = fs.readFileSync(filename);
    return new DFont(contents);
  };

  function DFont(contents) {
    this.contents = new Data(contents);
    this.parse(this.contents);
  }

  DFont.prototype.parse = function(data) {
    var attr, b2, b3, b4, dataLength, dataOffset, dataOfs, entry, font, handle, i, id, j, len, length, mapLength, mapOffset, maxIndex, maxTypeIndex, name, nameListOffset, nameOfs, p, pos, refListOffset, type, typeListOffset, _i, _j;
    dataOffset = data.readInt();
    mapOffset = data.readInt();
    dataLength = data.readInt();
    mapLength = data.readInt();
    this.map = {};
    data.pos = mapOffset + 24;
    typeListOffset = data.readShort() + mapOffset;
    nameListOffset = data.readShort() + mapOffset;
    data.pos = typeListOffset;
    maxIndex = data.readShort();
    for (i = _i = 0; _i <= maxIndex; i = _i += 1) {
      type = data.readString(4);
      maxTypeIndex = data.readShort();
      refListOffset = data.readShort();
      this.map[type] = {
        list: [],
        named: {}
      };
      pos = data.pos;
      data.pos = typeListOffset + refListOffset;
      for (j = _j = 0; _j <= maxTypeIndex; j = _j += 1) {
        id = data.readShort();
        nameOfs = data.readShort();
        attr = data.readByte();
        b2 = data.readByte() << 16;
        b3 = data.readByte() << 8;
        b4 = data.readByte();
        dataOfs = dataOffset + (0 | b2 | b3 | b4);
        handle = data.readUInt32();
        entry = {
          id: id,
          attributes: attr,
          offset: dataOfs,
          handle: handle
        };
        p = data.pos;
        if (nameOfs !== -1 && (nameListOffset + nameOfs < mapOffset + mapLength)) {
          data.pos = nameListOffset + nameOfs;
          len = data.readByte();
          entry.name = data.readString(len);
        } else if (type === 'sfnt') {
          data.pos = entry.offset;
          length = data.readUInt32();
          font = {};
          font.contents = new Data(data.slice(data.pos, data.pos + length));
          font.directory = new Directory(font.contents);
          name = new NameTable(font);
          entry.name = name.fontName[0].raw;
        }
        data.pos = p;
        this.map[type].list.push(entry);
        if (entry.name) {
          this.map[type].named[entry.name] = entry;
        }
      }
      data.pos = pos;
    }
  };

  DFont.prototype.getNamedFont = function(name) {
    var data, entry, length, pos, ret, _ref;
    data = this.contents;
    pos = data.pos;
    entry = (_ref = this.map.sfnt) != null ? _ref.named[name] : void 0;
    if (!entry) {
      throw new Error("Font " + name + " not found in DFont file.");
    }
    data.pos = entry.offset;
    length = data.readUInt32();
    ret = data.slice(data.pos, data.pos + length);
    data.pos = pos;
    return ret;
  };

  return DFont;

})();

module.exports = DFont;


},{"../data":1,"./directory":6,"./tables/name":16,"fs":36}],6:[function(_dereq_,module,exports){
(function (Buffer){
var Data, Directory,
  __slice = [].slice;

Data = _dereq_('../data');

Directory = (function() {
  var checksum;

  function Directory(data) {
    var entry, i, _i, _ref;
    this.scalarType = data.readInt();
    this.tableCount = data.readShort();
    this.searchRange = data.readShort();
    this.entrySelector = data.readShort();
    this.rangeShift = data.readShort();
    this.tables = {};
    for (i = _i = 0, _ref = this.tableCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      entry = {
        tag: data.readString(4),
        checksum: data.readInt(),
        offset: data.readInt(),
        length: data.readInt()
      };
      this.tables[entry.tag] = entry;
    }
  }

  Directory.prototype.encode = function(tables) {
    var adjustment, directory, directoryLength, entrySelector, headOffset, log2, offset, rangeShift, searchRange, sum, table, tableCount, tableData, tag;
    tableCount = Object.keys(tables).length;
    log2 = Math.log(2);
    searchRange = Math.floor(Math.log(tableCount) / log2) * 16;
    entrySelector = Math.floor(searchRange / log2);
    rangeShift = tableCount * 16 - searchRange;
    directory = new Data;
    directory.writeInt(this.scalarType);
    directory.writeShort(tableCount);
    directory.writeShort(searchRange);
    directory.writeShort(entrySelector);
    directory.writeShort(rangeShift);
    directoryLength = tableCount * 16;
    offset = directory.pos + directoryLength;
    headOffset = null;
    tableData = [];
    for (tag in tables) {
      table = tables[tag];
      directory.writeString(tag);
      directory.writeInt(checksum(table));
      directory.writeInt(offset);
      directory.writeInt(table.length);
      tableData = tableData.concat(table);
      if (tag === 'head') {
        headOffset = offset;
      }
      offset += table.length;
      while (offset % 4) {
        tableData.push(0);
        offset++;
      }
    }
    directory.write(tableData);
    sum = checksum(directory.data);
    adjustment = 0xB1B0AFBA - sum;
    directory.pos = headOffset + 8;
    directory.writeUInt32(adjustment);
    return new Buffer(directory.data);
  };

  checksum = function(data) {
    var i, sum, tmp, _i, _ref;
    data = __slice.call(data);
    while (data.length % 4) {
      data.push(0);
    }
    tmp = new Data(data);
    sum = 0;
    for (i = _i = 0, _ref = data.length; _i < _ref; i = _i += 4) {
      sum += tmp.readUInt32();
    }
    return sum & 0xFFFFFFFF;
  };

  return Directory;

})();

module.exports = Directory;


}).call(this,_dereq_("buffer").Buffer)
},{"../data":1,"buffer":51}],7:[function(_dereq_,module,exports){
var CmapTable, Subset, utils,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

CmapTable = _dereq_('./tables/cmap');

utils = _dereq_('./utils');

Subset = (function() {
  function Subset(font) {
    this.font = font;
    this.subset = {};
    this.unicodes = {};
    this.next = 33;
  }

  Subset.prototype.use = function(character) {
    var i, _i, _ref;
    if (typeof character === 'string') {
      for (i = _i = 0, _ref = character.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.use(character.charCodeAt(i));
      }
      return;
    }
    if (!this.unicodes[character]) {
      this.subset[this.next] = character;
      return this.unicodes[character] = this.next++;
    }
  };

  Subset.prototype.encodeText = function(text) {
    var char, i, string, _i, _ref;
    string = '';
    for (i = _i = 0, _ref = text.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      char = this.unicodes[text.charCodeAt(i)];
      string += String.fromCharCode(char);
    }
    return string;
  };

  Subset.prototype.generateCmap = function() {
    var mapping, roman, unicode, unicodeCmap, _ref;
    unicodeCmap = this.font.cmap.tables[0].codeMap;
    mapping = {};
    _ref = this.subset;
    for (roman in _ref) {
      unicode = _ref[roman];
      mapping[roman] = unicodeCmap[unicode];
    }
    return mapping;
  };

  Subset.prototype.glyphIDs = function() {
    var ret, roman, unicode, unicodeCmap, val, _ref;
    unicodeCmap = this.font.cmap.tables[0].codeMap;
    ret = [0];
    _ref = this.subset;
    for (roman in _ref) {
      unicode = _ref[roman];
      val = unicodeCmap[unicode];
      if ((val != null) && __indexOf.call(ret, val) < 0) {
        ret.push(val);
      }
    }
    return ret.sort();
  };

  Subset.prototype.glyphsFor = function(glyphIDs) {
    var additionalIDs, glyph, glyphs, id, _i, _len, _ref;
    glyphs = {};
    for (_i = 0, _len = glyphIDs.length; _i < _len; _i++) {
      id = glyphIDs[_i];
      glyphs[id] = this.font.glyf.glyphFor(id);
    }
    additionalIDs = [];
    for (id in glyphs) {
      glyph = glyphs[id];
      if (glyph != null ? glyph.compound : void 0) {
        additionalIDs.push.apply(additionalIDs, glyph.glyphIDs);
      }
    }
    if (additionalIDs.length > 0) {
      _ref = this.glyphsFor(additionalIDs);
      for (id in _ref) {
        glyph = _ref[id];
        glyphs[id] = glyph;
      }
    }
    return glyphs;
  };

  Subset.prototype.encode = function() {
    var cmap, code, glyf, glyphs, id, ids, loca, name, new2old, newIDs, nextGlyphID, old2new, oldID, oldIDs, tables, _ref, _ref1;
    cmap = CmapTable.encode(this.generateCmap(), 'unicode');
    glyphs = this.glyphsFor(this.glyphIDs());
    old2new = {
      0: 0
    };
    _ref = cmap.charMap;
    for (code in _ref) {
      ids = _ref[code];
      old2new[ids.old] = ids["new"];
    }
    nextGlyphID = cmap.maxGlyphID;
    for (oldID in glyphs) {
      if (!(oldID in old2new)) {
        old2new[oldID] = nextGlyphID++;
      }
    }
    new2old = utils.invert(old2new);
    newIDs = Object.keys(new2old).sort(function(a, b) {
      return a - b;
    });
    oldIDs = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = newIDs.length; _i < _len; _i++) {
        id = newIDs[_i];
        _results.push(new2old[id]);
      }
      return _results;
    })();
    glyf = this.font.glyf.encode(glyphs, oldIDs, old2new);
    loca = this.font.loca.encode(glyf.offsets);
    name = this.font.name.encode();
    this.postscriptName = name.postscriptName;
    this.cmap = {};
    _ref1 = cmap.charMap;
    for (code in _ref1) {
      ids = _ref1[code];
      this.cmap[code] = ids.old;
    }
    tables = {
      cmap: cmap.table,
      glyf: glyf.table,
      loca: loca.table,
      hmtx: this.font.hmtx.encode(oldIDs),
      hhea: this.font.hhea.encode(oldIDs),
      maxp: this.font.maxp.encode(oldIDs),
      post: this.font.post.encode(oldIDs),
      name: name.table,
      head: this.font.head.encode(loca)
    };
    if (this.font.os2.exists) {
      tables['OS/2'] = this.font.os2.raw();
    }
    return this.font.directory.encode(tables);
  };

  return Subset;

})();

module.exports = Subset;


},{"./tables/cmap":9,"./utils":20}],8:[function(_dereq_,module,exports){
var Table;

Table = (function() {
  function Table(file) {
    var info;
    this.file = file;
    info = this.file.directory.tables[this.tag];
    this.exists = !!info;
    if (info) {
      this.offset = info.offset, this.length = info.length;
      this.parse(this.file.contents);
    }
  }

  Table.prototype.parse = function() {};

  Table.prototype.encode = function() {};

  Table.prototype.raw = function() {
    if (!this.exists) {
      return null;
    }
    this.file.contents.pos = this.offset;
    return this.file.contents.read(this.length);
  };

  return Table;

})();

module.exports = Table;


},{}],9:[function(_dereq_,module,exports){
var CmapEntry, CmapTable, Data, Table,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Table = _dereq_('../table');

Data = _dereq_('../../data');

CmapTable = (function(_super) {
  __extends(CmapTable, _super);

  function CmapTable() {
    return CmapTable.__super__.constructor.apply(this, arguments);
  }

  CmapTable.prototype.tag = 'cmap';

  CmapTable.prototype.parse = function(data) {
    var entry, i, tableCount, _i;
    data.pos = this.offset;
    this.version = data.readUInt16();
    tableCount = data.readUInt16();
    this.tables = [];
    this.unicode = null;
    for (i = _i = 0; 0 <= tableCount ? _i < tableCount : _i > tableCount; i = 0 <= tableCount ? ++_i : --_i) {
      entry = new CmapEntry(data, this.offset);
      this.tables.push(entry);
      if (entry.isUnicode) {
        if (this.unicode == null) {
          this.unicode = entry;
        }
      }
    }
    return true;
  };

  CmapTable.encode = function(charmap, encoding) {
    var result, table;
    if (encoding == null) {
      encoding = 'macroman';
    }
    result = CmapEntry.encode(charmap, encoding);
    table = new Data;
    table.writeUInt16(0);
    table.writeUInt16(1);
    result.table = table.data.concat(result.subtable);
    return result;
  };

  return CmapTable;

})(Table);

CmapEntry = (function() {
  function CmapEntry(data, offset) {
    var code, count, endCode, glyphId, glyphIds, i, idDelta, idRangeOffset, index, saveOffset, segCount, segCountX2, start, startCode, tail, _i, _j, _k, _len;
    this.platformID = data.readUInt16();
    this.encodingID = data.readShort();
    this.offset = offset + data.readInt();
    saveOffset = data.pos;
    data.pos = this.offset;
    this.format = data.readUInt16();
    this.length = data.readUInt16();
    this.language = data.readUInt16();
    this.isUnicode = (this.platformID === 3 && this.encodingID === 1 && this.format === 4) || this.platformID === 0 && this.format === 4;
    this.codeMap = {};
    switch (this.format) {
      case 0:
        for (i = _i = 0; _i < 256; i = ++_i) {
          this.codeMap[i] = data.readByte();
        }
        break;
      case 4:
        segCountX2 = data.readUInt16();
        segCount = segCountX2 / 2;
        data.pos += 6;
        endCode = (function() {
          var _j, _results;
          _results = [];
          for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
            _results.push(data.readUInt16());
          }
          return _results;
        })();
        data.pos += 2;
        startCode = (function() {
          var _j, _results;
          _results = [];
          for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
            _results.push(data.readUInt16());
          }
          return _results;
        })();
        idDelta = (function() {
          var _j, _results;
          _results = [];
          for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
            _results.push(data.readUInt16());
          }
          return _results;
        })();
        idRangeOffset = (function() {
          var _j, _results;
          _results = [];
          for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
            _results.push(data.readUInt16());
          }
          return _results;
        })();
        count = (this.length - data.pos + this.offset) / 2;
        glyphIds = (function() {
          var _j, _results;
          _results = [];
          for (i = _j = 0; 0 <= count ? _j < count : _j > count; i = 0 <= count ? ++_j : --_j) {
            _results.push(data.readUInt16());
          }
          return _results;
        })();
        for (i = _j = 0, _len = endCode.length; _j < _len; i = ++_j) {
          tail = endCode[i];
          start = startCode[i];
          for (code = _k = start; start <= tail ? _k <= tail : _k >= tail; code = start <= tail ? ++_k : --_k) {
            if (idRangeOffset[i] === 0) {
              glyphId = code + idDelta[i];
            } else {
              index = idRangeOffset[i] / 2 + (code - start) - (segCount - i);
              glyphId = glyphIds[index] || 0;
              if (glyphId !== 0) {
                glyphId += idDelta[i];
              }
            }
            this.codeMap[code] = glyphId & 0xFFFF;
          }
        }
    }
    data.pos = saveOffset;
  }

  CmapEntry.encode = function(charmap, encoding) {
    var charMap, code, codeMap, codes, delta, deltas, diff, endCode, endCodes, entrySelector, glyphIDs, i, id, indexes, last, map, nextID, offset, old, rangeOffsets, rangeShift, result, searchRange, segCount, segCountX2, startCode, startCodes, startGlyph, subtable, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _m, _n, _name, _o, _p, _q;
    subtable = new Data;
    codes = Object.keys(charmap).sort(function(a, b) {
      return a - b;
    });
    switch (encoding) {
      case 'macroman':
        id = 0;
        indexes = (function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i < 256; i = ++_i) {
            _results.push(0);
          }
          return _results;
        })();
        map = {
          0: 0
        };
        codeMap = {};
        for (_i = 0, _len = codes.length; _i < _len; _i++) {
          code = codes[_i];
          if (map[_name = charmap[code]] == null) {
            map[_name] = ++id;
          }
          codeMap[code] = {
            old: charmap[code],
            "new": map[charmap[code]]
          };
          indexes[code] = map[charmap[code]];
        }
        subtable.writeUInt16(1);
        subtable.writeUInt16(0);
        subtable.writeUInt32(12);
        subtable.writeUInt16(0);
        subtable.writeUInt16(262);
        subtable.writeUInt16(0);
        subtable.write(indexes);
        return result = {
          charMap: codeMap,
          subtable: subtable.data,
          maxGlyphID: id + 1
        };
      case 'unicode':
        startCodes = [];
        endCodes = [];
        nextID = 0;
        map = {};
        charMap = {};
        last = diff = null;
        for (_j = 0, _len1 = codes.length; _j < _len1; _j++) {
          code = codes[_j];
          old = charmap[code];
          if (map[old] == null) {
            map[old] = ++nextID;
          }
          charMap[code] = {
            old: old,
            "new": map[old]
          };
          delta = map[old] - code;
          if ((last == null) || delta !== diff) {
            if (last) {
              endCodes.push(last);
            }
            startCodes.push(code);
            diff = delta;
          }
          last = code;
        }
        if (last) {
          endCodes.push(last);
        }
        endCodes.push(0xFFFF);
        startCodes.push(0xFFFF);
        segCount = startCodes.length;
        segCountX2 = segCount * 2;
        searchRange = 2 * Math.pow(Math.log(segCount) / Math.LN2, 2);
        entrySelector = Math.log(searchRange / 2) / Math.LN2;
        rangeShift = 2 * segCount - searchRange;
        deltas = [];
        rangeOffsets = [];
        glyphIDs = [];
        for (i = _k = 0, _len2 = startCodes.length; _k < _len2; i = ++_k) {
          startCode = startCodes[i];
          endCode = endCodes[i];
          if (startCode === 0xFFFF) {
            deltas.push(0);
            rangeOffsets.push(0);
            break;
          }
          startGlyph = charMap[startCode]["new"];
          if (startCode - startGlyph >= 0x8000) {
            deltas.push(0);
            rangeOffsets.push(2 * (glyphIDs.length + segCount - i));
            for (code = _l = startCode; startCode <= endCode ? _l <= endCode : _l >= endCode; code = startCode <= endCode ? ++_l : --_l) {
              glyphIDs.push(charMap[code]["new"]);
            }
          } else {
            deltas.push(startGlyph - startCode);
            rangeOffsets.push(0);
          }
        }
        subtable.writeUInt16(3);
        subtable.writeUInt16(1);
        subtable.writeUInt32(12);
        subtable.writeUInt16(4);
        subtable.writeUInt16(16 + segCount * 8 + glyphIDs.length * 2);
        subtable.writeUInt16(0);
        subtable.writeUInt16(segCountX2);
        subtable.writeUInt16(searchRange);
        subtable.writeUInt16(entrySelector);
        subtable.writeUInt16(rangeShift);
        for (_m = 0, _len3 = endCodes.length; _m < _len3; _m++) {
          code = endCodes[_m];
          subtable.writeUInt16(code);
        }
        subtable.writeUInt16(0);
        for (_n = 0, _len4 = startCodes.length; _n < _len4; _n++) {
          code = startCodes[_n];
          subtable.writeUInt16(code);
        }
        for (_o = 0, _len5 = deltas.length; _o < _len5; _o++) {
          delta = deltas[_o];
          subtable.writeUInt16(delta);
        }
        for (_p = 0, _len6 = rangeOffsets.length; _p < _len6; _p++) {
          offset = rangeOffsets[_p];
          subtable.writeUInt16(offset);
        }
        for (_q = 0, _len7 = glyphIDs.length; _q < _len7; _q++) {
          id = glyphIDs[_q];
          subtable.writeUInt16(id);
        }
        return result = {
          charMap: charMap,
          subtable: subtable.data,
          maxGlyphID: nextID + 1
        };
    }
  };

  return CmapEntry;

})();

module.exports = CmapTable;


},{"../../data":1,"../table":8}],10:[function(_dereq_,module,exports){
var CompoundGlyph, Data, GlyfTable, SimpleGlyph, Table,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

Table = _dereq_('../table');

Data = _dereq_('../../data');

GlyfTable = (function(_super) {
  __extends(GlyfTable, _super);

  function GlyfTable() {
    return GlyfTable.__super__.constructor.apply(this, arguments);
  }

  GlyfTable.prototype.tag = 'glyf';

  GlyfTable.prototype.parse = function(data) {
    return this.cache = {};
  };

  GlyfTable.prototype.glyphFor = function(id) {
    var data, index, length, loca, numberOfContours, raw, xMax, xMin, yMax, yMin;
    if (id in this.cache) {
      return this.cache[id];
    }
    loca = this.file.loca;
    data = this.file.contents;
    index = loca.indexOf(id);
    length = loca.lengthOf(id);
    if (length === 0) {
      return this.cache[id] = null;
    }
    data.pos = this.offset + index;
    raw = new Data(data.read(length));
    numberOfContours = raw.readShort();
    xMin = raw.readShort();
    yMin = raw.readShort();
    xMax = raw.readShort();
    yMax = raw.readShort();
    if (numberOfContours === -1) {
      this.cache[id] = new CompoundGlyph(raw, xMin, yMin, xMax, yMax);
    } else {
      this.cache[id] = new SimpleGlyph(raw, numberOfContours, xMin, yMin, xMax, yMax);
    }
    return this.cache[id];
  };

  GlyfTable.prototype.encode = function(glyphs, mapping, old2new) {
    var glyph, id, offsets, table, _i, _len;
    table = [];
    offsets = [];
    for (_i = 0, _len = mapping.length; _i < _len; _i++) {
      id = mapping[_i];
      glyph = glyphs[id];
      offsets.push(table.length);
      if (glyph) {
        table = table.concat(glyph.encode(old2new));
      }
    }
    offsets.push(table.length);
    return {
      table: table,
      offsets: offsets
    };
  };

  return GlyfTable;

})(Table);

SimpleGlyph = (function() {
  function SimpleGlyph(raw, numberOfContours, xMin, yMin, xMax, yMax) {
    this.raw = raw;
    this.numberOfContours = numberOfContours;
    this.xMin = xMin;
    this.yMin = yMin;
    this.xMax = xMax;
    this.yMax = yMax;
    this.compound = false;
  }

  SimpleGlyph.prototype.encode = function() {
    return this.raw.data;
  };

  return SimpleGlyph;

})();

CompoundGlyph = (function() {
  var ARG_1_AND_2_ARE_WORDS, MORE_COMPONENTS, WE_HAVE_AN_X_AND_Y_SCALE, WE_HAVE_A_SCALE, WE_HAVE_A_TWO_BY_TWO, WE_HAVE_INSTRUCTIONS;

  ARG_1_AND_2_ARE_WORDS = 0x0001;

  WE_HAVE_A_SCALE = 0x0008;

  MORE_COMPONENTS = 0x0020;

  WE_HAVE_AN_X_AND_Y_SCALE = 0x0040;

  WE_HAVE_A_TWO_BY_TWO = 0x0080;

  WE_HAVE_INSTRUCTIONS = 0x0100;

  function CompoundGlyph(raw, xMin, yMin, xMax, yMax) {
    var data, flags;
    this.raw = raw;
    this.xMin = xMin;
    this.yMin = yMin;
    this.xMax = xMax;
    this.yMax = yMax;
    this.compound = true;
    this.glyphIDs = [];
    this.glyphOffsets = [];
    data = this.raw;
    while (true) {
      flags = data.readShort();
      this.glyphOffsets.push(data.pos);
      this.glyphIDs.push(data.readShort());
      if (!(flags & MORE_COMPONENTS)) {
        break;
      }
      if (flags & ARG_1_AND_2_ARE_WORDS) {
        data.pos += 4;
      } else {
        data.pos += 2;
      }
      if (flags & WE_HAVE_A_TWO_BY_TWO) {
        data.pos += 8;
      } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
        data.pos += 4;
      } else if (flags & WE_HAVE_A_SCALE) {
        data.pos += 2;
      }
    }
  }

  CompoundGlyph.prototype.encode = function(mapping) {
    var i, id, result, _i, _len, _ref;
    result = new Data(__slice.call(this.raw.data));
    _ref = this.glyphIDs;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      id = _ref[i];
      result.pos = this.glyphOffsets[i];
      result.writeShort(mapping[id]);
    }
    return result.data;
  };

  return CompoundGlyph;

})();

module.exports = GlyfTable;


},{"../../data":1,"../table":8}],11:[function(_dereq_,module,exports){
var Data, HeadTable, Table,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Table = _dereq_('../table');

Data = _dereq_('../../data');

HeadTable = (function(_super) {
  __extends(HeadTable, _super);

  function HeadTable() {
    return HeadTable.__super__.constructor.apply(this, arguments);
  }

  HeadTable.prototype.tag = 'head';

  HeadTable.prototype.parse = function(data) {
    data.pos = this.offset;
    this.version = data.readInt();
    this.revision = data.readInt();
    this.checkSumAdjustment = data.readInt();
    this.magicNumber = data.readInt();
    this.flags = data.readShort();
    this.unitsPerEm = data.readShort();
    this.created = data.readLongLong();
    this.modified = data.readLongLong();
    this.xMin = data.readShort();
    this.yMin = data.readShort();
    this.xMax = data.readShort();
    this.yMax = data.readShort();
    this.macStyle = data.readShort();
    this.lowestRecPPEM = data.readShort();
    this.fontDirectionHint = data.readShort();
    this.indexToLocFormat = data.readShort();
    return this.glyphDataFormat = data.readShort();
  };

  HeadTable.prototype.encode = function(loca) {
    var table;
    table = new Data;
    table.writeInt(this.version);
    table.writeInt(this.revision);
    table.writeInt(this.checkSumAdjustment);
    table.writeInt(this.magicNumber);
    table.writeShort(this.flags);
    table.writeShort(this.unitsPerEm);
    table.writeLongLong(this.created);
    table.writeLongLong(this.modified);
    table.writeShort(this.xMin);
    table.writeShort(this.yMin);
    table.writeShort(this.xMax);
    table.writeShort(this.yMax);
    table.writeShort(this.macStyle);
    table.writeShort(this.lowestRecPPEM);
    table.writeShort(this.fontDirectionHint);
    table.writeShort(loca.type);
    table.writeShort(this.glyphDataFormat);
    return table.data;
  };

  return HeadTable;

})(Table);

module.exports = HeadTable;


},{"../../data":1,"../table":8}],12:[function(_dereq_,module,exports){
var Data, HheaTable, Table,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Table = _dereq_('../table');

Data = _dereq_('../../data');

HheaTable = (function(_super) {
  __extends(HheaTable, _super);

  function HheaTable() {
    return HheaTable.__super__.constructor.apply(this, arguments);
  }

  HheaTable.prototype.tag = 'hhea';

  HheaTable.prototype.parse = function(data) {
    data.pos = this.offset;
    this.version = data.readInt();
    this.ascender = data.readShort();
    this.decender = data.readShort();
    this.lineGap = data.readShort();
    this.advanceWidthMax = data.readShort();
    this.minLeftSideBearing = data.readShort();
    this.minRightSideBearing = data.readShort();
    this.xMaxExtent = data.readShort();
    this.caretSlopeRise = data.readShort();
    this.caretSlopeRun = data.readShort();
    this.caretOffset = data.readShort();
    data.pos += 4 * 2;
    this.metricDataFormat = data.readShort();
    return this.numberOfMetrics = data.readUInt16();
  };

  HheaTable.prototype.encode = function(ids) {
    var i, table, _i, _ref;
    table = new Data;
    table.writeInt(this.version);
    table.writeShort(this.ascender);
    table.writeShort(this.decender);
    table.writeShort(this.lineGap);
    table.writeShort(this.advanceWidthMax);
    table.writeShort(this.minLeftSideBearing);
    table.writeShort(this.minRightSideBearing);
    table.writeShort(this.xMaxExtent);
    table.writeShort(this.caretSlopeRise);
    table.writeShort(this.caretSlopeRun);
    table.writeShort(this.caretOffset);
    for (i = _i = 0, _ref = 4 * 2; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      table.writeByte(0);
    }
    table.writeShort(this.metricDataFormat);
    table.writeUInt16(ids.length);
    return table.data;
  };

  return HheaTable;

})(Table);

module.exports = HheaTable;


},{"../../data":1,"../table":8}],13:[function(_dereq_,module,exports){
var Data, HmtxTable, Table,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Table = _dereq_('../table');

Data = _dereq_('../../data');

HmtxTable = (function(_super) {
  __extends(HmtxTable, _super);

  function HmtxTable() {
    return HmtxTable.__super__.constructor.apply(this, arguments);
  }

  HmtxTable.prototype.tag = 'hmtx';

  HmtxTable.prototype.parse = function(data) {
    var i, last, lsbCount, m, _i, _j, _ref, _results;
    data.pos = this.offset;
    this.metrics = [];
    for (i = _i = 0, _ref = this.file.hhea.numberOfMetrics; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.metrics.push({
        advance: data.readUInt16(),
        lsb: data.readInt16()
      });
    }
    lsbCount = this.file.maxp.numGlyphs - this.file.hhea.numberOfMetrics;
    this.leftSideBearings = (function() {
      var _j, _results;
      _results = [];
      for (i = _j = 0; 0 <= lsbCount ? _j < lsbCount : _j > lsbCount; i = 0 <= lsbCount ? ++_j : --_j) {
        _results.push(data.readInt16());
      }
      return _results;
    })();
    this.widths = (function() {
      var _j, _len, _ref1, _results;
      _ref1 = this.metrics;
      _results = [];
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        m = _ref1[_j];
        _results.push(m.advance);
      }
      return _results;
    }).call(this);
    last = this.widths[this.widths.length - 1];
    _results = [];
    for (i = _j = 0; 0 <= lsbCount ? _j < lsbCount : _j > lsbCount; i = 0 <= lsbCount ? ++_j : --_j) {
      _results.push(this.widths.push(last));
    }
    return _results;
  };

  HmtxTable.prototype.forGlyph = function(id) {
    var metrics;
    if (id in this.metrics) {
      return this.metrics[id];
    }
    return metrics = {
      advance: this.metrics[this.metrics.length - 1].advance,
      lsb: this.leftSideBearings[id - this.metrics.length]
    };
  };

  HmtxTable.prototype.encode = function(mapping) {
    var id, metric, table, _i, _len;
    table = new Data;
    for (_i = 0, _len = mapping.length; _i < _len; _i++) {
      id = mapping[_i];
      metric = this.forGlyph(id);
      table.writeUInt16(metric.advance);
      table.writeUInt16(metric.lsb);
    }
    return table.data;
  };

  return HmtxTable;

})(Table);

module.exports = HmtxTable;


},{"../../data":1,"../table":8}],14:[function(_dereq_,module,exports){
var Data, LocaTable, Table,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Table = _dereq_('../table');

Data = _dereq_('../../data');

LocaTable = (function(_super) {
  __extends(LocaTable, _super);

  function LocaTable() {
    return LocaTable.__super__.constructor.apply(this, arguments);
  }

  LocaTable.prototype.tag = 'loca';

  LocaTable.prototype.parse = function(data) {
    var format, i;
    data.pos = this.offset;
    format = this.file.head.indexToLocFormat;
    if (format === 0) {
      return this.offsets = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = this.length; _i < _ref; i = _i += 2) {
          _results.push(data.readUInt16() * 2);
        }
        return _results;
      }).call(this);
    } else {
      return this.offsets = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = this.length; _i < _ref; i = _i += 4) {
          _results.push(data.readUInt32());
        }
        return _results;
      }).call(this);
    }
  };

  LocaTable.prototype.indexOf = function(id) {
    return this.offsets[id];
  };

  LocaTable.prototype.lengthOf = function(id) {
    return this.offsets[id + 1] - this.offsets[id];
  };

  LocaTable.prototype.encode = function(offsets) {
    var o, offset, ret, table, _i, _j, _k, _len, _len1, _len2, _ref;
    table = new Data;
    for (_i = 0, _len = offsets.length; _i < _len; _i++) {
      offset = offsets[_i];
      if (!(offset > 0xFFFF)) {
        continue;
      }
      _ref = this.offsets;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        o = _ref[_j];
        table.writeUInt32(o);
      }
      return ret = {
        format: 1,
        table: table.data
      };
    }
    for (_k = 0, _len2 = offsets.length; _k < _len2; _k++) {
      o = offsets[_k];
      table.writeUInt16(o / 2);
    }
    return ret = {
      format: 0,
      table: table.data
    };
  };

  return LocaTable;

})(Table);

module.exports = LocaTable;


},{"../../data":1,"../table":8}],15:[function(_dereq_,module,exports){
var Data, MaxpTable, Table,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Table = _dereq_('../table');

Data = _dereq_('../../data');

MaxpTable = (function(_super) {
  __extends(MaxpTable, _super);

  function MaxpTable() {
    return MaxpTable.__super__.constructor.apply(this, arguments);
  }

  MaxpTable.prototype.tag = 'maxp';

  MaxpTable.prototype.parse = function(data) {
    data.pos = this.offset;
    this.version = data.readInt();
    this.numGlyphs = data.readUInt16();
    this.maxPoints = data.readUInt16();
    this.maxContours = data.readUInt16();
    this.maxCompositePoints = data.readUInt16();
    this.maxComponentContours = data.readUInt16();
    this.maxZones = data.readUInt16();
    this.maxTwilightPoints = data.readUInt16();
    this.maxStorage = data.readUInt16();
    this.maxFunctionDefs = data.readUInt16();
    this.maxInstructionDefs = data.readUInt16();
    this.maxStackElements = data.readUInt16();
    this.maxSizeOfInstructions = data.readUInt16();
    this.maxComponentElements = data.readUInt16();
    return this.maxComponentDepth = data.readUInt16();
  };

  MaxpTable.prototype.encode = function(ids) {
    var table;
    table = new Data;
    table.writeInt(this.version);
    table.writeUInt16(ids.length);
    table.writeUInt16(this.maxPoints);
    table.writeUInt16(this.maxContours);
    table.writeUInt16(this.maxCompositePoints);
    table.writeUInt16(this.maxComponentContours);
    table.writeUInt16(this.maxZones);
    table.writeUInt16(this.maxTwilightPoints);
    table.writeUInt16(this.maxStorage);
    table.writeUInt16(this.maxFunctionDefs);
    table.writeUInt16(this.maxInstructionDefs);
    table.writeUInt16(this.maxStackElements);
    table.writeUInt16(this.maxSizeOfInstructions);
    table.writeUInt16(this.maxComponentElements);
    table.writeUInt16(this.maxComponentDepth);
    return table.data;
  };

  return MaxpTable;

})(Table);

module.exports = MaxpTable;


},{"../../data":1,"../table":8}],16:[function(_dereq_,module,exports){
var Data, NameEntry, NameTable, Table, utils,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Table = _dereq_('../table');

Data = _dereq_('../../data');

utils = _dereq_('../utils');

NameTable = (function(_super) {
  var subsetTag;

  __extends(NameTable, _super);

  function NameTable() {
    return NameTable.__super__.constructor.apply(this, arguments);
  }

  NameTable.prototype.tag = 'name';

  NameTable.prototype.parse = function(data) {
    var count, entries, entry, format, i, name, stringOffset, strings, text, _i, _j, _len, _name;
    data.pos = this.offset;
    format = data.readShort();
    count = data.readShort();
    stringOffset = data.readShort();
    entries = [];
    for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
      entries.push({
        platformID: data.readShort(),
        encodingID: data.readShort(),
        languageID: data.readShort(),
        nameID: data.readShort(),
        length: data.readShort(),
        offset: this.offset + stringOffset + data.readShort()
      });
    }
    strings = {};
    for (i = _j = 0, _len = entries.length; _j < _len; i = ++_j) {
      entry = entries[i];
      data.pos = entry.offset;
      text = data.readString(entry.length);
      name = new NameEntry(text, entry);
      if (strings[_name = entry.nameID] == null) {
        strings[_name] = [];
      }
      strings[entry.nameID].push(name);
    }
    this.strings = strings;
    this.copyright = strings[0];
    this.fontFamily = strings[1];
    this.fontSubfamily = strings[2];
    this.uniqueSubfamily = strings[3];
    this.fontName = strings[4];
    this.version = strings[5];
    this.postscriptName = strings[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g, "");
    this.trademark = strings[7];
    this.manufacturer = strings[8];
    this.designer = strings[9];
    this.description = strings[10];
    this.vendorUrl = strings[11];
    this.designerUrl = strings[12];
    this.license = strings[13];
    this.licenseUrl = strings[14];
    this.preferredFamily = strings[15];
    this.preferredSubfamily = strings[17];
    this.compatibleFull = strings[18];
    return this.sampleText = strings[19];
  };

  subsetTag = "AAAAAA";

  NameTable.prototype.encode = function() {
    var id, list, nameID, nameTable, postscriptName, strCount, strTable, string, strings, table, val, _i, _len, _ref;
    strings = {};
    _ref = this.strings;
    for (id in _ref) {
      val = _ref[id];
      strings[id] = val;
    }
    postscriptName = new NameEntry("" + subsetTag + "+" + this.postscriptName, {
      platformID: 1,
      encodingID: 0,
      languageID: 0
    });
    strings[6] = [postscriptName];
    subsetTag = utils.successorOf(subsetTag);
    strCount = 0;
    for (id in strings) {
      list = strings[id];
      if (list != null) {
        strCount += list.length;
      }
    }
    table = new Data;
    strTable = new Data;
    table.writeShort(0);
    table.writeShort(strCount);
    table.writeShort(6 + 12 * strCount);
    for (nameID in strings) {
      list = strings[nameID];
      if (list != null) {
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          string = list[_i];
          table.writeShort(string.platformID);
          table.writeShort(string.encodingID);
          table.writeShort(string.languageID);
          table.writeShort(nameID);
          table.writeShort(string.length);
          table.writeShort(strTable.pos);
          strTable.writeString(string.raw);
        }
      }
    }
    return nameTable = {
      postscriptName: postscriptName.raw,
      table: table.data.concat(strTable.data)
    };
  };

  return NameTable;

})(Table);

module.exports = NameTable;

NameEntry = (function() {
  function NameEntry(raw, entry) {
    this.raw = raw;
    this.length = this.raw.length;
    this.platformID = entry.platformID;
    this.encodingID = entry.encodingID;
    this.languageID = entry.languageID;
  }

  return NameEntry;

})();


},{"../../data":1,"../table":8,"../utils":20}],17:[function(_dereq_,module,exports){
var OS2Table, Table,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Table = _dereq_('../table');

OS2Table = (function(_super) {
  __extends(OS2Table, _super);

  function OS2Table() {
    return OS2Table.__super__.constructor.apply(this, arguments);
  }

  OS2Table.prototype.tag = 'OS/2';

  OS2Table.prototype.parse = function(data) {
    var i;
    data.pos = this.offset;
    this.version = data.readUInt16();
    this.averageCharWidth = data.readShort();
    this.weightClass = data.readUInt16();
    this.widthClass = data.readUInt16();
    this.type = data.readShort();
    this.ySubscriptXSize = data.readShort();
    this.ySubscriptYSize = data.readShort();
    this.ySubscriptXOffset = data.readShort();
    this.ySubscriptYOffset = data.readShort();
    this.ySuperscriptXSize = data.readShort();
    this.ySuperscriptYSize = data.readShort();
    this.ySuperscriptXOffset = data.readShort();
    this.ySuperscriptYOffset = data.readShort();
    this.yStrikeoutSize = data.readShort();
    this.yStrikeoutPosition = data.readShort();
    this.familyClass = data.readShort();
    this.panose = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; _i < 10; i = ++_i) {
        _results.push(data.readByte());
      }
      return _results;
    })();
    this.charRange = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; _i < 4; i = ++_i) {
        _results.push(data.readInt());
      }
      return _results;
    })();
    this.vendorID = data.readString(4);
    this.selection = data.readShort();
    this.firstCharIndex = data.readShort();
    this.lastCharIndex = data.readShort();
    if (this.version > 0) {
      this.ascent = data.readShort();
      this.descent = data.readShort();
      this.lineGap = data.readShort();
      this.winAscent = data.readShort();
      this.winDescent = data.readShort();
      this.codePageRange = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 2; i = ++_i) {
          _results.push(data.readInt());
        }
        return _results;
      })();
      if (this.version > 1) {
        this.xHeight = data.readShort();
        this.capHeight = data.readShort();
        this.defaultChar = data.readShort();
        this.breakChar = data.readShort();
        return this.maxContext = data.readShort();
      }
    }
  };

  OS2Table.prototype.encode = function() {
    return this.raw();
  };

  return OS2Table;

})(Table);

module.exports = OS2Table;


},{"../table":8}],18:[function(_dereq_,module,exports){
var Data, PostTable, Table,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Table = _dereq_('../table');

Data = _dereq_('../../data');

PostTable = (function(_super) {
  var POSTSCRIPT_GLYPHS;

  __extends(PostTable, _super);

  function PostTable() {
    return PostTable.__super__.constructor.apply(this, arguments);
  }

  PostTable.prototype.tag = 'post';

  PostTable.prototype.parse = function(data) {
    var i, length, numberOfGlyphs, _i, _results;
    data.pos = this.offset;
    this.format = data.readInt();
    this.italicAngle = data.readInt();
    this.underlinePosition = data.readShort();
    this.underlineThickness = data.readShort();
    this.isFixedPitch = data.readInt();
    this.minMemType42 = data.readInt();
    this.maxMemType42 = data.readInt();
    this.minMemType1 = data.readInt();
    this.maxMemType1 = data.readInt();
    switch (this.format) {
      case 0x00010000:
        break;
      case 0x00020000:
        numberOfGlyphs = data.readUInt16();
        this.glyphNameIndex = [];
        for (i = _i = 0; 0 <= numberOfGlyphs ? _i < numberOfGlyphs : _i > numberOfGlyphs; i = 0 <= numberOfGlyphs ? ++_i : --_i) {
          this.glyphNameIndex.push(data.readUInt16());
        }
        this.names = [];
        _results = [];
        while (data.pos < this.offset + this.length) {
          length = data.readByte();
          _results.push(this.names.push(data.readString(length)));
        }
        return _results;
        break;
      case 0x00025000:
        numberOfGlyphs = data.readUInt16();
        return this.offsets = data.read(numberOfGlyphs);
      case 0x00030000:
        break;
      case 0x00040000:
        return this.map = (function() {
          var _j, _ref, _results1;
          _results1 = [];
          for (i = _j = 0, _ref = this.file.maxp.numGlyphs; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
            _results1.push(data.readUInt32());
          }
          return _results1;
        }).call(this);
    }
  };

  PostTable.prototype.glyphFor = function(code) {
    var index;
    switch (this.format) {
      case 0x00010000:
        return POSTSCRIPT_GLYPHS[code] || '.notdef';
      case 0x00020000:
        index = this.glyphNameIndex[code];
        if (index <= 257) {
          return POSTSCRIPT_GLYPHS[index];
        } else {
          return this.names[index - 258] || '.notdef';
        }
        break;
      case 0x00025000:
        return POSTSCRIPT_GLYPHS[code + this.offsets[code]] || '.notdef';
      case 0x00030000:
        return '.notdef';
      case 0x00040000:
        return this.map[code] || 0xFFFF;
    }
  };

  PostTable.prototype.encode = function(mapping) {
    var id, index, indexes, position, post, raw, string, strings, table, _i, _j, _k, _len, _len1, _len2;
    if (!this.exists) {
      return null;
    }
    raw = this.raw();
    if (this.format === 0x00030000) {
      return raw;
    }
    table = new Data(raw.slice(0, 32));
    table.writeUInt32(0x00020000);
    table.pos = 32;
    indexes = [];
    strings = [];
    for (_i = 0, _len = mapping.length; _i < _len; _i++) {
      id = mapping[_i];
      post = this.glyphFor(id);
      position = POSTSCRIPT_GLYPHS.indexOf(post);
      if (position !== -1) {
        indexes.push(position);
      } else {
        indexes.push(257 + strings.length);
        strings.push(post);
      }
    }
    table.writeUInt16(Object.keys(mapping).length);
    for (_j = 0, _len1 = indexes.length; _j < _len1; _j++) {
      index = indexes[_j];
      table.writeUInt16(index);
    }
    for (_k = 0, _len2 = strings.length; _k < _len2; _k++) {
      string = strings[_k];
      table.writeByte(string.length);
      table.writeString(string);
    }
    return table.data;
  };

  POSTSCRIPT_GLYPHS = '.notdef .null nonmarkingreturn space exclam quotedbl numbersign dollar percent\nampersand quotesingle parenleft parenright asterisk plus comma hyphen period slash\nzero one two three four five six seven eight nine colon semicolon less equal greater\nquestion at A B C D E F G H I J K L M N O P Q R S T U V W X Y Z\nbracketleft backslash bracketright asciicircum underscore grave\na b c d e f g h i j k l m n o p q r s t u v w x y z\nbraceleft bar braceright asciitilde Adieresis Aring Ccedilla Eacute Ntilde Odieresis\nUdieresis aacute agrave acircumflex adieresis atilde aring ccedilla eacute egrave\necircumflex edieresis iacute igrave icircumflex idieresis ntilde oacute ograve\nocircumflex odieresis otilde uacute ugrave ucircumflex udieresis dagger degree cent\nsterling section bullet paragraph germandbls registered copyright trademark acute\ndieresis notequal AE Oslash infinity plusminus lessequal greaterequal yen mu\npartialdiff summation product pi integral ordfeminine ordmasculine Omega ae oslash\nquestiondown exclamdown logicalnot radical florin approxequal Delta guillemotleft\nguillemotright ellipsis nonbreakingspace Agrave Atilde Otilde OE oe endash emdash\nquotedblleft quotedblright quoteleft quoteright divide lozenge ydieresis Ydieresis\nfraction currency guilsinglleft guilsinglright fi fl daggerdbl periodcentered\nquotesinglbase quotedblbase perthousand Acircumflex Ecircumflex Aacute Edieresis\nEgrave Iacute Icircumflex Idieresis Igrave Oacute Ocircumflex apple Ograve Uacute\nUcircumflex Ugrave dotlessi circumflex tilde macron breve dotaccent ring cedilla\nhungarumlaut ogonek caron Lslash lslash Scaron scaron Zcaron zcaron brokenbar Eth\neth Yacute yacute Thorn thorn minus multiply onesuperior twosuperior threesuperior\nonehalf onequarter threequarters franc Gbreve gbreve Idotaccent Scedilla scedilla\nCacute cacute Ccaron ccaron dcroat'.split(/\s+/g);

  return PostTable;

})(Table);

module.exports = PostTable;


},{"../../data":1,"../table":8}],19:[function(_dereq_,module,exports){
var CmapTable, DFont, Data, Directory, GlyfTable, HeadTable, HheaTable, HmtxTable, LocaTable, MaxpTable, NameTable, OS2Table, PostTable, TTFFont, fs;

fs = _dereq_('fs');

Data = _dereq_('../data');

DFont = _dereq_('./dfont');

Directory = _dereq_('./directory');

NameTable = _dereq_('./tables/name');

HeadTable = _dereq_('./tables/head');

CmapTable = _dereq_('./tables/cmap');

HmtxTable = _dereq_('./tables/hmtx');

HheaTable = _dereq_('./tables/hhea');

MaxpTable = _dereq_('./tables/maxp');

PostTable = _dereq_('./tables/post');

OS2Table = _dereq_('./tables/os2');

LocaTable = _dereq_('./tables/loca');

GlyfTable = _dereq_('./tables/glyf');

TTFFont = (function() {
  TTFFont.open = function(filename, name) {
    var contents;
    contents = fs.readFileSync(filename);
    return new TTFFont(contents, name);
  };

  TTFFont.fromDFont = function(filename, family) {
    var dfont;
    dfont = DFont.open(filename);
    return new TTFFont(dfont.getNamedFont(family));
  };

  TTFFont.fromBuffer = function(buffer, family) {
    var dfont, e, ttf;
    try {
      ttf = new TTFFont(buffer, family);
      if (!(ttf.head.exists && ttf.name.exists && ttf.cmap.exists)) {
        dfont = new DFont(buffer);
        ttf = new TTFFont(dfont.getNamedFont(family));
        if (!(ttf.head.exists && ttf.name.exists && ttf.cmap.exists)) {
          throw new Error('Invalid TTF file in DFont');
        }
      }
      return ttf;
    } catch (_error) {
      e = _error;
      throw new Error('Unknown font format in buffer: ' + e.message);
    }
  };

  function TTFFont(rawData, name) {
    var data, i, numFonts, offset, offsets, version, _i, _j, _len;
    this.rawData = rawData;
    data = this.contents = new Data(this.rawData);
    if (data.readString(4) === 'ttcf') {
      if (!name) {
        throw new Error("Must specify a font name for TTC files.");
      }
      version = data.readInt();
      numFonts = data.readInt();
      offsets = [];
      for (i = _i = 0; 0 <= numFonts ? _i < numFonts : _i > numFonts; i = 0 <= numFonts ? ++_i : --_i) {
        offsets[i] = data.readInt();
      }
      for (i = _j = 0, _len = offsets.length; _j < _len; i = ++_j) {
        offset = offsets[i];
        data.pos = offset;
        this.parse();
        if (this.name.postscriptName === name) {
          return;
        }
      }
      throw new Error("Font " + name + " not found in TTC file.");
    } else {
      data.pos = 0;
      this.parse();
    }
  }

  TTFFont.prototype.parse = function() {
    this.directory = new Directory(this.contents);
    this.head = new HeadTable(this);
    this.name = new NameTable(this);
    this.cmap = new CmapTable(this);
    this.hhea = new HheaTable(this);
    this.maxp = new MaxpTable(this);
    this.hmtx = new HmtxTable(this);
    this.post = new PostTable(this);
    this.os2 = new OS2Table(this);
    this.loca = new LocaTable(this);
    this.glyf = new GlyfTable(this);
    this.ascender = (this.os2.exists && this.os2.ascender) || this.hhea.ascender;
    this.decender = (this.os2.exists && this.os2.decender) || this.hhea.decender;
    this.lineGap = (this.os2.exists && this.os2.lineGap) || this.hhea.lineGap;
    return this.bbox = [this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax];
  };

  TTFFont.prototype.characterToGlyph = function(character) {
    var _ref;
    return ((_ref = this.cmap.unicode) != null ? _ref.codeMap[character] : void 0) || 0;
  };

  TTFFont.prototype.widthOfGlyph = function(glyph) {
    var scale;
    scale = 1000.0 / this.head.unitsPerEm;
    return this.hmtx.forGlyph(glyph).advance * scale;
  };

  return TTFFont;

})();

module.exports = TTFFont;


},{"../data":1,"./dfont":5,"./directory":6,"./tables/cmap":9,"./tables/glyf":10,"./tables/head":11,"./tables/hhea":12,"./tables/hmtx":13,"./tables/loca":14,"./tables/maxp":15,"./tables/name":16,"./tables/os2":17,"./tables/post":18,"fs":36}],20:[function(_dereq_,module,exports){

/*
 * An implementation of Ruby's string.succ method.
 * By Devon Govett
 *
 * Returns the successor to str. The successor is calculated by incrementing characters starting 
 * from the rightmost alphanumeric (or the rightmost character if there are no alphanumerics) in the
 * string. Incrementing a digit always results in another digit, and incrementing a letter results in
 * another letter of the same case.
 *
 * If the increment generates a carry, the character to the left of it is incremented. This 
 * process repeats until there is no carry, adding an additional character if necessary.
 *
 * succ("abcd")      == "abce"
 * succ("THX1138")   == "THX1139"
 * succ("<<koala>>") == "<<koalb>>"
 * succ("1999zzz")   == "2000aaa"
 * succ("ZZZ9999")   == "AAAA0000"
 */
exports.successorOf = function(input) {
  var added, alphabet, carry, i, index, isUpperCase, last, length, next, result;
  alphabet = 'abcdefghijklmnopqrstuvwxyz';
  length = alphabet.length;
  result = input;
  i = input.length;
  while (i >= 0) {
    last = input.charAt(--i);
    if (isNaN(last)) {
      index = alphabet.indexOf(last.toLowerCase());
      if (index === -1) {
        next = last;
        carry = true;
      } else {
        next = alphabet.charAt((index + 1) % length);
        isUpperCase = last === last.toUpperCase();
        if (isUpperCase) {
          next = next.toUpperCase();
        }
        carry = index + 1 >= length;
        if (carry && i === 0) {
          added = isUpperCase ? 'A' : 'a';
          result = added + next + result.slice(1);
          break;
        }
      }
    } else {
      next = +last + 1;
      carry = next > 9;
      if (carry) {
        next = 0;
      }
      if (carry && i === 0) {
        result = '1' + next + result.slice(1);
        break;
      }
    }
    result = result.slice(0, i) + next + result.slice(i + 1);
    if (!carry) {
      break;
    }
  }
  return result;
};

exports.invert = function(object) {
  var key, ret, val;
  ret = {};
  for (key in object) {
    val = object[key];
    ret[val] = key;
  }
  return ret;
};


},{}],21:[function(_dereq_,module,exports){
var PDFGradient, PDFLinearGradient, PDFRadialGradient,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PDFGradient = (function() {
  function PDFGradient(doc) {
    this.doc = doc;
    this.stops = [];
    this.embedded = false;
    this.transform = [1, 0, 0, 1, 0, 0];
    this._colorSpace = 'DeviceRGB';
  }

  PDFGradient.prototype.stop = function(pos, color, opacity) {
    if (opacity == null) {
      opacity = 1;
    }
    opacity = Math.max(0, Math.min(1, opacity));
    this.stops.push([pos, this.doc._normalizeColor(color), opacity]);
    return this;
  };

  PDFGradient.prototype.embed = function() {
    var bounds, dx, dy, encode, fn, form, grad, group, gstate, i, last, m, m0, m1, m11, m12, m2, m21, m22, m3, m4, m5, name, pattern, resources, sMask, shader, stop, stops, v, _i, _j, _len, _ref, _ref1, _ref2;
    if (this.embedded || this.stops.length === 0) {
      return;
    }
    this.embedded = true;
    last = this.stops[this.stops.length - 1];
    if (last[0] < 1) {
      this.stops.push([1, last[1], last[2]]);
    }
    bounds = [];
    encode = [];
    stops = [];
    for (i = _i = 0, _ref = this.stops.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      encode.push(0, 1);
      if (i + 2 !== this.stops.length) {
        bounds.push(this.stops[i + 1][0]);
      }
      fn = this.doc.ref({
        FunctionType: 2,
        Domain: [0, 1],
        C0: this.stops[i + 0][1],
        C1: this.stops[i + 1][1],
        N: 1
      });
      stops.push(fn);
      fn.end();
    }
    if (stops.length === 1) {
      fn = stops[0];
    } else {
      fn = this.doc.ref({
        FunctionType: 3,
        Domain: [0, 1],
        Functions: stops,
        Bounds: bounds,
        Encode: encode
      });
      fn.end();
    }
    this.id = 'Sh' + (++this.doc._gradCount);
    m = this.doc._ctm.slice();
    m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3], m4 = m[4], m5 = m[5];
    _ref1 = this.transform, m11 = _ref1[0], m12 = _ref1[1], m21 = _ref1[2], m22 = _ref1[3], dx = _ref1[4], dy = _ref1[5];
    m[0] = m0 * m11 + m2 * m12;
    m[1] = m1 * m11 + m3 * m12;
    m[2] = m0 * m21 + m2 * m22;
    m[3] = m1 * m21 + m3 * m22;
    m[4] = m0 * dx + m2 * dy + m4;
    m[5] = m1 * dx + m3 * dy + m5;
    shader = this.shader(fn);
    shader.end();
    pattern = this.doc.ref({
      Type: 'Pattern',
      PatternType: 2,
      Shading: shader,
      Matrix: (function() {
        var _j, _len, _results;
        _results = [];
        for (_j = 0, _len = m.length; _j < _len; _j++) {
          v = m[_j];
          _results.push(+v.toFixed(5));
        }
        return _results;
      })()
    });
    this.doc.page.patterns[this.id] = pattern;
    pattern.end();
    if (this.stops.some(function(stop) {
      return stop[2] < 1;
    })) {
      grad = this.opacityGradient();
      grad._colorSpace = 'DeviceGray';
      _ref2 = this.stops;
      for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
        stop = _ref2[_j];
        grad.stop(stop[0], [stop[2]]);
      }
      grad = grad.embed();
      group = this.doc.ref({
        Type: 'Group',
        S: 'Transparency',
        CS: 'DeviceGray'
      });
      group.end();
      resources = this.doc.ref({
        ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI'],
        Shading: {
          Sh1: grad.data.Shading
        }
      });
      resources.end();
      form = this.doc.ref({
        Type: 'XObject',
        Subtype: 'Form',
        FormType: 1,
        BBox: [0, 0, this.doc.page.width, this.doc.page.height],
        Group: group,
        Resources: resources
      });
      form.end("/Sh1 sh");
      sMask = this.doc.ref({
        Type: 'Mask',
        S: 'Luminosity',
        G: form
      });
      sMask.end();
      gstate = this.doc.ref({
        Type: 'ExtGState',
        SMask: sMask
      });
      this.opacity_id = ++this.doc._opacityCount;
      name = "Gs" + this.opacity_id;
      this.doc.page.ext_gstates[name] = gstate;
      gstate.end();
    }
    return pattern;
  };

  PDFGradient.prototype.apply = function(op) {
    if (!this.embedded) {
      this.embed();
    }
    this.doc.addContent("/" + this.id + " " + op);
    if (this.opacity_id) {
      this.doc.addContent("/Gs" + this.opacity_id + " gs");
      return this.doc._sMasked = true;
    }
  };

  return PDFGradient;

})();

PDFLinearGradient = (function(_super) {
  __extends(PDFLinearGradient, _super);

  function PDFLinearGradient(doc, x1, y1, x2, y2) {
    this.doc = doc;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    PDFLinearGradient.__super__.constructor.apply(this, arguments);
  }

  PDFLinearGradient.prototype.shader = function(fn) {
    return this.doc.ref({
      ShadingType: 2,
      ColorSpace: this._colorSpace,
      Coords: [this.x1, this.y1, this.x2, this.y2],
      Function: fn,
      Extend: [true, true]
    });
  };

  PDFLinearGradient.prototype.opacityGradient = function() {
    return new PDFLinearGradient(this.doc, this.x1, this.y1, this.x2, this.y2);
  };

  return PDFLinearGradient;

})(PDFGradient);

PDFRadialGradient = (function(_super) {
  __extends(PDFRadialGradient, _super);

  function PDFRadialGradient(doc, x1, y1, r1, x2, y2, r2) {
    this.doc = doc;
    this.x1 = x1;
    this.y1 = y1;
    this.r1 = r1;
    this.x2 = x2;
    this.y2 = y2;
    this.r2 = r2;
    PDFRadialGradient.__super__.constructor.apply(this, arguments);
  }

  PDFRadialGradient.prototype.shader = function(fn) {
    return this.doc.ref({
      ShadingType: 3,
      ColorSpace: this._colorSpace,
      Coords: [this.x1, this.y1, this.r1, this.x2, this.y2, this.r2],
      Function: fn,
      Extend: [true, true]
    });
  };

  PDFRadialGradient.prototype.opacityGradient = function() {
    return new PDFRadialGradient(this.doc, this.x1, this.y1, this.r1, this.x2, this.y2, this.r2);
  };

  return PDFRadialGradient;

})(PDFGradient);

module.exports = {
  PDFGradient: PDFGradient,
  PDFLinearGradient: PDFLinearGradient,
  PDFRadialGradient: PDFRadialGradient
};


},{}],22:[function(_dereq_,module,exports){
(function (Buffer){

/*
PDFImage - embeds images in PDF documents
By Devon Govett
 */
var Data, JPEG, PDFImage, PNG, fs;

fs = _dereq_('fs');

Data = _dereq_('./data');

JPEG = _dereq_('./image/jpeg');

PNG = _dereq_('./image/png');

PDFImage = (function() {
  function PDFImage() {}

  PDFImage.open = function(src, label) {
    var data, match;
    if (Buffer.isBuffer(src)) {
      data = src;
    } else {
      if (match = /^data:.+;base64,(.*)$/.exec(src)) {
        data = new Buffer(match[1], 'base64');
      } else {
        data = fs.readFileSync(src);
        if (!data) {
          return;
        }
      }
    }
    if (data[0] === 0xff && data[1] === 0xd8) {
      return new JPEG(data, label);
    } else if (data[0] === 0x89 && data.toString('ascii', 1, 4) === 'PNG') {
      return new PNG(data, label);
    } else {
      throw new Error('Unknown image format.');
    }
  };

  return PDFImage;

})();

module.exports = PDFImage;


}).call(this,_dereq_("buffer").Buffer)
},{"./data":1,"./image/jpeg":23,"./image/png":24,"buffer":51,"fs":36}],23:[function(_dereq_,module,exports){
var JPEG, fs,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

fs = _dereq_('fs');

JPEG = (function() {
  var MARKERS;

  MARKERS = [0xFFC0, 0xFFC1, 0xFFC2, 0xFFC3, 0xFFC5, 0xFFC6, 0xFFC7, 0xFFC8, 0xFFC9, 0xFFCA, 0xFFCB, 0xFFCC, 0xFFCD, 0xFFCE, 0xFFCF];

  function JPEG(data, label) {
    var channels, marker, pos;
    this.data = data;
    this.label = label;
    if (this.data.readUInt16BE(0) !== 0xFFD8) {
      throw "SOI not found in JPEG";
    }
    pos = 2;
    while (pos < this.data.length) {
      marker = this.data.readUInt16BE(pos);
      pos += 2;
      if (__indexOf.call(MARKERS, marker) >= 0) {
        break;
      }
      pos += this.data.readUInt16BE(pos);
    }
    if (__indexOf.call(MARKERS, marker) < 0) {
      throw "Invalid JPEG.";
    }
    pos += 2;
    this.bits = this.data[pos++];
    this.height = this.data.readUInt16BE(pos);
    pos += 2;
    this.width = this.data.readUInt16BE(pos);
    pos += 2;
    channels = this.data[pos++];
    this.colorSpace = (function() {
      switch (channels) {
        case 1:
          return 'DeviceGray';
        case 3:
          return 'DeviceRGB';
        case 4:
          return 'DeviceCMYK';
      }
    })();
    this.obj = null;
  }

  JPEG.prototype.embed = function(document) {
    if (this.obj) {
      return;
    }
    this.obj = document.ref({
      Type: 'XObject',
      Subtype: 'Image',
      BitsPerComponent: this.bits,
      Width: this.width,
      Height: this.height,
      ColorSpace: this.colorSpace,
      Filter: 'DCTDecode'
    });
    if (this.colorSpace === 'DeviceCMYK') {
      this.obj.data['Decode'] = [1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0];
    }
    this.obj.end(this.data);
    return this.data = null;
  };

  return JPEG;

})();

module.exports = JPEG;


},{"fs":36}],24:[function(_dereq_,module,exports){
(function (Buffer){
var PNG, PNGImage, zlib;

zlib = _dereq_('zlib');

PNG = _dereq_('png-js');

PNGImage = (function() {
  function PNGImage(data, label) {
    this.label = label;
    this.image = new PNG(data);
    this.width = this.image.width;
    this.height = this.image.height;
    this.imgData = this.image.imgData;
    this.obj = null;
  }

  PNGImage.prototype.embed = function(document) {
    var mask, palette, params, rgb, val, x, _i, _len;
    this.document = document;
    if (this.obj) {
      return;
    }
    this.obj = document.ref({
      Type: 'XObject',
      Subtype: 'Image',
      BitsPerComponent: this.image.bits,
      Width: this.width,
      Height: this.height,
      Filter: 'FlateDecode'
    });
    if (!this.image.hasAlphaChannel) {
      params = document.ref({
        Predictor: 15,
        Colors: this.image.colors,
        BitsPerComponent: this.image.bits,
        Columns: this.width
      });
      this.obj.data['DecodeParms'] = params;
      params.end();
    }
    if (this.image.palette.length === 0) {
      this.obj.data['ColorSpace'] = this.image.colorSpace;
    } else {
      palette = document.ref();
      palette.end(new Buffer(this.image.palette));
      this.obj.data['ColorSpace'] = ['Indexed', 'DeviceRGB', (this.image.palette.length / 3) - 1, palette];
    }
    if (this.image.transparency.grayscale) {
      val = this.image.transparency.greyscale;
      return this.obj.data['Mask'] = [val, val];
    } else if (this.image.transparency.rgb) {
      rgb = this.image.transparency.rgb;
      mask = [];
      for (_i = 0, _len = rgb.length; _i < _len; _i++) {
        x = rgb[_i];
        mask.push(x, x);
      }
      return this.obj.data['Mask'] = mask;
    } else if (this.image.transparency.indexed) {
      return this.loadIndexedAlphaChannel();
    } else if (this.image.hasAlphaChannel) {
      return this.splitAlphaChannel();
    } else {
      return this.finalize();
    }
  };

  PNGImage.prototype.finalize = function() {
    var sMask;
    if (this.alphaChannel) {
      sMask = this.document.ref({
        Type: 'XObject',
        Subtype: 'Image',
        Height: this.height,
        Width: this.width,
        BitsPerComponent: 8,
        Filter: 'FlateDecode',
        ColorSpace: 'DeviceGray',
        Decode: [0, 1]
      });
      sMask.end(this.alphaChannel);
      this.obj.data['SMask'] = sMask;
    }
    this.obj.end(this.imgData);
    this.image = null;
    return this.imgData = null;
  };

  PNGImage.prototype.splitAlphaChannel = function() {
    return this.image.decodePixels((function(_this) {
      return function(pixels) {
        var a, alphaChannel, colorByteSize, done, i, imgData, len, p, pixelCount;
        colorByteSize = _this.image.colors * _this.image.bits / 8;
        pixelCount = _this.width * _this.height;
        imgData = new Buffer(pixelCount * colorByteSize);
        alphaChannel = new Buffer(pixelCount);
        i = p = a = 0;
        len = pixels.length;
        while (i < len) {
          imgData[p++] = pixels[i++];
          imgData[p++] = pixels[i++];
          imgData[p++] = pixels[i++];
          alphaChannel[a++] = pixels[i++];
        }
        done = 0;
        zlib.deflate(imgData, function(err, imgData) {
          _this.imgData = imgData;
          if (err) {
            throw err;
          }
          if (++done === 2) {
            return _this.finalize();
          }
        });
        return zlib.deflate(alphaChannel, function(err, alphaChannel) {
          _this.alphaChannel = alphaChannel;
          if (err) {
            throw err;
          }
          if (++done === 2) {
            return _this.finalize();
          }
        });
      };
    })(this));
  };

  PNGImage.prototype.loadIndexedAlphaChannel = function(fn) {
    var transparency;
    transparency = this.image.transparency.indexed;
    return this.image.decodePixels((function(_this) {
      return function(pixels) {
        var alphaChannel, i, j, _i, _ref;
        alphaChannel = new Buffer(_this.width * _this.height);
        i = 0;
        for (j = _i = 0, _ref = pixels.length; _i < _ref; j = _i += 1) {
          alphaChannel[i++] = transparency[pixels[j]];
        }
        return zlib.deflate(alphaChannel, function(err, alphaChannel) {
          _this.alphaChannel = alphaChannel;
          if (err) {
            throw err;
          }
          return _this.finalize();
        });
      };
    })(this));
  };

  return PNGImage;

})();

module.exports = PNGImage;


}).call(this,_dereq_("buffer").Buffer)
},{"buffer":51,"png-js":72,"zlib":50}],25:[function(_dereq_,module,exports){
var EventEmitter, LineBreaker, LineWrapper,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventEmitter = _dereq_('events').EventEmitter;

LineBreaker = _dereq_('linebreak');

LineWrapper = (function(_super) {
  __extends(LineWrapper, _super);

  function LineWrapper(document, options) {
    var _ref;
    this.document = document;
    this.indent = options.indent || 0;
    this.characterSpacing = options.characterSpacing || 0;
    this.wordSpacing = options.wordSpacing === 0;
    this.columns = options.columns || 1;
    this.columnGap = (_ref = options.columnGap) != null ? _ref : 18;
    this.lineWidth = (options.width - (this.columnGap * (this.columns - 1))) / this.columns;
    this.spaceLeft = this.lineWidth;
    this.startX = this.document.x;
    this.startY = this.document.y;
    this.column = 1;
    this.ellipsis = options.ellipsis;
    this.continuedX = 0;
    if (options.height != null) {
      this.height = options.height;
      this.maxY = this.startY + options.height;
    } else {
      this.maxY = this.document.page.maxY();
    }
    this.on('firstLine', (function(_this) {
      return function(options) {
        var indent;
        indent = _this.continuedX || _this.indent;
        _this.document.x += indent;
        _this.lineWidth -= indent;
        return _this.once('line', function() {
          _this.document.x -= indent;
          _this.lineWidth += indent;
          if (options.continued && !_this.continuedX) {
            _this.continuedX = _this.indent;
          }
          if (!options.continued) {
            return _this.continuedX = 0;
          }
        });
      };
    })(this));
    this.on('lastLine', (function(_this) {
      return function(options) {
        var align;
        align = options.align;
        if (align === 'justify') {
          options.align = 'left';
        }
        _this.lastLine = true;
        return _this.once('line', function() {
          _this.document.y += options.paragraphGap || 0;
          options.align = align;
          return _this.lastLine = false;
        });
      };
    })(this));
  }

  LineWrapper.prototype.wordWidth = function(word) {
    return this.document.widthOfString(word, this) + this.characterSpacing + this.wordSpacing;
  };

  LineWrapper.prototype.eachWord = function(text, fn) {
    var bk, breaker, fbk, l, last, lbk, shouldContinue, w, word, wordWidths;
    breaker = new LineBreaker(text);
    last = null;
    wordWidths = {};
    while (bk = breaker.nextBreak()) {
      word = text.slice((last != null ? last.position : void 0) || 0, bk.position);
      w = wordWidths[word] != null ? wordWidths[word] : wordWidths[word] = this.wordWidth(word);
      if (w > this.lineWidth + this.continuedX) {
        lbk = last;
        fbk = {};
        while (word.length) {
          l = word.length;
          while (w > this.spaceLeft) {
            w = this.wordWidth(word.slice(0, --l));
          }
          fbk.required = l < word.length;
          shouldContinue = fn(word.slice(0, l), w, fbk, lbk);
          lbk = {
            required: false
          };
          word = word.slice(l);
          w = this.wordWidth(word);
          if (shouldContinue === false) {
            break;
          }
        }
      } else {
        shouldContinue = fn(word, w, bk, last);
      }
      if (shouldContinue === false) {
        break;
      }
      last = bk;
    }
  };

  LineWrapper.prototype.wrap = function(text, options) {
    var buffer, emitLine, lc, nextY, textWidth, wc, y;
    if (options.indent != null) {
      this.indent = options.indent;
    }
    if (options.characterSpacing != null) {
      this.characterSpacing = options.characterSpacing;
    }
    if (options.wordSpacing != null) {
      this.wordSpacing = options.wordSpacing;
    }
    if (options.ellipsis != null) {
      this.ellipsis = options.ellipsis;
    }
    nextY = this.document.y + this.document.currentLineHeight(true);
    if (this.document.y > this.maxY || nextY > this.maxY) {
      this.nextSection();
    }
    buffer = '';
    textWidth = 0;
    wc = 0;
    lc = 0;
    y = this.document.y;
    emitLine = (function(_this) {
      return function() {
        options.textWidth = textWidth + _this.wordSpacing * (wc - 1);
        options.wordCount = wc;
        options.lineWidth = _this.lineWidth;
        y = _this.document.y;
        _this.emit('line', buffer, options, _this);
        return lc++;
      };
    })(this);
    this.emit('sectionStart', options, this);
    this.eachWord(text, (function(_this) {
      return function(word, w, bk, last) {
        var lh, shouldContinue;
        if ((last == null) || last.required) {
          _this.emit('firstLine', options, _this);
          _this.spaceLeft = _this.lineWidth;
        }
        if (w <= _this.spaceLeft) {
          buffer += word;
          textWidth += w;
          wc++;
        }
        if (bk.required || w > _this.spaceLeft) {
          if (bk.required) {
            _this.emit('lastLine', options, _this);
          }
          lh = _this.document.currentLineHeight(true);
          if ((_this.height != null) && _this.ellipsis && _this.document.y + lh * 2 > _this.maxY && _this.column >= _this.columns) {
            if (_this.ellipsis === true) {
              _this.ellipsis = '…';
            }
            buffer = buffer.replace(/\s+$/, '');
            textWidth = _this.wordWidth(buffer + _this.ellipsis);
            while (textWidth > _this.lineWidth) {
              buffer = buffer.slice(0, -1).replace(/\s+$/, '');
              textWidth = _this.wordWidth(buffer + _this.ellipsis);
            }
            buffer = buffer + _this.ellipsis;
          }
          emitLine();
          if (_this.document.y + lh > _this.maxY) {
            shouldContinue = _this.nextSection();
            if (!shouldContinue) {
              wc = 0;
              buffer = '';
              return false;
            }
          }
          if (bk.required) {
            if (w > _this.spaceLeft) {
              buffer = word;
              textWidth = w;
              wc = 1;
              emitLine();
            }
            _this.spaceLeft = _this.lineWidth;
            buffer = '';
            textWidth = 0;
            return wc = 0;
          } else {
            _this.spaceLeft = _this.lineWidth - w;
            buffer = word;
            textWidth = w;
            return wc = 1;
          }
        } else {
          return _this.spaceLeft -= w;
        }
      };
    })(this));
    if (wc > 0) {
      this.emit('lastLine', options, this);
      emitLine();
    }
    this.emit('sectionEnd', options, this);
    if (options.continued === true) {
      if (lc > 1) {
        this.continuedX = 0;
      }
      this.continuedX += options.textWidth;
      return this.document.y = y;
    } else {
      return this.document.x = this.startX;
    }
  };

  LineWrapper.prototype.nextSection = function(options) {
    var _ref;
    this.emit('sectionEnd', options, this);
    if (++this.column > this.columns) {
      if (this.height != null) {
        return false;
      }
      this.document.addPage();
      this.column = 1;
      this.startY = this.document.page.margins.top;
      this.maxY = this.document.page.maxY();
      this.document.x = this.startX;
      if (this.document._fillColor) {
        (_ref = this.document).fillColor.apply(_ref, this.document._fillColor);
      }
      this.emit('pageBreak', options, this);
    } else {
      this.document.x += this.lineWidth + this.columnGap;
      this.document.y = this.startY;
      this.emit('columnBreak', options, this);
    }
    this.emit('sectionStart', options, this);
    return true;
  };

  return LineWrapper;

})(EventEmitter);

module.exports = LineWrapper;


},{"events":54,"linebreak":70}],26:[function(_dereq_,module,exports){
module.exports = {
  annotate: function(x, y, w, h, options) {
    var key, ref, val;
    options.Type = 'Annot';
    options.Rect = this._convertRect(x, y, w, h);
    options.Border = [0, 0, 0];
    if (options.Subtype !== 'Link') {
      if (options.C == null) {
        options.C = this._normalizeColor(options.color || [0, 0, 0]);
      }
    }
    delete options.color;
    if (typeof options.Dest === 'string') {
      options.Dest = new String(options.Dest);
    }
    for (key in options) {
      val = options[key];
      options[key[0].toUpperCase() + key.slice(1)] = val;
    }
    ref = this.ref(options);
    this.page.annotations.push(ref);
    ref.end();
    return this;
  },
  note: function(x, y, w, h, contents, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Text';
    options.Contents = new String(contents);
    options.Name = 'Comment';
    if (options.color == null) {
      options.color = [243, 223, 92];
    }
    return this.annotate(x, y, w, h, options);
  },
  link: function(x, y, w, h, url, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Link';
    options.A = this.ref({
      S: 'URI',
      URI: new String(url)
    });
    options.A.end();
    return this.annotate(x, y, w, h, options);
  },
  _markup: function(x, y, w, h, options) {
    var x1, x2, y1, y2, _ref;
    if (options == null) {
      options = {};
    }
    _ref = this._convertRect(x, y, w, h), x1 = _ref[0], y1 = _ref[1], x2 = _ref[2], y2 = _ref[3];
    options.QuadPoints = [x1, y2, x2, y2, x1, y1, x2, y1];
    options.Contents = new String;
    return this.annotate(x, y, w, h, options);
  },
  highlight: function(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Highlight';
    if (options.color == null) {
      options.color = [241, 238, 148];
    }
    return this._markup(x, y, w, h, options);
  },
  underline: function(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Underline';
    return this._markup(x, y, w, h, options);
  },
  strike: function(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'StrikeOut';
    return this._markup(x, y, w, h, options);
  },
  lineAnnotation: function(x1, y1, x2, y2, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Line';
    options.Contents = new String;
    options.L = [x1, this.page.height - y1, x2, this.page.height - y2];
    return this.annotate(x1, y1, x2, y2, options);
  },
  rectAnnotation: function(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Square';
    options.Contents = new String;
    return this.annotate(x, y, w, h, options);
  },
  ellipseAnnotation: function(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Circle';
    options.Contents = new String;
    return this.annotate(x, y, w, h, options);
  },
  textAnnotation: function(x, y, w, h, text, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'FreeText';
    options.Contents = new String(text);
    options.DA = new String;
    return this.annotate(x, y, w, h, options);
  },
  _convertRect: function(x1, y1, w, h) {
    var m0, m1, m2, m3, m4, m5, x2, y2, _ref;
    y2 = y1;
    y1 += h;
    x2 = x1 + w;
    _ref = this._ctm, m0 = _ref[0], m1 = _ref[1], m2 = _ref[2], m3 = _ref[3], m4 = _ref[4], m5 = _ref[5];
    x1 = m0 * x1 + m2 * y1 + m4;
    y1 = m1 * x1 + m3 * y1 + m5;
    x2 = m0 * x2 + m2 * y2 + m4;
    y2 = m1 * x2 + m3 * y2 + m5;
    return [x1, y1, x2, y2];
  }
};


},{}],27:[function(_dereq_,module,exports){
var PDFGradient, PDFLinearGradient, PDFRadialGradient, namedColors, _ref;

_ref = _dereq_('../gradient'), PDFGradient = _ref.PDFGradient, PDFLinearGradient = _ref.PDFLinearGradient, PDFRadialGradient = _ref.PDFRadialGradient;

module.exports = {
  initColor: function() {
    this._opacityRegistry = {};
    this._opacityCount = 0;
    return this._gradCount = 0;
  },
  _normalizeColor: function(color) {
    var hex, part;
    if (color instanceof PDFGradient) {
      return color;
    }
    if (typeof color === 'string') {
      if (color.charAt(0) === '#') {
        if (color.length === 4) {
          color = color.replace(/#([0-9A-F])([0-9A-F])([0-9A-F])/i, "#$1$1$2$2$3$3");
        }
        hex = parseInt(color.slice(1), 16);
        color = [hex >> 16, hex >> 8 & 0xff, hex & 0xff];
      } else if (namedColors[color]) {
        color = namedColors[color];
      }
    }
    if (Array.isArray(color)) {
      if (color.length === 3) {
        color = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = color.length; _i < _len; _i++) {
            part = color[_i];
            _results.push(part / 255);
          }
          return _results;
        })();
      } else if (color.length === 4) {
        color = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = color.length; _i < _len; _i++) {
            part = color[_i];
            _results.push(part / 100);
          }
          return _results;
        })();
      }
      return color;
    }
    return null;
  },
  _setColor: function(color, stroke) {
    var gstate, name, op, space;
    color = this._normalizeColor(color);
    if (!color) {
      return false;
    }
    if (this._sMasked) {
      gstate = this.ref({
        Type: 'ExtGState',
        SMask: 'None'
      });
      gstate.end();
      name = "Gs" + (++this._opacityCount);
      this.page.ext_gstates[name] = gstate;
      this.addContent("/" + name + " gs");
      this._sMasked = false;
    }
    op = stroke ? 'SCN' : 'scn';
    if (color instanceof PDFGradient) {
      this._setColorSpace('Pattern', stroke);
      color.apply(op);
    } else {
      space = color.length === 4 ? 'DeviceCMYK' : 'DeviceRGB';
      this._setColorSpace(space, stroke);
      color = color.join(' ');
      this.addContent("" + color + " " + op);
    }
    return true;
  },
  _setColorSpace: function(space, stroke) {
    var op;
    op = stroke ? 'CS' : 'cs';
    return this.addContent("/" + space + " " + op);
  },
  fillColor: function(color, opacity) {
    var set;
    if (opacity == null) {
      opacity = 1;
    }
    set = this._setColor(color, false);
    if (set) {
      this.fillOpacity(opacity);
    }
    this._fillColor = [color, opacity];
    return this;
  },
  strokeColor: function(color, opacity) {
    var set;
    if (opacity == null) {
      opacity = 1;
    }
    set = this._setColor(color, true);
    if (set) {
      this.strokeOpacity(opacity);
    }
    return this;
  },
  opacity: function(opacity) {
    this._doOpacity(opacity, opacity);
    return this;
  },
  fillOpacity: function(opacity) {
    this._doOpacity(opacity, null);
    return this;
  },
  strokeOpacity: function(opacity) {
    this._doOpacity(null, opacity);
    return this;
  },
  _doOpacity: function(fillOpacity, strokeOpacity) {
    var dictionary, id, key, name, _ref1;
    if (!((fillOpacity != null) || (strokeOpacity != null))) {
      return;
    }
    if (fillOpacity != null) {
      fillOpacity = Math.max(0, Math.min(1, fillOpacity));
    }
    if (strokeOpacity != null) {
      strokeOpacity = Math.max(0, Math.min(1, strokeOpacity));
    }
    key = "" + fillOpacity + "_" + strokeOpacity;
    if (this._opacityRegistry[key]) {
      _ref1 = this._opacityRegistry[key], dictionary = _ref1[0], name = _ref1[1];
    } else {
      dictionary = {
        Type: 'ExtGState'
      };
      if (fillOpacity != null) {
        dictionary.ca = fillOpacity;
      }
      if (strokeOpacity != null) {
        dictionary.CA = strokeOpacity;
      }
      dictionary = this.ref(dictionary);
      dictionary.end();
      id = ++this._opacityCount;
      name = "Gs" + id;
      this._opacityRegistry[key] = [dictionary, name];
    }
    this.page.ext_gstates[name] = dictionary;
    return this.addContent("/" + name + " gs");
  },
  linearGradient: function(x1, y1, x2, y2) {
    return new PDFLinearGradient(this, x1, y1, x2, y2);
  },
  radialGradient: function(x1, y1, r1, x2, y2, r2) {
    return new PDFRadialGradient(this, x1, y1, r1, x2, y2, r2);
  }
};

namedColors = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};


},{"../gradient":21}],28:[function(_dereq_,module,exports){
var PDFFont;

PDFFont = _dereq_('../font');

module.exports = {
  initFonts: function() {
    this._fontFamilies = {};
    this._fontCount = 0;
    this._fontSize = 12;
    this._font = null;
    this._registeredFonts = {};
    return this.font('Helvetica');
  },
  font: function(src, family, size) {
    var cacheKey, font, id, _ref;
    if (typeof family === 'number') {
      size = family;
      family = null;
    }
    if (typeof src === 'string' && this._registeredFonts[src]) {
      cacheKey = src;
      _ref = this._registeredFonts[src], src = _ref.src, family = _ref.family;
    } else {
      cacheKey = family || src;
      if (typeof cacheKey !== 'string') {
        cacheKey = null;
      }
    }
    if (size != null) {
      this.fontSize(size);
    }
    if (font = this._fontFamilies[cacheKey]) {
      this._font = font;
      return this;
    }
    id = 'F' + (++this._fontCount);
    this._font = new PDFFont(this, src, family, id);
    if (font = this._fontFamilies[this._font.name]) {
      this._font = font;
      return this;
    }
    if (cacheKey) {
      this._fontFamilies[cacheKey] = this._font;
    }
    this._fontFamilies[this._font.name] = this._font;
    return this;
  },
  fontSize: function(_fontSize) {
    this._fontSize = _fontSize;
    return this;
  },
  currentLineHeight: function(includeGap) {
    if (includeGap == null) {
      includeGap = false;
    }
    return this._font.lineHeight(this._fontSize, includeGap);
  },
  registerFont: function(name, src, family) {
    this._registeredFonts[name] = {
      src: src,
      family: family
    };
    return this;
  }
};


},{"../font":3}],29:[function(_dereq_,module,exports){
(function (Buffer){
var PDFImage;

PDFImage = _dereq_('../image');

module.exports = {
  initImages: function() {
    this._imageRegistry = {};
    return this._imageCount = 0;
  },
  image: function(src, x, y, options) {
    var bh, bp, bw, h, hp, image, ip, w, wp, _base, _name, _ref, _ref1, _ref2;
    if (options == null) {
      options = {};
    }
    if (typeof x === 'object') {
      options = x;
      x = null;
    }
    x = (_ref = x != null ? x : options.x) != null ? _ref : this.x;
    y = (_ref1 = y != null ? y : options.y) != null ? _ref1 : this.y;
    if (!Buffer.isBuffer(src)) {
      image = this._imageRegistry[src];
    }
    if (!image) {
      image = PDFImage.open(src, 'I' + (++this._imageCount));
      image.embed(this);
      if (!Buffer.isBuffer(src)) {
        this._imageRegistry[src] = image;
      }
    }
    if ((_base = this.page.xobjects)[_name = image.label] == null) {
      _base[_name] = image.obj;
    }
    w = options.width || image.width;
    h = options.height || image.height;
    if (options.width && !options.height) {
      wp = w / image.width;
      w = image.width * wp;
      h = image.height * wp;
    } else if (options.height && !options.width) {
      hp = h / image.height;
      w = image.width * hp;
      h = image.height * hp;
    } else if (options.scale) {
      w = image.width * options.scale;
      h = image.height * options.scale;
    } else if (options.fit) {
      _ref2 = options.fit, bw = _ref2[0], bh = _ref2[1];
      bp = bw / bh;
      ip = image.width / image.height;
      if (ip > bp) {
        w = bw;
        h = bw / ip;
      } else {
        h = bh;
        w = bh * ip;
      }
      if (options.align === 'center') {
        x = x + bw / 2 - w / 2;
      } else if (options.align === 'right') {
        x = x + bw - w;
      }
      if (options.valign === 'center') {
        y = y + bh / 2 - h / 2;
      } else if (options.valign === 'bottom') {
        y = y + bh - h;
      }
    }
    if (this.y === y) {
      this.y += h;
    }
    this.save();
    this.transform(w, 0, 0, -h, x, y + h);
    this.addContent("/" + image.label + " Do");
    this.restore();
    return this;
  }
};


}).call(this,_dereq_("buffer").Buffer)
},{"../image":22,"buffer":51}],30:[function(_dereq_,module,exports){
var LineWrapper;

LineWrapper = _dereq_('../line_wrapper');

module.exports = {
  initText: function() {
    this.x = 0;
    this.y = 0;
    return this._lineGap = 0;
  },
  lineGap: function(_lineGap) {
    this._lineGap = _lineGap;
    return this;
  },
  moveDown: function(lines) {
    if (lines == null) {
      lines = 1;
    }
    this.y += this.currentLineHeight(true) * lines + this._lineGap;
    return this;
  },
  moveUp: function(lines) {
    if (lines == null) {
      lines = 1;
    }
    this.y -= this.currentLineHeight(true) * lines + this._lineGap;
    return this;
  },
  _text: function(text, x, y, options, lineCallback) {
    var line, wrapper, _i, _len, _ref;
    options = this._initOptions(x, y, options);
    text = '' + text;
    if (options.wordSpacing) {
      text = text.replace(/\s{2,}/g, ' ');
    }
    if (options.width) {
      wrapper = this._wrapper;
      if (!wrapper) {
        wrapper = new LineWrapper(this, options);
        wrapper.on('line', lineCallback);
      }
      this._wrapper = options.continued ? wrapper : null;
      this._textOptions = options.continued ? options : null;
      wrapper.wrap(text, options);
    } else {
      _ref = text.split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        lineCallback(line, options);
      }
    }
    return this;
  },
  text: function(text, x, y, options) {
    return this._text(text, x, y, options, this._line.bind(this));
  },
  widthOfString: function(string, options) {
    if (options == null) {
      options = {};
    }
    return this._font.widthOfString(string, this._fontSize) + (options.characterSpacing || 0) * (string.length - 1);
  },
  heightOfString: function(text, options) {
    var height, lineGap, x, y;
    if (options == null) {
      options = {};
    }
    x = this.x, y = this.y;
    options = this._initOptions(options);
    options.height = Infinity;
    lineGap = options.lineGap || this._lineGap || 0;
    this._text(text, this.x, this.y, options, (function(_this) {
      return function(line, options) {
        return _this.y += _this.currentLineHeight(true) + lineGap;
      };
    })(this));
    height = this.y - y;
    this.x = x;
    this.y = y;
    return height;
  },
  list: function(list, x, y, options, wrapper) {
    var flatten, i, indent, itemIndent, items, level, levels, r;
    options = this._initOptions(x, y, options);
    r = Math.round((this._font.ascender / 1000 * this._fontSize) / 3);
    indent = options.textIndent || r * 5;
    itemIndent = options.bulletIndent || r * 8;
    level = 1;
    items = [];
    levels = [];
    flatten = function(list) {
      var i, item, _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = list.length; _i < _len; i = ++_i) {
        item = list[i];
        if (Array.isArray(item)) {
          level++;
          flatten(item);
          _results.push(level--);
        } else {
          items.push(item);
          _results.push(levels.push(level));
        }
      }
      return _results;
    };
    flatten(list);
    wrapper = new LineWrapper(this, options);
    wrapper.on('line', this._line.bind(this));
    level = 1;
    i = 0;
    wrapper.on('firstLine', (function(_this) {
      return function() {
        var diff, l;
        if ((l = levels[i++]) !== level) {
          diff = itemIndent * (l - level);
          _this.x += diff;
          wrapper.lineWidth -= diff;
          level = l;
        }
        _this.circle(_this.x - indent + r, _this.y + r + (r / 2), r);
        return _this.fill();
      };
    })(this));
    wrapper.on('sectionStart', (function(_this) {
      return function() {
        var pos;
        pos = indent + itemIndent * (level - 1);
        _this.x += pos;
        return wrapper.lineWidth -= pos;
      };
    })(this));
    wrapper.on('sectionEnd', (function(_this) {
      return function() {
        var pos;
        pos = indent + itemIndent * (level - 1);
        _this.x -= pos;
        return wrapper.lineWidth += pos;
      };
    })(this));
    wrapper.wrap(items.join('\n'), options);
    return this;
  },
  _initOptions: function(x, y, options) {
    var key, margins, val, _ref;
    if (x == null) {
      x = {};
    }
    if (options == null) {
      options = {};
    }
    if (typeof x === 'object') {
      options = x;
      x = null;
    }
    options = (function() {
      var k, opts, v;
      opts = {};
      for (k in options) {
        v = options[k];
        opts[k] = v;
      }
      return opts;
    })();
    if (this._textOptions) {
      _ref = this._textOptions;
      for (key in _ref) {
        val = _ref[key];
        if (key !== 'continued') {
          if (options[key] == null) {
            options[key] = val;
          }
        }
      }
    }
    if (x != null) {
      this.x = x;
    }
    if (y != null) {
      this.y = y;
    }
    if (options.lineBreak !== false) {
      margins = this.page.margins;
      if (options.width == null) {
        options.width = this.page.width - this.x - margins.right;
      }
    }
    options.columns || (options.columns = 0);
    if (options.columnGap == null) {
      options.columnGap = 18;
    }
    return options;
  },
  _line: function(text, options, wrapper) {
    var lineGap;
    if (options == null) {
      options = {};
    }
    this._fragment(text, this.x, this.y, options);
    lineGap = options.lineGap || this._lineGap || 0;
    if (!wrapper) {
      return this.x += this.widthOfString(text);
    } else {
      return this.y += this.currentLineHeight(true) + lineGap;
    }
  },
  _fragment: function(text, x, y, options) {
    var align, characterSpacing, commands, d, encoded, i, lineWidth, lineY, mode, renderedWidth, spaceWidth, textWidth, word, wordSpacing, words, _base, _i, _len, _name;
    text = '' + text;
    if (text.length === 0) {
      return;
    }
    align = options.align || 'left';
    wordSpacing = options.wordSpacing || 0;
    characterSpacing = options.characterSpacing || 0;
    if (options.width) {
      switch (align) {
        case 'right':
          textWidth = this.widthOfString(text.replace(/\s+$/, ''), options);
          x += options.lineWidth - textWidth;
          break;
        case 'center':
          x += options.lineWidth / 2 - options.textWidth / 2;
          break;
        case 'justify':
          words = text.trim().split(/\s+/);
          textWidth = this.widthOfString(text.replace(/\s+/g, ''), options);
          spaceWidth = this.widthOfString(' ') + characterSpacing;
          wordSpacing = Math.max(0, (options.lineWidth - textWidth) / Math.max(1, words.length - 1) - spaceWidth);
      }
    }
    renderedWidth = options.textWidth + (wordSpacing * (options.wordCount - 1)) + (characterSpacing * (text.length - 1));
    if (options.link) {
      this.link(x, y, renderedWidth, this.currentLineHeight(), options.link);
    }
    if (options.underline || options.strike) {
      this.save();
      if (!options.stroke) {
        this.strokeColor.apply(this, this._fillColor);
      }
      lineWidth = this._fontSize < 10 ? 0.5 : Math.floor(this._fontSize / 10);
      this.lineWidth(lineWidth);
      d = options.underline ? 1 : 2;
      lineY = y + this.currentLineHeight() / d;
      if (options.underline) {
        lineY -= lineWidth;
      }
      this.moveTo(x, lineY);
      this.lineTo(x + renderedWidth, lineY);
      this.stroke();
      this.restore();
    }
    this.save();
    this.transform(1, 0, 0, -1, 0, this.page.height);
    y = this.page.height - y - (this._font.ascender / 1000 * this._fontSize);
    if ((_base = this.page.fonts)[_name = this._font.id] == null) {
      _base[_name] = this._font.ref();
    }
    this._font.use(text);
    this.addContent("BT");
    this.addContent("" + x + " " + y + " Td");
    this.addContent("/" + this._font.id + " " + this._fontSize + " Tf");
    mode = options.fill && options.stroke ? 2 : options.stroke ? 1 : 0;
    if (mode) {
      this.addContent("" + mode + " Tr");
    }
    if (characterSpacing) {
      this.addContent("" + characterSpacing + " Tc");
    }
    if (wordSpacing) {
      words = text.trim().split(/\s+/);
      wordSpacing += this.widthOfString(' ') + characterSpacing;
      wordSpacing *= 1000 / this._fontSize;
      commands = [];
      for (_i = 0, _len = words.length; _i < _len; _i++) {
        word = words[_i];
        encoded = this._font.encode(word);
        encoded = ((function() {
          var _j, _ref, _results;
          _results = [];
          for (i = _j = 0, _ref = encoded.length; _j < _ref; i = _j += 1) {
            _results.push(encoded.charCodeAt(i).toString(16));
          }
          return _results;
        })()).join('');
        commands.push("<" + encoded + "> " + (-wordSpacing));
      }
      this.addContent("[" + (commands.join(' ')) + "] TJ");
    } else {
      encoded = this._font.encode(text);
      encoded = ((function() {
        var _j, _ref, _results;
        _results = [];
        for (i = _j = 0, _ref = encoded.length; _j < _ref; i = _j += 1) {
          _results.push(encoded.charCodeAt(i).toString(16));
        }
        return _results;
      })()).join('');
      this.addContent("<" + encoded + "> Tj");
    }
    this.addContent("ET");
    return this.restore();
  }
};


},{"../line_wrapper":25}],31:[function(_dereq_,module,exports){
var KAPPA, SVGPath,
  __slice = [].slice;

SVGPath = _dereq_('../path');

KAPPA = 4.0 * ((Math.sqrt(2) - 1.0) / 3.0);

module.exports = {
  initVector: function() {
    this._ctm = [1, 0, 0, 1, 0, 0];
    return this._ctmStack = [];
  },
  save: function() {
    this._ctmStack.push(this._ctm.slice());
    return this.addContent('q');
  },
  restore: function() {
    this._ctm = this._ctmStack.pop() || [1, 0, 0, 1, 0, 0];
    return this.addContent('Q');
  },
  closePath: function() {
    return this.addContent('h');
  },
  lineWidth: function(w) {
    return this.addContent("" + w + " w");
  },
  _CAP_STYLES: {
    BUTT: 0,
    ROUND: 1,
    SQUARE: 2
  },
  lineCap: function(c) {
    if (typeof c === 'string') {
      c = this._CAP_STYLES[c.toUpperCase()];
    }
    return this.addContent("" + c + " J");
  },
  _JOIN_STYLES: {
    MITER: 0,
    ROUND: 1,
    BEVEL: 2
  },
  lineJoin: function(j) {
    if (typeof j === 'string') {
      j = this._JOIN_STYLES[j.toUpperCase()];
    }
    return this.addContent("" + j + " j");
  },
  miterLimit: function(m) {
    return this.addContent("" + m + " M");
  },
  dash: function(length, options) {
    var phase, space, _ref;
    if (options == null) {
      options = {};
    }
    if (length == null) {
      return this;
    }
    space = (_ref = options.space) != null ? _ref : length;
    phase = options.phase || 0;
    return this.addContent("[" + length + " " + space + "] " + phase + " d");
  },
  undash: function() {
    return this.addContent("[] 0 d");
  },
  moveTo: function(x, y) {
    return this.addContent("" + x + " " + y + " m");
  },
  lineTo: function(x, y) {
    return this.addContent("" + x + " " + y + " l");
  },
  bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
    return this.addContent("" + cp1x + " " + cp1y + " " + cp2x + " " + cp2y + " " + x + " " + y + " c");
  },
  quadraticCurveTo: function(cpx, cpy, x, y) {
    return this.addContent("" + cpx + " " + cpy + " " + x + " " + y + " v");
  },
  rect: function(x, y, w, h) {
    return this.addContent("" + x + " " + y + " " + w + " " + h + " re");
  },
  roundedRect: function(x, y, w, h, r) {
    if (r == null) {
      r = 0;
    }
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    return this.quadraticCurveTo(x, y, x + r, y);
  },
  ellipse: function(x, y, r1, r2) {
    var ox, oy, xe, xm, ye, ym;
    if (r2 == null) {
      r2 = r1;
    }
    x -= r1;
    y -= r2;
    ox = r1 * KAPPA;
    oy = r2 * KAPPA;
    xe = x + r1 * 2;
    ye = y + r2 * 2;
    xm = x + r1;
    ym = y + r2;
    this.moveTo(x, ym);
    this.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    this.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    this.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    this.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    return this.closePath();
  },
  circle: function(x, y, radius) {
    return this.ellipse(x, y, radius);
  },
  polygon: function() {
    var point, points, _i, _len;
    points = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.moveTo.apply(this, points.shift());
    for (_i = 0, _len = points.length; _i < _len; _i++) {
      point = points[_i];
      this.lineTo.apply(this, point);
    }
    return this.closePath();
  },
  path: function(path) {
    SVGPath.apply(this, path);
    return this;
  },
  _windingRule: function(rule) {
    if (/even-?odd/.test(rule)) {
      return '*';
    }
    return '';
  },
  fill: function(color, rule) {
    if (/(even-?odd)|(non-?zero)/.test(color)) {
      rule = color;
      color = null;
    }
    if (color) {
      this.fillColor(color);
    }
    return this.addContent('f' + this._windingRule(rule));
  },
  stroke: function(color) {
    if (color) {
      this.strokeColor(color);
    }
    return this.addContent('S');
  },
  fillAndStroke: function(fillColor, strokeColor, rule) {
    var isFillRule;
    if (strokeColor == null) {
      strokeColor = fillColor;
    }
    isFillRule = /(even-?odd)|(non-?zero)/;
    if (isFillRule.test(fillColor)) {
      rule = fillColor;
      fillColor = null;
    }
    if (isFillRule.test(strokeColor)) {
      rule = strokeColor;
      strokeColor = fillColor;
    }
    if (fillColor) {
      this.fillColor(fillColor);
      this.strokeColor(strokeColor);
    }
    return this.addContent('B' + this._windingRule(rule));
  },
  clip: function(rule) {
    return this.addContent('W' + this._windingRule(rule) + ' n');
  },
  transform: function(m11, m12, m21, m22, dx, dy) {
    var m, m0, m1, m2, m3, m4, m5, v, values;
    m = this._ctm;
    m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3], m4 = m[4], m5 = m[5];
    m[0] = m0 * m11 + m2 * m12;
    m[1] = m1 * m11 + m3 * m12;
    m[2] = m0 * m21 + m2 * m22;
    m[3] = m1 * m21 + m3 * m22;
    m[4] = m0 * dx + m2 * dy + m4;
    m[5] = m1 * dx + m3 * dy + m5;
    values = ((function() {
      var _i, _len, _ref, _results;
      _ref = [m11, m12, m21, m22, dx, dy];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        _results.push(+v.toFixed(5));
      }
      return _results;
    })()).join(' ');
    return this.addContent("" + values + " cm");
  },
  translate: function(x, y) {
    return this.transform(1, 0, 0, 1, x, y);
  },
  rotate: function(angle, options) {
    var cos, rad, sin, x, x1, y, y1, _ref;
    if (options == null) {
      options = {};
    }
    rad = angle * Math.PI / 180;
    cos = Math.cos(rad);
    sin = Math.sin(rad);
    x = y = 0;
    if (options.origin != null) {
      _ref = options.origin, x = _ref[0], y = _ref[1];
      x1 = x * cos - y * sin;
      y1 = x * sin + y * cos;
      x -= x1;
      y -= y1;
    }
    return this.transform(cos, sin, -sin, cos, x, y);
  },
  scale: function(xFactor, yFactor, options) {
    var x, y, _ref;
    if (yFactor == null) {
      yFactor = xFactor;
    }
    if (options == null) {
      options = {};
    }
    if (arguments.length === 2) {
      yFactor = xFactor;
      options = yFactor;
    }
    x = y = 0;
    if (options.origin != null) {
      _ref = options.origin, x = _ref[0], y = _ref[1];
      x -= xFactor * x;
      y -= yFactor * y;
    }
    return this.transform(xFactor, 0, 0, yFactor, x, y);
  }
};


},{"../path":34}],32:[function(_dereq_,module,exports){
(function (Buffer){

/*
PDFObject - converts JavaScript types into their corrisponding PDF types.
By Devon Govett
 */
var PDFObject, PDFReference;

PDFObject = (function() {
  var escapable, escapableRe, pad, swapBytes;

  function PDFObject() {}

  pad = function(str, length) {
    return (Array(length + 1).join('0') + str).slice(-length);
  };

  escapableRe = /[\n\r\t\b\f\(\)\\]/g;

  escapable = {
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\b': '\\b',
    '\f': '\\f',
    '\\': '\\\\',
    '(': '\\(',
    ')': '\\)'
  };

  swapBytes = function(buff) {
    var a, i, l, _i, _ref;
    l = buff.length;
    if (l & 0x01) {
      throw new Error("Buffer length must be even");
    } else {
      for (i = _i = 0, _ref = l - 1; _i < _ref; i = _i += 2) {
        a = buff[i];
        buff[i] = buff[i + 1];
        buff[i + 1] = a;
      }
    }
    return buff;
  };

  PDFObject.convert = function(object) {
    var e, i, isUnicode, items, key, out, string, val, _i, _ref;
    if (typeof object === 'string') {
      return '/' + object;
    } else if (object instanceof String) {
      string = object.replace(escapableRe, function(c) {
        return escapable[c];
      });
      isUnicode = false;
      for (i = _i = 0, _ref = string.length; _i < _ref; i = _i += 1) {
        if (string.charCodeAt(i) > 0x7f) {
          isUnicode = true;
          break;
        }
      }
      if (isUnicode) {
        string = swapBytes(new Buffer('\ufeff' + string, 'utf16le')).toString('binary');
      }
      return '(' + string + ')';
    } else if (Buffer.isBuffer(object)) {
      return '<' + object.toString('hex') + '>';
    } else if (object instanceof PDFReference) {
      return object.toString();
    } else if (object instanceof Date) {
      return '(D:' + pad(object.getUTCFullYear(), 4) + pad(object.getUTCMonth(), 2) + pad(object.getUTCDate(), 2) + pad(object.getUTCHours(), 2) + pad(object.getUTCMinutes(), 2) + pad(object.getUTCSeconds(), 2) + 'Z)';
    } else if (Array.isArray(object)) {
      items = ((function() {
        var _j, _len, _results;
        _results = [];
        for (_j = 0, _len = object.length; _j < _len; _j++) {
          e = object[_j];
          _results.push(PDFObject.convert(e));
        }
        return _results;
      })()).join(' ');
      return '[' + items + ']';
    } else if ({}.toString.call(object) === '[object Object]') {
      out = ['<<'];
      for (key in object) {
        val = object[key];
        out.push('/' + key + ' ' + PDFObject.convert(val));
      }
      out.push('>>');
      return out.join('\n');
    } else {
      return '' + object;
    }
  };

  return PDFObject;

})();

module.exports = PDFObject;

PDFReference = _dereq_('./reference');


}).call(this,_dereq_("buffer").Buffer)
},{"./reference":35,"buffer":51}],33:[function(_dereq_,module,exports){

/*
PDFPage - represents a single page in the PDF document
By Devon Govett
 */
var PDFPage;

PDFPage = (function() {
  var DEFAULT_MARGINS, SIZES;

  function PDFPage(document, options) {
    var dimensions;
    this.document = document;
    if (options == null) {
      options = {};
    }
    this.size = options.size || 'letter';
    this.layout = options.layout || 'portrait';
    if (typeof options.margin === 'number') {
      this.margins = {
        top: options.margin,
        left: options.margin,
        bottom: options.margin,
        right: options.margin
      };
    } else {
      this.margins = options.margins || DEFAULT_MARGINS;
    }
    dimensions = Array.isArray(this.size) ? this.size : SIZES[this.size.toUpperCase()];
    this.width = dimensions[this.layout === 'portrait' ? 0 : 1];
    this.height = dimensions[this.layout === 'portrait' ? 1 : 0];
    this.content = this.document.ref();
    this.resources = this.document.ref({
      ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI']
    });
    Object.defineProperties(this, {
      fonts: {
        get: (function(_this) {
          return function() {
            var _base;
            return (_base = _this.resources.data).Font != null ? _base.Font : _base.Font = {};
          };
        })(this)
      },
      xobjects: {
        get: (function(_this) {
          return function() {
            var _base;
            return (_base = _this.resources.data).XObject != null ? _base.XObject : _base.XObject = {};
          };
        })(this)
      },
      ext_gstates: {
        get: (function(_this) {
          return function() {
            var _base;
            return (_base = _this.resources.data).ExtGState != null ? _base.ExtGState : _base.ExtGState = {};
          };
        })(this)
      },
      patterns: {
        get: (function(_this) {
          return function() {
            var _base;
            return (_base = _this.resources.data).Pattern != null ? _base.Pattern : _base.Pattern = {};
          };
        })(this)
      },
      annotations: {
        get: (function(_this) {
          return function() {
            var _base;
            return (_base = _this.dictionary.data).Annots != null ? _base.Annots : _base.Annots = [];
          };
        })(this)
      }
    });
    this.dictionary = this.document.ref({
      Type: 'Page',
      Parent: this.document._root.data.Pages,
      MediaBox: [0, 0, this.width, this.height],
      Contents: this.content,
      Resources: this.resources
    });
  }

  PDFPage.prototype.maxY = function() {
    return this.height - this.margins.bottom;
  };

  PDFPage.prototype.write = function(chunk) {
    return this.content.write(chunk);
  };

  PDFPage.prototype.end = function() {
    this.dictionary.end();
    this.resources.end();
    return this.content.end();
  };

  DEFAULT_MARGINS = {
    top: 72,
    left: 72,
    bottom: 72,
    right: 72
  };

  SIZES = {
    '4A0': [4767.87, 6740.79],
    '2A0': [3370.39, 4767.87],
    A0: [2383.94, 3370.39],
    A1: [1683.78, 2383.94],
    A2: [1190.55, 1683.78],
    A3: [841.89, 1190.55],
    A4: [595.28, 841.89],
    A5: [419.53, 595.28],
    A6: [297.64, 419.53],
    A7: [209.76, 297.64],
    A8: [147.40, 209.76],
    A9: [104.88, 147.40],
    A10: [73.70, 104.88],
    B0: [2834.65, 4008.19],
    B1: [2004.09, 2834.65],
    B2: [1417.32, 2004.09],
    B3: [1000.63, 1417.32],
    B4: [708.66, 1000.63],
    B5: [498.90, 708.66],
    B6: [354.33, 498.90],
    B7: [249.45, 354.33],
    B8: [175.75, 249.45],
    B9: [124.72, 175.75],
    B10: [87.87, 124.72],
    C0: [2599.37, 3676.54],
    C1: [1836.85, 2599.37],
    C2: [1298.27, 1836.85],
    C3: [918.43, 1298.27],
    C4: [649.13, 918.43],
    C5: [459.21, 649.13],
    C6: [323.15, 459.21],
    C7: [229.61, 323.15],
    C8: [161.57, 229.61],
    C9: [113.39, 161.57],
    C10: [79.37, 113.39],
    RA0: [2437.80, 3458.27],
    RA1: [1729.13, 2437.80],
    RA2: [1218.90, 1729.13],
    RA3: [864.57, 1218.90],
    RA4: [609.45, 864.57],
    SRA0: [2551.18, 3628.35],
    SRA1: [1814.17, 2551.18],
    SRA2: [1275.59, 1814.17],
    SRA3: [907.09, 1275.59],
    SRA4: [637.80, 907.09],
    EXECUTIVE: [521.86, 756.00],
    FOLIO: [612.00, 936.00],
    LEGAL: [612.00, 1008.00],
    LETTER: [612.00, 792.00],
    TABLOID: [792.00, 1224.00]
  };

  return PDFPage;

})();

module.exports = PDFPage;


},{}],34:[function(_dereq_,module,exports){
var SVGPath;

SVGPath = (function() {
  var apply, arcToSegments, cx, cy, parameters, parse, px, py, runners, segmentToBezier, solveArc, sx, sy;

  function SVGPath() {}

  SVGPath.apply = function(doc, path) {
    var commands;
    commands = parse(path);
    return apply(commands, doc);
  };

  parameters = {
    A: 7,
    a: 7,
    C: 6,
    c: 6,
    H: 1,
    h: 1,
    L: 2,
    l: 2,
    M: 2,
    m: 2,
    Q: 4,
    q: 4,
    S: 4,
    s: 4,
    T: 2,
    t: 2,
    V: 1,
    v: 1,
    Z: 0,
    z: 0
  };

  parse = function(path) {
    var args, c, cmd, curArg, foundDecimal, params, ret, _i, _len;
    ret = [];
    args = [];
    curArg = "";
    foundDecimal = false;
    params = 0;
    for (_i = 0, _len = path.length; _i < _len; _i++) {
      c = path[_i];
      if (parameters[c] != null) {
        params = parameters[c];
        if (cmd) {
          if (curArg.length > 0) {
            args[args.length] = +curArg;
          }
          ret[ret.length] = {
            cmd: cmd,
            args: args
          };
          args = [];
          curArg = "";
          foundDecimal = false;
        }
        cmd = c;
      } else if ((c === " " || c === ",") || (c === "-" && curArg.length > 0 && curArg[curArg.length - 1] !== 'e') || (c === "." && foundDecimal)) {
        if (curArg.length === 0) {
          continue;
        }
        if (args.length === params) {
          ret[ret.length] = {
            cmd: cmd,
            args: args
          };
          args = [+curArg];
          if (cmd === "M") {
            cmd = "L";
          }
          if (cmd === "m") {
            cmd = "l";
          }
        } else {
          args[args.length] = +curArg;
        }
        foundDecimal = c === ".";
        curArg = c === '-' || c === '.' ? c : '';
      } else {
        curArg += c;
        if (c === '.') {
          foundDecimal = true;
        }
      }
    }
    if (curArg.length > 0) {
      if (args.length === params) {
        ret[ret.length] = {
          cmd: cmd,
          args: args
        };
        args = [+curArg];
        if (cmd === "M") {
          cmd = "L";
        }
        if (cmd === "m") {
          cmd = "l";
        }
      } else {
        args[args.length] = +curArg;
      }
    }
    ret[ret.length] = {
      cmd: cmd,
      args: args
    };
    return ret;
  };

  cx = cy = px = py = sx = sy = 0;

  apply = function(commands, doc) {
    var c, i, _i, _len, _name;
    cx = cy = px = py = sx = sy = 0;
    for (i = _i = 0, _len = commands.length; _i < _len; i = ++_i) {
      c = commands[i];
      if (typeof runners[_name = c.cmd] === "function") {
        runners[_name](doc, c.args);
      }
    }
    return cx = cy = px = py = 0;
  };

  runners = {
    M: function(doc, a) {
      cx = a[0];
      cy = a[1];
      px = py = null;
      sx = cx;
      sy = cy;
      return doc.moveTo(cx, cy);
    },
    m: function(doc, a) {
      cx += a[0];
      cy += a[1];
      px = py = null;
      sx = cx;
      sy = cy;
      return doc.moveTo(cx, cy);
    },
    C: function(doc, a) {
      cx = a[4];
      cy = a[5];
      px = a[2];
      py = a[3];
      return doc.bezierCurveTo.apply(doc, a);
    },
    c: function(doc, a) {
      doc.bezierCurveTo(a[0] + cx, a[1] + cy, a[2] + cx, a[3] + cy, a[4] + cx, a[5] + cy);
      px = cx + a[2];
      py = cy + a[3];
      cx += a[4];
      return cy += a[5];
    },
    S: function(doc, a) {
      if (px === null) {
        px = cx;
        py = cy;
      }
      doc.bezierCurveTo(cx - (px - cx), cy - (py - cy), a[0], a[1], a[2], a[3]);
      px = a[0];
      py = a[1];
      cx = a[2];
      return cy = a[3];
    },
    s: function(doc, a) {
      if (px === null) {
        px = cx;
        py = cy;
      }
      doc.bezierCurveTo(cx - (px - cx), cy - (py - cy), cx + a[0], cy + a[1], cx + a[2], cy + a[3]);
      px = cx + a[0];
      py = cy + a[1];
      cx += a[2];
      return cy += a[3];
    },
    Q: function(doc, a) {
      px = a[0];
      py = a[1];
      cx = a[2];
      cy = a[3];
      return doc.quadraticCurveTo(a[0], a[1], cx, cy);
    },
    q: function(doc, a) {
      doc.quadraticCurveTo(a[0] + cx, a[1] + cy, a[2] + cx, a[3] + cy);
      px = cx + a[0];
      py = cy + a[1];
      cx += a[2];
      return cy += a[3];
    },
    T: function(doc, a) {
      if (px === null) {
        px = cx;
        py = cy;
      } else {
        px = cx - (px - cx);
        py = cy - (py - cy);
      }
      doc.quadraticCurveTo(px, py, a[0], a[1]);
      px = cx - (px - cx);
      py = cy - (py - cy);
      cx = a[0];
      return cy = a[1];
    },
    t: function(doc, a) {
      if (px === null) {
        px = cx;
        py = cy;
      } else {
        px = cx - (px - cx);
        py = cy - (py - cy);
      }
      doc.quadraticCurveTo(px, py, cx + a[0], cy + a[1]);
      cx += a[0];
      return cy += a[1];
    },
    A: function(doc, a) {
      solveArc(doc, cx, cy, a);
      cx = a[5];
      return cy = a[6];
    },
    a: function(doc, a) {
      a[5] += cx;
      a[6] += cy;
      solveArc(doc, cx, cy, a);
      cx = a[5];
      return cy = a[6];
    },
    L: function(doc, a) {
      cx = a[0];
      cy = a[1];
      px = py = null;
      return doc.lineTo(cx, cy);
    },
    l: function(doc, a) {
      cx += a[0];
      cy += a[1];
      px = py = null;
      return doc.lineTo(cx, cy);
    },
    H: function(doc, a) {
      cx = a[0];
      px = py = null;
      return doc.lineTo(cx, cy);
    },
    h: function(doc, a) {
      cx += a[0];
      px = py = null;
      return doc.lineTo(cx, cy);
    },
    V: function(doc, a) {
      cy = a[0];
      px = py = null;
      return doc.lineTo(cx, cy);
    },
    v: function(doc, a) {
      cy += a[0];
      px = py = null;
      return doc.lineTo(cx, cy);
    },
    Z: function(doc) {
      doc.closePath();
      cx = sx;
      return cy = sy;
    },
    z: function(doc) {
      doc.closePath();
      cx = sx;
      return cy = sy;
    }
  };

  solveArc = function(doc, x, y, coords) {
    var bez, ex, ey, large, rot, rx, ry, seg, segs, sweep, _i, _len, _results;
    rx = coords[0], ry = coords[1], rot = coords[2], large = coords[3], sweep = coords[4], ex = coords[5], ey = coords[6];
    segs = arcToSegments(ex, ey, rx, ry, large, sweep, rot, x, y);
    _results = [];
    for (_i = 0, _len = segs.length; _i < _len; _i++) {
      seg = segs[_i];
      bez = segmentToBezier.apply(null, seg);
      _results.push(doc.bezierCurveTo.apply(doc, bez));
    }
    return _results;
  };

  arcToSegments = function(x, y, rx, ry, large, sweep, rotateX, ox, oy) {
    var a00, a01, a10, a11, cos_th, d, i, pl, result, segments, sfactor, sfactor_sq, sin_th, th, th0, th1, th2, th3, th_arc, x0, x1, xc, y0, y1, yc, _i;
    th = rotateX * (Math.PI / 180);
    sin_th = Math.sin(th);
    cos_th = Math.cos(th);
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    px = cos_th * (ox - x) * 0.5 + sin_th * (oy - y) * 0.5;
    py = cos_th * (oy - y) * 0.5 - sin_th * (ox - x) * 0.5;
    pl = (px * px) / (rx * rx) + (py * py) / (ry * ry);
    if (pl > 1) {
      pl = Math.sqrt(pl);
      rx *= pl;
      ry *= pl;
    }
    a00 = cos_th / rx;
    a01 = sin_th / rx;
    a10 = (-sin_th) / ry;
    a11 = cos_th / ry;
    x0 = a00 * ox + a01 * oy;
    y0 = a10 * ox + a11 * oy;
    x1 = a00 * x + a01 * y;
    y1 = a10 * x + a11 * y;
    d = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
    sfactor_sq = 1 / d - 0.25;
    if (sfactor_sq < 0) {
      sfactor_sq = 0;
    }
    sfactor = Math.sqrt(sfactor_sq);
    if (sweep === large) {
      sfactor = -sfactor;
    }
    xc = 0.5 * (x0 + x1) - sfactor * (y1 - y0);
    yc = 0.5 * (y0 + y1) + sfactor * (x1 - x0);
    th0 = Math.atan2(y0 - yc, x0 - xc);
    th1 = Math.atan2(y1 - yc, x1 - xc);
    th_arc = th1 - th0;
    if (th_arc < 0 && sweep === 1) {
      th_arc += 2 * Math.PI;
    } else if (th_arc > 0 && sweep === 0) {
      th_arc -= 2 * Math.PI;
    }
    segments = Math.ceil(Math.abs(th_arc / (Math.PI * 0.5 + 0.001)));
    result = [];
    for (i = _i = 0; 0 <= segments ? _i < segments : _i > segments; i = 0 <= segments ? ++_i : --_i) {
      th2 = th0 + i * th_arc / segments;
      th3 = th0 + (i + 1) * th_arc / segments;
      result[i] = [xc, yc, th2, th3, rx, ry, sin_th, cos_th];
    }
    return result;
  };

  segmentToBezier = function(cx, cy, th0, th1, rx, ry, sin_th, cos_th) {
    var a00, a01, a10, a11, t, th_half, x1, x2, x3, y1, y2, y3;
    a00 = cos_th * rx;
    a01 = -sin_th * ry;
    a10 = sin_th * rx;
    a11 = cos_th * ry;
    th_half = 0.5 * (th1 - th0);
    t = (8 / 3) * Math.sin(th_half * 0.5) * Math.sin(th_half * 0.5) / Math.sin(th_half);
    x1 = cx + Math.cos(th0) - t * Math.sin(th0);
    y1 = cy + Math.sin(th0) + t * Math.cos(th0);
    x3 = cx + Math.cos(th1);
    y3 = cy + Math.sin(th1);
    x2 = x3 + t * Math.sin(th1);
    y2 = y3 - t * Math.cos(th1);
    return [a00 * x1 + a01 * y1, a10 * x1 + a11 * y1, a00 * x2 + a01 * y2, a10 * x2 + a11 * y2, a00 * x3 + a01 * y3, a10 * x3 + a11 * y3];
  };

  return SVGPath;

})();

module.exports = SVGPath;


},{}],35:[function(_dereq_,module,exports){
(function (Buffer){

/*
PDFReference - represents a reference to another object in the PDF object heirarchy
By Devon Govett
 */
var PDFObject, PDFReference, zlib,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

zlib = _dereq_('zlib');

PDFReference = (function() {
  function PDFReference(document, id, data) {
    this.document = document;
    this.id = id;
    this.data = data != null ? data : {};
    this.finalize = __bind(this.finalize, this);
    this.gen = 0;
    this.deflate = null;
    this.compress = this.document.compress && !this.data.Filter;
    this.uncompressedLength = 0;
    this.chunks = [];
  }

  PDFReference.prototype.initDeflate = function() {
    this.data.Filter = 'FlateDecode';
    this.deflate = zlib.createDeflate();
    this.deflate.on('data', (function(_this) {
      return function(chunk) {
        _this.chunks.push(chunk);
        return _this.data.Length += chunk.length;
      };
    })(this));
    return this.deflate.on('end', this.finalize);
  };

  PDFReference.prototype.write = function(chunk) {
    var _base;
    if (!Buffer.isBuffer(chunk)) {
      chunk = new Buffer(chunk + '\n', 'binary');
    }
    this.uncompressedLength += chunk.length;
    if ((_base = this.data).Length == null) {
      _base.Length = 0;
    }
    if (this.compress) {
      if (!this.deflate) {
        this.initDeflate();
      }
      return this.deflate.write(chunk);
    } else {
      this.chunks.push(chunk);
      return this.data.Length += chunk.length;
    }
  };

  PDFReference.prototype.end = function(chunk) {
    if (typeof chunk === 'string' || Buffer.isBuffer(chunk)) {
      this.write(chunk);
    }
    if (this.deflate) {
      return this.deflate.end();
    } else {
      return this.finalize();
    }
  };

  PDFReference.prototype.finalize = function() {
    var chunk, _i, _len, _ref;
    this.offset = this.document._offset;
    this.document._write("" + this.id + " " + this.gen + " obj");
    this.document._write(PDFObject.convert(this.data));
    if (this.chunks.length) {
      this.document._write('stream');
      _ref = this.chunks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        chunk = _ref[_i];
        this.document._write(chunk);
      }
      this.chunks.length = 0;
      this.document._write('\nendstream');
    }
    this.document._write('endobj');
    return this.document._refEnd(this);
  };

  PDFReference.prototype.toString = function() {
    return "" + this.id + " " + this.gen + " R";
  };

  return PDFReference;

})();

module.exports = PDFReference;

PDFObject = _dereq_('./object');


}).call(this,_dereq_("buffer").Buffer)
},{"./object":32,"buffer":51,"zlib":50}],36:[function(_dereq_,module,exports){

},{}],37:[function(_dereq_,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = _dereq_('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":66}],38:[function(_dereq_,module,exports){
'use strict';


var TYPED_OK =  (typeof Uint8Array !== 'undefined') &&
                (typeof Uint16Array !== 'undefined') &&
                (typeof Int32Array !== 'undefined');


exports.assign = function (obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    var source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (var p in source) {
      if (source.hasOwnProperty(p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};


// reduce buffer size, avoiding mem copy
exports.shrinkBuf = function (buf, size) {
  if (buf.length === size) { return buf; }
  if (buf.subarray) { return buf.subarray(0, size); }
  buf.length = size;
  return buf;
};


var fnTyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    if (src.subarray && dest.subarray) {
      dest.set(src.subarray(src_offs, src_offs+len), dest_offs);
      return;
    }
    // Fallback to ordinary array
    for (var i=0; i<len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function(chunks) {
    var i, l, len, pos, chunk, result;

    // calculate data length
    len = 0;
    for (i=0, l=chunks.length; i<l; i++) {
      len += chunks[i].length;
    }

    // join chunks
    result = new Uint8Array(len);
    pos = 0;
    for (i=0, l=chunks.length; i<l; i++) {
      chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }

    return result;
  }
};

var fnUntyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    for (var i=0; i<len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function(chunks) {
    return [].concat.apply([], chunks);
  }
};


// Enable/Disable typed arrays use, for testing
//
exports.setTyped = function (on) {
  if (on) {
    exports.Buf8  = Uint8Array;
    exports.Buf16 = Uint16Array;
    exports.Buf32 = Int32Array;
    exports.assign(exports, fnTyped);
  } else {
    exports.Buf8  = Array;
    exports.Buf16 = Array;
    exports.Buf32 = Array;
    exports.assign(exports, fnUntyped);
  }
};

exports.setTyped(TYPED_OK);

},{}],39:[function(_dereq_,module,exports){
'use strict';

// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It doesn't worth to make additional optimizationa as in original.
// Small size is preferable.

function adler32(adler, buf, len, pos) {
  var s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
}


module.exports = adler32;

},{}],40:[function(_dereq_,module,exports){
module.exports = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH:         0,
  Z_PARTIAL_FLUSH:    1,
  Z_SYNC_FLUSH:       2,
  Z_FULL_FLUSH:       3,
  Z_FINISH:           4,
  Z_BLOCK:            5,
  Z_TREES:            6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK:               0,
  Z_STREAM_END:       1,
  Z_NEED_DICT:        2,
  Z_ERRNO:           -1,
  Z_STREAM_ERROR:    -2,
  Z_DATA_ERROR:      -3,
  //Z_MEM_ERROR:     -4,
  Z_BUF_ERROR:       -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION:         0,
  Z_BEST_SPEED:             1,
  Z_BEST_COMPRESSION:       9,
  Z_DEFAULT_COMPRESSION:   -1,


  Z_FILTERED:               1,
  Z_HUFFMAN_ONLY:           2,
  Z_RLE:                    3,
  Z_FIXED:                  4,
  Z_DEFAULT_STRATEGY:       0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY:                 0,
  Z_TEXT:                   1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN:                2,

  /* The deflate compression method */
  Z_DEFLATED:               8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};

},{}],41:[function(_dereq_,module,exports){
'use strict';

// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.


// Use ordinary array, since untyped makes no boost here
function makeTable() {
  var c, table = [];

  for (var n =0; n < 256; n++) {
    c = n;
    for (var k =0; k < 8; k++) {
      c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
}

// Create table on load. Just 255 signed longs. Not a problem.
var crcTable = makeTable();


function crc32(crc, buf, len, pos) {
  var t = crcTable,
      end = pos + len;

  crc = crc ^ (-1);

  for (var i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
}


module.exports = crc32;

},{}],42:[function(_dereq_,module,exports){
'use strict';

var utils   = _dereq_('../utils/common');
var trees   = _dereq_('./trees');
var adler32 = _dereq_('./adler32');
var crc32   = _dereq_('./crc32');
var msg   = _dereq_('./messages');

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
var Z_NO_FLUSH      = 0;
var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
var Z_FULL_FLUSH    = 3;
var Z_FINISH        = 4;
var Z_BLOCK         = 5;
//var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK            = 0;
var Z_STREAM_END    = 1;
//var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR  = -2;
var Z_DATA_ERROR    = -3;
//var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR     = -5;
//var Z_VERSION_ERROR = -6;


/* compression levels */
//var Z_NO_COMPRESSION      = 0;
//var Z_BEST_SPEED          = 1;
//var Z_BEST_COMPRESSION    = 9;
var Z_DEFAULT_COMPRESSION = -1;


var Z_FILTERED            = 1;
var Z_HUFFMAN_ONLY        = 2;
var Z_RLE                 = 3;
var Z_FIXED               = 4;
var Z_DEFAULT_STRATEGY    = 0;

/* Possible values of the data_type field (though see inflate()) */
//var Z_BINARY              = 0;
//var Z_TEXT                = 1;
//var Z_ASCII               = 1; // = Z_TEXT
var Z_UNKNOWN             = 2;


/* The deflate compression method */
var Z_DEFLATED  = 8;

/*============================================================================*/


var MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_MEM_LEVEL = 8;


var LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
var LITERALS      = 256;
/* number of literal bytes 0..255 */
var L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
var D_CODES       = 30;
/* number of distance codes */
var BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
var HEAP_SIZE     = 2*L_CODES + 1;
/* maximum heap size */
var MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

var MIN_MATCH = 3;
var MAX_MATCH = 258;
var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

var PRESET_DICT = 0x20;

var INIT_STATE = 42;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;

var BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
var BS_BLOCK_DONE     = 2; /* block flush performed */
var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
var BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

function err(strm, errorCode) {
  strm.msg = msg[errorCode];
  return errorCode;
}

function rank(f) {
  return ((f) << 1) - ((f) > 4 ? 9 : 0);
}

function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output goes
 * through this function so some applications may wish to modify it
 * to avoid allocating a large strm->output buffer and copying into it.
 * (See also read_buf()).
 */
function flush_pending(strm) {
  var s = strm.state;

  //_tr_flush_bits(s);
  var len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) { return; }

  utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
  strm.next_out += len;
  s.pending_out += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
}


function flush_block_only (s, last) {
  trees._tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
}


function put_byte(s, b) {
  s.pending_buf[s.pending++] = b;
}


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
function putShortMSB(s, b) {
//  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
}


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
function read_buf(strm, buf, start, size) {
  var len = strm.avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  strm.avail_in -= len;

  utils.arraySet(buf, strm.input, strm.next_in, len, start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32(strm.adler, buf, len, start);
  }

  else if (strm.state.wrap === 2) {
    strm.adler = crc32(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
}


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
function longest_match(s, cur_match) {
  var chain_length = s.max_chain_length;      /* max hash chain length */
  var scan = s.strstart; /* current string */
  var match;                       /* matched string */
  var len;                           /* length of current match */
  var best_len = s.prev_length;              /* best match length so far */
  var nice_match = s.nice_match;             /* stop if match long enough */
  var limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

  var _win = s.window; // shortcut

  var wmask = s.w_mask;
  var prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  var strend = s.strstart + MAX_MATCH;
  var scan_end1  = _win[scan + best_len - 1];
  var scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
}


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
function fill_window(s) {
  var _w_size = s.w_size;
  var p, n, m, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;

      /* Slide the hash table (could be avoided with 32 bit values
       at the expense of memory usage). We slide even when level == 0
       to keep the hash table consistent if we switch back to level > 0
       later. (Using level 0 permanently is not an optimal usage of
       zlib, so we don't care about this pathological case.)
       */

      n = s.hash_size;
      p = n;
      do {
        m = s.head[--p];
        s.head[p] = (m >= _w_size ? m - _w_size : 0);
      } while (--n);

      n = _w_size;
      p = n;
      do {
        m = s.prev[--p];
        s.prev[p] = (m >= _w_size ? m - _w_size : 0);
        /* If n is not on any hash chain, prev[n] is garbage but
         * its value will never be used.
         */
      } while (--n);

      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask;
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH-1]) & s.hash_mask;

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    var curr = s.strstart + s.lookahead;
//    var init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
}

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 * This function does not insert new strings in the dictionary since
 * uncompressible data is probably not useful. This function is used
 * only for the level=0 compression option.
 * NOTE: this function should be optimized to avoid extra copying from
 * window to pending_buf.
 */
function deflate_stored(s, flush) {
  /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
   * to pending_buf_size, and each stored block has a 5 byte header:
   */
  var max_block_size = 0xffff;

  if (max_block_size > s.pending_buf_size - 5) {
    max_block_size = s.pending_buf_size - 5;
  }

  /* Copy as much as possible from input to output: */
  for (;;) {
    /* Fill the window as much as possible: */
    if (s.lookahead <= 1) {

      //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
      //  s->block_start >= (long)s->w_size, "slide too late");
//      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
//        s.block_start >= s.w_size)) {
//        throw  new Error("slide too late");
//      }

      fill_window(s);
      if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }

      if (s.lookahead === 0) {
        break;
      }
      /* flush the current block */
    }
    //Assert(s->block_start >= 0L, "block gone");
//    if (s.block_start < 0) throw new Error("block gone");

    s.strstart += s.lookahead;
    s.lookahead = 0;

    /* Emit a stored block if pending_buf will be full: */
    var max_start = s.block_start + max_block_size;

    if (s.strstart === 0 || s.strstart >= max_start) {
      /* strstart == 0 is possible when wraparound on 16-bit machine */
      s.lookahead = s.strstart - max_start;
      s.strstart = max_start;
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/


    }
    /* Flush if we may have to slide, otherwise block_start may become
     * negative and the data will be gone:
     */
    if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }

  s.insert = 0;

  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }

  if (s.strstart > s.block_start) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_NEED_MORE;
}

/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
function deflate_fast(s, flush) {
  var hash_head;        /* head of the hash chain */
  var bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else
      {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask;

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH-1)) ? s.strstart : MIN_MATCH-1);
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
function deflate_slow(s, flush) {
  var hash_head;          /* head of hash chain */
  var bflush;              /* set if current block must be flushed */

  var max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH-1;

    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size-MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH-1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = trees._tr_tally(s, s.strstart - 1- s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length-1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH-1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart-1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart-1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH-1 ? s.strstart : MIN_MATCH-1;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
}


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
function deflate_rle(s, flush) {
  var bflush;            /* set if current block must be flushed */
  var prev;              /* byte at distance one to match */
  var scan, strend;      /* scan goes up to strend for length of run */

  var _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
function deflate_huff(s, flush) {
  var bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
}

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
var Config = function (good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
};

var configuration_table;

configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
function lm_init(s) {
  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
}


function DeflateState() {
  this.strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this.pending_buf = null;      /* output still pending */
  this.pending_buf_size = 0;  /* size of pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null;         /* gzip header information to write */
  this.gzindex = 0;           /* where in extra, name, or comment */
  this.method = Z_DEFLATED; /* can only be DEFLATED */
  this.last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this.ins_h = 0;       /* hash index of string to be inserted */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this.match_available = 0;   /* set if previous match exists */
  this.strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this.lookahead = 0;         /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree  = new utils.Buf16(HEAP_SIZE * 2);
  this.dyn_dtree  = new utils.Buf16((2*D_CODES+1) * 2);
  this.bl_tree    = new utils.Buf16((2*BL_CODES+1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new utils.Buf16(MAX_BITS+1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new utils.Buf16(2*L_CODES+1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new utils.Buf16(2*L_CODES+1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.l_buf = 0;          /* buffer index for literals or lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.last_lit = 0;      /* running index in l_buf */

  this.d_buf = 0;
  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
   * the same number of elements. To use different lengths, an extra flag
   * array would be necessary.
   */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


function deflateResetKeep(strm) {
  var s;

  if (!strm || !strm.state) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = Z_NO_FLUSH;
  trees._tr_init(s);
  return Z_OK;
}


function deflateReset(strm) {
  var ret = deflateResetKeep(strm);
  if (ret === Z_OK) {
    lm_init(strm.state);
  }
  return ret;
}


function deflateSetHeader(strm, head) {
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  if (strm.state.wrap !== 2) { return Z_STREAM_ERROR; }
  strm.state.gzhead = head;
  return Z_OK;
}


function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR;
  }
  var wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  }

  else if (windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED) {
    return err(strm, Z_STREAM_ERROR);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  var s = new DeflateState();

  strm.state = s;
  s.strm = strm;

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new utils.Buf8(s.w_size * 2);
  s.head = new utils.Buf16(s.hash_size);
  s.prev = new utils.Buf16(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  s.pending_buf_size = s.lit_bufsize * 4;
  s.pending_buf = new utils.Buf8(s.pending_buf_size);

  s.d_buf = s.lit_bufsize >> 1;
  s.l_buf = (1 + 2) * s.lit_bufsize;

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
}

function deflateInit(strm, level) {
  return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
}


function deflate(strm, flush) {
  var old_flush, s;
  var beg, val; // for gzip header write only

  if (!strm || !strm.state ||
    flush > Z_BLOCK || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
  }

  s = strm.state;

  if (!strm.output ||
      (!strm.input && strm.avail_in !== 0) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR);
  }

  s.strm = strm; /* just in case */
  old_flush = s.last_flush;
  s.last_flush = flush;

  /* Write the header */
  if (s.status === INIT_STATE) {

    if (s.wrap === 2) { // GZIP header
      strm.adler = 0;  //crc32(0L, Z_NULL, 0);
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) { // s->gzhead == Z_NULL
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 :
                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                     4 : 0));
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
      }
      else {
        put_byte(s, (s.gzhead.text ? 1 : 0) +
                    (s.gzhead.hcrc ? 2 : 0) +
                    (!s.gzhead.extra ? 0 : 4) +
                    (!s.gzhead.name ? 0 : 8) +
                    (!s.gzhead.comment ? 0 : 16)
                );
        put_byte(s, s.gzhead.time & 0xff);
        put_byte(s, (s.gzhead.time >> 8) & 0xff);
        put_byte(s, (s.gzhead.time >> 16) & 0xff);
        put_byte(s, (s.gzhead.time >> 24) & 0xff);
        put_byte(s, s.level === 9 ? 2 :
                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                     4 : 0));
        put_byte(s, s.gzhead.os & 0xff);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 0xff);
          put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    }
    else // DEFLATE header
    {
      var header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
      var level_flags = -1;

      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= (level_flags << 6);
      if (s.strstart !== 0) { header |= PRESET_DICT; }
      header += 31 - (header % 31);

      s.status = BUSY_STATE;
      putShortMSB(s, header);

      /* Save the adler32 of the preset dictionary: */
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 0xffff);
      }
      strm.adler = 1; // adler32(0L, Z_NULL, 0);
    }
  }

//#ifdef GZIP
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */

      while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            break;
          }
        }
        put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
        s.gzindex++;
      }
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (s.gzindex === s.gzhead.extra.length) {
        s.gzindex = 0;
        s.status = NAME_STATE;
      }
    }
    else {
      s.status = NAME_STATE;
    }
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.gzindex = 0;
        s.status = COMMENT_STATE;
      }
    }
    else {
      s.status = COMMENT_STATE;
    }
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment/* != Z_NULL*/) {
      beg = s.pending;  /* start of bytes to update crc */
      //int val;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.status = HCRC_STATE;
      }
    }
    else {
      s.status = HCRC_STATE;
    }
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
      }
      if (s.pending + 2 <= s.pending_buf_size) {
        put_byte(s, strm.adler & 0xff);
        put_byte(s, (strm.adler >> 8) & 0xff);
        strm.adler = 0; //crc32(0L, Z_NULL, 0);
        s.status = BUSY_STATE;
      }
    }
    else {
      s.status = BUSY_STATE;
    }
  }
//#endif

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH) {
    return err(strm, Z_BUF_ERROR);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR);
  }

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
    var bstate = (s.strategy === Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
      (s.strategy === Z_RLE ? deflate_rle(s, flush) :
        configuration_table[s.level].func(s, flush));

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        trees._tr_align(s);
      }
      else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */

        trees._tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK;
      }
    }
  }
  //Assert(strm->avail_out > 0, "bug2");
  //if (strm.avail_out <= 0) { throw new Error("bug2");}

  if (flush !== Z_FINISH) { return Z_OK; }
  if (s.wrap <= 0) { return Z_STREAM_END; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK : Z_STREAM_END;
}

function deflateEnd(strm) {
  var status;

  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
    return Z_STREAM_ERROR;
  }

  status = strm.state.status;
  if (status !== INIT_STATE &&
    status !== EXTRA_STATE &&
    status !== NAME_STATE &&
    status !== COMMENT_STATE &&
    status !== HCRC_STATE &&
    status !== BUSY_STATE &&
    status !== FINISH_STATE
  ) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
}

/* =========================================================================
 * Copy the source state to the destination state
 */
//function deflateCopy(dest, source) {
//
//}

exports.deflateInit = deflateInit;
exports.deflateInit2 = deflateInit2;
exports.deflateReset = deflateReset;
exports.deflateResetKeep = deflateResetKeep;
exports.deflateSetHeader = deflateSetHeader;
exports.deflate = deflate;
exports.deflateEnd = deflateEnd;
exports.deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
exports.deflateBound = deflateBound;
exports.deflateCopy = deflateCopy;
exports.deflateSetDictionary = deflateSetDictionary;
exports.deflateParams = deflateParams;
exports.deflatePending = deflatePending;
exports.deflatePrime = deflatePrime;
exports.deflateTune = deflateTune;
*/

},{"../utils/common":38,"./adler32":39,"./crc32":41,"./messages":46,"./trees":47}],43:[function(_dereq_,module,exports){
'use strict';

// See state defs from inflate.js
var BAD = 30;       /* got a data error -- remain here until reset */
var TYPE = 12;      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
module.exports = function inflate_fast(strm, start) {
  var state;
  var _in;                    /* local strm.input */
  var last;                   /* have enough input while in < last */
  var _out;                   /* local strm.output */
  var beg;                    /* inflate()'s initial strm.output */
  var end;                    /* while out < end, enough space available */
//#ifdef INFLATE_STRICT
  var dmax;                   /* maximum distance from zlib header */
//#endif
  var wsize;                  /* window size or zero if not using window */
  var whave;                  /* valid bytes in the window */
  var wnext;                  /* window write index */
  var window;                 /* allocated sliding window, if wsize != 0 */
  var hold;                   /* local strm.hold */
  var bits;                   /* local strm.bits */
  var lcode;                  /* local strm.lencode */
  var dcode;                  /* local strm.distcode */
  var lmask;                  /* mask for first level of length codes */
  var dmask;                  /* mask for first level of distance codes */
  var here;                   /* retrieved table entry */
  var op;                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
  var len;                    /* match length, unused bytes */
  var dist;                   /* match distance */
  var from;                   /* where to copy match from */
  var from_source;


  var input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
//#ifdef INFLATE_STRICT
  dmax = state.dmax;
//#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;


  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = (here >>> 16) & 0xff/*here.op*/;
      if (op === 0) {                          /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/*here.val*/;
      }
      else if (op & 16) {                     /* length base */
        len = here & 0xffff/*here.val*/;
        op &= 15;                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/*here.val*/;
            op &= 15;                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & ((1 << op) - 1);
//#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break top;
            }
//#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg;                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op;               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD;
                  break top;
                }

// (!) This block is disabled in zlib defailts,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
//#endif
              }
              from = 0; // window index
              from_source = window;
              if (wnext === 0) {           /* very common case */
                from += wsize - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {         /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {  /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = window[from++];
                    } while (--op);
                    from = _out - dist;      /* rest from output */
                    from_source = output;
                  }
                }
              }
              else {                      /* contiguous in window */
                from += wnext - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            }
            else {
              from = _out - dist;          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          }
          else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dodist;
          }
          else {
            strm.msg = 'invalid distance code';
            state.mode = BAD;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      }
      else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
        continue dolen;
      }
      else if (op & 32) {                     /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE;
        break top;
      }
      else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
  state.hold = hold;
  state.bits = bits;
  return;
};

},{}],44:[function(_dereq_,module,exports){
'use strict';


var utils = _dereq_('../utils/common');
var adler32 = _dereq_('./adler32');
var crc32   = _dereq_('./crc32');
var inflate_fast = _dereq_('./inffast');
var inflate_table = _dereq_('./inftrees');

var CODES = 0;
var LENS = 1;
var DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/


/* Allowed flush values; see deflate() and inflate() below for details */
//var Z_NO_FLUSH      = 0;
//var Z_PARTIAL_FLUSH = 1;
//var Z_SYNC_FLUSH    = 2;
//var Z_FULL_FLUSH    = 3;
var Z_FINISH        = 4;
var Z_BLOCK         = 5;
var Z_TREES         = 6;


/* Return codes for the compression/decompression functions. Negative values
 * are errors, positive values are used for special but normal events.
 */
var Z_OK            = 0;
var Z_STREAM_END    = 1;
var Z_NEED_DICT     = 2;
//var Z_ERRNO         = -1;
var Z_STREAM_ERROR  = -2;
var Z_DATA_ERROR    = -3;
var Z_MEM_ERROR     = -4;
var Z_BUF_ERROR     = -5;
//var Z_VERSION_ERROR = -6;

/* The deflate compression method */
var Z_DEFLATED  = 8;


/* STATES ====================================================================*/
/* ===========================================================================*/


var    HEAD = 1;       /* i: waiting for magic header */
var    FLAGS = 2;      /* i: waiting for method and flags (gzip) */
var    TIME = 3;       /* i: waiting for modification time (gzip) */
var    OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
var    EXLEN = 5;      /* i: waiting for extra length (gzip) */
var    EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
var    NAME = 7;       /* i: waiting for end of file name (gzip) */
var    COMMENT = 8;    /* i: waiting for end of comment (gzip) */
var    HCRC = 9;       /* i: waiting for header crc (gzip) */
var    DICTID = 10;    /* i: waiting for dictionary check value */
var    DICT = 11;      /* waiting for inflateSetDictionary() call */
var        TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
var        TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
var        STORED = 14;    /* i: waiting for stored size (length and complement) */
var        COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
var        COPY = 16;      /* i/o: waiting for input or output to copy stored block */
var        TABLE = 17;     /* i: waiting for dynamic block table lengths */
var        LENLENS = 18;   /* i: waiting for code length code lengths */
var        CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
var            LEN_ = 20;      /* i: same as LEN below, but only first time in */
var            LEN = 21;       /* i: waiting for length/lit/eob code */
var            LENEXT = 22;    /* i: waiting for length extra bits */
var            DIST = 23;      /* i: waiting for distance code */
var            DISTEXT = 24;   /* i: waiting for distance extra bits */
var            MATCH = 25;     /* o: waiting for output space to copy string */
var            LIT = 26;       /* o: waiting for output space to write literal */
var    CHECK = 27;     /* i: waiting for 32-bit check value */
var    LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
var    DONE = 29;      /* finished check, done -- remain here until reset */
var    BAD = 30;       /* got a data error -- remain here until reset */
var    MEM = 31;       /* got an inflate() memory error -- remain here until reset */
var    SYNC = 32;      /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

var MAX_WBITS = 15;
/* 32K LZ77 window */
var DEF_WBITS = MAX_WBITS;


function ZSWAP32(q) {
  return  (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
}


function InflateState() {
  this.mode = 0;             /* current inflate mode */
  this.last = false;          /* true if processing last block */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.havedict = false;      /* true if dictionary provided */
  this.flags = 0;             /* gzip header method and flags (0 if zlib) */
  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0;             /* protected copy of check value */
  this.total = 0;             /* protected copy of output count */
  // TODO: may be {}
  this.head = null;           /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0;             /* log base 2 of requested window size */
  this.wsize = 0;             /* window size or zero if not using window */
  this.whave = 0;             /* valid bytes in the window */
  this.wnext = 0;             /* window write index */
  this.window = null;         /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0;              /* input bit accumulator */
  this.bits = 0;              /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0;            /* literal or length of data to copy */
  this.offset = 0;            /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0;             /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null;          /* starting table for length/literal codes */
  this.distcode = null;         /* starting table for distance codes */
  this.lenbits = 0;           /* index bits for lencode */
  this.distbits = 0;          /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0;             /* number of code length code lengths */
  this.nlen = 0;              /* number of length code lengths */
  this.ndist = 0;             /* number of distance code lengths */
  this.have = 0;              /* number of code lengths in lens[] */
  this.next = null;              /* next available space in codes[] */

  this.lens = new utils.Buf16(320); /* temporary storage for code lengths */
  this.work = new utils.Buf16(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
  this.sane = 0;                   /* if false, allow invalid distance too far */
  this.back = 0;                   /* bits back of last unprocessed length/lit */
  this.was = 0;                    /* initial length of match */
}

function inflateResetKeep(strm) {
  var state;

  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) {       /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.dmax = 32768;
  state.head = null/*Z_NULL*/;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
  state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK;
}

function inflateReset(strm) {
  var state;

  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);

}

function inflateReset2(strm, windowBits) {
  var wrap;
  var state;

  /* get the state */
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  }
  else {
    wrap = (windowBits >> 4) + 1;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
}

function inflateInit2(strm, windowBits) {
  var ret;
  var state;

  if (!strm) { return Z_STREAM_ERROR; }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.window = null/*Z_NULL*/;
  ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK) {
    strm.state = null/*Z_NULL*/;
  }
  return ret;
}

function inflateInit(strm) {
  return inflateInit2(strm, DEF_WBITS);
}


/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
var virgin = true;

var lenfix, distfix; // We have no pointers in JS, so keep tables separate

function fixedtables(state) {
  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    var sym;

    lenfix = new utils.Buf32(512);
    distfix = new utils.Buf32(32);

    /* literal/length table */
    sym = 0;
    while (sym < 144) { state.lens[sym++] = 8; }
    while (sym < 256) { state.lens[sym++] = 9; }
    while (sym < 280) { state.lens[sym++] = 7; }
    while (sym < 288) { state.lens[sym++] = 8; }

    inflate_table(LENS,  state.lens, 0, 288, lenfix,   0, state.work, {bits: 9});

    /* distance table */
    sym = 0;
    while (sym < 32) { state.lens[sym++] = 5; }

    inflate_table(DISTS, state.lens, 0, 32,   distfix, 0, state.work, {bits: 5});

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
}


/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
function updatewindow(strm, src, end, copy) {
  var dist;
  var state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new utils.Buf8(state.wsize);
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    utils.arraySet(state.window,src, end - state.wsize, state.wsize, 0);
    state.wnext = 0;
    state.whave = state.wsize;
  }
  else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    utils.arraySet(state.window,src, end - copy, dist, state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      utils.arraySet(state.window,src, end - copy, copy, 0);
      state.wnext = copy;
      state.whave = state.wsize;
    }
    else {
      state.wnext += dist;
      if (state.wnext === state.wsize) { state.wnext = 0; }
      if (state.whave < state.wsize) { state.whave += dist; }
    }
  }
  return 0;
}

function inflate(strm, flush) {
  var state;
  var input, output;          // input/output buffers
  var next;                   /* next input INDEX */
  var put;                    /* next output INDEX */
  var have, left;             /* available input and output */
  var hold;                   /* bit buffer */
  var bits;                   /* bits in bit buffer */
  var _in, _out;              /* save starting available input and output */
  var copy;                   /* number of stored or match bytes to copy */
  var from;                   /* where to copy match bytes from */
  var from_source;
  var here = 0;               /* current decoding table entry */
  var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //var last;                   /* parent table entry */
  var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  var len;                    /* length to copy for repeats, bits to drop */
  var ret;                    /* return code */
  var hbuf = new utils.Buf8(4);    /* buffer for gzip header crc calculation */
  var opts;

  var n; // temporary var for NEED_BITS

  var order = /* permutation of code lengths */
    [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];


  if (!strm || !strm.state || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
    return Z_STREAM_ERROR;
  }

  state = strm.state;
  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
    case HEAD:
      if (state.wrap === 0) {
        state.mode = TYPEDO;
        break;
      }
      //=== NEEDBITS(16);
      while (bits < 16) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
        state.check = 0/*crc32(0L, Z_NULL, 0)*/;
        //=== CRC2(state.check, hold);
        hbuf[0] = hold & 0xff;
        hbuf[1] = (hold >>> 8) & 0xff;
        state.check = crc32(state.check, hbuf, 2, 0);
        //===//

        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = FLAGS;
        break;
      }
      state.flags = 0;           /* expect zlib header */
      if (state.head) {
        state.head.done = false;
      }
      if (!(state.wrap & 1) ||   /* check if zlib header allowed */
        (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
        strm.msg = 'incorrect header check';
        state.mode = BAD;
        break;
      }
      if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
        strm.msg = 'unknown compression method';
        state.mode = BAD;
        break;
      }
      //--- DROPBITS(4) ---//
      hold >>>= 4;
      bits -= 4;
      //---//
      len = (hold & 0x0f)/*BITS(4)*/ + 8;
      if (state.wbits === 0) {
        state.wbits = len;
      }
      else if (len > state.wbits) {
        strm.msg = 'invalid window size';
        state.mode = BAD;
        break;
      }
      state.dmax = 1 << len;
      //Tracev((stderr, "inflate:   zlib header ok\n"));
      strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
      state.mode = hold & 0x200 ? DICTID : TYPE;
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      break;
    case FLAGS:
      //=== NEEDBITS(16); */
      while (bits < 16) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      state.flags = hold;
      if ((state.flags & 0xff) !== Z_DEFLATED) {
        strm.msg = 'unknown compression method';
        state.mode = BAD;
        break;
      }
      if (state.flags & 0xe000) {
        strm.msg = 'unknown header flags set';
        state.mode = BAD;
        break;
      }
      if (state.head) {
        state.head.text = ((hold >> 8) & 1);
      }
      if (state.flags & 0x0200) {
        //=== CRC2(state.check, hold);
        hbuf[0] = hold & 0xff;
        hbuf[1] = (hold >>> 8) & 0xff;
        state.check = crc32(state.check, hbuf, 2, 0);
        //===//
      }
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = TIME;
      /* falls through */
    case TIME:
      //=== NEEDBITS(32); */
      while (bits < 32) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      if (state.head) {
        state.head.time = hold;
      }
      if (state.flags & 0x0200) {
        //=== CRC4(state.check, hold)
        hbuf[0] = hold & 0xff;
        hbuf[1] = (hold >>> 8) & 0xff;
        hbuf[2] = (hold >>> 16) & 0xff;
        hbuf[3] = (hold >>> 24) & 0xff;
        state.check = crc32(state.check, hbuf, 4, 0);
        //===
      }
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = OS;
      /* falls through */
    case OS:
      //=== NEEDBITS(16); */
      while (bits < 16) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      if (state.head) {
        state.head.xflags = (hold & 0xff);
        state.head.os = (hold >> 8);
      }
      if (state.flags & 0x0200) {
        //=== CRC2(state.check, hold);
        hbuf[0] = hold & 0xff;
        hbuf[1] = (hold >>> 8) & 0xff;
        state.check = crc32(state.check, hbuf, 2, 0);
        //===//
      }
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = EXLEN;
      /* falls through */
    case EXLEN:
      if (state.flags & 0x0400) {
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.length = hold;
        if (state.head) {
          state.head.extra_len = hold;
        }
        if (state.flags & 0x0200) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
      }
      else if (state.head) {
        state.head.extra = null/*Z_NULL*/;
      }
      state.mode = EXTRA;
      /* falls through */
    case EXTRA:
      if (state.flags & 0x0400) {
        copy = state.length;
        if (copy > have) { copy = have; }
        if (copy) {
          if (state.head) {
            len = state.head.extra_len - state.length;
            if (!state.head.extra) {
              // Use untyped array for more conveniend processing later
              state.head.extra = new Array(state.head.extra_len);
            }
            utils.arraySet(
              state.head.extra,
              input,
              next,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              copy,
              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
              len
            );
            //zmemcpy(state.head.extra + len, next,
            //        len + copy > state.head.extra_max ?
            //        state.head.extra_max - len : copy);
          }
          if (state.flags & 0x0200) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          state.length -= copy;
        }
        if (state.length) { break inf_leave; }
      }
      state.length = 0;
      state.mode = NAME;
      /* falls through */
    case NAME:
      if (state.flags & 0x0800) {
        if (have === 0) { break inf_leave; }
        copy = 0;
        do {
          // TODO: 2 or 1 bytes?
          len = input[next + copy++];
          /* use constant limit because in js we should not preallocate memory */
          if (state.head && len &&
              (state.length < 65536 /*state.head.name_max*/)) {
            state.head.name += String.fromCharCode(len);
          }
        } while (len && copy < have);

        if (state.flags & 0x0200) {
          state.check = crc32(state.check, input, copy, next);
        }
        have -= copy;
        next += copy;
        if (len) { break inf_leave; }
      }
      else if (state.head) {
        state.head.name = null;
      }
      state.length = 0;
      state.mode = COMMENT;
      /* falls through */
    case COMMENT:
      if (state.flags & 0x1000) {
        if (have === 0) { break inf_leave; }
        copy = 0;
        do {
          len = input[next + copy++];
          /* use constant limit because in js we should not preallocate memory */
          if (state.head && len &&
              (state.length < 65536 /*state.head.comm_max*/)) {
            state.head.comment += String.fromCharCode(len);
          }
        } while (len && copy < have);
        if (state.flags & 0x0200) {
          state.check = crc32(state.check, input, copy, next);
        }
        have -= copy;
        next += copy;
        if (len) { break inf_leave; }
      }
      else if (state.head) {
        state.head.comment = null;
      }
      state.mode = HCRC;
      /* falls through */
    case HCRC:
      if (state.flags & 0x0200) {
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (hold !== (state.check & 0xffff)) {
          strm.msg = 'header crc mismatch';
          state.mode = BAD;
          break;
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
      }
      if (state.head) {
        state.head.hcrc = ((state.flags >> 9) & 1);
        state.head.done = true;
      }
      strm.adler = state.check = 0 /*crc32(0L, Z_NULL, 0)*/;
      state.mode = TYPE;
      break;
    case DICTID:
      //=== NEEDBITS(32); */
      while (bits < 32) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      strm.adler = state.check = ZSWAP32(hold);
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = DICT;
      /* falls through */
    case DICT:
      if (state.havedict === 0) {
        //--- RESTORE() ---
        strm.next_out = put;
        strm.avail_out = left;
        strm.next_in = next;
        strm.avail_in = have;
        state.hold = hold;
        state.bits = bits;
        //---
        return Z_NEED_DICT;
      }
      strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
      state.mode = TYPE;
      /* falls through */
    case TYPE:
      if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
      /* falls through */
    case TYPEDO:
      if (state.last) {
        //--- BYTEBITS() ---//
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        state.mode = CHECK;
        break;
      }
      //=== NEEDBITS(3); */
      while (bits < 3) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      state.last = (hold & 0x01)/*BITS(1)*/;
      //--- DROPBITS(1) ---//
      hold >>>= 1;
      bits -= 1;
      //---//

      switch ((hold & 0x03)/*BITS(2)*/) {
      case 0:                             /* stored block */
        //Tracev((stderr, "inflate:     stored block%s\n",
        //        state.last ? " (last)" : ""));
        state.mode = STORED;
        break;
      case 1:                             /* fixed block */
        fixedtables(state);
        //Tracev((stderr, "inflate:     fixed codes block%s\n",
        //        state.last ? " (last)" : ""));
        state.mode = LEN_;             /* decode codes */
        if (flush === Z_TREES) {
          //--- DROPBITS(2) ---//
          hold >>>= 2;
          bits -= 2;
          //---//
          break inf_leave;
        }
        break;
      case 2:                             /* dynamic block */
        //Tracev((stderr, "inflate:     dynamic codes block%s\n",
        //        state.last ? " (last)" : ""));
        state.mode = TABLE;
        break;
      case 3:
        strm.msg = 'invalid block type';
        state.mode = BAD;
      }
      //--- DROPBITS(2) ---//
      hold >>>= 2;
      bits -= 2;
      //---//
      break;
    case STORED:
      //--- BYTEBITS() ---// /* go to byte boundary */
      hold >>>= bits & 7;
      bits -= bits & 7;
      //---//
      //=== NEEDBITS(32); */
      while (bits < 32) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
        strm.msg = 'invalid stored block lengths';
        state.mode = BAD;
        break;
      }
      state.length = hold & 0xffff;
      //Tracev((stderr, "inflate:       stored length %u\n",
      //        state.length));
      //=== INITBITS();
      hold = 0;
      bits = 0;
      //===//
      state.mode = COPY_;
      if (flush === Z_TREES) { break inf_leave; }
      /* falls through */
    case COPY_:
      state.mode = COPY;
      /* falls through */
    case COPY:
      copy = state.length;
      if (copy) {
        if (copy > have) { copy = have; }
        if (copy > left) { copy = left; }
        if (copy === 0) { break inf_leave; }
        //--- zmemcpy(put, next, copy); ---
        utils.arraySet(output, input, next, copy, put);
        //---//
        have -= copy;
        next += copy;
        left -= copy;
        put += copy;
        state.length -= copy;
        break;
      }
      //Tracev((stderr, "inflate:       stored end\n"));
      state.mode = TYPE;
      break;
    case TABLE:
      //=== NEEDBITS(14); */
      while (bits < 14) {
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
      }
      //===//
      state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
      //--- DROPBITS(5) ---//
      hold >>>= 5;
      bits -= 5;
      //---//
      state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
      //--- DROPBITS(5) ---//
      hold >>>= 5;
      bits -= 5;
      //---//
      state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
      //--- DROPBITS(4) ---//
      hold >>>= 4;
      bits -= 4;
      //---//
//#ifndef PKZIP_BUG_WORKAROUND
      if (state.nlen > 286 || state.ndist > 30) {
        strm.msg = 'too many length or distance symbols';
        state.mode = BAD;
        break;
      }
//#endif
      //Tracev((stderr, "inflate:       table sizes ok\n"));
      state.have = 0;
      state.mode = LENLENS;
      /* falls through */
    case LENLENS:
      while (state.have < state.ncode) {
        //=== NEEDBITS(3);
        while (bits < 3) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
        //--- DROPBITS(3) ---//
        hold >>>= 3;
        bits -= 3;
        //---//
      }
      while (state.have < 19) {
        state.lens[order[state.have++]] = 0;
      }
      // We have separate tables & no pointers. 2 commented lines below not needed.
      //state.next = state.codes;
      //state.lencode = state.next;
      // Switch to use dynamic table
      state.lencode = state.lendyn;
      state.lenbits = 7;

      opts = {bits: state.lenbits};
      ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
      state.lenbits = opts.bits;

      if (ret) {
        strm.msg = 'invalid code lengths set';
        state.mode = BAD;
        break;
      }
      //Tracev((stderr, "inflate:       code lengths ok\n"));
      state.have = 0;
      state.mode = CODELENS;
      /* falls through */
    case CODELENS:
      while (state.have < state.nlen + state.ndist) {
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_val < 16) {
          //--- DROPBITS(here.bits) ---//
          hold >>>= here_bits;
          bits -= here_bits;
          //---//
          state.lens[state.have++] = here_val;
        }
        else {
          if (here_val === 16) {
            //=== NEEDBITS(here.bits + 2);
            n = here_bits + 2;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            if (state.have === 0) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            len = state.lens[state.have - 1];
            copy = 3 + (hold & 0x03);//BITS(2);
            //--- DROPBITS(2) ---//
            hold >>>= 2;
            bits -= 2;
            //---//
          }
          else if (here_val === 17) {
            //=== NEEDBITS(here.bits + 3);
            n = here_bits + 3;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            len = 0;
            copy = 3 + (hold & 0x07);//BITS(3);
            //--- DROPBITS(3) ---//
            hold >>>= 3;
            bits -= 3;
            //---//
          }
          else {
            //=== NEEDBITS(here.bits + 7);
            n = here_bits + 7;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            len = 0;
            copy = 11 + (hold & 0x7f);//BITS(7);
            //--- DROPBITS(7) ---//
            hold >>>= 7;
            bits -= 7;
            //---//
          }
          if (state.have + copy > state.nlen + state.ndist) {
            strm.msg = 'invalid bit length repeat';
            state.mode = BAD;
            break;
          }
          while (copy--) {
            state.lens[state.have++] = len;
          }
        }
      }

      /* handle error breaks in while */
      if (state.mode === BAD) { break; }

      /* check for end-of-block code (better have one) */
      if (state.lens[256] === 0) {
        strm.msg = 'invalid code -- missing end-of-block';
        state.mode = BAD;
        break;
      }

      /* build code tables -- note: do not change the lenbits or distbits
         values here (9 and 6) without reading the comments in inftrees.h
         concerning the ENOUGH constants, which depend on those values */
      state.lenbits = 9;

      opts = {bits: state.lenbits};
      ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
      // We have separate tables & no pointers. 2 commented lines below not needed.
      // state.next_index = opts.table_index;
      state.lenbits = opts.bits;
      // state.lencode = state.next;

      if (ret) {
        strm.msg = 'invalid literal/lengths set';
        state.mode = BAD;
        break;
      }

      state.distbits = 6;
      //state.distcode.copy(state.codes);
      // Switch to use dynamic table
      state.distcode = state.distdyn;
      opts = {bits: state.distbits};
      ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
      // We have separate tables & no pointers. 2 commented lines below not needed.
      // state.next_index = opts.table_index;
      state.distbits = opts.bits;
      // state.distcode = state.next;

      if (ret) {
        strm.msg = 'invalid distances set';
        state.mode = BAD;
        break;
      }
      //Tracev((stderr, 'inflate:       codes ok\n'));
      state.mode = LEN_;
      if (flush === Z_TREES) { break inf_leave; }
      /* falls through */
    case LEN_:
      state.mode = LEN;
      /* falls through */
    case LEN:
      if (have >= 6 && left >= 258) {
        //--- RESTORE() ---
        strm.next_out = put;
        strm.avail_out = left;
        strm.next_in = next;
        strm.avail_in = have;
        state.hold = hold;
        state.bits = bits;
        //---
        inflate_fast(strm, _out);
        //--- LOAD() ---
        put = strm.next_out;
        output = strm.output;
        left = strm.avail_out;
        next = strm.next_in;
        input = strm.input;
        have = strm.avail_in;
        hold = state.hold;
        bits = state.bits;
        //---

        if (state.mode === TYPE) {
          state.back = -1;
        }
        break;
      }
      state.back = 0;
      for (;;) {
        here = state.lencode[hold & ((1 << state.lenbits) -1)];  /*BITS(state.lenbits)*/
        here_bits = here >>> 24;
        here_op = (here >>> 16) & 0xff;
        here_val = here & 0xffff;

        if (here_bits <= bits) { break; }
        //--- PULLBYTE() ---//
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
        //---//
      }
      if (here_op && (here_op & 0xf0) === 0) {
        last_bits = here_bits;
        last_op = here_op;
        last_val = here_val;
        for (;;) {
          here = state.lencode[last_val +
                  ((hold & ((1 << (last_bits + last_op)) -1))/*BITS(last.bits + last.op)*/ >> last_bits)];
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((last_bits + here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        //--- DROPBITS(last.bits) ---//
        hold >>>= last_bits;
        bits -= last_bits;
        //---//
        state.back += last_bits;
      }
      //--- DROPBITS(here.bits) ---//
      hold >>>= here_bits;
      bits -= here_bits;
      //---//
      state.back += here_bits;
      state.length = here_val;
      if (here_op === 0) {
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        state.mode = LIT;
        break;
      }
      if (here_op & 32) {
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.back = -1;
        state.mode = TYPE;
        break;
      }
      if (here_op & 64) {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD;
        break;
      }
      state.extra = here_op & 15;
      state.mode = LENEXT;
      /* falls through */
    case LENEXT:
      if (state.extra) {
        //=== NEEDBITS(state.extra);
        n = state.extra;
        while (bits < n) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.length += hold & ((1 << state.extra) -1)/*BITS(state.extra)*/;
        //--- DROPBITS(state.extra) ---//
        hold >>>= state.extra;
        bits -= state.extra;
        //---//
        state.back += state.extra;
      }
      //Tracevv((stderr, "inflate:         length %u\n", state.length));
      state.was = state.length;
      state.mode = DIST;
      /* falls through */
    case DIST:
      for (;;) {
        here = state.distcode[hold & ((1 << state.distbits) -1)];/*BITS(state.distbits)*/
        here_bits = here >>> 24;
        here_op = (here >>> 16) & 0xff;
        here_val = here & 0xffff;

        if ((here_bits) <= bits) { break; }
        //--- PULLBYTE() ---//
        if (have === 0) { break inf_leave; }
        have--;
        hold += input[next++] << bits;
        bits += 8;
        //---//
      }
      if ((here_op & 0xf0) === 0) {
        last_bits = here_bits;
        last_op = here_op;
        last_val = here_val;
        for (;;) {
          here = state.distcode[last_val +
                  ((hold & ((1 << (last_bits + last_op)) -1))/*BITS(last.bits + last.op)*/ >> last_bits)];
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((last_bits + here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        //--- DROPBITS(last.bits) ---//
        hold >>>= last_bits;
        bits -= last_bits;
        //---//
        state.back += last_bits;
      }
      //--- DROPBITS(here.bits) ---//
      hold >>>= here_bits;
      bits -= here_bits;
      //---//
      state.back += here_bits;
      if (here_op & 64) {
        strm.msg = 'invalid distance code';
        state.mode = BAD;
        break;
      }
      state.offset = here_val;
      state.extra = (here_op) & 15;
      state.mode = DISTEXT;
      /* falls through */
    case DISTEXT:
      if (state.extra) {
        //=== NEEDBITS(state.extra);
        n = state.extra;
        while (bits < n) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.offset += hold & ((1 << state.extra) -1)/*BITS(state.extra)*/;
        //--- DROPBITS(state.extra) ---//
        hold >>>= state.extra;
        bits -= state.extra;
        //---//
        state.back += state.extra;
      }
//#ifdef INFLATE_STRICT
      if (state.offset > state.dmax) {
        strm.msg = 'invalid distance too far back';
        state.mode = BAD;
        break;
      }
//#endif
      //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
      state.mode = MATCH;
      /* falls through */
    case MATCH:
      if (left === 0) { break inf_leave; }
      copy = _out - left;
      if (state.offset > copy) {         /* copy from window */
        copy = state.offset - copy;
        if (copy > state.whave) {
          if (state.sane) {
            strm.msg = 'invalid distance too far back';
            state.mode = BAD;
            break;
          }
// (!) This block is disabled in zlib defailts,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= state.whave;
//          if (copy > state.length) { copy = state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (state.length === 0) { state.mode = LEN; }
//          break;
//#endif
        }
        if (copy > state.wnext) {
          copy -= state.wnext;
          from = state.wsize - copy;
        }
        else {
          from = state.wnext - copy;
        }
        if (copy > state.length) { copy = state.length; }
        from_source = state.window;
      }
      else {                              /* copy from output */
        from_source = output;
        from = put - state.offset;
        copy = state.length;
      }
      if (copy > left) { copy = left; }
      left -= copy;
      state.length -= copy;
      do {
        output[put++] = from_source[from++];
      } while (--copy);
      if (state.length === 0) { state.mode = LEN; }
      break;
    case LIT:
      if (left === 0) { break inf_leave; }
      output[put++] = state.length;
      left--;
      state.mode = LEN;
      break;
    case CHECK:
      if (state.wrap) {
        //=== NEEDBITS(32);
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          // Use '|' insdead of '+' to make sure that result is signed
          hold |= input[next++] << bits;
          bits += 8;
        }
        //===//
        _out -= left;
        strm.total_out += _out;
        state.total += _out;
        if (_out) {
          strm.adler = state.check =
              /*UPDATE(state.check, put - _out, _out);*/
              (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out));

        }
        _out = left;
        // NB: crc32 stored as signed 32-bit int, ZSWAP32 returns signed too
        if ((state.flags ? hold : ZSWAP32(hold)) !== state.check) {
          strm.msg = 'incorrect data check';
          state.mode = BAD;
          break;
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        //Tracev((stderr, "inflate:   check matches trailer\n"));
      }
      state.mode = LENGTH;
      /* falls through */
    case LENGTH:
      if (state.wrap && state.flags) {
        //=== NEEDBITS(32);
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (hold !== (state.total & 0xffffffff)) {
          strm.msg = 'incorrect length check';
          state.mode = BAD;
          break;
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        //Tracev((stderr, "inflate:   length matches trailer\n"));
      }
      state.mode = DONE;
      /* falls through */
    case DONE:
      ret = Z_STREAM_END;
      break inf_leave;
    case BAD:
      ret = Z_DATA_ERROR;
      break inf_leave;
    case MEM:
      return Z_MEM_ERROR;
    case SYNC:
      /* falls through */
    default:
      return Z_STREAM_ERROR;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH))) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
      state.mode = MEM;
      return Z_MEM_ERROR;
    }
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if (state.wrap && _out) {
    strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
      (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out));
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) {
    ret = Z_BUF_ERROR;
  }
  return ret;
}

function inflateEnd(strm) {

  if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
    return Z_STREAM_ERROR;
  }

  var state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK;
}

function inflateGetHeader(strm, head) {
  var state;

  /* check state */
  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
  state = strm.state;
  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR; }

  /* save header structure */
  state.head = head;
  head.done = false;
  return Z_OK;
}


exports.inflateReset = inflateReset;
exports.inflateReset2 = inflateReset2;
exports.inflateResetKeep = inflateResetKeep;
exports.inflateInit = inflateInit;
exports.inflateInit2 = inflateInit2;
exports.inflate = inflate;
exports.inflateEnd = inflateEnd;
exports.inflateGetHeader = inflateGetHeader;
exports.inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
exports.inflateCopy = inflateCopy;
exports.inflateGetDictionary = inflateGetDictionary;
exports.inflateMark = inflateMark;
exports.inflatePrime = inflatePrime;
exports.inflateSetDictionary = inflateSetDictionary;
exports.inflateSync = inflateSync;
exports.inflateSyncPoint = inflateSyncPoint;
exports.inflateUndermine = inflateUndermine;
*/

},{"../utils/common":38,"./adler32":39,"./crc32":41,"./inffast":43,"./inftrees":45}],45:[function(_dereq_,module,exports){
'use strict';


var utils = _dereq_('../utils/common');

var MAXBITS = 15;
var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
//var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

var CODES = 0;
var LENS = 1;
var DISTS = 2;

var lbase = [ /* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
];

var lext = [ /* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
];

var dbase = [ /* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
];

var dext = [ /* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 29, 64, 64
];

module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts)
{
  var bits = opts.bits;
      //here = opts.here; /* table entry for duplication */

  var len = 0;               /* a code's length in bits */
  var sym = 0;               /* index of code symbols */
  var min = 0, max = 0;          /* minimum and maximum code lengths */
  var root = 0;              /* number of index bits for root table */
  var curr = 0;              /* number of index bits for current table */
  var drop = 0;              /* code bits to drop for sub-table */
  var left = 0;                   /* number of prefix codes available */
  var used = 0;              /* code entries in table used */
  var huff = 0;              /* Huffman code */
  var incr;              /* for incrementing code, index */
  var fill;              /* index for replicating entries */
  var low;               /* low bits for current root entry */
  var mask;              /* mask for low root bits */
  var next;             /* next available space in table */
  var base = null;     /* base value table to use */
  var base_index = 0;
//  var shoextra;    /* extra bits table to use */
  var end;                    /* use base and extra for symbol > end */
  var count = new utils.Buf16(MAXBITS+1); //[MAXBITS+1];    /* number of codes of each length */
  var offs = new utils.Buf16(MAXBITS+1); //[MAXBITS+1];     /* offsets in table for each length */
  var extra = null;
  var extra_index = 0;

  var here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) { break; }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {                     /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;


    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;

    opts.bits = 1;
    return 0;     /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) { break; }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }        /* over-subscribed */
  }
  if (left > 0 && (type === CODES || max !== 1)) {
    return -1;                      /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES) {
    base = extra = work;    /* dummy value--not used */
    end = 19;

  } else if (type === LENS) {
    base = lbase;
    base_index -= 257;
    extra = lext;
    extra_index -= 257;
    end = 256;

  } else {                    /* DISTS */
    base = dbase;
    extra = dext;
    end = -1;
  }

  /* initialize opts for loop */
  huff = 0;                   /* starting code */
  sym = 0;                    /* starting code symbol */
  len = min;                  /* starting code length */
  next = table_index;              /* current table to fill in */
  curr = root;                /* current table index bits */
  drop = 0;                   /* current bits to drop from code for index */
  low = -1;                   /* trigger new sub-table when len > root */
  used = 1 << root;          /* use root table entries */
  mask = used - 1;            /* mask for comparing low */

  /* check available table space */
  if ((type === LENS && used > ENOUGH_LENS) ||
    (type === DISTS && used > ENOUGH_DISTS)) {
    return 1;
  }

  var i=0;
  /* process all codes and make table entries */
  for (;;) {
    i++;
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] < end) {
      here_op = 0;
      here_val = work[sym];
    }
    else if (work[sym] > end) {
      here_op = extra[extra_index + work[sym]];
      here_val = base[base_index + work[sym]];
    }
    else {
      here_op = 32 + 64;         /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop);
    fill = 1 << curr;
    min = fill;                 /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1);
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) { break; }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min;            /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) { break; }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if ((type === LENS && used > ENOUGH_LENS) ||
        (type === DISTS && used > ENOUGH_DISTS)) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
};

},{"../utils/common":38}],46:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  '2':    'need dictionary',     /* Z_NEED_DICT       2  */
  '1':    'stream end',          /* Z_STREAM_END      1  */
  '0':    '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};

},{}],47:[function(_dereq_,module,exports){
'use strict';


var utils = _dereq_('../utils/common');

/* Public constants ==========================================================*/
/* ===========================================================================*/


//var Z_FILTERED          = 1;
//var Z_HUFFMAN_ONLY      = 2;
//var Z_RLE               = 3;
var Z_FIXED               = 4;
//var Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
var Z_BINARY              = 0;
var Z_TEXT                = 1;
//var Z_ASCII             = 1; // = Z_TEXT
var Z_UNKNOWN             = 2;

/*============================================================================*/


function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }

// From zutil.h

var STORED_BLOCK = 0;
var STATIC_TREES = 1;
var DYN_TREES    = 2;
/* The three kinds of block type */

var MIN_MATCH    = 3;
var MAX_MATCH    = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

var LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */

var LITERALS      = 256;
/* number of literal bytes 0..255 */

var L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */

var D_CODES       = 30;
/* number of distance codes */

var BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */

var HEAP_SIZE     = 2*L_CODES + 1;
/* maximum heap size */

var MAX_BITS      = 15;
/* All codes must not exceed MAX_BITS bits */

var Buf_size      = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

var MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

var END_BLOCK   = 256;
/* end of block literal code */

var REP_3_6     = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

var REPZ_3_10   = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

var REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

var extra_lbits =   /* extra bits for each length code */
  [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];

var extra_dbits =   /* extra bits for each distance code */
  [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];

var extra_blbits =  /* extra bits for each bit length code */
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7];

var bl_order =
  [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

var DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array insdead of structure, Freq = i*2, Len = i*2+1
var static_ltree  = new Array((L_CODES+2) * 2);
zero(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

var static_dtree  = new Array(D_CODES * 2);
zero(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

var _dist_code    = new Array(DIST_CODE_LEN);
zero(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

var _length_code  = new Array(MAX_MATCH-MIN_MATCH+1);
zero(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

var base_length   = new Array(LENGTH_CODES);
zero(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

var base_dist     = new Array(D_CODES);
zero(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


var StaticTreeDesc = function (static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree  = static_tree;  /* static tree or NULL */
  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
  this.extra_base   = extra_base;   /* base index for extra_bits */
  this.elems        = elems;        /* max number of elements in the tree */
  this.max_length   = max_length;   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree    = static_tree && static_tree.length;
};


var static_l_desc;
var static_d_desc;
var static_bl_desc;


var TreeDesc = function(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;     /* the dynamic tree */
  this.max_code = 0;            /* largest code with non zero frequency */
  this.stat_desc = stat_desc;   /* the corresponding static tree */
};



function d_code(dist) {
  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
function put_short (s, w) {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
}


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
function send_bits(s, value, length) {
  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
}


function send_code(s, c, tree) {
  send_bits(s, tree[c*2]/*.Code*/, tree[c*2 + 1]/*.Len*/);
}


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
function bi_reverse(code, len) {
  var res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
}


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
function bi_flush(s) {
  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
}


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
function gen_bitlen(s, desc)
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */
{
  var tree            = desc.dyn_tree;
  var max_code        = desc.max_code;
  var stree           = desc.stat_desc.static_tree;
  var has_stree       = desc.stat_desc.has_stree;
  var extra           = desc.stat_desc.extra_bits;
  var base            = desc.stat_desc.extra_base;
  var max_length      = desc.stat_desc.max_length;
  var h;              /* heap index */
  var n, m;           /* iterate over the tree elements */
  var bits;           /* bit length */
  var xbits;          /* extra bits */
  var f;              /* frequency */
  var overflow = 0;   /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max]*2 + 1]/*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max+1; h < HEAP_SIZE; h++) {
    n = s.heap[h];
    bits = tree[tree[n*2 +1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n*2 + 1]/*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) { continue; } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n-base];
    }
    f = tree[n * 2]/*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n*2 + 1]/*.Len*/ + xbits);
    }
  }
  if (overflow === 0) { return; }

  // Trace((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length-1;
    while (s.bl_count[bits] === 0) { bits--; }
    s.bl_count[bits]--;      /* move one leaf down the tree */
    s.bl_count[bits+1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) { continue; }
      if (tree[m*2 + 1]/*.Len*/ !== bits) {
        // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m*2 + 1]/*.Len*/)*tree[m*2]/*.Freq*/;
        tree[m*2 + 1]/*.Len*/ = bits;
      }
      n--;
    }
  }
}


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
function gen_codes(tree, max_code, bl_count)
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */
{
  var next_code = new Array(MAX_BITS+1); /* next code value for each bit length */
  var code = 0;              /* running code value */
  var bits;                  /* bit index */
  var n;                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS; bits++) {
    next_code[bits] = code = (code + bl_count[bits-1]) << 1;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0;  n <= max_code; n++) {
    var len = tree[n*2 + 1]/*.Len*/;
    if (len === 0) { continue; }
    /* Now reverse the bits */
    tree[n*2]/*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
}


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
function tr_static_init() {
  var n;        /* iterates over tree elements */
  var bits;     /* bit counter */
  var length;   /* length value */
  var code;     /* code value */
  var dist;     /* distance index */
  var bl_count = new Array(MAX_BITS+1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES-1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1<<extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length-1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0 ; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1<<extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1<<(extra_dbits[code]-7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n*2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n*2 + 1]/*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n*2 + 1]/*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n*2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES+1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES; n++) {
    static_dtree[n*2 + 1]/*.Len*/ = 5;
    static_dtree[n*2]/*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS+1, L_CODES, MAX_BITS);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES, MAX_BITS);
  static_bl_desc =new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES, MAX_BL_BITS);

  //static_init_done = true;
}


/* ===========================================================================
 * Initialize a new block.
 */
function init_block(s) {
  var n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES;  n++) { s.dyn_ltree[n*2]/*.Freq*/ = 0; }
  for (n = 0; n < D_CODES;  n++) { s.dyn_dtree[n*2]/*.Freq*/ = 0; }
  for (n = 0; n < BL_CODES; n++) { s.bl_tree[n*2]/*.Freq*/ = 0; }

  s.dyn_ltree[END_BLOCK*2]/*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.last_lit = s.matches = 0;
}


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
function bi_windup(s)
{
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
}

/* ===========================================================================
 * Copy a stored block, storing first the length and its
 * one's complement if requested.
 */
function copy_block(s, buf, len, header)
//DeflateState *s;
//charf    *buf;    /* the input data */
//unsigned len;     /* its length */
//int      header;  /* true if block header must be written */
{
  bi_windup(s);        /* align on byte boundary */

  if (header) {
    put_short(s, len);
    put_short(s, ~len);
  }
//  while (len--) {
//    put_byte(s, *buf++);
//  }
  utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
  s.pending += len;
}

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
function smaller(tree, n, m, depth) {
  var _n2 = n*2;
  var _m2 = m*2;
  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
}

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
function pqdownheap(s, tree, k)
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */
{
  var v = s.heap[k];
  var j = k << 1;  /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j+1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
}


// inlined manually
// var SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
function compress_block(s, ltree, dtree)
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */
{
  var dist;           /* distance of matched string */
  var lc;             /* match length or unmatched char (if dist == 0) */
  var lx = 0;         /* running index in l_buf */
  var code;           /* the code to send */
  var extra;          /* number of extra bits to send */

  if (s.last_lit !== 0) {
    do {
      dist = (s.pending_buf[s.d_buf + lx*2] << 8) | (s.pending_buf[s.d_buf + lx*2 + 1]);
      lc = s.pending_buf[s.l_buf + lx];
      lx++;

      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code+LITERALS+1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);       /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);       /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);   /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
      //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
      //       "pendingBuf overflow");

    } while (lx < s.last_lit);
  }

  send_code(s, END_BLOCK, ltree);
}


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
function build_tree(s, desc)
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */
{
  var tree     = desc.dyn_tree;
  var stree    = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var elems    = desc.stat_desc.elems;
  var n, m;          /* iterate over heap elements */
  var max_code = -1; /* largest code with non zero frequency */
  var node;          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]/*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n*2 + 1]/*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2]/*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node*2 + 1]/*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems;              /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1/*SMALLEST*/];
    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1/*SMALLEST*/);
    /***/

    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n*2 + 1]/*.Dad*/ = tree[m*2 + 1]/*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1/*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1/*SMALLEST*/);

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
}


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
function scan_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */
{
  var n;                     /* iterates over all tree elements */
  var prevlen = -1;          /* last emitted length */
  var curlen;                /* length of current code */

  var nextlen = tree[0*2 + 1]/*.Len*/; /* length of next code */

  var count = 0;             /* repeat count of the current code */
  var max_count = 7;         /* max repeat count */
  var min_count = 4;         /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code+1)*2 + 1]/*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n+1)*2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2]/*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
      s.bl_tree[REP_3_6*2]/*.Freq*/++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10*2]/*.Freq*/++;

    } else {
      s.bl_tree[REPZ_11_138*2]/*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
function send_tree(s, tree, max_code)
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */
{
  var n;                     /* iterates over all tree elements */
  var prevlen = -1;          /* last emitted length */
  var curlen;                /* length of current code */

  var nextlen = tree[0*2 + 1]/*.Len*/; /* length of next code */

  var count = 0;             /* repeat count of the current code */
  var max_count = 7;         /* max repeat count */
  var min_count = 4;         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n+1)*2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count-3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count-3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count-11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
function build_bl_tree(s) {
  var max_blindex;  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES-1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex]*2 + 1]/*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3*(max_blindex+1) + 5+5+4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
}


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
function send_all_trees(s, lcodes, dcodes, blcodes)
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
{
  var rank;                    /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes-257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes-1,   5);
  send_bits(s, blcodes-4,  4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank]*2 + 1]/*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes-1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes-1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
}


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "black list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
function detect_data_type(s) {
  /* black_mask is the bit mask of black-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  var black_mask = 0xf3ffc07f;
  var n;

  /* Check for non-textual ("black-listed") bytes. */
  for (n = 0; n <= 31; n++, black_mask >>>= 1) {
    if ((black_mask & 1) && (s.dyn_ltree[n*2]/*.Freq*/ !== 0)) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("white-listed") bytes. */
  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS; n++) {
    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "black-listed" or "white-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
}


var static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
function _tr_init(s)
{

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
}


/* ===========================================================================
 * Send a stored block
 */
function _tr_stored_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  send_bits(s, (STORED_BLOCK<<1)+(last ? 1 : 0), 3);    /* send block type */
  copy_block(s, buf, stored_len, true); /* with header */
}


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
function _tr_align(s) {
  send_bits(s, STATIC_TREES<<1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
}


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 */
function _tr_flush_block(s, buf, stored_len, last)
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */
{
  var opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
  var max_blindex = 0;        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len+3+7) >>> 3;
    static_lenb = (s.static_len+3+7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->last_lit));

    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len+4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES<<1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES<<1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code+1, s.d_desc.max_code+1, max_blindex+1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
}

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
function _tr_tally(s, dist, lc)
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
{
  //var out_length, in_length, dcode;

  s.pending_buf[s.d_buf + s.last_lit * 2]     = (dist >>> 8) & 0xff;
  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

  s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
  s.last_lit++;

  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc*2]/*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--;             /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc]+LITERALS+1) * 2]/*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
  }

// (!) This block is disabled in zlib defailts,
// don't enable it for binary compatibility

//#ifdef TRUNCATE_BLOCK
//  /* Try to guess if it is profitable to stop the current block here */
//  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
//    /* Compute an upper bound for the compressed length */
//    out_length = s.last_lit*8;
//    in_length = s.strstart - s.block_start;
//
//    for (dcode = 0; dcode < D_CODES; dcode++) {
//      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
//    }
//    out_length >>>= 3;
//    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
//    //       s->last_lit, in_length, out_length,
//    //       100L - out_length*100L/in_length));
//    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
//      return true;
//    }
//  }
//#endif

  return (s.last_lit === s.lit_bufsize-1);
  /* We avoid equality with lit_bufsize because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */
}

exports._tr_init  = _tr_init;
exports._tr_stored_block = _tr_stored_block;
exports._tr_flush_block  = _tr_flush_block;
exports._tr_tally = _tr_tally;
exports._tr_align = _tr_align;

},{"../utils/common":38}],48:[function(_dereq_,module,exports){
'use strict';


function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

module.exports = ZStream;

},{}],49:[function(_dereq_,module,exports){
(function (process,Buffer){
var msg = _dereq_('pako/lib/zlib/messages');
var zstream = _dereq_('pako/lib/zlib/zstream');
var zlib_deflate = _dereq_('pako/lib/zlib/deflate.js');
var zlib_inflate = _dereq_('pako/lib/zlib/inflate.js');
var constants = _dereq_('pako/lib/zlib/constants');

for (var key in constants) {
  exports[key] = constants[key];
}

// zlib modes
exports.NONE = 0;
exports.DEFLATE = 1;
exports.INFLATE = 2;
exports.GZIP = 3;
exports.GUNZIP = 4;
exports.DEFLATERAW = 5;
exports.INFLATERAW = 6;
exports.UNZIP = 7;

/**
 * Emulate Node's zlib C++ layer for use by the JS layer in index.js
 */
function Zlib(mode) {
  if (mode < exports.DEFLATE || mode > exports.UNZIP)
    throw new TypeError("Bad argument");
    
  this.mode = mode;
  this.init_done = false;
  this.write_in_progress = false;
  this.pending_close = false;
  this.windowBits = 0;
  this.level = 0;
  this.memLevel = 0;
  this.strategy = 0;
  this.dictionary = null;
}

Zlib.prototype.init = function(windowBits, level, memLevel, strategy, dictionary) {
  this.windowBits = windowBits;
  this.level = level;
  this.memLevel = memLevel;
  this.strategy = strategy;
  // dictionary not supported.
  
  if (this.mode === exports.GZIP || this.mode === exports.GUNZIP)
    this.windowBits += 16;
    
  if (this.mode === exports.UNZIP)
    this.windowBits += 32;
    
  if (this.mode === exports.DEFLATERAW || this.mode === exports.INFLATERAW)
    this.windowBits = -this.windowBits;
    
  this.strm = new zstream();
  
  switch (this.mode) {
    case exports.DEFLATE:
    case exports.GZIP:
    case exports.DEFLATERAW:
      var status = zlib_deflate.deflateInit2(
        this.strm,
        this.level,
        exports.Z_DEFLATED,
        this.windowBits,
        this.memLevel,
        this.strategy
      );
      break;
    case exports.INFLATE:
    case exports.GUNZIP:
    case exports.INFLATERAW:
    case exports.UNZIP:
      var status  = zlib_inflate.inflateInit2(
        this.strm,
        this.windowBits
      );
      break;
    default:
      throw new Error("Unknown mode " + this.mode);
  }
  
  if (status !== exports.Z_OK) {
    this._error(status);
    return;
  }
  
  this.write_in_progress = false;
  this.init_done = true;
};

Zlib.prototype.params = function() {
  throw new Error("deflateParams Not supported");
};

Zlib.prototype._writeCheck = function() {
  if (!this.init_done)
    throw new Error("write before init");
    
  if (this.mode === exports.NONE)
    throw new Error("already finalized");
    
  if (this.write_in_progress)
    throw new Error("write already in progress");
    
  if (this.pending_close)
    throw new Error("close is pending");
};

Zlib.prototype.write = function(flush, input, in_off, in_len, out, out_off, out_len) {    
  this._writeCheck();
  this.write_in_progress = true;
  
  var self = this;
  process.nextTick(function() {
    self.write_in_progress = false;
    var res = self._write(flush, input, in_off, in_len, out, out_off, out_len);
    self.callback(res[0], res[1]);
    
    if (self.pending_close)
      self.close();
  });
  
  return this;
};

// set method for Node buffers, used by pako
function bufferSet(data, offset) {
  for (var i = 0; i < data.length; i++) {
    this[offset + i] = data[i];
  }
}

Zlib.prototype.writeSync = function(flush, input, in_off, in_len, out, out_off, out_len) {
  this._writeCheck();
  return this._write(flush, input, in_off, in_len, out, out_off, out_len);
};

Zlib.prototype._write = function(flush, input, in_off, in_len, out, out_off, out_len) {
  this.write_in_progress = true;
  
  if (flush !== exports.Z_NO_FLUSH &&
      flush !== exports.Z_PARTIAL_FLUSH &&
      flush !== exports.Z_SYNC_FLUSH &&
      flush !== exports.Z_FULL_FLUSH &&
      flush !== exports.Z_FINISH &&
      flush !== exports.Z_BLOCK) {
    throw new Error("Invalid flush value");
  }
  
  if (input == null) {
    input = new Buffer(0);
    in_len = 0;
    in_off = 0;
  }
  
  if (out._set)
    out.set = out._set;
  else
    out.set = bufferSet;
  
  var strm = this.strm;
  strm.avail_in = in_len;
  strm.input = input;
  strm.next_in = in_off;
  strm.avail_out = out_len;
  strm.output = out;
  strm.next_out = out_off;
  
  switch (this.mode) {
    case exports.DEFLATE:
    case exports.GZIP:
    case exports.DEFLATERAW:
      var status = zlib_deflate.deflate(strm, flush);
      break;
    case exports.UNZIP:
    case exports.INFLATE:
    case exports.GUNZIP:
    case exports.INFLATERAW:
      var status = zlib_inflate.inflate(strm, flush);
      break;
    default:
      throw new Error("Unknown mode " + this.mode);
  }
  
  if (status !== exports.Z_STREAM_END && status !== exports.Z_OK) {
    this._error(status);
  }
  
  this.write_in_progress = false;
  return [strm.avail_in, strm.avail_out];
};

Zlib.prototype.close = function() {
  if (this.write_in_progress) {
    this.pending_close = true;
    return;
  }
  
  this.pending_close = false;
  
  if (this.mode === exports.DEFLATE || this.mode === exports.GZIP || this.mode === exports.DEFLATERAW) {
    zlib_deflate.deflateEnd(this.strm);
  } else {
    zlib_inflate.inflateEnd(this.strm);
  }
  
  this.mode = exports.NONE;
};

Zlib.prototype.reset = function() {
  switch (this.mode) {
    case exports.DEFLATE:
    case exports.DEFLATERAW:
      var status = zlib_deflate.deflateReset(this.strm);
      break;
    case exports.INFLATE:
    case exports.INFLATERAW:
      var status = zlib_inflate.inflateReset(this.strm);
      break;
  }
  
  if (status !== exports.Z_OK) {
    this._error(status);
  }
};

Zlib.prototype._error = function(status) {
  this.onerror(msg[status] + ': ' + this.strm.msg, status);
  
  this.write_in_progress = false;
  if (this.pending_close)
    this.close();
};

exports.Zlib = Zlib;

}).call(this,_dereq_("FWaASH"),_dereq_("buffer").Buffer)
},{"FWaASH":56,"buffer":51,"pako/lib/zlib/constants":40,"pako/lib/zlib/deflate.js":42,"pako/lib/zlib/inflate.js":44,"pako/lib/zlib/messages":46,"pako/lib/zlib/zstream":48}],50:[function(_dereq_,module,exports){
(function (process,Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Transform = _dereq_('_stream_transform');

var binding = _dereq_('./binding');
var util = _dereq_('util');
var assert = _dereq_('assert').ok;

// zlib doesn't provide these, so kludge them in following the same
// const naming scheme zlib uses.
binding.Z_MIN_WINDOWBITS = 8;
binding.Z_MAX_WINDOWBITS = 15;
binding.Z_DEFAULT_WINDOWBITS = 15;

// fewer than 64 bytes per chunk is stupid.
// technically it could work with as few as 8, but even 64 bytes
// is absurdly low.  Usually a MB or more is best.
binding.Z_MIN_CHUNK = 64;
binding.Z_MAX_CHUNK = Infinity;
binding.Z_DEFAULT_CHUNK = (16 * 1024);

binding.Z_MIN_MEMLEVEL = 1;
binding.Z_MAX_MEMLEVEL = 9;
binding.Z_DEFAULT_MEMLEVEL = 8;

binding.Z_MIN_LEVEL = -1;
binding.Z_MAX_LEVEL = 9;
binding.Z_DEFAULT_LEVEL = binding.Z_DEFAULT_COMPRESSION;

// expose all the zlib constants
Object.keys(binding).forEach(function(k) {
  if (k.match(/^Z/)) exports[k] = binding[k];
});

// translation table for return codes.
exports.codes = {
  Z_OK: binding.Z_OK,
  Z_STREAM_END: binding.Z_STREAM_END,
  Z_NEED_DICT: binding.Z_NEED_DICT,
  Z_ERRNO: binding.Z_ERRNO,
  Z_STREAM_ERROR: binding.Z_STREAM_ERROR,
  Z_DATA_ERROR: binding.Z_DATA_ERROR,
  Z_MEM_ERROR: binding.Z_MEM_ERROR,
  Z_BUF_ERROR: binding.Z_BUF_ERROR,
  Z_VERSION_ERROR: binding.Z_VERSION_ERROR
};

Object.keys(exports.codes).forEach(function(k) {
  exports.codes[exports.codes[k]] = k;
});

exports.Deflate = Deflate;
exports.Inflate = Inflate;
exports.Gzip = Gzip;
exports.Gunzip = Gunzip;
exports.DeflateRaw = DeflateRaw;
exports.InflateRaw = InflateRaw;
exports.Unzip = Unzip;

exports.createDeflate = function(o) {
  return new Deflate(o);
};

exports.createInflate = function(o) {
  return new Inflate(o);
};

exports.createDeflateRaw = function(o) {
  return new DeflateRaw(o);
};

exports.createInflateRaw = function(o) {
  return new InflateRaw(o);
};

exports.createGzip = function(o) {
  return new Gzip(o);
};

exports.createGunzip = function(o) {
  return new Gunzip(o);
};

exports.createUnzip = function(o) {
  return new Unzip(o);
};


// Convenience methods.
// compress/decompress a string or buffer in one step.
exports.deflate = function(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Deflate(opts), buffer, callback);
};

exports.deflateSync = function(buffer, opts) {
  return zlibBufferSync(new Deflate(opts), buffer);
};

exports.gzip = function(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Gzip(opts), buffer, callback);
};

exports.gzipSync = function(buffer, opts) {
  return zlibBufferSync(new Gzip(opts), buffer);
};

exports.deflateRaw = function(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new DeflateRaw(opts), buffer, callback);
};

exports.deflateRawSync = function(buffer, opts) {
  return zlibBufferSync(new DeflateRaw(opts), buffer);
};

exports.unzip = function(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Unzip(opts), buffer, callback);
};

exports.unzipSync = function(buffer, opts) {
  return zlibBufferSync(new Unzip(opts), buffer);
};

exports.inflate = function(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Inflate(opts), buffer, callback);
};

exports.inflateSync = function(buffer, opts) {
  return zlibBufferSync(new Inflate(opts), buffer);
};

exports.gunzip = function(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Gunzip(opts), buffer, callback);
};

exports.gunzipSync = function(buffer, opts) {
  return zlibBufferSync(new Gunzip(opts), buffer);
};

exports.inflateRaw = function(buffer, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new InflateRaw(opts), buffer, callback);
};

exports.inflateRawSync = function(buffer, opts) {
  return zlibBufferSync(new InflateRaw(opts), buffer);
};

function zlibBuffer(engine, buffer, callback) {
  var buffers = [];
  var nread = 0;

  engine.on('error', onError);
  engine.on('end', onEnd);

  engine.end(buffer);
  flow();

  function flow() {
    var chunk;
    while (null !== (chunk = engine.read())) {
      buffers.push(chunk);
      nread += chunk.length;
    }
    engine.once('readable', flow);
  }

  function onError(err) {
    engine.removeListener('end', onEnd);
    engine.removeListener('readable', flow);
    callback(err);
  }

  function onEnd() {
    var buf = Buffer.concat(buffers, nread);
    buffers = [];
    callback(null, buf);
    engine.close();
  }
}

function zlibBufferSync(engine, buffer) {
  if (typeof buffer === 'string')
    buffer = new Buffer(buffer);
  if (!Buffer.isBuffer(buffer))
    throw new TypeError('Not a string or buffer');

  var flushFlag = binding.Z_FINISH;

  return engine._processChunk(buffer, flushFlag);
}

// generic zlib
// minimal 2-byte header
function Deflate(opts) {
  if (!(this instanceof Deflate)) return new Deflate(opts);
  Zlib.call(this, opts, binding.DEFLATE);
}

function Inflate(opts) {
  if (!(this instanceof Inflate)) return new Inflate(opts);
  Zlib.call(this, opts, binding.INFLATE);
}



// gzip - bigger header, same deflate compression
function Gzip(opts) {
  if (!(this instanceof Gzip)) return new Gzip(opts);
  Zlib.call(this, opts, binding.GZIP);
}

function Gunzip(opts) {
  if (!(this instanceof Gunzip)) return new Gunzip(opts);
  Zlib.call(this, opts, binding.GUNZIP);
}



// raw - no header
function DeflateRaw(opts) {
  if (!(this instanceof DeflateRaw)) return new DeflateRaw(opts);
  Zlib.call(this, opts, binding.DEFLATERAW);
}

function InflateRaw(opts) {
  if (!(this instanceof InflateRaw)) return new InflateRaw(opts);
  Zlib.call(this, opts, binding.INFLATERAW);
}


// auto-detect header.
function Unzip(opts) {
  if (!(this instanceof Unzip)) return new Unzip(opts);
  Zlib.call(this, opts, binding.UNZIP);
}


// the Zlib class they all inherit from
// This thing manages the queue of requests, and returns
// true or false if there is anything in the queue when
// you call the .write() method.

function Zlib(opts, mode) {
  this._opts = opts = opts || {};
  this._chunkSize = opts.chunkSize || exports.Z_DEFAULT_CHUNK;

  Transform.call(this, opts);

  if (opts.flush) {
    if (opts.flush !== binding.Z_NO_FLUSH &&
        opts.flush !== binding.Z_PARTIAL_FLUSH &&
        opts.flush !== binding.Z_SYNC_FLUSH &&
        opts.flush !== binding.Z_FULL_FLUSH &&
        opts.flush !== binding.Z_FINISH &&
        opts.flush !== binding.Z_BLOCK) {
      throw new Error('Invalid flush flag: ' + opts.flush);
    }
  }
  this._flushFlag = opts.flush || binding.Z_NO_FLUSH;

  if (opts.chunkSize) {
    if (opts.chunkSize < exports.Z_MIN_CHUNK ||
        opts.chunkSize > exports.Z_MAX_CHUNK) {
      throw new Error('Invalid chunk size: ' + opts.chunkSize);
    }
  }

  if (opts.windowBits) {
    if (opts.windowBits < exports.Z_MIN_WINDOWBITS ||
        opts.windowBits > exports.Z_MAX_WINDOWBITS) {
      throw new Error('Invalid windowBits: ' + opts.windowBits);
    }
  }

  if (opts.level) {
    if (opts.level < exports.Z_MIN_LEVEL ||
        opts.level > exports.Z_MAX_LEVEL) {
      throw new Error('Invalid compression level: ' + opts.level);
    }
  }

  if (opts.memLevel) {
    if (opts.memLevel < exports.Z_MIN_MEMLEVEL ||
        opts.memLevel > exports.Z_MAX_MEMLEVEL) {
      throw new Error('Invalid memLevel: ' + opts.memLevel);
    }
  }

  if (opts.strategy) {
    if (opts.strategy != exports.Z_FILTERED &&
        opts.strategy != exports.Z_HUFFMAN_ONLY &&
        opts.strategy != exports.Z_RLE &&
        opts.strategy != exports.Z_FIXED &&
        opts.strategy != exports.Z_DEFAULT_STRATEGY) {
      throw new Error('Invalid strategy: ' + opts.strategy);
    }
  }

  if (opts.dictionary) {
    if (!Buffer.isBuffer(opts.dictionary)) {
      throw new Error('Invalid dictionary: it should be a Buffer instance');
    }
  }

  this._binding = new binding.Zlib(mode);

  var self = this;
  this._hadError = false;
  this._binding.onerror = function(message, errno) {
    // there is no way to cleanly recover.
    // continuing only obscures problems.
    self._binding = null;
    self._hadError = true;

    var error = new Error(message);
    error.errno = errno;
    error.code = exports.codes[errno];
    self.emit('error', error);
  };

  var level = exports.Z_DEFAULT_COMPRESSION;
  if (typeof opts.level === 'number') level = opts.level;

  var strategy = exports.Z_DEFAULT_STRATEGY;
  if (typeof opts.strategy === 'number') strategy = opts.strategy;

  this._binding.init(opts.windowBits || exports.Z_DEFAULT_WINDOWBITS,
                     level,
                     opts.memLevel || exports.Z_DEFAULT_MEMLEVEL,
                     strategy,
                     opts.dictionary);

  this._buffer = new Buffer(this._chunkSize);
  this._offset = 0;
  this._closed = false;
  this._level = level;
  this._strategy = strategy;

  this.once('end', this.close);
}

util.inherits(Zlib, Transform);

Zlib.prototype.params = function(level, strategy, callback) {
  if (level < exports.Z_MIN_LEVEL ||
      level > exports.Z_MAX_LEVEL) {
    throw new RangeError('Invalid compression level: ' + level);
  }
  if (strategy != exports.Z_FILTERED &&
      strategy != exports.Z_HUFFMAN_ONLY &&
      strategy != exports.Z_RLE &&
      strategy != exports.Z_FIXED &&
      strategy != exports.Z_DEFAULT_STRATEGY) {
    throw new TypeError('Invalid strategy: ' + strategy);
  }

  if (this._level !== level || this._strategy !== strategy) {
    var self = this;
    this.flush(binding.Z_SYNC_FLUSH, function() {
      self._binding.params(level, strategy);
      if (!self._hadError) {
        self._level = level;
        self._strategy = strategy;
        if (callback) callback();
      }
    });
  } else {
    process.nextTick(callback);
  }
};

Zlib.prototype.reset = function() {
  return this._binding.reset();
};

// This is the _flush function called by the transform class,
// internally, when the last chunk has been written.
Zlib.prototype._flush = function(callback) {
  this._transform(new Buffer(0), '', callback);
};

Zlib.prototype.flush = function(kind, callback) {
  var ws = this._writableState;

  if (typeof kind === 'function' || (kind === void 0 && !callback)) {
    callback = kind;
    kind = binding.Z_FULL_FLUSH;
  }

  if (ws.ended) {
    if (callback)
      process.nextTick(callback);
  } else if (ws.ending) {
    if (callback)
      this.once('end', callback);
  } else if (ws.needDrain) {
    var self = this;
    this.once('drain', function() {
      self.flush(callback);
    });
  } else {
    this._flushFlag = kind;
    this.write(new Buffer(0), '', callback);
  }
};

Zlib.prototype.close = function(callback) {
  if (callback)
    process.nextTick(callback);

  if (this._closed)
    return;

  this._closed = true;

  this._binding.close();

  var self = this;
  process.nextTick(function() {
    self.emit('close');
  });
};

Zlib.prototype._transform = function(chunk, encoding, cb) {
  var flushFlag;
  var ws = this._writableState;
  var ending = ws.ending || ws.ended;
  var last = ending && (!chunk || ws.length === chunk.length);

  if (!chunk === null && !Buffer.isBuffer(chunk))
    return cb(new Error('invalid input'));

  // If it's the last chunk, or a final flush, we use the Z_FINISH flush flag.
  // If it's explicitly flushing at some other time, then we use
  // Z_FULL_FLUSH. Otherwise, use Z_NO_FLUSH for maximum compression
  // goodness.
  if (last)
    flushFlag = binding.Z_FINISH;
  else {
    flushFlag = this._flushFlag;
    // once we've flushed the last of the queue, stop flushing and
    // go back to the normal behavior.
    if (chunk.length >= ws.length) {
      this._flushFlag = this._opts.flush || binding.Z_NO_FLUSH;
    }
  }

  var self = this;
  this._processChunk(chunk, flushFlag, cb);
};

Zlib.prototype._processChunk = function(chunk, flushFlag, cb) {
  var availInBefore = chunk && chunk.length;
  var availOutBefore = this._chunkSize - this._offset;
  var inOff = 0;

  var self = this;

  var async = typeof cb === 'function';

  if (!async) {
    var buffers = [];
    var nread = 0;

    var error;
    this.on('error', function(er) {
      error = er;
    });

    do {
      var res = this._binding.writeSync(flushFlag,
                                        chunk, // in
                                        inOff, // in_off
                                        availInBefore, // in_len
                                        this._buffer, // out
                                        this._offset, //out_off
                                        availOutBefore); // out_len
    } while (!this._hadError && callback(res[0], res[1]));

    if (this._hadError) {
      throw error;
    }

    var buf = Buffer.concat(buffers, nread);
    this.close();

    return buf;
  }

  var req = this._binding.write(flushFlag,
                                chunk, // in
                                inOff, // in_off
                                availInBefore, // in_len
                                this._buffer, // out
                                this._offset, //out_off
                                availOutBefore); // out_len

  req.buffer = chunk;
  req.callback = callback;

  function callback(availInAfter, availOutAfter) {
    if (self._hadError)
      return;

    var have = availOutBefore - availOutAfter;
    assert(have >= 0, 'have should not go down');

    if (have > 0) {
      var out = self._buffer.slice(self._offset, self._offset + have);
      self._offset += have;
      // serve some output to the consumer.
      if (async) {
        self.push(out);
      } else {
        buffers.push(out);
        nread += out.length;
      }
    }

    // exhausted the output buffer, or used all the input create a new one.
    if (availOutAfter === 0 || self._offset >= self._chunkSize) {
      availOutBefore = self._chunkSize;
      self._offset = 0;
      self._buffer = new Buffer(self._chunkSize);
    }

    if (availOutAfter === 0) {
      // Not actually done.  Need to reprocess.
      // Also, update the availInBefore to the availInAfter value,
      // so that if we have to hit it a third (fourth, etc.) time,
      // it'll have the correct byte counts.
      inOff += (availInBefore - availInAfter);
      availInBefore = availInAfter;

      if (!async)
        return true;

      var newReq = self._binding.write(flushFlag,
                                       chunk,
                                       inOff,
                                       availInBefore,
                                       self._buffer,
                                       self._offset,
                                       self._chunkSize);
      newReq.callback = callback; // this same function
      newReq.buffer = chunk;
      return;
    }

    if (!async)
      return false;

    // finished with the chunk.
    cb();
  }
};

util.inherits(Deflate, Zlib);
util.inherits(Inflate, Zlib);
util.inherits(Gzip, Zlib);
util.inherits(Gunzip, Zlib);
util.inherits(DeflateRaw, Zlib);
util.inherits(InflateRaw, Zlib);
util.inherits(Unzip, Zlib);

}).call(this,_dereq_("FWaASH"),_dereq_("buffer").Buffer)
},{"./binding":49,"FWaASH":56,"_stream_transform":62,"assert":37,"buffer":51,"util":66}],51:[function(_dereq_,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = _dereq_('base64-js')
var ieee754 = _dereq_('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":52,"ieee754":53}],52:[function(_dereq_,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],53:[function(_dereq_,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],54:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],55:[function(_dereq_,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],56:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],57:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;
var inherits = _dereq_('inherits');
var setImmediate = _dereq_('process/browser.js').nextTick;
var Readable = _dereq_('./readable.js');
var Writable = _dereq_('./writable.js');

inherits(Duplex, Readable);

Duplex.prototype.write = Writable.prototype.write;
Duplex.prototype.end = Writable.prototype.end;
Duplex.prototype._write = Writable.prototype._write;

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  var self = this;
  setImmediate(function () {
    self.end();
  });
}

},{"./readable.js":61,"./writable.js":63,"inherits":55,"process/browser.js":59}],58:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = _dereq_('events').EventEmitter;
var inherits = _dereq_('inherits');

inherits(Stream, EE);
Stream.Readable = _dereq_('./readable.js');
Stream.Writable = _dereq_('./writable.js');
Stream.Duplex = _dereq_('./duplex.js');
Stream.Transform = _dereq_('./transform.js');
Stream.PassThrough = _dereq_('./passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"./duplex.js":57,"./passthrough.js":60,"./readable.js":61,"./transform.js":62,"./writable.js":63,"events":54,"inherits":55}],59:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],60:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = _dereq_('./transform.js');
var inherits = _dereq_('inherits');
inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./transform.js":62,"inherits":55}],61:[function(_dereq_,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;
Readable.ReadableState = ReadableState;

var EE = _dereq_('events').EventEmitter;
var Stream = _dereq_('./index.js');
var Buffer = _dereq_('buffer').Buffer;
var setImmediate = _dereq_('process/browser.js').nextTick;
var StringDecoder;

var inherits = _dereq_('inherits');
inherits(Readable, Stream);

function ReadableState(options, stream) {
  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = false;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // In streams that never have any data, and do push(null) right away,
  // the consumer can miss the 'end' event if they do some I/O before
  // consuming the stream.  So, we don't emit('end') until some reading
  // happens.
  this.calledRead = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = _dereq_('string_decoder').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (typeof chunk === 'string' && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null || chunk === undefined) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) {
        state.buffer.unshift(chunk);
      } else {
        state.reading = false;
        state.buffer.push(chunk);
      }

      if (state.needReadable)
        emitReadable(stream);

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = _dereq_('string_decoder').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (isNaN(n) || n === null) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  var state = this._readableState;
  state.calledRead = true;
  var nOrig = n;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;

  // if we currently have less than the highWaterMark, then also read some
  if (state.length - n <= state.highWaterMark)
    doRead = true;

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading)
    doRead = false;

  if (doRead) {
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read called its callback synchronously, then `reading`
  // will be false, and we need to re-evaluate how much data we
  // can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we happened to read() exactly the remaining amount in the
  // buffer, and the EOF has been seen at this point, then make sure
  // that we emit 'end' on the very next tick.
  if (state.ended && !state.endEmitted && state.length === 0)
    endReadable(this);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode &&
      !er) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // if we've ended and we have some data left, then emit
  // 'readable' now to make sure it gets picked up.
  if (state.length > 0)
    emitReadable(stream);
  else
    endReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (state.emittedReadable)
    return;

  state.emittedReadable = true;
  if (state.sync)
    setImmediate(function() {
      emitReadable_(stream);
    });
  else
    emitReadable_(stream);
}

function emitReadable_(stream) {
  stream.emit('readable');
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    setImmediate(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    setImmediate(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    if (readable !== src) return;
    cleanup();
  }

  function onend() {
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (!dest._writableState || dest._writableState.needDrain)
      ondrain();
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  // check for listeners before emit removes one-time listeners.
  var errListeners = EE.listenerCount(dest, 'error');
  function onerror(er) {
    unpipe();
    if (errListeners === 0 && EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  dest.once('error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    // the handler that waits for readable events after all
    // the data gets sucked out in flow.
    // This would be easier to follow with a .once() handler
    // in flow(), but that is too slow.
    this.on('readable', pipeOnReadable);

    state.flowing = true;
    setImmediate(function() {
      flow(src);
    });
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var dest = this;
    var state = src._readableState;
    state.awaitDrain--;
    if (state.awaitDrain === 0)
      flow(src);
  };
}

function flow(src) {
  var state = src._readableState;
  var chunk;
  state.awaitDrain = 0;

  function write(dest, i, list) {
    var written = dest.write(chunk);
    if (false === written) {
      state.awaitDrain++;
    }
  }

  while (state.pipesCount && null !== (chunk = src.read())) {

    if (state.pipesCount === 1)
      write(state.pipes, 0, null);
    else
      forEach(state.pipes, write);

    src.emit('data', chunk);

    // if anyone needs a drain, then we have to wait for that.
    if (state.awaitDrain > 0)
      return;
  }

  // if every destination was unpiped, either before entering this
  // function, or in the while loop, then stop flowing.
  //
  // NB: This is a pretty rare edge case.
  if (state.pipesCount === 0) {
    state.flowing = false;

    // if there were data event listeners added, then switch to old mode.
    if (EE.listenerCount(src, 'data') > 0)
      emitDataEvents(src);
    return;
  }

  // at this point, no one needed a drain, so we just ran out of data
  // on the next readable event, start it over again.
  state.ranOut = true;
}

function pipeOnReadable() {
  if (this._readableState.ranOut) {
    this._readableState.ranOut = false;
    flow(this);
  }
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data' && !this._readableState.flowing)
    emitDataEvents(this);

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        this.read(0);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  emitDataEvents(this);
  this.read(0);
  this.emit('resume');
};

Readable.prototype.pause = function() {
  emitDataEvents(this, true);
  this.emit('pause');
};

function emitDataEvents(stream, startPaused) {
  var state = stream._readableState;

  if (state.flowing) {
    // https://github.com/isaacs/readable-stream/issues/16
    throw new Error('Cannot switch to old mode now.');
  }

  var paused = startPaused || false;
  var readable = false;

  // convert to an old-style stream.
  stream.readable = true;
  stream.pipe = Stream.prototype.pipe;
  stream.on = stream.addListener = Stream.prototype.on;

  stream.on('readable', function() {
    readable = true;

    var c;
    while (!paused && (null !== (c = stream.read())))
      stream.emit('data', c);

    if (c === null) {
      readable = false;
      stream._readableState.needReadable = true;
    }
  });

  stream.pause = function() {
    paused = true;
    this.emit('pause');
  };

  stream.resume = function() {
    paused = false;
    if (readable)
      setImmediate(function() {
        stream.emit('readable');
      });
    else
      this.read(0);
    this.emit('resume');
  };

  // now make it start, just in case it hadn't already.
  stream.emit('readable');
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    if (state.decoder)
      chunk = state.decoder.write(chunk);
    if (!chunk || !state.objectMode && !chunk.length)
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (typeof stream[i] === 'function' &&
        typeof this[i] === 'undefined') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, function (x) {
      return self.emit.apply(self, ev, x);
    });
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted && state.calledRead) {
    state.ended = true;
    setImmediate(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,_dereq_("FWaASH"))
},{"./index.js":58,"FWaASH":56,"buffer":51,"events":54,"inherits":55,"process/browser.js":59,"string_decoder":64}],62:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = _dereq_('./duplex.js');
var inherits = _dereq_('inherits');
inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  var ts = this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('finish', function() {
    if ('function' === typeof this._flush)
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var rs = stream._readableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./duplex.js":57,"inherits":55}],63:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;
Writable.WritableState = WritableState;

var isUint8Array = typeof Uint8Array !== 'undefined'
  ? function (x) { return x instanceof Uint8Array }
  : function (x) {
    return x && x.constructor && x.constructor.name === 'Uint8Array'
  }
;
var isArrayBuffer = typeof ArrayBuffer !== 'undefined'
  ? function (x) { return x instanceof ArrayBuffer }
  : function (x) {
    return x && x.constructor && x.constructor.name === 'ArrayBuffer'
  }
;

var inherits = _dereq_('inherits');
var Stream = _dereq_('./index.js');
var setImmediate = _dereq_('process/browser.js').nextTick;
var Buffer = _dereq_('buffer').Buffer;

inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];
}

function Writable(options) {
  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Stream.Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  setImmediate(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    setImmediate(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (!Buffer.isBuffer(chunk) && isUint8Array(chunk))
    chunk = new Buffer(chunk);
  if (isArrayBuffer(chunk) && typeof Uint8Array !== 'undefined')
    chunk = new Buffer(new Uint8Array(chunk));
  
  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb))
    ret = writeOrBuffer(this, state, chunk, encoding, cb);

  return ret;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  state.needDrain = !ret;

  if (state.writing)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    setImmediate(function() {
      cb(er);
    });
  else
    cb(er);

  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished && !state.bufferProcessing && state.buffer.length)
      clearBuffer(stream, state);

    if (sync) {
      setImmediate(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  cb();
  if (finished)
    finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  for (var c = 0; c < state.buffer.length; c++) {
    var entry = state.buffer[c];
    var chunk = entry.chunk;
    var encoding = entry.encoding;
    var cb = entry.callback;
    var len = state.objectMode ? 1 : chunk.length;

    doWrite(stream, state, len, chunk, encoding, cb);

    // if we didn't call the onwrite immediately, then
    // it means that we need to wait until it does.
    // also, that means that the chunk and cb are currently
    // being processed, so move the buffer counter past them.
    if (state.writing) {
      c++;
      break;
    }
  }

  state.bufferProcessing = false;
  if (c < state.buffer.length)
    state.buffer = state.buffer.slice(c);
  else
    state.buffer.length = 0;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (typeof chunk !== 'undefined' && chunk !== null)
    this.write(chunk, encoding);

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    state.finished = true;
    stream.emit('finish');
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      setImmediate(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

},{"./index.js":58,"buffer":51,"inherits":55,"process/browser.js":59}],64:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = _dereq_('buffer').Buffer;

function assertEncoding(encoding) {
  if (encoding && !Buffer.isEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  this.charBuffer = new Buffer(6);
  this.charReceived = 0;
  this.charLength = 0;
};


StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  var offset = 0;

  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var i = (buffer.length >= this.charLength - this.charReceived) ?
                this.charLength - this.charReceived :
                buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, offset, i);
    this.charReceived += (i - offset);
    offset = i;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (i == buffer.length) return charStr;

    // otherwise cut off the characters end from the beginning of this buffer
    buffer = buffer.slice(i, buffer.length);
    break;
  }

  var lenIncomplete = this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - lenIncomplete, end);
    this.charReceived = lenIncomplete;
    end -= lenIncomplete;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    this.charBuffer.write(charStr.charAt(charStr.length - 1), this.encoding);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }

  return i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  var incomplete = this.charReceived = buffer.length % 2;
  this.charLength = incomplete ? 2 : 0;
  return incomplete;
}

function base64DetectIncompleteChar(buffer) {
  var incomplete = this.charReceived = buffer.length % 3;
  this.charLength = incomplete ? 3 : 0;
  return incomplete;
}

},{"buffer":51}],65:[function(_dereq_,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],66:[function(_dereq_,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = _dereq_('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = _dereq_('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,_dereq_("FWaASH"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":65,"FWaASH":56,"inherits":55}],67:[function(_dereq_,module,exports){
// Generated by CoffeeScript 1.7.1
var UnicodeTrie,
  __slice = [].slice;

UnicodeTrie = (function() {
  var DATA_BLOCK_LENGTH, DATA_GRANULARITY, DATA_MASK, INDEX_1_OFFSET, INDEX_2_BLOCK_LENGTH, INDEX_2_BMP_LENGTH, INDEX_2_MASK, INDEX_SHIFT, LSCP_INDEX_2_LENGTH, LSCP_INDEX_2_OFFSET, OMITTED_BMP_INDEX_1_LENGTH, SHIFT_1, SHIFT_1_2, SHIFT_2, UTF8_2B_INDEX_2_LENGTH, UTF8_2B_INDEX_2_OFFSET;

  SHIFT_1 = 6 + 5;

  SHIFT_2 = 5;

  SHIFT_1_2 = SHIFT_1 - SHIFT_2;

  OMITTED_BMP_INDEX_1_LENGTH = 0x10000 >> SHIFT_1;

  INDEX_2_BLOCK_LENGTH = 1 << SHIFT_1_2;

  INDEX_2_MASK = INDEX_2_BLOCK_LENGTH - 1;

  INDEX_SHIFT = 2;

  DATA_BLOCK_LENGTH = 1 << SHIFT_2;

  DATA_MASK = DATA_BLOCK_LENGTH - 1;

  LSCP_INDEX_2_OFFSET = 0x10000 >> SHIFT_2;

  LSCP_INDEX_2_LENGTH = 0x400 >> SHIFT_2;

  INDEX_2_BMP_LENGTH = LSCP_INDEX_2_OFFSET + LSCP_INDEX_2_LENGTH;

  UTF8_2B_INDEX_2_OFFSET = INDEX_2_BMP_LENGTH;

  UTF8_2B_INDEX_2_LENGTH = 0x800 >> 6;

  INDEX_1_OFFSET = UTF8_2B_INDEX_2_OFFSET + UTF8_2B_INDEX_2_LENGTH;

  DATA_GRANULARITY = 1 << INDEX_SHIFT;

  function UnicodeTrie(json) {
    var _ref, _ref1;
    if (json == null) {
      json = {};
    }
    this.data = json.data || [];
    this.highStart = (_ref = json.highStart) != null ? _ref : 0;
    this.errorValue = (_ref1 = json.errorValue) != null ? _ref1 : -1;
  }

  UnicodeTrie.prototype.get = function(codePoint) {
    var index;
    if (codePoint < 0 || codePoint > 0x10ffff) {
      return this.errorValue;
    }
    if (codePoint < 0xd800 || (codePoint > 0xdbff && codePoint <= 0xffff)) {
      index = (this.data[codePoint >> SHIFT_2] << INDEX_SHIFT) + (codePoint & DATA_MASK);
      return this.data[index];
    }
    if (codePoint <= 0xffff) {
      index = (this.data[LSCP_INDEX_2_OFFSET + ((codePoint - 0xd800) >> SHIFT_2)] << INDEX_SHIFT) + (codePoint & DATA_MASK);
      return this.data[index];
    }
    if (codePoint < this.highStart) {
      index = this.data[(INDEX_1_OFFSET - OMITTED_BMP_INDEX_1_LENGTH) + (codePoint >> SHIFT_1)];
      index = this.data[index + ((codePoint >> SHIFT_2) & INDEX_2_MASK)];
      index = (index << INDEX_SHIFT) + (codePoint & DATA_MASK);
      return this.data[index];
    }
    return this.data[this.data.length - DATA_GRANULARITY];
  };

  UnicodeTrie.prototype.toJSON = function() {
    var res;
    res = {
      data: __slice.call(this.data),
      highStart: this.highStart,
      errorValue: this.errorValue
    };
    return res;
  };

  return UnicodeTrie;

})();

module.exports = UnicodeTrie;

},{}],68:[function(_dereq_,module,exports){
module.exports={"data":[1961,1969,1977,1985,2025,2033,2041,2049,2057,2065,2073,2081,2089,2097,2105,2113,2121,2129,2137,2145,2153,2161,2169,2177,2185,2193,2201,2209,2217,2225,2233,2241,2249,2257,2265,2273,2281,2289,2297,2305,2313,2321,2329,2337,2345,2353,2361,2369,2377,2385,2393,2401,2409,2417,2425,2433,2441,2449,2457,2465,2473,2481,2489,2497,2505,2513,2521,2529,2529,2537,2009,2545,2553,2561,2569,2577,2585,2593,2601,2609,2617,2625,2633,2641,2649,2657,2665,2673,2681,2689,2697,2705,2713,2721,2729,2737,2745,2753,2761,2769,2777,2785,2793,2801,2809,2817,2825,2833,2841,2849,2857,2865,2873,2881,2889,2009,2897,2905,2913,2009,2921,2929,2937,2945,2953,2961,2969,2009,2977,2977,2985,2993,3001,3009,3009,3009,3017,3017,3017,3025,3025,3033,3041,3041,3049,3049,3049,3049,3049,3049,3049,3049,3049,3049,3057,3065,3073,3073,3073,3081,3089,3097,3097,3097,3097,3097,3097,3097,3097,3097,3097,3097,3097,3097,3097,3097,3097,3097,3097,3097,3105,3113,3113,3121,3129,3137,3145,3153,3161,3161,3169,3177,3185,3193,3193,3193,3193,3201,3209,3209,3217,3225,3233,3241,3241,3241,3249,3257,3265,3273,3273,3281,3289,3297,2009,2009,3305,3313,3321,3329,3337,3345,3353,3361,3369,3377,3385,3393,2009,2009,3401,3409,3417,3417,3417,3417,3417,3417,3425,3425,3433,3433,3433,3433,3433,3433,3433,3433,3433,3433,3433,3433,3433,3433,3433,3441,3449,3457,3465,3473,3481,3489,3497,3505,3513,3521,3529,3537,3545,3553,3561,3569,3577,3585,3593,3601,3609,3617,3625,3625,3633,3641,3649,3649,3649,3649,3649,3657,3665,3665,3673,3681,3681,3681,3681,3689,3697,3697,3705,3713,3721,3729,3737,3745,3753,3761,3769,3777,3785,3793,3801,3809,3817,3825,3833,3841,3849,3857,3865,3873,3881,3881,3881,3881,3881,3881,3881,3881,3881,3881,3881,3881,3889,3897,3905,3913,3921,3921,3921,3921,3921,3921,3921,3921,3921,3921,3929,2009,2009,2009,2009,2009,3937,3937,3937,3937,3937,3937,3937,3945,3953,3953,3953,3961,3969,3969,3977,3985,3993,4001,2009,2009,4009,4009,4009,4009,4009,4009,4009,4009,4009,4009,4009,4009,4017,4025,4033,4041,4049,4057,4065,4073,4081,4081,4081,4081,4081,4081,4081,4089,4097,4097,4105,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4113,4121,4121,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4129,4137,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4145,4153,4161,4169,4169,4169,4169,4169,4169,4169,4169,4177,4185,4193,4201,4209,4217,4217,4225,4233,4233,4233,4233,4233,4233,4233,4233,4241,4249,4257,4265,4273,4281,4289,4297,4305,4313,4321,4329,4337,4345,4353,4361,4361,4369,4377,4385,4385,4385,4385,4393,4401,4409,4409,4409,4409,4409,4409,4417,4425,4433,4441,4449,4457,4465,4473,4481,4489,4497,4505,4513,4521,4529,4537,4545,4553,4561,4569,4577,4585,4593,4601,4609,4617,4625,4633,4641,4649,4657,4665,4673,4681,4689,4697,4705,4713,4721,4729,4737,4745,4753,4761,4769,4777,4785,4793,4801,4809,4817,4825,4833,4841,4849,4857,4865,4873,4881,4889,4897,4905,4913,4921,4929,4937,4945,4953,4961,4969,4977,4985,4993,5001,5009,5017,5025,5033,5041,5049,5057,5065,5073,5081,5089,5097,5105,5113,5121,5129,5137,5145,5153,5161,5169,5177,5185,5193,5201,5209,5217,5225,5233,5241,5249,5257,5265,5273,5281,5289,5297,5305,5313,5321,5329,5337,5345,5353,5361,5369,5377,5385,5393,5401,5409,5417,5425,5433,5441,5449,5457,5465,5473,5481,5489,5497,5505,5513,5521,5529,5537,5545,5553,5561,5569,5577,5585,5593,5601,5609,5617,5625,5633,5641,5649,5657,5665,5673,5681,5689,5697,5705,5713,5721,5729,5737,5745,5753,5761,5769,5777,5785,5793,5801,5809,5817,5825,5833,5841,5849,5857,5865,5873,5881,5889,5897,5905,5913,5921,5929,5937,5945,5953,5961,5969,5977,5985,5993,6001,6009,6017,6025,6033,6041,6049,6057,6065,6073,6081,6089,6097,6105,6113,6121,6129,6137,6145,6153,6161,6169,6177,6185,6193,6201,6209,6217,6225,6233,6241,6249,6257,6265,6273,6281,6289,6297,6305,6313,6321,6329,6337,6345,6353,6361,6369,6377,6385,6393,6401,6409,6417,6425,6433,6441,6449,6457,6465,6473,6481,6489,6497,6505,6513,6521,6529,6537,6545,6553,6561,6569,6577,6585,6593,6601,6609,6617,6625,6633,6641,6649,6657,6665,6673,6681,6689,6697,6705,6713,6721,6729,6737,6745,6753,6761,6769,6777,6785,6793,6801,6809,6817,6825,6833,6841,6849,6857,6865,6873,6881,6889,6897,6905,6913,6921,6929,6937,6945,6953,6961,6969,6977,6985,6993,7001,7009,7017,7025,7033,7041,7049,7057,7065,7073,7081,7089,7097,7105,7113,7121,7129,7137,7145,7153,7161,7169,7177,7185,7193,7201,7209,7217,7225,7233,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,7249,7249,7249,7249,7249,7249,7249,7249,7249,7249,7249,7249,7249,7249,7249,7249,7257,7265,7273,7281,7281,7281,7281,7281,7281,7281,7281,7281,7281,7281,7281,7281,7281,7289,7297,7305,7305,7305,7305,7313,7321,7329,7337,7345,7353,7353,7353,7361,7369,7377,7385,7393,7401,7409,7417,7425,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7241,7972,7972,8100,8164,8228,8292,8356,8420,8484,8548,8612,8676,8740,8804,8868,8932,8996,9060,9124,9188,9252,9316,9380,9444,9508,9572,9636,9700,9764,9828,9892,9956,2593,2657,2721,2529,2785,2529,2849,2913,2977,3041,3105,3169,3233,3297,2529,2529,2529,2529,2529,2529,2529,2529,3361,2529,2529,2529,3425,2529,2529,3489,3553,2529,3617,3681,3745,3809,3873,3937,4001,4065,4129,4193,4257,4321,4385,4449,4513,4577,4641,4705,4769,4833,4897,4961,5025,5089,5153,5217,5281,5345,5409,5473,5537,5601,5665,5729,5793,5857,5921,5985,6049,6113,6177,6241,6305,6369,6433,6497,6561,6625,6689,6753,6817,6881,6945,7009,7073,7137,7201,7265,7329,7393,7457,7521,7585,7649,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,2529,7713,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,7433,7433,7433,7433,7433,7433,7433,7441,7449,7457,7457,7457,7457,7457,7457,7465,2009,2009,2009,2009,7473,7473,7473,7473,7473,7473,7473,7473,7481,7489,7497,7505,7505,7505,7505,7505,7513,7521,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,7529,7529,7537,7545,7545,7545,7545,7545,7553,7561,7561,7561,7561,7561,7561,7561,7569,7577,7585,7593,7593,7593,7593,7593,7593,7601,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7609,7617,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,7625,7633,7641,7649,7657,7665,7673,7681,7689,7697,7705,2009,7713,7721,7729,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,7737,7745,7753,2009,2009,2009,2009,2009,2009,2009,2009,2009,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7761,7769,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,7777,7777,7777,7777,7777,7777,7777,7777,7777,7777,7777,7777,7777,7777,7777,7777,7777,7777,7785,7793,7801,7809,7809,7809,7809,7809,7809,7817,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7825,7833,7841,7849,2009,2009,2009,7857,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,7865,7865,7865,7865,7865,7865,7865,7865,7865,7865,7865,7873,7881,7889,7897,7897,7897,7897,7905,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7913,7921,7929,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,7937,7937,7937,7937,7937,7937,7937,7945,2009,2009,2009,2009,2009,2009,2009,2009,7953,7953,7953,7953,7953,7953,7953,2009,7961,7969,7977,7985,7993,2009,2009,8001,8009,8009,8009,8009,8009,8009,8009,8009,8009,8009,8009,8009,8009,8017,8025,8025,8025,8025,8025,8025,8025,8033,8041,8049,8057,8065,8073,8081,8081,8081,8081,8081,8081,8081,8081,8081,8081,8081,8089,2009,8097,8097,8097,8105,2009,2009,2009,2009,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8113,8121,8129,8137,8137,8137,8137,8137,8137,8137,8137,8137,8137,8137,8137,8137,8137,8145,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,2009,67496,67496,67496,21,21,21,21,21,21,21,21,21,17,34,30,30,33,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,38,6,3,12,9,10,12,3,0,2,12,9,8,16,8,7,11,11,11,11,11,11,11,11,11,11,8,8,12,12,12,6,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,0,9,2,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,0,17,1,12,21,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,21,21,21,21,21,35,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,4,0,10,9,9,9,12,29,29,12,29,3,12,17,12,12,10,9,29,29,18,12,29,29,29,29,29,3,29,29,29,0,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,18,29,29,29,18,29,12,12,29,12,12,12,12,12,12,12,29,29,29,29,12,29,12,18,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,4,21,21,21,21,21,21,21,21,21,21,21,21,4,4,4,4,4,4,4,21,21,21,21,21,21,21,21,21,21,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,8,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,8,17,39,39,39,39,9,39,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,17,21,12,21,21,12,21,21,6,21,39,39,39,39,39,39,39,39,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,10,10,10,8,8,12,12,21,21,21,21,21,21,21,21,21,21,21,6,6,6,6,6,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,11,11,11,11,11,11,11,11,11,11,10,11,11,12,12,12,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,6,12,21,21,21,21,21,21,21,12,12,21,21,21,21,21,21,12,12,21,21,12,21,21,21,21,12,12,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,12,39,39,39,39,39,39,39,39,39,39,39,39,39,39,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,12,12,12,12,8,6,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,12,21,21,21,21,21,21,21,21,21,12,21,21,21,12,21,21,21,21,21,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,12,21,21,21,21,21,21,21,12,12,12,12,12,12,12,12,12,12,21,21,17,17,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,21,21,21,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,21,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,12,39,39,39,39,39,39,39,39,21,39,39,39,39,12,12,12,12,12,12,21,21,39,39,11,11,11,11,11,11,11,11,11,11,12,12,10,10,12,12,12,12,12,10,12,9,39,39,39,39,39,21,21,21,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,39,39,39,39,39,12,12,12,12,12,12,39,39,39,39,39,39,39,11,11,11,11,11,11,11,11,11,11,21,21,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,21,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,39,39,11,11,11,11,11,11,11,11,11,11,12,9,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,21,21,21,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,21,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,39,39,12,12,12,12,12,12,21,21,39,39,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,39,39,39,39,39,39,39,39,39,39,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,39,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,12,39,39,39,39,39,39,21,39,39,39,39,39,39,39,39,39,39,39,39,39,39,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,9,12,39,39,39,39,39,39,21,21,21,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,12,12,12,12,12,12,12,12,12,12,21,21,39,39,11,11,11,11,11,11,11,11,11,11,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,39,39,21,21,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,21,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,39,39,39,39,39,12,12,12,12,21,21,39,39,11,11,11,11,11,11,11,11,11,11,39,12,12,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,21,21,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,12,39,39,39,39,39,39,39,39,21,39,39,39,39,39,39,39,39,12,12,21,21,39,39,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,39,39,39,10,12,12,12,12,12,12,39,39,21,21,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,12,39,39,39,39,39,39,39,39,39,39,39,39,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,39,39,39,39,9,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,12,11,11,11,11,11,11,11,11,11,11,17,17,39,39,39,39,39,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,39,39,11,11,11,11,11,11,11,11,11,11,39,39,36,36,36,36,12,18,18,18,18,12,18,18,4,18,18,17,4,6,6,6,6,6,4,12,6,12,12,12,21,21,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,17,21,12,21,12,21,0,1,0,1,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,39,21,21,21,21,21,21,21,21,21,21,21,21,21,21,17,21,21,21,21,21,17,21,21,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,17,17,12,12,12,12,12,12,21,12,12,12,12,12,12,12,12,12,18,18,17,18,12,12,12,12,12,4,4,39,39,39,39,39,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,11,11,11,11,11,11,11,11,11,11,17,17,12,12,12,12,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,11,11,11,11,11,11,11,11,11,11,36,36,36,36,36,36,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,21,21,21,12,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,39,39,39,39,39,39,39,39,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,0,1,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,17,17,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,39,39,39,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,17,17,39,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,39,39,39,39,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,21,21,39,39,39,39,39,39,39,39,39,39,39,39,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,17,17,5,36,17,12,17,9,36,36,39,39,11,11,11,11,11,11,11,11,11,11,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,6,6,17,17,18,12,6,6,12,21,21,21,4,39,11,11,11,11,11,11,11,11,11,11,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,39,39,12,39,39,39,6,6,11,11,11,11,11,11,11,11,11,11,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,39,39,39,39,39,39,11,11,11,11,11,11,11,11,11,11,36,36,36,36,36,36,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,39,39,12,12,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,39,39,21,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,39,39,39,39,39,39,36,36,36,36,36,36,36,36,36,36,36,36,36,36,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,21,21,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,12,12,12,12,12,12,12,39,39,39,39,11,11,11,11,11,11,11,11,11,11,17,17,12,17,17,17,17,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,12,12,12,12,12,12,12,12,12,39,39,39,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,12,12,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,39,17,17,17,17,17,11,11,11,11,11,11,11,11,11,11,39,39,39,12,12,12,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,17,17,12,12,12,12,12,12,12,12,39,39,39,39,39,39,39,39,21,21,21,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,12,12,12,12,21,12,12,12,12,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,18,12,39,17,17,17,17,17,17,17,4,17,17,17,20,21,21,21,21,17,4,17,17,19,29,29,12,3,3,0,3,3,3,0,3,29,29,12,12,15,15,15,17,30,30,21,21,21,21,21,4,10,10,10,10,10,10,10,10,12,3,3,29,5,5,12,12,12,12,12,12,8,0,1,5,5,5,12,12,12,12,12,12,12,12,12,12,12,12,17,12,17,17,17,17,12,17,17,17,22,12,12,12,12,39,39,39,39,39,21,21,21,21,21,21,12,12,39,39,29,12,12,12,12,12,12,12,12,0,1,29,12,29,29,29,29,12,12,12,12,12,12,12,12,0,1,39,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,9,9,9,9,9,9,9,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,10,9,9,9,9,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,12,12,12,10,12,29,12,12,12,10,12,12,12,12,12,12,12,12,12,29,12,12,9,12,12,12,12,12,12,12,12,12,12,29,29,12,12,12,12,12,12,12,12,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,29,12,12,12,12,12,29,12,12,29,12,29,29,29,29,29,29,29,29,29,29,29,29,12,12,12,12,29,29,29,29,29,29,29,29,29,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,12,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,12,29,29,12,12,12,29,29,12,12,29,12,12,12,29,12,29,9,9,12,29,12,12,12,12,29,12,12,29,29,29,29,12,12,29,12,29,12,29,29,29,29,29,29,12,29,12,12,12,12,12,29,29,29,29,12,12,12,12,29,29,12,12,12,12,12,12,12,12,12,12,29,12,12,12,29,12,12,12,12,12,29,12,12,12,12,12,12,12,12,12,12,12,12,12,29,29,12,12,29,29,29,29,12,12,29,29,12,12,29,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,29,12,12,29,29,12,12,12,12,12,12,12,12,12,12,12,12,12,29,12,12,12,29,12,12,12,12,12,12,12,12,12,12,12,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,12,12,12,12,12,12,12,14,14,12,12,12,12,12,12,12,12,12,12,12,12,12,0,1,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,14,14,14,14,39,39,39,39,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,12,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,12,12,12,12,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,12,12,12,12,12,12,12,12,12,12,12,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,12,12,29,29,29,29,12,12,12,12,12,12,12,12,12,12,29,29,12,29,29,29,29,29,29,29,12,12,12,12,12,12,12,12,29,29,12,12,29,29,12,12,12,12,29,29,12,12,29,29,12,12,12,12,29,29,29,12,12,29,12,12,29,29,29,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,29,29,29,12,12,12,12,12,12,12,12,12,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,14,14,14,14,12,29,29,12,12,29,12,12,12,12,29,29,12,12,12,12,14,14,29,29,14,12,14,14,14,14,14,14,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,14,14,14,12,12,12,12,29,12,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,29,12,29,29,29,12,29,14,29,29,12,29,29,12,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,14,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,14,14,14,14,14,14,14,14,14,14,14,14,29,29,29,29,14,12,14,14,14,29,14,14,29,29,29,14,14,29,29,14,29,29,14,14,14,12,29,12,12,12,12,29,29,14,29,29,29,29,29,29,14,14,14,14,14,29,14,14,14,14,29,29,14,14,14,14,14,14,14,14,12,12,12,14,14,14,14,14,14,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,12,12,12,3,3,3,3,12,12,12,6,6,12,12,12,12,0,1,0,1,0,1,0,1,0,1,0,1,0,1,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,0,1,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,0,1,0,1,0,1,0,1,0,1,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,0,1,0,1,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,0,1,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,29,29,29,29,29,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,12,12,39,39,39,39,39,6,17,17,17,12,6,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,17,39,39,39,39,39,39,39,39,39,39,39,39,39,39,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,3,3,3,3,3,3,3,3,3,3,3,3,3,3,17,17,17,17,17,17,17,17,12,17,0,17,12,12,3,3,12,12,3,3,0,1,0,1,0,1,0,1,17,17,17,17,6,12,17,17,12,17,17,12,12,12,12,12,19,19,39,39,39,39,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,1,1,14,14,5,14,14,0,1,0,1,0,1,0,1,0,1,14,14,0,1,0,1,0,1,0,1,5,0,1,1,14,14,14,14,14,14,14,14,14,14,21,21,21,21,21,21,14,14,14,14,14,14,14,14,14,14,14,5,5,14,14,14,39,32,14,32,14,32,14,32,14,32,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,32,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,32,14,32,14,32,14,14,14,14,14,14,32,14,14,14,14,14,14,32,32,39,39,21,21,5,5,5,5,14,5,32,14,32,14,32,14,32,14,32,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,32,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,32,14,32,14,32,14,14,14,14,14,14,32,14,14,14,14,14,14,32,32,14,14,14,14,5,32,5,5,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,39,39,39,39,39,39,39,39,39,39,39,39,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,29,29,29,29,29,29,29,29,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,5,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,39,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,17,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,17,6,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,12,21,21,21,21,21,21,21,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,39,39,39,39,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,12,17,17,17,17,17,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,12,12,12,21,12,12,12,12,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,10,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,18,18,6,6,39,39,39,39,39,39,39,39,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,39,39,39,39,39,39,39,17,17,11,11,11,11,11,11,11,11,11,11,39,39,39,39,39,39,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,12,12,12,12,12,12,12,12,12,12,39,39,39,39,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,17,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,39,39,39,39,39,39,39,39,39,12,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,39,39,39,21,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,12,12,12,12,12,12,17,17,17,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,39,39,39,39,39,39,39,12,12,12,21,12,12,12,12,12,12,12,12,21,21,39,39,11,11,11,11,11,11,11,11,11,11,39,39,12,17,17,17,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,17,17,12,12,12,21,21,39,39,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,17,21,21,39,39,11,11,11,11,11,11,11,11,11,11,39,39,39,39,39,39,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,39,39,39,39,39,39,39,39,39,39,39,39,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,39,39,39,39,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,39,39,39,39,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,37,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,39,39,13,21,13,13,13,13,13,13,13,13,13,13,12,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,0,1,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,10,12,39,39,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,8,1,1,8,8,6,6,0,1,15,39,39,39,39,39,39,21,21,21,21,21,21,21,39,39,39,39,39,39,39,39,39,14,14,14,14,14,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,14,14,0,1,14,14,14,14,14,14,14,1,14,1,39,5,5,6,6,14,0,1,0,1,0,1,14,14,14,14,14,14,14,14,14,14,9,10,14,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,22,39,6,14,14,9,10,14,14,0,1,14,14,1,14,1,14,14,14,14,14,14,14,14,14,14,14,5,5,14,14,14,6,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,0,14,1,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,0,14,1,14,0,1,1,0,1,1,5,12,32,32,32,32,32,32,32,32,32,32,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,5,5,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,10,9,14,14,14,9,9,39,12,12,12,12,12,12,12,39,39,39,39,39,39,39,39,39,39,21,21,21,31,29,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,39,39,17,17,17,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,11,11,11,11,11,11,11,11,11,11,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,39,21,21,21,21,21,21,21,21,12,12,12,12,12,12,12,12,39,39,39,39,39,39,39,39,17,17,17,17,17,17,17,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,17,17,17,17,17,17,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,17,17,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,11,11,11,11,11,11,11,11,11,11,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,12,12,12,17,17,17,17,39,39,39,39,39,39,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,39,39,39,39,11,11,11,11,11,11,11,11,11,11,39,39,39,39,39,39,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,11,11,11,11,11,11,11,11,11,11,17,17,17,17,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,12,12,12,12,17,17,12,17,39,39,39,39,39,39,39,11,11,11,11,11,11,11,11,11,11,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,39,39,39,39,39,39,11,11,11,11,11,11,11,11,11,11,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,39,39,39,39,39,39,39,39,39,39,17,17,17,17,39,39,39,39,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,0,0,0,1,1,1,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,1,12,12,12,0,1,0,1,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,0,1,1,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,14,14,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,21,12,12,12,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,12,12,21,21,21,21,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,21,21,21,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,39,39,39,39,39,39,39,39,39,39,39,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,12,39,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,12,12,39,39,39,39,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,39,39,39,39,39,39,39,39,39,39,39,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,12,12,14,14,14,14,14,12,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,12,14,12,14,12,14,14,14,14,14,14,14,14,14,14,12,14,12,12,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,39,39,39,12,12,12,12,12,12,12,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,12,12,12,12,12,12,12,12,12,12,12,12,12,12,14,14,14,14,14,14,14,14,14,14,14,14,14,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,39,39,39,39,39,39,39,39,39,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,39,39,39,39,39,39,39,39,39,39,39,39,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,39,39,39,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39,39],"highStart":919552,"errorValue":0}
},{}],69:[function(_dereq_,module,exports){
// Generated by CoffeeScript 1.7.1
(function() {
  var AI, AL, B2, BA, BB, BK, CB, CJ, CL, CM, CP, CR, EX, GL, H2, H3, HL, HY, ID, IN, IS, JL, JT, JV, LF, NL, NS, NU, OP, PO, PR, QU, RI, SA, SG, SP, SY, WJ, XX, ZW;

  exports.OP = OP = 0;

  exports.CL = CL = 1;

  exports.CP = CP = 2;

  exports.QU = QU = 3;

  exports.GL = GL = 4;

  exports.NS = NS = 5;

  exports.EX = EX = 6;

  exports.SY = SY = 7;

  exports.IS = IS = 8;

  exports.PR = PR = 9;

  exports.PO = PO = 10;

  exports.NU = NU = 11;

  exports.AL = AL = 12;

  exports.HL = HL = 13;

  exports.ID = ID = 14;

  exports.IN = IN = 15;

  exports.HY = HY = 16;

  exports.BA = BA = 17;

  exports.BB = BB = 18;

  exports.B2 = B2 = 19;

  exports.ZW = ZW = 20;

  exports.CM = CM = 21;

  exports.WJ = WJ = 22;

  exports.H2 = H2 = 23;

  exports.H3 = H3 = 24;

  exports.JL = JL = 25;

  exports.JV = JV = 26;

  exports.JT = JT = 27;

  exports.RI = RI = 28;

  exports.AI = AI = 29;

  exports.BK = BK = 30;

  exports.CB = CB = 31;

  exports.CJ = CJ = 32;

  exports.CR = CR = 33;

  exports.LF = LF = 34;

  exports.NL = NL = 35;

  exports.SA = SA = 36;

  exports.SG = SG = 37;

  exports.SP = SP = 38;

  exports.XX = XX = 39;

}).call(this);

},{}],70:[function(_dereq_,module,exports){
// Generated by CoffeeScript 1.7.1
(function() {
  var AI, AL, BA, BK, CB, CI_BRK, CJ, CP_BRK, CR, DI_BRK, ID, IN_BRK, LF, LineBreaker, NL, NS, PR_BRK, SA, SG, SP, UnicodeTrie, WJ, XX, characterClasses, classTrie, pairTable, _ref, _ref1;

  UnicodeTrie = _dereq_('unicode-trie');

  classTrie = new UnicodeTrie(_dereq_('./class_trie.json'));

  _ref = _dereq_('./classes'), BK = _ref.BK, CR = _ref.CR, LF = _ref.LF, NL = _ref.NL, CB = _ref.CB, BA = _ref.BA, SP = _ref.SP, WJ = _ref.WJ, SP = _ref.SP, BK = _ref.BK, LF = _ref.LF, NL = _ref.NL, AI = _ref.AI, AL = _ref.AL, SA = _ref.SA, SG = _ref.SG, XX = _ref.XX, CJ = _ref.CJ, ID = _ref.ID, NS = _ref.NS, characterClasses = _ref.characterClasses;

  _ref1 = _dereq_('./pairs'), DI_BRK = _ref1.DI_BRK, IN_BRK = _ref1.IN_BRK, CI_BRK = _ref1.CI_BRK, CP_BRK = _ref1.CP_BRK, PR_BRK = _ref1.PR_BRK, pairTable = _ref1.pairTable;

  LineBreaker = (function() {
    var Break, mapClass, mapFirst;

    function LineBreaker(string) {
      this.string = string;
      this.pos = 0;
      this.lastPos = 0;
      this.curClass = null;
      this.nextClass = null;
    }

    LineBreaker.prototype.nextCodePoint = function() {
      var code, next;
      code = this.string.charCodeAt(this.pos++);
      next = this.string.charCodeAt(this.pos);
      if ((0xd800 <= code && code <= 0xdbff) && (0xdc00 <= next && next <= 0xdfff)) {
        this.pos++;
        return ((code - 0xd800) * 0x400) + (next - 0xdc00) + 0x10000;
      }
      return code;
    };

    mapClass = function(c) {
      switch (c) {
        case AI:
          return AL;
        case SA:
        case SG:
        case XX:
          return AL;
        case CJ:
          return NS;
        default:
          return c;
      }
    };

    mapFirst = function(c) {
      switch (c) {
        case LF:
        case NL:
          return BK;
        case CB:
          return BA;
        case SP:
          return WJ;
        default:
          return c;
      }
    };

    LineBreaker.prototype.nextCharClass = function(first) {
      if (first == null) {
        first = false;
      }
      return mapClass(classTrie.get(this.nextCodePoint()));
    };

    Break = (function() {
      function Break(position, required) {
        this.position = position;
        this.required = required != null ? required : false;
      }

      return Break;

    })();

    LineBreaker.prototype.nextBreak = function() {
      var cur, lastClass, shouldBreak;
      if (this.curClass == null) {
        this.curClass = mapFirst(this.nextCharClass());
      }
      while (this.pos < this.string.length) {
        this.lastPos = this.pos;
        lastClass = this.nextClass;
        this.nextClass = this.nextCharClass();
        if (this.curClass === BK || (this.curClass === CR && this.nextClass !== LF)) {
          this.curClass = mapFirst(mapClass(this.nextClass));
          return new Break(this.lastPos, true);
        }
        cur = (function() {
          switch (this.nextClass) {
            case SP:
              return this.curClass;
            case BK:
            case LF:
            case NL:
              return BK;
            case CR:
              return CR;
            case CB:
              return BA;
          }
        }).call(this);
        if (cur != null) {
          this.curClass = cur;
          if (this.nextClass === CB) {
            return new Break(this.lastPos);
          }
          continue;
        }
        shouldBreak = false;
        switch (pairTable[this.curClass][this.nextClass]) {
          case DI_BRK:
            shouldBreak = true;
            break;
          case IN_BRK:
            shouldBreak = lastClass === SP;
            break;
          case CI_BRK:
            shouldBreak = lastClass === SP;
            if (!shouldBreak) {
              continue;
            }
            break;
          case CP_BRK:
            if (lastClass !== SP) {
              continue;
            }
        }
        this.curClass = this.nextClass;
        if (shouldBreak) {
          return new Break(this.lastPos);
        }
      }
      if (this.pos >= this.string.length) {
        if (this.lastPos < this.string.length) {
          this.lastPos = this.string.length;
          return new Break(this.string.length);
        } else {
          return null;
        }
      }
    };

    return LineBreaker;

  })();

  module.exports = LineBreaker;

}).call(this);

},{"./class_trie.json":68,"./classes":69,"./pairs":71,"unicode-trie":67}],71:[function(_dereq_,module,exports){
// Generated by CoffeeScript 1.7.1
(function() {
  var CI_BRK, CP_BRK, DI_BRK, IN_BRK, PR_BRK;

  exports.DI_BRK = DI_BRK = 0;

  exports.IN_BRK = IN_BRK = 1;

  exports.CI_BRK = CI_BRK = 2;

  exports.CP_BRK = CP_BRK = 3;

  exports.PR_BRK = PR_BRK = 4;

  exports.pairTable = [[PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, CP_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, DI_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, DI_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, PR_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK], [IN_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, IN_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, DI_BRK], [DI_BRK, PR_BRK, PR_BRK, IN_BRK, IN_BRK, IN_BRK, PR_BRK, PR_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK, IN_BRK, DI_BRK, DI_BRK, PR_BRK, CI_BRK, PR_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, DI_BRK, IN_BRK]];

}).call(this);

},{}],72:[function(_dereq_,module,exports){
(function (Buffer){
// Generated by CoffeeScript 1.4.0

/*
# MIT LICENSE
# Copyright (c) 2011 Devon Govett
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy of this 
# software and associated documentation files (the "Software"), to deal in the Software 
# without restriction, including without limitation the rights to use, copy, modify, merge, 
# publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
# to whom the Software is furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all copies or 
# substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
# BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
# DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


(function() {
  var PNG, fs, zlib;

  fs = _dereq_('fs');

  zlib = _dereq_('zlib');

  module.exports = PNG = (function() {

    PNG.decode = function(path, fn) {
      return fs.readFile(path, function(err, file) {
        var png;
        png = new PNG(file);
        return png.decode(function(pixels) {
          return fn(pixels);
        });
      });
    };

    PNG.load = function(path) {
      var file;
      file = fs.readFileSync(path);
      return new PNG(file);
    };

    function PNG(data) {
      var chunkSize, colors, i, index, key, section, short, text, _i, _j, _ref;
      this.data = data;
      this.pos = 8;
      this.palette = [];
      this.imgData = [];
      this.transparency = {};
      this.text = {};
      while (true) {
        chunkSize = this.readUInt32();
        section = ((function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i < 4; i = ++_i) {
            _results.push(String.fromCharCode(this.data[this.pos++]));
          }
          return _results;
        }).call(this)).join('');
        switch (section) {
          case 'IHDR':
            this.width = this.readUInt32();
            this.height = this.readUInt32();
            this.bits = this.data[this.pos++];
            this.colorType = this.data[this.pos++];
            this.compressionMethod = this.data[this.pos++];
            this.filterMethod = this.data[this.pos++];
            this.interlaceMethod = this.data[this.pos++];
            break;
          case 'PLTE':
            this.palette = this.read(chunkSize);
            break;
          case 'IDAT':
            for (i = _i = 0; _i < chunkSize; i = _i += 1) {
              this.imgData.push(this.data[this.pos++]);
            }
            break;
          case 'tRNS':
            this.transparency = {};
            switch (this.colorType) {
              case 3:
                this.transparency.indexed = this.read(chunkSize);
                short = 255 - this.transparency.indexed.length;
                if (short > 0) {
                  for (i = _j = 0; 0 <= short ? _j < short : _j > short; i = 0 <= short ? ++_j : --_j) {
                    this.transparency.indexed.push(255);
                  }
                }
                break;
              case 0:
                this.transparency.grayscale = this.read(chunkSize)[0];
                break;
              case 2:
                this.transparency.rgb = this.read(chunkSize);
            }
            break;
          case 'tEXt':
            text = this.read(chunkSize);
            index = text.indexOf(0);
            key = String.fromCharCode.apply(String, text.slice(0, index));
            this.text[key] = String.fromCharCode.apply(String, text.slice(index + 1));
            break;
          case 'IEND':
            this.colors = (function() {
              switch (this.colorType) {
                case 0:
                case 3:
                case 4:
                  return 1;
                case 2:
                case 6:
                  return 3;
              }
            }).call(this);
            this.hasAlphaChannel = (_ref = this.colorType) === 4 || _ref === 6;
            colors = this.colors + (this.hasAlphaChannel ? 1 : 0);
            this.pixelBitlength = this.bits * colors;
            this.colorSpace = (function() {
              switch (this.colors) {
                case 1:
                  return 'DeviceGray';
                case 3:
                  return 'DeviceRGB';
              }
            }).call(this);
            this.imgData = new Buffer(this.imgData);
            return;
          default:
            this.pos += chunkSize;
        }
        this.pos += 4;
        if (this.pos > this.data.length) {
          throw new Error("Incomplete or corrupt PNG file");
        }
      }
      return;
    }

    PNG.prototype.read = function(bytes) {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
        _results.push(this.data[this.pos++]);
      }
      return _results;
    };

    PNG.prototype.readUInt32 = function() {
      var b1, b2, b3, b4;
      b1 = this.data[this.pos++] << 24;
      b2 = this.data[this.pos++] << 16;
      b3 = this.data[this.pos++] << 8;
      b4 = this.data[this.pos++];
      return b1 | b2 | b3 | b4;
    };

    PNG.prototype.readUInt16 = function() {
      var b1, b2;
      b1 = this.data[this.pos++] << 8;
      b2 = this.data[this.pos++];
      return b1 | b2;
    };

    PNG.prototype.decodePixels = function(fn) {
      var _this = this;
      return zlib.inflate(this.imgData, function(err, data) {
        var byte, c, col, i, left, length, p, pa, paeth, pb, pc, pixelBytes, pixels, pos, row, scanlineLength, upper, upperLeft, _i, _j, _k, _l, _m;
        if (err) {
          throw err;
        }
        pixelBytes = _this.pixelBitlength / 8;
        scanlineLength = pixelBytes * _this.width;
        pixels = new Buffer(scanlineLength * _this.height);
        length = data.length;
        row = 0;
        pos = 0;
        c = 0;
        while (pos < length) {
          switch (data[pos++]) {
            case 0:
              for (i = _i = 0; _i < scanlineLength; i = _i += 1) {
                pixels[c++] = data[pos++];
              }
              break;
            case 1:
              for (i = _j = 0; _j < scanlineLength; i = _j += 1) {
                byte = data[pos++];
                left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                pixels[c++] = (byte + left) % 256;
              }
              break;
            case 2:
              for (i = _k = 0; _k < scanlineLength; i = _k += 1) {
                byte = data[pos++];
                col = (i - (i % pixelBytes)) / pixelBytes;
                upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                pixels[c++] = (upper + byte) % 256;
              }
              break;
            case 3:
              for (i = _l = 0; _l < scanlineLength; i = _l += 1) {
                byte = data[pos++];
                col = (i - (i % pixelBytes)) / pixelBytes;
                left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                pixels[c++] = (byte + Math.floor((left + upper) / 2)) % 256;
              }
              break;
            case 4:
              for (i = _m = 0; _m < scanlineLength; i = _m += 1) {
                byte = data[pos++];
                col = (i - (i % pixelBytes)) / pixelBytes;
                left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                if (row === 0) {
                  upper = upperLeft = 0;
                } else {
                  upper = pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                  upperLeft = col && pixels[(row - 1) * scanlineLength + (col - 1) * pixelBytes + (i % pixelBytes)];
                }
                p = left + upper - upperLeft;
                pa = Math.abs(p - left);
                pb = Math.abs(p - upper);
                pc = Math.abs(p - upperLeft);
                if (pa <= pb && pa <= pc) {
                  paeth = left;
                } else if (pb <= pc) {
                  paeth = upper;
                } else {
                  paeth = upperLeft;
                }
                pixels[c++] = (byte + paeth) % 256;
              }
              break;
            default:
              throw new Error("Invalid filter algorithm: " + data[pos - 1]);
          }
          row++;
        }
        return fn(pixels);
      });
    };

    PNG.prototype.decodePalette = function() {
      var c, i, length, palette, pos, ret, transparency, _i, _ref, _ref1;
      palette = this.palette;
      transparency = this.transparency.indexed || [];
      ret = new Buffer(transparency.length + palette.length);
      pos = 0;
      length = palette.length;
      c = 0;
      for (i = _i = 0, _ref = palette.length; _i < _ref; i = _i += 3) {
        ret[pos++] = palette[i];
        ret[pos++] = palette[i + 1];
        ret[pos++] = palette[i + 2];
        ret[pos++] = (_ref1 = transparency[c++]) != null ? _ref1 : 255;
      }
      return ret;
    };

    PNG.prototype.copyToImageData = function(imageData, pixels) {
      var alpha, colors, data, i, input, j, k, length, palette, v, _ref;
      colors = this.colors;
      palette = null;
      alpha = this.hasAlphaChannel;
      if (this.palette.length) {
        palette = (_ref = this._decodedPalette) != null ? _ref : this._decodedPalette = this.decodePalette();
        colors = 4;
        alpha = true;
      }
      data = (imageData != null ? imageData.data : void 0) || imageData;
      length = data.length;
      input = palette || pixels;
      i = j = 0;
      if (colors === 1) {
        while (i < length) {
          k = palette ? pixels[i / 4] * 4 : j;
          v = input[k++];
          data[i++] = v;
          data[i++] = v;
          data[i++] = v;
          data[i++] = alpha ? input[k++] : 255;
          j = k;
        }
      } else {
        while (i < length) {
          k = palette ? pixels[i / 4] * 4 : j;
          data[i++] = input[k++];
          data[i++] = input[k++];
          data[i++] = input[k++];
          data[i++] = alpha ? input[k++] : 255;
          j = k;
        }
      }
    };

    PNG.prototype.decode = function(fn) {
      var ret,
        _this = this;
      ret = new Buffer(this.width * this.height * 4);
      return this.decodePixels(function(pixels) {
        _this.copyToImageData(ret, pixels);
        return fn(ret);
      });
    };

    return PNG;

  })();

}).call(this);

}).call(this,_dereq_("buffer").Buffer)
},{"buffer":51,"fs":36,"zlib":50}]},{},[2])

(2)
});

//# sourceMappingURL=pdfkit.js.map