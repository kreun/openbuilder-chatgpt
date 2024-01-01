const axios = require('axios');

const {config} = require("./config.js")

async function getEBApi(pa_str) {

    // console.log(config)

  const data = {
    "model": "text-embedding-ada-002",
    "input": pa_str
  };

  try {
    const response = await axios.post(config.embedding_url, data, {
      headers: {
        'Authorization': `Bearer ${config.key}`,
        'Content-Type': 'application/json'
      }
    });

    //console.log(JSON.stringify(response.data, null, 4));
    // const responseResult = JSON.stringify(response.data.data[0].embedding);
    const responseResult = response.data.data[0].embedding;
    const responseUsage = response.data.usage;
    return { responseResult, responseUsage };
  } catch (error) {
    // 에러 핸들링
    console.error("Error during API call:", error);
    throw error; // 또는 에러에 대한 사용자 정의 처리
  }
}

module.exports = {
    getEBApi
}