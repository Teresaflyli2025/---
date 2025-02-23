document.getElementById('download').addEventListener('click', function() {
    const scroll = document.getElementById('scroll');
    const bgPattern = document.getElementById('bg-pattern').value;
    scroll.style.backgroundImage = `url('path/to/${bgPattern}.jpg')`;

    // 临时设置字体方向为水平，以便截图正确
    const blessingOutput = document.getElementById('blessing-output');
    blessingOutput.style.writingMode = 'horizontal-tb';

    html2canvas(scroll, {useCORS: true}).then(canvas => {
        const link = document.createElement('a');
        link.download = 'scroll_design.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // 恢复字体方向
        blessingOutput.style.writingMode = 'vertical-rl';
    });
});

document.getElementById('clear-blessing').addEventListener('click', function() {
    document.getElementById('blessing').value = '';
    updateBlessing();
});

document.getElementById('clear-seal').addEventListener('click', function() {
    document.getElementById('seal-1').value = '';
    document.getElementById('seal-2').value = '';
    updateSeals();
});

document.getElementById('blessing').addEventListener('input', updateBlessing);
document.getElementById('blessing-font').addEventListener('change', updateBlessing);
document.getElementById('blessing-size').addEventListener('change', updateBlessing);

document.getElementById('seal-1').addEventListener('input', updateSeals);
document.getElementById('seal-2').addEventListener('input', updateSeals);
document.getElementById('seal-shape').addEventListener('change', updateSeals);

function updateBlessing() {
    const blessingOutput = document.getElementById('blessing-output');
    const blessingText = document.getElementById('blessing').value;
    blessingOutput.textContent = blessingText;
    blessingOutput.style.fontFamily = document.getElementById('blessing-font').value;
    blessingOutput.style.fontSize = `${document.getElementById('blessing-size').value}px`;
}

function createSeal(text, shape) {
    const seal = document.createElement('div');
    seal.className = `seal-output ${shape}`;
    seal.textContent = text;

    // 允许拖动
    let offsetX, offsetY;
    seal.addEventListener('mousedown', function(e) {
        offsetX = e.clientX - seal.offsetLeft;
        offsetY = e.clientY - seal.offsetTop;
        seal.style.cursor = 'grabbing';
    });

    seal.addEventListener('mousemove', function(e) {
        if (seal.style.cursor === 'grabbing') {
            const scroll = document.getElementById('scroll');
            const scrollWidth = scroll.clientWidth;
            const scrollHeight = scroll.clientHeight;
            const sealWidth = seal.offsetWidth;
            const sealHeight = seal.offsetHeight;

            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            // 边界检查
            if (newLeft < 10) newLeft = 10;
            if (newTop <10) newTop =10;
            if (newLeft + sealWidth > scrollWidth) newLeft = scrollWidth - sealWidth;
            if (newTop + sealHeight > scrollHeight) newTop = scrollHeight - sealHeight;

            seal.style.left = `${newLeft}px`;
            seal.style.top = `${newTop}px`;
        }
    });

    seal.addEventListener('mouseup', function() {
        seal.style.cursor = 'grab';
    });

    return seal;
}

function updateSeals() {
    const sealContainer = document.getElementById('seal-container');
    sealContainer.innerHTML = ''; // 清空现有印章

    const shape = document.getElementById('seal-shape').value;
    const seal1Text = document.getElementById('seal-1').value;
    const seal2Text = document.getElementById('seal-2').value;

    if (seal1Text) {
        const seal1 = createSeal(seal1Text, shape);
        sealContainer.appendChild(seal1);
    }

    if (seal2Text) {
        const seal2 = createSeal(seal2Text, shape);
        sealContainer.appendChild(seal2);
    }
}

// 初始化显示
updateBlessing();
updateSeals();