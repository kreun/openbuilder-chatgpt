화이트래빗스토리    
오픈빌더 chatgpt 수업 소스 파일입니다.   

폴더위치   
cd /opt/bitnami/projects/chatbot   


pm2 start ./bin/www --watch --time --name "bot" --ignore-watch="public/* data/* node_modules/*"