/// <reference types="vite/client" />

// 声明我们自定义的环境变量类型
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // 如果以后还有其他的环境变量，也可以加在这里
}

// 告诉 TypeScript，import.meta 里面有一个叫 env 的东西
interface ImportMeta {
  readonly env: ImportMetaEnv;
}