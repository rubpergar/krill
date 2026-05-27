import { readFile } from "fs/promises";
import { join } from "path";
import ejs from "ejs";

const templateCache = new Map<string, string>();
const viewsDir = join(process.cwd(), "src", "views");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function render(template: string, data: Record<string, any>) {
  const viewPath = join(viewsDir, `${template}.ejs`);
  const layoutPath = join(viewsDir, "layout.ejs");

  const [viewSrc, layoutSrc] = await Promise.all([
    read(viewPath),
    read(layoutPath),
  ]);

  const body = ejs.render(viewSrc, data, { filename: viewPath });
  return ejs.render(layoutSrc, { ...data, body }, { filename: layoutPath });
}

async function read(filePath: string): Promise<string> {
  const cached = templateCache.get(filePath);
  if (cached) return cached;
  const source = await readFile(filePath, "utf-8");
  templateCache.set(filePath, source);
  return source;
}
