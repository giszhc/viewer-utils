import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import type {IImageItem} from "./types";

/**
 * 将 File 对象转换为本地 URL
 */
const fileToUrl = (file: File): string => {
    const URLGetter = window.URL || (window as any).webkitURL;
    return URLGetter ? URLGetter.createObjectURL(file) : "";
};

/**
 * 获取不带后缀的文件名
 */
const getFileNamePrefix = (filename: string): string => {
    if (!filename) return "";
    const lastDotIndex = filename.lastIndexOf(".");
    return lastDotIndex === -1 ? filename : filename.substring(0, lastDotIndex);
};

/**
 * 注入自定义样式（单例模式）
 */
const injectStyles = (): void => {
    if (document.getElementById("viewer-custom-style")) return;
    const style = document.createElement("style");
    style.id = "viewer-custom-style";
    style.textContent = `
        .viewer-backdrop { background-color: rgba(0,0,0,0.8); backdrop-filter: blur(14px);}
        .viewer-toolbar > ul > li.viewer-toolbar-download {
            color: #fff; font-size: 12px; display: flex; align-items: center; justify-content: center;
        }
    `;
    document.head.append(style);
};

// --- 核心预览函数 (导出) ---

/**
 * 基础预览方法：渲染 DOM 并启动 Viewer
 */
export const previewPicture = (imgList: IImageItem[] = [], index: number = 0): void => {
    if (!imgList.length) return;

    injectStyles();

    const container = document.createElement("div");
    container.style.display = "none";
    const ul = document.createElement("ul");

    imgList.forEach(img => {
        const li = document.createElement("li");
        const elImg = document.createElement("img");
        elImg.setAttribute("data-original", img.url);
        elImg.setAttribute("src", img.thumb);
        elImg.setAttribute("alt", img.name);
        li.append(elImg);
        ul.append(li);
    });

    container.append(ul);
    document.body.append(container);

    const viewer = new Viewer(container, {
        url: "data-original",
        zIndex: 99999,
        fullscreen: false,
        hide: () => {
            viewer.destroy();
            container.remove();
        },
        title: (image: HTMLImageElement, imageData: any) => {
            const filename = getFileNamePrefix(image.src.split("/").pop() || "");
            return `${filename}（${imageData.naturalWidth}x${imageData.naturalHeight}）`;
        }
    });

    index >= 0 ? viewer.view(index) : viewer.show();
};

/**
 * 预览单张图片
 * @param source img事件对象、URL字符串或 IImageItem 对象
 */
export const previewSingle = (source: HTMLImageElement | any): void => {
    const src: string = source?.src || (source?.currentTarget as HTMLImageElement)?.src || (typeof source === 'string' ? source : "");
    if (!src) return;

    const items: IImageItem[] = [{name: src, url: src, thumb: src}];
    previewPicture(items);
};

/**
 * 预览图片列表
 */
export const previewList = (
    imgList: (string | IImageItem)[] = [],
    index: number = 0
): void => {
    const items: IImageItem[] = imgList.map(img => {
        if (typeof img === 'object' && 'url' in img) {
            return img as IImageItem;
        }
        return {name: String(img), url: String(img), thumb: String(img)};
    });
    previewPicture(items, index);
};

/**
 * 预览 File 文件列表
 */
export const previewFiles = (fileList: File[] = [], index: number = 0): void => {
    const items: IImageItem[] = fileList.map(file => {
        const src = fileToUrl(file);
        return {name: file.name, url: src, thumb: src};
    });
    previewPicture(items, index);
};