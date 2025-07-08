console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
)

// 配置允许在当前窗口打开的域名白名单
const WHITELIST_DOMAINS = [
    'github.com',
    'example.com',
    'www.xkku.cn',
    '918.pouir.cn',
    // 添加你需要的域名
    // 可以添加更多域名...
]

// 检查URL是否在白名单中
function shouldOpenInApp(url) {
    try {
        const parsedUrl = new URL(url);
        // 检查域名是否在白名单中
        return WHITELIST_DOMAINS.some(domain => 
            parsedUrl.hostname.endsWith(domain)
        );
    } catch (error) {
        console.error('解析URL失败:', error);
        return false;
    }
}

// 显示阻止访问的提示
function showBlockedMessage(url) {
    alert(`访问被阻止：\n\n${url}\n\n该域名不在SKT的网址中。`);
}

const hookClick = (e) => {
    const origin = e.target.closest('a');
    
    if (origin && origin.href) {
        const href = origin.href;
        
        // 如果链接在白名单中，在当前窗口打开
        if (shouldOpenInApp(href)) {
            e.preventDefault();
            console.log('在应用内打开:', href);
            location.href = href;
        } else {
            // 阻止默认行为，不打开链接
            e.preventDefault();
            console.log('阻止访问:', href);
            showBlockedMessage(href);
        }
    }
}

window.open = function (url, target, features) {
    if (shouldOpenInApp(url)) {
        console.log('在应用内打开:', url);
        location.href = url;
    } else {
        console.log('阻止访问:', url);
        showBlockedMessage(url);
    }
    return null;
}

document.addEventListener('click', hookClick, { capture: true });