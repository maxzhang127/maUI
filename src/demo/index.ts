// 演示页面的 TypeScript 代码
import '../index'; // 导入组件库

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
  console.log('maUI 演示页面已加载！');
  
  // 加载状态按钮测试
  const loadingBtn = document.getElementById('loadingBtn');
  if (loadingBtn) {
    loadingBtn.addEventListener('click', () => {
      const button = loadingBtn as HTMLElement & { loading: boolean };
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
    
    eventBtn.addEventListener('ma-click', (event: Event) => {
      clickCount++;
      eventStatus.textContent = `按钮已被点击 ${clickCount} 次！事件详情：${JSON.stringify((event as CustomEvent).detail)}`;
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
  
  // 输入框事件测试
  const eventInput = document.getElementById('eventInput');
  const inputEventStatus = document.getElementById('inputEventStatus');
  
  if (eventInput && inputEventStatus) {
    let inputCount = 0;
    let changeCount = 0;
    let validCount = 0;
    let invalidCount = 0;
    
    eventInput.addEventListener('ma-input', (event: Event) => {
      inputCount++;
      const value = (event as CustomEvent).detail.value;
      inputEventStatus.innerHTML = `
        <strong>输入事件</strong> (${inputCount}次)
        <br/>当前值: "${value}"
        <br/>输入长度: ${value.length} 字符
      `;
      inputEventStatus.style.backgroundColor = '#e8f5e8';
    });
    
    eventInput.addEventListener('ma-change', (event: Event) => {
      changeCount++;
      const detail = (event as CustomEvent).detail;
      const value = detail.value;
      const context = detail.context;
      inputEventStatus.innerHTML = `
        <strong>变化事件</strong> (${changeCount}次)
        <br/>新值: "${value}"
        <br/>旧值: "${context?.previousValue || ''}"
        <br/>用户输入: ${context?.isUserInput ? '是' : '否'}
      `;
      inputEventStatus.style.backgroundColor = '#e8f4f8';
    });
    
    eventInput.addEventListener('ma-focus', () => {
      inputEventStatus.innerHTML = `
        <strong>获得焦点</strong>
        <br/>输入框已获得焦点，可以开始输入
      `;
      inputEventStatus.style.backgroundColor = '#f0f8ff';
    });
    
    eventInput.addEventListener('ma-blur', () => {
      inputEventStatus.innerHTML = `
        <strong>失去焦点</strong>
        <br/>输入框已失去焦点
      `;
      inputEventStatus.style.backgroundColor = '#f8f8f0';
    });
    
    eventInput.addEventListener('ma-valid', () => {
      validCount++;
      inputEventStatus.innerHTML = `
        <strong>验证通过</strong> (${validCount}次)
        <br/>输入内容通过了所有验证规则
      `;
      inputEventStatus.style.backgroundColor = '#e8f5e8';
    });
    
    eventInput.addEventListener('ma-invalid', (event: Event) => {
      invalidCount++;
      const errors = (event as CustomEvent).detail.errors || [];
      inputEventStatus.innerHTML = `
        <strong>验证失败</strong> (${invalidCount}次)
        <br/>错误信息: ${errors.join(', ')}
      `;
      inputEventStatus.style.backgroundColor = '#fef2f2';
    });
    
    eventInput.addEventListener('ma-enter', (event: Event) => {
      const value = (event as CustomEvent).detail.value;
      inputEventStatus.innerHTML = `
        <strong>回车键事件</strong>
        <br/>输入值: "${value}"
        <br/>已按下回车键
      `;
      inputEventStatus.style.backgroundColor = '#fff7ed';
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