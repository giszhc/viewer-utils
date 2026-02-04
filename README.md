# viewer-utils 图片预览工具库

一个基于 [viewerjs](https://github.com/fengyuanchen/viewerjs) 封装的轻量级图片预览库，支持多种输入格式，开箱即用，并针对现代前端开发进行了 Tree Shaking 优化。

支持以下特性：

- **单图预览**：支持直接传入 URL、事件对象或 DOM 元素
- **列表预览**：支持字符串数组或对象数组，自动识别数据格式
- **本地预览**：支持 `File` 对象预览（如文件上传前的预览）
- **自动清理**：预览关闭后自动销毁实例并移除临时 DOM 节点
- **TypeScript**：完善的类型定义支持

------

## 安装

你可以通过 npm 安装该库：

```bash
pnpm install @giszhc/viewer-utils
```

------

## 使用方法

### previewSingle(source: string | Event | HTMLImageElement): void

预览单张图片。支持传入图片 URL 字符串、点击事件对象或直接传入图片 DOM 元素。

```ts
import { previewSingle } from '@giszhc/viewer-utils';

// 方式 1: 传入 URL
previewSingle('https://example.com/photo.jpg');

// 方式 2: 在点击事件中使用
const handleClick = (e: MouseEvent) => {
    previewSingle(e);
};
```

### previewList(imgList: (string | IImageItem)[], index: number = 0): void

预览图片列表。支持纯地址数组或带信息的对象数组。

```ts
import { previewList } from '@giszhc/viewer-utils';

const images = [
    'https://example.com/1.jpg',
    { name: '图片2', url: 'https://example.com/2.jpg', thumb: 'https://example.com/2_thumb.jpg' }
];

// 预览并定位到第二张图
previewList(images, 1);
```

### previewFiles(fileList: File[], index: number = 0): void

预览 `File` 对象数组。通常用于表单上传前的文件预览，内部会自动处理 `Blob URL` 的生成。

```ts
import { previewFiles } from '@giszhc/viewer-utils';

const input = document.querySelector('input[type="file"]');
input.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    previewFiles(files);
});
```

### previewPicture(imgList: IImageItem[], index: number = 0): void

核心预览方法。接收标准化的对象数组，提供最完整的自定义能力。

```ts
import { previewPicture, type IImageItem } from '@giszhc/viewer-utils';

const items: IImageItem[] = [
    { name: '风景', url: 'full.jpg', thumb: 'thumb.jpg' }
];
previewPicture(items, 0);
```

------

## 接口定义

```ts
interface IImageItem {
    name: string;   // 图片名称（预览时显示的标题）
    url: string;    // 高清图地址（data-original）
    thumb: string;  // 缩略图地址（src）
}
```

------

## 样式自定义

库会默认注入一些基础样式（如背景毛玻璃效果）。如果你需要覆盖样式，可以针对以下类名编写 CSS：

- `.viewer-backdrop`: 背景遮罩
- `.viewer-toolbar`: 工具栏样式

