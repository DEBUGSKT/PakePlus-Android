// 超轻量手机导航脚本（增强版：优化移动端跳转）
(function() {
    // 配置项
    const CONFIG = {
        buttonSize: '43px',
        buttonColor: '#2c3e50',
        buttonRadius: '50%',
        buttonSpacing: '8px',
        menuBgColor: 'rgba(0,0,0,0.9)',
        animationDuration: '0.3s',
    };

    const CUSTOM_HOME_URL = "http://zyhsktzz.xyz";

    // 配置常用网址
    const PRESET_URLS = [
        { name: "卡密购买", url: "https://918.pouir.cn/links/F2F1A946", icon: "🎫" },
        { name: "作者QQ:3997823644", icon: "🐧" },
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

        const closeBtn = createButton('×', '关闭', toggleMenu);
        closeBtn.style.cssText += `
            position: absolute;
            top: 15px;
            right: 15px;
            background-color: rgba(255,255,255,0.1);
        `;
        menu.appendChild(closeBtn);

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

        PRESET_URLS.forEach(item => {
            if (!item.url) return; // 跳过没有URL的项

            // 创建链接项容器
            const linkContainer = document.createElement('div');
            linkContainer.style.cssText = `
                display: flex;
                flex-direction: column;
            `;

            // 主链接项
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
            
            // 点击事件 - 使用手机原生浏览器打开
            urlItem.addEventListener('click', () => {
                toggleMenu();
                openInMobileBrowser(item.url, item.name);
            });
            
            linkContainer.appendChild(urlItem);

            // 复制链接按钮
            const copyBtn = document.createElement('div');
            copyBtn.style.cssText = `
                padding: 8px 20px;
                color: #aaa;
                font-size: 14px;
                display: flex;
                align-items: center;
                cursor: pointer;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            `;
            copyBtn.innerHTML = `<span style="margin-right: 10px;">📋</span>复制链接`;
            
            copyBtn.addEventListener('click', () => {
                copyToClipboard(item.url);
                showToast(`已复制"${item.name}"的链接`);
                toggleMenu();
            });
            
            linkContainer.appendChild(copyBtn);

            menu.appendChild(linkContainer);
        });

        // 添加背景遮罩点击关闭功能
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        `;
        overlay.addEventListener('click', toggleMenu);
        menu.appendChild(overlay);

        return menu;
    }

    // 切换菜单显示状态
    function toggleMenu() {
        const menu = document.getElementById('nav-menu');
        if (menu) {
            if (menu.style.transform === 'translateY(0)' || menu.style.transform === '') {
                menu.style.transform = 'translateY(-100%)';
            } else {
                menu.style.transform = 'translateY(0)';
            }
        }
    }

    // 使用手机原生浏览器打开URL
    function openInMobileBrowser(url, name) {
        // 处理特殊协议头
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'http://' + url;
        }
        
        // 优先使用原生API（如果在应用环境中）
        if (typeof plus !== 'undefined' && plus.runtime) {
            plus.runtime.openURL(url, function(res) {
                if (!res) {
                    showToast(`无法打开"${name}"，请手动复制链接`);
                }
            });
            return;
        }
        
        // 普通网页环境 - 使用window.open并添加时间戳
        const timestamp = new Date().getTime();
        const urlWithTimestamp = url + (url.includes('?') ? '&' : '?') + '_t=' + timestamp;
        
        try {
            // 尝试使用_blank参数打开
            const newWindow = window.open(urlWithTimestamp, '_blank');
            
            // 检测是否被浏览器拦截
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                showOpenFailedDialog(url, name);
            }
        } catch (e) {
            showOpenFailedDialog(url, name);
        }
    }

    // 显示打开失败对话框
    function showOpenFailedDialog(url, name) {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // 创建对话框
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 20px;
            width: 80%;
            max-width: 300px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        `;

        // 标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
        `;
        title.textContent = `无法打开"${name}"`;

        // 消息
        const message = document.createElement('div');
        message.style.cssText = `
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
            text-align: center;
        `;
        message.textContent = '请手动复制链接到手机浏览器中打开：';

        // 链接显示区域
        const urlDisplay = document.createElement('div');
        urlDisplay.style.cssText = `
            background: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            font-size: 13px;
            margin-bottom: 20px;
            word-break: break-all;
            max-height: 100px;
            overflow-y: auto;
        `;
        urlDisplay.textContent = url;

        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: center;
        `;

        // 复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.style.cssText = `
            background: #2c3e50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            width: 100%;
        `;
        copyBtn.textContent = '复制链接到剪贴板';
        copyBtn.addEventListener('click', () => {
            copyToClipboard(url);
            showToast('链接已复制');
            document.body.removeChild(overlay);
        });

        buttonContainer.appendChild(copyBtn);

        dialog.appendChild(title);
        dialog.appendChild(message);
        dialog.appendChild(urlDisplay);
        dialog.appendChild(buttonContainer);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    }

    // 复制文本到剪贴板
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // 显示提示消息
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10002;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);
        
        // 自动消失
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    // 初始化
    function init() {
        const toolbar = document.createElement('div');
        toolbar.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            z-index: 9999;
        `;

        toolbar.appendChild(createButton('←', '后退', () => window.history.back()));
        toolbar.appendChild(createButton('⌂', '主页', () => {
            window.location.href = CUSTOM_HOME_URL;
        }));
        toolbar.appendChild(createButton('→', '前进', () => window.history.forward()));
        toolbar.appendChild(createButton('☰', '菜单', toggleMenu));

        document.body.appendChild(toolbar);
        document.body.appendChild(createMenu());
        
        // 暴露API供外部调用
        window.MobileNavigator = {
            openUrl: function(url, name) {
                openInMobileBrowser(url, name || '链接');
            },
            showMenu: toggleMenu,
            copyUrl: function(url, name) {
                copyToClipboard(url);
                showToast(`已复制"${name || '链接'}"`);
            }
        };
    }

    document.addEventListener('DOMContentLoaded', init);
})();