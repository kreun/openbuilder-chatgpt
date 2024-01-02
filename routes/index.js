var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('index');
});

// json 업로드 (용량 큼 확인 필요)
// json 을 로우디비에 저장하기
// 메모리에 저장하기
// 임베딩, 유사도 검사 진행
// 추천도서 확인 후에, 해당 도서의 정보를 추출한다.


const eb = require("../openai/eb.js");
const db = require("../eb-db/db.js")
const gpt = require("../openai/chatgpt.js")

router.post('/search',async function(req, res, next) {

    let result = {}
    let text = "";
    let utterance = ""
    if (req.headers.auth === "ediief!338474Aie@ifj#fdkg") {

        utterance = req.body.userRequest.utterance;
        let { responseResult, responseUsage } = await eb.getEBApi(utterance);

        let searchUID = db.getEBIndex(responseResult);
        console.log(searchUID)
        
        let texts = [];
        for (let i = 0; i < searchUID.length; i++) {
            const uid = searchUID[i];
            let data = db.getJSON(uid);
            
            let count = db.getCountBook(data.book);
            texts.push(`${data.author} 저자의 '${data.book}(${data.year}년 출판, ${data.publisher})'를 추천합니다. 이 책은 (${count})명의 친구들이 읽고 감상을 작성했습니다.`);
        }

        text = texts.join("\n\n")
        result = {
            "version": "2.0",
            "template": {
                "outputs": [
                    {
                        "simpleText": {
                            "text": `${text}`
                        }
                    }
                ]
            }
        }
    } else {

        
    }


    
    res.json(result);

    let system = `도서 정보 전문가입니다. 다음 규칙을 잘 보고 따라 주세요. 항상 한번 더 생각해 보고 작성해 주세요.
    1. 주어지는 데이터[제공할 도서 정보]를 기반으로 질문에 답변합니다.
    2. 도서에 대한 정보 제공 형식 : 도서명, 저자, 출판년도, 출판사, 몇명의 친구들이 읽었는지에 대한 정보가 포함되어야 합니다.
    3. 질문에 대한 답변 : 질문에 대한 정확한 답변도 포함해 주세요.
    4. 질문에 맞는 추천 도서가 여러권이라면 여러권에 대한 정보를 출력해야 합니다.
    
    출력 샘플 ===
    추천도서 : '돈으로 살 수 없는 것들(2012년 출판, 와이즈베리)'
    저자 : 마이클 샌델
    이 책은 (3)명의 친구들이 읽고 감상을 작성했습니다. 돈으로 살 수 없는 것들에서는 돈과 시장경제가 침해하는 윤리적 가치와 사회적 문제에 대해 탐구하는 책입니다. 샌델은 돈이 갖지 못하는 가치들에 대해 다양한 시각을 제시하며, 돈으로는 살 수 없는 우리의 삶과 사회에 대해 생각해보게 합니다.
    === 
    
    
    `
    /* */
    system = "유저의 질문에 대해서 제공되는 도서 정보를 확인하고, 질문에 맞는 도서 정보를 알려주세요. 도서에 대한 정보는 도서 정보에 있는 모든 내용을 포함해야 합니다."
    
    let prompt = `도서 정보 ===
    ${text}
    ===
    
    질문 : ${utterance}`

    console.log({system})
    let t1 = Date.now()
    let chatgpt =await gpt.getChatGPT(system,prompt);
    
    console.log(chatgpt);
    console.log('GPT 답변 소요 시간 : '+( (Date.now()-t1)/1000 )+ "초");
    

  });
  


module.exports = router;
