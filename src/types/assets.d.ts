// SCSS 模块类型声明

// 普通 SCSS 导入 - 作为 CSS 模块处理并注入到页面
declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// 内联 SCSS 导入 - 作为编译后的 CSS 字符串 (用于 Web Components Shadow DOM)
declare module '*.scss?inline' {
  const content: string;
  export default content;
}

// 原始 SCSS 导入 - 作为原始 SCSS 字符串
declare module '*.scss?raw' {
  const content: string;
  export default content;
}

declare module '*.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.sass?inline' {
  const content: string;
  export default content;
}

declare module '*.sass?raw' {
  const content: string;
  export default content;
}

// HTML 文件类型声明
declare module '*.html' {
  const content: string;
  export default content;
}

// SVG 文件类型声明
declare module '*.svg' {
  const content: string;
  export default content;
}
