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

  res.json({
    "version": "2.0",
    "data": {
      str: `사용자 발화 ${userRequest}
일반 파라미터 : ${p1}
필수 파라미터 : ${p2}`
    }
  });
});




module.exports = router;
