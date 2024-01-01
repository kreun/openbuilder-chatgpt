const e = require("express");
var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
var adapter = new FileSync("./data/eb-db.json");

var db = low(adapter);

console.log("db")

// 하나의 문서에 대해서 하나의 데이터 베이스로 사용하고,
// 한번에 모든 데이터를 업데이트 할 것임. 


/**
 * name
 * json uid기준 객체
 * eb 배열 객체
 */

db.defaults({
    name: "",
    json: {},
    eb: [],
}).write();

let responseData = {
    name: "",
    json: {},
    eb: [],
};


function initResponseData() {

    responseData.name = db.get("name").value();
    responseData.json = db.get("json").value();
    responseData.eb = db.get("eb").value();

    console.log("responseData.name",responseData.name);
    console.log("responseData.doc.length",Object.keys(responseData.json).length);
    console.log("responseData.eb.length", responseData.eb.length);
}

initResponseData();

function setAllData(pa_data) {
    responseData.name = pa_data.name;
    responseData.json = pa_data.json;
    responseData.eb = pa_data.eb;
    db.set("name", responseData.name).write();
    db.set("json", responseData.json).write();
    db.set("eb", responseData.eb).write();
}

function getJSON(pa_uid) {
    return responseData.json[pa_uid];
}

function getLog() {
    return responseData;
}

function getCountBook (pa_book) {
    responseData.json
    let count =0;
    let keys = Object.keys(responseData.json);
    for (let i = 0; i < keys.length; i++) {
        const element = keys[i];
        if (pa_book===responseData.json[element].book) {
            count++;
        }
    }
    return count;
}

const cosSimilarity = require("cos-similarity");

function getEBIndex(pa_userEB) {
    console.time("EB");
    let resultIndexs = [];
    let lg = responseData.eb.length;

    for (let i = 0; i < lg; i++) {
        
        let s = cosSimilarity(responseData.eb[i].eb, pa_userEB);
        //console.log(i, s);
        if (s > 0.5) {
            resultIndexs.push({ uid: responseData.eb[i].uid, score: s });
        }
    }
    
    console.timeEnd("EB");

    if (resultIndexs.length > 0) {
        resultIndexs.sort(function (a, b) {
            return b.score - a.score;
        });
        //TODO 최대값으로 3개까지 포함해서 전달하기. 하나만 하면 일치도가 떨어진다. 0.8 이상으로 구해진 것이 3개가 안될 수도 있으니, 그건 잘 체크할 것.
        let result = [];
        let lg = resultIndexs.length;
        if (lg > 5) {
            lg = 5;
        }

        let lgTaget = 5;
        if (lg >= 2) {
            if (resultIndexs[0].score > 0.93 && lg > 3) {
                lgTaget = 3;
            } else if (resultIndexs[0].score > 0.85 && lg > 5) {
                lgTaget = 5;
            }
        }

        for (let i = 0; i < lgTaget; i++) {
            result[i] = resultIndexs[i].uid;
            console.log(resultIndexs[i])
        }

        

        return result;
    } else {
        return [];
    }
}



// ------------------------------------------------

module.exports = {
    setAllData,getJSON,getLog,getEBIndex,getCountBook
};

// ------------------------------------------------

