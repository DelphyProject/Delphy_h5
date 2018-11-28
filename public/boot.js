// var notificationData;
// var frameVersion = 1.0;
// var defaultAppVersion = 1;
var isPhoneGap = true;
var getRegistrationID = function () {
    window.JPush.getRegistrationID(onGetRegistrationID);
};

var onGetRegistrationID = function (data) {
    try {
        console.log("JPushPlugin:registrationID is " + data);

        if (data.length == 0) {
            var t1 = window.setTimeout(getRegistrationID, 1000);
        }

        // alert("JPushPlugin:registrationID is " + data);
    } catch (exception) {
        console.log(exception);
    }
};
var onReceiveMessage = function (event) {
    try {
        var message;
        if (device.platform == "Android") {
            message = event.message;
        } else {
            message = event.content;
        }
    } catch (exception) {
        console.log("JPushPlugin:onReceiveMessage-->" + exception);
    }
};
// 处理resume事件
function onResume() {
    try {
        window.JPush.setBadge(0);//服务器角标清0
        window.JPush.setDebugModeFromIos();
        window.JPush.setApplicationIconBadgeNumber(0);//角标
    }
    catch (exception) {
        console.log(exception);
    }
}


var onOpenNotification = function (event) {
    try {
        var alertContent;
        if (device.platform == "Android") {
            alertContent = JSON.stringify(event.extras["cn.jpush.android.EXTRA"]);
        } else {
            alertContent = event.aps.alert;
        }
        notificationData = alertContent;
        pushNotificationToReact();
        window.JPush.setBadge(0);//服务器角标清0
        window.JPush.setApplicationIconBadgeNumber(0);
    } catch (exception) {
        console.log("JPushPlugin:onOpenNotification" + exception);
    }
};

var pushNotificationToReact = function () {
    // var myWebview = document.getElementById('webview')
    // if (myWebview.contentWindow && myWebview.contentWindow.onReceiveJpush) {
    //     myWebview.contentWindow.onReceiveJpush(notificationData);
    // } else {
    //     // React app is loading. Wait until it's fully loaded
    //     setTimeout(pushNotificationToReact, 100);
    // }
    if (window.onReceiveJpush) {
        window.onReceiveJpush(notificationData);
    } else {
        // React app is loading. Wait until it's fully loaded
        setTimeout(pushNotificationToReact, 100);
    }
}

var onReceiveNotification = function (event) {
    try {
        var alertContent;
        if (device.platform == "Android") {
            alertContent = event.alert;
        } else {
            alertContent = event.aps.alert;
        }
        // Trigger the action only when the user actually clicks on the notification
        console.log("Received Notification:" + alertContent);
    } catch (exception) {
        console.log(exception)
    }
};


// function openLinkInbBrowser(url) {
//     cordova.InAppBrowser.open(url, "_system");
// }

function setJpushAlias(userId) {
    if (window.JPush) {
        window.JPush.setAlias({ sequence: 1, alias: userId + '' },
            function (result) {
                // alert("Successfully set my alias to " + userId);
            }, function (error) {
                // alert(error.code)
            });
    }
}

// function umShare(title, content, url, imgUrl) {
//     alert(SocialAgent);
//     SocialAgent.openShare(function (r) { }, content, imgUrl, url, title, [0, 1, 2, 3])
// }
document.addEventListener("jpush.openNotification", onOpenNotification, false);
document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
document.addEventListener(
    'deviceready',
    function () {
        document.addEventListener("jpush.receiveRegistrationId", function (event) { }, false);
        document.addEventListener("resume", onResume, false);
        if (window.JPush)
            window.JPush.init();
        // boot();

    },
    false
);

// "use strict";

// /*
//  * Global settings
//  */

// var bootVersion = 1;
// var appInfoUrl = "http://update.delphy.org.cn/app/info";

// var file_manager;

// try {
//     var tmp = LocalFileSystem.PERSISTENT;
//     var tmp = null;
// } catch (e) {

//     var LocalFileSystem = { 
//         PERSISTENT: window.PERSISTENT,
//         TEMPORARY: window.TEMPORARY
//     };
//     window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
// }

// /**
// MD5: Cant remember where i got this one from
// **/

// var MD5 = function MD5(string) {

//     function RotateLeft(lValue, iShiftBits) {
//         return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
//     }

//     function AddUnsigned(lX, lY) {
//         var lX4, lY4, lX8, lY8, lResult;
//         lX8 = lX & 0x80000000;
//         lY8 = lY & 0x80000000;
//         lX4 = lX & 0x40000000;
//         lY4 = lY & 0x40000000;
//         lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
//         if (lX4 & lY4) {
//             return lResult ^ 0x80000000 ^ lX8 ^ lY8;
//         }
//         if (lX4 | lY4) {
//             if (lResult & 0x40000000) {
//                 return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
//             } else {
//                 return lResult ^ 0x40000000 ^ lX8 ^ lY8;
//             }
//         } else {
//             return lResult ^ lX8 ^ lY8;
//         }
//     }

//     function F(x, y, z) {
//         return x & y | ~x & z;
//     }
//     function G(x, y, z) {
//         return x & z | y & ~z;
//     }
//     function H(x, y, z) {
//         return x ^ y ^ z;
//     }
//     function I(x, y, z) {
//         return y ^ (x | ~z);
//     }

//     function FF(a, b, c, d, x, s, ac) {
//         a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
//         return AddUnsigned(RotateLeft(a, s), b);
//     };

//     function GG(a, b, c, d, x, s, ac) {
//         a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
//         return AddUnsigned(RotateLeft(a, s), b);
//     };

//     function HH(a, b, c, d, x, s, ac) {
//         a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
//         return AddUnsigned(RotateLeft(a, s), b);
//     };

//     function II(a, b, c, d, x, s, ac) {
//         a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
//         return AddUnsigned(RotateLeft(a, s), b);
//     };

//     function ConvertToWordArray(string) {
//         var lWordCount;
//         var lMessageLength = string.length;
//         var lNumberOfWords_temp1 = lMessageLength + 8;
//         var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - lNumberOfWords_temp1 % 64) / 64;
//         var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
//         var lWordArray = Array(lNumberOfWords - 1);
//         var lBytePosition = 0;
//         var lByteCount = 0;
//         while (lByteCount < lMessageLength) {
//             lWordCount = (lByteCount - lByteCount % 4) / 4;
//             lBytePosition = lByteCount % 4 * 8;
//             lWordArray[lWordCount] = lWordArray[lWordCount] | string.charCodeAt(lByteCount) << lBytePosition;
//             lByteCount++;
//         }
//         lWordCount = (lByteCount - lByteCount % 4) / 4;
//         lBytePosition = lByteCount % 4 * 8;
//         lWordArray[lWordCount] = lWordArray[lWordCount] | 0x80 << lBytePosition;
//         lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
//         lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
//         return lWordArray;
//     };

//     function WordToHex(lValue) {
//         var WordToHexValue = "",
//             WordToHexValue_temp = "",
//             lByte,
//             lCount;
//         for (lCount = 0; lCount <= 3; lCount++) {
//             lByte = lValue >>> lCount * 8 & 255;
//             WordToHexValue_temp = "0" + lByte.toString(16);
//             WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
//         }
//         return WordToHexValue;
//     };

//     function Utf8Encode(string) {
//         string = string.replace(/\r\n/g, "\n");
//         var utftext = "";

//         for (var n = 0; n < string.length; n++) {

//             var c = string.charCodeAt(n);

//             if (c < 128) {
//                 utftext += String.fromCharCode(c);
//             } else if (c > 127 && c < 2048) {
//                 utftext += String.fromCharCode(c >> 6 | 192);
//                 utftext += String.fromCharCode(c & 63 | 128);
//             } else {
//                 utftext += String.fromCharCode(c >> 12 | 224);
//                 utftext += String.fromCharCode(c >> 6 & 63 | 128);
//                 utftext += String.fromCharCode(c & 63 | 128);
//             }
//         }

//         return utftext;
//     };

//     var x = Array();
//     var k, AA, BB, CC, DD, a, b, c, d;
//     var S11 = 7,
//         S12 = 12,
//         S13 = 17,
//         S14 = 22;
//     var S21 = 5,
//         S22 = 9,
//         S23 = 14,
//         S24 = 20;
//     var S31 = 4,
//         S32 = 11,
//         S33 = 16,
//         S34 = 23;
//     var S41 = 6,
//         S42 = 10,
//         S43 = 15,
//         S44 = 21;

//     string = Utf8Encode(string);

//     x = ConvertToWordArray(string);

//     a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

//     for (k = 0; k < x.length; k += 16) {
//         AA = a; BB = b; CC = c; DD = d;
//         a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
//         d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
//         c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
//         b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
//         a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
//         d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
//         c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
//         b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
//         a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
//         d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
//         c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
//         b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
//         a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
//         d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
//         c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
//         b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
//         a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
//         d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
//         c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
//         b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
//         a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
//         d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
//         c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
//         b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
//         a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
//         d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
//         c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
//         b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
//         a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
//         d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
//         c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
//         b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
//         a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
//         d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
//         c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
//         b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
//         a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
//         d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
//         c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
//         b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
//         a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
//         d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
//         c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
//         b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
//         a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
//         d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
//         c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
//         b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
//         a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
//         d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
//         c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
//         b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
//         a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
//         d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
//         c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
//         b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
//         a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
//         d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
//         c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
//         b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
//         a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
//         d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
//         c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
//         b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
//         a = AddUnsigned(a, AA);
//         b = AddUnsigned(b, BB);
//         c = AddUnsigned(c, CC);
//         d = AddUnsigned(d, DD);
//     }

//     var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

//     return temp.toLowerCase();
// };

// /**
// FileSystem
// Author: Jorge Torres - Turned Mobile
// **/

// var Log = function Log(bucket, tag) {
//     return function (message) {
//         // No log
//         return;
//         if (typeof bucket != 'undefined') {
//             console.log(' ' + bucket + ':');
//         }
//         if (typeof tag != 'undefined') {
//             console.log(' ' + tag + ':');
//         }
//         if ((typeof message === "undefined" ? "undefined" : _typeof(message)) != 'object') {
//             console.log('       ' + message);
//         } else {
//             console.log(message);
//         }
//     };
// };

// var fileSystemSingleton = {
//     fileSystem: false,

//     load: function load(callback, fail) {
//         fail = typeof fail == 'undefined' ? Log('FileSystem', 'load fail') : fail;
//         if (fileSystemSingleton.fileSystem) {
//             callback(fileSystemSingleton.fileSystem);
//             return;
//         }

//         if (!window.requestFileSystem) {
//             return fail();
//         }

//         window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
//             fileSystemSingleton.fileSystem = fileSystem;
//             callback(fileSystemSingleton.fileSystem);
//         }, function (err) {
//             Log('FileSystem', 'load fail')('error loading file system');
//             fail(err);
//         });
//     }
// };

// var DirManager = function DirManager() {

//     this.cache = {};

//     var current_object = this;
//     // recursive create
//     this.create_r = function (path, callback, fail, position) {
//         position = typeof position == 'undefined' ? 0 : position;

//         var path_split = path.split('/');
//         var new_position = position + 1;
//         var sub_path = path_split.slice(0, new_position).join('/');

//         Log('DirManager', 'mesg')('path:' + sub_path, 'DirManager');

//         var inner_callback = function inner_callback(obj) {
//             return function () {
//                 Log('DirManager', 'mesg')('inner_callback:' + path);

//                 obj.create_r(path, callback, fail, new_position);
//             };
//         };

//         if (new_position == path_split.length) {
//             this.create(sub_path, callback, fail);
//         } else {
//             this.create(sub_path, inner_callback(this), fail);
//         }
//     };

//     this.list = function (path, success, fail) {

//         fail = typeof fail == 'undefined' ? Log('DirManager', 'crete fail') : fail;

//         var template_callback = function template_callback(success) {

//             return function (entries) {
//                 var i;
//                 var ret = [];

//                 limit = entries.length;

//                 for (i = 0; i < limit; i++) {
//                     //console.log(entries[i].name);
//                     ret.push(entries[i].name);
//                 }
//                 // console.log('LIST: '+ret);
//                 success(ret);
//             };
//         };

//         if (current_object.cache[path]) {

//             current_object.cache[path].readEntries(template_callback(success));
//             return;
//         }

//         fileSystemSingleton.load(function (fileSystem) {
//             var entry = fileSystem.root;

//             entry.getDirectory(path, { create: true, exclusive: false }, function (entry) {
//                 var directoryReader = entry.createReader();
//                 current_object.cache[path] = directoryReader;
//                 directoryReader.readEntries(template_callback(success));
//             }, function (err) {
//                 current_object.create_r(path, function () {
//                     success([]);
//                 }, fail);
//                 Log('DirManager', 'crete fail')('error creating directory');
//                 //fail(err);
//             });
//         });
//     };

//     this.create = function (path, callback, fail) {
//         fail = typeof fail == 'undefined' ? Log('DirManager', 'crete fail') : fail;
//         fileSystemSingleton.load(function (fileSystem) {
//             var entry = fileSystem.root;

//             entry.getDirectory(path, { create: true, exclusive: false }, function (entry) {
//                 Log('FileSystem', 'msg')('Directory created successfuly');
//                 callback(entry);
//             }, function (err) {
//                 Log('DirManager', 'crete fail')('error creating directory');
//                 fail(err);
//             });
//         });
//     };

//     this.remove = function (path, success, fail) {
//         fail = typeof fail == 'undefined' ? Log('DirManager', 'crete fail') : fail;
//         success = typeof success == 'undefined' ? Log('DirManager', 'crete fail') : success;

//         //console.log(current_object.cache);
//         delete current_object.cache[path];
//         //console.log(current_object.cache);
//         this.create(path, function (entry) {

//             entry.removeRecursively(success, fail);
//         });
//     };
// };

// var FileManager = function FileManager() {

//     this.get_path = function (todir, tofilename, success, fail) {
//         fail = typeof fail == 'undefined' ? Log('FileManager', 'read file fail') : fail;
//         this.load_file(todir, tofilename, function (fileEntry) {

//             var sPath = fileEntry.toURL();
//             success(sPath);
//         }, fail);
//     };

//     this.load_file = function (dir, file, success, fail, dont_repeat) {
//         if (!dir || dir == '') {
//             Log('error', 'msg')('No file should be created, without a folder, to prevent a mess');
//             fail();
//             return;
//         }
//         fail = typeof fail == 'undefined' ? Log('FileManager', 'load file fail') : fail;
//         var full_file_path = dir + '/' + file;
//         var object = this;
//         // well, here it will be a bit of diharrea code, 
//         // but, this requires to be this chain of crap, thanks to Cordova file creation asynch stuff
//         // get fileSystem
//         fileSystemSingleton.load(function (fs) {
//             var dont_repeat_inner = dont_repeat;
//             // get file handler
//             console.log(fs.root);
//             fs.root.getFile(full_file_path, { create: true, exclusive: false }, success, function (error) {

//                 if (dont_repeat == true) {
//                     Log('FileManager', 'error')('recurring error, gettingout of here!');
//                     return;
//                 }
//                 // if target folder does not exist, create it
//                 //if (error.code !== 3) {
//                 Log('FileManager', 'msg')('folder does not exist, creating it');
//                 var a = new DirManager();
//                 a.create_r(dir, function () {
//                     Log('FileManager', 'mesg')('trying to create the file again: ' + file);
//                     object.load_file(dir, file, success, fail, true);
//                 }
//                     //fail
//                 );
//                 return;
//                 //}
//                 fail(error);
//             });
//         });
//     };

//     this.download_file = function (url, todir, tofilename, success, fail) {
//         fail = typeof fail == 'undefined' ? Log('FileManager', 'read file fail') : fail;

//         this.load_file(todir, tofilename, function (fileEntry) {

//             var sPath = fileEntry.toURL();

//             var fileTransfer = new FileTransfer();
//             fileEntry.remove();

//             fileTransfer.download(encodeURI(url), sPath, function (theFile) {
//                 console.log("download complete: " + theFile.toURI());
//                 success(theFile);
//             }, function (error) {
//                 console.log("download error source " + error.source);
//                 console.log("download error target " + error.target);
//                 console.log("upload error code: " + error.code);
//                 fail(error);
//             });
//         }, function () {
//             alert("FILE ERROR");
//         }
//             //fail
//         );
//     };

//     this.read_file = function (dir, filename, success, fail) {
//         // console.log(dir);
//         fail = typeof fail == 'undefined' ? Log('FileManager', 'read file fail') : fail;
//         this.load_file(dir, filename, function (fileEntry) {
//             fileEntry.file(function (file) {
//                 var reader = new FileReader();

//                 reader.onloadend = function (evt) {
//                     success(evt.target.result);
//                 };

//                 reader.readAsText(file);
//             }, fail);
//         }, fail);
//     };

//     this.write_file = function (dir, filename, data, success, fail) {
//         fail = typeof fail == 'undefined' ? Log('FileManager', 'write file fail') : fail;
//         this.load_file(dir, filename, function (fileEntry) {
//             fileEntry.createWriter(function (writer) {
//                 Log('FileManager', 'mesg')('writing to file: ' + filename);
//                 writer.onwriteend = function (evt) {
//                     Log('FileManager', 'mesg')('file write success!');
//                     success(evt);
//                 };
//                 writer.write(data);
//             }, fail);
//         }, fail);

//         //
//     };

//     this.remove_file = function (dir, filename, success, fail) {
//         var full_file_path = dir + '/' + filename;
//         fileSystemSingleton.load(function (fs) {

//             // get file handler
//             fs.root.getFile(full_file_path, { create: false, exclusive: false }, function (fileEntry) {
//                 fileEntry.remove(success, fail);
//             }, fail);
//         });
//         //
//     };
// };

// /*
//  * Delphy Code
//  */

// function getJson(url, success, fail) {
//     var request = new XMLHttpRequest('MSXML2.XMLHTTP.3.0');
//     request.timeout = 2000;
//     request.open("GET", url, true);
//     request.onreadystatechange = function () {
//         if (request.readyState === 4) {
//             if (request.status === 200) {
//                 try {
//                     success(JSON.parse(request.responseText));
//                 } catch (ex) {
//                     fail();
//                 }
//             } else {
//                 fail();
//             }
//         }
//     };
//     request.send();
// }

// function initBootBoxes() {
//     var topBox = document.createElement("div");
//     topBox.id = "topBootBox";
//     topBox.style.height = "80%";
//     var bottomBox = document.createElement("div");
//     bottomBox.id = "bottomBootBox";
//     bottomBox.style.height = "20%";
//     bootBox.appendChild(topBox);
//     bootBox.appendChild(bottomBox);
// }

// function setProgress(value) {
//     // Create bar if not yet exists
//     if (!document.getElementById("progressBarInner")) {
//         var outerDiv = document.createElement("div");
//         outerDiv.id = "progressBarOuter";
//         outerDiv.style.height = "24px";
//         outerDiv.style.width = "80%";
//         outerDiv.style.border = "1px solid white";
//         outerDiv.style.marginLeft = "auto";
//         outerDiv.style.marginRight = "auto";
//         outerDiv.style.borderRadius = "8px";
//         document.getElementById("bottomBootBox").appendChild(outerDiv);
//         var innerDiv = document.createElement("div");
//         innerDiv.id = "progressBarInner";
//         innerDiv.style.backgroundColor = "white";
//         innerDiv.style.height = "100%";
//         innerDiv.style.width = "0%";
//         innerDiv.style.borderRadius = "8px";
//         outerDiv.appendChild(innerDiv);
//     }

//     // Changes progress
//     var progressBar = document.getElementById("progressBarInner");
//     progressBar.style.width = value.toString() + "%";
// }

// function createOrGetBootTitle() {
//     var pTitle = document.getElementById("bootText");
//     if (pTitle) return pTitle;
//     var p = document.createElement("p");
//     p.id = "bootText";
//     p.style.color = "white";
//     p.style.textAlign = "center";
//     p.style.marginTop = "20px";
//     document.getElementById("bottomBootBox").appendChild(p);
//     return p;
// }

// function showCheckingUpdate(callback) {
//     // Only shows this if it's still checking after 500ms
//     // to avoid a weird "blink"
//     setTimeout(function () {
//         if (!document.getElementById("bootText")) {
//             createOrGetBootTitle().innerText = "正在检查更新...";
//         }
//     }, 500);
//     callback();
// }

// function updateBoot(data, callback) {
//     var file_name = data.bootVersion.toString() + ".js";
//     var folder = '.boot/';
//     file_manager.download_file(data.bootUrl + "?" + Math.random().toString(), folder, file_name, function () {
//         // File successfully downloaded
//         // Set bootVersion storage to point to the new file
//         // so that next time the app boots, the new boot script is used instead
//         file_manager.get_path(folder, file_name, function (path) {
//             localStorage.setItem("bootFile", path);
//             callback();
//         });
//     }, function () {
//         // Failed to update the boot script
//         // Bad, but ok, the app can still run anyway
//         callback();
//     });
// }

// function updateApp(data, callback) {

//     // Updates the content
//     var dir_manager = new DirManager();
//     dir_manager.create_r('apps/' + data.appVersion, function () {

//         createOrGetBootTitle().innerText = "发现新版本，正在为您更新...";

//         var count = 0;
//         for (var index in data.files) {
//             var file_path = data.files[index];
//             var file_name = file_path.split('/').pop();
//             var r = /[^\/]*$/;
//             var folder = 'apps/' + data.appVersion + file_path.replace(r, '');
//             var url = data.baseUrl + file_path;
//             file_manager.download_file(url + "?" + Math.random().toString(), folder, file_name, function (index) {
//                 count++;
//                 //alert(count + " / " + selfie.update_remote_info.files.length + ": " + selfie.update_remote_info.files[index])
//                 var progress = Math.round(count / data.files.length * 100);
//                 setProgress(progress);
//                 if (count == data.files.length) {
//                     // Download finished
//                     localStorage.setItem("appVersion", data.appVersion);
//                     callback();
//                 }
//             }, function () {
//                 // Failed to download some files
//                 alert("网络错误，更新失败");
//                 // Goes directly into the app
//                 callback();
//             });
//         }
//     });
// }

// function checkUpdate(callback) {

//     // Checks update here
//     getJson(appInfoUrl + '?' + Math.random().toString(), function (data) {

//         if (!data.frameVersion || !data.bootVersion || !data.appVersion) {
//             // Wrong format from server
//             callback();
//             return;
//         }

//         if (Number(data.frameVersion) > frameVersion) {
//             // An update for the whole app is available
//             // Ask the user to update the app here
//             /*
//              * A whole-app update is very infrequent. It should only be used when the functionality required
//              * is not possible with a simple boot script update.
//              */
//             var dialog=document.getElementById('dialog');
//             dialog.style.display='block';
//              document.getElementById('confirm').onclick=function(){
//                 // dialog.style.display='none';
//                 cordova.InAppBrowser.open('https://www.baidu.com', "_system");
//              }
//             return
//         }

//         var bootUpdateNeeded = false;
//         var appUpdateNeeded = false;

//         // Checks if boot update is needed
//         if (Number(data.bootVersion) > bootVersion) {
//             bootUpdateNeeded = true;
//         }

//         // Checks if app update is needed
//         var currentVersion = defaultAppVersion;
//         if (localStorage.getItem("appVersion")) currentVersion = Number(localStorage.getItem("appVersion"));
//         var newVersion = Number(data.appVersion);
//         if (currentVersion < newVersion) {
//             appUpdateNeeded = true;
//         }

//         //alert("Frame Version: " + frameVersion + " vs. " + data.frameVersion + "\r\n" + "Boot Version: " + bootVersion + " vs. " + data.bootVersion + "\r\n" + "App Version: " + currentVersion + " vs. " + newVersion);

//         if (!bootUpdateNeeded && !appUpdateNeeded) {
//             // No update needed at all
//             callback();
//         } else if (bootUpdateNeeded && appUpdateNeeded) {
//             // Both boot and app update needed
//             updateBoot(data, function () {
//                 updateApp(data, callback);
//             });
//         } else if (bootUpdateNeeded) {
//             // Only boot update
//             updateBoot(data, callback);
//         } else {
//             // Only app update
//             updateApp(data, callback);
//         }
//     }, function () {
//         // Failed to check update. Goes directly into the app
//         callback();
//     });
// }

// function unMask() {
//     mainBox.style.display = "flex";
//     bootBox.style.display = "none";
// }
// function finalEnterApp() {

//     var finalEnter = function finalEnter(indexPath) {
//         unMask();
//         // window.webview.src = "apps/default/index.html";
//         // var myWebview=document.getElementById('webview')
//         // myWebview.src = "apps/default/index.html";
//         window.location.href = "apps/default/index.html";
//     };

//     // Redirects
//     if (localStorage.getItem("appVersion")) {
//         // Uses a downloaded version
//         file_manager.get_path('apps/' + localStorage.getItem("appVersion"), 'index.html', function (path) {
//             finalEnter(path);
//         });
//         // indexLocation = "";
//     } else {
//         // Uses the default version
//         // finalEnter("apps/default/index.html");
//         window.location.href = "apps/default/index.html";
//     }
// }

// function boot() {

//     initBootBoxes();

//     //alert("Current boot version: " + bootVersion);

//     file_manager = new FileManager();

//     showCheckingUpdate(function () {
//         checkUpdate(finalEnterApp);
//     });
// }

