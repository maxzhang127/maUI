// 演示页面的 TypeScript 代码
import '../index'; // 导入组件库

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
  console.log('maUI 演示页面已加载！');
  
  // 加载状态按钮测试
  const loadingBtn = document.getElementById('loadingBtn');
  if (loadingBtn) {
    loadingBtn.addEventListener('click', () => {
      const button = loadingBtn as any;
      button.loading = true;
      button.textContent = '加载中...';
      
      // 3秒后恢复
      setTimeout(() => {
        button.loading = false;
        button.textContent = '点击测试加载';
      }, 3000);
    });
  }
  
  // 事件测试
  const eventBtn = document.getElementById('eventBtn');
  const eventStatus = document.getElementById('eventStatus');
  
  if (eventBtn && eventStatus) {
    let clickCount = 0;
    
    eventBtn.addEventListener('ma-click', (event: any) => {
      clickCount++;
      eventStatus.textContent = `按钮已被点击 ${clickCount} 次！事件详情：${JSON.stringify(event.detail)}`;
      eventStatus.style.backgroundColor = '#e8f5e8';
    });
    
    eventBtn.addEventListener('ma-focus', () => {
      eventStatus.textContent = '按钮获得焦点！';
      eventStatus.style.backgroundColor = '#e8f4f8';
    });
    
    eventBtn.addEventListener('ma-blur', () => {
      eventStatus.textContent = '按钮失去焦点！';
      eventStatus.style.backgroundColor = '#f8f4e8';
    });
  }
  
  // 检查 Web Components 支持
  if (!('customElements' in window)) {
    const warning = document.createElement('div');
    warning.style.cssText = `
      background: #fff3cd;
      color: #856404;
      padding: 1rem;
      margin: 1rem 0;
      border: 1px solid #ffeaa7;
      border-radius: 4px;
      font-weight: bold;
    `;
    warning.textContent = '⚠️ 您的浏览器不支持 Web Components，某些功能可能无法正常工作。';
    document.body.insertBefore(warning, document.body.firstChild);
  } else {
    console.log('✅ Web Components 支持检查通过！');
  }
});