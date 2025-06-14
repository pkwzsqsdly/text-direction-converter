document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const charsPerRowInput = document.getElementById('charsPerRow');
    const copyBtn = document.getElementById('copyBtn');
    
    // 复制功能(添加说明文字)
    copyBtn.addEventListener('click', async function() {
        const textToCopy = outputText.textContent;
        if (!textToCopy) return;

        const prefix = "⬇️⬇️⬇️从左到右竖向观看⬇️⬇️⬇️(文字方向转换器)\n\n";
        const fullText = prefix + textToCopy;

        try {
            // 尝试使用现代Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(fullText);
            } else {
                // 备用方法：使用document.execCommand
                const textarea = document.createElement('textarea');
                textarea.value = fullText;
                textarea.style.position = 'fixed';  // 防止滚动
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            
            // 更新UI反馈
            copyBtn.textContent = '已复制!';
            setTimeout(() => {
                copyBtn.textContent = '复制';
            }, 2000);
            
        } catch (err) {
            console.error('复制失败:', err);
            // 提供手动复制选项
            outputText.select();
            alert('自动复制失败，请手动复制文本:\n\n' + fullText);
        }
    });
    
    function formatText() {
        const text = inputText.value.replace(/\r\n|\n|\r/g, '');
        const columnHeight = parseInt(charsPerRowInput.value) || null;
        
        outputText.innerHTML = '';
        
        if (!text) return;
        
        const textLength = text.length;
        if (textLength === 0) return;
        
        // 自动计算合适的列高度
        const height = columnHeight || Math.max(1, Math.floor(Math.sqrt(textLength)));
        
        // 计算需要的列数
        const numColumns = Math.ceil(textLength / height);
        
        // 创建结果数组
        const resultMatrix = Array.from({length: height}, () => Array(numColumns).fill(' '));
        
        // 填充矩阵(列优先顺序)
        for (let col = 0; col < numColumns; col++) {
            for (let row = 0; row < height; row++) {
                const index = col * height + row;
                if (index < textLength) {
                    resultMatrix[row][col] = text[index];
                }
            }
        }
        
        // 将矩阵转换为字符串
        const result = resultMatrix.map(row => row.join(' ')).join('\n');
        outputText.textContent = result;
    }
    
    // 监听输入变化
    inputText.addEventListener('input', formatText);
    charsPerRowInput.addEventListener('change', formatText);
    
    // 初始加载时触发一次转换
    formatText();
});
