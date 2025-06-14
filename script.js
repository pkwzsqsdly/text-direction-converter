document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const charsPerRowInput = document.getElementById('charsPerRow');
    const copyBtn = document.getElementById('copyBtn');
    
    // 复制功能(添加说明文字)
    copyBtn.addEventListener('click', async function(e) {
        const textToCopy = outputText.textContent;
        if (!textToCopy) return;

        const prefix = "⬇️⬇️⬇️从左到右竖向观看⬇️⬇️⬇️(文字方向转换器)\n\n";
        const fullText = prefix + textToCopy;

        try {
            // 创建临时textarea元素
            const textarea = document.createElement('textarea');
            textarea.value = fullText;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            
            // 移动端需要先聚焦再选择
            textarea.focus();
            textarea.select();
            
            // 尝试复制
            let success = false;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                try {
                    await navigator.clipboard.writeText(fullText);
                    success = true;
                } catch (err) {
                    console.log('Clipboard API失败，尝试备用方法');
                }
            }
            
            if (!success) {
                // 备用方法
                const range = document.createRange();
                range.selectNode(textarea);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                
                success = document.execCommand('copy');
                window.getSelection().removeAllRanges();
            }
            
            // 移除临时元素
            document.body.removeChild(textarea);
            
            if (success) {
                // 更新UI反馈
                copyBtn.textContent = '已复制!';
                setTimeout(() => {
                    copyBtn.textContent = '复制';
                }, 2000);
            } else {
                throw new Error('两种复制方法都失败了');
            }
            
        } catch (err) {
            console.error('复制失败:', err);
            // 提供手动复制选项
            outputText.focus();
            outputText.select();
            alert('自动复制失败，请长按选择文本后手动复制:\n\n' + fullText);
        }
        
        // 阻止事件冒泡
        e.stopPropagation();
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
