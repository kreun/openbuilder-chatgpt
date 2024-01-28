var express = require('express');
var axios = require('axios');
var router = express.Router();

const { getChatGPT } = require('../openai/chatgpt');

const eb = require("../openai/eb.js");
const db = require("../eb-db/db.js")


router.post('/', async function (req, res, next) {
    let body = req.body;
    console.log(JSON.stringify(body, null, 4));

    const utterance = body.userRequest.utterance;
    // 질문 받은 내용을 이용해서 ChatGPT호출 진행
    const q = body.action.params.q;
    let callbackUrl = req.body.userRequest.callbackUrl;
    console.log({ callbackUrl })

    res.json(
        {
            "version": "2.0",
            "useCallback": true,
            "data": {
                "message": "생각하고 있는 중이에요😘 \n15초 정도 소요될 거 같아요 기다려 주실래요?!"
            }
        }
    )

    let { responseResult, responseUsage } = await eb.getEBApi(utterance);

    let searchUID = db.getEBIndex(responseResult);
    console.log(searchUID)

    let texts = [];
    for (let i = 0; i < searchUID.length; i++) {
        const uid = searchUID[i];
        let data = JSON.stringify (db.getJSON(uid))

        texts.push(data);
    }

    text = texts.join("\n\n")
    console.log(text)

    let { answer, token } = await getChatGPT(`제공된 문서에 기반해서 사용자의 질문에 답변해 주세요.
    
    [문서]
   ${text} 
    `, q)



    let sendCallback = await axios.post(callbackUrl, {
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: {
                        text: answer,
                    },
                },
            ],
        },
    });


});




module.exports = router;
