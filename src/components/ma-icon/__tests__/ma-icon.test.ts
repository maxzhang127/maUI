import MaIcon from '../ma-icon';
import { iconStore } from '../icon-store';
import type {
  IconSize,
  IconTone,
  IconRotation,
  IconLoadEventDetail,
  IconErrorEventDetail,
} from '../ma-icon';

// Mock fetch for external icon testing
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('MaIcon 组件测试', () => {
  let icon: MaIcon;

  beforeEach(async () => {
    // 清理之前的状态
    document.body.innerHTML = '';
    iconStore.clearCache();

    // 重置 fetch mock
    mockFetch.mockClear();

    // 直接使用构造函数创建组件
    icon = new MaIcon();
    document.body.appendChild(icon);

    // 等待组件初始化
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  afterEach(() => {
    // 清理 DOM
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('TS01: 默认渲染', () => {
    it('应该正确初始化并渲染默认状态', () => {
      // 验证组件存在
      expect(icon).toBeTruthy();
      expect(icon.tagName).toBe('MA-ICON');
      expect(icon instanceof MaIcon).toBe(true);

      // 验证默认属性
      expect(icon.name).toBe('');
      expect(icon.set).toBe('system');
      expect(icon.size).toBe('md');
      expect(icon.tone).toBe('default');
      expect(icon.decorative).toBe(false);
      expect(icon.mirrored).toBe(false);
      expect(icon.rotation).toBe('0');
      expect(icon.lazy).toBe(false);

      // 验证 Shadow DOM 存在
      expect(icon.shadowRoot).toBeTruthy();
      const wrapper = icon.shadowRoot!.querySelector('.icon-wrapper');
      expect(wrapper).toBeTruthy();

      // 验证默认无障碍属性
      expect(icon.getAttribute('aria-hidden')).toBeNull();
    });
  });

  describe('TS02: name + set 渲染', () => {
    it('应该成功渲染内置图标并派发 ma-load 事件', async () => {
      const loadEventPromise = new Promise<IconLoadEventDetail>(resolve => {
        icon.addEventListener('ma-load', (event: Event) => {
          const customEvent = event as CustomEvent<IconLoadEventDetail>;
          resolve(customEvent.detail);
        });
      });

      // 设置图标
      icon.name = 'download';
      icon.set = 'system';

      // 等待加载完成
      const loadDetail = await loadEventPromise;

      // 验证事件详情
      expect(loadDetail.name).toBe('download');
      expect(loadDetail.set).toBe('system');
      expect(loadDetail.source).toBe('sprite');
      expect(loadDetail.fromCache).toBe(true);

      // 验证 SVG 渲染
      const svgElement = icon.shadowRoot!.querySelector('svg[part="icon"]');
      expect(svgElement).toBeTruthy();
    });

    it('应该处理无效的图标名称', async () => {
      const errorEventPromise = new Promise<IconErrorEventDetail>(resolve => {
        icon.addEventListener('ma-error', (event: Event) => {
          const customEvent = event as CustomEvent<IconErrorEventDetail>;
          resolve(customEvent.detail);
        });
      });

      // 设置无效图标
      icon.name = 'invalid-icon';
      icon.set = 'system';

      // 等待错误事件
      const errorDetail = await errorEventPromise;

      // 验证错误详情
      expect(errorDetail.name).toBe('invalid-icon');
      expect(errorDetail.set).toBe('system');
      expect(errorDetail.error).toBeInstanceOf(Error);

      // 验证渲染占位符
      expect(icon.classList.contains('ma-icon--error')).toBe(true);
    });
  });

  describe('TS03: tone 与 size', () => {
    it('应该正确应用不同的 tone 和 size', () => {
      // 测试 size
      const sizes: IconSize[] = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'];
      sizes.forEach(size => {
        icon.size = size;
        expect(icon.size).toBe(size);
        expect(icon.getAttribute('size')).toBe(size);
      });

      // 测试 tone
      const tones: IconTone[] = [
        'default',
        'muted',
        'primary',
        'success',
        'warning',
        'danger',
      ];
      tones.forEach(tone => {
        icon.tone = tone;
        expect(icon.tone).toBe(tone);
        expect(icon.getAttribute('tone')).toBe(tone);
      });
    });

    it('应该对无效值使用默认值', () => {
      // 测试无效 size
      icon.setAttribute('size', 'invalid');
      expect(icon.size).toBe('md');

      // 测试无效 tone
      icon.setAttribute('tone', 'invalid');
      expect(icon.tone).toBe('default');
    });
  });

  describe('TS04: 外部 src 成功', () => {
    it('应该成功加载外部 SVG 资源', async () => {
      const mockSvgContent =
        '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'image/svg+xml' }),
        text: () => Promise.resolve(mockSvgContent),
      } as Response);

      const loadEventPromise = new Promise<IconLoadEventDetail>(resolve => {
        icon.addEventListener('ma-load', (event: Event) => {
          const customEvent = event as CustomEvent<IconLoadEventDetail>;
          resolve(customEvent.detail);
        });
      });

      // 设置外部资源
      icon.src = '/test-icon.svg';

      // 等待加载完成
      const loadDetail = await loadEventPromise;

      // 验证事件详情
      expect(loadDetail.source).toBe('src');
      expect(loadDetail.fromCache).toBe(false);

      // 验证 fetch 调用
      expect(mockFetch).toHaveBeenCalledWith('/test-icon.svg');

      // 验证 SVG 渲染
      const svgElement = icon.shadowRoot!.querySelector('svg[part="icon"]');
      expect(svgElement).toBeTruthy();
    });
  });

  describe('TS05: 外部 src 失败 fallback', () => {
    it('应该处理 fetch 失败并显示占位符', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const errorEventPromise = new Promise<IconErrorEventDetail>(resolve => {
        icon.addEventListener('ma-error', (event: Event) => {
          const customEvent = event as CustomEvent<IconErrorEventDetail>;
          resolve(customEvent.detail);
        });
      });

      // 设置会失败的外部资源
      icon.src = '/non-existent-icon.svg';

      // 等待错误事件
      const errorDetail = await errorEventPromise;

      // 验证错误详情
      expect(errorDetail.src).toBe('/non-existent-icon.svg');
      expect(errorDetail.error).toBeInstanceOf(Error);

      // 验证错误状态
      expect(icon.classList.contains('ma-icon--error')).toBe(true);
    });
  });

  describe('TS06: 插槽优先级', () => {
    it('应该优先显示插槽内容', async () => {
      // 添加插槽内容
      const svgElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      );
      svgElement.setAttribute('viewBox', '0 0 24 24');
      svgElement.innerHTML = '<circle cx="12" cy="12" r="8"/>';
      icon.appendChild(svgElement);

      const loadEventPromise = new Promise<IconLoadEventDetail>(resolve => {
        icon.addEventListener('ma-load', (event: Event) => {
          const customEvent = event as CustomEvent<IconLoadEventDetail>;
          resolve(customEvent.detail);
        });
      });

      // 同时设置 name，但插槽应该优先
      icon.name = 'download';

      // 等待加载完成
      const loadDetail = await loadEventPromise;

      // 验证插槽优先级
      expect(loadDetail.source).toBe('slot');

      // 验证不会发起网络请求
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('TS07: decorative/label 无障碍', () => {
    it('应该正确设置装饰性图标的无障碍属性', () => {
      icon.decorative = true;

      expect(icon.decorative).toBe(true);
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(icon.getAttribute('role')).toBeNull();
      expect(icon.getAttribute('aria-label')).toBeNull();
    });

    it('应该正确设置信息性图标的无障碍属性', () => {
      icon.label = '下载文件';

      expect(icon.label).toBe('下载文件');
      expect(icon.getAttribute('role')).toBe('img');
      expect(icon.getAttribute('aria-label')).toBe('下载文件');
      expect(icon.getAttribute('aria-hidden')).toBeNull();
    });

    it('应该在切换 decorative 时正确更新属性', () => {
      // 先设置 label
      icon.label = '测试图标';
      expect(icon.getAttribute('role')).toBe('img');

      // 设置为装饰性
      icon.decorative = true;
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(icon.getAttribute('role')).toBeNull();

      // 取消装饰性
      icon.decorative = false;
      expect(icon.getAttribute('aria-hidden')).toBeNull();
      expect(icon.getAttribute('role')).toBe('img');
    });
  });

  describe('TS08: mirrored/rotation', () => {
    it('应该正确设置镜像属性', () => {
      icon.mirrored = true;
      expect(icon.mirrored).toBe(true);
      expect(icon.hasAttribute('mirrored')).toBe(true);
    });

    it('应该正确设置旋转属性', () => {
      const rotations: IconRotation[] = ['0', '90', '180', '270'];
      rotations.forEach(rotation => {
        icon.rotation = rotation;
        expect(icon.rotation).toBe(rotation);
        expect(icon.getAttribute('rotation')).toBe(rotation);
      });
    });

    it('应该对无效旋转值使用默认值', () => {
      icon.setAttribute('rotation', '45');
      expect(icon.rotation).toBe('0');
    });
  });

  describe('TS09: lazy 加载', () => {
    it('应该支持懒加载模式', () => {
      icon.lazy = true;
      expect(icon.lazy).toBe(true);
      expect(icon.hasAttribute('lazy')).toBe(true);
    });
  });

  describe('TS10: refresh 方法', () => {
    it('应该能够刷新图标', async () => {
      // 先加载一个图标
      icon.name = 'download';
      await icon.load();

      // 清除错误状态
      icon.classList.add('ma-icon--error');

      // 刷新
      icon.refresh();

      // 验证错误状态被清除
      expect(icon.classList.contains('ma-icon--error')).toBe(false);
    });
  });

  describe('TS11: getCurrentDescriptor', () => {
    it('应该返回当前图标描述符', async () => {
      icon.name = 'download';
      icon.set = 'system';
      await icon.load();

      const descriptor = icon.getCurrentDescriptor();
      expect(descriptor).toEqual({
        name: 'download',
        set: 'system',
      });
    });

    it('应该在没有图标时返回 null', () => {
      const descriptor = icon.getCurrentDescriptor();
      expect(descriptor).toBeNull();
    });
  });

  describe('TS12: 事件降噪', () => {
    it('应该防止重复加载相同图标', async () => {
      let loadEventCount = 0;

      icon.addEventListener('ma-load', () => {
        loadEventCount++;
      });

      // 连续设置相同图标
      icon.name = 'download';
      icon.name = 'download';
      icon.name = 'download';

      await new Promise(resolve => setTimeout(resolve, 100));

      // 应该只触发一次加载事件
      expect(loadEventCount).toBe(1);
    });
  });

  describe('布尔属性处理', () => {
    it('应该正确处理布尔属性的设置和获取', () => {
      // 测试 decorative
      icon.decorative = true;
      expect(icon.decorative).toBe(true);
      expect(icon.hasAttribute('decorative')).toBe(true);

      icon.decorative = false;
      expect(icon.decorative).toBe(false);
      expect(icon.hasAttribute('decorative')).toBe(false);

      // 测试 mirrored
      icon.mirrored = true;
      expect(icon.mirrored).toBe(true);
      expect(icon.hasAttribute('mirrored')).toBe(true);

      icon.mirrored = false;
      expect(icon.mirrored).toBe(false);
      expect(icon.hasAttribute('mirrored')).toBe(false);

      // 测试 lazy
      icon.lazy = true;
      expect(icon.lazy).toBe(true);
      expect(icon.hasAttribute('lazy')).toBe(true);

      icon.lazy = false;
      expect(icon.lazy).toBe(false);
      expect(icon.hasAttribute('lazy')).toBe(false);
    });
  });

  describe('组件生命周期', () => {
    it('应该在断开连接时清理资源', () => {
      // 设置懒加载创建 IntersectionObserver
      icon.lazy = true;

      // 从 DOM 中移除
      icon.remove();

      // 验证组件能够正常断开连接
      expect(() => icon.disconnectedCallback()).not.toThrow();
    });
  });
});
