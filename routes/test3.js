var express = require('express');
var axios = require('axios');
var router = express.Router();

const { getChatGPT } = require('../openai/chatgpt');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ title: 'test' });
});

router.post('/', async function (req, res, next) {
  let body = req.body;
  console.log(JSON.stringify(body, null, 4));

  const userRequest = body.userRequest.utterance;
  // 질문 받은 내용을 이용해서 ChatGPT호출 진행
  const q = body.action.params.q;
  let callbackUrl = req.body.userRequest.callbackUrl;

  res.json(
    {
      "version": "2.0",
      "useCallback": true,
      "data": {
        "message": "생각하고 있는 중이에요😘 \n15초 정도 소요될 거 같아요 기다려 주실래요?!"
      }
    }
  )

  let { answer, token } = await getChatGPT("질문에 답변해 주세요.이모티콘을 문장 마지막에 넣어주세요.", q)



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
