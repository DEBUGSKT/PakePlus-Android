// 超轻量手机导航脚本（自定义主页版）
(function() {
    // 配置项
    const CONFIG = {
        buttonSize: '43px', // 按钮尺寸
        buttonColor: '#2c3e50', // 按钮颜色
        buttonRadius: '50%', // 按钮圆角
        buttonSpacing: '8px', // 按钮间距
        menuBgColor: 'rgba(0,0,0,0.9)', // 菜单背景色
        animationDuration: '0.3s', // 动画时长
    };

    // 自定义主页URL（独立于预设列表）
    const CUSTOM_HOME_URL = "http://zyhsktzz.xyz"; // 修改为你的域名

    // 配置你的指定网址
    const PRESET_URLS = [
        { name: "卡密购买", url: "https://918.pouir.cn/links/F2F1A946", icon: "🎫" },
        { name: "作者QQ:3997823644",  icon: "🐧" },
        
        // 可以添加更多网址...
    ];

    // 创建按钮
    function createButton(icon, title, onClick) {
        const btn = document.createElement('button');
        btn.innerHTML = icon;
        btn.title = title;
        btn.style.cssText = `
            width: ${CONFIG.buttonSize};
            height: ${CONFIG.buttonSize};
            border-radius: ${CONFIG.buttonRadius};
            background-color: ${CONFIG.buttonColor};
            color: white;
            border: none;
            font-size: 20px;
            margin: 0 ${CONFIG.buttonSpacing};
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            touch-action: manipulation;
        `;
        btn.addEventListener('click', onClick);
        return btn;
    }

    // 创建菜单
    function createMenu() {
        const menu = document.createElement('div');
        menu.id = 'nav-menu';
        menu.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${CONFIG.menuBgColor};
            z-index: 10000;
            transform: translateY(-100%);
            transition: transform ${CONFIG.animationDuration} ease;
            overflow-y: auto;
        `;

        // 关闭按钮
        const closeBtn = createButton('×', '关闭', toggleMenu);
        closeBtn.style.cssText += `
            position: absolute;
            top: 15px;
            right: 15px;
            background-color: rgba(255,255,255,0.1);
        `;
        menu.appendChild(closeBtn);

        // 菜单标题
        const title = document.createElement('div');
        title.style.cssText = `
            padding: 20px;
            color: white;
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
        `;
        title.textContent = '常用网址';
        menu.appendChild(title);

        // 添加网址项
        PRESET_URLS.forEach(item => {
            const urlItem = document.createElement('div');
            urlItem.style.cssText = `
                padding: 18px 20px;
                color: white;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                font-size: 16px;
                display: flex;
                align-items: center;
                cursor: pointer;
            `;
            urlItem.innerHTML = `<span style="margin-right: 15px;">${item.icon}</span>${item.name}`;
            urlItem.addEventListener('click', () => {
                window.location.href = item.url;
                toggleMenu();
            });
            menu.appendChild(urlItem);
        });

        return menu;
    }

    // 切换菜单显示状态
    function toggleMenu() {
        const menu = document.getElementById('nav-menu');
        if (menu) {
            menu.style.transform = menu.style.transform === 'translateY(0)' 
                ? 'translateY(-100%)' 
                : 'translateY(0)';
        }
    }

    // 初始化
    function init() {
        // 创建底部工具栏
        const toolbar = document.createElement('div');
        toolbar.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            z-index: 9999;
        `;

        // 添加后退按钮
        toolbar.appendChild(createButton('←', '后退', () => window.history.back()));
        
        // 修改主页按钮逻辑，指向CUSTOM_HOME_URL
        toolbar.appendChild(createButton('⌂', '主页', () => {
            window.location.href = CUSTOM_HOME_URL;
        }));
        
        // 添加前进按钮
        toolbar.appendChild(createButton('→', '前进', () => window.history.forward()));
        
        // 添加菜单按钮
        toolbar.appendChild(createButton('☰', '菜单', toggleMenu));

        // 添加到页面
        document.body.appendChild(toolbar);
        document.body.appendChild(createMenu());
    }

    // 页面加载后初始化
    document.addEventListener('DOMContentLoaded', init);
})();