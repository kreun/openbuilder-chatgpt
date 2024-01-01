
// 모델은 3.5 혹은 4를 사용한다. 모델이 계속 변경되고, 최신 모델을 사용하는 것이 유리.

const config = {
    url: "https://api.openai.com/v1/chat/completions",
    embedding_url: "https://api.openai.com/v1/embeddings",
    key: "sk-",
    chat_model : "gpt-3.5-turbo-1106"
}

module.exports= {
    config
}