
import React from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';

interface PreviewPaneProps {
  code: string;
  fileName: string;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ code, fileName }) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const generatePreview = () => {
    if (fileName.includes('page.tsx')) {
      return `
        <!DOCTYPE html>
        <html lang="en" class="dark">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Next.js Preview</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
            body { font-family: 'Inter', sans-serif; }
          </style>
        </head>
        <body class="bg-black text-white">
          <main class="flex min-h-screen flex-col items-center justify-between p-24">
            <div class="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
              <p class="fixed left-0 top-0 flex w-full justify-center border-b border-gray-700 bg-gradient-to-b from-zinc-800 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-800 lg:p-4">
                Get started by editing&nbsp;
                <code class="font-mono font-bold">app/page.tsx</code>
              </p>
            </div>

            <div class="relative flex place-items-center">
              <h1 class="text-4xl font-bold text-center">
                Welcome to Next.js!
              </h1>
            </div>

            <div class="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left gap-4">
              <a href="#" class="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-600 hover:bg-gray-800">
                <h2 class="mb-3 text-2xl font-semibold">
                  Docs
                  <span class="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </h2>
                <p class="m-0 max-w-[30ch] text-sm opacity-50">
                  Find in-depth information about Next.js features and API.
                </p>
              </a>

              <a href="#" class="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-600 hover:bg-gray-800">
                <h2 class="mb-3 text-2xl font-semibold">
                  Learn
                  <span class="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </h2>
                <p class="m-0 max-w-[30ch] text-sm opacity-50">
                  Learn about Next.js in an interactive course with quizzes!
                </p>
              </a>

              <a href="#" class="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-600 hover:bg-gray-800">
                <h2 class="mb-3 text-2xl font-semibold">
                  Templates
                  <span class="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </h2>
                <p class="m-0 max-w-[30ch] text-sm opacity-50">
                  Explore starter templates for Next.js.
                </p>
              </a>

              <a href="#" class="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-600 hover:bg-gray-800">
                <h2 class="mb-3 text-2xl font-semibold">
                  Deploy
                  <span class="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </h2>
                <p class="m-0 max-w-[30ch] text-sm opacity-50">
                  Instantly deploy your Next.js site to a shareable URL with Vercel.
                </p>
              </a>
            </div>
          </main>
        </body>
        </html>
      `;
    }

    return `
      <!DOCTYPE html>
      <html lang="en" class="dark">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Code Preview</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
          body { font-family: 'Inter', sans-serif; }
        </style>
      </head>
      <body class="bg-gray-900 text-white p-8">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-2xl font-bold mb-4">Code Preview</h1>
          <div class="bg-gray-800 rounded-lg p-4 mb-4">
            <p class="text-gray-300">File: <span class="text-blue-400">${fileName}</span></p>
          </div>
          <div class="bg-gray-800 rounded-lg p-4">
            <pre class="text-sm text-gray-300 overflow-auto"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm text-gray-300">Preview</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-1 hover:bg-gray-700 rounded transition-colors">
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        <iframe
          srcDoc={generatePreview()}
          className="w-full h-full border-0"
          title="Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

export default PreviewPane;
