// maUI - 原生 Web Components UI 组件库主入口
// 导出所有组件和工具

// 组件导出
export { default as MaButton } from './components/ma-button/ma-button';
export { default as MaInput } from './components/ma-input/ma-input';

// 工具函数导出
export * from './utils/index';

// 类型导出
export * from './types/index';

// 样式导出（全局样式会自动加载）
import './styles/index.scss';
