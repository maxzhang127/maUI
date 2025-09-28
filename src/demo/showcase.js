// maUI 组件展示页面的交互功能
document.addEventListener('DOMContentLoaded', () => {
  console.log('maUI 组件展示页面已加载！');

  // 初始化所有功能
  initNavigation();
  initThemeToggle();
  initCodeCopy();
  initDemoInteractions();
  initComponentMenu();

  // 检查 Web Components 支持
  checkWebComponentsSupport();
});

// 导航功能
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 更新导航样式
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // 这里可以添加页面滚动或内容切换逻辑
      const target = link.getAttribute('href').substring(1);
      scrollToSection(target);
    });
  });
}

// 组件菜单功能
function initComponentMenu() {
  const menuLinks = document.querySelectorAll('.menu-link');
  const sections = document.querySelectorAll('.component-section');
  
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 更新菜单样式
      menuLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // 显示对应组件内容
      const targetId = link.getAttribute('href').substring(1) + '-section';
      sections.forEach(section => {
        section.classList.remove('active');
      });
      
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  });
}

// 主题切换功能
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  
  // 读取本地存储的主题设置
  const savedTheme = localStorage.getItem('maui-theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    themeToggle.textContent = '☀️ 切换主题';
  }
  
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    
    if (body.classList.contains('dark-theme')) {
      themeToggle.textContent = '☀️ 切换主题';
      localStorage.setItem('maui-theme', 'dark');
    } else {
      themeToggle.textContent = '🌙 切换主题';
      localStorage.setItem('maui-theme', 'light');
    }
  });
}

// 代码复制功能
function initCodeCopy() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const codeContent = button.closest('.demo-code').querySelector('pre code').textContent;
      
      try {
        await navigator.clipboard.writeText(codeContent);
        
        // 显示复制成功反馈
        const originalText = button.textContent;
        button.textContent = '已复制!';
        button.style.background = '#52c41a';
        button.style.borderColor = '#52c41a';
        button.style.color = 'white';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '';
          button.style.borderColor = '';
          button.style.color = '';
        }, 2000);
        
      } catch (err) {
        console.error('复制失败:', err);
        
        // 降级方案：选中文本
        const selection = window.getSelection();
        const range = document.createRange();
        const codeElement = button.closest('.demo-code').querySelector('pre code');
        range.selectNodeContents(codeElement);
        selection.removeAllRanges();
        selection.addRange(range);
        
        button.textContent = '已选中';
        setTimeout(() => {
          button.textContent = '复制';
        }, 2000);
      }
    });
  });
}

// 演示交互功能
function initDemoInteractions() {
  // 加载状态按钮测试
  const loadingDemo = document.getElementById('loadingDemo');
  if (loadingDemo) {
    loadingDemo.addEventListener('ma-click', () => {
      loadingDemo.loading = true;
      loadingDemo.textContent = '加载中...';
      
      setTimeout(() => {
        loadingDemo.loading = false;
        loadingDemo.textContent = '点击测试加载';
      }, 3000);
    });
  }
  
  // 事件演示
  const eventDemo = document.getElementById('eventDemo');
  const eventContent = document.getElementById('eventContent');
  
  if (eventDemo && eventContent) {
    let eventCount = 0;
    
    eventDemo.addEventListener('ma-click', (event) => {
      eventCount++;
      eventContent.innerHTML = `
        <strong>[${new Date().toLocaleTimeString()}]</strong> ma-click 事件触发<br>
        点击次数: ${eventCount}<br>
        事件详情: ${JSON.stringify(event.detail, null, 2)}
      `;
    });
    
    eventDemo.addEventListener('ma-focus', (event) => {
      eventContent.innerHTML = `
        <strong>[${new Date().toLocaleTimeString()}]</strong> ma-focus 事件触发<br>
        事件详情: ${JSON.stringify(event.detail, null, 2)}
      `;
    });
    
    eventDemo.addEventListener('ma-blur', (event) => {
      eventContent.innerHTML = `
        <strong>[${new Date().toLocaleTimeString()}]</strong> ma-blur 事件触发<br>
        事件详情: ${JSON.stringify(event.detail, null, 2)}
      `;
    });
  }
  
  // 为所有按钮添加点击波纹效果
  addRippleEffect();
}

// 添加点击波纹效果
function addRippleEffect() {
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'MA-BUTTON' || e.target.closest('ma-button')) {
      const button = e.target.tagName === 'MA-BUTTON' ? e.target : e.target.closest('ma-button');
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
      `;
      
      // 添加动画样式
      if (!document.getElementById('ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
          @keyframes ripple-animation {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
          ma-button {
            position: relative;
            overflow: hidden;
          }
        `;
        document.head.appendChild(style);
      }
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }
  });
}

// 检查 Web Components 支持
function checkWebComponentsSupport() {
  if (!('customElements' in window)) {
    showWarning('⚠️ 您的浏览器不支持 Web Components，某些功能可能无法正常工作。建议使用现代浏览器。');
  } else {
    console.log('✅ Web Components 支持检查通过！');
  }
  
  // 检查组件是否正确加载
  setTimeout(() => {
    const buttons = document.querySelectorAll('ma-button');
    if (buttons.length === 0) {
      showWarning('⚠️ 组件库可能未正确加载，请检查 JavaScript 文件路径。');
    }
  }, 1000);
}

// 显示警告信息
function showWarning(message) {
  const warning = document.createElement('div');
  warning.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #fff3cd;
    color: #856404;
    padding: 1rem 1.5rem;
    border: 1px solid #ffeaa7;
    border-radius: 6px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    z-index: 9999;
    max-width: 400px;
    animation: slideIn 0.3s ease;
  `;
  
  // 添加滑入动画
  if (!document.getElementById('warning-styles')) {
    const style = document.createElement('style');
    style.id = 'warning-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  warning.innerHTML = `
    ${message}
    <button onclick="this.parentElement.remove()" style="
      background: none; 
      border: none; 
      color: #856404; 
      font-size: 1.2rem; 
      float: right; 
      cursor: pointer;
      margin-left: 1rem;
    ">×</button>
  `;
  
  document.body.appendChild(warning);
  
  // 5秒后自动移除
  setTimeout(() => {
    if (warning.parentElement) {
      warning.remove();
    }
  }, 5000);
}

// 页面滚动功能
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId + '-section') || document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// 导出全局函数供其他地方使用
window.mauiDemo = {
  showWarning,
  scrollToSection,
  initDemoInteractions,
  checkWebComponentsSupport
};