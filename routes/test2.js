var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ title: 'test' });
});

router.post('/', function (req, res, next) {
  let body = req.body;
  console.log(JSON.stringify(body, null, 4));

  const userRequest = body.userRequest.utterance;
  const p1 = body.action.params.p1;
  const p2 = body.action.params.p2;

  res.json(
    {
      "version": "2.0",
      "template": {
        "outputs": [
          {
            "basicCard": {
              "title": "스킬로 말풍선 보내기",
              "description":  `JSON 코드를 이용해서 말풍선을 보냅니다. \n사용자 발화 : ${userRequest}\n일반파라미터 : ${p1}\n필수 파라미터 : ${p2}`,
              "thumbnail": {
                "imageUrl": "https://t1.kakaocdn.net/openbuilder/sample/lj3JUcmrzC53YIjNDkqbWK.jpg"
              },
              "buttons": [
                {
                  "action": "message",
                  "label": "열어보기",
                  "messageText": "짜잔! 우리가 찾던 보물입니다"
                },
                {
                  "action":  "webLink",
                  "label": "구경하기",
                  "webLinkUrl": "https://e.kakao.com/t/hello-ryan"
                }
              ]
            }
          }
        ]
      }
    }
  );
});




module.exports = router;
