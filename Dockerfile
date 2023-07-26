FROM node

# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y git

# # SSHキーをコンテナにコピー
# COPY id_rsa "C:\Users\iceiceice\.ssh\id_rsa"
# RUN chmod 600 /.ssh/id_rsa

# # Node.jsアプリケーションのディレクトリ作成
# WORKDIR /usr/src/app

# # パッケージのインストール
# COPY package*.json ./
# RUN npm install

# # ソースコードのコピー
# COPY . .

# # アプリケーションの起動
# CMD ["npm", "start"]