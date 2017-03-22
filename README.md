# microbuild

## 安裝
```bash
npm i -g typescript@latest  # 安裝tsc，如果已有就不用再裝

git clone https://github.com/GongT/micro-build.git
cd micro-build
npm i
tsc -p src
npm link
cd ..

git clone https://github.com/GongT/jenv.git
cd jenv
npm i
tsc -p src
npm link
cd ..

jenv --pull --global xxxxxxxxxxxxxxx  # <- 配置文件clone-url
```

## 使用
配置文件相关文档参考 [JENV](https://github.com/gongt/jenv)

#### 运行已有项目
**不支持windows，mac可能有问题**

首次运行
```bash
cd /path/to/project
npm install
jenv --set xxxxxxxxxx    # 配置文件集合名称
jenv --env yyyyyyyyyy    # 配置文件名称
```

开始调试服务器
```bash
cd /path/to/project
microbuild debug
```

#### 部署
**仅支持生产环境，centos、fedora**
```bash
cd /path/to/project
microbuild debug
```
