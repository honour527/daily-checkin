/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2024-11-14 14:29:08
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-11-15 11:47:43
 * @FilePath: \dakaweb\script.js
 * @Description: 默认,`customMade`, koroFileHeader鿴: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 获取DOM元素
const checkInBtn = document.getElementById('checkInBtn');
const checkInType = document.getElementById('checkInType');
const lastCheckIn = document.getElementById('lastCheckIn');
const eventForm = document.getElementById('eventForm');
const eventInput = document.getElementById('eventInput');
const eventList = document.getElementById('eventList');
const checkInList = document.getElementById('checkInList');
const adminBtn = document.getElementById('adminBtn');
const adminModal = document.getElementById('adminModal');
const adminPassword = document.getElementById('adminPassword');
const loginBtn = document.getElementById('loginBtn');
const closeButtons = document.querySelectorAll('.close');
const adminCheckInList = document.getElementById('adminCheckInList');
const adminLoginForm = document.querySelector('.admin-login-form');

// 管理员密码
const ADMIN_PASSWORD = '123456';

// 打卡类型配置
const checkInTypes = {
    work: { name: '工作', color: '#4CAF50' },
    study: { name: '学习', color: '#2196F3' },
    sport: { name: '运动', color: '#FF9800' },
    sleep: { name: '睡觉', color: '#9C27B0' }
};

// 从localStorage加载数据
let events = JSON.parse(localStorage.getItem('events')) || [];
let checkIns = JSON.parse(localStorage.getItem('checkIns')) || [];
let lastCheckInTime = localStorage.getItem('lastCheckInTime');

// 更新上次打卡时间显示
if (lastCheckInTime) {
    lastCheckIn.textContent = new Date(lastCheckInTime).toLocaleString();
}

// 创建提示框函数
function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.left = '50%';
    messageDiv.style.transform = 'translateX(-50%)';
    messageDiv.style.padding = '10px 20px';
    messageDiv.style.backgroundColor = '#333';
    messageDiv.style.color = 'white';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.fontFamily = 'Microsoft YaHei, 微软雅黑, sans-serif';
    messageDiv.style.fontSize = '14px';
    messageDiv.style.fontWeight = '500';
    messageDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    messageDiv.style.opacity = '0';
    messageDiv.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 2000);
}

// 初始化事件监听
document.addEventListener('DOMContentLoaded', () => {
    // 显示管理员登录框
    adminBtn.addEventListener('click', () => {
        adminModal.classList.add('show');
        adminPassword.value = '';
        adminPassword.focus();
        // 重置显示状态
        adminLoginForm.style.display = 'flex';
        adminCheckInList.style.display = 'none';
    });

    // 登录验证
    loginBtn.addEventListener('click', handleLogin);

    // 密码输入框回车事件
    adminPassword.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    });

    // 关闭按钮功能
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });

    // 初始化数据显示
    try {
        if (lastCheckInTime) {
            lastCheckIn.textContent = new Date(lastCheckInTime).toLocaleString();
        }
        displayCheckIns();
        displayEvents();
        updateQuote();
        updateInspirationImage();
    } catch (error) {
        console.error('初始化数据时出错:', error);
    }

    // 添加打卡类型选择功能
    const typeButtons = document.querySelectorAll('.type-btn');
    let selectedType = 'work'; // 默认选中工作打卡

    // 初始化时激活默认按钮
    document.querySelector(`.type-btn[data-type="${selectedType}"]`).classList.add('active');

    // 为每个类型按钮添加点击事件
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的激活状态
            typeButtons.forEach(btn => btn.classList.remove('active'));
            // 激活当前按钮
            button.classList.add('active');
            // 更新选中的类型
            selectedType = button.dataset.type;
        });
    });

    // 修改打卡按钮的事件处理
    checkInBtn.addEventListener('click', () => {
        const now = new Date();
        const note = document.getElementById('checkInNote').value.trim();
        
        lastCheckInTime = now.toISOString();
        localStorage.setItem('lastCheckInTime', lastCheckInTime);
        lastCheckIn.textContent = now.toLocaleString();
        
        // 添加打卡记录
        const checkIn = {
            id: Date.now(),
            type: selectedType, // 使用选中的类型
            timestamp: now.toISOString(),
            note: note
        };

        if (!Array.isArray(checkIns)) {
            checkIns = [];
        }
        
        checkIns.unshift(checkIn);
        localStorage.setItem('checkIns', JSON.stringify(checkIns));
        
        document.getElementById('checkInNote').value = '';
        displayCheckIns();
        showMessage('打卡成功！');
    });

    // 初始化背景图片
    updateInspirationImage();
    
    // 每天更新一次背景图片
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            updateInspirationImage();
        }
    }, 60000); // 每分钟检查一次

    // 显示管理员面板
    adminBtn.addEventListener('click', () => {
        adminModal.classList.add('show');
    });

    // 关闭管理员面板
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            adminModal.classList.remove('show');
        });
    });

    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
        if (event.target === adminModal) {
            adminModal.classList.remove('show');
        }
    });

    // 初始化语录
    updateQuote();
    
    // 每小时检查一次是否需要更新语录
    setInterval(() => {
        const now = new Date();
        // 如果是新的一天的 00:00
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            updateQuote();
        }
    }, 60000); // 每分钟检查一次
});

// 登录处理数
function handleLogin() {
    const password = adminPassword.value.trim();
    
    if (!password) {
        showMessage('请输入密码！');
        return;
    }
    
    if (password === ADMIN_PASSWORD) {
        // 修改标题
        document.getElementById('adminModalTitle').textContent = '打卡记录管理';
        // 隐藏登录表单，显示打卡记录
        adminLoginForm.style.display = 'none';
        adminCheckInList.style.display = 'block';
        // 清空密码
        adminPassword.value = '';
        // 显示打卡记录
        displayAdminCheckIns();
        showMessage('登录成功！');
    } else {
        showMessage('密码错误！');
        adminPassword.value = '';
        adminPassword.focus();
    }
}

// 显示打卡记录
function displayCheckIns() {
    if (!Array.isArray(checkIns) || checkIns.length === 0) {
        checkInList.innerHTML = '<div class="check-in-item">暂无打卡记录</div>';
        return;
    }

    const recordsHtml = checkIns.map(checkIn => {
        const type = checkIn.type || 'work';
        const typeName = checkInTypes[type] ? checkInTypes[type].name : '未知类型';
        const note = checkIn.note ? `<div class="check-in-item-note">备注：${checkIn.note}</div>` : '';
        
        return `
            <div class="check-in-item check-in-${type}">
                <div class="check-in-item-header">
                    <div>
                        <span class="check-in-type type-${type}">
                            <span class="btn-icon">${getTypeIcon(type)}</span>
                            <span class="btn-text">${typeName}</span>
                        </span>
                        <span class="check-in-time">${new Date(checkIn.timestamp).toLocaleString('zh-CN')}</span>
                    </div>
                </div>
                ${note}
            </div>
        `;
    }).join('');

    checkInList.innerHTML = recordsHtml;
}

// 获取类型图标
function getTypeIcon(type) {
    const icons = {
        work: '💼',
        study: '📚',
        sport: '🏃',
        sleep: '😴'
    };
    return icons[type] || '📝';
}

// 显示事件列表
function displayEvents() {
    if (!Array.isArray(events) || events.length === 0) {
        eventList.innerHTML = '<div class="event-item">暂无事件记录</div>';
        return;
    }

    eventList.innerHTML = events.map(event => `
        <div class="event-item">
            <div class="event-item-content">
                <span>${event.text}</span>
                <small>${new Date(event.timestamp).toLocaleString('zh-CN')}</small>
            </div>
            <button class="delete-btn" onclick="deleteEvent(${event.id})">
                <span class="btn-icon">🗑️</span>
                <span class="btn-text">删除</span>
            </button>
        </div>
    `).join('');
}

// 添加事件记录
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const eventText = eventInput.value.trim();
    if (!eventText) return;
    
    const newEvent = {
        id: Date.now(),
        text: eventText,
        timestamp: new Date().toISOString()
    };
    
    events.unshift(newEvent);
    localStorage.setItem('events', JSON.stringify(events));
    displayEvents();
    eventInput.value = '';
});

// 删除事件记录
function deleteEvent(id) {
    if (confirm('确定要删除这条记录吗？')) {
        events = events.filter(event => event.id !== id);
        localStorage.setItem('events', JSON.stringify(events));
        displayEvents();
        showMessage('删除成功！');
    }
}

// 确保页面加载时正确初始化数据
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，开始初始化数据');
    
    try {
        // 重新从localStorage加载数据
        checkIns = JSON.parse(localStorage.getItem('checkIns')) || [];
        events = JSON.parse(localStorage.getItem('events')) || [];
        lastCheckInTime = localStorage.getItem('lastCheckInTime');
        
        console.log('加载的打卡记录数量:', checkIns.length);
        console.log('加载的事件记录数量:', events.length);
        
        // 更新上次打卡时间显示
        if (lastCheckInTime) {
            lastCheckIn.textContent = new Date(lastCheckInTime).toLocaleString();
        }
        
        // 初始化显示
        displayCheckIns();
        displayEvents();
        updateQuote();
        updateInspirationImage();
    } catch (error) {
        console.error('初始化数据时出错:', error);
    }
});

// 定义一个获取励志语录的函数
async function fetchQuote() {
    try {
        // 里使用一言API作为示例
        const response = await fetch('https://v1.hitokoto.cn/?c=k&c=d&c=i');
        const data = await response.json();
        
        // 返回格式化的语录对象
        return {
            cn: data.hitokoto,
            en: data.from // 使用来源作为英文示
        };
    } catch (error) {
        console.error('获取励志语录失败:', error);
        // 如果获取失败，返回默认语录
        return {
            cn: "生命不是要超越别人，而是要超越自己。",
            en: "Life is not about surpassing others, but surpassing yourself."
        };
    }
}

// 获取今天的日期字符串（格式：YYYY-MM-DD）
function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

// 更新语录的函数
async function updateQuote() {
    try {
        const lastQuoteDate = localStorage.getItem('lastQuoteDate');
        const today = getTodayString();
        
        // 如果今天还没有更新过语录
        if (lastQuoteDate !== today) {
            const quote = await fetchQuote();
            const quoteText = document.getElementById('quoteText');
            quoteText.innerHTML = `
                <div class="quote-cn">${quote.cn}</div>
                <div class="quote-en">${quote.en}</div>
            `;
            
            // 保存更新日期
            localStorage.setItem('lastQuoteDate', today);
            // 保存当前语录
            localStorage.setItem('currentQuote', JSON.stringify(quote));
        } else {
            // 如果今天已经更新过，使用保存的语录
            const savedQuote = JSON.parse(localStorage.getItem('currentQuote'));
            if (savedQuote) {
                const quoteText = document.getElementById('quoteText');
                quoteText.innerHTML = `
                    <div class="quote-cn">${savedQuote.cn}</div>
                    <div class="quote-en">${savedQuote.en}</div>
                `;
            }
        }
    } catch (error) {
        console.error('更新语录失败:', error);
    }
}

// 更新背景图片函数
function updateInspirationImage() {
    const backgroundImage = document.getElementById('backgroundImage');
    const today = new Date().toISOString().split('T')[0];
    // 使用更高质量的图片
    const imageUrl = `https://picsum.photos/1920/1080?random=${today}`;
    
    // 创建新图片对象
    const img = new Image();
    img.onload = function() {
        backgroundImage.style.backgroundImage = `url(${imageUrl})`;
        backgroundImage.style.opacity = '1';
    };
    img.src = imageUrl;
}

// 在管理面板中显示打卡记录
function displayAdminCheckIns() {
    if (!Array.isArray(checkIns) || checkIns.length === 0) {
        adminCheckInList.innerHTML = `<div class="admin-check-in-item">暂无打卡记录</div>`;
        return;
    }

    const recordsHtml = checkIns.map(checkIn => {
        const type = checkIn.type || 'work';
        const typeName = checkInTypes[type] ? checkInTypes[type].name : '未知类型';
        const note = checkIn.note ? `<div class="admin-check-in-note">备注：${checkIn.note}</div>` : '';
        
        return `
            <div class="admin-check-in-item">
                <div class="admin-check-in-info">
                    <div class="admin-check-in-header">
                        <span class="admin-check-in-type type-${type}">
                            <span class="btn-icon">${getTypeIcon(type)}</span>
                            <span class="btn-text">${typeName}</span>
                        </span>
                        <span class="admin-check-in-time">${new Date(checkIn.timestamp).toLocaleString('zh-CN')}</span>
                    </div>
                    ${note}
                </div>
                <button class="delete-btn" onclick="deleteCheckIn(${checkIn.id})">
                    <span class="btn-icon">🗑️</span>
                    <span class="btn-text">删除</span>
                </button>
            </div>
        `;
    }).join('');

    adminCheckInList.innerHTML = recordsHtml;
}

// 删除单条打卡记录
function deleteCheckIn(id) {
    if (confirm('确定要删除这条打卡记录吗？')) {
        checkIns = checkIns.filter(checkIn => checkIn.id !== id);
        localStorage.setItem('checkIns', JSON.stringify(checkIns));
        
        // 更新显示
        displayCheckIns();
        displayAdminCheckIns();
        
        // 如果删除的是最后一条记录，更新最后打卡时间
        if (checkIns.length === 0) {
            lastCheckInTime = null;
            localStorage.removeItem('lastCheckInTime');
            lastCheckIn.textContent = '暂无';
        } else {
            lastCheckInTime = checkIns[0].timestamp;
            localStorage.setItem('lastCheckInTime', lastCheckInTime);
            lastCheckIn.textContent = new Date(lastCheckInTime).toLocaleString();
        }
        
        showMessage('记录已删除！');
    }
} 