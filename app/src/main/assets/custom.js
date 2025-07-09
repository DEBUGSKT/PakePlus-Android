// 卡密购买弹窗 - 会话限弹2次版
(function() {
    // 1. 域名和路径判断 - 仅在zyhsktzz.xyz首页注入
    const currentHost = window.location.hostname;
    const currentPath = window.location.pathname;
    
    // 验证是否为目标域名的首页
    const isTargetHomepage = 
        currentHost === 'zyhsktzz.xyz' &&  // 匹配域名
        (currentPath === '/' || currentPath === '');  // 匹配首页路径
    
    // 如果不是目标首页，直接退出
    if (!isTargetHomepage) {
        console.log('非目标首页，不注入弹窗');
        return;
    }

    // 2. 会话内弹窗计数逻辑
    const POPUP_LIMIT = 2; // 限制弹窗次数
    const STORAGE_KEY = 'popup_counter';
    
    // 读取会话内已弹窗次数
    let popupCount = parseInt(sessionStorage.getItem(STORAGE_KEY) || '0');
    
    // 如果已达到限制次数，不再显示弹窗
    if (popupCount >= POPUP_LIMIT) {
        console.log(`本次会话已达到弹窗次数限制(${POPUP_LIMIT}次)，不再显示`);
        return;
    }

    // 防止重复注入
    if (window.__PAKE_KEY_POPUP__) return;
    window.__PAKE_KEY_POPUP__ = true;

    // 购买链接和激活链接
    const BUY_URL = "https://918.pouir.cn/links/F2F1A946";
    const ACTIVATE_URL = "http://zyhsktzz.xyz/member/card_pwd.html";
    
    // 创建弹窗
    function createAuthPopup() {
        const popup = document.createElement('div');
        popup.id = 'pake-key-popup';
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            padding: 20px;
            box-sizing: border-box;
            backdrop-filter: blur(2px);
            transition: opacity 0.3s ease;
        `;
        
        // 弹窗内容
        popup.innerHTML = `
            <div style="
                background: white;
                padding: 24px 18px;
                border-radius: 12px;
                width: 100%;
                max-width: 90%;
                text-align: center;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                position: relative;
            ">
                <button id="pake-close-btn" style="
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: transparent;
                    border: none;
                    font-size: 28px;
                    color: #9ca3af;
                    cursor: pointer;
                    padding: 8px;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                ">
                    ×
                </button>
                
                <div style="margin: 24px 0 20px;">
                    <div style="
                        background: #f3f4f6;
                        padding: 12px 16px;
                        border-radius: 8px;
                        margin-bottom: 16px;
                        overflow: hidden;
                    ">
                        <input type="text" readonly 
                               value="${BUY_URL}" 
                               style="
                                   width: 100%; 
                                   font-size: 14px; 
                                   border: none;
                                   background: transparent;
                                   outline: none;
                                   text-align: center;
                                   word-break: break-all;
                               "
                               id="pake-url-input">
                    </div>
                    <button id="pake-copy-btn" style="
                        background: #48bb78;
                        color: white;
                        border: none;
                        padding: 12px 16px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        width: 100%;
                        font-weight: 500;
                        box-shadow: 0 4px 6px -1px rgba(72, 187, 120, 0.4);
                    ">
                        复制购买链接
                    </button>
                </div>
                <button id="pake-open-btn" style="
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 14px 16px;
                    font-size: 18px;
                    border-radius: 8px;
                    cursor: pointer;
                    width: 100%;
                    font-weight: 600;
                    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.4);
                ">
                    立即前往购买
                </button>
                
                <!-- 激活卡密按钮 -->
                <button id="pake-activate-btn" style="
                    background: transparent;
                    border: none;
                    color: #8b5cf6;
                    font-size: 16px;
                    cursor: pointer;
                    padding: 8px 0;
                    margin: 12px 0;
                    font-weight: 500;
                    text-decoration: underline;
                ">
                    已购买？点击此处激活卡密
                </button>
                
                <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                    点击上方按钮获取卡密激活软件 
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // 关闭弹窗函数
        function closePopup() {
            popup.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(popup)) {
                    document.body.removeChild(popup);
                }
            }, 300);
        }
        
        // 关闭按钮功能
        const closeBtn = popup.querySelector('#pake-close-btn');
        closeBtn.addEventListener('click', () => {
            closePopup();
            incrementPopupCount(); // 记录关闭操作
        });
        
        // 复制功能
        const copyBtn = popup.querySelector('#pake-copy-btn');
        const urlInput = popup.querySelector('#pake-url-input');
        copyBtn.addEventListener('click', () => {
            urlInput.select();
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(BUY_URL)
                    .then(() => showToast('链接已复制到剪贴板'))
                    .catch(err => {
                        console.error('复制失败:', err);
                        showToast('复制失败，请手动复制');
                    });
            } else {
                const successful = document.execCommand('copy');
                showToast(successful ? '链接已复制到剪贴板' : '复制失败，请手动复制');
            }
            
            copyBtn.style.backgroundColor = '#10b981';
            setTimeout(() => {
                copyBtn.style.backgroundColor = '#48bb78';
            }, 300);
        });
        
        // 购买按钮点击（外部浏览器打开）
        const openBtn = popup.querySelector('#pake-open-btn');
        openBtn.addEventListener('click', () => {
            openExternalUrl(BUY_URL);
            openBtn.style.backgroundColor = '#2563eb';
            setTimeout(() => {
                openBtn.style.backgroundColor = '#3b82f6';
            }, 300);
            incrementPopupCount(); // 记录购买操作
        });
        
        // 激活卡密按钮点击（关闭弹窗+当前页跳转）
        const activateBtn = popup.querySelector('#pake-activate-btn');
        activateBtn.addEventListener('click', () => {
            closePopup();
            setTimeout(() => {
                window.location.href = ACTIVATE_URL;
            }, 300);
            
            activateBtn.style.opacity = '0.7';
            setTimeout(() => {
                activateBtn.style.opacity = '1';
            }, 300);
            incrementPopupCount(); // 记录激活操作
        });
        
        // 外部链接打开函数
        function openExternalUrl(url) {
            if (window.__TAURI__) {
                window.__TAURI__.shell.open(url).catch(err => {
                    console.error('TAURI打开失败:', err);
                    fallbackOpen(url);
                });
            } else if (window.android && typeof window.android.openUrl === 'function') {
                try {
                    window.android.openUrl(url);
                } catch (err) {
                    console.error('Android打开失败:', err);
                    fallbackOpen(url);
                }
            } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.openUrl) {
                try {
                    window.webkit.messageHandlers.openUrl.postMessage(url);
                } catch (err) {
                    console.error('iOS打开失败:', err);
                    fallbackOpen(url);
                }
            } else {
                fallbackOpen(url);
            }
        }
        
        // 外部链接打开降级方案
        function fallbackOpen(url) {
            try {
                const newWindow = window.open(url, '_blank');
                if (newWindow) newWindow.focus();
                else window.location.href = url;
            } catch (err) {
                console.error('打开失败:', err);
                showToast('无法打开链接，请手动复制');
            }
        }
        
        // 提示信息函数
        function showToast(message) {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px 16px;
                border-radius: 8px;
                font-size: 14px;
                z-index: 9999999;
                opacity: 0;
                transition: opacity 0.3s;
            `;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => toast.style.opacity = '1', 10);
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => document.body.removeChild(toast), 300);
            }, 2000);
        }
        
        // 增加弹窗计数
        function incrementPopupCount() {
            popupCount++;
            sessionStorage.setItem(STORAGE_KEY, popupCount.toString());
            console.log(`弹窗计数已更新为 ${popupCount}/${POPUP_LIMIT}`);
        }
        
        // 触摸反馈
        [copyBtn, openBtn, closeBtn, activateBtn].forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.95)';
                element.style.opacity = '0.8';
            });
            element.addEventListener('touchend', () => {
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';
            });
        });
    }
    
    // 页面加载完成后在首页显示弹窗
    if (isTargetHomepage) {
        // 显示弹窗前先增加计数
        console.log(`显示弹窗 ${popupCount + 1}/${POPUP_LIMIT}`);
        
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            createAuthPopup();
        } else {
            window.addEventListener('load', createAuthPopup);
        }
        
        // 更新计数（无论用户是否操作，只要显示就算一次）
        incrementPopupCount();
    }
})();