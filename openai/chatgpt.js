// api 사용하지 않고, url 연결방식으로. 진행. 

const axios = require('axios');

const {config} = require("./config.js")

async function getChatGPT(pa_system,pa_prompt) {

    // console.log(config)

  

  const data = {
    "model": config.chat_model,
    "temperature": 0,
    "messages": []
  };

  if (pa_system !== undefined && pa_system !== "") {
    data.messages[0] = { "role": "system", "content": pa_system }
  }

  data.messages.push({ "role": "user", "content": pa_prompt })

  /* const options = {
    muteHttpExceptions: false,
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(data),

    
  }; */

  try {
    const response = await axios.post(config.url, data, {
      headers: {
        'Authorization': `Bearer ${config.key}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(JSON.stringify(response.data, null, 4));
    // const responseResult = JSON.stringify(response.data.data[0].embedding);
    // const responseResult = response.data.data[0].embedding;
    // const responseUsage = response.data.usage;

    return { answer: response.data.choices[0].message.content.trim(), token: response.data.usage };
  } catch (error) {
    // 에러 핸들링
    console.error("Error during API call:", error.data);
    throw error; // 또는 에러에 대한 사용자 정의 처리
  }
}

module.exports = {
    getChatGPT
}