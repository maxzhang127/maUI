import './entry';

import buttonDemoHTML from './template/button-demo.html';

class DemoApp {
    private container: HTMLElement;

    constructor() {
        console.log('Demo 应用已初始化');
        this.container = document.querySelector('.main-container') as HTMLElement;
        this.renderButtonDemo();
        this.bindEvents();
    }

    private renderButtonDemo(): void {
        this.container.innerHTML = buttonDemoHTML;
    }

    private bindEvents(): void {
        // Toggle Loading 按钮
        const toggleLoadingBtn = this.container.querySelector(
            '#toggle-loading'
        ) as HTMLElement;
        let isLoading = false;
        toggleLoadingBtn?.addEventListener('ma-click', () => {
            isLoading = !isLoading;
            toggleLoadingBtn.setAttribute('loading', isLoading ? 'true' : 'false');
            toggleLoadingBtn.textContent = isLoading
                ? 'Loading...'
                : 'Toggle Loading';
        });

        // 表单提交测试
        const testForm = this.container.querySelector(
            '#test-form'
        ) as HTMLFormElement;
        testForm?.addEventListener('submit', e => {
            e.preventDefault();
            this.logEvent('表单提交');
        });

        testForm?.addEventListener('reset', () => {
            this.logEvent('表单重置');
        });

        // 事件测试
        const clickTestBtn = this.container.querySelector('#click-test');
        const focusTestBtn = this.container.querySelector('#focus-test');

        clickTestBtn?.addEventListener('ma-click', e => {
            this.logEvent('ma-click 事件触发', e);
        });

        focusTestBtn?.addEventListener('ma-focus', e => {
            this.logEvent('ma-focus 事件触发', e);
        });

        focusTestBtn?.addEventListener('ma-blur', e => {
            this.logEvent('ma-blur 事件触发', e);
        });
    }

    private logEvent(message: string, event?: unknown): void {
        const eventLog = this.container.querySelector('#event-log');
        if (eventLog) {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
            eventLog.appendChild(logEntry);

            // 保持最新的10条记录
            const entries = eventLog.querySelectorAll('.log-entry');
            if (entries.length > 10) {
                entries[0].remove();
            }
        }

        console.log(message, event);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DemoApp();
});
