document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const charsPerRowInput = document.getElementById('charsPerRow');
    
    function formatText() {
        const text = inputText.value.replace(/\n|\r/g, '');
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
