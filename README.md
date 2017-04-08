# microbuild

docker微服务架构下的部署、调试工具集

** v4分支开发 **

## TODOS：
* [ ] 基本命令行参数解析、函数调用等
* [ ] 外部工具（docker等）的调用
* [ ] 确定配置文件格式
    * [ ] idea代码提示
    * [ ] JSON Schema
* [ ] 插件的实现方式
    * [ ] systemd 插件
    * [ ] nodejs 插件
    * [ ] typescript 插件
    * [ ] sass 插件
    * [ ] nodemon 插件
    * [ ] concurrently 插件
    * [ ] GFW 插件
        * [ ] shadowsocks、privoxy、kcptun的服务器和客户端
    * [ ] nfs 插件
        * [ ] nfs服务器
    * [ ] docker-config 插件
    * [ ] cron 插件
* [ ] dnsmasq和nginx的实现（如何找到主机ip）
    * [ ] docker swarm mode
* [ ] microbuild mkconfig
    * [ ] 生成dockerfile
    * [ ] 生成systemd脚本
        * [ ] 基本启动运行功能
        * [ ] 服务状态监视
        * [ ] 健康状态报告
* [ ] microbuild debug
    * [ ] 主机调试
    * [ ] docker内调试
* [ ] microbuild build
    * [ ] 执行build
    * [ ] 推送到远程（hub）
        * [ ] 自动登陆
* [ ] Makefile


